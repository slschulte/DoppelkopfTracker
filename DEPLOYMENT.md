# 🐳 Deployment auf Ubuntu Server mit Docker

Vollständige Anleitung zum Deployment der Doppelkopf Counter Anwendung auf einem Ubuntu Server mit Docker.

## Voraussetzungen

### 1. Ubuntu Server
- Ubuntu 20.04 LTS oder neuer
- Root- oder Sudo-Zugriff
- Mindestens 1GB RAM
- 2GB freier Speicherplatz

### 2. Docker Installation

Falls Docker noch nicht installiert ist:

```bash
# System aktualisieren
sudo apt update
sudo apt upgrade -y

# Docker installieren
sudo apt install -y docker.io docker-compose

# Docker-Dienst starten
sudo systemctl start docker
sudo systemctl enable docker

# Benutzer zur Docker-Gruppe hinzufügen
sudo usermod -aG docker $USER

# Neu anmelden für Gruppenänderung
newgrp docker

# Installation prüfen
docker --version
docker-compose --version
```

## Installation

### 1. Code auf Server übertragen

**Option A: Git Clone (empfohlen)**
```bash
# Projekt klonen
git clone <your-repo-url> /opt/doppelkopf
cd /opt/doppelkopf
```

**Option B: Manueller Upload**
```bash
# Auf lokalem Computer (im Projektverzeichnis)
tar -czf doppelkopf.tar.gz --exclude=node_modules --exclude=.git .

# Auf Server hochladen
scp doppelkopf.tar.gz user@your-server:/opt/

# Auf Server entpacken
ssh user@your-server
cd /opt
tar -xzf doppelkopf.tar.gz -C doppelkopf
cd doppelkopf
```

**Option C: rsync (schneller für Updates)**
```bash
# Von lokalem Computer
rsync -avz --exclude 'node_modules' --exclude '.git' \
  . user@your-server:/opt/doppelkopf/
```

### 2. Datenverzeichnis erstellen

```bash
# Im Projektverzeichnis
mkdir -p data/database
chmod 755 data/database
```

### 3. Docker Images bauen

```bash
# Alle Services bauen
docker-compose build

# Oder einzeln
docker-compose build backend
docker-compose build frontend
```

### 4. Anwendung starten

```bash
# Alle Services starten
docker-compose up -d

# Status prüfen
docker-compose ps

# Logs anzeigen
docker-compose logs -f
```

## Zugriff

Nach erfolgreichem Start ist die Anwendung erreichbar unter:

- **Frontend**: http://YOUR_SERVER_IP/
- **Backend API**: http://YOUR_SERVER_IP/api/

Beispiel: `http://192.168.1.100/` oder `http://doppelkopf.example.com/`

## Verwaltung

### Services neustarten
```bash
docker-compose restart
```

### Services stoppen
```bash
docker-compose stop
```

### Services komplett herunterfahren
```bash
docker-compose down
```

### Logs anzeigen
```bash
# Alle Logs
docker-compose logs -f

# Nur Backend
docker-compose logs -f backend

# Nur Frontend
docker-compose logs -f frontend

# Letzte 100 Zeilen
docker-compose logs --tail=100
```

### Service-Status prüfen
```bash
docker-compose ps
```

### Container Shell öffnen
```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh
```

## Updates

### Code-Update durchführen

```bash
# 1. Neue Version hochladen/pullen
cd /opt/doppelkopf
git pull  # oder rsync/scp

# 2. Services stoppen
docker-compose down

# 3. Neu bauen
docker-compose build

# 4. Starten
docker-compose up -d

# 5. Prüfen
docker-compose ps
docker-compose logs -f
```

### Datenbank-Migration ausführen

Falls eine Migration nötig ist:

```bash
# Migration im Backend-Container ausführen
docker-compose exec backend node src/migrations/add-game-day.js
```

## Backup

### Datenbank sichern

```bash
# Backup erstellen
DATE=$(date +%Y%m%d_%H%M%S)
cp data/database/doppelkopf.db backups/doppelkopf_${DATE}.db

# Oder mit Docker
docker-compose exec backend cp /app/database/doppelkopf.db /app/database/backup_${DATE}.db
```

### Automatisches Backup (Crontab)

```bash
# Backup-Script erstellen
cat > /opt/doppelkopf/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/doppelkopf/backups"
mkdir -p $BACKUP_DIR

# Datenbank kopieren
cp /opt/doppelkopf/data/database/doppelkopf.db $BACKUP_DIR/doppelkopf_${DATE}.db

# Alte Backups löschen (älter als 30 Tage)
find $BACKUP_DIR -name "doppelkopf_*.db" -mtime +30 -delete

echo "Backup completed: doppelkopf_${DATE}.db"
EOF

chmod +x /opt/doppelkopf/backup.sh

# Cron-Job einrichten (täglich um 3 Uhr)
(crontab -l 2>/dev/null; echo "0 3 * * * /opt/doppelkopf/backup.sh >> /var/log/doppelkopf-backup.log 2>&1") | crontab -
```

### Datenbank wiederherstellen

```bash
# Services stoppen
docker-compose down

# Backup zurückspielen
cp backups/doppelkopf_YYYYMMDD_HHMMSS.db data/database/doppelkopf.db

# Services starten
docker-compose up -d
```

## Firewall-Konfiguration

### UFW (Ubuntu Firewall)

```bash
# Firewall aktivieren
sudo ufw enable

# Port 80 (HTTP) öffnen
sudo ufw allow 80/tcp

# Optional: Port 443 (HTTPS) für SSL
sudo ufw allow 443/tcp

# SSH nicht vergessen!
sudo ufw allow 22/tcp

# Status prüfen
sudo ufw status
```

## Domain & SSL (Optional)

### Mit Let's Encrypt und nginx

```bash
# Certbot installieren
sudo apt install -y certbot python3-certbot-nginx

# SSL-Zertifikat erstellen
sudo certbot --nginx -d doppelkopf.example.com

# Auto-Renewal testen
sudo certbot renew --dry-run
```

### docker-compose.yml für HTTPS anpassen

```yaml
services:
  frontend:
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
```

## Monitoring

### Resource-Nutzung anzeigen

```bash
# CPU und Memory pro Container
docker stats

# Disk-Usage
docker system df

# Container-Logs-Größe
docker-compose logs --no-log-prefix | wc -l
```

### Health-Checks

```bash
# Backend-Health
curl http://localhost:3000/api/health

# Frontend-Health
curl http://localhost/

# Automatischer Health-Check läuft bereits via docker-compose
```

## Troubleshooting

### Container startet nicht

```bash
# Detaillierte Logs
docker-compose logs backend
docker-compose logs frontend

# Container-Status
docker-compose ps

# Build-Fehler beheben
docker-compose build --no-cache backend
```

### Port bereits belegt

```bash
# Verwendete Ports prüfen
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :3000

# Andere Services stoppen oder Port in docker-compose.yml ändern
```

### Datenbank-Probleme

```bash
# Berechtigungen prüfen
ls -la data/database/

# Berechtigungen korrigieren
chmod 755 data/database
chmod 644 data/database/doppelkopf.db

# Container neu starten
docker-compose restart backend
```

### Speicherplatz voll

```bash
# Docker aufräumen
docker system prune -a

# Alte Images löschen
docker image prune -a

# Unbenutzte Volumes löschen
docker volume prune
```

### Frontend zeigt 404

```bash
# Nginx-Config prüfen
docker-compose exec frontend cat /etc/nginx/conf.d/default.conf

# Container neu bauen
docker-compose down
docker-compose build frontend
docker-compose up -d
```

## Performance-Optimierung

### Ressourcen-Limits setzen

Bearbeiten Sie `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          memory: 256M
  
  frontend:
    deploy:
      resources:
        limits:
          cpus: '0.25'
          memory: 256M
```

### Logs rotieren

```bash
# Log-Rotation konfigurieren
cat > /etc/docker/daemon.json << EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

# Docker neu starten
sudo systemctl restart docker
```

## Sicherheit

### Best Practices

1. **Firewall aktivieren** (siehe oben)
2. **Regelmäßige Updates**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
3. **SSH absichern**:
   ```bash
   # /etc/ssh/sshd_config
   PermitRootLogin no
   PasswordAuthentication no
   ```
4. **Fail2ban installieren**:
   ```bash
   sudo apt install -y fail2ban
   ```

### Secrets Management

Verwenden Sie Docker Secrets für sensible Daten:

```bash
# Secret erstellen
echo "my-secret-key" | docker secret create db_password -

# In docker-compose.yml verwenden
secrets:
  - db_password
```

## Systemd Service (Optional)

Für automatischen Start beim Booten:

```bash
# Service-Datei erstellen
sudo nano /etc/systemd/system/doppelkopf.service
```

```ini
[Unit]
Description=Doppelkopf Counter
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/doppelkopf
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

```bash
# Service aktivieren
sudo systemctl enable doppelkopf
sudo systemctl start doppelkopf

# Status prüfen
sudo systemctl status doppelkopf
```

## Produktions-Checkliste

- [ ] Docker & Docker Compose installiert
- [ ] Code auf Server übertragen
- [ ] `data/database` Verzeichnis erstellt
- [ ] Images gebaut (`docker-compose build`)
- [ ] Services gestartet (`docker-compose up -d`)
- [ ] Zugriff getestet (Frontend & API)
- [ ] Firewall konfiguriert
- [ ] Backup-System eingerichtet
- [ ] Domain & SSL konfiguriert (optional)
- [ ] Monitoring eingerichtet
- [ ] Logs überprüft

## Support

Bei Problemen:

1. Logs prüfen: `docker-compose logs -f`
2. Status prüfen: `docker-compose ps`
3. Container neu starten: `docker-compose restart`
4. Health-Check: `curl http://localhost:3000/api/health`

---

**Viel Erfolg mit dem Deployment! 🎴🐳**
