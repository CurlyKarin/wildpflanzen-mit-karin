# Schriften (selbst gehostet)

Alle Schriften werden lokal eingebunden – keine Abhängigkeit von Google oder anderen Diensten. Lizenzen: **SIL Open Font License (OFL)** bzw. **OFL**, frei für private und kommerzielle Nutzung.

## Schrift-Optionen umschalten

Im `<body>` in `index.html` das Attribut **data-fonts** setzen:

| Wert | Option | Überschriften | Fließtext |
|------|--------|----------------|-----------|
| (keins) oder `lora` | Standard | Lora | Lora |
| **a** | Ruhig & modern | Playfair Display | Inter |
| **b** | Natürlich & warm | Cormorant | Source Sans 3 |
| **c** | Sehr klar & ruhig | Inter | Inter |

Beispiel: `<body data-fonts="b">` für Option B.

## Font-Dateien einrichten

Die benötigten `.woff2`-Dateien von [google-webfonts-helper](https://gwfh.mranftl.com/) herunterladen (jeweils **Charsets: latin**, **Font Files: woff2**), entpacken und die Dateien in diesen Ordner (`public/fonts/`) legen.

### Lora (Standard)
- [Lora – latin, woff2](https://gwfh.mranftl.com/fonts/lora?subsets=latin)
- Erwartete Dateinamen in `styles.css`: `lora-v26-latin-*.woff2` (regular, 500, 600, 700, italic, 500italic)

### Option A: Playfair Display + Inter
- [Playfair Display – latin, woff2](https://gwfh.mranftl.com/fonts/playfair-display?subsets=latin)  
  → `playfair-display-v30-latin-regular.woff2`, `-500`, `-600`, `-700`
- [Inter – latin, woff2](https://gwfh.mranftl.com/fonts/inter?subsets=latin)  
  → `inter-v18-latin-regular.woff2`, `-500`, `-600`, `-700`

### Option B: Cormorant + Source Sans 3
- [Cormorant – latin, woff2](https://gwfh.mranftl.com/fonts/cormorant?subsets=latin)  
  → `cormorant-v21-latin-regular.woff2`, `-500`, `-600`, `-700`
- [Source Sans 3 – latin, woff2](https://gwfh.mranftl.com/fonts/source-sans-3?subsets=latin)  
  → `source-sans-3-v15-latin-regular.woff2`, `-600`, `-700`

### Option C
- Es reichen die **Inter**-Dateien wie bei Option A.

Falls die heruntergeladene Version andere Dateinamen hat (z. B. v31 statt v30), die Dateien entsprechend umbenennen oder die Pfade in `styles.css` anpassen.
