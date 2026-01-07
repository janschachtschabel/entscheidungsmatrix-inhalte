# Entscheidungsmatrix für Datennutzung

Eine interaktive Web-Anwendung zur Klassifizierung und Bewertung von Datenquellen nach einem 3-Stufen-Modell.

## Features

- **Stufe 1: Intake & Hygiene** - Erfassung von Herkunft, Komponenten und PII-Status
- **Stufe 2: Rechte & Policies** - Prüfung von Lizenzen, Verträgen und ToS
- **Stufe 3: Use-Case Auskunft** - Entscheidungsmatrix mit Ampel-System

## Use-Cases

Die Anwendung bewertet folgende Nutzungsszenarien:

- **SEARCH** - Suche/Anzeige/Index
- **TRAIN** - KI-Training/Fine-Tuning
- **DS-NC** - Dataset-Weitergabe (non-commercial)
- **DS-COMM** - Dataset-Weitergabe (kommerziell)
- **MODEL-SHARE** - Weitergabe trainierter Modelle

## Komponenten

- **FACTS** - Metadaten (Titel, Autor, Jahr, URL)
- **TEXT** - Beschreibungen, Abstracts, Fließtext
- **MEDIA** - Bilder, Thumbnails, Videos
- **DERIVED** - Embeddings, Summaries, Klassifikationen

## Ampel-System

- 🟢 **Zulässig** - Standardmaßnahmen genügen
- 🟡 **Bedingt zulässig** - Nur mit Auflagen/Trennung
- 🔴 **Unzulässig** - Stopp/Quarantäne bis Klärung

## Installation

```bash
npm install
npm run dev
```

## Build für Produktion

```bash
npm run build
```

## Deployment (Vercel)

Das Projekt ist für Vercel optimiert. Einfach mit GitHub verbinden oder:

```bash
npx vercel
```

## Technologie-Stack

- React 18
- Vite
- TailwindCSS
- Lucide Icons
