#!/bin/bash

# Backup-Script für Doppelkopf Counter Datenbank
# Verwendung: ./scripts/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
DB_FILE="./data/database/doppelkopf.db"

# Erstelle Backup-Verzeichnis falls nicht vorhanden
mkdir -p $BACKUP_DIR

# Prüfe ob Datenbank existiert
if [ ! -f "$DB_FILE" ]; then
    echo "❌ Datenbank nicht gefunden: $DB_FILE"
    exit 1
fi

# Erstelle Backup
BACKUP_FILE="$BACKUP_DIR/doppelkopf_${DATE}.db"
cp "$DB_FILE" "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✓ Backup erstellt: $BACKUP_FILE"
    
    # Zeige Backup-Größe
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "  Größe: $SIZE"
    
    # Lösche alte Backups (älter als 30 Tage)
    find $BACKUP_DIR -name "doppelkopf_*.db" -mtime +30 -delete
    
    # Zeige Anzahl der Backups
    COUNT=$(ls -1 $BACKUP_DIR/doppelkopf_*.db 2>/dev/null | wc -l)
    echo "  Vorhandene Backups: $COUNT"
else
    echo "❌ Backup fehlgeschlagen"
    exit 1
fi
