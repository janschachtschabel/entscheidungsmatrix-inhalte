# Fragebogen Stufe 3 – Use-Case Auskunft

> Tags aus Stufe 1+2 mit Matrix abgleichen. Bei Treffer: Use Case blockiert/limitiert.

| Feld | Eintrag |
|------|---------|
| **Datum** | _______________ |
| **Prüfer:in** | _______________ |
| **Quelle** | _______________ |

---

## Gesetzte Tags aus Stufe 1+2

**BLOCK-Tags:** ☐ `UNCOOP` ☐ `PII_QUARANTINE` ☐ `PLATFORM_NO_OPTIN` ☐ `RIGHTS_UNKNOWN` ☐ `LICENSE_UNKNOWN` ☐ `TOS_AI` ☐ `TOS_REDIST` ☐ `TDM_OPTOUT`

**LIMIT-Tags:** ☐ `NC_ONLY` ☐ `DISPLAY_ONLY` ☐ `MIXED_TREAT_AS_UNKNOWN` ☐ `CRAWL_DISALLOWED` ☐ `DB_RISK_COMM`

**REQ-Tags:** ☐ `ATTRIBUTION` ☐ `LINK_ONLY`

---

## Matrix: Komponenten × Use Cases

> Ankreuzen wenn Tag gesetzt. Jeder Treffer = 🔴 (BLOCK) oder 🟡 (LIMIT)

### GLOBAL (alle Komponenten, alle Use Cases)

| Tag | ☐ | Wirkung |
|-----|:-:|---------|
| `BLOCK.PII_QUARANTINE` | ☐ | Alle = 🔴 |
| `BLOCK.UNCOOP` | ☐ | Alle = 🔴 |

---

### FACTS

| Use Case | BLOCK-Tags | LIMIT-Tags |
|----------|------------|------------|
| **SEARCH_DISPLAY** | ☐ `PLATFORM_NO_OPTIN` | – |
| **TRAIN_INT** | ☐ `PLATFORM_NO_OPTIN` ☐ `TOS_AI` ☐ `TDM_OPTOUT` | – |
| **TRAIN_EXT** | ☐ `PLATFORM_NO_OPTIN` ☐ `TOS_AI` ☐ `TDM_OPTOUT` | – |
| **DATASET_NC** | ☐ `PLATFORM_NO_OPTIN` ☐ `TOS_REDIST` | – |
| **DATASET_COMM** | ☐ `PLATFORM_NO_OPTIN` ☐ `TOS_REDIST` | ☐ `NC_ONLY` ☐ `DB_RISK_COMM` |
| **MODEL_SHARE** | ☐ `PLATFORM_NO_OPTIN` ☐ `TOS_AI` ☐ `TDM_OPTOUT` ☐ `TOS_REDIST` | – |

---

### TEXT

| Use Case | BLOCK-Tags | LIMIT-Tags |
|----------|------------|------------|
| **SEARCH_DISPLAY** | ☐ `PLATFORM_NO_OPTIN` ☐ `RIGHTS_UNKNOWN` ☐ `LICENSE_UNKNOWN` | ☐ `DISPLAY_ONLY` |
| **TRAIN_INT** | ☐ `PLATFORM_NO_OPTIN` ☐ `RIGHTS_UNKNOWN` ☐ `LICENSE_UNKNOWN` ☐ `TOS_AI` ☐ `TDM_OPTOUT` | ☐ `NC_ONLY` |
| **TRAIN_EXT** | ☐ `PLATFORM_NO_OPTIN` ☐ `RIGHTS_UNKNOWN` ☐ `LICENSE_UNKNOWN` ☐ `TOS_AI` ☐ `TDM_OPTOUT` | ☐ `NC_ONLY` |
| **DATASET_NC** | ☐ `PLATFORM_NO_OPTIN` ☐ `RIGHTS_UNKNOWN` ☐ `LICENSE_UNKNOWN` ☐ `TOS_REDIST` | ☐ `NC_ONLY` |
| **DATASET_COMM** | ☐ `PLATFORM_NO_OPTIN` ☐ `RIGHTS_UNKNOWN` ☐ `LICENSE_UNKNOWN` ☐ `TOS_REDIST` | ☐ `NC_ONLY` |
| **MODEL_SHARE** | ☐ `PLATFORM_NO_OPTIN` ☐ `RIGHTS_UNKNOWN` ☐ `LICENSE_UNKNOWN` ☐ `TOS_AI` ☐ `TDM_OPTOUT` ☐ `TOS_REDIST` | ☐ `NC_ONLY` |

---

### MEDIA

| Use Case | BLOCK-Tags | LIMIT-Tags |
|----------|------------|------------|
| **SEARCH_DISPLAY** | ☐ `PLATFORM_NO_OPTIN` ☐ `RIGHTS_UNKNOWN` ☐ `LICENSE_UNKNOWN` | ☐ `DISPLAY_ONLY` |
| **TRAIN_INT** | ☐ `PLATFORM_NO_OPTIN` ☐ `RIGHTS_UNKNOWN` ☐ `LICENSE_UNKNOWN` ☐ `TOS_AI` ☐ `TDM_OPTOUT` | ☐ `NC_ONLY` |
| **TRAIN_EXT** | ☐ `PLATFORM_NO_OPTIN` ☐ `RIGHTS_UNKNOWN` ☐ `LICENSE_UNKNOWN` ☐ `TOS_AI` ☐ `TDM_OPTOUT` | ☐ `NC_ONLY` |
| **DATASET_NC** | ☐ `PLATFORM_NO_OPTIN` ☐ `RIGHTS_UNKNOWN` ☐ `LICENSE_UNKNOWN` ☐ `TOS_REDIST` | ☐ `NC_ONLY` |
| **DATASET_COMM** | ☐ `PLATFORM_NO_OPTIN` ☐ `RIGHTS_UNKNOWN` ☐ `LICENSE_UNKNOWN` ☐ `TOS_REDIST` | ☐ `NC_ONLY` |
| **MODEL_SHARE** | ☐ `PLATFORM_NO_OPTIN` ☐ `RIGHTS_UNKNOWN` ☐ `LICENSE_UNKNOWN` ☐ `TOS_AI` ☐ `TDM_OPTOUT` ☐ `TOS_REDIST` | ☐ `NC_ONLY` |

---

### Derivate (COMPENDIUM_TEXT, QA_PAIRS, INDEX, MODEL_WEIGHTS)

> Übernehmen alle Tags vom Ursprungsmaterial (TEXT/MEDIA/MIXED)

| Derivat | Abgeleitet von | Tags geerbt von |
|---------|----------------|-----------------|
| COMPENDIUM_TEXT | ☐ TEXT ☐ MEDIA ☐ MIXED | → siehe oben |
| QA_PAIRS | ☐ FACTS ☐ TEXT ☐ MEDIA ☐ MIXED | → siehe oben |
| INDEX | ☐ TEXT ☐ MEDIA ☐ MIXED | → siehe oben |
| MODEL_WEIGHTS | ☐ TEXT ☐ MEDIA ☐ MIXED | → siehe oben |

---

## Ergebnis-Matrix (ausfüllen)

| Komponente | SEARCH | TRAIN_INT | TRAIN_EXT | DATA_NC | DATA_COMM | MODEL |
|------------|:------:|:---------:|:---------:|:-------:|:---------:|:-----:|
| FACTS | ___ | ___ | ___ | ___ | ___ | ___ |
| TEXT | ___ | ___ | ___ | ___ | ___ | ___ |
| MEDIA | ___ | ___ | ___ | ___ | ___ | ___ |
| COMPENDIUM | ___ | ___ | ___ | ___ | ___ | ___ |
| QA_PAIRS | ___ | ___ | ___ | ___ | ___ | ___ |
| INDEX | ___ | ___ | ___ | ___ | ___ | ___ |
| MODEL | ___ | ___ | ___ | ___ | ___ | ___ |

**Legende:** 🟢 = erlaubt | 🟡 = bedingt (LIMIT) | 🔴 = blockiert (BLOCK)

---

## Pool-Zuordnung (erster Treffer)

| ☐ | Pool | Bedingung |
|:-:|------|-----------|
| ☐ | **Z0 BLOCK** | BLOCK.UNCOOP |
| ☐ | **Z1 QUARANTINE** | BLOCK.PII_QUARANTINE |
| ☐ | **Z2 PLATFORM** | BLOCK.PLATFORM_NO_OPTIN |
| ☐ | **Z3 NC** | LIMIT.NC_ONLY |
| ☐ | **Z5 UNKLAR** | source_class = UNKNOWN |
| ☐ | **Z4 SAFE** | keine Blocker |

---

## Auflagen bei erlaubter Nutzung

| ☐ | Auflage |
|:-:|---------|
| ☐ | Quellenangabe erforderlich (`REQ.ATTRIBUTION`) |
| ☐ | Nur verlinken, nicht kopieren (`REQ.LINK_ONLY`) |

---

**→ Ergebnis dokumentieren und archivieren**
