## Voraussetzungen:

- 2x Raspberry Pi (1x als Server, 1x in der Box)
- Epson TM-T20
- [HiveMQ MQTT Broker](https://www.hivemq.com/mqtt-cloud-broker/) (Kostenloses Kontingent reicht aus)
  - Notwendige Informationen für Setup: URL des MQTT-Brokers, Benutzername und Passwort für MQTT-Verbindung
- [MongoDB Atlas Datenbank](https://www.mongodb.com/atlas/database) (Kostenloses Kontingent reicht aus)
  - Notwendige Informationen für Setup: Connection String der Datenbanl

## (Optional) Datenbank _vorfüllen_

1.  In MongoDB Atlas Web-Oberfläche anmelden
2.  Eine Collection mit dem Namen `confessions` in der MongoDB-Datenbank erstellen
3.  In dieser Collection sog. Documents in folgendem Format erstellen:
    ```json
    {
      "_id": { "$oid": "649350c020aa6b7f42a71517" },
      "message": "GEHEIMNIS-TEXT",
      "__v": { "$numberInt": "0" }
    }
    ```
    **Wichtig**:
    - Der Wert für `"_id"` wird automatisch generiert, wenn man über die MongoDB-Atlas-Weboberfläche ein Document erstellt.
    - Der Wert für `"__v"` ist immer `{ "$numberInt": "0" }`
    - Der Wert für `"message"` kann ein beliebiger Geheimnistext sein

## Setup Server

1. Raspberry Pi OS-Betriebssystem auf Raspberry Pi installieren (https://www.raspberrypi.com/documentation/computers/getting-started.html#installing-the-operating-system)
2. Raspberry Pi mit dem Internet verbinden
3. Docker auf Raspberry Pi installieren (https://docs.docker.com/engine/install/raspbian/)
4. Docker-Image für Frontend bauen
   1. Verzeichnis `blackbox-ui` auf Raspberry Pi übertragen
   2. Das Skript `build-docker-image.sh` im Verzeichnis `blackbox-ui` ausführen
5. Docker-Image für Backend-Service bauen
   1. Verzeichnis `blackbox-server` auf Raspberry Pi übertragen
   2. Das Skript `build-docker-image.sh` im Verzeichnis `blackbox-server` ausführen`
6. Docker-Container starten
   1. Verzeichnis `deployment/server` auf Raspberry Pi übertragen
   2. In der Datei `deployment/server/docker-compose.yml` die Zugangsdaten für MongoDB-Datenbank und HiveMQ-MQTT-Broker ergänzen. Hierzu müssen für folgende Umgebungsvariablen am "backend"-Service Werte gesetzt werden:
      - MongoDB Connection String: `MONGODB_URI` (Details zum MongoDB Connection String: https://www.mongodb.com/docs/manual/reference/connection-string/)
      - MQTT-Broker-URL: `MQTT_URL`
      - MQTT-Broker-Benutzername: `MQTT_USERNAME`
      - MQTT-Broker-Passwort: `MQTT_PASSWORD`
   3. Im Verzeichnis `deployment/server` den Befehl `docker compose up -d` im Terminal ausführen, um die Docker-Container zu starten (Info: Docker Compose-Konfiguration ist so gestaltet, dass die Docker-Container nach der Einrichtung bei einem Neustart des Raspberry Pis automatisch neustarten.)

## Setup Box

1. Raspberry Pi OS-Betriebssystem auf Raspberry Pi installieren (https://www.raspberrypi.com/documentation/computers/getting-started.html#installing-the-operating-system)
2. Raspberry Pi mit dem Internet verbinden
3. CUPS (Common Unix Printing System) installieren (https://www.elektronik-kompendium.de/sites/raspberry-pi/2007081.htm)

   (Tipp: Die Weboberfläche von CUPS ist nach der Installation unter `${IP-ADRESSE-DES-RASPBERRY-PI}:631` erreichbar)

4. [Druckertreiber](https://github.com/klirichek/zj-58) installieren: https://github.com/klirichek/zj-58#building-and-installing
5. Drucker mit Raspberry Pi über USB verbinden
6. Ducker in CUPS einrichten. **Wichtig**: Druckername muss `EPSON_TM-T20` lauten.
7. NodeJS auf dem Raspberry Pi installieren (https://pimylifeup.com/raspberry-pi-nodejs/)
8. Service zur Verwaltung der Druckaufträge installieren
   1. Verzeichnis `blackbox-printer` auf Raspberry Pi übertragen
   2. Im Verzeichnis `blackbox-printer` den Befehl `npm ci` im Terminal ausführen, um notwendige Abhängigkeiten zu installieren
9. Den _blackbox-printer_-Service als Systemdienst installieren
   1. Verzeichnis `deployment/box` auf Raspberry Pi übertragen
   2. Konfiguration des Systemdiensts anpassen, hierzu muss die Datei `deployment\box\blackbox-printer.service` angepasst werden
      1. Der Wert `WorkingDirectory` muss angepasst werden, so dass hier der volle Pfad zum `blackbox-printer`-Verzeichnis eingetragen ist. (Beispiel: `WorkingDirectory=/home/box/black-box/printer-service`)
      2. Umgebungsvariablen für die Verbindung zum MQTT-Broker anpassen.
         - MQTT-Broker-URL: `Environment="MQTT_URL="`
         - MQTT-Broker-Benutzername : `Environment="MQTT_USERNAME="`
         - MQTT-Broker-Passwort : `Environment="MQTT_PASSWORD="`
   3. Im Verzeichnis in dem sich die Datei `blackbox-printer.service` befindet folgende Befehle auf der Konsole ausführen, um den Systemdienst einzurichten und zu starten:
      ```bash
      # Konfiguration kopieren
      sudo cp blackbox-printer.service /etc/systemd/system
      # Systemdienst starten
      sudo systemctl enable blackbox-printer.service
      sudo systemctl start blackbox-printer.service
      ```
10. Raspberry Pi neustarten (Der zuvor eingerichtete Systemdienst startet nach einem Neustart automatisch)
