# Fragebogen Stufe 2 – Rechte & Policy

> Antworten ankreuzen. Tags fließen in Stufe 3 ein. Bei TEXT/MEDIA getrennt beantworten.

| Feld | Eintrag |
|------|---------|
| **Datum** | _______________ |
| **Prüfer:in** | _______________ |
| **Quelle** | _______________ |

---

## S2-01 – uncoop_violation: Verbot missachtet?

| | Antwort | Tag |
|:-:|---------|-----|
| ☐ | yes | `BLOCK.UNCOOP` |
| ☐ | no | – |

---

## S2-02 – platform_ai_optin: Plattform KI-Opt-in?

| | Antwort | Tag |
|:-:|---------|-----|
| ☐ | yes | – |
| ☐ | no | `BLOCK.PLATFORM_NO_OPTIN` |
| ☐ | n/a | – |

---

## S2-03 – platform_display_mode: Darstellungsform

| | Antwort | Tag |
|:-:|---------|-----|
| ☐ | LINK_ONLY | `REQ.LINK_ONLY` |
| ☐ | OK_COPY | – |
| ☐ | n/a | – |

---

## S2-04 – rights_holder_status: Quelle berechtigt?

| | Antwort | Tag |
|:-:|---------|-----|
| ☐ | rights_holder | – |
| ☐ | authorized | – |
| ☐ | unknown | `BLOCK.RIGHTS_UNKNOWN` |

---

## S2-05 – license_status: Lizenz *(bei coop_present=yes überspringen)*

**[TEXT]** *(falls TEXT vorhanden)*

| | Antwort | Tag |
|:-:|---------|-----|
| ☐ | CC0/PD | – |
| ☐ | CC_BY | `REQ.ATTRIBUTION` |
| ☐ | CC_BY_NC | `REQ.ATTRIBUTION`, `LIMIT.NC_ONLY` |
| ☐ | Proprietary | `LIMIT.DISPLAY_ONLY` |
| ☐ | Unknown | `BLOCK.LICENSE_UNKNOWN` |

**[MEDIA]** *(falls MEDIA vorhanden)*

| | Antwort | Tag |
|:-:|---------|-----|
| ☐ | CC0/PD | – |
| ☐ | CC_BY | `REQ.ATTRIBUTION` |
| ☐ | CC_BY_NC | `REQ.ATTRIBUTION`, `LIMIT.NC_ONLY` |
| ☐ | Proprietary | `LIMIT.DISPLAY_ONLY` |
| ☐ | Unknown | `BLOCK.LICENSE_UNKNOWN` |

---

## S2-06 – mixed_licenses: Gemischte Lizenzen?

| | Antwort | Tag |
|:-:|---------|-----|
| ☐ | yes | `LIMIT.MIXED_TREAT_AS_UNKNOWN` |
| ☐ | no | – |

---

## S2-07 – tos_ai_forbidden: AGB verbieten KI? *(bei coop_present=yes überspringen)*

| | Antwort | Tag |
|:-:|---------|-----|
| ☐ | yes | `BLOCK.TOS_AI` |
| ☐ | no | – |

---

## S2-08 – tos_redistribution_forbidden: AGB verbieten Weitergabe?

| | Antwort | Tag |
|:-:|---------|-----|
| ☐ | yes | `BLOCK.TOS_REDIST` |
| ☐ | no | – |

---

## S2-09 – tdm_optout_machine: TDM Opt-out (maschinell)?

| | Antwort | Tag |
|:-:|---------|-----|
| ☐ | yes | `BLOCK.TDM_OPTOUT` |
| ☐ | no | – |

---

## S2-10 – robots_disallow_crawl: robots.txt verbietet Crawl?

| | Antwort | Tag |
|:-:|---------|-----|
| ☐ | yes | `LIMIT.CRAWL_DISALLOWED` |
| ☐ | no | – |

---

## S2-11 – db_mass_extraction: Datenbank wesentlich entnommen?

| | Antwort | Tag |
|:-:|---------|-----|
| ☐ | yes | `LIMIT.DB_RISK_COMM` |
| ☐ | no | – |

---

## S2-12 – derived_from: Derivat abgeleitet von? *(falls Derivate vorhanden)*

| | Antwort | Tag |
|:-:|---------|-----|
| ☐ | FACTS | erbt FACTS-Tags |
| ☐ | TEXT | erbt TEXT-Tags |
| ☐ | MEDIA | erbt MEDIA-Tags |
| ☐ | MIXED | erbt alle Tags |

---

## Gesetzte Tags (Zusammenfassung)

**BLOCK-Tags:**

| Tag | ☐ |
|-----|:-:|
| `BLOCK.UNCOOP` | ☐ |
| `BLOCK.PLATFORM_NO_OPTIN` | ☐ |
| `BLOCK.RIGHTS_UNKNOWN` | ☐ |
| `BLOCK.LICENSE_UNKNOWN` | ☐ |
| `BLOCK.TOS_AI` | ☐ |
| `BLOCK.TOS_REDIST` | ☐ |
| `BLOCK.TDM_OPTOUT` | ☐ |

**LIMIT-Tags:**

| Tag | ☐ |
|-----|:-:|
| `LIMIT.NC_ONLY` | ☐ |
| `LIMIT.DISPLAY_ONLY` | ☐ |
| `LIMIT.MIXED_TREAT_AS_UNKNOWN` | ☐ |
| `LIMIT.CRAWL_DISALLOWED` | ☐ |
| `LIMIT.DB_RISK_COMM` | ☐ |

**REQ-Tags:**

| Tag | ☐ |
|-----|:-:|
| `REQ.ATTRIBUTION` | ☐ |
| `REQ.LINK_ONLY` | ☐ |

---

**→ Weiter zu Stufe 3** *(Tags in Matrix eintragen)*
