# Fragebogen Stufe 1 – Intake & Hygiene

> Mögliche Antworten ankreuzen. Tags und Pool-Vorschlag fließen in Stufe 2/3 ein.

| Feld | Eintrag |
|------|---------|
| **Datum** | _______________ |
| **Prüfer:in** | _______________ |
| **Quelle** | _______________ |

---

## S1-01 – source_class: Herkunft/Zugriff

| | Antwort | Tag |
|:-:|---------|-----|
| ☐ | OWN | – |
| ☐ | COOP | – |
| ☐ | PLATFORM | – |
| ☐ | UNCOOP | `BLOCK.UNCOOP` |
| ☐ | UNKNOWN | – |

---

## S1-02 – coop_present: Kooperationsnachweis

| | Antwort | Tag |
|:-:|---------|-----|
| ☐ | yes | – |
| ☐ | no | – |
| ☐ | unknown | – |

*(kein Tag – Ergebnis fließt in Stufe 2 ein)*

---

## S1-03 – components_present: Inhaltstypen *(Mehrfachauswahl)*

| | Komponente |
|:-:|------------|
| ☐ | FACTS |
| ☐ | TEXT |
| ☐ | MEDIA |
| ☐ | COMPENDIUM_TEXT |
| ☐ | QA_PAIRS |
| ☐ | INDEX |
| ☐ | MODEL_WEIGHTS |

*(kein Tag – steuert relevante Komponenten in Stufe 3)*

---

## S1-04 – media_storage_mode: Media-Speicherung

| | Antwort | Tag |
|:-:|---------|-----|
| ☐ | LINK_ONLY | `REQ.LINK_ONLY` |
| ☐ | COPIED | – |

*COPIED nur zulässig, wenn Rechte in Stufe 2 geklärt*

---

## S1-05 – pii_status: Personenbezogene Daten?

| | Antwort | Tag |
|:-:|---------|-----|
| ☐ | none | – |
| ☐ | possible | – |
| ☐ | high | → S1-06 |

---

## S1-06 – pii_mitigated: PII erfolgreich anonymisiert?

| | Antwort | Tag |
|:-:|---------|-----|
| ☐ | true | – |
| ☐ | false | `BLOCK.PII_QUARANTINE` *(wenn pii_status=high)* |

---

## Pool-Vorschlag nach Stufe 1

| Pool | Bedingung |
|------|-----------|
| **Z4 SAFE** | source_class = OWN/COOP, kein PII-High |
| **Z2 PLATFORM** | source_class = PLATFORM |
| **Z1 QUARANTINE** | pii_status = high + nicht mitigiert |
| **Z0 BLOCK** | source_class = UNCOOP |
| **Z5 UNKLAR** | source_class = UNKNOWN |

---

## Gesetzte Tags (Zusammenfassung)

| Tag | ☐ |
|-----|:-:|
| `BLOCK.UNCOOP` | ☐ |
| `BLOCK.PII_QUARANTINE` | ☐ |
| `REQ.LINK_ONLY` | ☐ |

---

**→ Weiter zu Stufe 2** *(wenn kein BLOCK-Tag)*
