import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.resolve(root, process.argv[2] || "main.js");
const NAME = "t";

function loadAcorn() {
  try {
    return require("acorn");
  } catch (e) {}
  try {
    return require("internal/deps/acorn/acorn/dist/acorn");
  } catch (e) {}
  return null;
}

const acorn = loadAcorn();
if (!acorn) {
  if (!process.execArgv.includes("--expose-internals")) {
    const r = spawnSync(process.execPath, ["--expose-internals", fileURLToPath(import.meta.url), ...process.argv.slice(2)], { stdio: "inherit" });
    process.exit(r.status === null ? 1 : r.status);
  }
  console.error("check-shadow: acorn is not available (npm i -D acorn)");
  process.exit(2);
}

const src = readFileSync(file, "utf8");
const ast = acorn.parse(src, { ecmaVersion: "latest", sourceType: "script", locations: true, allowHashBang: true });

const hits = [];
let i18n = 0;

function names(pattern, out) {
  if (!pattern) return out;
  switch (pattern.type) {
    case "Identifier":
      out.push(pattern);
      break;
    case "ObjectPattern":
      for (const p of pattern.properties) names(p.type === "RestElement" ? p.argument : p.value, out);
      break;
    case "ArrayPattern":
      for (const el of pattern.elements) names(el, out);
      break;
    case "RestElement":
      names(pattern.argument, out);
      break;
    case "AssignmentPattern":
      names(pattern.left, out);
      break;
  }
  return out;
}

function report(id, kind) {
  if (id && id.name === NAME) hits.push(`${path.relative(root, file)}:${id.loc.start.line}:${id.loc.start.column + 1} ${kind} "${NAME}"`);
}

function visit(node, parent) {
  if (!node || typeof node.type !== "string") return;
  switch (node.type) {
    case "VariableDeclarator":
      for (const id of names(node.id, [])) report(id, "variable");
      break;
    case "FunctionDeclaration":
      if (node.id && node.id.name === NAME && parent && parent.type === "Program" && node.params.length === 2) i18n++;
      else report(node.id, "function");
      for (const p of node.params) for (const id of names(p, [])) report(id, "parameter");
      break;
    case "FunctionExpression":
    case "ArrowFunctionExpression":
      if (node.id) report(node.id, "function");
      for (const p of node.params) for (const id of names(p, [])) report(id, "parameter");
      break;
    case "ClassDeclaration":
    case "ClassExpression":
      report(node.id, "class");
      break;
    case "CatchClause":
      for (const id of names(node.param, [])) report(id, "catch parameter");
      break;
    case "ImportSpecifier":
    case "ImportDefaultSpecifier":
    case "ImportNamespaceSpecifier":
      report(node.local, "import");
      break;
  }
  for (const key of Object.keys(node)) {
    if (key === "loc") continue;
    const v = node[key];
    if (Array.isArray(v)) for (const c of v) visit(c, node);
    else if (v && typeof v === "object" && typeof v.type === "string") visit(v, node);
  }
}

visit(ast, null);

if (i18n !== 1) hits.push(`${path.relative(root, file)}: expected exactly one top-level i18n function ${NAME}(key, vars), found ${i18n}`);
if (hits.length) {
  console.error(`check-shadow: "${NAME}" is reserved for the i18n function`);
  for (const h of hits) console.error("  " + h);
  process.exit(1);
}
console.log(`check-shadow: ok (${path.relative(root, file)})`);
