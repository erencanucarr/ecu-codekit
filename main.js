const {
  Plugin,
  PluginSettingTab,
  Setting,
  Notice,
  Modal,
  SuggestModal,
  FuzzySuggestModal,
  TextFileView,
  ItemView,
  MarkdownView,
  TFile,
  normalizePath,
  setIcon,
  Scope,
} = require("obsidian");

const STRINGS = {
  en: {
    "lang.text": "Plain text",
    "lang.none": "No language",
    "langModal.placeholder": "Pick or type a language (go, bash, yaml…)",
    "langModal.select": "select",
    "langModal.apply": "apply",
    "langModal.cancel": "cancel",
    "langModal.useTag": "Use the \"{tag}\" tag",
    "langModal.removeTag": "Remove language tag",
    "langModal.detected": "detected",
    "langModal.current": "current",
    "codeFileSuggest.placeholder": "Code file to insert into the note…",
    "save.title": "Save code as file",
    "common.fileName": "File name",
    "common.language": "Language",
    "common.folder": "Folder",
    "save.folderDesc": "Leave empty to save to the vault root.",
    "save.inNote": "In the note",
    "link.below": "Keep the code block, add a link below",
    "link.replace": "Replace the code block with a link",
    "link.none": "Leave the note as is",
    "common.save": "Save",
    "save.emptyName": "File name can't be empty.",
    "save.exists": "\"{path}\" already exists, pick another name.",
    "save.saved": "Saved: {path}",
    "save.failed": "Couldn't save: {error}",
    "save.badPath": "Use a path inside the vault: no \"..\", no leading \"/\" and no drive letter.",
    "newFile.title": "New code file",
    "newFile.placeholder": "example.sh",
    "newFile.langDesc": "Used to add an extension if the name has none.",
    "newFile.enterName": "Enter a file name.",
    "newFile.exists": "\"{path}\" already exists.",
    "newFile.create": "Create",
    "newFile.failed": "Couldn't create the file: {error}",
    "save.defaultBase": "code",
    "danger.rm": "deletes files (rm)",
    "danger.reboot": "reboots / shuts down the machine",
    "danger.power": "cuts / cycles server power",
    "danger.disk": "formats / overwrites a disk",
    "danger.k8s": "deletes a Kubernetes resource / drains or cordons a node",
    "danger.helm": "uninstalls / rolls back a Helm release",
    "danger.dctl": "changes the cluster (dctl)",
    "danger.container": "deletes containers / images / volumes",
    "danger.service": "stops / restarts a service",
    "danger.kill": "kills processes",
    "danger.firewall": "turns off the firewall / removes its rules",
    "danger.user": "changes users / passwords",
    "danger.perms": "changes permissions in bulk",
    "danger.rawDisk": "writes directly to a disk",
    "danger.db": "modifies the database",
    "danger.pkg": "installs / removes packages",
    "danger.findDelete": "deletes every file find matches",
    "danger.mvNull": "moves files into /dev/null (they are lost)",
    "danger.wipeFile": "wipes / empties files (shred / truncate)",
    "danger.sysFile": "overwrites a system file",
    "danger.forkBomb": "fork bomb: spawns processes until the machine freezes",
    "danger.pipeShell": "runs a script straight from the internet (curl | sh)",
    "danger.iac": "destroys infrastructure (terraform destroy)",
    "danger.cloud": "deletes cloud resources (aws / gcloud / az)",
    "danger.gitForce": "overwrites remote Git history (force push)",
    "danger.gitDiscard": "throws away uncommitted Git changes / untracked files",
    "danger.sql": "drops / empties database tables (DROP / TRUNCATE)",
    "danger.killAll": "kills every process you are allowed to (kill -1)",
    "danger.crontab": "deletes all your cron jobs (crontab -r)",
    "common.runInTerminal": "Run in terminal",
    "run.run": "Run",
    "run.paste": "Write to terminal only (no Enter)",
    "common.cancel": "Cancel",
    "run.careful": "Careful: ",
    "run.fill": "To fill in: ",
    "run.fillFirst": "Fill in the <...> fields first. Click one to select it, then type to replace it.",
    "run.info": "{n} command line(s) will be sent to the terminal. Cmd+Enter: run",
    "run.scriptTitle": "Run script",
    "run.untagged": "This block has no language tag. Check that it is a shell command before running it.",
    "run.mixedPrompt": "Only some lines have a prompt ($ / # / %). Lines before the first prompt are kept, lines after a prompt are treated as output and left out. Check what will be sent.",
    "preview.titleFile": "Preview: {name}",
    "preview.title": "Preview",
    "preview.openSource": "Open source to the side",
    "preview.openExternal": "Open in browser",
    "preview.reload": "Reload",
    "preview.jsOn": "JavaScript on (click to turn off)",
    "preview.jsOff": "JavaScript off (click to turn on)",
    "preview.notFound": "File not found: {path}",
    "preview.noFile": "No file to preview.",
    "preview.externalFailed": "Couldn't open the file in the browser.",
    "codeView.title": "Code file",
    "codeView.makeReadOnly": "Make read-only",
    "codeView.makeEditable": "Make editable",
    "codeView.copyAll": "Copy all",
    "common.copied": "Copied",
    "codeView.runSelection": "Run selection / line in terminal (⇧⌘↵)",
    "common.insertIntoNote": "Insert into note as code block",
    "common.previewSide": "Preview to the side",
    "codeView.noWrap": "Don't wrap lines",
    "codeView.wrap": "Wrap long lines",
    "codeView.search": "Find / replace",
    "codeView.runScript": "Run script in terminal",
    "codeView.lines": "{n} lines",
    "codeView.readOnly": "read-only",
    "codeView.hintShell": "⌘F find · ⇧⌘↵ run line in terminal",
    "codeView.hint": "⌘F find · changes save automatically",
    "codeView.emptyLine": "The line to run is empty.",
    "common.copy": "Copy",
    "chip.changeLang": "Change language ({lang})",
    "chip.addLang": "Add language",
    "common.saveAsFile": "Save as file",
    "menu.preview": "Preview",
    "notice.noTerminal": "Couldn't open the terminal. Is the ecu-terminal plugin enabled?",
    "notice.noCommand": "No command to run.",
    "notice.noLine": "No line to run.",
    "notice.pastedAs": "Added as {lang} code",
    "notice.unsure": " (not sure)",
    "notice.changeLang": "Change language",
    "notice.makePlain": "Make plain text",
    "notice.blockChanged": "The block has changed, couldn't convert it to plain text. Right-click → Convert code block to plain text.",
    "notice.plainFailed": "Couldn't convert to plain text.",
    "notice.clipboardEmpty": "Clipboard is empty.",
    "notice.unclosed": "The code block isn't closed.",
    "notice.noteChanged": "The note has changed, link not added.",
    "notice.selectFirst": "Select the code lines first.",
    "notice.wrappedAs": "Wrapped in a {lang} block",
    "notice.openNoteFirst": "Open a note first.",
    "notice.autoOn": "Auto code detection on",
    "notice.autoOff": "Auto code detection off",
    "notice.langChanged": "Language changed. Reload Obsidian to apply it everywhere.",
    "menu.codeLang": "Code language: {lang} — change…",
    "menu.copyCode": "Copy code",
    "menu.runBlock": "Run block in terminal",
    "menu.runSelection": "Run selection in terminal",
    "menu.runLine": "Run this line in terminal",
    "menu.saveAsFile": "Save code as file…",
    "menu.unwrap": "Convert code block to plain text",
    "menu.wrap": "Convert selection to code block",
    "menu.insertFile": "Insert code file…",
    "cmd.previewHtml": "Preview HTML file to the side",
    "cmd.pastePlain": "Paste without code detection",
    "cmd.pasteAsCode": "Paste as code (pick language)",
    "cmd.changeLang": "Change code block language",
    "cmd.copyBlock": "Copy code block",
    "cmd.saveBlock": "Save code block as file",
    "cmd.insertFile": "Insert code file into note",
    "cmd.toggleFileMode": "Code file: toggle read-only",
    "cmd.runLine": "Run line / selection in terminal",
    "cmd.runBlock": "Run code block in terminal",
    "cmd.toggleAuto": "Toggle auto code detection on paste",
    "set.uiLangDesc": "Plugin interface language. Auto follows Obsidian's language.",
    "set.uiLangAuto": "Auto (follow Obsidian)",
    "set.uiLangEn": "English",
    "set.uiLangTr": "Türkçe",
    "set.hPaste": "Pasting",
    "set.autoWrap": "Detect code on paste",
    "set.autoWrapDesc": "Wraps text that looks like code in a code block with the right language tag. Cmd+Shift+V always pastes plain text.",
    "set.singleLine": "Wrap single-line commands too",
    "set.singleLineDesc": "E.g. `kubectl get pods -A` pasted on an empty line. Text pasted mid-sentence is never touched.",
    "set.sensitivity": "Detection sensitivity",
    "set.sensitivityDesc": "Cautious: only wraps obvious code. Sensitive: wraps on fewer hints.",
    "set.sensCautious": "Cautious",
    "set.sensNormal": "Normal",
    "set.sensSensitive": "Sensitive",
    "set.shellFence": "Tag for shell blocks",
    "set.shellFenceDesc": "Both are common; highlighting is the same.",
    "set.notify": "Show notice",
    "set.notifyDesc": "After pasting, shows the detected language with 'Change language' and 'Make plain text' buttons.",
    "set.hView": "Appearance",
    "set.chips": "Language tag in the editor",
    "set.chipsDesc": "Language name and save button at the top of each code block. Click the tag to change the language. Applies when the note is reopened.",
    "set.readingHeader": "Language header in reading view",
    "set.hFiles": "Code files",
    "set.codeFolder": "Save folder",
    "set.codeFolderDesc": "Default folder for 'Save as file' and 'New code file'.",
    "set.saveLinkMode": "In the note after saving",
    "set.fileOpenMode": "Open code files as",
    "set.fileOpenModeDesc": "Read-only prevents accidental edits; the lock button makes a file editable.",
    "set.modeEdit": "Editable",
    "set.modeReadOnly": "Read-only",
    "set.previewScripts": "Run JavaScript in HTML preview",
    "set.previewScriptsDesc": "The preview opens in a separate, sandboxed frame; page code can't access Obsidian or read your vault files, and can't use the network unless you allow it below. When off, the page is shown as HTML/CSS only. You can also toggle it per preview with the ⚡ button.",
    "set.previewNetwork": "Allow network in HTML preview",
    "set.previewNetworkDesc": "Lets previewed pages load images, styles, fonts and scripts from the internet and, with JavaScript on, make network requests. When off, nothing is loaded from the internet.",
    "set.hRun": "Running in terminal",
    "set.confirmRun": "Always confirm before running",
    "set.confirmRunDesc": "When off, safe single-line commands run right away. Multi-line commands, <...> placeholders, blocks with no language tag and commands like rm / reboot / kubectl delete / power cycle always ask first.",
    "set.focusTerminal": "Focus terminal after running",
    "set.focusTerminalDesc": "Best left on, so you can answer prompts like a sudo password.",
    "set.fileExts": "Extensions to show in Obsidian",
    "set.fileExtsDesc": "Files with these extensions show up in the file list and open with highlighting. Changes apply after reloading Obsidian.",
    "set.resetDefault": "Reset to default",
    "set.footer": "Right-click a code block to change its language, copy it, save it as a file or convert it to plain text. All commands start with 'ecu-codekit' in the command palette (Cmd+P); you can assign hotkeys under Settings → Hotkeys.",
  },
  tr: {
    "lang.text": "Düz metin",
    "lang.none": "Dil yok",
    "langModal.placeholder": "Dil seç ya da yaz (go, bash, yaml…)",
    "langModal.select": "seç",
    "langModal.apply": "uygula",
    "langModal.cancel": "vazgeç",
    "langModal.useTag": "\"{tag}\" etiketini kullan",
    "langModal.removeTag": "Dil etiketini kaldır",
    "langModal.detected": "algılanan",
    "langModal.current": "şu an",
    "codeFileSuggest.placeholder": "Nota eklenecek kod dosyası…",
    "save.title": "Kodu dosya olarak kaydet",
    "common.fileName": "Dosya adı",
    "common.language": "Dil",
    "common.folder": "Klasör",
    "save.folderDesc": "Boş bırakırsan kasanın köküne kaydedilir.",
    "save.inNote": "Notta",
    "link.below": "Kod bloğu kalsın, altına link ekle",
    "link.replace": "Kod bloğunun yerine link koy",
    "link.none": "Nota dokunma",
    "common.save": "Kaydet",
    "save.emptyName": "Dosya adı boş olamaz.",
    "save.exists": "\"{path}\" zaten var, başka bir ad yaz.",
    "save.saved": "Kaydedildi: {path}",
    "save.failed": "Kaydedilemedi: {error}",
    "save.badPath": "Kasanın içinde bir yol yaz: \"..\", baştaki \"/\" ve sürücü harfi kullanılamaz.",
    "newFile.title": "Yeni kod dosyası",
    "newFile.placeholder": "ornek.sh",
    "newFile.langDesc": "Adda uzantı yoksa buna göre eklenir.",
    "newFile.enterName": "Dosya adı yaz.",
    "newFile.exists": "\"{path}\" zaten var.",
    "newFile.create": "Oluştur",
    "newFile.failed": "Dosya oluşturulamadı: {error}",
    "save.defaultBase": "kod",
    "danger.rm": "dosya siliyor (rm)",
    "danger.reboot": "makineyi yeniden başlatıyor / kapatıyor",
    "danger.power": "sunucunun gücünü kesiyor / yeniden başlatıyor",
    "danger.disk": "diski biçimlendiriyor / üzerine yazıyor",
    "danger.k8s": "Kubernetes kaynağını siliyor / node'u boşaltıyor ya da cordon ediyor",
    "danger.helm": "Helm sürümünü kaldırıyor / geri alıyor",
    "danger.dctl": "cluster'da değişiklik yapıyor (dctl)",
    "danger.container": "container / imaj / volume siliyor",
    "danger.service": "servisi durduruyor / yeniden başlatıyor",
    "danger.kill": "süreç öldürüyor",
    "danger.firewall": "güvenlik duvarını kapatıyor / kurallarını siliyor",
    "danger.user": "kullanıcı / şifre değiştiriyor",
    "danger.perms": "izinleri toplu değiştiriyor",
    "danger.rawDisk": "diske doğrudan yazıyor",
    "danger.db": "veritabanını değiştiriyor",
    "danger.pkg": "paket kuruyor / kaldırıyor",
    "danger.findDelete": "find'ın bulduğu tüm dosyaları siliyor",
    "danger.mvNull": "dosyaları /dev/null'a taşıyor (kaybolurlar)",
    "danger.wipeFile": "dosyaları geri dönülmez siliyor / boşaltıyor (shred / truncate)",
    "danger.sysFile": "bir sistem dosyasının üzerine yazıyor",
    "danger.forkBomb": "fork bomb: makine donana kadar süreç açıyor",
    "danger.pipeShell": "internetten indirilen script'i doğrudan çalıştırıyor (curl | sh)",
    "danger.iac": "altyapıyı yok ediyor (terraform destroy)",
    "danger.cloud": "bulut kaynaklarını siliyor (aws / gcloud / az)",
    "danger.gitForce": "uzak Git geçmişinin üzerine yazıyor (force push)",
    "danger.gitDiscard": "commit edilmemiş Git değişikliklerini / izlenmeyen dosyaları siliyor",
    "danger.sql": "veritabanı tablolarını siliyor / boşaltıyor (DROP / TRUNCATE)",
    "danger.killAll": "yetkin olan tüm süreçleri öldürüyor (kill -1)",
    "danger.crontab": "tüm cron işlerini siliyor (crontab -r)",
    "common.runInTerminal": "Terminalde çalıştır",
    "run.run": "Çalıştır",
    "run.paste": "Sadece terminale yaz (Enter'sız)",
    "common.cancel": "Vazgeç",
    "run.careful": "Dikkat: ",
    "run.fill": "Doldurulacak: ",
    "run.fillFirst": "Önce <...> alanlarını doldur. Tıklayınca seçilir, yazınca yerine geçer.",
    "run.info": "{n} komut satırı terminale gönderilecek. Cmd+Enter: çalıştır",
    "run.scriptTitle": "Script'i çalıştır",
    "run.untagged": "Bu bloğun dil etiketi yok. Çalıştırmadan önce bunun bir terminal komutu olduğundan emin ol.",
    "run.mixedPrompt": "Sadece bazı satırlarda prompt var ($ / # / %). İlk prompt'tan önceki satırlar korundu, prompt'tan sonraki satırlar çıktı sayılıp atlandı. Gönderilecek komutu kontrol et.",
    "preview.titleFile": "Önizleme: {name}",
    "preview.title": "Önizleme",
    "preview.openSource": "Kaynağı yanda aç",
    "preview.openExternal": "Tarayıcıda aç",
    "preview.reload": "Yenile",
    "preview.jsOn": "JavaScript açık (kapatmak için tıkla)",
    "preview.jsOff": "JavaScript kapalı (açmak için tıkla)",
    "preview.notFound": "Dosya bulunamadı: {path}",
    "preview.noFile": "Önizlenecek dosya yok.",
    "preview.externalFailed": "Dosya tarayıcıda açılamadı.",
    "codeView.title": "Kod dosyası",
    "codeView.makeReadOnly": "Salt okunur yap",
    "codeView.makeEditable": "Düzenlemeye aç",
    "codeView.copyAll": "Tümünü kopyala",
    "common.copied": "Kopyalandı",
    "codeView.runSelection": "Seçimi / satırı terminalde çalıştır (⇧⌘↵)",
    "common.insertIntoNote": "Nota kod bloğu olarak ekle",
    "common.previewSide": "Yanda önizle",
    "codeView.noWrap": "Satırları kaydırma",
    "codeView.wrap": "Uzun satırları kaydır",
    "codeView.search": "Ara / değiştir",
    "codeView.runScript": "Script'i terminalde çalıştır",
    "codeView.lines": "{n} satır",
    "codeView.readOnly": "salt okunur",
    "codeView.hintShell": "⌘F ara · ⇧⌘↵ satırı terminalde çalıştır",
    "codeView.hint": "⌘F ara · değişiklikler otomatik kaydedilir",
    "codeView.emptyLine": "Çalıştırılacak satır boş.",
    "common.copy": "Kopyala",
    "chip.changeLang": "Dili değiştir ({lang})",
    "chip.addLang": "Dil ekle",
    "common.saveAsFile": "Dosya olarak kaydet",
    "menu.preview": "Önizle",
    "notice.noTerminal": "Terminal açılamadı. ecu-terminal eklentisi açık mı?",
    "notice.noCommand": "Çalıştırılacak komut yok.",
    "notice.noLine": "Çalıştırılacak satır yok.",
    "notice.pastedAs": "{lang} kodu olarak eklendi",
    "notice.unsure": " (emin değilim)",
    "notice.changeLang": "Dili değiştir",
    "notice.makePlain": "Düz metin yap",
    "notice.blockChanged": "Blok değişmiş, düz metne çevrilemedi. Sağ tık → Kod bloğunu düz metne çevir.",
    "notice.plainFailed": "Düz metne çevrilemedi.",
    "notice.clipboardEmpty": "Pano boş.",
    "notice.unclosed": "Kod bloğu kapanmamış.",
    "notice.noteChanged": "Not değişmiş, link eklenmedi.",
    "notice.selectFirst": "Önce kod olan satırları seç.",
    "notice.wrappedAs": "{lang} olarak bloğa alındı",
    "notice.openNoteFirst": "Önce bir not aç.",
    "notice.autoOn": "Otomatik kod algılama açık",
    "notice.autoOff": "Otomatik kod algılama kapalı",
    "notice.langChanged": "Dil değişti. Her yerde uygulanması için Obsidian'ı yeniden yükle.",
    "menu.codeLang": "Kod dili: {lang} — değiştir…",
    "menu.copyCode": "Kodu kopyala",
    "menu.runBlock": "Bloğu terminalde çalıştır",
    "menu.runSelection": "Seçimi terminalde çalıştır",
    "menu.runLine": "Bu satırı terminalde çalıştır",
    "menu.saveAsFile": "Kodu dosya olarak kaydet…",
    "menu.unwrap": "Kod bloğunu düz metne çevir",
    "menu.wrap": "Seçimi kod bloğuna çevir",
    "menu.insertFile": "Kod dosyası ekle…",
    "cmd.previewHtml": "HTML dosyasını yanda önizle",
    "cmd.pastePlain": "Kod algılamadan yapıştır",
    "cmd.pasteAsCode": "Kod olarak yapıştır (dili seç)",
    "cmd.changeLang": "Kod bloğunun dilini değiştir",
    "cmd.copyBlock": "Kod bloğunu kopyala",
    "cmd.saveBlock": "Kod bloğunu dosya olarak kaydet",
    "cmd.insertFile": "Kod dosyasını nota ekle",
    "cmd.toggleFileMode": "Kod dosyası: salt okunur aç / kapat",
    "cmd.runLine": "Satırı / seçimi terminalde çalıştır",
    "cmd.runBlock": "Kod bloğunu terminalde çalıştır",
    "cmd.toggleAuto": "Yapıştırınca otomatik kod algılamayı aç / kapat",
    "set.uiLangDesc": "Eklentinin arayüz dili. Otomatik, Obsidian'ın diline uyar.",
    "set.uiLangAuto": "Otomatik (Obsidian'a göre)",
    "set.uiLangEn": "English",
    "set.uiLangTr": "Türkçe",
    "set.hPaste": "Yapıştırma",
    "set.autoWrap": "Yapıştırınca kodu otomatik algıla",
    "set.autoWrapDesc": "Kod gibi görünen metni doğru dil etiketiyle kod bloğuna alır. Cmd+Shift+V her zaman düz yapıştırır.",
    "set.singleLine": "Tek satırlık komutlar da bloğa alınsın",
    "set.singleLineDesc": "Örn. boş satıra yapıştırılan `kubectl get pods -A`. Cümle içine yapıştırınca hiçbir zaman dokunmaz.",
    "set.sensitivity": "Algılama hassasiyeti",
    "set.sensitivityDesc": "Temkinli: sadece çok belirgin kodu bloğa alır. Hassas: daha az işaretle de alır.",
    "set.sensCautious": "Temkinli",
    "set.sensNormal": "Normal",
    "set.sensSensitive": "Hassas",
    "set.shellFence": "Shell blokları için etiket",
    "set.shellFenceDesc": "Notlarında ikisi de var; renklendirme aynı.",
    "set.notify": "Bildirim göster",
    "set.notifyDesc": "Yapıştırınca hangi dil olarak eklendiğini, 'Dili değiştir' ve 'Düz metin yap' düğmeleriyle gösterir.",
    "set.hView": "Görünüm",
    "set.chips": "Düzenleme ekranında dil etiketi",
    "set.chipsDesc": "Kod bloğunun başında dil adı ve kaydet düğmesi. Etikete tıklayınca dil değişir. Notu yeniden açınca uygulanır.",
    "set.readingHeader": "Okuma modunda dil başlığı",
    "set.hFiles": "Kod dosyaları",
    "set.codeFolder": "Kaydetme klasörü",
    "set.codeFolderDesc": "'Dosya olarak kaydet' ve 'Yeni kod dosyası' varsayılan olarak buraya yazar.",
    "set.saveLinkMode": "Kaydettikten sonra notta",
    "set.fileOpenMode": "Kod dosyaları nasıl açılsın",
    "set.fileOpenModeDesc": "Salt okunurda yanlışlıkla bir şey yazılmaz; kilit düğmesiyle düzenlemeye açılır.",
    "set.modeEdit": "Düzenlenebilir",
    "set.modeReadOnly": "Salt okunur",
    "set.previewScripts": "HTML önizlemede JavaScript çalışsın",
    "set.previewScriptsDesc": "Önizleme ayrı, yalıtılmış bir çerçevede açılır; sayfadaki kod Obsidian'a erişemez, kasandaki dosyaları okuyamaz ve aşağıda izin vermedikçe ağı kullanamaz. Kapalıyken sayfa sadece HTML/CSS olarak gösterilir. Önizleme penceresindeki ⚡ düğmesiyle tek tek de değiştirebilirsin.",
    "set.previewNetwork": "HTML önizlemede ağa izin ver",
    "set.previewNetworkDesc": "Önizlenen sayfalar internetten resim, stil, yazı tipi ve betik yükleyebilir; JavaScript açıksa ağ isteği de yapabilir. Kapalıyken internetten hiçbir şey yüklenmez.",
    "set.hRun": "Terminalde çalıştırma",
    "set.confirmRun": "Her komutta önce onay sor",
    "set.confirmRunDesc": "Kapalıyken tek satırlık, tehlikesiz komutlar direkt çalışır. Çok satırlı, <...> yer tutuculu, dil etiketi olmayan bloklarda ya da rm / reboot / kubectl delete / power cycle gibi komutlarda her zaman sorulur.",
    "set.focusTerminal": "Çalıştırınca terminale geç",
    "set.focusTerminalDesc": "sudo şifresi gibi bir şey sorarsa yazabilmen için açık kalması iyi olur.",
    "set.fileExts": "Obsidian'da gösterilecek uzantılar",
    "set.fileExtsDesc": "Bu uzantılardaki dosyalar dosya listesinde görünür ve renkli açılır. Değişiklik, Obsidian yeniden yüklenince uygulanır.",
    "set.resetDefault": "Varsayılana dön",
    "set.footer": "Kod bloğunda sağ tık: dili değiştir, kopyala, dosya olarak kaydet, düz metne çevir. Komut paletinde (Cmd+P) 'ecu-codekit' ile başlayan tüm komutlar var; istersen Ayarlar → Kısayollar'dan tuş atayabilirsin.",
  },
};
let uiLang = "en";
function t(key, vars) {
  const s = (STRINGS[uiLang] && STRINGS[uiLang][key]) || STRINGS.en[key] || key;
  return vars ? s.replace(/\{(\w+)\}/g, (m, k) => (Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : m)) : s;
}
function resolveUiLang(pref) {
  if (pref === "en" || pref === "tr") return pref;
  let code = "";
  try {
    const obs = require("obsidian");
    code = typeof obs.getLanguage === "function" ? obs.getLanguage() : obs.moment.locale();
  } catch (e) {
    code = "";
  }
  return /^tr/i.test(code) ? "tr" : "en";
}
function setUiLang(pref) {
  uiLang = resolveUiLang(pref);
  return uiLang;
}
function defaultCodeFolder(lang) {
  return lang === "tr" ? "Kodlar" : "Code";
}

const VIEW_CODE = "ecu-codekit-file";
const VIEW_PREVIEW = "ecu-codekit-preview";
const LEGACY_VIEWS = { "ecu-codelight-file": VIEW_CODE, "ecu-codelight-preview": VIEW_PREVIEW };
const PREVIEW_EXTS = new Set(["html", "htm"]);
const canPreview = (file) => !!file && PREVIEW_EXTS.has(String(file.extension).toLowerCase());

const LANGS = [
  { id: "bash", label: "Bash / Shell", ext: "sh", aliases: ["sh", "shell", "zsh", "console", "shellscript", "terminal"], exts: ["sh", "bash", "zsh"] },
  { id: "go", label: "Go", ext: "go", aliases: ["golang"], exts: ["go"] },
  { id: "python", label: "Python", ext: "py", aliases: ["py", "python3"], exts: ["py"] },
  { id: "yaml", label: "YAML", ext: "yaml", aliases: ["yml"], exts: ["yaml", "yml"] },
  { id: "json", label: "JSON", ext: "json", aliases: [], exts: ["json"] },
  { id: "javascript", label: "JavaScript", ext: "js", aliases: ["js", "node", "jsx"], exts: ["js", "mjs", "cjs", "jsx"] },
  { id: "typescript", label: "TypeScript", ext: "ts", aliases: ["ts", "tsx"], exts: ["ts", "tsx"] },
  { id: "sql", label: "SQL", ext: "sql", aliases: ["postgresql", "postgres", "psql", "mysql", "plsql", "pgsql"], exts: ["sql"] },
  { id: "dockerfile", label: "Dockerfile", ext: "dockerfile", aliases: ["docker"], exts: ["dockerfile"] },
  { id: "html", label: "HTML", ext: "html", aliases: ["htm"], exts: ["html", "htm"] },
  { id: "xml", label: "XML", ext: "xml", aliases: [], exts: ["xml"] },
  { id: "css", label: "CSS", ext: "css", aliases: ["scss", "less"], exts: ["css", "scss"] },
  { id: "java", label: "Java", ext: "java", aliases: [], exts: ["java"] },
  { id: "c", label: "C", ext: "c", aliases: ["h"], exts: ["c", "h"] },
  { id: "cpp", label: "C++", ext: "cpp", aliases: ["c++", "cc", "hpp", "cxx"], exts: ["cpp", "cc", "hpp", "cxx"] },
  { id: "csharp", label: "C#", ext: "cs", aliases: ["cs", "c#"], exts: ["cs"] },
  { id: "rust", label: "Rust", ext: "rs", aliases: ["rs"], exts: ["rs"] },
  { id: "php", label: "PHP", ext: "php", aliases: [], exts: ["php"] },
  { id: "ruby", label: "Ruby", ext: "rb", aliases: ["rb"], exts: ["rb"] },
  { id: "powershell", label: "PowerShell", ext: "ps1", aliases: ["ps", "ps1", "pwsh"], exts: ["ps1"] },
  { id: "toml", label: "TOML", ext: "toml", aliases: [], exts: ["toml"] },
  { id: "ini", label: "INI / Config", ext: "ini", aliases: ["conf", "cfg", "properties", "env", "dotenv"], exts: ["ini", "cfg", "conf", "env"] },
  { id: "nginx", label: "Nginx", ext: "conf", aliases: ["nginxconf"], exts: [] },
  { id: "diff", label: "Diff / Patch", ext: "diff", aliases: ["patch"], exts: ["diff", "patch"] },
  { id: "lua", label: "Lua", ext: "lua", aliases: [], exts: ["lua"] },
  { id: "makefile", label: "Makefile", ext: "mk", aliases: ["make", "mk"], exts: ["mk"] },
  { id: "text", get label() {
    return t("lang.text");
  }, ext: "txt", aliases: ["txt", "plain", "plaintext", "log"], exts: ["txt", "log"] },
];

const LANG_BY_KEY = new Map();
for (const l of LANGS) {
  LANG_BY_KEY.set(l.id, l);
  for (const a of l.aliases) if (!LANG_BY_KEY.has(a)) LANG_BY_KEY.set(a, l);
}

function langOf(id) {
  if (!id) return null;
  return LANG_BY_KEY.get(String(id).toLowerCase()) || null;
}
function langLabel(id) {
  if (!id) return t("lang.none");
  const l = langOf(id);
  return l ? l.label : id;
}
function langFromExt(ext) {
  ext = String(ext || "").toLowerCase();
  if (ext === "conf") return null;
  for (const l of LANGS) if (l.exts.includes(ext)) return l.id;
  return null;
}

const DEFAULT_FILE_EXTS =
  "sh, bash, zsh, go, py, yaml, yml, json, js, mjs, ts, tsx, sql, dockerfile, html, htm, xml, css, java, c, h, cpp, hpp, cs, rs, php, rb, ps1, toml, ini, cfg, conf, env, diff, patch, lua, mk, txt, log";

const SHELL_CMDS = [
  "sudo", "dctl", "kubectl", "k9s", "helm", "docker", "podman", "crictl", "ctr", "nerdctl", "kubeadm", "k3s", "rke2", "minikube", "kubectx", "kubens", "kustomize", "kubeseal", "skaffold", "eksctl", "doctl", "flyctl",
  "dnf", "apt-get", "apt-cache", "dpkg", "brew", "zypper", "launchctl", "diskutil", "pbcopy", "pbpaste", "sw_vers", "softwareupdate", "xcode-select", "xcrun", "mdfind", "caffeinate", "scutil", "networksetup", "osascript", "plutil", "codesign", "hdiutil",
  "systemctl", "journalctl", "chkconfig", "timedatectl", "hostnamectl", "localectl", "loginctl", "systemd-analyze", "systemd-run", "coredumpctl", "networkctl", "resolvectl", "udevadm",
  "ipmitool", "dstool", "ditool", "racadm", "dmidecode", "lshw", "lspci", "lsusb", "lscpu", "lsblk", "blkid", "fdisk", "parted", "mkfs", "mkfs.xfs", "mkfs.ext4", "mkswap", "wipefs", "sgdisk", "e2fsck", "fsck", "xfs_repair", "tune2fs", "smartctl", "hdparm", "mdadm", "cryptsetup", "zpool", "zfs", "btrfs",
  "pvcreate", "pvs", "vgcreate", "vgs", "vgextend", "lvcreate", "lvs", "lvextend", "xfs_growfs", "resize2fs", "umount", "findmnt", "swapon", "swapoff",
  "ssh", "scp", "sftp", "rsync", "ssh-keygen", "ssh-copy-id", "ssh-add", "ssh-agent", "sshpass", "mosh", "socat",
  "ls", "ll", "pwd", "tac", "grep", "egrep", "fgrep", "rg", "ag", "awk", "gawk", "sed", "uniq", "tee", "xargs", "jq", "yq", "fzf", "fd", "eza", "exa", "ncdu", "xxd", "hexdump", "seq", "shuf", "basename", "dirname", "realpath", "readlink", "mktemp", "dd", "shred",
  "echo", "printf", "unset", "whereis", "nohup", "tmux", "ulimit",
  "chmod", "chown", "chgrp", "mkdir", "rmdir", "rm", "cp", "mv", "ln", "du", "df", "htop", "btop", "pgrep", "pkill", "killall", "uname", "whoami", "lsof", "strace", "ltrace", "vmstat", "iostat", "mpstat", "pidstat", "nproc", "dmesg", "sysctl", "modprobe", "lsmod", "insmod",
  "tar", "gzip", "gunzip", "unzip", "xz", "bzip2", "7z", "md5sum", "sha1sum", "sha256sum", "shasum", "base64",
  "wget", "git", "gh", "cmake", "npm", "npx", "pnpm", "pip", "pip3", "pipx", "python3", "mvn", "gradle", "dotnet", "deno", "rustup", "rustc", "tsc", "pytest", "conda", "pyenv", "nvm", "direnv", "asdf", "ffmpeg", "ffprobe", "pandoc", "sqlite3", "yt-dlp",
  "vi", "vim", "nvim", "emacs",
  "traceroute", "tracepath", "mtr", "ifconfig", "nmcli", "nmtui", "ethtool", "firewall-cmd", "iptables", "nft", "ufw", "netstat", "nc", "ncat", "nslookup", "tcpdump", "tshark", "arping", "nmap", "iperf3", "iftop", "whois", "tailscale",
  "useradd", "adduser", "usermod", "userdel", "passwd", "chpasswd", "groupadd", "visudo", "crontab",
  "poweroff", "update-grub", "grub2-mkconfig", "dracut", "sestatus", "getenforce", "setenforce", "restorecon", "semanage", "getfacl", "setfacl", "chattr", "lsattr", "nsenter",
  "openssl", "certbot", "keytool", "gpg", "mkcert",
  "terraform", "ansible", "ansible-playbook", "packer", "virsh", "qemu-img", "aws", "gcloud", "gsutil", "istioctl", "argocd", "velero", "etcdctl", "calicoctl", "cilium", "pulumi", "sops",
  "psql", "pg_dump", "pg_restore", "pg_basebackup", "pgbackrest", "patronictl", "mysql", "mysqldump", "redis-cli", "mongosh", "mongo",
  "zabbix_server", "zabbix_agentd", "zabbix_get", "zabbix_sender", "chronyc", "ntpq", "ntpdate",
  "sh", "zsh", "exec", "fg", "bg",
];
const SHELL_AMBIG = [
  "su", "k", "oc", "az", "kind", "apt", "yum", "apk", "snap", "port", "rpm", "pacman", "service", "defaults", "mount", "cd", "cat", "less", "more", "cut", "tr", "sort", "wc", "find", "locate", "head", "tail", "diff", "tree", "bat",
  "export", "source", "alias", "history", "which", "type", "env", "set", "read", "sleep", "exit", "test", "time", "watch", "screen", "wait", "jobs", "trap", "eval", "disown",
  "touch", "stat", "file", "free", "top", "ps", "ss", "kill", "uptime", "id", "groups", "zip", "curl", "make", "go", "cargo", "yarn", "node", "python", "java", "bash", "poetry", "bun", "uv", "stern",
  "nano", "code", "open", "man", "ping", "ip", "route", "dig", "host", "at", "date", "reboot", "shutdown", "halt", "init",
];
const KUBE_VERBS = /^(get|describe|apply|logs|exec|delete|edit|rollout|port-forward|config|scale|create|patch|label|annotate|drain|cordon|uncordon|top|run|expose|explain|api-resources|login|project|new-app|whoami|adm)\b/;
const SHELL_ARGS = {
  k: KUBE_VERBS,
  oc: KUBE_VERBS,
  az: /^(login|logout|account|group|vm|aks|acr|storage|webapp|network|keyvault|ad|role|deployment|extension|resource|functionapp|monitor|sql|cosmosdb)\b/,
  kind: /^(create|delete|get|load|export|build)\s+(cluster|clusters|nodes|kubeconfig|docker-image|image-archive|logs|node-image)\b/,
  apt: /^(install|update|upgrade|remove|purge|search|show|list|autoremove|full-upgrade|dist-upgrade|policy)\b/,
  yum: /^(install|update|upgrade|remove|erase|search|info|list|makecache|clean|repolist|groupinstall|check-update)\b/,
  apk: /^(add|del|update|upgrade|search|info|cache)\b/,
  snap: /^(install|remove|refresh|list|info|find|run|services|start|stop|restart)\b/,
  ps: /^(aux|ax|axu|auxf|ef|eo)\b/,
  service: /^\S+\s+(start|stop|restart|status|reload|force-reload)\s*$/,
  defaults: /^(read|write|delete|domains|export|import|find|read-type)\b/,
  export: /^[A-Z_][A-Z0-9_]*\s*$/,
  make: /^(all|install|build|test|tests|clean|run|dev|lint|check|release|deploy|docs|fmt|format|setup|deps|bootstrap|up|down|start|stop|serve|dist|package|image|push|generate|gen|proto|migrate|ci|e2e|bench|coverage|vet|tidy|help|uninstall|distclean|config|menuconfig|modules|debug)(\s+[\w.-]+)?\s*$/,
  go: /^(build|run|test|mod|get|install|vet|fmt|generate|version|env|work|tool|clean|doc|list)\b/,
  cargo: /^(build|run|test|check|add|install|new|init|fmt|clippy|update|publish|doc|bench|clean|tree|remove|search|watch)\b/,
  yarn: /^(install|add|remove|run|build|dev|start|test|upgrade|global|why|workspace|workspaces|dlx|create|init|lint|set|config)\b/,
  poetry: /^(install|add|run|shell|lock|update|build|publish|init|new|env|show|remove|export|check|version|self|config)\b/,
  bun: /^(install|add|run|x|create|test|build|dev|init|remove|upgrade|pm|link|outdated|update)\b/,
  uv: /^(pip|run|sync|add|venv|lock|tool|init|python|remove|build|publish|tree|export|cache|self|version)\b/,
  ip: /^(a|addr|address|r|route|link|l|neigh|n|rule|netns|maddr|monitor|tunnel|xfrm)\b/,
  su: /^(-|root)(\s|$)/,
};
const SHELL_BARE = new Set(["ls", "ll", "pwd", "htop", "btop", "whoami", "dmesg", "ifconfig", "lsblk", "lscpu", "lsusb", "lspci", "nproc", "k9s", "ncdu", "netstat"]);
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const SHELL_PREFIX = "(?:\\[[^\\]]+\\][$#]\\s*|[\\w.-]+@[\\w.-]+(?::[^$#\\s]*)?\\s?[$#]\\s*|\\$\\s+|#\\s+(?=sudo\\s))?(?:sudo\\s+(?:-\\S+\\s+)*)?";
const shellAlt = (list) => "(" + list.map(escRe).join("|") + ")(?=\\s|$|;|\\|)(?!\\s*[=:](?!=))";
const SHELL_LINE_RE = new RegExp("^" + SHELL_PREFIX + shellAlt(SHELL_CMDS));
const SHELL_AMBIG_RE = new RegExp("^(" + SHELL_PREFIX + ")" + shellAlt(SHELL_AMBIG) + "(.*)$");
const SHELL_LINE_EXTRA = [
  /^\.{1,2}\/[\w.\-\/]+/,
  /^~?\/[\w.\-\/]+\.(sh|py)\b/,
  /^(export\s+)?[A-Z_][A-Z0-9_]*=\S*(\s|$)/,
  /^(if\s+(\[|!\s|test\s|command\s|grep\s|\w+\s+-)|then\s*$|else\s*$|elif\s|fi\s*$|for\s+\w+\s+in\s|for\s*\(\(|while\s+(\[|read\b|true\b|:|!)|until\s+(\[|!)|do\s*$|done\b(?!\s+\w)|case\s+\S+\s+in\s*$|esac\s*$|function\s+[\w-]+\s*(\(\)\s*)?\{?\s*$)/,
  /;\s*(then|do)\s*$/,
  /^[\w-]+\s*\(\)\s*\{?\s*$/,
];
const SHELL_EXTS = "txt|log|md|json|ya?ml|sh|py|js|ts|go|rs|rb|conf|cfg|ini|env|csv|xml|html?|css|tar|gz|tgz|zip|pub|pem|key|crt|sql|bin|iso|img|deb|rpm|toml|lock|out|pdf|png|jpe?g|dmg|pkg|plist|com|net|org|io";
const SHELL_SIGNAL_RE = new RegExp(
  "(?:^|\\s)--?[a-zA-Z]|[|<>$=~;`*\\/]|&&|(?:^|[\\s=(])[\"']|[\"'](?:$|[\\s;|)])|(?:^|\\s)\\+\\S|(?:^|\\s)\\.{1,2}(?:\\s|$)|\\b[\\w-]+\\.(?:" + SHELL_EXTS + ")\\b"
);
const STACK_FRAME_RE = /^\s*at\s+[\w$.<>\/]+\(.*(:\d+)?\)/;
const PROSE_STOP = new Set(
  ("the a an to of with at on is are was were be been my your our their his her it its this that these those and or but before after until me we you they " +
    "will would should could can so very too some about from into when what how why not just also than there here have has had by today tomorrow " +
    "ve bir bu için ile ama gibi çok daha sonra önce ben sen biz siz onlar de da mi mı mu mü ki ya veya hem her hiç kadar olarak yarın bugün dün").split(" ")
);
function proseLine(s) {
  if (SHELL_SIGNAL_RE.test(s)) return false;
  const w = s.split(/\s+/);
  if (w.length < 4) return false;
  const letters = w.filter((x) => /^\p{L}[\p{L}'’-]*[.,!?:…]*$/u.test(x)).length;
  if (letters / w.length < 0.75) return false;
  return /[.!?…]$|,\s/.test(s) || w.some((x) => PROSE_STOP.has(x.toLowerCase().replace(/[.,!?:…]+$/, "")));
}
function shellLine(s) {
  if (STACK_FRAME_RE.test(s)) return 0;
  if (SHELL_LINE_RE.test(s) || SHELL_LINE_EXTRA.some((re) => re.test(s))) return proseLine(s) ? 0 : 2;
  const m = SHELL_AMBIG_RE.exec(s);
  if (!m) return 0;
  const cmd = m[2];
  const arg = m[3].trim();
  if (m[1] || (cmd === "cd" && !/\s/.test(arg))) return 2;
  if ((SHELL_ARGS[cmd] && SHELL_ARGS[cmd].test(arg)) || (arg && shellLine(arg) === 2)) return 2;
  if (SHELL_SIGNAL_RE.test(m[3]) || /\d/.test(m[3])) return proseLine(s) ? 0 : 2;
  return arg.split(/\s+/).length <= 1 ? 1 : 0;
}
const STACK_RE = [
  /^\s*Exception in thread "/m,
  /^\s*Caused by: [\w$.]+/m,
  /^\s*Traceback \(most recent call last\):/m,
  /^goroutine \d+ \[/m,
  /^\s*at\s+[\w$.<>`\[\],]+\(.*\)\s+in\s+.+:line\s+\d+/m,
];
const FRAME_RE = /^\s*at\s+(?:async\s+)?(?:new\s+)?[\w$.<>\[\]\/]+(?:\s+\[as [^\]]+\])?\s*\((?:[^()]*\.\w+:\d+(?::\d+)?|node:[\w\/]+:\d+(?::\d+)?|Native Method|Unknown Source)\)\s*$|^\s*at\s+(?:file:\/\/)?[\/\w.-]+\.\w+:\d+:\d+\s*$/;
function isStackTrace(lines, text) {
  if (STACK_RE.some((re) => re.test(text))) return true;
  if (/^panic: /m.test(text) && /\.go:\d+/.test(text)) return true;
  const frames = lines.filter((l) => FRAME_RE.test(l)).length;
  return frames >= 2 || (frames >= 1 && /\b\w*(Error|Exception)\b/.test(text));
}

const JS_TS = ["javascript", "typescript"];
const C_CPP = ["c", "cpp"];
const RULES = [
  ["go", /^package\s+\w+\s*$/m, 10],
  ["go", /^\s*func\s+(\([^)]*\)\s*)?\w+\s*(\[[^\]]*\])?\s*\([^)]*\)\s*[^{\n]*\{\s*$/m, 8, 3],
  ["go", /^\s*import\s+(\(\s*$|"[\w.\/-]+")/m, 6],
  ["go", /:=/, 3, 3],
  ["go", /\bfmt\.(Print|Sprint|Fprint|Errorf|Scan)\w*\(/, 6],
  ["go", /\berr\s*!=\s*nil\b/, 7],
  ["go", /^\s*type\s+\w+\s+(struct|interface)\s*\{/m, 7],
  ["go", /\b(chan\s+\w+|go\s+func\b|defer\s+\w+)/, 3, 2],
  ["go", /\bmake\((\[\]|map\[|chan\b)/, 4],
  ["go", /\[\](string|int|int64|byte|float64|\w+)\{/, 2],
  ["go", /\bfunc\s*\(/, 2],
  ["python", /^\s*(async\s+)?def\s+\w+\s*\([^)]*\)\s*(->\s*[^:]+)?:\s*$/m, 8, 3],
  ["python", /^\s*class\s+\w+(\([^)]*\))?\s*:\s*$/m, 7],
  ["python", /^\s*from\s+[\w.]+\s+import\s+[\w*]/m, 6],
  ["python", /^\s*import\s+[\w.]+(\s+as\s+\w+)?(\s*,\s*[\w.]+)*\s*$/m, 3, 2],
  ["python", /\bself\.\w+/, 4],
  ["python", /^\s*(if|elif|else|for|while|with|try|except|finally)\b[^{};]*:\s*(#.*)?$/m, 3, 3],
  ["python", /\bprint\(/, 2],
  ["python", /__name__\s*==\s*['"]__main__['"]/, 10],
  ["python", /\b(None|True|False)\b/, 1, 2],
  ["python", /\belif\b/, 5],
  ["python", /\b(lambda\s+\w*:|f"[^"]*\{|\.append\(|range\(|len\()/, 2, 2],
  [JS_TS, /\b(const|let|var)\s+[\w${}[\],\s]+=/, 3, 3],
  [JS_TS, /=>/, 2, 2],
  [JS_TS, /\bfunction\s*\*?\s*[\w$]*\s*\(/, 3],
  [JS_TS, /\bconsole\.(log|error|warn|info|debug)\(/, 6],
  [JS_TS, /\brequire\(\s*['"][^'"]+['"]\s*\)/, 6],
  [JS_TS, /^\s*(import\s+[\w{}\s,*$]+\s+from\s+['"]|import\s+['"][^'"]+['"];?$|export\s+(default|const|function|class|async)\b)/m, 6],
  [JS_TS, /\b(document|window)\.\w+/, 4],
  [JS_TS, /===|!==/, 2],
  [JS_TS, /\.then\(|\bawait\s+[\w.]+\(/, 2],
  ["javascript", /\bmodule\.exports\b/, 6],
  ["typescript", /[\w)]\s*:\s*(string|number|boolean|any|void|unknown|never|Record<|Promise<)(\[\])?\s*[,;)=|{>]/, 6, 2],
  ["typescript", /^\s*(export\s+)?interface\s+\w+(\s+extends\s+[\w, ]+)?\s*\{/m, 6],
  ["typescript", /^\s*(export\s+)?type\s+\w+(<[^>]+>)?\s*=/m, 5],
  ["typescript", /\b(public|private|protected|readonly)\s+\w+\s*[:(]/, 3],
  ["typescript", /\bas\s+(string|number|any|const|unknown)\b/, 3],
  [C_CPP, /^\s*#include\s*[<"][\w.\/]+[>"]/m, 8],
  [C_CPP, /\bint\s+main\s*\(/, 6],
  [C_CPP, /\b(printf|scanf|malloc|free|sizeof|strcmp|memcpy)\s*\(/, 3, 2],
  [C_CPP, /^\s*#define\s+\w+/m, 4],
  ["cpp", /\bstd::\w+|\bcout\s*<<|\bcin\s*>>|#include\s*<(iostream|vector|string|map|memory)>/, 8],
  ["cpp", /\b(template\s*<|class\s+\w+\s*:\s*public\b|nullptr\b)/, 3],
  ["java", /\bpublic\s+(static\s+)?(final\s+)?(class|interface|enum|void|int|String|boolean)\b/, 6],
  ["java", /\bSystem\.(out|err)\.print/, 8],
  ["java", /^\s*import\s+javax?\.[\w.*]+;/m, 10],
  ["java", /^\s*package\s+[\w.]+;\s*$/m, 8],
  ["java", /@(Override|Autowired|SpringBootApplication)\b/, 5],
  ["csharp", /^\s*using\s+System(\.[\w.]+)?;/m, 10],
  ["csharp", /\bConsole\.Write(Line)?\(/, 8],
  ["csharp", /^\s*namespace\s+[\w.]+\s*[{;]?\s*$/m, 4],
  ["csharp", /\bvar\s+\w+\s*=\s*new\b/, 3],
  ["rust", /^\s*(pub\s+)?fn\s+\w+\s*(<[^>]*>)?\s*\(/m, 5, 2],
  ["rust", /\blet\s+mut\b/, 8],
  ["rust", /\b(println|format|vec|panic|eprintln)!\s*[(\[]/, 8],
  ["rust", /^\s*use\s+(std|crate|super)::/m, 8],
  ["rust", /^\s*impl\b/m, 5],
  ["rust", /&mut\s+\w+|&'\w+/, 4],
  ["ruby", /^\s*def\s+[\w.]+[!?]?(\(.*\))?\s*$/m, 4, 2],
  ["ruby", /^\s*end\s*$/m, 3, 3],
  ["ruby", /^\s*puts\s+/m, 4],
  ["ruby", /\.each(_with_index)?\s+do\s*\|/, 7],
  ["ruby", /^\s*require\s+['"][\w\/]+['"]\s*$/m, 4],
  ["ruby", /\battr_(accessor|reader|writer)\b/, 7],
  ["php", /\$this->/, 6],
  ["php", /\$\w+\s*->\s*\w+/, 4],
  ["php", /\becho\s+\$\w+.*;/, 3],
  ["powershell", /\b(Get|Set|New|Remove|Start|Stop|Restart|Invoke|Write|Import|Export|Test|Add|Out|Select|Where|ForEach|Format|Install|Enable|Disable)-[A-Z][a-zA-Z]+/, 6, 3],
  ["powershell", /\s-(eq|ne|gt|lt|ge|le|like|match|notmatch|contains)\s/, 3],
  ["powershell", /\$(true|false|null|_|PSScriptRoot|env:\w+)\b/i, 4],
  ["sql", /\bSELECT\b[\s\S]+?\bFROM\b/i, 8],
  ["sql", /\b(INSERT\s+INTO|UPDATE\s+[\w."]+\s+SET|DELETE\s+FROM|CREATE\s+(OR\s+REPLACE\s+)?(TABLE|INDEX|DATABASE|SCHEMA|USER|ROLE|VIEW|FUNCTION|EXTENSION|SEQUENCE)|ALTER\s+(TABLE|USER|ROLE|DATABASE)|DROP\s+(TABLE|DATABASE|INDEX|USER|ROLE|SCHEMA)|GRANT\s+\w+|REVOKE\s+\w+|TRUNCATE\s+TABLE)\b/i, 8, 2],
  ["sql", /\b(WHERE|INNER JOIN|LEFT JOIN|GROUP BY|ORDER BY|HAVING|VALUES|PRIMARY KEY)\b/, 2, 3],
  ["sql", /^\s*\\(d[tnfuv+]*|l|c|x|q)\b/m, 4],
  ["dockerfile", /^\s*FROM\s+[\w.\/:@${}-]+(\s+(AS|as)\s+\w+)?\s*$/m, 8],
  ["dockerfile", /^\s*(RUN|COPY|ADD|WORKDIR|ENTRYPOINT|CMD|EXPOSE|ENV|ARG|LABEL|USER|VOLUME|HEALTHCHECK)\s+\S/m, 3, 4],
  ["html", /<\/?(html|head|body|div|span|script|style|p|a|ul|ol|li|table|tr|td|th|h[1-6]|img|form|input|button|section|nav|header|footer|main|meta|link|br|code|pre)\b[^>]*>/i, 4, 3],
  ["html", /\b(class|href|src|id)="[^"]*"/, 2],
  ["xml", /<([\w:-]+)(\s+[\w:-]+\s*=\s*"[^"]*")*\s*>[^<]*<\/\1>/, 3, 3],
  ["xml", /<[\w:-]+(\s+[\w:-]+\s*=\s*"[^"]*")+\s*\/?>/, 3, 2],
  ["css", /^\s*[.#:@]?[\w-]+[\w\s>+~,.#:()[\]="'*-]*\{\s*$/m, 3, 2],
  ["css", /^\s*[\w-]+\s*:\s*[^;{}]+;\s*$/m, 2, 4],
  ["css", /@(media|import|keyframes|font-face|supports)\b/, 6],
  ["css", /\b(color|margin|padding|display|font-(size|family|weight)|background(-color)?|border(-radius)?|width|height|flex|grid-template[\w-]*)\s*:/, 3, 3],
  ["css", /var\(--[\w-]+\)/, 3],
  ["nginx", /^\s*(server|location|upstream|http|events)\b[^{;]*\{\s*$/m, 5, 2],
  ["nginx", /^\s*(listen|server_name|proxy_pass|root|index|proxy_set_header|ssl_certificate(_key)?|try_files|client_max_body_size)\s+[^;]+;\s*$/m, 4, 3],
  ["lua", /^\s*local\s+\w+\s*=/m, 4, 2],
  ["lua", /\bfunction\s+[\w.:]+\s*\([^)]*\)\s*$/m, 3],
  ["lua", /\bthen\s*$/m, 1, 2],
  ["makefile", /^[\w.-]+\s*:\s*[\w. -]*$/m, 1, 3],
  ["makefile", /^\t\S/m, 2],
  ["makefile", /^\.PHONY\s*:/m, 10],
  ["makefile", /\$\([A-Z_]+\)/, 2],
  ["toml", /^\s*\[\[?[\w.-]+\]\]?\s*$/m, 2],
  ["ini", /^\s*\[[\w .-]+\]\s*$/m, 2],
  ["bash", /\$\{\w+[^}]*\}|\$\(\s*[^)]+\)/, 4, 2],
  ["bash", /\|\s*(grep|egrep|awk|sed|sort|uniq|head|tail|wc|xargs|cut|tr|tee|less|jq|column|yq)\b/, 4, 2],
  ["bash", /^\s*(if\s+\[|then\s*$|fi\s*$|elif\s+\[|for\s+\w+\s+in\b|while\s+(\[|read|true|:)|do\s*$|done\s*$|case\s+.+\s+in\s*$|esac\s*$)/m, 4, 3],
  ["bash", /^\s*[\w-]+\s*\(\)\s*\{/m, 5],
  ["bash", /(\s2>&1|>\s*\/dev\/null|\s&>\s)/, 4],
  ["bash", /\s-{1,2}[a-zA-Z][\w-]*/, 1, 3],
  ["bash", /\becho\s+["'$]/, 2],
  ["yaml", /^\s*apiVersion:\s*\S+/m, 10],
  ["yaml", /^\s*kind:\s*[A-Z]\w+/m, 6],
  ["yaml", /^\s*(metadata|spec|data|services|volumes|steps|jobs):\s*$/m, 4],
  ["yaml", /^\s*-\s+(name|image|key|value|path|port|hosts|role|task|uses|run):\s/m, 3],
  ["yaml", /^\s*[\w-]+:\s*[|>][-+]?\s*$/m, 4],
];
const RULE_ORDER = LANGS.map((l) => l.id);

function prepRules() {
  return RULES.map(([langs, re, w, cap]) => ({
    langs: Array.isArray(langs) ? langs : [langs],
    re: new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g"),
    w,
    cap: cap || 1,
  }));
}
const PREPPED = prepRules();

function detectLanguage(raw, opts) {
  opts = opts || {};
  const minScore = opts.minScore || 6;
  let text = String(raw == null ? "" : raw).replace(/\r\n?/g, "\n");
  text = text.replace(/^(?:[ \t]*\n)+/, "").replace(/\s+$/, "");
  if (!text.trim()) return null;
  if (/^\s*(```|~~~)/m.test(text)) return null;

  const lines = text.split("\n");
  const nonEmpty = lines.filter((l) => l.trim());
  const first = nonEmpty[0].trim();
  const single = nonEmpty.length === 1;
  const hard = (lang) => ({ lang, score: 100, second: 0, confident: true });
  if (isStackTrace(nonEmpty, text)) return null;

  if (/^#!.*\b(ba|z|k|da)?sh\b/.test(first)) return hard("bash");
  if (/^#!.*\bpython/.test(first)) return hard("python");
  if (/^#!.*\b(node|deno|bun)\b/.test(first)) return hard("javascript");
  if (/^<\?php\b/.test(first)) return hard("php");
  if (/^<\?xml\b/.test(first)) return hard("xml");
  if (/^<!doctype html/i.test(first)) return hard("html");
  if (/^[[{]/.test(first) && /[\]}]$/.test(text) && text.length > 2) {
    try {
      JSON.parse(text);
      return hard("json");
    } catch (e) {
      try {
        JSON.parse(text.replace(/,(\s*[}\]])/g, "$1"));
        return hard("json");
      } catch (e2) {
      }
    }
  }
  if (/^(diff --git|--- \S|\+\+\+ \S|Index: )/m.test(text) && /^@@ .* @@/m.test(text)) return hard("diff");

  if (single) {
    if (/^(https?|ftp|file|obsidian):\/\/\S+$/.test(first)) return null;
    if (!/\s/.test(first) && !/[(){};=<>$|]/.test(first) && !/^\.{1,2}\/[\w.\-\/]+$/.test(first) && !SHELL_BARE.has(first)) return null;
  }

  const S = Object.create(null);
  const add = (l, w) => (S[l] = (S[l] || 0) + w);

  for (const r of PREPPED) {
    r.re.lastIndex = 0;
    const m = text.match(r.re);
    if (m && m.length) for (const l of r.langs) add(l, Math.min(m.length, r.cap) * r.w);
  }

  const ENV_LINE = /^[A-Z_][A-Z0-9_]*=(?:"[^"]*"|'[^']*'|[^\s"']*)\s*$/;
  const code = nonEmpty.map((l) => l.trim()).filter((c) => !/^(#|\/\/|--|;)/.test(c));
  const envOnly = code.length >= 2 && code.every((c) => ENV_LINE.test(c));
  let counted = 0, shell = 0, loose = 0, yamlL = 0, yamlProse = 0, iniL = 0, tomlL = 0, prose = 0, md = 0;
  for (const l of nonEmpty) {
    const s = l.trim();
    if (/^#{1,6}\s+\S/.test(s) && /^#{1,6}\s+[A-ZÇĞİÖŞÜa-zçğıöşü]/.test(s) && s.split(/\s+/).length >= 3 && !/[=$|;]/.test(s)) md += 1;
    if (/^(#|\/\/|--|;)/.test(s)) continue;
    counted++;
    const sh = envOnly ? 0 : shellLine(s);
    const isShell = sh === 2;
    if (isShell) shell++;
    else if (sh === 1) loose++;
    const ym = /^(- )?["']?[\w.\-\/@$]+["']?:(\s+(.*))?$/.exec(s);
    if (ym || /^- \S/.test(s) || s === "---") {
      yamlL++;
      if (ym && ym[3] && ym[3].split(/\s+/).length >= 4 && !/^["'[{|>]/.test(ym[3])) yamlProse++;
    }
    if (/^\[[^\]]+\]$/.test(s)) {
      iniL++;
      tomlL++;
    } else if (/^[\w.\-]+\s*=\s*\S/.test(s)) {
      iniL++;
      if (/^[\w.\-]+\s*=\s*("|'|\[|\{|\d|true\b|false\b)/.test(s)) tomlL++;
    }
    const words = s.split(/\s+/).length;
    if (!isShell && words >= 5 && !/[;{}()=<>[\]$|\\`]|\s-{1,2}\w|\/\w/.test(s) && /[a-zçğıöşü]{3,}/i.test(s)) prose++;
    if (/^([-*+]|\d+\.)\s+(\[[ xX]\]\s+)?[^\s:]+\s+\S+\s+\S+/.test(s) && !/[;{}=$|]/.test(s)) md += 1;
    if (/\[[^\]]+\]\((https?:|\.?\/|#)[^)]*\)|\[\[[^\]]+\]\]|\*\*[^*\s][^*]*\*\*|^>\s+\S/.test(s)) md += 2;
    if (/^\|.*\|$/.test(s)) md += 1;
    if (/^[-*+] [A-ZÇĞİÖŞÜ][^:]{0,30}:\s+\S/.test(l) && !/[;{}=$|]/.test(s)) md += 1;
  }
  if (!counted) return null;

  if (shell) shell += loose;
  if (envOnly) add("ini", Math.min(counted * 3, 18));
  if (shell) {
    add("bash", shell * 4);
    if (shell / counted >= 0.6) add("bash", 4);
  }
  if (counted >= 2 && yamlL / counted >= 0.7 && yamlProse / yamlL < 0.4 && !/[;{]\s*$/m.test(text))
    add("yaml", Math.min(yamlL * (yamlL / counted >= 0.9 ? 2 : 1.5), 24));
  if (counted >= 2 && iniL / counted >= 0.7) {
    add("ini", Math.min(iniL * 1.5, 18));
    if (tomlL / counted >= 0.6) add("toml", Math.min(tomlL * 1.6, 20));
  }

  const ranked = Object.keys(S)
    .map((lang) => ({ lang, score: S[lang] }))
    .sort((a, b) => b.score - a.score || RULE_ORDER.indexOf(a.lang) - RULE_ORDER.indexOf(b.lang));
  if (!ranked.length) return null;
  const best = ranked[0];
  const second = ranked[1] ? ranked[1].score : 0;

  if (prose / counted >= 0.5 && best.score < 20) return null;
  if (md >= 3 && md * 2 >= best.score) return null;

  const need = single ? Math.max(minScore, 8) : minScore;
  if (best.score < need) return null;
  return { lang: best.lang, score: best.score, second, confident: best.score >= need * 1.5 && best.score - second >= 3 };
}

const FENCE_RE = /^(\s*)(`{3,}|~{3,})(.*)$/;

function parseFence(text) {
  const m = FENCE_RE.exec(text);
  if (!m) return null;
  const info = m[3].trim();
  if (m[2][0] === "`" && info.includes("`")) return null;
  const sp = info.search(/\s/);
  return {
    indent: m[1],
    fence: m[2],
    lang: sp < 0 ? info : info.slice(0, sp),
    rest: sp < 0 ? "" : info.slice(sp + 1).trim(),
  };
}

function isCloseFence(text, open) {
  const m = FENCE_RE.exec(text);
  return !!m && m[2][0] === open.fence[0] && m[2].length >= open.fence.length && m[3].trim() === "";
}

function blockAt(ad, lineNo) {
  const n = ad.count;
  let open = null;
  let start = -1;
  let i = 0;
  if (n && ad.line(0) === "---") {
    for (i = 1; i < n; i++) if (/^(---|\.\.\.)\s*$/.test(ad.line(i))) break;
    i++;
  }
  for (; i < n; i++) {
    const ln = ad.line(i);
    if (!open) {
      const f = parseFence(ln);
      if (f) {
        open = f;
        start = i;
      }
      if (i >= lineNo && !open) return null;
    } else if (isCloseFence(ln, open)) {
      if (lineNo >= start && lineNo <= i) return makeBlock(ad, open, start, i);
      open = null;
      if (i >= lineNo) return null;
    }
  }
  if (open && lineNo >= start) return makeBlock(ad, open, start, -1);
  return null;
}

function makeBlock(ad, f, start, end) {
  const last = end < 0 ? ad.count - 1 : end - 1;
  const lines = [];
  for (let i = start + 1; i <= last; i++) {
    const ln = ad.line(i);
    lines.push(f.indent && ln.startsWith(f.indent) ? ln.slice(f.indent.length) : ln);
  }
  return { start, end, indent: f.indent, fence: f.fence, lang: f.lang, rest: f.rest, code: lines.join("\n") };
}

function isInsideCodeOrFrontmatter(ad, lineNo) {
  if (ad.count && ad.line(0) === "---") {
    for (let i = 1; i < ad.count; i++) {
      if (/^(---|\.\.\.)\s*$/.test(ad.line(i))) {
        if (lineNo <= i) return true;
        break;
      }
    }
  }
  return !!blockAt(ad, lineNo);
}

function editorAd(editor) {
  return {
    get count() {
      return editor.lineCount();
    },
    line: (i) => editor.getLine(i),
    replaceLines(a, b, text) {
      editor.replaceRange(text, { line: a, ch: 0 }, { line: b, ch: editor.getLine(b).length });
    },
  };
}

function cmAd(view) {
  return {
    get count() {
      return view.state.doc.lines;
    },
    line: (i) => view.state.doc.line(i + 1).text,
    replaceLines(a, b, text) {
      const d = view.state.doc;
      view.dispatch({ changes: { from: d.line(a + 1).from, to: d.line(b + 1).to, insert: text } });
    },
  };
}

function fenceFor(code) {
  let max = 2;
  const re = /`{3,}/g;
  let m;
  while ((m = re.exec(code))) max = Math.max(max, m[0].length);
  return "`".repeat(max + 1);
}

function dedent(code) {
  const lines = code.replace(/\r\n?/g, "\n").split("\n");
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  let min = Infinity;
  for (const l of lines) {
    if (!l.trim()) continue;
    const m = /^[ \t]*/.exec(l)[0].length;
    if (m < min) min = m;
  }
  if (!isFinite(min) || min === 0) return lines.join("\n");
  return lines.map((l) => l.slice(Math.min(min, /^[ \t]*/.exec(l)[0].length))).join("\n");
}

function buildBlock(code, langId, indent) {
  indent = indent || "";
  const fence = fenceFor(code);
  const body = code
    .split("\n")
    .map((l, i) => (l ? indent + l : l))
    .join("\n");
  return fence + (langId || "") + "\n" + body + "\n" + indent + fence;
}

function slugName(s) {
  return String(s || "")
    .replace(/\.[^.]+$/, "")
    .replace(/[\\/:*?"<>|#^[\]]+/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

class LangModal extends SuggestModal {
  constructor(app, opts) {
    super(app);
    this.opts = opts;
    this.setPlaceholder(t("langModal.placeholder"));
    this.setInstructions([
      { command: "↑↓", purpose: t("langModal.select") },
      { command: "↵", purpose: t("langModal.apply") },
      { command: "esc", purpose: t("langModal.cancel") },
    ]);
  }
  getSuggestions(q) {
    q = q.trim().toLowerCase();
    const { current, detected } = this.opts;
    let list = LANGS.slice();
    const pin = [];
    if (detected && langOf(detected)) pin.push(langOf(detected));
    list = pin.concat(list.filter((l) => !pin.includes(l)));
    let out = list
      .filter((l) => !q || l.id.includes(q) || l.label.toLowerCase().includes(q) || l.aliases.some((a) => a.includes(q)))
      .map((l) => ({ id: l.id, label: l.label, detected: detected && langOf(detected) === l, current: current && langOf(current) === l }));
    if (q && !LANG_BY_KEY.has(q) && /^[\w#+.-]+$/.test(q)) out.push({ id: q, label: t("langModal.useTag", { tag: q }), custom: true });
    if (!q && current) out.push({ id: "", label: t("langModal.removeTag"), remove: true });
    return out;
  }
  renderSuggestion(item, el) {
    el.addClass("sc-lang-item");
    el.createSpan({ text: item.label, cls: "sc-lang-name" });
    const meta = el.createSpan({ cls: "sc-lang-meta" });
    if (item.detected) meta.createSpan({ text: t("langModal.detected"), cls: "sc-tag sc-tag-accent" });
    if (item.current) meta.createSpan({ text: t("langModal.current"), cls: "sc-tag" });
    if (!item.custom && !item.remove) meta.createSpan({ text: item.id, cls: "sc-lang-id" });
  }
  onChooseSuggestion(item) {
    this.opts.onChoose(item.id);
  }
}

class CodeFileSuggest extends FuzzySuggestModal {
  constructor(app, plugin, onChoose) {
    super(app);
    this.plugin = plugin;
    this.onChoose = onChoose;
    this.setPlaceholder(t("codeFileSuggest.placeholder"));
  }
  getItems() {
    return this.app.vault.getFiles().filter((f) => this.plugin.isCodeExt(f.extension));
  }
  getItemText(f) {
    return f.path;
  }
  onChooseItem(f) {
    this.onChoose(f);
  }
}

function badPath(s) {
  return /^[\\/]/.test(s) || /^[A-Za-z]:/.test(s) || s.split(/[\\/]/).some((p) => p.trim() === ".." || p.trim() === ".");
}

function targetPath(folder, rawName, lang) {
  folder = String(folder || "").trim();
  rawName = String(rawName || "").trim();
  if (badPath(folder) || badPath(rawName)) return { error: "bad" };
  let name = rawName
    .split("/")
    .map((p) => p.trim().replace(/[\\:*?"<>|]/g, "-"))
    .filter(Boolean)
    .join("/");
  if (!name) return { error: "empty" };
  const l = langOf(lang);
  if (!/\.[\w-]+$/.test(name) && l) name += "." + l.ext;
  return { path: normalizePath(folder ? `${folder}/${name}` : name) };
}

function parentOf(path) {
  return path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : "";
}

class SaveModal extends Modal {
  constructor(plugin, opts) {
    super(plugin.app);
    this.plugin = plugin;
    this.opts = opts;
    this.lang = langOf(opts.lang) ? langOf(opts.lang).id : opts.lang || "text";
    this.folder = plugin.settings.codeFolder;
    this.linkMode = opts.canLink ? plugin.settings.saveLinkMode : "none";
    this.name = plugin.suggestFileName(opts.code, this.lang, opts.sourcePath, this.folder);
  }
  onOpen() {
    const { contentEl } = this;
    this.titleEl.setText(t("save.title"));
    contentEl.addClass("sc-save");

    let nameInput;
    new Setting(contentEl).setName(t("common.fileName")).addText((txt) => {
      nameInput = txt;
      txt.setValue(this.name).onChange((v) => (this.name = v));
      txt.inputEl.addClass("sc-wide");
      setTimeout(() => {
        txt.inputEl.focus();
        const dot = this.name.lastIndexOf(".");
        txt.inputEl.setSelectionRange(0, dot > 0 ? dot : this.name.length);
      }, 0);
    });
    new Setting(contentEl).setName(t("common.language")).addDropdown((d) => {
      for (const l of LANGS) d.addOption(l.id, l.label);
      if (!langOf(this.lang)) d.addOption(this.lang, this.lang);
      d.setValue(this.lang).onChange((v) => {
        this.lang = v;
        const l = langOf(v);
        if (l && nameInput) {
          const base = this.name.replace(/\.[^.]+$/, "");
          this.name = base + "." + l.ext;
          nameInput.setValue(this.name);
        }
      });
    });
    new Setting(contentEl)
      .setName(t("common.folder"))
      .setDesc(t("save.folderDesc"))
      .addText((txt) => txt.setValue(this.folder).onChange((v) => (this.folder = v.trim())));
    if (this.opts.canLink) {
      new Setting(contentEl).setName(t("save.inNote")).addDropdown((d) =>
        d
          .addOption("below", t("link.below"))
          .addOption("replace", t("link.replace"))
          .addOption("none", t("link.none"))
          .setValue(this.linkMode)
          .onChange((v) => (this.linkMode = v))
      );
    }
    const err = contentEl.createDiv({ cls: "sc-error" });
    new Setting(contentEl).addButton((b) =>
      b
        .setButtonText(t("common.save"))
        .setCta()
        .onClick(() => this.submit(err))
    );
    this.scope.register([], "Enter", (e) => {
      e.preventDefault();
      this.submit(err);
      return false;
    });
  }
  async submit(err) {
    err.setText("");
    const target = targetPath(this.folder, this.name, this.lang);
    if (target.error === "empty") return err.setText(t("save.emptyName"));
    if (target.error) {
      new Notice(t("save.badPath"));
      return err.setText(t("save.badPath"));
    }
    const path = target.path;
    if (this.app.vault.getAbstractFileByPath(path)) return err.setText(t("save.exists", { path }));
    try {
      await this.plugin.ensureFolder(parentOf(path));
      const code = this.opts.code.endsWith("\n") ? this.opts.code : this.opts.code + "\n";
      const file = await this.app.vault.create(path, code);
      this.close();
      new Notice(t("save.saved", { path }));
      if (this.opts.onSaved) this.opts.onSaved(file, this.linkMode);
    } catch (e) {
      err.setText(t("save.failed", { error: e && e.message ? e.message : e }));
    }
  }
  onClose() {
    this.contentEl.empty();
  }
}

class NewFileModal extends Modal {
  constructor(plugin) {
    super(plugin.app);
    this.plugin = plugin;
    this.lang = "bash";
    this.name = "";
    this.folder = plugin.settings.codeFolder;
  }
  onOpen() {
    const { contentEl } = this;
    this.titleEl.setText(t("newFile.title"));
    new Setting(contentEl).setName(t("common.fileName")).addText((txt) => {
      txt.setPlaceholder(t("newFile.placeholder")).onChange((v) => (this.name = v));
      txt.inputEl.addClass("sc-wide");
      setTimeout(() => txt.inputEl.focus(), 0);
    });
    new Setting(contentEl).setName(t("common.language")).setDesc(t("newFile.langDesc")).addDropdown((d) => {
      for (const l of LANGS) if (this.plugin.isCodeExt(l.ext)) d.addOption(l.id, l.label);
      d.setValue(this.lang).onChange((v) => (this.lang = v));
    });
    new Setting(contentEl).setName(t("common.folder")).addText((txt) => txt.setValue(this.folder).onChange((v) => (this.folder = v.trim())));
    const err = contentEl.createDiv({ cls: "sc-error" });
    const go = async () => {
      err.setText("");
      const target = targetPath(this.folder, this.name, this.lang);
      if (target.error === "empty") return err.setText(t("newFile.enterName"));
      if (target.error) {
        new Notice(t("save.badPath"));
        return err.setText(t("save.badPath"));
      }
      const path = target.path;
      if (this.app.vault.getAbstractFileByPath(path)) return err.setText(t("newFile.exists", { path }));
      try {
        await this.plugin.ensureFolder(parentOf(path));
        const start = this.lang === "bash" ? "#!/usr/bin/env bash\nset -euo pipefail\n\n" : this.lang === "go" ? "package main\n\nfunc main() {\n}\n" : "";
        const file = await this.app.vault.create(path, start);
        this.close();
        await this.plugin.openCodeFile(file, "edit");
      } catch (e) {
        const msg = t("newFile.failed", { error: e && e.message ? e.message : e });
        new Notice(msg);
        err.setText(msg);
      }
    };
    new Setting(contentEl).addButton((b) => b.setButtonText(t("newFile.create")).setCta().onClick(go));
    this.scope.register([], "Enter", (e) => {
      e.preventDefault();
      go();
      return false;
    });
  }
  onClose() {
    this.contentEl.empty();
  }
}

const SHELL_LANGS = new Set(["", "bash", "sh", "shell", "zsh", "console", "shellscript", "terminal"]);
function isShellLang(lang) {
  return SHELL_LANGS.has(String(lang || "").toLowerCase());
}

const PROMPT_RE = /^\s*(?:\([^()\n]+\)\s*)?(?:\[[^\]\n]+\]\s?[$#%]\s*|[\w.-]+@[\w.-]+(?::[^$#%\n]*|\s+[^\s$#%]+)?\s?[$#%]\s*|(?:ba|z|k|da|fi)?sh-\d+(?:\.\d+)*[$#%]\s+|PS(?:\s+[^>\n]*)?>\s*|➜\s+\S+(?:\s+git:\([^)\n]*\))?(?:\s+✗)?\s+|[❯›]\s+|[$%]\s+)/;

function parseCommands(code) {
  const lines = String(code).replace(/\r\n?/g, "\n").split("\n");
  const firstPrompt = lines.findIndex((l) => PROMPT_RE.test(l));
  const out = [];
  let mixed = false;
  let cont = false;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    let keep = null;
    if (firstPrompt < 0) keep = l;
    else if (PROMPT_RE.test(l)) keep = l.replace(PROMPT_RE, "");
    else if (cont) keep = l.replace(/^\s*>\s?/, "");
    else if (l.trim()) {
      mixed = true;
      if (i < firstPrompt) keep = l;
    }
    if (keep !== null) out.push(keep);
    cont = keep !== null && /\\$/.test(keep);
  }
  while (out.length && !out[0].trim()) out.shift();
  while (out.length && !out[out.length - 1].trim()) out.pop();
  return { cmd: out.join("\n"), mixed };
}

function cleanCommands(code) {
  return parseCommands(code).cmd;
}

const PLACEHOLDER_RE = /<[A-Za-zÇĞİÖŞÜçğıöşü][\w.\-çğıöşüÇĞİÖŞÜ]*(?:[ -][\w.\-çğıöşüÇĞİÖŞÜ]+)*>/g;
const HTML_TAGS = new Set(
  ("html head body div span p br hr ul ol li dl dt dd table thead tbody tfoot tr td th caption colgroup col h1 h2 h3 h4 h5 h6 " +
    "img script style link meta title base form input button select option optgroup textarea label fieldset legend section article " +
    "header footer nav main aside pre code blockquote iframe svg canvas video audio source track picture figure figcaption details " +
    "summary dialog noscript template slot small sub sup kbd abbr em strong b i u s q a mark time data var cite dfn samp ins del " +
    "bdi bdo wbr ruby rt rp address hgroup center font tt big strike marquee nobr object embed param map area meter progress " +
    "output datalist search menu").split(" ")
);
const HTML_ONLY_TAGS = new Set(
  ("html head div span p br hr ul ol li dl dt dd thead tbody tfoot tr td th colgroup h1 h2 h3 h4 h5 h6 meta textarea fieldset " +
    "legend article nav aside pre blockquote iframe svg canvas figure figcaption noscript sub sup kbd abbr em strong wbr bdi bdo " +
    "rt rp hgroup center tt strike marquee nobr optgroup datalist").split(" ")
);
const HTML_CONTEXT_RE = /<\/[A-Za-z][\w-]*\s*>|<[A-Za-z][\w-]*(?:\s[^<>]*)?\/>|<!doctype\b/i;

function quotedRanges(s) {
  const ranges = [];
  let q = null;
  let start = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q === "'") {
      if (c === "'") {
        ranges.push([start, i]);
        q = null;
      }
    } else if (c === "\\") i++;
    else if (q === '"') {
      if (c === '"') {
        ranges.push([start, i]);
        q = null;
      }
    } else if (c === "'" || c === '"') {
      q = c;
      start = i;
    }
  }
  return ranges;
}

function findPlaceholders(cmd) {
  const s = String(cmd);
  const re = new RegExp(PLACEHOLDER_RE.source, "g");
  const all = [];
  let m;
  while ((m = re.exec(s))) all.push({ text: m[0], index: m.index, name: m[0].slice(1, -1).toLowerCase() });
  if (!all.length) return [];
  const quoted = quotedRanges(s);
  const html = HTML_CONTEXT_RE.test(s) || all.some((p) => HTML_ONLY_TAGS.has(p.name));
  const found = all.filter((p) => {
    if (s[p.index - 1] === "<") return false;
    if (HTML_TAGS.has(p.name) && (html || HTML_ONLY_TAGS.has(p.name))) return false;
    return !quoted.some(([a, b]) => p.index > a && p.index < b);
  });
  return Array.from(new Set(found.map((p) => p.text)));
}

const DANGER = [
  [/\brm\s+(-\w*[rf]\w*\s+)*\S|\bxargs\s+(?:-\S+\s+)*rm\b/, "danger.rm"],
  [/\bfind\b[^\n|;&]{0,200}\s-(?:delete\b|exec(?:dir)?\s+(?:\S*\/)?rm\b)/, "danger.findDelete"],
  [/\bmv\b(?:\s+[^\s|;&<>]+){0,20}\s+\/dev\/null\b/, "danger.mvNull"],
  [/\b(?:shred|srm)\b|\btruncate\s+(?:-\S+\s+)*(?:-s\s*|--size[= ]?)0\b/, "danger.wipeFile"],
  [/\b(reboot|shutdown|poweroff|halt)\b|\binit\s+[06]\b/, "danger.reboot"],
  [/\bipmitool\b.*\bpower\s+(cycle|off|reset|soft)\b|\bchassis\s+power\b/, "danger.power"],
  [/\b(mkfs(\.\w+)?|wipefs|fdisk|parted|sgdisk)\b|\bdd\s+if=|\bdd\b[^\n|;&]{0,200}\sof=\/dev\/|\bdiskutil\s+(?:erase\w*|zeroDisk|randomDisk|secureErase|partitionDisk|reformat|apfs\s+(?:delete|erase)\w*)\b/, "danger.disk"],
  [/>\s*\/dev\/(?:sd|hd|vd|xvd|nvme|mmcblk|disk|rdisk)\w*/, "danger.rawDisk"],
  [/(?:^|[^>&0-9])>\s*\/(?:etc|boot|bin|sbin|usr|lib|System)\//m, "danger.sysFile"],
  [/([\w:.]{1,40})\s*\(\s*\)\s*\{[^}]{0,40}\1\s*\|\s*\1\s*&/, "danger.forkBomb"],
  [/\b(?:curl|wget|fetch)\b[^\n;&]{0,200}\|\s*(?:sudo\s+(?:-\S+\s+)*)?(?:env\s+)?(?:(?:ba|z|da|k|fi)?sh|python\d*(?:\.\d+)?|perl|ruby|node)\b|\b(?:(?:ba|z|k)?sh|source)\s+(?:-\S+\s+)*<\(\s*(?:curl|wget)\b|\b(?:(?:ba|z|k)?sh)\s+-c\s+["']?\$\(\s*(?:curl|wget)\b/, "danger.pipeShell"],
  [/\b(?:kubectl|kubecolor|oc)\b[^\n|;&]{0,200}?\s(?:delete|drain|cordon|replace\s+--force)(?=\s|$)|(?:^|[;&|(]|\bsudo\s)\s*k\s+[^\n|;&]{0,200}?\b(?:delete|drain|cordon)(?=\s|$)/m, "danger.k8s"],
  [/\bhelm\s+(uninstall|delete|rollback)\b/, "danger.helm"],
  [/\bdctl\b.*\b(delete|remove|destroy|reset|configure\s+--master|bundle\s+distribution\s+start|upgrade\s+(\w+\s+)?start)\b/, "danger.dctl"],
  [/\bdocker\s+(rm|rmi|system\s+prune|volume\s+rm)\b|\bdocker\s+(?:container|image|volume|network|system|builder|buildx)\s+(?:rm|prune)\b|\bdocker(?:-compose|\s+compose)\b[^\n|;&]{0,200}\sdown\b[^\n|;&]{0,200}\s(?:-v|--volumes|--rmi)\b|\b(podman|crictl)\s+(rm|rmi)\b/, "danger.container"],
  [/\b(?:terraform|tofu|terragrunt)\b[^\n|;&]{0,200}\s(?:destroy\b|apply\b[^\n|;&]{0,200}\s-destroy\b)|\bpulumi\s+(?:destroy|down)\b/, "danger.iac"],
  [/\bgcloud\b[^\n|;&]{0,200}\s(?:delete|remove)(?=\s|$)|\bgsutil\b[^\n|;&]{0,200}\s(?:rm|rb)\b|\baws\b[^\n|;&]{0,200}\s(?:delete-[\w-]+|terminate-instances|rb|rm)(?=\s|$)|\baz\b[^\n|;&]{0,200}\sdelete(?=\s|$)/, "danger.cloud"],
  [/\bgit\b[^\n|;&]{0,200}?\spush\b[^\n|;&]{0,200}\s(?:--force(?:-with-lease|-if-includes)?\b|-[a-zA-Z]*f[a-zA-Z]*\b|\+\S)/, "danger.gitForce"],
  [/\bgit\b[^\n|;&]{0,200}?\sreset\b[^\n|;&]{0,200}\s--hard\b|\bgit\b[^\n|;&]{0,200}?\sclean\b[^\n|;&]{0,200}\s(?:-[a-zA-Z]*f|--force\b)/, "danger.gitDiscard"],
  [/\b(?:drop\s+(?:table|database|schema)|truncate\s+table)\b|\bdropdb\b|\.dropDatabase\s*\(/i, "danger.sql"],
  [/\bsystemctl\s+(stop|restart|disable|mask|kill)\b/, "danger.service"],
  [/\b(kill\s+-9|killall|pkill)\b|\bkill\s+(?:-s\s+|-)(?:SIG)?KILL\b/, "danger.kill"],
  [/\bkill\s+(?:-\S+\s+)+-1(?=\s*(?:$|[;&|)]))/m, "danger.killAll"],
  [/\bcrontab\b[^\n|;&]{0,200}\s-\w*r/, "danger.crontab"],
  [/\b(iptables\s+-F|nft\s+flush|firewall-cmd\s+.*--remove)\b|\bip6?tables\b[^\n|;&]{0,200}\s(?:--flush|-X|-P\s+\w+\s+DROP)\b|\bufw\s+(?:disable|reset)\b|\bpfctl\s+-d\b/, "danger.firewall"],
  [/\b(userdel|passwd|chpasswd)\b/, "danger.user"],
  [/\bchmod\s+(-R\s+)?777\b|\bchown\s+-R\b|\bchmod\b[^\n|;&]{0,200}\s(?:0?777|a\+rwx)(?=\s|$)|\bch(?:own|grp)\b[^\n|;&]{0,200}\s(?:-\w*R\w*|--recursive)\b|\bchmod\b[^\n|;&]{0,200}\s(?:-\w*R\w*|--recursive)\b[^\n|;&]{0,200}\s\/(?=\s|$)/m, "danger.perms"],
  [/\b(pgbackrest\s+.*\b(restore|stanza-delete)|patronictl\s+(failover|switchover|remove|reinit))\b/, "danger.db"],
  [/\brpm\s+(-e|--erase|-U|-i)|\b(yum|dnf|apt(-get)?)\s+(remove|erase|purge|install|update|upgrade)\b/, "danger.pkg"],
];
function findDangers(cmd) {
  const found = [];
  for (const [re, key] of DANGER) {
    const why = t(key);
    if (re.test(cmd) && !found.includes(why)) found.push(why);
  }
  return found;
}

class RunModal extends Modal {
  constructor(plugin, opts) {
    super(plugin.app);
    this.plugin = plugin;
    this.opts = opts;
  }
  onOpen() {
    const { contentEl } = this;
    this.titleEl.setText(this.opts.title || t("common.runInTerminal"));
    contentEl.addClass("sc-run");

    if (this.opts.notes && this.opts.notes.length) {
      const noteEl = contentEl.createDiv({ cls: "sc-run-note" });
      this.opts.notes.forEach((n) => noteEl.createDiv({ text: n }));
    }
    const warnEl = contentEl.createDiv({ cls: "sc-run-warn" });
    const phEl = contentEl.createDiv({ cls: "sc-run-ph" });
    const ta = contentEl.createEl("textarea", { cls: "sc-run-input" });
    ta.spellcheck = false;
    ta.value = this.opts.cmd;
    ta.rows = Math.min(14, Math.max(3, this.opts.cmd.split("\n").length + 1));
    const info = contentEl.createDiv({ cls: "sc-run-info" });

    const btns = contentEl.createDiv({ cls: "sc-run-btns" });
    const runBtn = btns.createEl("button", { text: t("run.run"), cls: "mod-cta" });
    const pasteBtn = btns.createEl("button", { text: t("run.paste") });
    const cancel = btns.createEl("button", { text: t("common.cancel") });

    const refresh = () => {
      const cmd = ta.value;
      const dangers = findDangers(cmd);
      const ph = findPlaceholders(cmd);
      warnEl.empty();
      if (dangers.length) {
        warnEl.createSpan({ text: t("run.careful") });
        warnEl.createSpan({ text: dangers.join(" · ") });
      }
      warnEl.toggleClass("is-visible", dangers.length > 0);
      runBtn.toggleClass("mod-warning", dangers.length > 0);
      runBtn.toggleClass("mod-cta", dangers.length === 0);
      phEl.empty();
      if (ph.length) {
        phEl.createSpan({ text: t("run.fill") });
        ph.forEach((p) => {
          const b = phEl.createEl("button", { text: p, cls: "sc-ph" });
          b.onclick = () => selectPh(p);
        });
      }
      phEl.toggleClass("is-visible", ph.length > 0);
      runBtn.disabled = ph.length > 0 || !cmd.trim();
      const n = cmd.split("\n").filter((l) => l.trim() && !/^\s*#/.test(l)).length;
      info.setText(ph.length ? t("run.fillFirst") : t("run.info", { n }));
    };
    const selectPh = (p) => {
      const i = ta.value.indexOf(p);
      if (i < 0) return;
      ta.focus();
      ta.setSelectionRange(i, i + p.length);
    };
    ta.addEventListener("input", refresh);
    ta.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (!runBtn.disabled) go(true);
      } else if (e.key === "Tab" && !e.shiftKey) {
        const ph = findPlaceholders(ta.value);
        if (ph.length) {
          e.preventDefault();
          selectPh(ph[0]);
        }
      }
    });
    const go = (enter) => {
      const cmd = ta.value.replace(/\s+$/, "");
      if (!cmd.trim()) return;
      this.close();
      this.opts.onRun(cmd, enter);
    };
    runBtn.onclick = () => go(true);
    pasteBtn.onclick = () => go(false);
    cancel.onclick = () => this.close();
    refresh();
    setTimeout(() => {
      const ph = findPlaceholders(ta.value);
      if (ph.length) selectPh(ph[0]);
      else {
        ta.focus();
        ta.setSelectionRange(ta.value.length, ta.value.length);
      }
    }, 0);
  }
  onClose() {
    this.contentEl.empty();
  }
}

const PRISM_NAME = {
  bash: "bash", go: "go", python: "python", yaml: "yaml", json: "json", javascript: "javascript", typescript: "typescript",
  sql: "sql", dockerfile: "docker", html: "markup", xml: "markup", css: "css", java: "java", c: "c", cpp: "cpp",
  csharp: "csharp", rust: "rust", php: "php", ruby: "ruby", powershell: "powershell", toml: "toml", ini: "ini",
  nginx: "nginx", diff: "diff", lua: "lua", makefile: "makefile",
};
let prismPromise = null;
function getPrism() {
  if (!prismPromise) {
    const { loadPrism } = require("obsidian");
    prismPromise = loadPrism ? loadPrism().catch(() => null) : Promise.resolve(window.Prism || null);
  }
  return prismPromise;
}

function flattenTokens(tokens, out, pos, classes) {
  for (const tok of tokens) {
    if (typeof tok === "string") {
      if (classes && tok.length) out.push([pos, pos + tok.length, classes]);
      pos += tok.length;
    } else {
      let cls = (classes ? classes + " " : "token ") + tok.type;
      if (tok.alias) cls += " " + (Array.isArray(tok.alias) ? tok.alias.join(" ") : tok.alias);
      const content = Array.isArray(tok.content) ? tok.content : [tok.content];
      pos = flattenTokens(content, out, pos, cls);
    }
  }
  return pos;
}

function loadCM() {
  try {
    return {
      V: require("@codemirror/view"),
      S: require("@codemirror/state"),
      C: require("@codemirror/commands"),
      L: require("@codemirror/language"),
      Q: require("@codemirror/search"),
    };
  } catch (e) {
    console.warn("[ecu-codekit] Could not load CodeMirror modules", e);
    return null;
  }
}

function prismHighlight(cm, getLang) {
  const { V, S } = cm;
  const refresh = S.StateEffect.define();
  return V.ViewPlugin.fromClass(
    class {
      constructor(view) {
        this.view = view;
        this.decorations = V.Decoration.none;
        this.version = 0;
        this.schedule(0);
      }
      update(u) {
        if (u.transactions.some((tr) => tr.effects.some((e) => e.is(refresh)))) return;
        if (u.docChanged) {
          this.decorations = this.decorations.map(u.changes);
          this.schedule(150);
        }
      }
      schedule(ms) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.compute(), ms);
      }
      async compute() {
        const ver = ++this.version;
        const Prism = await getPrism();
        if (ver !== this.version || !this.view.dom.isConnected) return;
        const name = PRISM_NAME[langOf(getLang()) ? langOf(getLang()).id : getLang()];
        const grammar = Prism && name && Prism.languages[name];
        const b = new S.RangeSetBuilder();
        const text = this.view.state.doc.toString();
        if (grammar && text.length < 1500000) {
          const parts = [];
          try {
            flattenTokens(Prism.tokenize(text, grammar), parts, 0, "");
          } catch (e) {
          }
          for (const [from, to, cls] of parts) if (to > from) b.add(from, to, V.Decoration.mark({ class: cls }));
        }
        this.decorations = b.finish();
        this.view.dispatch({ effects: refresh.of(null) });
      }
      destroy() {
        clearTimeout(this.timer);
        this.version++;
      }
    },
    { decorations: (v) => v.decorations }
  );
}

function escAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function cspPath(url) {
  return url.replace(/[^\w\-.~%/!$&()*+=:@]/g, (c) => (c.charCodeAt(0) < 128 ? "%" + c.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0") : encodeURIComponent(c)));
}

function previewCsp(dir, scripts, network) {
  const local = dir ? [cspPath(dir)] : [];
  const net = network ? ["https:", "http:"] : [];
  const list = (...xs) => [...local, ...xs, ...net].join(" ");
  const rules = ["default-src 'none'", `img-src ${list("data:", "blob:")}`, `media-src ${list("data:", "blob:")}`, `font-src ${list("data:")}`, `style-src ${list("'unsafe-inline'")}`];
  if (scripts) rules.push(`script-src ${list("'unsafe-inline'", "'unsafe-eval'")}`);
  rules.push(scripts && network ? "connect-src https: http: wss: ws:" : "connect-src 'none'");
  rules.push(network ? "frame-src https: http:" : "frame-src 'none'");
  rules.push(network ? "form-action https: http:" : "form-action 'none'");
  return rules.join("; ");
}

function previewDoc(html, url, scripts, network) {
  const dir = url ? url.replace(/[?#].*$/, "").replace(/[^/]*$/, "") : "";
  let prefix = `<meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${escAttr(previewCsp(dir, scripts, network))}">`;
  if (dir && /\s(?:src|href)=["']?(?![a-z][\w+.-]*:|\/\/|#|\/)[^"'\s>]/i.test(html)) prefix += `<base href="${escAttr(dir)}">`;
  const m = /^\s*(?:<!--(?:[^-]|-(?!->))*-->\s*)*<!doctype[^>]*>/i.exec(html);
  return m ? m[0] + prefix + html.slice(m[0].length) : prefix + html;
}

class HtmlPreviewView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.filePath = null;
    this.scripts = plugin.settings.previewScripts;
    this.reloadTimer = null;
  }
  getViewType() {
    return VIEW_PREVIEW;
  }
  getIcon() {
    return "eye";
  }
  getDisplayText() {
    const f = this.file;
    return f ? t("preview.titleFile", { name: f.name }) : t("preview.title");
  }
  get file() {
    const f = this.filePath && this.app.vault.getAbstractFileByPath(this.filePath);
    return f instanceof TFile ? f : null;
  }
  getState() {
    return { file: this.filePath, scripts: this.scripts };
  }
  async setState(state, result) {
    if (state && state.file) this.filePath = state.file;
    if (state && typeof state.scripts === "boolean") this.scripts = state.scripts;
    await super.setState(state, result);
    this.render();
  }
  async onOpen() {
    this.contentEl.addClass("sc-preview");
    this.addAction("code", t("preview.openSource"), () => this.openSource());
    this.addAction("external-link", t("preview.openExternal"), () => this.openExternal());
    this.scriptBtn = this.addAction("zap", "", () => {
      this.scripts = !this.scripts;
      this.render();
      this.app.workspace.requestSaveLayout();
    });
    this.addAction("refresh-cw", t("preview.reload"), () => this.render());
    this.registerEvent(
      this.app.vault.on("modify", (f) => {
        if (f.path !== this.filePath) return;
        clearTimeout(this.reloadTimer);
        this.reloadTimer = setTimeout(() => this.render(), 300);
      })
    );
    this.registerEvent(
      this.app.vault.on("rename", (f, old) => {
        if (old !== this.filePath) return;
        this.filePath = f.path;
        this.render();
      })
    );
    this.registerEvent(this.app.vault.on("delete", (f) => f.path === this.filePath && this.render()));
    this.render();
  }
  async onClose() {
    clearTimeout(this.reloadTimer);
  }
  render() {
    const el = this.contentEl;
    if (!el) return;
    el.empty();
    if (this.scriptBtn) {
      setIcon(this.scriptBtn, this.scripts ? "zap" : "zap-off");
      this.scriptBtn.setAttr("aria-label", this.scripts ? t("preview.jsOn") : t("preview.jsOff"));
    }
    const f = this.file;
    if (this.leaf.updateHeader) this.leaf.updateHeader();
    if (!f) {
      el.createDiv({ cls: "sc-preview-empty", text: this.filePath ? t("preview.notFound", { path: this.filePath }) : t("preview.noFile") });
      return;
    }
    const token = (this.renderToken = (this.renderToken || 0) + 1);
    this.app.vault.cachedRead(f).then((html) => {
      if (token !== this.renderToken) return;
      const frame = el.createEl("iframe", { cls: "sc-preview-frame" });
      frame.setAttr("sandbox", this.scripts ? "allow-scripts allow-popups allow-modals allow-forms" : "allow-popups");
      frame.setAttr("referrerpolicy", "no-referrer");
      frame.srcdoc = previewDoc(html, this.app.vault.getResourcePath(f), this.scripts, this.plugin.settings.previewNetwork);
    });
  }
  openSource() {
    const f = this.file;
    if (!f) return;
    const open = this.app.workspace.getLeavesOfType(VIEW_CODE).find((l) => l.view.file && l.view.file.path === f.path);
    if (open) return this.app.workspace.revealLeaf(open);
    this.app.workspace.getLeaf("split", "vertical").openFile(f);
  }
  openExternal() {
    const f = this.file;
    if (!f) return;
    if (this.app.openWithDefaultApp) return this.app.openWithDefaultApp(f.path);
    const base = this.app.vault.adapter.getBasePath ? this.app.vault.adapter.getBasePath() : "";
    try {
      window.require("electron").shell.openPath(base + "/" + f.path);
    } catch (e) {
      new Notice(t("preview.externalFailed"));
    }
  }
}

class CodeFileView extends TextFileView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.data = "";
    this.cmMods = loadCM();
    this.editor = null;
    this.readOnly = plugin.settings.fileOpenMode === "readonly";
    this.wrap = false;
    this.applyingExternal = false;
    this.contentEl.addClass("sc-file-view");
    this.barEl = this.contentEl.createDiv({ cls: "sc-file-bar" });
    this.hostEl = this.contentEl.createDiv({ cls: "sc-file-host" });
    this.scope = new Scope(this.app.scope);
    this.scope.register(["Mod"], "f", () => {
      if (this.editor && this.cmMods) this.cmMods.Q.openSearchPanel(this.editor);
      return false;
    });
    this.scope.register(["Mod", "Shift"], "Enter", () => {
      this.runSelection();
      return false;
    });
    this.scope.register(["Mod"], "s", () => false);
  }
  getViewType() {
    return VIEW_CODE;
  }
  getIcon() {
    return "file-code";
  }
  getDisplayText() {
    return this.file ? this.file.name : t("codeView.title");
  }
  canAcceptExtension(ext) {
    return this.plugin.registeredExts.has(String(ext).toLowerCase());
  }
  onload() {
    super.onload();
    this.lockBtn = this.addAction("lock-open", t("codeView.makeReadOnly"), () => this.setReadOnly(!this.readOnly));
    this.addAction("copy", t("codeView.copyAll"), async () => {
      await navigator.clipboard.writeText(this.data);
      new Notice(t("common.copied"));
    });
    this.runBtn = this.addAction("play", t("codeView.runSelection"), () => this.runSelection());
    this.addAction("file-input", t("common.insertIntoNote"), () => this.plugin.insertFileIntoLastNote(this.file));
    this.previewBtn = this.addAction("eye", t("common.previewSide"), () => this.file && this.plugin.openPreview(this.file, "split"));
    this.updateButtons();
  }
  onunload() {
    if (this.editor) this.editor.destroy();
    this.editor = null;
    super.onunload();
  }
  onPaneMenu(menu, source) {
    super.onPaneMenu(menu, source);
    menu.addItem((i) => i.setTitle(this.readOnly ? t("codeView.makeEditable") : t("codeView.makeReadOnly")).setIcon(this.readOnly ? "pencil" : "lock").onClick(() => this.setReadOnly(!this.readOnly)));
    menu.addItem((i) => i.setTitle(this.wrap ? t("codeView.noWrap") : t("codeView.wrap")).setIcon("wrap-text").onClick(() => this.setWrap(!this.wrap)));
    menu.addItem((i) => i.setTitle(t("codeView.search")).setIcon("search").onClick(() => this.editor && this.cmMods.Q.openSearchPanel(this.editor)));
    if (this.isShell())
      menu.addItem((i) => i.setTitle(t("codeView.runScript")).setIcon("terminal-square").onClick(() => this.runWholeScript()));
  }
  lang() {
    if (!this.file) return "text";
    const byExt = langFromExt(this.file.extension);
    if (byExt && byExt !== "text") return byExt;
    const d = detectLanguage(this.data.slice(0, 20000));
    return d ? d.lang : byExt || "text";
  }
  isShell() {
    const l = this.lang();
    return l === "bash";
  }
  indentUnit() {
    const l = this.lang();
    if (/^\t/m.test(this.data) || l === "go" || l === "makefile") return "\t";
    return ["yaml", "json", "html", "xml", "javascript", "typescript", "css", "ruby", "lua"].includes(l) ? "  " : "    ";
  }
  getViewData() {
    return this.editor ? this.editor.state.doc.toString() : this.data;
  }
  setViewData(data, clear) {
    this.data = data;
    if (!this.cmMods) return this.renderFallback();
    if (!this.editor || clear) return this.createEditor(data);
    const cur = this.editor.state.doc.toString();
    if (cur === data) return;
    this.applyingExternal = true;
    this.editor.dispatch({ changes: { from: 0, to: cur.length, insert: data } });
    this.applyingExternal = false;
    this.renderBar();
  }
  clear() {
    this.data = "";
  }
  extensions() {
    const { V, S, C, L, Q } = this.cmMods;
    this.roComp = this.roComp || new S.Compartment();
    this.wrapComp = this.wrapComp || new S.Compartment();
    const unit = this.indentUnit();
    return [
      V.EditorView.editorAttributes.of({ class: "sc-cm" }),
      V.lineNumbers(),
      V.highlightActiveLineGutter(),
      V.highlightSpecialChars(),
      C.history(),
      V.drawSelection(),
      V.dropCursor(),
      S.EditorState.allowMultipleSelections.of(true),
      V.rectangularSelection(),
      V.crosshairCursor(),
      V.highlightActiveLine(),
      L.bracketMatching(),
      L.indentUnit.of(unit),
      S.EditorState.tabSize.of(4),
      Q.highlightSelectionMatches(),
      Q.search({ top: true }),
      V.keymap.of([
        ...C.defaultKeymap,
        ...C.historyKeymap,
        ...Q.searchKeymap,
        C.indentWithTab,
        { key: "Mod-Shift-Enter", run: () => (this.runSelection(), true) },
      ]),
      this.roComp.of([S.EditorState.readOnly.of(this.readOnly), V.EditorView.editable.of(!this.readOnly)]),
      this.wrapComp.of(this.wrap ? V.EditorView.lineWrapping : []),
      prismHighlight(this.cmMods, () => this.lang()),
      V.EditorView.updateListener.of((u) => {
        if (!u.docChanged) return;
        this.data = u.state.doc.toString();
        if (!this.applyingExternal) this.requestSave();
        this.renderBar();
      }),
      V.EditorView.contentAttributes.of({ spellcheck: "false", autocorrect: "off", autocapitalize: "off" }),
    ];
  }
  createEditor(data) {
    const { V, S } = this.cmMods;
    const state = S.EditorState.create({ doc: data, extensions: this.extensions() });
    if (this.editor) this.editor.setState(state);
    else {
      this.hostEl.empty();
      this.editor = new V.EditorView({ state, parent: this.hostEl });
    }
    this.renderBar();
    this.updateButtons();
  }
  renderFallback() {
    this.hostEl.empty();
    const ta = this.hostEl.createEl("textarea", { cls: "sc-file-editor" });
    ta.spellcheck = false;
    ta.value = this.data;
    ta.readOnly = this.readOnly;
    ta.addEventListener("input", () => {
      this.data = ta.value;
      this.requestSave();
    });
    this.renderBar();
  }
  renderBar() {
    const el = this.barEl;
    el.empty();
    el.createSpan({ cls: "sc-file-lang", text: langLabel(this.lang()) });
    const lines = this.editor ? this.editor.state.doc.lines : this.data.split("\n").length;
    el.createSpan({ cls: "sc-file-info", text: t("codeView.lines", { n: lines }) });
    if (this.readOnly) el.createSpan({ cls: "sc-file-badge", text: t("codeView.readOnly") });
    el.createSpan({ cls: "sc-file-hint", text: this.isShell() ? t("codeView.hintShell") : t("codeView.hint") });
  }
  setReadOnly(ro) {
    this.readOnly = ro;
    if (this.editor) {
      const { V, S } = this.cmMods;
      this.editor.dispatch({ effects: this.roComp.reconfigure([S.EditorState.readOnly.of(ro), V.EditorView.editable.of(!ro)]) });
    }
    this.updateButtons();
    this.renderBar();
  }
  setWrap(w) {
    this.wrap = w;
    if (this.editor) this.editor.dispatch({ effects: this.wrapComp.reconfigure(w ? this.cmMods.V.EditorView.lineWrapping : []) });
  }
  updateButtons() {
    if (this.lockBtn) {
      setIcon(this.lockBtn, this.readOnly ? "lock" : "lock-open");
      this.lockBtn.setAttr("aria-label", this.readOnly ? t("codeView.makeEditable") : t("codeView.makeReadOnly"));
    }
    if (this.runBtn) this.runBtn.toggle(this.isShell());
    if (this.previewBtn) this.previewBtn.toggle(canPreview(this.file));
  }
  runSelection() {
    if (!this.editor) return;
    const st = this.editor.state;
    const sel = st.selection.main;
    let text = st.sliceDoc(sel.from, sel.to);
    if (!text.trim()) text = st.doc.lineAt(sel.head).text;
    if (!text.trim()) return new Notice(t("codeView.emptyLine"));
    this.plugin.runInTerminal(text, { source: this.file ? this.file.name : "" });
  }
  runWholeScript() {
    if (!this.file) return;
    const adapter = this.app.vault.adapter;
    const full = adapter.getFullPath ? adapter.getFullPath(this.file.path) : this.file.path;
    this.plugin.runInTerminal(`bash '${full.replace(/'/g, "'\\''")}'`, { force: true, title: t("run.scriptTitle") });
  }
}

function buildEditorExtension(plugin) {
  let V, S;
  try {
    V = require("@codemirror/view");
    S = require("@codemirror/state");
  } catch (e) {
    return null;
  }
  const { ViewPlugin, Decoration, WidgetType } = V;

  class ToolsWidget extends WidgetType {
    constructor(lang, lineFrom) {
      super();
      this.lang = lang;
      this.lineFrom = lineFrom;
    }
    eq(o) {
      return o.lang === this.lang && o.lineFrom === this.lineFrom;
    }
    toDOM(view) {
      const wrap = view.dom.doc.createElement("span");
      wrap.className = "sc-chip-wrap";
      wrap.setAttribute("contenteditable", "false");
      const stop = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };
      wrap.addEventListener("mousedown", stop);
      const btn = (icon, label, action, cls) => {
        const b = wrap.createSpan({ cls: "sc-chip-btn" + (cls ? " " + cls : "") });
        setIcon(b, icon);
        b.setAttr("aria-label", label);
        b.addEventListener("click", (e) => {
          stop(e);
          plugin.chipAction(view, this.lineFrom, action);
        });
      };
      btn("copy", t("common.copy"), "copy");
      if (isShellLang(this.lang)) btn("play", t("common.runInTerminal"), "run", "sc-chip-run");
      btn("languages", this.lang ? t("chip.changeLang", { lang: langLabel(this.lang) }) : t("chip.addLang"), "lang");
      btn("save", t("common.saveAsFile"), "save");
      return wrap;
    }
    ignoreEvent() {
      return true;
    }
  }

  return ViewPlugin.fromClass(
    class {
      constructor(view) {
        this.decorations = this.build(view);
      }
      update(u) {
        if (u.docChanged || u.viewportChanged) this.decorations = this.build(u.view);
      }
      build(view) {
        if (!plugin.settings.chips) return Decoration.none;
        const b = new S.RangeSetBuilder();
        const doc = view.state.doc;
        const from = view.viewport.from;
        const to = view.viewport.to;
        let open = null;
        let startLine = 1;
        if (doc.lines && doc.line(1).text === "---") {
          for (let i = 2; i <= doc.lines; i++)
            if (/^(---|\.\.\.)\s*$/.test(doc.line(i).text)) {
              startLine = i + 1;
              break;
            }
        }
        for (let i = startLine; i <= doc.lines; i++) {
          const line = doc.line(i);
          if (line.from > to) break;
          const txt = line.text;
          if (txt.length > 400 || (txt.indexOf("`") < 0 && txt.indexOf("~") < 0)) continue;
          if (!open) {
            const f = parseFence(txt);
            if (f) {
              open = f;
              if (line.to >= from) b.add(line.to, line.to, Decoration.widget({ widget: new ToolsWidget(f.lang, line.from), side: 1 }));
            }
          } else if (isCloseFence(txt, open)) open = null;
        }
        return b.finish();
      }
    },
    { decorations: (v) => v.decorations }
  );
}

const DEFAULTS = {
  autoWrap: true,
  singleLine: true,
  sensitivity: "normal",
  notify: true,
  chips: true,
  uiLang: "auto",
  readingHeader: true,
  shellFence: "bash",
  codeFolder: "",
  saveLinkMode: "below",
  fileExts: DEFAULT_FILE_EXTS,
  fileOpenMode: "edit",
  confirmRun: false,
  focusTerminal: true,
  previewScripts: false,
  previewNetwork: false,
};
const MIN_SCORE = { hassas: 4, normal: 6, temkinli: 10 };

module.exports = class EcuCodekit extends Plugin {
  async onload() {
    const data = await this.loadData();
    this.settings = Object.assign({}, DEFAULTS, data);
    setUiLang(this.settings.uiLang);
    if (!data || typeof data.codeFolder !== "string") this.settings.codeFolder = defaultCodeFolder(uiLang);
    this.plainPasteAt = 0;
    this.registeredExts = new Set();
    this.watchedWindows = new WeakSet();
    this.lastMarkdownLeaf = null;

    this.registerView(VIEW_CODE, (leaf) => new CodeFileView(leaf, this));
    this.registerView(VIEW_PREVIEW, (leaf) => new HtmlPreviewView(leaf, this));
    for (const [old, now] of Object.entries(LEGACY_VIEWS)) {
      this.registerView(old, (leaf) => (now === VIEW_CODE ? new CodeFileView(leaf, this) : new HtmlPreviewView(leaf, this)));
    }
    this.app.workspace.onLayoutReady(() => {
      this.registerCodeExts();
      this.app.workspace.iterateAllLeaves((leaf) => {
        if (leaf.view && leaf.view.containerEl) this.watchWindow(leaf.view.containerEl.win);
        const st = leaf.getViewState();
        if (LEGACY_VIEWS[st.type]) leaf.setViewState(Object.assign({}, st, { type: LEGACY_VIEWS[st.type] }));
      });
    });

    this.registerEvent(this.app.workspace.on("editor-paste", (evt, editor, info) => this.onPaste(evt, editor, info)));
    this.registerEvent(this.app.workspace.on("editor-menu", (menu, editor, info) => this.onEditorMenu(menu, editor, info)));
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", (leaf) => {
        if (leaf && leaf.view instanceof MarkdownView) this.lastMarkdownLeaf = leaf;
      })
    );
    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file) => {
        if (!(file instanceof TFile)) return;
        if (canPreview(file)) {
          menu.addItem((i) => i.setTitle(t("menu.preview")).setIcon("eye").onClick(() => this.openPreview(file, "tab")));
          menu.addItem((i) => i.setTitle(t("common.previewSide")).setIcon("columns-2").onClick(() => this.openPreview(file, "split")));
        }
        if (!this.isCodeExt(file.extension)) return;
        menu.addItem((i) =>
          i
            .setTitle(t("common.insertIntoNote"))
            .setIcon("file-input")
            .onClick(() => this.insertFileIntoLastNote(file))
        );
      })
    );

    this.watchWindow(window);
    this.registerEvent(this.app.workspace.on("window-open", (win, w) => this.watchWindow(w)));

    const ext = buildEditorExtension(this);
    if (ext) this.registerEditorExtension(ext);

    this.registerMarkdownPostProcessor((el, ctx) => this.decorateReading(el, ctx));

    this.addCommands();
    this.addSettingTab(new EcuCodekitSettings(this.app, this));
  }

  onunload() {}

  watchWindow(win) {
    if (!win || this.watchedWindows.has(win)) return;
    this.watchedWindows.add(win);
    this.registerDomEvent(
      win,
      "keydown",
      (e) => {
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.code === "KeyV" || e.key === "V" || e.key === "v")) this.plainPasteAt = Date.now();
      },
      true
    );
  }

  refreshPreviews() {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_PREVIEW)) if (leaf.view instanceof HtmlPreviewView) leaf.view.render();
  }

  async openPreview(file, where) {
    const ws = this.app.workspace;
    let leaf = ws.getLeavesOfType(VIEW_PREVIEW).find((l) => {
      try {
        return (l.view && l.view.filePath === file.path) || l.getViewState().state.file === file.path;
      } catch (e) {
        return false;
      }
    });
    if (!leaf) leaf = where === "split" ? ws.getLeaf("split", "vertical") : ws.getLeaf("tab");
    await leaf.setViewState({ type: VIEW_PREVIEW, active: true, state: { file: file.path, scripts: this.settings.previewScripts } });
    ws.revealLeaf(leaf);
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  minScore() {
    return MIN_SCORE[this.settings.sensitivity] || 6;
  }

  fenceId(lang) {
    if (!lang) return "";
    const l = langOf(lang);
    if (l && l.id === "bash") return this.settings.shellFence || "bash";
    return l ? l.id : lang;
  }

  configuredExts() {
    return this.settings.fileExts
      .split(/[\s,]+/)
      .map((s) => s.replace(/^\./, "").toLowerCase())
      .filter((s) => s && s !== "md" && s !== "canvas" && /^[\w-]+$/.test(s));
  }

  isCodeExt(ext) {
    ext = String(ext || "").toLowerCase();
    return this.registeredExts.has(ext) || this.configuredExts().includes(ext);
  }

  registerCodeExts() {
    const skipped = [];
    for (const ext of this.configuredExts()) {
      if (this.registeredExts.has(ext)) continue;
      try {
        this.registerExtensions([ext], VIEW_CODE);
        this.registeredExts.add(ext);
      } catch (e) {
        skipped.push(ext);
      }
    }
  }

  async ensureFolder(folder) {
    folder = normalizePath(folder || "");
    if (!folder || folder === "/") return;
    let cur = "";
    for (const part of folder.split("/")) {
      cur = cur ? `${cur}/${part}` : part;
      if (!this.app.vault.getAbstractFileByPath(cur)) await this.app.vault.createFolder(cur);
    }
  }

  suggestFileName(code, lang, sourcePath, folder) {
    const l = langOf(lang);
    const ext = l ? l.ext : "txt";
    let base = "";
    if (l && l.id === "go") {
      const m = /^package\s+(\w+)/m.exec(code);
      if (m) base = m[1] === "main" ? "main" : m[1];
    } else if (l && l.id === "yaml") {
      const kind = /^kind:\s*(\w+)/m.exec(code);
      const name = /^\s{2}name:\s*["']?([\w.-]+)/m.exec(code);
      if (kind) base = (name ? name[1] + "-" : "") + kind[1].toLowerCase();
    } else if (l && l.id === "python") {
      const m = /^\s*def\s+(\w+)/m.exec(code) || /^\s*class\s+(\w+)/m.exec(code);
      if (m) base = m[1];
    }
    if (!base) base = slugName(sourcePath ? sourcePath.split("/").pop() : "") || t("save.defaultBase");
    base = slugName(base) || t("save.defaultBase");
    const dir = folder ? normalizePath(folder) + "/" : "";
    let name = `${base}.${ext}`;
    for (let i = 2; this.app.vault.getAbstractFileByPath(dir + name) && i < 500; i++) name = `${base}-${i}.${ext}`;
    return name;
  }

  async openCodeFile(file, mode) {
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(file);
    if (mode && leaf.view instanceof CodeFileView) leaf.view.setReadOnly(mode === "readonly");
  }

  async terminalSession() {
    const plugins = this.app.plugins && this.app.plugins.plugins;
    const qt = plugins && (plugins["ecu-terminal"] || plugins["quiet-terminal"]);
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    let leaf = null;
    let fresh = false;
    if (qt && qt.leaf) {
      leaf = qt.leaf();
      const panel = qt.panelLeaf && qt.panelLeaf();
      if (panel && (!leaf || (qt.isHidden && qt.isHidden()))) {
        leaf = panel;
        this.app.workspace.revealLeaf(panel);
      } else if (!leaf) {
        leaf = await qt.create();
        fresh = true;
      } else if (qt.isHidden && qt.isHidden()) {
        qt.applyHidden(false);
        await qt.saveHidden(false);
      } else this.app.workspace.revealLeaf(leaf);
    } else {
      return null;
    }
    if (leaf && leaf.loadIfDeferred) await leaf.loadIfDeferred();
    for (let i = 0; i < 60; i++) {
      const s = leaf && leaf.view && leaf.view.session;
      if (s && s.pty && s.pty.write) {
        if (fresh) await sleep(400);
        return { leaf, session: s, qt };
      }
      await sleep(100);
    }
    return null;
  }

  async sendToTerminal(cmd, enter) {
    const term = await this.terminalSession();
    if (!term) return new Notice(t("notice.noTerminal"));
    const text = cmd.replace(/\r\n?/g, "\n").replace(/\n/g, "\r") + (enter ? "\r" : "");
    term.session.pty.write(text);
    if (this.settings.focusTerminal || !enter) {
      if (term.qt && term.qt.focusTerminal) term.qt.focusTerminal(term.leaf);
      else this.app.workspace.setActiveLeaf(term.leaf, { focus: true });
    }
  }

  runInTerminal(code, opts) {
    opts = opts || {};
    const parsed = parseCommands(code);
    const cmd = parsed.cmd;
    if (!cmd.trim()) return new Notice(t("notice.noCommand"));
    const lines = cmd.split("\n").filter((l) => l.trim() && !/^\s*#/.test(l));
    const risky = findDangers(cmd).length > 0 || findPlaceholders(cmd).length > 0;
    const notes = [];
    if (opts.untagged) notes.push(t("run.untagged"));
    if (parsed.mixed) notes.push(t("run.mixedPrompt"));
    if (!opts.force && !notes.length && !risky && lines.length <= 1 && !this.settings.confirmRun) return this.sendToTerminal(cmd, true);
    new RunModal(this, { cmd, notes, title: opts.title, onRun: (c, enter) => this.sendToTerminal(c, enter) }).open();
  }

  runCursorLine(editor) {
    const sel = editor.getSelection();
    const text = sel.trim() ? sel : editor.getLine(editor.getCursor().line);
    if (!text.trim() || /^\s*(```|~~~)/.test(text)) return new Notice(t("notice.noLine"));
    const blk = blockAt(editorAd(editor), editor.getCursor().line);
    this.runInTerminal(text, { untagged: !!blk && !blk.lang });
  }

  onPaste(evt, editor, info) {
    if (!this.settings.autoWrap || evt.defaultPrevented) return;
    if (Date.now() - this.plainPasteAt < 1500) return;
    const dt = evt.clipboardData;
    if (!dt || (dt.files && dt.files.length)) return;
    const raw = dt.getData("text/plain");
    if (!raw || !raw.trim() || raw.length > 500000) return;

    const from = editor.getCursor("from");
    const to = editor.getCursor("to");
    const ad = editorAd(editor);
    if (isInsideCodeOrFrontmatter(ad, from.line)) return;

    const lineText = editor.getLine(from.line);
    const before = lineText.slice(0, from.ch);
    const after = editor.getLine(to.line).slice(to.ch);
    const multi = raw.trim().includes("\n");
    if (!multi) {
      if (!this.settings.singleLine) return;
      if (before.trim() || after.trim()) return;
    }
    if (/^\s*([-*+]|\d+\.|>)\s/.test(before)) return;

    const res = detectLanguage(raw, { minScore: this.minScore() });
    if (!res) return;

    evt.preventDefault();
    const code = dedent(raw);
    const indent = before.trim() ? "" : before;
    const lang = this.fenceId(res.lang);
    let text = buildBlock(code, lang, indent);
    if (before.trim()) text = "\n" + text;
    text += "\n";
    if (after.trim()) text += indent;

    const startOffset = editor.posToOffset(from);
    editor.replaceSelection(text);
    const fenceLine = from.line + (before.trim() ? 1 : 0);
    const record = { editor, startOffset, text, raw, fenceLine };

    if (this.settings.notify) this.pasteNotice(res, record);
  }

  pasteNotice(res, rec) {
    const frag = createFragment((f) => {
      f.createSpan({ text: t("notice.pastedAs", { lang: langLabel(res.lang) }) });
      if (!res.confident) f.createSpan({ text: t("notice.unsure"), cls: "sc-notice-dim" });
      const row = f.createDiv({ cls: "sc-notice-row" });
      const b1 = row.createEl("button", { text: t("notice.changeLang") });
      const b2 = row.createEl("button", { text: t("notice.makePlain") });
      b1.onclick = () => {
        const ad = editorAd(rec.editor);
        const blk = blockAt(ad, rec.fenceLine);
        if (blk) this.openLangModal(ad, blk);
      };
      b2.onclick = () => {
        const ed = rec.editor;
        try {
          const a = ed.offsetToPos(rec.startOffset);
          const b = ed.offsetToPos(rec.startOffset + rec.text.length);
          if (ed.getRange(a, b) === rec.text) ed.replaceRange(rec.raw, a, b);
          else new Notice(t("notice.blockChanged"));
        } catch (e) {
          new Notice(t("notice.plainFailed"));
        }
      };
    });
    new Notice(frag, 7000);
  }

  async pastePlain(editor) {
    const clip = await navigator.clipboard.readText();
    editor.replaceSelection(clip);
  }

  async pasteAsCode(editor) {
    const clip = await navigator.clipboard.readText();
    if (!clip.trim()) return new Notice(t("notice.clipboardEmpty"));
    const res = detectLanguage(clip, { minScore: 1 });
    const insert = (lang) => {
      const from = editor.getCursor("from");
      const before = editor.getLine(from.line).slice(0, from.ch);
      let text = buildBlock(dedent(clip), this.fenceId(lang), before.trim() ? "" : before);
      if (before.trim()) text = "\n" + text;
      editor.replaceSelection(text + "\n");
    };
    new LangModal(this.app, { detected: res && res.lang, onChoose: insert }).open();
  }

  openLangModal(ad, blk) {
    const detected = detectLanguage(blk.code, { minScore: 1 });
    new LangModal(this.app, {
      current: blk.lang,
      detected: detected && detected.lang,
      onChoose: (id) => this.setBlockLang(ad, blk, id),
    }).open();
  }

  setBlockLang(ad, blk, id) {
    const fence = blk.indent + blk.fence + this.fenceId(id) + (blk.rest ? " " + blk.rest : "");
    ad.replaceLines(blk.start, blk.start, fence);
  }

  unwrapBlock(ad, blk) {
    if (blk.end < 0) return new Notice(t("notice.unclosed"));
    const body = blk.code
      .split("\n")
      .map((l) => (l ? blk.indent + l : l))
      .join("\n");
    ad.replaceLines(blk.start, blk.end, body);
  }

  saveBlock(ad, blk, sourcePath) {
    const lang = blk.lang || (detectLanguage(blk.code, { minScore: 1 }) || {}).lang || "text";
    new SaveModal(this, {
      code: blk.code,
      lang,
      sourcePath,
      canLink: blk.end >= 0,
      onSaved: (file, mode) => {
        if (mode === "none") return;
        const cur = blockAt(ad, blk.start);
        if (!cur || cur.code !== blk.code) return new Notice(t("notice.noteChanged"));
        const link = this.app.fileManager.generateMarkdownLink(file, sourcePath || "");
        if (mode === "replace") ad.replaceLines(cur.start, cur.end, cur.indent + link);
        else ad.replaceLines(cur.end, cur.end, ad.line(cur.end) + "\n" + cur.indent + link);
      },
    }).open();
  }

  async copyBlock(blk) {
    const text = isShellLang(blk.lang) ? cleanCommands(blk.code) || blk.code : blk.code;
    await navigator.clipboard.writeText(text);
    new Notice(t("common.copied"));
  }

  wrapSelection(editor) {
    const sel = editor.getSelection();
    if (!sel.trim()) return new Notice(t("notice.selectFirst"));
    const from = editor.getCursor("from");
    const before = editor.getLine(from.line).slice(0, from.ch);
    const res = detectLanguage(sel, { minScore: 1 });
    const apply = (lang) => {
      let text = buildBlock(dedent(sel), this.fenceId(lang), before.trim() ? "" : before);
      if (before.trim()) text = "\n" + text + "\n";
      editor.replaceSelection(text);
    };
    if (res && res.confident) {
      apply(res.lang);
      new Notice(t("notice.wrappedAs", { lang: langLabel(res.lang) }));
    } else new LangModal(this.app, { detected: res && res.lang, onChoose: apply }).open();
  }

  chipAction(view, lineFrom, action) {
    const ad = cmAd(view);
    let lineNo;
    try {
      lineNo = view.state.doc.lineAt(lineFrom).number - 1;
    } catch (e) {
      return;
    }
    const blk = blockAt(ad, lineNo);
    if (!blk) return;
    if (action === "lang") this.openLangModal(ad, blk);
    else if (action === "copy") this.copyBlock(blk);
    else if (action === "run") this.runInTerminal(blk.code, { untagged: !blk.lang });
    else if (action === "save") {
      const f = this.app.workspace.getActiveFile();
      this.saveBlock(ad, blk, f ? f.path : "");
    }
  }

  onEditorMenu(menu, editor, info) {
    const ad = editorAd(editor);
    const cur = editor.getCursor();
    const blk = blockAt(ad, cur.line);
    const sourcePath = info && info.file ? info.file.path : "";
    if (blk) {
      menu.addSeparator();
      menu.addItem((i) =>
        i
          .setTitle(t("menu.codeLang", { lang: langLabel(blk.lang) }))
          .setIcon("languages")
          .setSection("ecu-codekit")
          .onClick(() => this.openLangModal(ad, blk))
      );
      menu.addItem((i) => i.setTitle(t("menu.copyCode")).setIcon("copy").setSection("ecu-codekit").onClick(() => this.copyBlock(blk)));
      if (isShellLang(blk.lang)) {
        menu.addItem((i) =>
          i
            .setTitle(t("menu.runBlock"))
            .setIcon("play")
            .setSection("ecu-codekit")
            .onClick(() => this.runInTerminal(blk.code, { untagged: !blk.lang }))
        );
        const onCode = cur.line > blk.start && (blk.end < 0 || cur.line < blk.end);
        if (onCode && (editor.somethingSelected() || blk.code.split("\n").length > 1))
          menu.addItem((i) =>
            i
              .setTitle(editor.somethingSelected() ? t("menu.runSelection") : t("menu.runLine"))
              .setIcon("terminal-square")
              .setSection("ecu-codekit")
              .onClick(() => this.runCursorLine(editor))
          );
      }
      menu.addItem((i) =>
        i
          .setTitle(t("menu.saveAsFile"))
          .setIcon("save")
          .setSection("ecu-codekit")
          .onClick(() => this.saveBlock(ad, blk, sourcePath))
      );
      menu.addItem((i) =>
        i
          .setTitle(t("menu.unwrap"))
          .setIcon("remove-formatting")
          .setSection("ecu-codekit")
          .onClick(() => this.unwrapBlock(ad, blk))
      );
    } else if (editor.somethingSelected()) {
      menu.addItem((i) =>
        i
          .setTitle(t("menu.wrap"))
          .setIcon("code-2")
          .setSection("ecu-codekit")
          .onClick(() => this.wrapSelection(editor))
      );
    }
    if (!blk) {
      menu.addItem((i) =>
        i
          .setTitle(t("menu.insertFile"))
          .setIcon("file-code")
          .setSection("ecu-codekit")
          .onClick(() => new CodeFileSuggest(this.app, this, (f) => this.insertFile(editor, f)).open())
      );
    }
  }

  async insertFile(editor, file) {
    const content = await this.app.vault.cachedRead(file);
    let lang = langFromExt(file.extension);
    if (!lang || lang === "text") {
      const d = detectLanguage(content.slice(0, 20000), { minScore: 1 });
      lang = d ? d.lang : "";
    }
    const from = editor.getCursor("from");
    const before = editor.getLine(from.line).slice(0, from.ch);
    let text = buildBlock(content.replace(/\s+$/, ""), this.fenceId(lang), before.trim() ? "" : before);
    if (before.trim()) text = "\n" + text;
    editor.replaceSelection(text + "\n");
  }

  insertFileIntoLastNote(file) {
    const leaf = this.lastMarkdownLeaf;
    if (!leaf || !(leaf.view instanceof MarkdownView) || !leaf.view.editor) return new Notice(t("notice.openNoteFirst"));
    this.app.workspace.setActiveLeaf(leaf, { focus: true });
    this.insertFile(leaf.view.editor, file);
  }

  decorateReading(el, ctx) {
    if (!this.settings.readingHeader) return;
    const codes = el.querySelectorAll("pre > code");
    codes.forEach((code) => {
      const pre = code.parentElement;
      if (!pre || pre.querySelector(":scope > .sc-head")) return;
      const m = /(?:^|\s)language-([^\s]+)/.exec(code.className);
      const lang = m ? m[1] : "";
      const head = createDiv({ cls: "sc-head" });
      head.createSpan({ cls: "sc-head-lang", text: lang ? langLabel(lang) : t("lang.text") });
      const text = () => code.textContent.replace(/\n$/, "");
      const button = (icon, label, fn) => {
        const b = head.createEl("button", { cls: "sc-head-btn clickable-icon", attr: { "aria-label": label } });
        setIcon(b, icon);
        b.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          fn();
        });
      };
      button("copy", t("common.copy"), () => this.copyBlock({ code: text(), lang }));
      if (isShellLang(lang)) button("play", t("common.runInTerminal"), () => this.runInTerminal(text(), { untagged: !lang }));
      button("save", t("common.saveAsFile"), () => {
        const l = lang || (detectLanguage(text(), { minScore: 1 }) || {}).lang || "text";
        new SaveModal(this, { code: text(), lang: l, sourcePath: ctx.sourcePath, canLink: false }).open();
      });
      pre.prepend(head);
      pre.addClass("sc-has-head");
    });
  }

  addCommands() {
    const inBlock = (editor) => blockAt(editorAd(editor), editor.getCursor().line);

    this.addCommand({
      id: "preview-html",
      name: t("cmd.previewHtml"),
      checkCallback: (checking) => {
        const f = this.app.workspace.getActiveFile();
        if (!canPreview(f)) return false;
        if (!checking) this.openPreview(f, "split");
        return true;
      },
    });

    this.addCommand({
      id: "paste-plain",
      name: t("cmd.pastePlain"),
      editorCallback: (editor) => this.pastePlain(editor),
    });
    this.addCommand({
      id: "paste-as-code",
      name: t("cmd.pasteAsCode"),
      editorCallback: (editor) => this.pasteAsCode(editor),
    });
    this.addCommand({
      id: "wrap-selection",
      name: t("menu.wrap"),
      editorCallback: (editor) => this.wrapSelection(editor),
    });
    this.addCommand({
      id: "change-language",
      name: t("cmd.changeLang"),
      editorCheckCallback: (checking, editor) => {
        const blk = inBlock(editor);
        if (!blk) return false;
        if (!checking) this.openLangModal(editorAd(editor), blk);
        return true;
      },
    });
    this.addCommand({
      id: "copy-block",
      name: t("cmd.copyBlock"),
      editorCheckCallback: (checking, editor) => {
        const blk = inBlock(editor);
        if (!blk) return false;
        if (!checking) this.copyBlock(blk);
        return true;
      },
    });
    this.addCommand({
      id: "save-block",
      name: t("cmd.saveBlock"),
      editorCheckCallback: (checking, editor, info) => {
        const blk = inBlock(editor);
        if (!blk) return false;
        if (!checking) this.saveBlock(editorAd(editor), blk, info && info.file ? info.file.path : "");
        return true;
      },
    });
    this.addCommand({
      id: "unwrap-block",
      name: t("menu.unwrap"),
      editorCheckCallback: (checking, editor) => {
        const blk = inBlock(editor);
        if (!blk) return false;
        if (!checking) this.unwrapBlock(editorAd(editor), blk);
        return true;
      },
    });
    this.addCommand({
      id: "insert-file",
      name: t("cmd.insertFile"),
      editorCallback: (editor) => new CodeFileSuggest(this.app, this, (f) => this.insertFile(editor, f)).open(),
    });
    this.addCommand({
      id: "new-file",
      name: t("newFile.title"),
      callback: () => new NewFileModal(this).open(),
    });
    this.addCommand({
      id: "toggle-file-mode",
      name: t("cmd.toggleFileMode"),
      checkCallback: (checking) => {
        const v = this.app.workspace.getActiveViewOfType(CodeFileView);
        if (!v) return false;
        if (!checking) v.setReadOnly(!v.readOnly);
        return true;
      },
    });
    this.addCommand({
      id: "run-line",
      name: t("cmd.runLine"),
      editorCallback: (editor) => this.runCursorLine(editor),
    });
    this.addCommand({
      id: "run-block",
      name: t("cmd.runBlock"),
      editorCheckCallback: (checking, editor) => {
        const blk = inBlock(editor);
        if (!blk || !isShellLang(blk.lang)) return false;
        if (!checking) this.runInTerminal(blk.code, { untagged: !blk.lang });
        return true;
      },
    });
    this.addCommand({
      id: "toggle-auto",
      name: t("cmd.toggleAuto"),
      callback: async () => {
        this.settings.autoWrap = !this.settings.autoWrap;
        await this.saveSettings();
        new Notice(this.settings.autoWrap ? t("notice.autoOn") : t("notice.autoOff"));
      },
    });
  }
};

class EcuCodekitSettings extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    const p = this.plugin;
    const save = () => p.saveSettings();
    containerEl.empty();

    new Setting(containerEl)
      .setName(t("common.language"))
      .setDesc(t("set.uiLangDesc"))
      .addDropdown((d) =>
        d
          .addOption("auto", t("set.uiLangAuto"))
          .addOption("en", t("set.uiLangEn"))
          .addOption("tr", t("set.uiLangTr"))
          .setValue(p.settings.uiLang || "auto")
          .onChange(async (v) => {
            p.settings.uiLang = v;
            setUiLang(v);
            await save();
            new Notice(t("notice.langChanged"));
            this.display();
          })
      );

    new Setting(containerEl).setName(t("set.hPaste")).setHeading();
    new Setting(containerEl)
      .setName(t("set.autoWrap"))
      .setDesc(t("set.autoWrapDesc"))
      .addToggle((tg) => tg.setValue(p.settings.autoWrap).onChange(async (v) => ((p.settings.autoWrap = v), await save())));
    new Setting(containerEl)
      .setName(t("set.singleLine"))
      .setDesc(t("set.singleLineDesc"))
      .addToggle((tg) => tg.setValue(p.settings.singleLine).onChange(async (v) => ((p.settings.singleLine = v), await save())));
    new Setting(containerEl)
      .setName(t("set.sensitivity"))
      .setDesc(t("set.sensitivityDesc"))
      .addDropdown((d) =>
        d
          .addOption("temkinli", t("set.sensCautious"))
          .addOption("normal", t("set.sensNormal"))
          .addOption("hassas", t("set.sensSensitive"))
          .setValue(p.settings.sensitivity)
          .onChange(async (v) => ((p.settings.sensitivity = v), await save()))
      );
    new Setting(containerEl)
      .setName(t("set.shellFence"))
      .setDesc(t("set.shellFenceDesc"))
      .addDropdown((d) =>
        d
          .addOption("bash", "bash")
          .addOption("sh", "sh")
          .setValue(p.settings.shellFence)
          .onChange(async (v) => ((p.settings.shellFence = v), await save()))
      );
    new Setting(containerEl)
      .setName(t("set.notify"))
      .setDesc(t("set.notifyDesc"))
      .addToggle((tg) => tg.setValue(p.settings.notify).onChange(async (v) => ((p.settings.notify = v), await save())));

    new Setting(containerEl).setName(t("set.hView")).setHeading();
    new Setting(containerEl)
      .setName(t("set.chips"))
      .setDesc(t("set.chipsDesc"))
      .addToggle((tg) => tg.setValue(p.settings.chips).onChange(async (v) => ((p.settings.chips = v), await save())));
    new Setting(containerEl)
      .setName(t("set.readingHeader"))
      .addToggle((tg) => tg.setValue(p.settings.readingHeader).onChange(async (v) => ((p.settings.readingHeader = v), await save())));

    new Setting(containerEl).setName(t("set.hFiles")).setHeading();
    new Setting(containerEl)
      .setName(t("set.codeFolder"))
      .setDesc(t("set.codeFolderDesc"))
      .addText((txt) => txt.setValue(p.settings.codeFolder).onChange(async (v) => ((p.settings.codeFolder = v.trim()), await save())));
    new Setting(containerEl)
      .setName(t("set.saveLinkMode"))
      .addDropdown((d) =>
        d
          .addOption("below", t("link.below"))
          .addOption("replace", t("link.replace"))
          .addOption("none", t("link.none"))
          .setValue(p.settings.saveLinkMode)
          .onChange(async (v) => ((p.settings.saveLinkMode = v), await save()))
      );
    new Setting(containerEl)
      .setName(t("set.fileOpenMode"))
      .setDesc(t("set.fileOpenModeDesc"))
      .addDropdown((d) =>
        d
          .addOption("edit", t("set.modeEdit"))
          .addOption("readonly", t("set.modeReadOnly"))
          .setValue(p.settings.fileOpenMode === "readonly" ? "readonly" : "edit")
          .onChange(async (v) => ((p.settings.fileOpenMode = v), await save()))
      );

    new Setting(containerEl)
      .setName(t("set.previewScripts"))
      .setDesc(t("set.previewScriptsDesc"))
      .addToggle((tg) => tg.setValue(p.settings.previewScripts).onChange(async (v) => ((p.settings.previewScripts = v), await save())));
    new Setting(containerEl)
      .setName(t("set.previewNetwork"))
      .setDesc(t("set.previewNetworkDesc"))
      .addToggle((tg) => tg.setValue(p.settings.previewNetwork).onChange(async (v) => ((p.settings.previewNetwork = v), await save(), p.refreshPreviews())));

    new Setting(containerEl).setName(t("set.hRun")).setHeading();
    new Setting(containerEl)
      .setName(t("set.confirmRun"))
      .setDesc(t("set.confirmRunDesc"))
      .addToggle((tg) => tg.setValue(p.settings.confirmRun).onChange(async (v) => ((p.settings.confirmRun = v), await save())));
    new Setting(containerEl)
      .setName(t("set.focusTerminal"))
      .setDesc(t("set.focusTerminalDesc"))
      .addToggle((tg) => tg.setValue(p.settings.focusTerminal).onChange(async (v) => ((p.settings.focusTerminal = v), await save())));
    new Setting(containerEl)
      .setName(t("set.fileExts"))
      .setDesc(t("set.fileExtsDesc"))
      .addTextArea((ta) => {
        ta.setValue(p.settings.fileExts).onChange(async (v) => ((p.settings.fileExts = v), await save()));
        ta.inputEl.rows = 3;
        ta.inputEl.addClass("sc-wide");
      })
      .addExtraButton((b) =>
        b
          .setIcon("rotate-ccw")
          .setTooltip(t("set.resetDefault"))
          .onClick(async () => {
            p.settings.fileExts = DEFAULT_FILE_EXTS;
            await save();
            this.display();
          })
      );

    containerEl.createEl("p", {
      cls: "setting-item-description",
      text: t("set.footer"),
    });
  }
}

module.exports.detectLanguage = detectLanguage;
module.exports._internals = { blockAt, parseFence, dedent, buildBlock, fenceFor, langOf, langFromExt, cleanCommands, parseCommands, findPlaceholders, findDangers, flattenTokens, isShellLang };
Object.assign(module.exports._internals, { defaultCodeFolder, targetPath, previewCsp, previewDoc });
