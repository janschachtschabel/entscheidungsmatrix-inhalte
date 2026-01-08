# Risiko-Übersicht Stufe 1: Herkunft & Art

> **Zweck:** Schnelle Risikoeinschätzung basierend auf Herkunft und Komponenten

---

## 🚦 Risiko-Ampel nach Herkunft

| Herkunft | Risiko | Ampel | Begründung |
|----------|--------|:-----:|------------|
| **Eigene Daten** | Niedrig | 🟢 | Volle Kontrolle, keine externen Risiken |
| **Kooperation + Vertrag** | Niedrig | 🟢 | Vertrag regelt Nutzungsrechte |
| **Kooperation ohne Vertrag** | Mittel | 🟡 | Rechte müssen in Stufe 2 geklärt werden |
| **Plattform (nur FACTS)** | Mittel | 🟡 | Plattform-Policies prüfen |
| **Plattform + TEXT/MEDIA** | Hoch | 🔴 | Opt-in erforderlich, Urheberrecht |
| **Unkooperativ** | Blockiert | ⛔ | Keine Verarbeitung möglich |
| **Unbekannt** | Unklar | ❓ | Herkunft muss zuerst geklärt werden |

---

## 📦 Risiko nach Komponententyp

### Basis-Komponenten

| Komponente | Risiko | Ampel | Hinweis |
|------------|--------|:-----:|---------|
| **FACTS** | Niedrig | 🟢 | Strukturierte Fakten (Titel, Autor, Jahr) – i.d.R. nicht geschützt |
| **TEXT** | Mittel | 🟡 | Schöpferische Texte – Urheberrecht beachten |
| **MEDIA** | Mittel | 🟡 | Bilder/Videos – Urheberrecht + Persönlichkeitsrechte |

### Derivat-Komponenten

| Komponente | Risiko | Ampel | Hinweis |
|------------|--------|:-----:|---------|
| **COMPENDIUM_TEXT** | Geerbt | 🟣 | Erbt alle Tags von TEXT/MEDIA |
| **QA_PAIRS** | Geerbt | 🟣 | Erbt alle Tags vom Ursprungsmaterial |
| **INDEX** | Geerbt | 🟣 | Erbt alle Tags von TEXT/MEDIA |
| **MODEL_WEIGHTS** | Geerbt | 🟣 | Erbt alle Tags von TEXT/MEDIA |

> 💡 Derivate übernehmen **alle** BLOCK- und LIMIT-Tags der Ursprungskomponenten!

---

## ⚠️ PII-Risiko (Personenbezogene Daten)

| PII-Status | Risiko | Ampel | Aktion |
|------------|--------|:-----:|--------|
| **Keine PII** | Niedrig | 🟢 | Weiter zu Stufe 2 |
| **PII möglich** | Mittel | 🟡 | Prüfung empfohlen |
| **Hohes PII-Risiko** | Hoch | 🔴 | Quarantäne oder Anonymisierung |

---

## 🎯 Schnell-Einschätzung

### Grüne Ampel 🟢 – Schnelle Prüfung

| Ankreuzen | Bedingung |
|:---------:|-----------|
| ☐ | Eigene Daten (OWN) |
| ☐ | Kooperation mit Vertrag |
| ☐ | Nur FACTS-Komponenten |
| ☐ | Keine PII |

→ **Stufe 2 kann zügig durchlaufen werden**

### Gelbe Ampel 🟡 – Standardprüfung

| Ankreuzen | Bedingung |
|:---------:|-----------|
| ☐ | Kooperation ohne Vertrag |
| ☐ | Plattform-Daten (nur FACTS) |
| ☐ | TEXT oder MEDIA vorhanden |
| ☐ | PII möglich |

→ **Stufe 2 sorgfältig durchführen**

### Rote Ampel 🔴 – Intensive Prüfung

| Ankreuzen | Bedingung |
|:---------:|-----------|
| ☐ | Plattform + schöpferische Inhalte |
| ☐ | Hohes PII-Risiko |
| ☐ | Mehrere Risikofaktoren kombiniert |

→ **Stufe 2 mit erhöhter Sorgfalt, ggf. juristische Prüfung**

### Blockiert ⛔ – Stopp

| Ankreuzen | Bedingung |
|:---------:|-----------|
| ☐ | Unkooperative Herkunft (Scraping trotz Verbot) |
| ☐ | PII hoch + nicht mitigiert |

→ **Keine weitere Verarbeitung! Z0 BLOCK oder Z1 QUARANTÄNE**

---

## Kombinationsmatrix: Herkunft × Komponenten

|  | FACTS | TEXT | MEDIA | Derivate |
|--|:-----:|:----:|:-----:|:--------:|
| **Eigene Daten** | 🟢 | 🟢 | 🟢 | 🟢 |
| **Kooperation + Vertrag** | 🟢 | 🟢 | 🟢 | 🟢 |
| **Kooperation ohne Vertrag** | 🟢 | 🟡 | 🟡 | 🟡 |
| **Plattform** | 🟡 | 🔴 | 🔴 | 🔴 |
| **Unbekannt** | ❓ | ❓ | ❓ | ❓ |
| **Unkooperativ** | ⛔ | ⛔ | ⛔ | ⛔ |

---

## Legende

| Symbol | Bedeutung |
|:------:|-----------|
| 🟢 | Niedriges Risiko – Standardverarbeitung |
| 🟡 | Mittleres Risiko – Prüfung erforderlich |
| 🔴 | Hohes Risiko – Sorgfältige Prüfung |
| ⛔ | Blockiert – Keine Verarbeitung |
| ❓ | Unklar – Klärung erforderlich |
| 🟣 | Geerbt – Risiko von Ursprungskomponente |

---

**Datum:** ___________________ **Prüfer:in:** ___________________
