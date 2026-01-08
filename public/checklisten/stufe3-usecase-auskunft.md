# STUFE 3: Entscheidungsmatrix – Checkliste

> **Zweck:** Tags auslesen → Pool zuweisen → Matrix ausgeben  
> **Wichtig:** Keine neue Bewertung! Nur Zusammenführung.

---

## 📋 Allgemeine Angaben

| Feld | Eintrag |
|------|---------|
| **Datum** | ___________________ |
| **Prüfer:in** | ___________________ |
| **Quelle/Domain** | ___________________ |

---

## 📥 INPUT AUS STUFE 1+2

| Feld | Wert |
|------|------|
| **Herkunft** | ☐ Eigene ☐ Kooperation ☐ Plattform ☐ Unkooperativ ☐ Unbekannt |
| **Kooperationsvertrag** | ☐ Ja ☐ Nein ☐ Unklar |
| **PII-Quarantäne** | ☐ Ja ☐ Nein |

**Komponenten:** ☐ FACTS ☐ TEXT ☐ MEDIA ☐ Derivate: _____________

### Blocker-Tags ⛔

| ☐ | Tag | ☐ | Tag |
|:-:|-----|:-:|-----|
| ☐ | `BLOCK.UNCOOP` | ☐ | `BLOCK.TOS_AI` |
| ☐ | `BLOCK.PII_QUARANTINE` | ☐ | `BLOCK.TOS_REDIST` |
| ☐ | `BLOCK.PLATFORM_NO_OPTIN` | ☐ | `BLOCK.TDM_OPTOUT` |
| ☐ | `BLOCK.RIGHTS_UNKNOWN` | ☐ | `BLOCK.LICENSE_UNKNOWN` |

### Limit-Tags 🟡

| ☐ | Tag | ☐ | Tag |
|:-:|-----|:-:|-----|
| ☐ | `LIMIT.NC_ONLY` | ☐ | `LIMIT.CRAWL_DISALLOWED` |
| ☐ | `LIMIT.DISPLAY_ONLY` | ☐ | `LIMIT.DB_RISK_COMM` |
| ☐ | `LIMIT.MIXED_TREAT_AS_UNKNOWN` | | |

### Auflagen 📝

| ☐ | Tag |
|:-:|-----|
| ☐ | `REQ.ATTRIBUTION` (Quellenangabe) |
| ☐ | `REQ.LINK_ONLY` (Nur verlinken) |

---

## 🚨 Pool-Zuordnung

> Prüfe von oben nach unten. Erster Treffer = Pool!

| Ankreuzen | Prio | Pool | Bedingung | Wirkung |
|:---------:|:----:|------|-----------|---------|
| ☐ | 1 | **Z0 BLOCK** ⛔ | BLOCK.UNCOOP | Alle 🔴 |
| ☐ | 2 | **Z1 QUARANTÄNE** ⛔ | BLOCK.PII_QUARANTINE | Alle 🔴 |
| ☐ | 3 | **Z2 PLATFORM** 🟡 | BLOCK.PLATFORM_NO_OPTIN | Nur Anzeige |
| ☐ | 4 | **Z3 NC** 🟡 | LIMIT.NC_ONLY | Kein Kommerz |
| ☐ | 5 | **Z5 UNKLAR** ❓ | Herkunft unbekannt | Klärung nötig |
| ☐ | 6 | **Z4 SAFE** ✅ | Keine Blocker | Alles 🟢 |

---

## 📊 ENTSCHEIDUNGSMATRIX

> Für jede Komponente: 🟢 (keine Tags) / 🟡 (LIMIT) / 🔴 (BLOCK)

| Komponente | Anzeige | Training (int) | Training (ext) | Dataset (NC) | Dataset (Komm) | Modell |
|------------|:-------:|:--------------:|:--------------:|:------------:|:--------------:|:------:|
| **FACTS** | ___ | ___ | ___ | ___ | ___ | ___ |
| **TEXT** | ___ | ___ | ___ | ___ | ___ | ___ |
| **MEDIA** | ___ | ___ | ___ | ___ | ___ | ___ |
| **COMPENDIUM_TEXT** | ___ | ___ | ___ | ___ | ___ | ___ |
| **QA_PAIRS** | ___ | ___ | ___ | ___ | ___ | ___ |
| **INDEX** | ___ | ___ | ___ | ___ | ___ | ___ |
| **MODEL_WEIGHTS** | ___ | ___ | ___ | ___ | ___ | ___ |

**Auflagen bei erlaubter Nutzung:** _______________________________________________

---

## Ampel-Legende

| 🟢 | 🟡 | 🔴 |
|:--:|:--:|:--:|
| **Zulässig** | **Bedingt** | **Unzulässig** |
| Keine Einschränkungen | Nur mit Auflagen | Stopp/Quarantäne |

---

## Use Cases (Kurzreferenz)

| Use Case | Beschreibung |
|----------|--------------|
| **Anzeige** | Suche, Anzeige, Snippet |
| **Training (int)** | Internes KI-Training |
| **Training (ext)** | Externes KI-Training |
| **Dataset (NC)** | Dataset nicht-kommerziell |
| **Dataset (Komm)** | Dataset kommerziell |
| **Modell** | Modell veröffentlichen |

---

**Unterschrift:** ___________________ **Datum:** ___________________
