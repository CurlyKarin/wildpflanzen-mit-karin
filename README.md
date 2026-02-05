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
