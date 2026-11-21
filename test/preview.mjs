import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const Module = require("module");
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

let lang = "en";
const notices = [];
class Base {
  constructor(app) {
    this.app = app;
    this.scope = { register() {} };
  }
}
class Plugin extends Base {
  async loadData() {
    return this.stored;
  }
  async saveData(d) {
    this.stored = d;
  }
  registerView() {}
  registerEvent() {}
  registerDomEvent(win, type) {
    (this.domEvents = this.domEvents || []).push([win, type]);
  }
  registerEditorExtension() {}
  registerMarkdownPostProcessor() {}
  registerExtensions() {}
  addCommand() {}
  addSettingTab() {}
}
const obsidian = {
  Plugin,
  PluginSettingTab: Base,
  Setting: Base,
  Notice: class {
    constructor(m) {
      notices.push(m);
    }
  },
  Modal: Base,
  SuggestModal: Base,
  FuzzySuggestModal: Base,
  TextFileView: Base,
  ItemView: Base,
  MarkdownView: Base,
  TFile: Base,
  Scope: Base,
  normalizePath: (p) => p.replace(/\\/g, "/").replace(/\/+/g, "/").replace(/^\/|\/$/g, ""),
  setIcon() {},
  getLanguage: () => lang,
  moment: { locale: () => lang },
};
const origLoad = Module._load;
Module._load = function (req, ...rest) {
  if (req === "obsidian") return obsidian;
  return origLoad.call(this, req, ...rest);
};
globalThis.window = globalThis;
const Codekit = require(path.join(root, "main.js"));
const { defaultCodeFolder, targetPath, previewCsp, previewDoc, dedent } = Codekit._internals;

let failed = 0;
async function test(name, fn) {
  try {
    await fn();
    console.log("ok   " + name);
  } catch (e) {
    failed++;
    console.log("FAIL " + name + "\n     " + (e && e.message));
  }
}

const URL_ = "app://abc123/Users/me/My%20Vault/Web/page.html?1700000000";
const DIR = "app://abc123/Users/me/My%20Vault/Web/";
const cspOf = (doc) => {
  const m = /<meta http-equiv="Content-Security-Policy" content="([^"]*)">/.exec(doc);
  assert.ok(m, "srcdoc has a CSP meta");
  return m[1].replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&amp;/g, "&");
};
const directive = (csp, name) => {
  const d = csp.split(";").map((s) => s.trim()).find((s) => s.split(" ")[0] === name);
  return d === undefined ? null : d.split(" ").slice(1);
};

await test("srcdoc carries a CSP before any page content", () => {
  const doc = previewDoc("<!DOCTYPE html><html><head><script src='a.js'></script></head><body><img src='x.png'></body></html>", URL_, false, false);
  assert.ok(doc.startsWith("<!DOCTYPE html><meta charset=\"utf-8\"><meta http-equiv=\"Content-Security-Policy\""));
  assert.ok(doc.indexOf("Content-Security-Policy") < doc.indexOf("<script"));
  assert.ok(doc.includes(`<base href="${DIR}">`));
});

await test("no base element when the page has no relative links", () => {
  const doc = previewDoc("<a href='#top'>top</a><img src='https://x/y.png'>", URL_, false, false);
  assert.ok(!doc.includes("<base"));
  assert.ok(doc.includes("Content-Security-Policy"));
});

await test("scripts off, network off: no script-src, no connect, folder-only resources", () => {
  const csp = cspOf(previewDoc("<p>hi</p>", URL_, false, false));
  assert.deepEqual(directive(csp, "default-src"), ["'none'"]);
  assert.equal(directive(csp, "script-src"), null);
  assert.deepEqual(directive(csp, "connect-src"), ["'none'"]);
  assert.deepEqual(directive(csp, "frame-src"), ["'none'"]);
  assert.deepEqual(directive(csp, "form-action"), ["'none'"]);
  for (const d of ["img-src", "style-src", "font-src", "media-src"]) {
    const v = directive(csp, d);
    assert.ok(v.includes(DIR), d + " allows the file's folder");
    assert.ok(!v.some((s) => /^(https?|wss?):$|^\*$|^app:$/.test(s)), d + " has no network or whole-vault source");
  }
});

await test("scripts on, network off: scripts from the folder, still no connect", () => {
  const csp = previewCsp(DIR, true, false);
  assert.deepEqual(directive(csp, "script-src"), [DIR, "'unsafe-inline'", "'unsafe-eval'"]);
  assert.deepEqual(directive(csp, "connect-src"), ["'none'"]);
});

await test("scripts on, network on: connect allowed", () => {
  const csp = previewCsp(DIR, true, true);
  assert.ok(directive(csp, "connect-src").includes("https:"));
  assert.ok(directive(csp, "img-src").includes("https:"));
});

await test("scripts off, network on: still no connect-src or script-src", () => {
  const csp = previewCsp(DIR, false, true);
  assert.deepEqual(directive(csp, "connect-src"), ["'none'"]);
  assert.equal(directive(csp, "script-src"), null);
});

await test("folder path is escaped for the CSP and the base attribute", () => {
  const doc = previewDoc("<img src='x.png'>", 'app://h/a;b,c "d/p.html', false, false);
  const csp = cspOf(doc);
  assert.ok(directive(csp, "img-src").includes("app://h/a%3Bb%2Cc%20%22d/"));
  assert.ok(doc.includes('<base href="app://h/a;b,c &quot;d/">'));
});

await test("default code folder follows the UI language", () => {
  assert.equal(defaultCodeFolder("en"), "Code");
  assert.equal(defaultCodeFolder("tr"), "Kodlar");
});

const app = {
  workspace: { onLayoutReady() {}, on: () => ({}), getLeavesOfType: () => [], iterateAllLeaves() {} },
  vault: { getAbstractFileByPath: () => null },
};
async function loadWith(stored, uiLang) {
  lang = uiLang;
  const p = new Codekit(app);
  p.stored = stored;
  await p.onload();
  return p;
}

await test("fresh install picks the folder by language", async () => {
  assert.equal((await loadWith(undefined, "en")).settings.codeFolder, "Code");
  assert.equal((await loadWith(undefined, "tr")).settings.codeFolder, "Kodlar");
  assert.equal((await loadWith({ notify: true }, "tr")).settings.codeFolder, "Kodlar");
});

await test("saved code folder is kept, including empty", async () => {
  assert.equal((await loadWith({ codeFolder: "Kodlar" }, "en")).settings.codeFolder, "Kodlar");
  assert.equal((await loadWith({ codeFolder: "" }, "en")).settings.codeFolder, "");
  assert.equal((await loadWith({ codeFolder: "Snippets" }, "tr")).settings.codeFolder, "Snippets");
});

await test("new defaults: scripts and network off in preview", async () => {
  const p = await loadWith(undefined, "en");
  assert.equal(p.settings.previewScripts, false);
  assert.equal(p.settings.previewNetwork, false);
  assert.equal((await loadWith({ previewScripts: true }, "en")).settings.previewScripts, true);
});

await test("plain-paste key listener is registered for popout windows", async () => {
  const handlers = {};
  const a = Object.assign({}, app, { workspace: Object.assign({}, app.workspace, { on: (ev, cb) => ((handlers[ev] = cb), {}) }) });
  lang = "en";
  const p = new Codekit(a);
  await p.onload();
  const popout = {};
  handlers["window-open"]({}, popout);
  handlers["window-open"]({}, popout);
  assert.equal(p.domEvents.filter(([w, ty]) => w === popout && ty === "keydown").length, 1);
  assert.equal(p.domEvents.filter(([w, ty]) => w === globalThis && ty === "keydown").length, 1);
});

await test("path validation rejects escapes", () => {
  for (const [folder, name] of [
    ["", "../x"],
    ["", "/etc/x"],
    ["", "C:\\x"],
    ["", "a/../../x"],
    ["", "..\\x"],
    ["../..", "a.sh"],
    ["/etc", "a.sh"],
    ["C:", "a.sh"],
    ["D:\\tmp", "a.sh"],
    ["Code/..", "a.sh"],
  ]) {
    assert.equal(targetPath(folder, name, "bash").error, "bad", JSON.stringify([folder, name]));
  }
});

await test("path validation accepts subfolders inside the vault", () => {
  assert.deepEqual(targetPath("", "Scripts/k8s/a.sh", "bash"), { path: "Scripts/k8s/a.sh" });
  assert.deepEqual(targetPath("Code", "Scripts/k8s/a.sh", "bash"), { path: "Code/Scripts/k8s/a.sh" });
  assert.deepEqual(targetPath("Code/ops", "deploy", "bash"), { path: "Code/ops/deploy.sh" });
  assert.deepEqual(targetPath("", "we?ird*.sh", "bash"), { path: "we-ird-.sh" });
  assert.deepEqual(targetPath("", ".env", "ini"), { path: ".env" });
  assert.equal(targetPath("Code", "  ", "bash").error, "empty");
});

await test("dedent keeps trailing spaces inside lines", () => {
  assert.equal(dedent("    a  \n      b\t\n    c"), "a  \n  b\t\nc");
  assert.equal(dedent("x  \ny"), "x  \ny");
  assert.equal(dedent("\n\n  a\n  b\n\n"), "a\nb");
});

Module._load = origLoad;
if (failed) {
  console.log(`\n${failed} failed`);
  process.exit(1);
}
console.log("\nall passed");
