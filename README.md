# ecu-codekit

Better code in your Obsidian notes: paste code and it lands in the right code block,
run commands straight from a note, edit code files with highlighting and preview HTML
side by side.

![Pasting commands turns them into a code block that runs in the terminal](docs/paste-run.gif)

## Features

- **Paste detection**: paste a snippet and it is wrapped in a fenced code block with the
  right language (bash, Go, Python, YAML, JSON, SQL, Dockerfile, HTML and 20+ more).
  A small notice lets you change the language or keep it as plain text.
  `Cmd/Ctrl+Shift+V` pastes without detection.
- **Code block buttons** on every block: copy, run in terminal (shell blocks),
  change language, save as file.
- **Run in terminal** (needs [ecu-terminal](https://github.com/erencanucarr/ecu-terminal)):
  sends a block or the current line to the terminal (give "Run line / selection in terminal"
  a hotkey such as `Cmd/Ctrl+Shift+Enter` under Settings > Hotkeys). Prompts like
  `user@host $` and command output are stripped first. `<placeholders>` are filled in a
  small form, and risky commands (`rm -rf`, `reboot`, `kubectl delete`, `git push --force`,
  `curl … | sh`, `DROP TABLE`, `terraform destroy`, …) ask before running. Blocks with no
  language tag always ask too.
- **Code files**: `.sh .go .py .yaml .json .sql .conf .log` and more open in a CodeMirror
  editor with highlighting, search, a read-only lock and a "run this script" button.
- **HTML preview**: right-click an `.html` file and choose **Preview** or
  **Preview beside**. The preview reloads when the file changes and runs in a sandboxed
  frame with no access to Obsidian. It can show images and styles from the page's own
  folder but can't read your other vault files. JavaScript is off by default and can be
  switched on per preview; network access is a separate setting, also off by default.
- **Save a block as a file** into a folder of your choice, with a link back in the note.

![Code blocks with copy, run, language and save buttons](docs/code-blocks.png)

![Running a block with placeholders](docs/run-modal.png)

![Code file and HTML preview side by side](docs/code-file-preview.png)

## Install

Desktop only (macOS, Windows, Linux).

1. From the [latest release](https://github.com/erencanucarr/ecu-codekit/releases/latest),
   download `main.js`, `manifest.json` and `styles.css` into
   `<your vault>/.obsidian/plugins/ecu-codekit/`.
2. In Obsidian, open **Settings > Community plugins**, turn off Restricted mode if needed,
   and enable **ecu-codekit**.
3. Optional: install [ecu-terminal](https://github.com/erencanucarr/ecu-terminal) to run
   commands from notes.

The plugin itself makes no network requests. An HTML file you preview can load resources
from the internet only if you turn on **Allow network in HTML preview**.

## Commands

All of these are in the command palette and in the right-click menu of a code block:
paste as code, wrap selection in a code block, change language, copy block, save block as
file, unwrap block, run line / block in terminal, new code file, insert a code file into a
note, preview HTML beside, toggle paste detection.

## Language

The interface is available in English and Turkish. By default it follows Obsidian's
language; you can pick one under **Settings > ecu-codekit > Language**.

## License

MIT, see [LICENSE](LICENSE).
