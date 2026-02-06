# Passwortschutz für Doppelkopf Counter

Die Anwendung kann mit **HTTP Basic Auth** geschützt werden. Beim Aufruf der Seite erscheint ein Login-Dialog (Benutzername + Passwort).

## Auf dem Server einrichten

### 1. Passwort-Datei erstellen

```bash
cd /opt/doppelkopf

# Option A: Mit htpasswd (empfohlen)
apt install -y apache2-utils
htpasswd -cb .htpasswd doppelkopf IHR_GEHEIMES_PASSWORT

# Option B: Script (fragt nach Passwort)
chmod +x scripts/create-password.sh
./scripts/create-password.sh

# Option C: Script mit Passwort als Argument
./scripts/create-password.sh "IhrPasswort123"
```

Es entsteht die Datei `/opt/doppelkopf/.htpasswd`.

**Login-Daten:**
- **Benutzername:** `doppelkopf`
- **Passwort:** das von Ihnen gewählte Passwort

### 2. nginx-Konfiguration mit Passwortschutz

Ersetzen Sie den Inhalt von `frontend/nginx.conf` durch den Inhalt von `frontend/nginx-auth.conf`:

```bash
cd /opt/doppelkopf/frontend
cp nginx.conf nginx.conf.backup
cp nginx-auth.conf nginx.conf
```

(Oder Sie kopieren den Inhalt von `nginx-auth.conf` manuell in `nginx.conf`.)

### 3. docker-compose: Volume für .htpasswd

In `docker-compose.yml` beim **frontend**-Service eintragen:

```yaml
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: doppelkopf-frontend
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - ./.htpasswd:/etc/nginx/.htpasswd:ro
    depends_on:
      - backend
    networks:
      - doppelkopf-network
    # ... rest wie bisher
```

Wichtig: Die Zeile  
`- ./.htpasswd:/etc/nginx/.htpasswd:ro`  
muss unter `volumes:` stehen.

### 4. Container neu bauen und starten

```bash
cd /opt/doppelkopf
docker-compose build frontend
docker-compose up -d
```

### 5. Testen

Im Browser: **https://doppelkopf.slschulte.de**

Es sollte ein Login-Dialog erscheinen:
- Benutzername: **doppelkopf**
- Passwort: Ihr gewähltes Passwort

Nach dem Login bleibt die Session im Browser, bis Sie sich abmelden oder den Cache leeren.

---

## Passwort ändern

```bash
cd /opt/doppelkopf

# Neue .htpasswd erzeugen (überschreibt die alte)
htpasswd -cb .htpasswd doppelkopf NEUES_PASSWORT

# Frontend-Container neu starten (lädt .htpasswd neu)
docker-compose restart frontend
```

---

## Passwortschutz entfernen

1. In `frontend/nginx.conf` alle Zeilen mit `auth_basic` und `auth_basic_user_file` entfernen (oder wieder Ihre alte nginx.conf ohne Auth verwenden).
2. In `docker-compose.yml` das Volume `./.htpasswd:/etc/nginx/.htpasswd:ro` beim frontend entfernen.
3. Container neu bauen und starten:

```bash
docker-compose build frontend
docker-compose up -d
```

---

## Hinweise

- Die Datei `.htpasswd` enthält gehashte Passwörter. Sie sollte nur für root/nginx lesbar sein:  
  `chmod 600 .htpasswd`
- `.htpasswd` sollte **nicht** ins Git (in `.gitignore` eintragen).
- Bei HTTPS werden Benutzername und Passwort verschlüsselt übertragen.
