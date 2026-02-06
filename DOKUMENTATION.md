# Doppelkopf Counter – Vollständige Dokumentation

Diese Dokumentation beschreibt die Anwendung, das Hosting auf beliebigen Webservern und die Wartung.

---

## Inhaltsverzeichnis

1. [Übersicht & Features](#1-übersicht--features)
2. [Architektur & Technologie](#2-architektur--technologie)
3. [Projektstruktur](#3-projektstruktur)
4. [Lokale Entwicklung](#4-lokale-entwicklung)
5. [Hosting auf einem Webserver](#5-hosting-auf-einem-webserver)
6. [Wartung & Betrieb](#6-wartung--betrieb)
7. [Code mit GitHub verwalten](#7-code-mit-github-verwalten)
8. [Konfiguration](#8-konfiguration)
9. [API-Referenz](#9-api-referenz)
10. [Weitere Dokumentation](#10-weitere-dokumentation)

---

## 1. Übersicht & Features

### Was ist Doppelkopf Counter?

Eine Web-Anwendung zur Erfassung und Auswertung von Doppelkopf-Spielen: Spieler verwalten, Spiele mit automatischer Punkteberechnung erfassen, Ranglisten und Statistiken anzeigen.

### Kernfunktionen

| Bereich | Funktionen |
|--------|------------|
| **Spieler** | Anlegen, Bearbeiten, Löschen, Avatar-Farben, Spielerstatistiken |
| **Spiele** | Erfassen (Normal/Solo), Punkte automatisch nach DDV-Regeln, Extras, Ansagen, Bock-Runden |
| **Rangliste** | Sortierung nach Punkten, Gewinnrate, Trend, Ansicht absolut oder pro Spieltag |
| **Spieltage** | Punkte „absolut“ (alle Spiele) oder „relativ“ (nur ein Tag) anzeigen |
| **Karten** | Gelbe Karten (Verwarnung), Rote Karten (1 € Strafe), Bezahlstatus |
| **Statistiken** | Globale Stats, Spieler-Stats, Spielverlauf mit Filter und Bearbeitung |

### Technische Eigenschaften

- Responsives Layout (Desktop, Tablet, Smartphone)
- Optional: Passwortschutz (HTTP Basic Auth)
- Optional: HTTPS mit Let’s Encrypt
- Keine Anmeldung im System; Zugriff wird über Passwort und/oder Netzwerk gesteuert

---

## 2. Architektur & Technologie

### Komponenten

```
[Browser] → [Webserver/Reverse-Proxy] → [Frontend (Vue/nginx)] 
                                      [Backend (Node/Express)] → [SQLite]
```

- **Frontend:** Vue 3 (TypeScript), Pinia, Vue Router, Tailwind, Vite. Wird als statische Dateien ausgeliefert und von einem Webserver (z. B. nginx) ausgeliefert.
- **Backend:** Node.js, Express, REST-API. Spricht mit SQLite.
- **Datenbank:** SQLite (eine Datei, z. B. `doppelkopf.db`).

### Technologie-Stack

| Schicht | Technologie |
|--------|--------------|
| Frontend | Vue 3, TypeScript, Pinia, Vue Router, Tailwind CSS, Vite, Axios |
| Backend | Node.js (ab 18), Express, better-sqlite3, ES Modules |
| Datenbank | SQLite 3 |
| Deployment | Docker (optional), nginx als Reverse-Proxy |

### Abhängigkeiten

- **Backend:** Node.js v18+, npm; für better-sqlite3 ggf. Build-Tools (python3, make, g++).
- **Frontend (Build):** Node.js v18+, npm.
- **Produktion (Docker):** Docker, Docker Compose.
- **Produktion (ohne Docker):** Node.js, nginx (oder anderer Webserver), Schreibrechte für das Datenbankverzeichnis.

---

## 3. Projektstruktur

```
DoppelkopfCounter/
├── backend/                    # Node.js-API
│   ├── src/
│   │   ├── models/database.js  # DB-Schema, Init
│   │   ├── routes/             # players, games, cards
│   │   ├── migrations/         # DB-Migrationen
│   │   └── server.js           # Express-Einstieg
│   ├── database/               # Ordner für doppelkopf.db (persistent)
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # Vue-SPA
│   ├── src/
│   │   ├── components/        # Wiederverwendbare Vue-Komponenten
│   │   ├── views/              # Seiten (Home, Game, Players, Stats)
│   │   ├── stores/             # Pinia (players, games, cards)
│   │   ├── services/api.ts     # Axios-API-Client
│   │   ├── types/              # TypeScript-Typen
│   │   └── router/
│   ├── nginx.conf              # nginx ohne Auth (Standard)
│   ├── nginx-auth.conf         # nginx mit Basic Auth + SSL
│   ├── Dockerfile              # Multi-Stage: Build Vue, dann nginx
│   └── package.json
│
├── scripts/
│   ├── deploy.sh               # Docker-Deployment
│   ├── update-server.sh        # Git Pull + Docker neu bauen (auf Server)
│   ├── backup.sh               # DB-Backup
│   └── create-password.sh      # .htpasswd erzeugen
│
├── docker-compose.yml          # Backend + Frontend + Netzwerk
├── .htpasswd                   # Nur auf Server; nicht in Git
├── data/database/              # Persistente DB (auf Server)
│
├── README.md
├── DOKUMENTATION.md            # Diese Datei
├── GITHUB.md                   # GitHub: Repo anlegen, Server anbinden, Update-Workflow
├── DEPLOYMENT.md               # Ausführliches Docker-Deployment
├── QUICK_DEPLOY.md             # Kurze Deploy-Anleitung
├── DOPPELKOPF_REGELN.md        # Punkteberechnung
├── PASSWORD_PROTECTION.md      # Passwortschutz
└── SPIELTAGE_FEATURE.md        # Spieltage-Funktion
```

---

## 4. Lokale Entwicklung

### Voraussetzungen

- Node.js v18+
- npm

### Backend starten

```bash
cd backend
npm install
npm start
# API: http://localhost:3000
```

Mit Auto-Reload:

```bash
npm run dev
```

### Frontend starten

```bash
cd frontend
npm install
npm run dev
# App: http://localhost:5173 (Proxy zu Backend)
```

In `frontend/vite.config.ts` ist ein Proxy für `/api` auf `http://localhost:3000` vorkonfiguriert.

### Produktions-Build (Frontend)

```bash
cd frontend
npm run build
# Ausgabe: frontend/dist/
```

---

## 5. Hosting auf einem Webserver

Es gibt zwei sinnvolle Varianten: **mit Docker** (empfohlen) oder **ohne Docker** (Node + Webserver).

---

### 5.1 Hosting mit Docker (empfohlen)

Geeignet für: VPS, eigene Server (Ubuntu, Debian, etc.), beliebige Cloud mit Docker.

#### Voraussetzungen

- Server mit SSH-Zugang
- Docker und Docker Compose installiert
- Optional: Domain, SSL (z. B. Let’s Encrypt)

#### Schritte (Kurz)

1. **Code auf den Server bringen:** per **Git** von GitHub klonen (empfohlen, siehe [Code mit GitHub verwalten](#7-code-mit-github-verwalten)) oder per rsync/Upload.
2. **Umgebung vorbereiten:**
   ```bash
   mkdir -p data/database
   # Optional: .htpasswd für Passwortschutz (siehe PASSWORD_PROTECTION.md)
   ```
3. **Starten:**
   ```bash
   docker-compose build
   docker-compose up -d
   ```
4. **Firewall:** Port 80 (und bei HTTPS 443) öffnen.
5. **Optional:** Domain, SSL, Passwortschutz (siehe [Konfiguration](#7-konfiguration) und PASSWORD_PROTECTION.md).

Ausführlich: **DEPLOYMENT.md** und **QUICK_DEPLOY.md**.

#### Wichtige Dateien

- `docker-compose.yml`: Definiert Backend- und Frontend-Container, Volumes, Ports.
- `backend/Dockerfile`: Node-Alpine, better-sqlite3, Start mit `node src/server.js`.
- `frontend/Dockerfile`: Zuerst Vue-Build, dann nginx mit statischen Dateien; Port 80 (und ggf. 443).

---

### 5.2 Hosting ohne Docker (beliebiger Webserver)

Geeignet für: Shared Hosting mit Node-Unterstützung, eigene Maschine mit nginx/Apache, beliebiger Webserver mit Reverse-Proxy.

#### Übersicht

- **Backend:** Läuft als Node-Prozess (z. B. mit `pm2` oder systemd).
- **Frontend:** Wird mit `npm run build` gebaut; die Dateien aus `frontend/dist/` werden vom Webserver ausgeliefert.
- **Webserver:** Liefert statische Dateien für `/` und leitet `/api/*` an das Backend weiter.

#### Backend auf dem Server einrichten

```bash
# Projektverzeichnis (z. B. /opt/doppelkopf)
cd /opt/doppelkopf/backend
npm install --production
# Datenbankpfad: backend/database/doppelkopf.db oder über Umgebungsvariable
node src/server.js
# Hört z. B. auf Port 3000
```

Dauerhaft mit **pm2**:

```bash
npm install -g pm2
pm2 start src/server.js --name doppelkopf-api
pm2 save
pm2 startup
```

Oder mit **systemd**: Service-Datei anlegen, die `node src/server.js` im Backend-Verzeichnis startet und bei Boot startet.

#### Frontend bauen und ausliefern

```bash
cd /opt/doppelkopf/frontend
npm install
npm run build
# Inhalte von dist/ in das Webroot des Servers kopieren
# z. B. /var/www/doppelkopf/ oder htdocs/doppelkopf/
```

#### Webserver als Reverse-Proxy (Beispiel nginx)

Backend läuft z. B. auf `localhost:3000`. Domain: `doppelkopf.example.com`.

```nginx
server {
    listen 80;
    server_name doppelkopf.example.com;
    root /var/www/doppelkopf;   # hier liegt frontend/dist/
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Apache:** `ProxyPass /api http://127.0.0.1:3000` und `ProxyPassReverse /api http://127.0.0.1:3000` für `/api`.

Wichtig: Das Frontend ruft nur relative Pfade wie `/api/players` auf; die Basis-URL der App ist die Domain (z. B. `https://doppelkopf.example.com`). Es ist keine Anpassung nötig, solange der Webserver unter derselben Domain `/api` an das Backend weiterleitet.

#### Shared Hosting (ohne Root, nur FTP/Web)

- Wenn der Hoster **Node.js** anbietet: Backend dort starten (Port oft vorgegeben), in der App ggf. `baseURL` für die API anpassen (siehe [Konfiguration](#7-konfiguration)).
- Wenn **kein Node** möglich ist: Nur statisches Frontend geht; Backend müsste woanders gehostet werden (anderer Server, Serverless, etc.) und die API-URL im Frontend konfiguriert werden.

---

## 6. Wartung & Betrieb

### 6.1 Updates einspielen

Wenn das Projekt mit **GitHub** verwaltet wird: siehe [Abschnitt 7 – Code mit GitHub verwalten](#7-code-mit-github-verwalten) für den kompletten Workflow (lokal pushen → auf dem Server pullen und neu starten).

#### Mit Docker (manuell)

```bash
cd /opt/doppelkopf
# Code aktualisieren
git pull   # falls Repo an GitHub angebunden; sonst rsync vom Entwicklungsrechner

# Optional: Backup der DB (siehe 6.2)
./scripts/backup.sh

# Neu bauen und neu starten
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Prüfen
docker-compose ps
docker-compose logs -f
```

**Ein Befehl (wenn Repo an GitHub angebunden):**  
`./scripts/update-server.sh` führt `git pull`, `docker-compose down`, `docker-compose build --no-cache` und `docker-compose up -d` aus (einmalig `chmod +x scripts/update-server.sh` falls nötig).

#### Ohne Docker

- **Backend:** Neuen Code deployen, dann Prozess neu starten (z. B. `pm2 restart doppelkopf-api` oder systemd `systemctl restart doppelkopf`).
- **Frontend:** `npm run build`, neue Inhalte von `dist/` ins Webroot kopieren.

### 6.2 Backups

Die gesamte Anwendungslogik steckt in der **SQLite-Datei** (z. B. `backend/database/doppelkopf.db` oder `data/database/doppelkopf.db` bei Docker).

**Manuelles Backup:**

```bash
# Bei Docker:
cp data/database/doppelkopf.db backups/doppelkopf_$(date +%Y%m%d_%H%M%S).db

# Oder Script:
./scripts/backup.sh
```

**Automatisches Backup (Cron):**

```bash
# Täglich um 3:00 Uhr
0 3 * * * cd /opt/doppelkopf && ./scripts/backup.sh >> /var/log/doppelkopf-backup.log 2>&1
```

Sinnvoll: Backups auf einen anderen Server oder Cloud-Speicher kopieren und alte Backups nach z. B. 30 Tagen löschen.

### 6.3 Logs

**Docker:**

```bash
# Alle Dienste
docker-compose logs -f

# Nur Backend / Frontend
docker-compose logs -f backend
docker-compose logs -f frontend

# Letzte 200 Zeilen
docker-compose logs --tail=200 backend
```

**Ohne Docker (pm2):**

```bash
pm2 logs doppelkopf-api
pm2 flush   # Logs leeren
```

Log-Rotation bei Docker in `daemon.json` oder in `docker-compose` über Logging-Treiber konfigurieren.

### 6.4 Datenbank-Migrationen

Bei Schema-Änderungen können Migrations-Skripte unter `backend/src/migrations/` ausgeführt werden.

**Mit Docker:**

```bash
docker-compose exec backend node src/migrations/add-game-day.js
```

**Ohne Docker:**

```bash
cd backend
node src/migrations/add-game-day.js
```

Vor Migration immer Backup der Datenbank erstellen.

### 6.5 SSL-Zertifikat (Let’s Encrypt) erneuern

Bei Nutzung von Certbot:

- Erneuerung testen: `certbot renew --dry-run`
- Automatisch: Cron `0 2 * * * certbot renew --quiet`
- Wenn beim Erneuern Port 80 frei sein muss: In DEPLOYMENT.md sind Pre/Post-Hooks für Docker beschrieben (Container stoppen → erneuern → starten).

### 6.6 Passwort ändern (Basic Auth)

```bash
# .htpasswd neu erzeugen
htpasswd -cb .htpasswd doppelkopf NEUES_PASSWORT

# Bei Docker: Frontend-Container neu starten
docker-compose restart frontend
```

Details: **PASSWORD_PROTECTION.md**.

### 6.7 Typische Probleme

| Problem | Mögliche Lösung |
|--------|------------------|
| 404 auf /api/* | Reverse-Proxy prüfen: `location /api` → `proxy_pass http://backend:3000` (ohne trailing slash). Backend akzeptiert auch /players, /games, /cards. |
| DB „readonly“ / Fehler beim Schreiben | Schreibrechte für das Verzeichnis mit `doppelkopf.db` prüfen; bei Docker: Volume-Pfad und Berechtigungen. |
| Container startet nicht | `docker-compose logs backend` / `frontend`; Port 80/443 nicht doppelt belegen; bei Recreate-Fehler: `docker-compose down`, `docker container prune -f`, dann `docker-compose up -d`. |
| Alte Version nach Update | Cache leeren (Browser), bei Docker `docker-compose build --no-cache` und ggf. alte Images/Container entfernen. |

---

## 7. Code mit GitHub verwalten

Wenn du den Quellcode auf **GitHub** hostest und den Server an das Repo anbindest, kannst du alles von deinem Rechner aus verwalten und Updates mit wenigen Befehlen ausrollen.

### Workflow im Alltag

| Schritt | Wo | Aktion |
|--------|----|--------|
| 1. Code ändern | Lokal (z. B. Mac) | Im Projekt arbeiten, speichern |
| 2. Nach GitHub pushen | Lokal | `git add .` → `git commit -m "Beschreibung"` → `git push` |
| 3. Auf Server aktualisieren | Server (SSH) | `cd /opt/doppelkopf` → `./scripts/update-server.sh` |

Das Skript `scripts/update-server.sh` holt den neuesten Stand per `git pull` und startet die Docker-Container neu (`docker-compose down` → `build --no-cache` → `up -d`).

### Ersteinrichtung

- **Lokal:** Repo auf GitHub anlegen, dann im Projektordner `git init`, `git add .`, `git commit`, `git remote add origin <URL>`, `git push -u origin main`.
- **Server:** Bestehendes Verzeichnis anbinden (`git init`, `git remote add`, `git fetch`, `git add .`, `git reset --hard origin/main`, Branch setzen) oder frisch klonen und danach `data/` sowie `.htpasswd` aus einem Backup übernehmen.

Ausführliche Anleitung inkl. „dubious ownership“, „untracked files would be overwritten“ und SSH-URL: **GITHUB.md**.

---

## 8. Konfiguration

### Umgebungsvariablen (Backend)

| Variable | Bedeutung | Standard |
|----------|-----------|----------|
| `PORT` | Port des API-Servers | 3000 |
| `NODE_ENV` | production / development | - |

Datenbankpfad ist im Code auf `backend/database/doppelkopf.db` (relativ zum Arbeitsverzeichnis) festgelegt; bei Bedarf kann man das in `database.js` über eine Umgebungsvariable konfigurierbar machen.

### Frontend (API-Basis-URL)

Im Normalfall reicht die relative URL `/api` (in `frontend/src/services/api.ts`: `baseURL: '/api'`). Wenn die API unter einer anderen Domain/URL läuft, müsste dort eine absolute URL gesetzt werden (z. B. per Umgebungsvariable zur Build-Zeit).

### Nginx (Docker / eigener Server)

- **Ohne Auth:** `frontend/nginx.conf` (Standard).
- **Mit Auth + SSL:** Inhalt von `frontend/nginx-auth.conf` verwenden; Domain und Pfade zu SSL-Zertifikaten anpassen.
- **Proxy:** `location /api { proxy_pass http://backend:3000; ... }` (ohne trailing slash), damit `/api/players` etc. vollständig ans Backend gehen.

### Passwortschutz & SSL

- Passwort: **PASSWORD_PROTECTION.md**
- SSL: **DEPLOYMENT.md** (Abschnitt Domain & SSL)

---

## 9. API-Referenz

Basis-URL: `https://ihre-domain.de/api` (oder `http://localhost:3000/api` lokal).

### Spieler

| Methode | Pfad | Beschreibung |
|--------|------|--------------|
| GET | /players | Alle Spieler |
| GET | /players/:id | Ein Spieler |
| GET | /players/:id/stats?game_day=YYYY-MM-DD | Statistiken (optional pro Spieltag) |
| POST | /players | Spieler anlegen |
| PUT | /players/:id | Spieler aktualisieren |
| DELETE | /players/:id | Spieler löschen |

### Spiele

| Methode | Pfad | Beschreibung |
|--------|------|--------------|
| GET | /games | Liste (Query: limit, offset, player_id, game_type) |
| GET | /games/game-days | Alle Spieltage |
| GET | /games/stats/global | Globale Statistiken |
| GET | /games/:id | Ein Spiel |
| POST | /games | Spiel anlegen |
| PUT | /games/:id | Spiel aktualisieren |
| DELETE | /games/:id | Spiel löschen |

### Karten

| Methode | Pfad | Beschreibung |
|--------|------|--------------|
| GET | /cards | Liste (Query: player_id, card_type, paid) |
| GET | /cards/unpaid | Unbezahlte rote Karten |
| POST | /cards | Karte anlegen |
| PUT | /cards/:id | Karte aktualisieren (z. B. als bezahlt) |
| DELETE | /cards/:id | Karte löschen |

### Sonstiges

| Methode | Pfad | Beschreibung |
|--------|------|--------------|
| GET | /health | Health-Check (z. B. für Load-Balancer) |

---

## 10. Weitere Dokumentation

| Datei | Inhalt |
|-------|--------|
| **README.md** | Projektüberblick, lokale Entwicklung, Docker-Quickstart |
| **GITHUB.md** | Projekt auf GitHub pushen, Server anbinden, Update-Workflow (lokal push → Server pull + update-server.sh) |
| **DEPLOYMENT.md** | Ausführliches Docker-Deployment (Ubuntu), Firewall, SSL, Backup, Troubleshooting |
| **QUICK_DEPLOY.md** | Kurze Schritte für Deployment mit Docker |
| **DOPPELKOPF_REGELN.md** | Punkteberechnung nach DDV, Beispiele |
| **PASSWORD_PROTECTION.md** | Passwortschutz mit .htpasswd und nginx |
| **SPIELTAGE_FEATURE.md** | Absolut/Relativ-Ansicht, Spieltage-Filter |

---

*Stand: Februar 2026*
