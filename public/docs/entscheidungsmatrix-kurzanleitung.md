# Entscheidungsmatrix für Datennutzung – Kurzanleitung

> **Zweck:** Schnelle Prüfung, welche Use-Cases für eine Datenquelle erlaubt sind.  
> **Zielgruppe:** Data Engineers, Content Manager, Legal/Compliance  
> **Detaillierte Anleitungen:** Siehe Checklisten (Stufe 1-3)

---

## Übersicht: 3-Stufen-Modell

| Stufe | Name | Ergebnis | Dauer |
|-------|------|----------|-------|
| **1** | Intake & Hygiene | Datenpass + Pool-Routing | ~2 Min |
| **2** | Rechte & Policies | Rights Profile + Tags | ~5 Min |
| **3** | Use-Case Auskunft | Entscheidungsmatrix | automatisch |

**→ Checklisten:** [Stufe 1](checklisten/stufe1-intake-hygiene.pdf) | [Stufe 2](checklisten/stufe2-rechte-policies.pdf) | [Stufe 3](checklisten/stufe3-usecase-auskunft.pdf)

---

## Quick-Start: Welcher Pfad gilt?

```
Eigene Daten (OWN)?
  └─ JA → Stufe 1 ausfüllen → fertig (alle Use-Cases 🟢)
  └─ NEIN ↓

Unkooperativ erhoben (UNCOOP)?
  └─ JA → STOPP 🔴 Quarantäne
  └─ NEIN ↓

Kooperation mit Vertrag (COOP)?
  └─ JA → Stufe 1 + Vertragsfragen aus Stufe 2
  └─ NEIN ↓

Plattformdaten (PLATFORM) oder Unbekannt (UNKNOWN)?
  └─ Stufe 1 + Stufe 2 vollständig durchlaufen
```

---

## Ampel-System

| Symbol | Bedeutung | Aktion |
|--------|-----------|--------|
| 🟢 | **Zulässig** | Standardmaßnahmen genügen |
| 🟡 | **Bedingt** | Auflagen beachten (siehe REQ.*) |
| 🔴 | **Unzulässig** | Stopp bis Klärung |

---

## Use-Cases (Spalten der Matrix)

| Use-Case | Beschreibung |
|----------|--------------|
| **SEARCH** | Suche, Anzeige, Snippet |
| **TRAIN_INT** | Internes KI-Training (nicht veröffentlicht) |
| **TRAIN** | Externes KI-Training / Fine-Tuning |
| **DS_NC** | Dataset-Weitergabe (non-commercial) |
| **DS_COMM** | Dataset-Weitergabe (kommerziell) |
| **MODEL_SHARE** | Trainiertes Modell veröffentlichen |

---

## Komponenten (Zeilen der Matrix)

| Komponente | Beispiele |
|------------|-----------|
| **FACTS** | Titel, Autor, Jahr, URL, Schlagworte |
| **TEXT** | Beschreibung, Abstract, Fließtext |
| **MEDIA** | Bilder, Thumbnails, Videos |
| **DERIVED** | Embeddings, Summaries, KI-Outputs |

> ⚠️ **DERIVED-Regel:** Nie freier als die Basis-Komponenten!

---

## Tag-System (Kurzreferenz)

### BLOCK.* – Harte Sperren

| Tag | Wirkung |
|-----|---------|
| `BLOCK.UNCOOP` | Alle Use-Cases 🔴 |
| `BLOCK.PLATFORM_NO_OPTIN` | Nur FACTS.SEARCH 🟢, Rest 🔴 |
| `BLOCK.TDM_OPTOUT` | TRAIN + MODEL_SHARE 🔴 |
| `BLOCK.TOS_AI` | TRAIN + MODEL_SHARE 🔴 |
| `BLOCK.TOS_REDIST` | DS_NC + DS_COMM 🔴 |

### LIMIT.* – Einschränkungen

| Tag | Wirkung |
|-----|---------|
| `LIMIT.NC_ONLY` | DS_COMM + MODEL_SHARE 🔴 |
| `LIMIT.TRAIN_INT_ONLY` | TRAIN 🔴, TRAIN_INT 🟡 |
| `LIMIT.DB_RISK_COMM` | FACTS.DS_COMM 🔴 |

### REQ.* – Auflagen

| Tag | Auflage |
|-----|---------|
| `REQ.ATTRIBUTION` | Quellenangabe erforderlich |
| `REQ.LINK_ONLY` | Nur verlinken, nicht kopieren |

---

## Fail-Safe Prinzip

> **Bei Unklarheit: Immer 🔴 setzen, keine stille Freigabe!**

- Unbekannte Lizenz? → `BLOCK.LICENSE_UNKNOWN`
- Unklare Rechte? → `BLOCK.RIGHTS_UNKNOWN`
- PII nicht bereinigt? → `PII_QUARANTINE`

---

## Ressourcen

| Typ | Link |
|-----|------|
| **Web-App** | [Entscheidungsmatrix-Tool](http://localhost:5173) |
| **Checkliste Stufe 1** | [PDF](checklisten/stufe1-intake-hygiene.pdf) / [Markdown](checklisten/stufe1-intake-hygiene.md) |
| **Checkliste Stufe 2** | [PDF](checklisten/stufe2-rechte-policies.pdf) / [Markdown](checklisten/stufe2-rechte-policies.md) |
| **Checkliste Stufe 3** | [PDF](checklisten/stufe3-usecase-auskunft.pdf) / [Markdown](checklisten/stufe3-usecase-auskunft.md) |
| **Flowchart Stufe 1** | [SVG](flowcharts/stufe1-intake-hygiene.svg) |
| **Flowchart Stufe 2** | [SVG](flowcharts/stufe2-rechte-policies.svg) |
| **Flowchart Stufe 3** | [SVG](flowcharts/stufe3-usecase-auskunft.svg) |

---

## Änderungshistorie

| Version | Datum | Änderung |
|---------|-------|----------|
| 1.0 | 2026-01-07 | Erstversion |

---

*Bei Fragen: [Team Data Governance]*
