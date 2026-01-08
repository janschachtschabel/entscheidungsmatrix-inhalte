# STUFE 2: Rechte & Policy – Checkliste

> **Zweck:** Tags vergeben (BLOCK.*, LIMIT.*, REQ.*)  
> **Wichtig:** Bei Kooperationsvertrag werden S2.3-S2.5 übersprungen!

---

## 📋 Allgemeine Angaben

| Feld | Eintrag |
|------|---------|
| **Datum** | ___________________ |
| **Prüfer:in** | ___________________ |
| **Quelle/Domain** | ___________________ |
| **Datenpass vorhanden?** | ☐ Ja ☐ Nein |

---

## 📥 INPUT AUS STUFE 1

| Feld | Wert |
|------|------|
| **Herkunft** | ☐ Eigene ☐ Kooperation ☐ Plattform ☐ Unkooperativ ☐ Unbekannt |
| **Kooperationsnachweis** | ☐ Ja ☐ Nein ☐ Unklar |
| **Komponenten** | ☐ FACTS ☐ TEXT ☐ MEDIA ☐ Derivate |
| **PII-Quarantäne** | ☐ Ja ☐ Nein |

### ⚠️ Prüfung vor Beginn:

| Ankreuzen | Bedingung | Aktion |
|:---------:|-----------|--------|
| ☐ | Eigene Daten | → **Stufe 2 überspringen** → Z4 SAFE ✅ |
| ☐ | Unkooperativ | → Z0 BLOCK ⛔ (bereits blockiert) |
| ☐ | PII-Quarantäne | → Z1 QUARANTÄNE ⛔ (bereits blockiert) |

---

## S2.1 HERKUNFTS- & PLATTFORM-OVERRIDES

### S2-01: Verbot missachtet? *(nicht bei Eigene Daten)*

| Ankreuzen | Wert | Wirkung |
|:---------:|------|--------|
| ☐ | **Ja** | → `BLOCK.UNCOOP` → Z0 BLOCK ⛔ |
| ☐ | **Nein** | → Weiter |

### S2-02: KI-Opt-in vorhanden? *(nur bei Plattform)*

| Ankreuzen | Wert | Wirkung |
|:---------:|------|--------|
| ☐ | **Ja** | Rechteinhaber hat KI-Nutzung erlaubt → Weiter |
| ☐ | **Nein** | → `BLOCK.PLATFORM_NO_OPTIN` → Z2 🟡 |
| ☐ | **n/a** | Keine Plattform-Quelle |

### S2-03: Anzeigeform? *(nur bei Plattform)*

| Ankreuzen | Wert | Wirkung |
|:---------:|------|--------|
| ☐ | **Nur verlinken** | → `REQ.LINK_ONLY` |
| ☐ | **Kopie erlaubt** | → Weiter |
| ☐ | **n/a** | Keine Plattform-Quelle |

---

## S2.2 RECHTEKETTE *(nicht bei Eigene Daten)*

### S2-04: Quelle berechtigt?

| Ankreuzen | Wert | Wirkung |
|:---------:|------|--------|
| ☐ | **Ist Rechteinhaber** | → Weiter |
| ☐ | **Berechtigt** | Zur Weitergabe berechtigt → Weiter |
| ☐ | **Unklar** | → `BLOCK.RIGHTS_UNKNOWN` (TEXT/MEDIA 🔴) |

---

## S2.3 LIZENZ *(nur ohne Kooperationsvertrag)*

> ⏭️ **Bei Kooperationsvertrag:** Abschnitt überspringen!

### S2-05a: Lizenz für TEXT? *(nur wenn TEXT vorhanden)*

| Ankreuzen | Wert | Tags |
|:---------:|------|------|
| ☐ | **CC0/Public Domain** | – |
| ☐ | **CC BY** | `REQ.ATTRIBUTION` |
| ☐ | **CC BY-NC** | `REQ.ATTRIBUTION` + `LIMIT.NC_ONLY` |
| ☐ | **Proprietär** | `LIMIT.DISPLAY_ONLY` |
| ☐ | **Unbekannt** | `BLOCK.LICENSE_UNKNOWN` 🔴 |

### S2-05b: Lizenz für MEDIA? *(nur wenn MEDIA vorhanden)*

| Ankreuzen | Wert | Tags |
|:---------:|------|------|
| ☐ | **CC0/Public Domain** | – |
| ☐ | **CC BY** | `REQ.ATTRIBUTION` |
| ☐ | **CC BY-NC** | `REQ.ATTRIBUTION` + `LIMIT.NC_ONLY` |
| ☐ | **Proprietär** | `LIMIT.DISPLAY_ONLY` |
| ☐ | **Unbekannt** | `BLOCK.LICENSE_UNKNOWN` 🔴 |

### S2-06: Gemischte Lizenzen?

| Ankreuzen | Wert | Wirkung |
|:---------:|------|--------|
| ☐ | **Ja** | → `LIMIT.MIXED_TREAT_AS_UNKNOWN` |
| ☐ | **Nein** | Einheitliche Lizenz → Weiter |

---

## S2.4 NUTZUNGSBEDINGUNGEN / TDM *(nur ohne Kooperationsvertrag)*

> ⏭️ **Bei Kooperationsvertrag:** Abschnitt überspringen!

### S2-07: AGB verbieten KI-Nutzung?

| Ankreuzen | Wert | Wirkung |
|:---------:|------|--------|
| ☐ | **Ja** | → `BLOCK.TOS_AI` (Training 🔴) |
| ☐ | **Nein** | → Weiter |

### S2-08: AGB verbieten Weitergabe?

| Ankreuzen | Wert | Wirkung |
|:---------:|------|--------|
| ☐ | **Ja** | → `BLOCK.TOS_REDIST` (Dataset/Model 🔴) |
| ☐ | **Nein** | → Weiter |

### S2-09: TDM Opt-out vorhanden?

| Ankreuzen | Wert | Wirkung |
|:---------:|------|--------|
| ☐ | **Ja** | → `BLOCK.TDM_OPTOUT` (Training 🔴) |
| ☐ | **Nein** | → Weiter |

### S2-10: robots.txt verbietet Crawl?

| Ankreuzen | Wert | Wirkung |
|:---------:|------|--------|
| ☐ | **Ja** | → `LIMIT.CRAWL_DISALLOWED` |
| ☐ | **Nein** | → Weiter |

---

## S2.5 DATENBANKRECHT *(nur ohne Kooperationsvertrag)*

> ⏭️ **Bei Kooperationsvertrag:** Abschnitt überspringen!

### S2-11: Wesentliche Teile entnommen?

| Ankreuzen | Wert | Wirkung |
|:---------:|------|--------|
| ☐ | **Ja** | → `LIMIT.DB_RISK_COMM` (FACTS kommerziell 🔴) |
| ☐ | **Nein** | → Weiter |

---

## S2.6 DERIVATE *(nur wenn Derivate vorhanden)*

### S2-12: Derivat abgeleitet von?

| Ankreuzen | Wert | Wirkung |
|:---------:|------|--------|
| ☐ | **FACTS** | Erbt Tags von FACTS |
| ☐ | **TEXT** | Erbt Tags von TEXT |
| ☐ | **MEDIA** | Erbt Tags von MEDIA |
| ☐ | **Gemischt** | Erbt restriktivste Regel |

> 💡 Derivate (COMPENDIUM_TEXT, QA_PAIRS, INDEX, MODEL_WEIGHTS) erben **alle** BLOCK/LIMIT-Tags

---

## 📊 OUTPUT: Gesammelte Tags

### Blocker-Tags ⛔

| Tag | ☐ | Wirkung |
|-----|:-:|--------|
| `BLOCK.UNCOOP` | ☐ | Alle = 🔴 |
| `BLOCK.PII_QUARANTINE` | ☐ | Alle = 🔴 |
| `BLOCK.PLATFORM_NO_OPTIN` | ☐ | Alle = 🔴 |
| `BLOCK.RIGHTS_UNKNOWN` | ☐ | TEXT/MEDIA = 🔴 |
| `BLOCK.LICENSE_UNKNOWN` | ☐ | TEXT/MEDIA = 🔴 |
| `BLOCK.TOS_AI` | ☐ | Training/Model = 🔴 |
| `BLOCK.TOS_REDIST` | ☐ | Dataset/Model = 🔴 |
| `BLOCK.TDM_OPTOUT` | ☐ | Training/Model = 🔴 |

### Limit-Tags 🟡

| Tag | ☐ | Wirkung |
|-----|:-:|--------|
| `LIMIT.NC_ONLY` | ☐ | Kommerziell = 🔴 |
| `LIMIT.DISPLAY_ONLY` | ☐ | Nur Anzeige erlaubt |
| `LIMIT.MIXED_TREAT_AS_UNKNOWN` | ☐ | Wie Unbekannt |
| `LIMIT.CRAWL_DISALLOWED` | ☐ | Crawl verboten |
| `LIMIT.DB_RISK_COMM` | ☐ | FACTS kommerziell = 🔴 |

### Auflagen 📝

| Tag | ☐ | Wirkung |
|-----|:-:|--------|
| `REQ.ATTRIBUTION` | ☐ | Quellenangabe nötig |
| `REQ.LINK_ONLY` | ☐ | Nur verlinken |

---

## Pool-Zuordnung

| Ankreuzen | Pool | Bedingung |
|:---------:|------|-----------|
| ☐ | **Z0 BLOCK** ⛔ | BLOCK.UNCOOP |
| ☐ | **Z1 QUARANTÄNE** ⛔ | BLOCK.PII_QUARANTINE |
| ☐ | **Z2 PLATFORM** 🟡 | BLOCK.PLATFORM_NO_OPTIN |
| ☐ | **Z3 NC** 🟡 | LIMIT.NC_ONLY |
| ☐ | **Z4 SAFE** ✅ | Keine Blocker |
| ☐ | **Z5 UNKLAR** ❓ | Herkunft unbekannt |

---

## ➡️ WEITER ZU STUFE 3?

| ☐ | Voraussetzung |
|:-:|---------------|
| ☐ | Alle Fragen beantwortet |
| ☐ | Tags dokumentiert |
| ☐ | Pool zugeordnet |

> 💡 **Bei Kooperationsvertrag:** S2.3-S2.5 wurden übersprungen (Vertrag regelt Rechte)

---

**Unterschrift:** ___________________ **Datum:** ___________________
