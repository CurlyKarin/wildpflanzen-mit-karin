# Wildpflanzen mit Karin

Website für Wildpflanzen-Coaching in Braunschweig & Wolfenbüttel

## Lokale Entwicklung

### Option 1: Python (einfachste Methode)

```bash
cd public
python3 -m http.server 8000
```

Dann öffne im Browser: http://localhost:8000

### Option 2: Node.js (mit npx)

```bash
cd public
npx serve
```

### Option 3: PHP

```bash
cd public
php -S localhost:8000
```

### Option 4: Direkt öffnen

Öffne `public/index.html` direkt im Browser (funktioniert, aber einige Features könnten eingeschränkt sein).

## Wichtig

- Die Seite benötigt **Internetverbindung** für die Sanity API
- CORS muss für `localhost` in Sanity konfiguriert sein (falls nötig)

## Sanity Schema deployen

```bash
cd sanity
npx sanity schema deploy
```

## Favicon (Tab-/App-Icon)

Die Icons für Browser-Tab, Lesezeichen und „Zum Home-Bildschirm“ werden mit **[favicon.io](https://favicon.io)** erzeugt.

### Icon später ändern

1. Auf [favicon.io](https://favicon.io) gehen (z. B. „Image“ oder „Text“ nutzen).
2. Neues Icon erzeugen und das **ZIP-Paket** herunterladen.
3. ZIP entpacken.
4. **Alle Dateien** aus dem Paket in den Ordner `public/` kopieren (bestehende Favicon-Dateien ersetzen):
   - `favicon.ico`
   - `favicon-16x16.png`
   - `favicon-32x32.png`
   - `apple-touch-icon.png`
   - `android-chrome-192x192.png`
   - `android-chrome-512x512.png`
   - `site.webmanifest`
5. In der `site.webmanifest` prüfen: Name und ggf. Theme-Farbe passen (z. B. `"name": "Wildpflanzen mit Karin"`).
6. Änderungen committen und pushen – die `index.html` verweist bereits auf alle Dateien, es muss nichts im HTML geändert werden.
