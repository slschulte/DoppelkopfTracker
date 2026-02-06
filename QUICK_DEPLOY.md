# 🚀 Quick Deploy Guide

Schnellstart-Anleitung für das Deployment auf Ihrem Ubuntu Server.

## Schritt 1: Voraussetzungen auf Ubuntu Server

```bash
# Als root oder mit sudo
sudo apt update
sudo apt install -y docker.io docker-compose git

# Docker-Dienst starten
sudo systemctl start docker
sudo systemctl enable docker

# Benutzer zur Docker-Gruppe hinzufügen
sudo usermod -aG docker $USER
newgrp docker
```

## Schritt 2: Code auf Server hochladen

### Option A: Von lokalem Computer mit rsync (empfohlen)

```bash
# Auf lokalem Mac/Linux
cd /Users/simon/Coding/Projects/DoppelkopfCounter

# Auf Server hochladen (ersetzen Sie user@server-ip)
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'data' \
  . user@192.168.1.100:/opt/doppelkopf/
```

### Option B: Git Clone auf Server

```bash
# Auf Server
cd /opt
git clone <your-repo-url> doppelkopf
cd doppelkopf
```

### Option C: Manueller Upload als Zip

```bash
# Auf lokalem Computer
cd /Users/simon/Coding/Projects/DoppelkopfCounter
tar -czf doppelkopf.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='data' \
  --exclude='backups' \
  .

# Auf Server hochladen (ersetzen Sie user@server-ip)
scp doppelkopf.tar.gz user@192.168.1.100:/tmp/

# Auf Server entpacken
ssh user@192.168.1.100
sudo mkdir -p /opt/doppelkopf
cd /opt/doppelkopf
sudo tar -xzf /tmp/doppelkopf.tar.gz
sudo chown -R $USER:$USER /opt/doppelkopf
```

## Schritt 3: Deployment auf Server

```bash
# Auf Server
cd /opt/doppelkopf

# Automatisches Deployment-Script
./scripts/deploy.sh

# ODER manuell:
mkdir -p data/database
docker-compose build
docker-compose up -d
```

## Schritt 4: Zugriff testen

```bash
# Backend-Health-Check
curl http://localhost:3000/api/health

# Frontend aufrufen im Browser:
# http://YOUR_SERVER_IP/
```

## Schritt 5: Firewall öffnen (wichtig!)

```bash
# Auf Server
sudo ufw allow 80/tcp
sudo ufw allow 22/tcp  # SSH nicht vergessen!
sudo ufw enable
sudo ufw status
```

## Fertig! 🎉

Die Anwendung läuft jetzt unter:
- **Frontend**: `http://YOUR_SERVER_IP/`
- **Backend API**: `http://YOUR_SERVER_IP/api/`

## Nützliche Befehle

```bash
# Logs anzeigen
docker-compose logs -f

# Services neu starten
docker-compose restart

# Services stoppen
docker-compose down

# Backup erstellen
./scripts/backup.sh

# Status prüfen
docker-compose ps
```

## Troubleshooting

### Port 80 bereits belegt?

```bash
# Prüfen was Port 80 nutzt
sudo netstat -tulpn | grep :80

# Apache/nginx stoppen falls vorhanden
sudo systemctl stop apache2
sudo systemctl stop nginx

# Oder anderen Port in docker-compose.yml verwenden:
# ports:
#   - "8080:80"
```

### Container startet nicht?

```bash
# Logs prüfen
docker-compose logs backend
docker-compose logs frontend

# Container-Status
docker-compose ps

# Neu bauen ohne Cache
docker-compose build --no-cache
docker-compose up -d
```

### Datenbank-Fehler?

```bash
# Berechtigungen prüfen
ls -la data/database/

# Berechtigungen korrigieren
chmod 755 data/database
chmod 644 data/database/doppelkopf.db

# Backend neu starten
docker-compose restart backend
```

## Vollständige Dokumentation

Siehe `DEPLOYMENT.md` für:
- SSL/HTTPS Setup mit Let's Encrypt
- Automatische Backups
- Monitoring
- Performance-Optimierung
- Sicherheits-Best-Practices

---

**Viel Erfolg! Bei Fragen siehe DEPLOYMENT.md** 🎴
