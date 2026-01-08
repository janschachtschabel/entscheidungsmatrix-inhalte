# Prüfworkflow für Inhalte & Daten

## Ziel & Ergebnisformat

**Ziel:** Jede Datenlieferung durchläuft drei Stufen und erhält am Ende eine Entscheidungsmatrix, die pro Komponente und Use-Case eine Ampel (🟢/🟡/🔴) ausgibt.

**Ergebnismatrix (Beispiel):**

| Komponente | SEARCH_DISPLAY | TRAIN_INT | TRAIN_EXT | DATASET_NC | DATASET_COMM | MODEL_SHARE |
|------------|:--------------:|:---------:|:---------:|:----------:|:------------:|:-----------:|
| FACTS      | 🟢             | 🟢        | 🟡        | 🟢         | 🟡           | 🔴          |
| TEXT       | 🟢             | 🟡        | 🔴        | 🟡         | 🔴           | 🔴          |
| MEDIA      | 🟡             | 🔴        | 🔴        | 🔴         | 🔴           | 🔴          |
| DERIVED    | 🟡             | 🔴        | 🔴        | 🔴         | 🔴           | 🔴          |

---

## Ampel-Legende

| Symbol | Bedeutung | Aktion |
|--------|-----------|--------|
| 🟢 | Zulässig | Standardmaßnahmen genügen |
| 🟡 | Bedingt | Nur mit Auflagen (siehe `Req.*`) |
| 🔴 | Unzulässig | Stopp bis Klärung |

---

## Leitprinzipien

- **Minimalprinzip:** Bevorzugt FACTS, so wenig schöpferische Inhalte wie nötig
- **Komponentenprinzip:** Bewertung pro Komponente, nicht pauschal pro Datensatz
- **Zweckbindung:** Zweckänderung = Neubewertung
- **Trennungsprinzip:** NC, PLATFORM, UNKLAR strikt getrennt halten
- **Fail-safe:** Bei Unklarheit → FACTS-only oder Quarantäne

---

## Komponenten

| ID | Inhalt |
|----|--------|
| `FACTS` | Titel, Autor, Jahr, URL, Schlagworte |
| `TEXT` | Beschreibung, Abstract, Fließtext |
| `MEDIA` | Bilder, Thumbnails, Videos |
| `DERIVED` | Embeddings, Summaries, KI-Outputs |

**Regel:** `DERIVED` nie freier als Basis-Komponenten.

---

## Use-Cases

| ID | Beschreibung |
|----|--------------|
| `SEARCH_DISPLAY` | Suche, Anzeige, Snippet |
| `TRAIN_INT` | Internes KI-Training (nicht veröffentlicht) |
| `TRAIN_EXT` | Externes KI-Training / Fine-Tuning |
| `DATASET_NC` | Dataset-Weitergabe (non-commercial) |
| `DATASET_COMM` | Dataset-Weitergabe (kommerziell) |
| `MODEL_SHARE` | Trainiertes Modell veröffentlichen |

---

# Stufe 1 – Intake & Hygiene

**Zweck:** Klassifizierung, PII-Bereinigung, Datenpass erstellen. Keine Rechtsfreigabe.

## 1.1 Herkunft (Quellebene)

| Frage | Antwort | Tag | Wirkung |
|-------|---------|-----|---------|
| Woher stammen die Daten? | Eigene Daten | `Source.Own` | → Pool `SAFE_CANDIDATE` |
| | Kooperation/Vertrag | `Source.Coop` | → Pool `COOP_CANDIDATE` |
| | Plattform (YouTube etc.) | `Source.Platform` | → Pool `PLATFORM_CANDIDATE` |
| | Unkooperativ (Scraping trotz Verbot) | `Source.Uncoop` | → `Block.Uncoop` → **STOP** |
| | Unbekannt | `Source.Unknown` | → Pool `UNKLAR_CANDIDATE` |

## 1.2 Komponenten

Erfassen welche Komponenten vorhanden sind: `Has.Facts`, `Has.Text`, `Has.Media`, `Has.Derived`

## 1.3 PII-Hygiene

| Prüfung | Status | Tag |
|---------|--------|-----|
| PII-Risiko | none / possible / high | `Pii.Status` |
| Maßnahmen | minimiert / anonymisiert / gesperrt | `Pii.Handled` |
| Quarantäne nötig? | ja | `Block.PiiQuarantine` |

## 1.4 Output: Datenpass

```
Pass.SourceDomain     = "example.com"
Pass.SourceClass      = Source.Coop
Pass.ContractId       = "C-2024-001"
Pass.Components       = [FACTS, TEXT]
Pass.Pii              = Pii.Status.None
Pass.Pool             = COOP_CANDIDATE
```

---

# Stufe 2 – Rechte & Policies

**Zweck:** Tags vergeben, die Stufe 3 direkt auswerten kann.

## 2.0 Input aus Stufe 1

- `Pass.SourceClass`, `Pass.ContractId`, `Pass.Components`, `Pass.Pii`

## 2.1 Tag-System

### A) Blocker-Tags (sperren Use-Cases)

| Tag | Bedeutung |
|-----|-----------|
| `Block.Uncoop` | Unkooperativer Zugriff |
| `Block.PlatformNoOptin` | Plattformdaten ohne Opt-in |
| `Block.RightsUnknown` | Rechtebasis unklar |
| `Block.LicenseUnknown` | Lizenz unbekannt/unbelegt |
| `Block.TosAi` | ToS verbietet KI |
| `Block.TosRedist` | ToS verbietet Weitergabe |
| `Block.TdmOptout` | TDM-Opt-out vorhanden |
| `Block.PiiQuarantine` | PII nicht bereinigt |

### B) Limit-Tags (schränken ein)

| Tag | Bedeutung |
|-----|-----------|
| `Limit.NcOnly` | Nur non-commercial |
| `Limit.TrainIntOnly` | Nur internes Training |
| `Limit.DbRiskComm` | DB-Risiko bei kommerzieller Nutzung |

### C) Req-Tags (Auflagen)

| Tag | Bedeutung |
|-----|-----------|
| `Req.Attribution` | Quellenangabe erforderlich |
| `Req.LinkOnly` | Nur verlinken, nicht kopieren |

---

## 2.2 Entscheidungslogik

### Gate A – Harte Ausschlüsse

```
Q1: Source.Uncoop?
    JA → Block.Uncoop → End.*.* = 🔴 (alle)

Q2: Source.Platform UND kein Opt-in?
    JA → Block.PlatformNoOptin
       → End.FACTS.SEARCH_DISPLAY = 🟢
       → End.*.TRAIN_* = 🔴
       → End.*.DATASET_* = 🔴
       → End.*.MODEL_SHARE = 🔴
```

### Gate B – Rechtebasis

```
Q3: Quelle = Rechteinhaber oder berechtigt?
    NEIN (Aggregator/unklar) → Block.RightsUnknown
       → End.TEXT.* = 🔴
       → End.MEDIA.* = 🔴
       → End.DERIVED.* = 🔴
```

### Gate C – Vertrag

```
Q4: Vertrag vorhanden?
    JA → Scope aus Vertrag:
       - KI verboten?      → Block.TosAi
       - Nur intern?       → Limit.TrainIntOnly
       - Weitergabe verboten? → Block.TosRedist
    NEIN → weiter zu Gate D
```

### Gate D – Lizenz

```
Q5: Lizenz bekannt und belegt?
    NEIN → Block.LicenseUnknown
       → End.TEXT.* = 🔴
       → End.MEDIA.* = 🔴

    JA → Lizenztyp auswerten:
```

| Lizenz | Tags | SEARCH | TRAIN_INT | TRAIN_EXT | DS_NC | DS_COMM | MODEL |
|--------|------|:------:|:---------:|:---------:|:-----:|:-------:|:-----:|
| CC0/PD | – | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟡 |
| CC BY | `Req.Attribution` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟡 |
| CC BY-NC | `Limit.NcOnly` | 🟢 | 🟡 | 🔴 | 🟢 | 🔴 | 🔴 |
| Proprietär | – | 🟡 | 🟡 | 🔴 | 🔴 | 🔴 | 🔴 |

### Gate E – Opt-outs (ToS/TDM)

```
Q6: ToS verbietet KI?
    JA → Block.TosAi
       → End.*.TRAIN_* = 🔴
       → End.*.MODEL_SHARE = 🔴

Q7: ToS verbietet Weitergabe?
    JA → Block.TosRedist
       → End.*.DATASET_* = 🔴

Q8: TDM-Opt-out vorhanden?
    JA → Block.TdmOptout
       → End.*.TRAIN_* = 🔴
       → End.*.MODEL_SHARE = 🔴
```

### Gate F – Datenbankrecht

```
Q9: Systematischer Abruf + kommerziell + kein Vertrag?
    JA → Limit.DbRiskComm
       → End.FACTS.DATASET_COMM = 🔴
```

---

## 2.3 Tag-Engine (Blocker → Wirkung)

| Blocker | Betroffene Endzustände |
|---------|------------------------|
| `Block.Uncoop` | `End.*.* = 🔴` |
| `Block.PiiQuarantine` | `End.*.* = 🔴` |
| `Block.PlatformNoOptin` | `End.*.TRAIN_* = 🔴`, `End.*.DATASET_* = 🔴`, `End.*.MODEL_SHARE = 🔴` |
| `Block.RightsUnknown` | `End.TEXT.* = 🔴`, `End.MEDIA.* = 🔴`, `End.DERIVED.* = 🔴` |
| `Block.LicenseUnknown` | `End.TEXT.* = 🔴`, `End.MEDIA.* = 🔴`, `End.DERIVED.* = 🔴` |
| `Block.TosAi` | `End.*.TRAIN_* = 🔴`, `End.*.MODEL_SHARE = 🔴` |
| `Block.TosRedist` | `End.*.DATASET_* = 🔴` |
| `Block.TdmOptout` | `End.*.TRAIN_* = 🔴`, `End.*.MODEL_SHARE = 🔴` |
| `Limit.NcOnly` | `End.*.DATASET_COMM = 🔴`, `End.*.MODEL_SHARE = 🔴` |
| `Limit.TrainIntOnly` | `End.*.TRAIN_EXT = 🔴`, `End.*.MODEL_SHARE = 🔴` |
| `Limit.DbRiskComm` | `End.FACTS.DATASET_COMM = 🔴` |

---

## 2.4 Output: Tag-Set

```yaml
Blockers:
  - Block.TosAi
Limits:
  - Limit.NcOnly
Requirements:
  - Req.Attribution

UseCaseTags:
  FACTS:
    SEARCH_DISPLAY: 🟢
    TRAIN_INT: 🟢
    TRAIN_EXT: 🔴
    DATASET_NC: 🟢
    DATASET_COMM: 🔴
    MODEL_SHARE: 🔴
  TEXT:
    SEARCH_DISPLAY: 🟢
    TRAIN_INT: 🟡
    TRAIN_EXT: 🔴
    DATASET_NC: 🟡
    DATASET_COMM: 🔴
    MODEL_SHARE: 🔴
  # ... usw.
```

---

# Stufe 3 – Use-Case Auskunft

**Zweck:** Tags auslesen, Matrix ausgeben. Keine neue Bewertung.

## 3.0 Input

- Aus Stufe 1: `Pass.*`
- Aus Stufe 2: `Block.*`, `Limit.*`, `Req.*`, `End.*.*`

## 3.1 Globale Overrides (Priorität)

| Prio | Bedingung | Wirkung |
|------|-----------|---------|
| 1 | `Block.PiiQuarantine` | `End.*.* = 🔴` |
| 2 | `Block.Uncoop` | `End.*.* = 🔴` |
| 3 | `Block.PlatformNoOptin` | Nur SEARCH erlaubt |
| 4 | `Limit.NcOnly` | Kein COMM, kein MODEL |
| 5 | sonst | Komponentenweise Tags |

## 3.2 Komponentenregel

```
End.K.U = Tag aus Stufe 2

Zusatzregel DERIVED:
  End.DERIVED.U ≤ min(End.FACTS.U, End.TEXT.U, End.MEDIA.U)
```

---

## 3.3 Ergebnis-Matrizen

### Matrix A: Plattform ohne Opt-in

| Komponente | SEARCH_DISPLAY | TRAIN_INT | TRAIN_EXT | DATASET_NC | DATASET_COMM | MODEL_SHARE |
|------------|:--------------:|:---------:|:---------:|:----------:|:------------:|:-----------:|
| FACTS      | 🟢             | 🔴        | 🔴        | 🔴         | 🔴           | 🔴          |
| TEXT       | 🟡             | 🔴        | 🔴        | 🔴         | 🔴           | 🔴          |
| MEDIA      | 🟡             | 🔴        | 🔴        | 🔴         | 🔴           | 🔴          |
| DERIVED    | 🔴             | 🔴        | 🔴        | 🔴         | 🔴           | 🔴          |

### Matrix B: NC-Only (z.B. CC BY-NC)

| Komponente | SEARCH_DISPLAY | TRAIN_INT | TRAIN_EXT | DATASET_NC | DATASET_COMM | MODEL_SHARE |
|------------|:--------------:|:---------:|:---------:|:----------:|:------------:|:-----------:|
| FACTS      | 🟢             | 🟢        | 🟡        | 🟢         | 🔴           | 🔴          |
| TEXT       | 🟢             | 🟡        | 🔴        | 🟡         | 🔴           | 🔴          |
| MEDIA      | 🟢             | 🟡        | 🔴        | 🟡         | 🔴           | 🔴          |
| DERIVED    | ≤Basis         | ≤Basis    | 🔴        | ≤Basis     | 🔴           | 🔴          |

### Matrix C: SAFE (CC0/CC BY, keine Blocker)

| Komponente | SEARCH_DISPLAY | TRAIN_INT | TRAIN_EXT | DATASET_NC | DATASET_COMM | MODEL_SHARE |
|------------|:--------------:|:---------:|:---------:|:----------:|:------------:|:-----------:|
| FACTS      | 🟢             | 🟢        | 🟢        | 🟢         | 🟢           | 🟡          |
| TEXT       | 🟢             | 🟢        | 🟢        | 🟢         | 🟢           | 🟡          |
| MEDIA      | 🟢             | 🟢        | 🟢        | 🟢         | 🟢           | 🟡          |
| DERIVED    | 🟢             | 🟢        | 🟢        | 🟢         | 🟢           | 🟡          |

### Matrix D: Eigene Daten (Source.Own)

| Komponente | SEARCH_DISPLAY | TRAIN_INT | TRAIN_EXT | DATASET_NC | DATASET_COMM | MODEL_SHARE |
|------------|:--------------:|:---------:|:---------:|:----------:|:------------:|:-----------:|
| FACTS      | 🟢             | 🟢        | 🟢        | 🟢         | 🟢           | 🟢          |
| TEXT       | 🟢             | 🟢        | 🟢        | 🟢         | 🟢           | 🟢          |
| MEDIA      | 🟢             | 🟢        | 🟢        | 🟢         | 🟢           | 🟢          |
| DERIVED    | 🟢             | 🟢        | 🟢        | 🟢         | 🟢           | 🟢          |

---

## 3.4 Standard-Output

### Header
```yaml
Quelle: example.com
SourceClass: Source.Coop
ContractId: C-2024-001
Blockers: [Block.TosAi]
Limits: [Limit.NcOnly]
Requirements: [Req.Attribution]
```

### Ergebnis-Tabelle

| Komponente | SEARCH_DISPLAY | TRAIN_INT | TRAIN_EXT | DATASET_NC | DATASET_COMM | MODEL_SHARE | Auflagen |
|------------|:--------------:|:---------:|:---------:|:----------:|:------------:|:-----------:|----------|
| FACTS      | `End.Facts.SearchDisplay` | `End.Facts.TrainInt` | `End.Facts.TrainExt` | `End.Facts.DatasetNc` | `End.Facts.DatasetComm` | `End.Facts.ModelShare` | – |
| TEXT       | `End.Text.SearchDisplay` | `End.Text.TrainInt` | `End.Text.TrainExt` | `End.Text.DatasetNc` | `End.Text.DatasetComm` | `End.Text.ModelShare` | `Req.Attribution` |
| MEDIA      | `End.Media.SearchDisplay` | `End.Media.TrainInt` | `End.Media.TrainExt` | `End.Media.DatasetNc` | `End.Media.DatasetComm` | `End.Media.ModelShare` | `Req.LinkOnly` |
| DERIVED    | `End.Derived.SearchDisplay` | `End.Derived.TrainInt` | `End.Derived.TrainExt` | `End.Derived.DatasetNc` | `End.Derived.DatasetComm` | `End.Derived.ModelShare` | inherits |

---

## 3.5 Mini-Entscheidungsbaum

```
1. PII_QUARANTINE?        → alles 🔴
2. UNCOOP?                → alles 🔴
3. PLATFORM ohne Opt-in? → nur SEARCH (FACTS 🟢, Rest 🟡), sonst 🔴
4. NC_ONLY?              → DATASET_COMM 🔴, MODEL_SHARE 🔴
5. TOS_AI oder TDM?      → TRAIN_* 🔴, MODEL_SHARE 🔴
6. TOS_REDIST?           → DATASET_* 🔴
7. sonst                 → End.K.U aus Stufe 2
```

---

# 4. Vollständige Entscheidungsmatrix

Die finale Matrix zeigt für jede Kombination aus Komponente und Use-Case den Endzustand als Tag:

| Komponente \ Use-Case | SEARCH_DISPLAY | TRAIN_INT | TRAIN_EXT | DATASET_NC | DATASET_COMM | MODEL_SHARE |
|-----------------------|:--------------:|:---------:|:---------:|:----------:|:------------:|:-----------:|
| **FACTS** | `End.Facts.SearchDisplay` | `End.Facts.TrainInt` | `End.Facts.TrainExt` | `End.Facts.DatasetNc` | `End.Facts.DatasetComm` | `End.Facts.ModelShare` |
| **TEXT** | `End.Text.SearchDisplay` | `End.Text.TrainInt` | `End.Text.TrainExt` | `End.Text.DatasetNc` | `End.Text.DatasetComm` | `End.Text.ModelShare` |
| **MEDIA** | `End.Media.SearchDisplay` | `End.Media.TrainInt` | `End.Media.TrainExt` | `End.Media.DatasetNc` | `End.Media.DatasetComm` | `End.Media.ModelShare` |
| **DERIVED** | `End.Derived.SearchDisplay` | `End.Derived.TrainInt` | `End.Derived.TrainExt` | `End.Derived.DatasetNc` | `End.Derived.DatasetComm` | `End.Derived.ModelShare` |

### Bedingungen pro Zelle

Jeder Endzustand wird durch Blocker bestimmt:

| Endzustand | Erlaubt wenn | Gesperrt durch |
|------------|--------------|----------------|
| `End.*.SearchDisplay` | Keine harten Blocker | `Block.Uncoop`, `Block.PiiQuarantine` |
| `End.*.TrainInt` | Keine KI-Blocker | + `Block.TosAi`, `Block.TdmOptout`, `Block.PlatformNoOptin` |
| `End.*.TrainExt` | Keine KI-Blocker + nicht NC | + `Limit.NcOnly`, `Limit.TrainIntOnly` |
| `End.*.DatasetNc` | Keine Redist-Blocker | + `Block.TosRedist`, `Block.PlatformNoOptin` |
| `End.*.DatasetComm` | Keine Redist + kommerziell erlaubt | + `Limit.NcOnly`, `Limit.DbRiskComm` |
| `End.*.ModelShare` | Training erlaubt + Weitergabe erlaubt | Alle Training-Blocker + `Limit.NcOnly` |

Für TEXT/MEDIA/DERIVED zusätzlich: `Block.RightsUnknown`, `Block.LicenseUnknown`

---

## Tag-Referenz (alphabetisch)

| Tag | Typ | Wirkung |
|-----|-----|---------|
| `Block.LicenseUnknown` | Blocker | TEXT/MEDIA/DERIVED → 🔴 |
| `Block.PiiQuarantine` | Blocker | Alle → 🔴 |
| `Block.PlatformNoOptin` | Blocker | TRAIN/DATASET/MODEL → 🔴 |
| `Block.RightsUnknown` | Blocker | TEXT/MEDIA/DERIVED → 🔴 |
| `Block.TdmOptout` | Blocker | TRAIN/MODEL → 🔴 |
| `Block.TosAi` | Blocker | TRAIN/MODEL → 🔴 |
| `Block.TosRedist` | Blocker | DATASET → 🔴 |
| `Block.Uncoop` | Blocker | Alle → 🔴 |
| `Limit.DbRiskComm` | Limit | FACTS.DATASET_COMM → 🔴 |
| `Limit.NcOnly` | Limit | DATASET_COMM/MODEL → 🔴 |
| `Limit.TrainIntOnly` | Limit | TRAIN_EXT/MODEL → 🔴 |
| `Req.Attribution` | Auflage | BY-Pflicht bei Nutzung |
| `Req.LinkOnly` | Auflage | Nur verlinken, nicht kopieren |
| `Source.Coop` | Quelle | Kooperation vorhanden |
| `Source.Own` | Quelle | Eigene Daten → alle 🟢 |
| `Source.Platform` | Quelle | Plattformdaten → prüfen |
| `Source.Uncoop` | Quelle | → `Block.Uncoop` |
| `Source.Unknown` | Quelle | Herkunft unklar → konservativ |

---

*Version 1.0 | 2026-01-07*
