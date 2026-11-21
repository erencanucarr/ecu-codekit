import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const Module = require("node:module");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

class Base {
  constructor(app) {
    this.app = app;
  }
}
const obsidian = {
  Plugin: Base, PluginSettingTab: Base, Modal: Base, SuggestModal: Base, FuzzySuggestModal: Base, TextFileView: Base, ItemView: Base,
  Component: Base, MarkdownView: Base, TFile: Base, Scope: Base, Setting: Base, Notice: Base, MarkdownRenderer: {},
  normalizePath: (p) => p, setIcon() {}, moment: { locale: () => "en" },
};
globalThis.window = globalThis.window || { require };
const origLoad = Module._load;
Module._load = function (req, ...rest) {
  if (req === "obsidian") return obsidian;
  return origLoad.call(this, req, ...rest);
};
const { detectLanguage } = require(path.join(root, "main.js"));
Module._load = origLoad;

const SENS = { hassas: 4, normal: 6, temkinli: 10 };

const corpus = [
  ["prose EN paragraph", null, `The deployment went smoothly yesterday, but we noticed that the cache warmed up slower than expected. Next week we should look into tuning the eviction policy before the holiday traffic arrives.`],
  ["prose EN 2 paragraphs", null, `I talked to the team about the migration plan.\n\nWe agreed to run the database upgrade on Saturday night, and keep the old cluster around for a week in case something goes wrong.`],
  ["prose TR paragraph", null, `Dün akşam sunucuyu yeniden başlattıktan sonra servisler düzgün açıldı. Yarın sabah loglara tekrar bakıp disk kullanımını kontrol edeceğim, gerekirse eski yedekleri sileriz.`],
  ["prose TR with colon lines", null, `Toplantı notları:\nKatılımcılar: Ali, Ayşe, Mehmet\nKonu: yeni depolama sunucusunun kurulumu ve ağ ayarları\nKarar: kurulum gelecek hafta pazartesi yapılacak`],
  ["prose with 'make' and 'find'", null, `make sure you find the right config before you start, then cat the logs if anything looks off.`],
  ["prose starting with command word", null, `Find a good time for the meeting.\nCat food is running low, buy more on the way home.\nWatch the new episode tonight.`],
  ["prose sentence 'cd' word", null, `cd collection arrived today, need to sort it out.`],
  ["prose: time / date line", null, `time to go home`],
  ["md bullet list", null, `- buy milk and bread from the store\n- call the plumber about the kitchen sink\n- finish the quarterly report draft`],
  ["md numbered list", null, `1. Open the settings page\n2. Click on the advanced tab\n3. Enable the experimental features toggle`],
  ["md table", null, `| Name | Role | Team |\n|------|------|------|\n| Ali | Dev | Core |\n| Ayşe | QA | Web |`],
  ["md headings + text", null, `## Meeting notes for today\n\nWe discussed the roadmap.\n\n## Action items for next week\n\nEveryone reviews the doc.`],
  ["md task list", null, `- [ ] write tests for the parser\n- [x] fix the login bug\n- [ ] update the readme file`],
  ["md key: value list", null, `- Name: Jane Doe\n- City: Springfield\n- Role: Platform engineer`],
  ["md key: value list TR", null, `- Ad: Ayşe Yılmaz\n- Şehir: Eskişehir\n- Rol: Platform mühendisi`],
  ["md links paragraph", null, `See [the docs](https://example.com/docs) and [[Project Notes]] for **more details** on setup.`],
  ["URL", null, `https://github.com/erencanucarr/ecu-codekit/issues?q=is%3Aopen`],
  ["URL with spaces around", null, `  https://example.com/a?b=c&d=e  `],
  ["email address", null, `someone@example.com`],
  ["email signature", null, `Best regards,\nJane Doe\njane@example.com\n+1 555 123 4567`],
  ["single word", null, `kubernetes`],
  ["single word docker", null, `docker`],
  ["file path", null, `/etc/nginx/nginx.conf`],
  ["windows path", null, `C:\\Users\\jane\\Documents\\notes.txt`],
  ["IP:port", null, `10.0.0.12:8443`],
  ["log lines (syslog)", "text|null", `Nov 21 10:15:32 web01 sshd[1234]: Accepted publickey for root from 10.0.0.5 port 52814 ssh2\nNov 21 10:15:33 web01 systemd[1]: Started Session 42 of user root.\nNov 21 10:16:01 web01 CRON[1301]: (root) CMD (run-parts /etc/cron.hourly)`],
  ["log lines (app)", "text|null", `2026-11-21T10:15:32.123Z INFO  [main] Server started on port 8080\n2026-11-21T10:15:33.456Z WARN  [db] Slow query took 1532ms\n2026-11-21T10:15:34.789Z ERROR [api] Request failed: timeout`],
  ["kubectl get pods output", "text|null", `NAME                      READY   STATUS    RESTARTS   AGE\nweb-7d4b9c8f6d-abcde      1/1     Running   0          3d\nworker-5f6c7b8d9-xyz12    0/1     CrashLoopBackOff   12   1h`],
  ["prose about code", null, `The function returns null when the input is empty, so callers should check the result before using it.`],
  ["prose with parentheses", null, `We met at the cafe (the one near the station) and talked for about two hours about the new project.`],
  ["TR prose w/ commands mentioned", null, `Sunucuda önce sudo ile giriş yaptım, sonra servisi yeniden başlattım ve her şey düzeldi.`],
  ["chat transcript", null, `Ali: are you coming tonight?\nAyşe: yes, around eight\nAli: great, see you there`],
  ["address", null, `Atatürk Cad. No: 12 D: 4\nKadıköy / İstanbul\n34710`],
  ["quote", null, `> The best way to predict the future is to invent it.\n> — Alan Kay`],
  ["recipe ingredients", null, `2 cups flour\n1 tsp salt\n3 eggs\n1 cup milk`],
  ["CSV", "text|null", `id,name,email\n1,Ali,ali@example.com\n2,Ayşe,ayse@example.com`],
  ["prose 'Note: ...' lines", null, `Note: the server will be down tonight.\nReason: kernel update and reboot.\nDuration: about thirty minutes.`],
  ["single prose line w/ '='", null, `Price = 20 dollars plus tax`],
  ["math", null, `x = 2y + 3`],

  ["EN: make sure", null, `make sure the backup finished before you leave`],
  ["EN: find me", null, `find me a better title for this note`],
  ["EN: watch out", null, `watch out for the new release next week`],
  ["EN: set the meeting", null, `set the meeting for monday afternoon`],
  ["EN: read the chapter", null, `read the whole chapter before class tomorrow`],
  ["EN: test results", null, `test results look good so far today`],
  ["EN: top priority", null, `top priority is fixing the login page`],
  ["EN: free coffee", null, `free coffee in the kitchen today`],
  ["EN: sort out", null, `sort out the receipts by friday please`],
  ["EN: kill two birds", null, `kill two birds with one stone`],
  ["EN: history of", null, `history of the ottoman empire, chapter three`],
  ["EN: history chapter 3", null, `history of the ottoman empire, chapter 3`],
  ["EN: source:", null, `source: wikipedia article on photosynthesis`],
  ["EN: date night", null, `date night on saturday at the italian place`],
  ["EN: host the meeting", null, `host the meeting next week in the big room`],
  ["EN: cat videos", null, `cat videos are the best thing on the internet`],
  ["EN: type the answer", null, `type the answer into the box below`],
  ["EN: less is more", null, `less is more when it comes to design`],
  ["EN: more details", null, `more details will follow tomorrow morning`],
  ["EN: code review", null, `code review meeting moved to three pm`],
  ["EN: git gud", null, `git gud at the game before the tournament`],
  ["EN: screen time", null, `screen time was way too high this week`],
  ["EN: at the office", null, `at the office until six today`],
  ["EN: at 5 pm", null, `at 5 pm we meet at the office downstairs`],
  ["EN: touch base", null, `touch base with the design team on tuesday`],
  ["EN: help wanted", null, `help wanted for the bake sale`],
  ["EN: exit interview", null, `exit interview scheduled for friday morning`],
  ["EN: env variables", null, `env variables are documented in the wiki`],
  ["EN: go home", null, `go home and get some rest, we can finish this tomorrow`],
  ["EN: for the record", null, `for the record, I think we should wait a little longer`],
  ["EN: done with", null, `done with the report, sending it over now`],
  ["EN: ping me", null, `ping me when the build is green`],
  ["EN: echo sentence", null, `echo chamber effects are real, and they shape what we read.`],
  ["EN multi: make/then", null, `make sure the backup finished\nthen call the vendor about the invoice`],
  ["EN multi: find/sort/send", null, `find the receipts\nsort them by date\nsend them to accounting`],
  ["EN multi: at/at", null, `at the meeting we decided to postpone\nat the end everyone agreed`],
  ["EN multi: time/watch", null, `time flies when you are having fun\nwatch the new episode tonight`],
  ["TR: su içmeyi", null, `su içmeyi unutma, günde iki litre yeterli`],
  ["TR: su içmeyi digits", null, `su içmeyi unutma, günde 2 litre yeterli.`],
  ["TR: at yarışı", null, `at yarışına gidecektik ama yağmur başladı`],
  ["TR: ip atlama", null, `ip atlama yarışması cumartesi günü yapılacak`],
  ["TR: test sonuçları", null, `test sonuçları yarın çıkacak`],
  ["TR: set maçı", null, `set maçı çok çekişmeli geçti`],
  ["TR: alias", null, `alias olarak eski adını kullanıyor`],
  ["TR: host aile", null, `host aile ile tanışma yemeği cuma akşamı`],
  ["TR: az önce", null, `az önce toplantıdan çıktım, birazdan ararım`],
  ["TR: kubectl in prose", null, `kubectl ile podları listeledim ve sonra loglara baktım.`],
  ["TR multi", null, `su faturasını öde\nat binmeye cumartesi gideriz\ntest sınavına çalış`],

  ["single cmd kubectl", "bash", `kubectl get pods -n kube-system -o wide`],
  ["single cmd docker", "bash", `docker run --rm -it -p 8080:80 nginx:alpine`],
  ["single cmd with prompt", "bash", `$ sudo systemctl restart nginx`],
  ["single cmd user@host prompt", "bash", `root@web01:~# journalctl -u nginx --since today`],
  ["single cmd git", "bash", `git log --oneline --graph --all`],
  ["single cmd git push", "bash", `git push origin main`],
  ["single cmd brew", "bash", `brew install ripgrep`],
  ["single cmd pipe", "bash", `ps aux | grep nginx | awk '{print $2}'`],
  ["single cmd unknown tool", "bash", `terraform plan -out=tfplan`],
  ["single cmd jq filter", "bash", `jq '.items[].metadata.name' pods.json`],
  ["single cmd npx", "bash", `npx create-react-app my-app`],
  ["tail -f", "bash", `tail -f /var/log/syslog`],
  ["head -n", "bash", `head -n 20 access.log`],
  ["jq .", "bash", `jq . data.json`],
  ["diff -u", "bash", `diff -u a.txt b.txt`],
  ["man rsync", "bash", `man rsync`],
  ["open -a", "bash", `open -a Safari`],
  ["launchctl list", "bash", `launchctl list`],
  ["diskutil list", "bash", `diskutil list`],
  ["defaults write", "bash", `defaults write com.apple.dock autohide -bool true`],
  ["pbcopy <", "bash", `pbcopy < key.pub`],
  ["nmap", "bash", `nmap -sV 10.0.0.1`],
  ["uv pip", "bash", `uv pip install requests`],
  ["poetry install", "bash", `poetry install`],
  ["bun install", "bash", `bun install`],
  ["deno run", "bash", `deno run main.ts`],
  ["rustup update", "bash", `rustup update`],
  ["kustomize build", "bash", `kustomize build overlays/prod`],
  ["stern", "bash", `stern -n prod web`],
  ["kubectx", "bash", `kubectx prod`],
  ["kubens", "bash", `kubens kube-system`],
  ["tailscale up", "bash", `tailscale up`],
  ["strace", "bash", `strace -p 1234`],
  ["vmstat", "bash", `vmstat 1 5`],
  ["iostat", "bash", `iostat -x 1`],
  ["ulimit", "bash", `ulimit -n 65535`],
  ["seq", "bash", `seq 1 10`],
  ["xxd | head", "bash", `xxd file.bin | head`],
  ["configure", "bash", `./configure --prefix=/usr`],
  ["make -j8", "bash", `make -j8`],
  ["make test", "bash", `make test`],
  ["go build", "bash", `go build ./...`],
  ["go mod tidy", "bash", `go mod tidy`],
  ["python3 -m venv", "bash", `python3 -m venv .venv`],
  ["python script", "bash", `python manage.py migrate`],
  ["pip install -r", "bash", `pip install -r requirements.txt`],
  ["bare ls", "bash", `ls`],
  ["bare pwd", "bash", `pwd`],
  ["bare htop", "bash", `htop`],
  ["npm run dev", "bash", `npm run dev`],
  ["ssh", "bash", `ssh user@10.0.0.5`],
  ["export PATH", "bash", `export PATH=$HOME/bin:$PATH`],
  ["env prefix", "bash", `FOO=bar ./run.sh`],
  ["sudo -i", "bash", `sudo -i`],
  ["echo hello", "bash", `echo hello`],
  ["k get pods", "bash", `k get pods`],
  ["watch kubectl", "bash", `watch -n1 kubectl get pods`],
  ["cd src", "bash", `cd src`],
  ["cat file", "bash", `cat /etc/os-release`],
  ["kill -9", "bash", `kill -9 1234`],
  ["sleep", "bash", `sleep 5`],
  ["date +fmt", "bash", `date +%Y-%m-%d`],
  ["history | grep", "bash", `history | grep ssh`],
  ["free -h", "bash", `free -h`],
  ["ip a", "bash", `ip a`],
  ["apt install", "bash", `apt install nginx`],
  ["time make", "bash", `time make build`],
  ["su -", "bash", `su - postgres`],
  ["curl url", "bash", `curl -fsSL https://example.com/install.sh | sh`],
  ["ping host", "bash", `ping 8.8.8.8`],
  ["htop alt rg", "bash", `rg TODO src`],
  ["fzf", "bash", `fzf --preview 'bat {}'`],
  ["argocd", "bash", `argocd app sync web`],
  ["podman", "bash", `podman ps -a`],
  ["journalctl", "bash", `journalctl -xe`],
  ["multi-line bash", "bash", `#!/usr/bin/env bash\nset -euo pipefail\nfor f in *.log; do\n  gzip "$f"\ndone`],
  ["multi-line bash no shebang", "bash", `cd /opt/app\ngit pull\nnpm ci\nsudo systemctl restart app`],
  ["bash ambiguous lines", "bash", `set -e\ncd src\nmake build\nexit 0`],
  ["bash loose lines", "bash", `cd app\nmake\nsudo make install`],
  ["bash env setup", "bash", `export PATH="$HOME/.local/bin:$PATH"\nsource ~/.bashrc\nalias ll='ls -la'`],
  ["bash if/then", "bash", `if [ -f /etc/os-release ]; then\n  cat /etc/os-release\nelse\n  uname -a\nfi`],
  ["bash with prompts+output", "bash", `$ kubectl get ns\nNAME          STATUS   AGE\ndefault       Active   10d\n$ kubectl get pods\nNo resources found in default namespace.`],
  ["bash heredoc", "bash", `cat <<EOF > /etc/motd\nWelcome to $(hostname)\nEOF\nchmod 644 /etc/motd`],
  ["export lines", "bash", `export AWS_PROFILE=prod\nexport AWS_REGION=eu-west-1`],

  ["ini/.env", "ini", `DATABASE_URL=postgres://u:p@db:5432/app\nREDIS_URL=redis://cache:6379\nDEBUG=false`],
  [".env with comments", "ini", `# database\nDB_HOST=localhost\nDB_PORT=5432\nDB_PASSWORD="s3cret pass"`],
  [".env two lines", "ini", `NODE_ENV=production\nPORT=3000`],
  ["ini sections", "ini", `[server]\nhost = 0.0.0.0\nport = 8080\n\n[log]\nlevel = info`],
  ["TOML", "toml", `[package]\nname = "demo"\nversion = "0.1.0"\n\n[dependencies]\nserde = "1"`],

  ["Go", "go", `package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("hello")\n}`],
  ["Go snippet (no package)", "go", `if err != nil {\n\treturn fmt.Errorf("open: %w", err)\n}\nx := make(map[string]int)`],
  ["Python", "python", `import os\n\ndef main():\n    for name in os.listdir("."):\n        print(name)\n\nif __name__ == "__main__":\n    main()`],
  ["Python snippet", "python", `with open("data.txt") as f:\n    lines = [l.strip() for l in f]\nprint(len(lines))`],
  ["Python class", "python", `class Stack:\n    def __init__(self):\n        self.items = []\n\n    def push(self, x):\n        self.items.append(x)`],
  ["YAML k8s", "yaml", `apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web\nspec:\n  replicas: 2\n  template:\n    spec:\n      containers:\n        - name: web\n          image: nginx:1.27`],
  ["YAML compose", "yaml", `services:\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_PASSWORD: example\n    volumes:\n      - db:/var/lib/postgresql/data`],
  ["YAML gh actions", "yaml", `name: CI\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm test`],
  ["YAML ansible", "yaml", `- name: Install nginx\n  apt:\n    name: nginx\n    state: present\n- name: Start nginx\n  service:\n    name: nginx\n    state: started`],
  ["JSON", "json", `{\n  "name": "ecu",\n  "version": "1.0.0",\n  "scripts": { "test": "node test.js" }\n}`],
  ["JSON array", "json", `[{"id": 1, "ok": true}, {"id": 2, "ok": false}]`],
  ["JSON trailing comma", "json", `{\n  "a": 1,\n  "b": 2,\n}`],
  ["JSON nested trailing commas", "json", `{\n  "list": [1, 2, 3,],\n  "obj": { "x": true, },\n}`],
  ["SQL select", "sql", `SELECT u.id, u.email, count(o.id)\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id\nGROUP BY u.id\nORDER BY 3 DESC;`],
  ["SQL one-liner", "sql", `DROP TABLE IF EXISTS sessions;`],
  ["SQL lowercase", "sql", `select * from pg_stat_activity where state = 'active';`],
  ["Dockerfile", "dockerfile", `FROM node:20-alpine AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nCMD ["node", "server.js"]`],
  ["HTML", "html", `<div class="card">\n  <h2>Title</h2>\n  <p>Some <a href="/x">link</a> text.</p>\n</div>`],
  ["HTML full", "html", `<!DOCTYPE html>\n<html><head><title>x</title></head><body><p>hi</p></body></html>`],
  ["XML", "xml", `<?xml version="1.0"?>\n<config>\n  <item key="a">1</item>\n</config>`],
  ["nginx conf", "nginx", `server {\n    listen 80;\n    server_name example.com;\n    location / {\n        proxy_pass http://127.0.0.1:3000;\n        proxy_set_header Host $host;\n    }\n}`],
  ["PowerShell", "powershell", `Get-ChildItem -Path C:\\Logs -Filter *.log |\n  Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } |\n  Remove-Item -WhatIf`],
  ["PowerShell single", "powershell", `Get-Service | Where-Object Status -eq 'Running'`],
  ["PS prompt", "powershell", `PS C:\\> Get-Process -Name chrome | Stop-Process`],
  ["JavaScript", "javascript", `const res = await fetch(url);\nconst data = await res.json();\nconsole.log(data.items.length);`],
  ["TypeScript", "typescript", `interface User {\n  id: number;\n  name: string;\n}\nexport const greet = (u: User): string => \`hi \${u.name}\`;`],
  ["CSS", "css", `.card {\n  display: flex;\n  padding: 12px;\n  color: var(--text-normal);\n}`],
  ["diff", "diff", `diff --git a/x b/x\n--- a/x\n+++ b/x\n@@ -1,2 +1,2 @@\n-old\n+new`],
  ["Rust", "rust", `fn main() {\n    let mut v = vec![1, 2, 3];\n    v.push(4);\n    println!("{:?}", v);\n}`],
  ["C", "c", `#include <stdio.h>\nint main(void) {\n    printf("hi\\n");\n    return 0;\n}`],
  ["C++", "cpp", `#include <iostream>\nint main() {\n    std::cout << "hi" << std::endl;\n}`],
  ["Java", "java", `public class App {\n    public static void main(String[] args) {\n        System.out.println("hi");\n    }\n}`],
  ["C#", "csharp", `using System;\nclass P {\n    static void Main() {\n        Console.WriteLine("hi");\n    }\n}`],
  ["Ruby", "ruby", `require 'json'\n[1, 2, 3].each do |n|\n  puts n\nend`],
  ["PHP", "php", `<?php\necho $name;\n$this->save();`],
  ["Lua", "lua", `local function greet(name)\n  print("hi " .. name)\nend\nlocal x = 1`],
  ["Makefile", "makefile", `.PHONY: build\nbuild:\n\tgo build -o bin/app ./cmd/app\n\ntest:\n\tgo test ./...`],
];

const traces = [
  ["Java stack trace", `Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.length()"\n\tat com.example.App.run(App.java:42)\n\tat com.example.App.main(App.java:10)`],
  ["Java caused by", `java.lang.IllegalStateException: boom\n\tat com.example.Svc.call(Svc.java:12)\nCaused by: java.io.IOException: closed\n\tat com.example.Io.read(Io.java:7)\n\t... 3 more`],
  ["Java frames only", `\tat org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:897)\n\tat javax.servlet.http.HttpServlet.service(HttpServlet.java:750)`],
  ["Python traceback", `Traceback (most recent call last):\n  File "app.py", line 10, in <module>\n    main()\n  File "app.py", line 6, in main\n    return 1 / 0\nZeroDivisionError: division by zero`],
  ["Go panic", `panic: runtime error: index out of range [3] with length 3\n\ngoroutine 1 [running]:\nmain.main()\n\t/tmp/x/main.go:8 +0x1d\nexit status 2`],
  ["Node stack", `TypeError: Cannot read properties of undefined (reading 'x')\n    at Object.<anonymous> (/app/index.js:5:13)\n    at Module._compile (node:internal/modules/cjs/loader:1256:14)`],
  ["C# stack", `System.NullReferenceException: Object reference not set to an instance of an object.\n   at MyApp.Program.Main(String[] args) in C:\\src\\Program.cs:line 12`],
];

const ok = (exp, got) => (exp === null ? got === null : exp.split("|").some((e) => (e === "null" ? got === null : e === got)));
const fmt = (d) => (d ? `${d.lang}(${d.score})` : "-");
const pad = (s, n) => String(s).padEnd(n);

let fail = 0;
console.log(`${pad("", 4)} ${pad("input", 32)} ${pad("expected", 12)} ${pad("hassas", 16)} ${pad("normal", 16)} temkinli`);
for (const [name, exp, text] of corpus) {
  const r = Object.fromEntries(Object.entries(SENS).map(([k, s]) => [k, detectLanguage(text, { minScore: s })]));
  const good = ok(exp, r.normal ? r.normal.lang : null);
  if (!good) fail++;
  console.log(`${good ? "ok  " : "FAIL"} ${pad(name, 32)} ${pad(exp === null ? "plain" : exp, 12)} ${pad(fmt(r.hassas), 16)} ${pad(fmt(r.normal), 16)} ${fmt(r.temkinli)}`);
}
for (const [name, text] of traces) {
  const got = [1, ...Object.values(SENS)].map((s) => detectLanguage(text, { minScore: s }));
  const good = got.every((d) => d === null);
  if (!good) fail++;
  console.log(`${good ? "ok  " : "FAIL"} ${pad(name, 32)} ${pad("plain*", 12)} ${got.map(fmt).join("  ")}`);
}
const slow = [
  ["function + spaces", "function" + " ".repeat(20000) + "x"],
  ["import + tabs", "import" + "\t".repeat(20000) + "x"],
  ["case + tabs", "case a" + "\t".repeat(20000) + "x"],
  ["repeated ambiguous words", "kill ".repeat(10000)],
];
for (const [name, text] of slow) {
  const start = Date.now();
  detectLanguage(text, { minScore: 1 });
  const ms = Date.now() - start;
  const good = ms < 500;
  if (!good) fail++;
  console.log(`${good ? "ok  " : "FAIL"} ${pad(name, 32)} ${pad("fast", 12)} ${ms}ms`);
}
const total = corpus.length + traces.length + slow.length;
console.log(`\n${total - fail}/${total} passed (${corpus.length} inputs at normal, ${traces.length} stack traces at every sensitivity, ${slow.length} slow-path inputs)`);
process.exit(fail ? 1 : 0);
