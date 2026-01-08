# STUFE 1: Intake & Hygiene – Checkliste

> **Zweck:** Klassifizierung, PII-Bereinigung, Datenpass erstellen  
> **Wichtig:** Stufe 1 trifft **KEINE** finale Rechts- oder Use-Case-Freigabe!

---

## 📋 Allgemeine Angaben

| Feld | Eintrag |
|------|---------|
| **Datum** | ___________________ |
| **Prüfer:in** | ___________________ |
| **Quelle/Domain** | ___________________ |
| **Lieferungs-ID** | ___________________ |

---

## S1.1 QUELLE & ZUGRIFF

### S1-01: Wie wurden die Daten erhoben?

| Ankreuzen | Wert | Beschreibung | Pool |
|:---------:|------|--------------|------|
| ☐ | **Eigene Daten** | Eigene Redaktion, intern erzeugte Inhalte | → Z4 SAFE ✅ |
| ☐ | **Kooperation** | Partnerlieferung, autorisierte API/Feeds | → Z4 SAFE ✅ |
| ☐ | **Plattform** | YouTube, Social Media, Plattform-APIs | → Z2 PLATFORM 🟡 |
| ☐ | **Unkooperativ** | Scraping trotz Verbot → `BLOCK.UNCOOP` | → Z0 BLOCK ⛔ |
| ☐ | **Unbekannt** | Herkunft nicht belegbar | → Z5 UNKLAR ❓ |

### S1-02: Kooperationsnachweis? *(nicht bei Eigene Daten)*

| Ankreuzen | Wert | Wirkung |
|:---------:|------|---------|
| ☐ | **Ja** | Vertrag überschreibt Lizenz/ToS/TDM in Stufe 2 |
| ☐ | **Nein** | Stufe 2 prüft alle Rechtefragen |
| ☐ | **Unklar** | Stufe 2 prüft alle Rechtefragen |

> 💡 Bei Kooperationsnachweis werden in Stufe 2 viele Fragen übersprungen

---

## S1.2 KOMPONENTEN-CHECK

### S1-03: Welche Komponenten enthält der Datensatz? *(Mehrfachauswahl)*

**Basis-Komponenten:**

| ☐ | Komponente | Beschreibung |
|:-:|------------|--------------|
| ☐ | **FACTS** | Strukturierte Fakten (Titel, Autor, Jahr, URL) |
| ☐ | **TEXT** | Schöpferische Texte (Beschreibung, Abstract, Fließtext) |
| ☐ | **MEDIA** | Bilder/Videos (Thumbnails, Previews) |

**Derivat-Komponenten:** *(erben alle Tags der Basis)*

| ☐ | Komponente | Beschreibung |
|:-:|------------|--------------|
| ☐ | **COMPENDIUM_TEXT** | Zusammenfassungen |
| ☐ | **QA_PAIRS** | Frage-Antwort-Paare |
| ☐ | **INDEX** | Suchindex/Embeddings |
| ☐ | **MODEL_WEIGHTS** | Trainierte Modellgewichte |

### S1-04: Umgang mit Mediendateien? *(nur wenn MEDIA vorhanden)*

| Ankreuzen | Wert | Wirkung |
|:---------:|------|--------|
| ☐ | **Nur verlinken** | → `REQ.LINK_ONLY` (Medien nicht kopieren) |
| ☐ | **Kopiert** | Rechte müssen in Stufe 2 geklärt werden |

---

## S1.3 DATENSCHUTZ / PII-CHECK

### S1-05: Personenbezogene Daten (PII) im Datensatz?

| Ankreuzen | Wert | Wirkung |
|:---------:|------|--------|
| ☐ | **Keine PII** | → Weiter |
| ☐ | **PII möglich** | → Weiter, aber prüfen |
| ☐ | **Hohes PII-Risiko** | → S1-06 beantworten! |

### S1-06: PII erfolgreich minimiert? *(nur bei hohem PII-Risiko)*

| Ankreuzen | Wert | Wirkung |
|:---------:|------|--------|
| ☐ | **Ja, mitigiert** | PII entfernt/anonymisiert → Weiter |
| ☐ | **Nein** | → `BLOCK.PII_QUARANTINE` → Z1 QUARANTÄNE ⛔ |

---

## ⚠️ BLOCKER-CHECK

| Bedingung | Pool | Aktion |
|-----------|------|--------|
| Unkooperativ gewählt | Z0 BLOCK ⛔ | **STOPP!** Keine weitere Verarbeitung |
| Hohes PII-Risiko + Nein bei S1-06 | Z1 QUARANTÄNE ⛔ | **QUARANTÄNE!** PII-Bereinigung nötig |
| Unbekannt gewählt | Z5 UNKLAR ❓ | Weiter, Klärung in Stufe 2 |

**Blocker?** ☐ Nein → Weiter zu Datenpass    ☐ Ja → Stopp/Quarantäne

---

## 📝 DATENPASS (Output Stufe 1)

| Feld | Wert |
|------|------|
| **Herkunft** | ☐ Eigene ☐ Kooperation ☐ Plattform ☐ Unkooperativ ☐ Unbekannt |
| **Kooperationsnachweis** | ☐ Ja ☐ Nein ☐ Unklar ☐ n/a |
| **Komponenten** | ☐ FACTS ☐ TEXT ☐ MEDIA ☐ Derivate: _____________ |
| **Media-Speicherung** | ☐ Nur verlinken ☐ Kopiert ☐ n/a |
| **PII-Status** | ☐ Keine ☐ Möglich ☐ Hoch |
| **PII mitigiert** | ☐ Ja ☐ Nein ☐ n/a |

### Pool-Zuordnung:

| Ankreuzen | Pool | Bedingung |
|:---------:|------|----------|
| ☐ | **Z0 BLOCK** ⛔ | Unkooperativ |
| ☐ | **Z1 QUARANTÄNE** ⛔ | PII hoch + nicht mitigiert |
| ☐ | **Z2 PLATFORM** 🟡 | Plattform-Daten |
| ☐ | **Z4 SAFE** ✅ | Eigene/Kooperation ohne Blocker |
| ☐ | **Z5 UNKLAR** ❓ | Herkunft unbekannt |

---

## Tags aus Stufe 1

| Tag | Gesetzt? | Wirkung |
|-----|:--------:|---------|
| `BLOCK.UNCOOP` | ☐ | Alle Use Cases gesperrt |
| `BLOCK.PII_QUARANTINE` | ☐ | Alle Use Cases gesperrt |
| `REQ.LINK_ONLY` | ☐ | Medien nur verlinken |

---

## ➡️ WEITER ZU STUFE 2?

**Checkliste:**

| ☐ | Voraussetzung |
|:-:|---------------|
| ☐ | Datenpass vollständig |
| ☐ | Kein BLOCK.UNCOOP (sonst: Z0 → Ende) |
| ☐ | Kein BLOCK.PII_QUARANTINE (sonst: Z1 → Klärung) |

> 💡 **Bei Kooperationsnachweis:** Lizenz-, ToS-, TDM- und DB-Fragen werden übersprungen

---

**Unterschrift:** ___________________ **Datum:** ___________________
