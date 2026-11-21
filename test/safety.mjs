import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import assert from "node:assert/strict";

const require = createRequire(import.meta.url);
const Module = require("node:module");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mainPath = path.join(root, "main.js");

function fakeEl() {
  const store = { text: "", value: "" };
  const fn = () => proxy;
  const proxy = new Proxy(fn, {
    get(target, key) {
      if (key === "then" || key === Symbol.toPrimitive || key === Symbol.iterator) return undefined;
      if (key in store) return store[key];
      return (...args) => {
        if (key === "setText") store.text = String(args[0]);
        return fakeEl();
      };
    },
    set(target, key, value) {
      store[key] = value;
      return true;
    },
    apply() {
      return fakeEl();
    },
  });
  return proxy;
}

const notices = [];
const opened = [];

class Base {
  constructor(app) {
    this.app = app;
    this.scope = { register() {} };
    this.contentEl = fakeEl();
    this.titleEl = fakeEl();
    this.modalEl = fakeEl();
  }
  open() {
    opened.push(this);
    if (typeof this.onOpen === "function") this.onOpen();
  }
  close() {}
  setPlaceholder() {}
  setInstructions() {}
}

class Setting {
  constructor(el) {
    this.el = el;
  }
  setName() {
    return this;
  }
  setDesc() {
    return this;
  }
  setHeading() {
    return this;
  }
  addText(cb) {
    const c = {
      inputEl: fakeEl(),
      setValue() {
        return c;
      },
      setPlaceholder() {
        return c;
      },
      onChange() {
        return c;
      },
    };
    cb(c);
    return this;
  }
  addDropdown(cb) {
    const d = {
      addOption() {
        return d;
      },
      setValue() {
        return d;
      },
      onChange() {
        return d;
      },
    };
    cb(d);
    return this;
  }
  addButton(cb) {
    const b = {
      setButtonText() {
        return b;
      },
      setCta() {
        return b;
      },
      onClick() {
        return b;
      },
    };
    cb(b);
    return this;
  }
}

const obsidian = {
  Plugin: Base,
  PluginSettingTab: Base,
  Modal: Base,
  SuggestModal: Base,
  FuzzySuggestModal: Base,
  TextFileView: Base,
  ItemView: Base,
  Component: Base,
  MarkdownRenderer: {},
  MarkdownView: Base,
  TFile: Base,
  Scope: Base,
  Setting,
  Notice: class {
    constructor(m) {
      notices.push(m);
    }
  },
  normalizePath: (p) => p.replace(/\/+/g, "/").replace(/^\/|\/$/g, ""),
  setIcon() {},
  moment: { locale: () => "en" },
};

globalThis.window = globalThis.window || { require };
const origLoad = Module._load;
Module._load = function (req, ...rest) {
  if (req === "obsidian") return obsidian;
  return origLoad.call(this, req, ...rest);
};

const src = readFileSync(mainPath, "utf8") + "\nmodule.exports.__test = { NewFileModal, RunModal, t };\n";
const mod = new Module(mainPath, null);
mod.filename = mainPath;
mod.paths = Module._nodeModulePaths(root);
mod._compile(src, mainPath);
const Plugin = mod.exports;
const { cleanCommands, parseCommands, findPlaceholders, findDangers, isShellLang } = Plugin._internals;
const { NewFileModal, RunModal, t } = Plugin.__test;

let pass = 0;
const failures = [];
async function check(name, fn) {
  try {
    await fn();
    pass++;
  } catch (e) {
    failures.push(`${name}: ${e && e.message ? e.message : e}`);
  }
}

const risky = [
  "sudo rm -rf /",
  "rm -fr /tmp/x",
  "rm -r -f ~/",
  "/bin/rm -rf /",
  "\\rm -rf build",
  "echo ok && rm -rf build",
  "ls; rm -rf ~",
  "mkfs.ext4 /dev/sdb1",
  "mkfs -t xfs /dev/sdb",
  "shutdown -h now",
  "sudo reboot",
  "chmod 777 -R /var",
  "chmod -R 777 /",
  "cat /dev/urandom > /dev/sda",
  "kubectl delete ns prod",
  "kubectl -n prod delete deploy web",
  "kubectl --context prod delete pod x",
  "k delete ns prod",
  "k drain node-1 --ignore-daemonsets",
  "kubectl cordon node-1",
  "kubectl get pods -o name | xargs kubectl delete",
  "curl -fsSL https://x.sh | sh",
  "curl https://x | sudo bash",
  "wget -qO- https://x | bash",
  "bash <(curl -s https://x)",
  'sh -c "$(curl -fsSL https://x/install.sh)"',
  ":(){ :|:& };:",
  "git push --force",
  "git push -f origin main",
  "git push --force-with-lease",
  "git push origin +main",
  "git reset --hard HEAD~3",
  "git clean -fdx",
  "DROP TABLE users;",
  "drop database prod;",
  "DROP SCHEMA public CASCADE;",
  "TRUNCATE TABLE logs;",
  "psql -c 'DROP DATABASE prod'",
  "mysql -e 'truncate table logs'",
  "dd if=/dev/zero of=/dev/sda bs=1M",
  "dd of=/dev/sda if=img.iso",
  "sudo dd bs=4M of=/dev/disk2 if=x.img",
  "echo x > /dev/disk2",
  "cat img > /dev/rdisk3",
  "diskutil eraseDisk APFS X disk2",
  "diskutil eraseVolume JHFS+ X /Volumes/USB",
  "terraform destroy -auto-approve",
  "terraform apply -destroy",
  "docker compose down -v",
  "docker-compose down --volumes",
  "docker system prune -a",
  "docker volume rm data",
  "docker rm -f $(docker ps -aq)",
  "gcloud projects delete p",
  "gcloud compute instances delete vm-1 --zone x",
  "aws ec2 terminate-instances --instance-ids i-1",
  "aws s3 rm s3://bucket --recursive",
  "aws dynamodb delete-table --table-name t",
  "find . -name '*.log' -delete",
  "find / -exec rm {} \\;",
  "shred -u secret.txt",
  "crontab -r",
  "truncate -s 0 /var/log/syslog",
  "kill -9 -1",
  "kill -KILL 123",
  "kill -s KILL 123",
  "kill -9 1",
  "pkill -9 node",
  "ufw disable",
  "iptables -F",
  "mv ~/important /dev/null",
  "chown -R nobody /",
  "helm uninstall web",
  "> /etc/passwd",
];

const harmless = [
  "kubectl get pods",
  "kubectl -n prod get deploy web",
  "kubectl logs delete-job-123",
  "k get ns",
  "git push",
  "git push -u origin main",
  "git push --follow-tags",
  "git status",
  "git reset --soft HEAD~1",
  "git clean -n",
  "ls -la",
  "echo hello",
  "curl -s https://x | jq .",
  "curl -sL https://x | shasum -a 256",
  "docker compose down",
  "docker ps -a",
  "terraform plan",
  "aws s3 ls s3://bucket",
  "gcloud compute instances list",
  "find . -name '*.log'",
  "crontab -l",
  "kill -1 1234",
  "kill 1234",
  "mv a.txt b.txt",
  "mv a b > /dev/null",
  "ls 2>/dev/null",
  "echo x >> /etc/hosts.bak.local",
  "chmod +x run.sh",
  "chmod -R 755 ./dist",
  "brew update",
  "select * from users;",
  "dd --help",
  "npm run build",
];

for (const c of risky) await check(`risky ${JSON.stringify(c)}`, () => assert.ok(findDangers(c).length > 0, "not flagged"));
for (const c of harmless) await check(`harmless ${JSON.stringify(c)}`, () => assert.deepEqual(findDangers(c), []));

await check("plain rm of a file still warns (unchanged behavior)", () => assert.ok(findDangers("rm file.txt").length > 0));
await check("labels are informative", () => {
  assert.ok(findDangers("git push --force").some((d) => /force push/.test(d)));
  assert.ok(findDangers("curl -fsSL https://x.sh | sh").some((d) => /curl \| sh/.test(d)));
  assert.ok(findDangers("DROP TABLE x").some((d) => /DROP/.test(d)));
  assert.ok(findDangers("terraform destroy").some((d) => /terraform destroy/.test(d)));
  for (const d of findDangers("rm -rf / ; git push -f ; DROP TABLE x ; crontab -r ; kill -9 -1 ; shred x ; :(){ :|:& };:"))
    assert.ok(!/^danger\./.test(d), "missing string for " + d);
});

const placeholders = [
  ["ssh <user>@<host>", ["<user>", "<host>"]],
  ["kubectl logs <pod-name> -n <namespace>", ["<pod-name>", "<namespace>"]],
  ["ping <IP>", ["<IP>"]],
  ["git checkout <branch name>", ["<branch name>"]],
  ["cp <source> <dest>", ["<source>", "<dest>"]],
  ["gh pr create --title <title>", ["<title>"]],
  ["diff <a> <b>", ["<a>", "<b>"]],
  ["echo '<html>' > x.html", []],
  ["<div>", []],
  ["echo \"<span>hi</span>\" >> page.html", []],
  ["printf '%s\\n' '<title>x</title>'", []],
  ["cat <<EOF > x.html\n<html>\n<body>\n</body>\n</html>\nEOF", []],
  ["echo <<EOF", []],
  ["diff <(ls a) <(ls b)", []],
  ["curl -H 'Accept: <type>' x", []],
  ["echo it's <name>", ["<name>"]],
];
for (const [c, want] of placeholders)
  await check(`placeholders ${JSON.stringify(c)}`, () => assert.deepEqual(findPlaceholders(c), want));

const prompts = [
  ["user@host:~$ ls -la", "ls -la"],
  ["root@web01:/etc# rm -rf /tmp/x", "rm -rf /tmp/x"],
  ["[root@db01 ~]# systemctl stop postgresql", "systemctl stop postgresql"],
  ["$ echo hi", "echo hi"],
  ["# rm -rf /", "# rm -rf /"],
  ["jane@MacBook-Pro ~ % brew update", "brew update"],
  ["% ls -la", "ls -la"],
  ["➜  ~ git status", "git status"],
  ["➜  myapp git:(main) ✗ git status", "git status"],
  ["(venv) user@host:~/app$ python app.py", "python app.py"],
  ["(base) jane@MacBook-Pro ~ % conda list", "conda list"],
  ["bash-3.2$ ls", "ls"],
  ["sh-5.2$ ls", "ls"],
  ["PS C:\\> Get-ChildItem", "Get-ChildItem"],
  ["PS C:\\Users\\me> dir", "dir"],
  ["root@host:~#rm -rf /x", "rm -rf /x"],
  ["user@host:~$ echo $HOME # comment", "echo $HOME # comment"],
  ["echo $HOME", "echo $HOME"],
  ["git clone git@github.com:org/repo.git", "git clone git@github.com:org/repo.git"],
  ["user@host:~$ ls\nfile1 file2\nuser@host:~$ cat file1\nhello", "ls\ncat file1"],
  ["$ docker run \\\n  -it ubuntu", "docker run \\\n  -it ubuntu"],
  ["ls\n$ pwd", "ls\npwd"],
];
for (const [c, want] of prompts) await check(`prompt ${JSON.stringify(c)}`, () => assert.equal(cleanCommands(c), want));
await check("mixed prompt flag", () => {
  assert.equal(parseCommands("ls\n$ pwd").mixed, true);
  assert.equal(parseCommands("$ curl -s x | jq .\n{\n  \"a\": 1\n}").mixed, true);
  assert.equal(parseCommands("$ ls\n$ pwd").mixed, false);
  assert.equal(parseCommands("ls\npwd").mixed, false);
});

function makePlugin(settings) {
  const p = new Plugin({ workspace: {}, vault: {} }, {});
  p.settings = Object.assign({ confirmRun: false, focusTerminal: false, codeFolder: "" }, settings);
  p.sent = [];
  p.sendToTerminal = (cmd, enter) => p.sent.push([cmd, enter]);
  return p;
}
function lastRunModal(before) {
  const m = opened.slice(before).filter((x) => x instanceof RunModal);
  return m[m.length - 1];
}

await check("safe single line runs directly", () => {
  const p = makePlugin();
  const n = opened.length;
  p.runInTerminal("ls -la");
  assert.deepEqual(p.sent, [["ls -la", true]]);
  assert.equal(lastRunModal(n), undefined);
});
await check("untagged block always confirms", () => {
  const p = makePlugin();
  const n = opened.length;
  p.runInTerminal("ls -la", { untagged: true });
  assert.deepEqual(p.sent, []);
  const m = lastRunModal(n);
  assert.ok(m, "no modal");
  assert.ok(m.opts.notes.includes(t("run.untagged")));
});
await check("untagged chip still shown (shell lang)", () => assert.equal(isShellLang(""), true));
await check("mixed prompt block opens the modal with what will be sent", () => {
  const p = makePlugin();
  const n = opened.length;
  p.runInTerminal("user@host:~$ ls\nfile1 file2");
  assert.deepEqual(p.sent, []);
  const m = lastRunModal(n);
  assert.ok(m, "no modal");
  assert.equal(m.opts.cmd, "ls");
  assert.ok(m.opts.notes.includes(t("run.mixedPrompt")));
});
await check("risky single line opens the modal", () => {
  const p = makePlugin();
  const n = opened.length;
  p.runInTerminal("git push --force");
  assert.deepEqual(p.sent, []);
  assert.ok(lastRunModal(n));
});
await check("HTML in quotes no longer needs filling", () => {
  const p = makePlugin();
  p.runInTerminal("echo '<html>' > x.html");
  assert.deepEqual(p.sent, [["echo '<html>' > x.html", true]]);
});
function docView(lines) {
  return {
    state: {
      doc: {
        lines: lines.length,
        line: (n) => ({ text: lines[n - 1], number: n }),
        lineAt: (pos) => ({ number: pos + 1 }),
      },
    },
  };
}
function lineEditor(lines, cursor) {
  return { lineCount: () => lines.length, getLine: (i) => lines[i], getCursor: () => ({ line: cursor, ch: 0 }), getSelection: () => "" };
}
for (const [fence, untagged] of [["```", true], ["```bash", false]]) {
  await check(`chip run on ${fence} passes untagged=${untagged}`, () => {
    const p = makePlugin();
    const calls = [];
    p.runInTerminal = (code, opts) => calls.push([code, opts]);
    p.chipAction(docView([fence, "ls", "```"]), 0, "run");
    assert.deepEqual(calls, [["ls", { untagged }]]);
  });
  await check(`run line inside ${fence} passes untagged=${untagged}`, () => {
    const p = makePlugin();
    const calls = [];
    p.runInTerminal = (code, opts) => calls.push([code, opts]);
    p.runCursorLine(lineEditor([fence, "ls", "pwd", "```"], 2));
    assert.deepEqual(calls, [["pwd", { untagged }]]);
  });
}
await check("run line outside a block is not marked untagged", () => {
  const p = makePlugin();
  const calls = [];
  p.runInTerminal = (code, opts) => calls.push([code, opts]);
  p.runCursorLine(lineEditor(["ls"], 0));
  assert.deepEqual(calls, [["ls", { untagged: false }]]);
});

await check("NewFileModal.onOpen does not throw", () => {
  const p = makePlugin();
  p.isCodeExt = () => true;
  new NewFileModal(p).open();
});
await check("sendToTerminal without a terminal shows a notice", async () => {
  const p = new Plugin({ workspace: {}, vault: {} }, {});
  p.settings = { focusTerminal: false };
  p.terminalSession = async () => null;
  const n = notices.length;
  await p.sendToTerminal("ls", true);
  assert.equal(notices[n], t("notice.noTerminal"));
});
await check("sendToTerminal writes to the session", async () => {
  const p = new Plugin({ workspace: { setActiveLeaf() {} }, vault: {} }, {});
  p.settings = { focusTerminal: false };
  const written = [];
  p.terminalSession = async () => ({ leaf: {}, session: { pty: { write: (s) => written.push(s) } } });
  await p.sendToTerminal("ls\npwd", true);
  assert.deepEqual(written, ["ls\rpwd\r"]);
});

let clipboardText = "";
Object.defineProperty(globalThis.navigator, "clipboard", {
  configurable: true,
  value: { readText: async () => clipboardText, writeText: async () => {} },
});
const editor = {
  getCursor: () => ({ line: 0, ch: 0 }),
  getLine: () => "",
  replaceSelection(s) {
    this.replaced = s;
  },
};
await check("pasteAsCode with an empty clipboard shows a notice", async () => {
  const p = makePlugin();
  clipboardText = "  ";
  const n = notices.length;
  await p.pasteAsCode(editor);
  assert.equal(notices[n], t("notice.clipboardEmpty"));
});
await check("pasteAsCode with text opens the language picker", async () => {
  const p = makePlugin();
  clipboardText = "echo hi";
  const n = opened.length;
  await p.pasteAsCode(editor);
  assert.ok(opened.length > n);
});
await check("pastePlain inserts the clipboard text", async () => {
  const p = makePlugin();
  clipboardText = "plain";
  await p.pastePlain(editor);
  assert.equal(editor.replaced, "plain");
});

const total = pass + failures.length;
if (failures.length) {
  console.error(`safety: ${failures.length} of ${total} checks failed`);
  for (const f of failures) console.error("  FAIL " + f);
  process.exit(1);
}
console.log(`safety: all ${total} checks passed (${risky.length} risky, ${harmless.length} harmless, ${placeholders.length} placeholder, ${prompts.length} prompt cases)`);
