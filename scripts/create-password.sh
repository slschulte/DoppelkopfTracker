#!/bin/bash

# Erstellt die .htpasswd-Datei für den Passwortschutz der Doppelkopf-Seite
# Verwendung: ./scripts/create-password.sh
# oder:       ./scripts/create-password.sh mein_geheimes_passwort

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
HTPASSWD_FILE="${PROJECT_DIR}/.htpasswd"
USERNAME="doppelkopf"

echo "Doppelkopf – Passwortschutz einrichten"
echo "======================================="
echo ""

# Prüfen ob htpasswd verfügbar ist
if command -v htpasswd &> /dev/null; then
    if [ -n "$1" ]; then
        PASSWORD="$1"
        htpasswd -bc "$HTPASSWD_FILE" "$USERNAME" "$PASSWORD"
        echo "Passwort-Datei erstellt: $HTPASSWD_FILE"
    else
        echo "Passwort eingeben für Benutzer '$USERNAME':"
        htpasswd -c "$HTPASSWD_FILE" "$USERNAME"
        echo "Passwort-Datei erstellt: $HTPASSWD_FILE"
    fi
elif command -v openssl &> /dev/null; then
    if [ -n "$1" ]; then
        PASSWORD="$1"
    else
        echo -n "Passwort eingeben für Benutzer '$USERNAME': "
        read -s PASSWORD
        echo ""
        echo -n "Passwort wiederholen: "
        read -s PASSWORD2
        echo ""
        if [ "$PASSWORD" != "$PASSWORD2" ]; then
            echo "Fehler: Passwörter stimmen nicht überein."
            exit 1
        fi
    fi
    # openssl passwd -apr1 erzeugt Apache-compatiblen Hash
    HASH=$(openssl passwd -apr1 "$PASSWORD")
    echo "${USERNAME}:${HASH}" > "$HTPASSWD_FILE"
    chmod 644 "$HTPASSWD_FILE"
    echo "Passwort-Datei erstellt: $HTPASSWD_FILE (mit openssl)"
else
    echo "Weder 'htpasswd' (apache2-utils) noch 'openssl' gefunden."
    echo "Bitte installieren Sie eines davon:"
    echo "  Ubuntu/Debian: apt install apache2-utils"
    echo "  oder nutzen Sie openssl (meist vorinstalliert)"
    exit 1
fi

echo ""
echo "Nächste Schritte:"
echo "  1. Sicherstellen, dass docker-compose.yml das Volume enthält:"
echo "     volumes:"
echo "       - ./.htpasswd:/etc/nginx/.htpasswd:ro"
echo "  2. nginx.conf nutzt: auth_basic_user_file /etc/nginx/.htpasswd;"
echo "  3. Container neu starten: docker-compose up -d --build frontend"
echo ""
