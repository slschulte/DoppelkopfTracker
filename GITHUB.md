# Doppelkopf Counter mit GitHub verwalten

So legst du das Projekt auf GitHub an und arbeitest von dort aus weiter.

---

## Workflow-Übersicht

| Wo | Aktion |
|----|--------|
| **Lokal (Mac)** | Code ändern → `git add .` → `git commit -m "..."` → `git push` |
| **Server** | `cd /opt/doppelkopf` → `git pull` → `./scripts/update-server.sh` (oder Docker-Befehle von Hand) |

Details: Abschnitt 4 (lokal pushen), Abschnitt 5 (Server anbinden / Updates einspielen).

---

## 1. Projekt auf GitHub vorbereiten

### .gitignore prüfen

Diese Dateien/Ordner werden **nicht** mit nach GitHub gepackt (stehen in `.gitignore`):

- `node_modules/`
- `data/`, `backups/`
- `.htpasswd` (Passwörter)
- `backend/database/*.db` (Datenbank)
- `dist/`, `.env`, Logs

Damit bleiben nur Quellcode und Konfiguration im Repository; sensible und lokale Daten bleiben auf deinem Rechner bzw. Server.

---

## 2. Neues Repository auf GitHub anlegen

1. Auf **https://github.com** einloggen.
2. Oben rechts **„+”** → **„New repository”**.
3. Einstellungen:
   - **Repository name:** z. B. `DoppelkopfCounter` oder `doppelkopf-counter`
   - **Visibility:** Private oder Public
   - **Nicht** „Add a README“ auswählen (du hast schon einen)
4. Auf **„Create repository”** klicken.
5. Die angezeigte URL merken, z. B.:
   - HTTPS: `https://github.com/DEIN_USERNAME/DoppelkopfCounter.git`
   - SSH: `git@github.com:DEIN_USERNAME/DoppelkopfCounter.git`

---

## 3. Lokales Projekt mit GitHub verbinden

**Im Projektordner** (z. B. auf deinem Mac):

```bash
cd /Users/simon/Coding/Projects/DoppelkopfCounter

# Falls noch kein Git-Repo existiert
git init

# Alle Dateien zur Staging-Area hinzufügen (.gitignore wird beachtet)
git add .

# Erster Commit
git commit -m "Initial commit: Doppelkopf Counter Webapp"

# Branch umbenennen auf main (falls du 'master' siehst)
git branch -M main

# GitHub als Remote hinzufügen (URL durch deine ersetzen!)
git remote add origin https://github.com/DEIN_USERNAME/DoppelkopfCounter.git

# Nach GitHub pushen
git push -u origin main
```

Bei HTTPS fragt GitHub nach **Benutzername** und **Passwort**. Statt Passwort nutzt du einen **Personal Access Token** (Settings → Developer settings → Personal access tokens → Token erstellen, Repo-Berechtigung).

Bei SSH:

```bash
git remote add origin git@github.com:DEIN_USERNAME/DoppelkopfCounter.git
git push -u origin main
```

---

## 4. Ab jetzt: Code bearbeiten und pushen

### Typischer Ablauf

1. **Code ändern** (lokal in Cursor/IDE).
2. **Änderungen anzeigen:**
   ```bash
   git status
   git diff
   ```
3. **Committen und pushen:**
   ```bash
   git add .
   git commit -m "Kurze Beschreibung der Änderung"
   git push
   ```

### Beispiel-Beschreibungen für Commits

- `Spieler-Dropdown auf Neues-Spiel-Seite angepasst`
- `Punkteberechnung für Bock-Runde korrigiert`
- `Dokumentation ergänzt`

---

## 5. Server: Updates von GitHub holen

Auf dem **Ubuntu-Server** (oder wo die App läuft) das Projekt einmal von GitHub klonen bzw. mit GitHub verbinden, danach nur noch pullen.

### Erste Einrichtung auf dem Server (falls noch kein Repo)

```bash
cd /opt
# Altes Verzeichnis ggf. umbenennen/sichern
mv doppelkopf doppelkopf-backup

# Von GitHub klonen (URL anpassen!)
git clone https://github.com/DEIN_USERNAME/DoppelkopfCounter.git doppelkopf
cd doppelkopf
```

Dann **Daten und Konfiguration** aus dem Backup zurückkopieren (nicht überschreiben mit Git):

- `data/database/doppelkopf.db` → aus Backup nach `doppelkopf/data/database/`
- `.htpasswd` → aus Backup nach `doppelkopf/`
- Anschließend Docker/App wie gewohnt starten.

### Bereits bestehendes Verzeichnis mit GitHub verbinden

Falls `/opt/doppelkopf` schon existiert (z. B. per rsync deployed) und du es an GitHub anbinden willst:

**1. Optional: Kurz sichern** (data/, .htpasswd werden von Git nicht angetastet, zur Sicherheit trotzdem sinnvoll):

```bash
sudo tar -czf /tmp/doppelkopf-backup-$(date +%Y%m%d).tar.gz -C /opt/doppelkopf .htpasswd data 2>/dev/null || true
```

**2. Git anbinden und Stand von GitHub holen:**

```bash
cd /opt/doppelkopf

git init
# Falls Git „dubious ownership“ meldet (z. B. weil du als root arbeitest):
git config --global --add safe.directory /opt/doppelkopf

git remote add origin https://github.com/DEIN_USERNAME/DoppelkopfCounter.git
# Bei SSH statt HTTPS:
# git remote add origin git@github.com:DEIN_USERNAME/DoppelkopfCounter.git

git fetch origin
# Wenn Git „untracked working tree files would be overwritten“ meldet: erst stagen, dann zurücksetzen:
git add .
git reset --hard origin/main
git branch -M main
git branch --set-upstream-to=origin/main main
```

Falls **kein** Fehler mit „untracked files“ kommt, reicht stattdessen:  
`git checkout -B main origin/main` und danach `git branch --set-upstream-to=origin/main main`.

- `git add .` macht die bestehenden Dateien für Git „bekannt“ (`.gitignore` gilt, also werden `.htpasswd`, `data/` nicht gestaged).
- `git reset --hard origin/main` setzt den aktuellen Branch und den Arbeitsordner auf den Stand von GitHub. Dateien in `.gitignore` bleiben unverändert.

**3. Prüfen:**

```bash
git status
git log --oneline -3
```

Danach kannst du Updates mit `git pull` und dem unten beschriebenen Ablauf (oder `./scripts/update-server.sh`) einspielen.

**Alternative (sauber, aber mehr Schritte):** Backup von `/opt/doppelkopf` (besonders `data/`, `.htpasswd`), Verzeichnis umbenennen, frisch von GitHub klonen, dann `data/` und `.htpasswd` aus dem Backup zurückkopieren.

### Updates einspielen (nach git push von deinem Rechner)

**Manuell auf dem Server:**

```bash
cd /opt/doppelkopf
git pull

docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

**Oder ein Befehl** (Skript liegt im Repo, also nach dem ersten Anbinden/Klonen vorhanden):

```bash
cd /opt/doppelkopf
chmod +x scripts/update-server.sh   # einmalig, falls nötig
./scripts/update-server.sh
```

Das Skript führt `git pull`, dann `docker-compose down`, `docker-compose build --no-cache` und `docker-compose up -d` aus.

---

## 6. Übersicht: Wo was liegt

| Was | Wo | In GitHub? |
|-----|----|------------|
| Quellcode (Frontend/Backend) | Projektordner | ✅ Ja |
| Konfiguration (docker-compose, nginx) | Projektordner | ✅ Ja |
| Datenbank | `data/database/` bzw. Volume | ❌ Nein |
| Passwort-Datei | `.htpasswd` | ❌ Nein |
| Backups | `backups/` | ❌ Nein |

Datenbank und `.htpasswd` liegen nur auf dem Server und werden nicht von GitHub verwaltet. Bei neuem Klonen/neuem Server musst du sie wieder anlegen oder aus Backup kopieren.

---

## 7. Nützliche Git-Befehle

```bash
# Status anzeigen
git status

# Änderungen anzeigen
git diff

# Letzte Commits anzeigen
git log --oneline -10

# Neuen Branch erstellen (z. B. für Feature)
git checkout -b feature/neue-funktion

# Branch wechseln
git checkout main

# Von GitHub die neuesten Änderungen holen (ohne zu mergen)
git fetch origin
```

Wenn du willst, können wir als Nächstes konkret durchgehen: erst „Repository auf GitHub anlegen“, dann bei dir lokal `git init`, `add`, `commit`, `remote`, `push` Schritt für Schritt mit deinen echten Pfaden und deiner GitHub-URL.
