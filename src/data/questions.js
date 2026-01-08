// Fragen nach neuem Schema: S1.1-S1.3, S2.1-S2.6
export const questions = [
  // ═══════════════════════════════════════════════════════════════════════════
  // STUFE 1 – INTAKE & HYGIENE
  // ═══════════════════════════════════════════════════════════════════════════

  // S1.1 Quelle & Zugriff (Herkunftsklasse)
  {
    id: 'source_class',
    stage: 1,
    section: 'S1.1',
    question: 'S1-01: Herkunft/Zugriff – Wie wurden die Daten erhoben?',
    hint: 'Die Herkunftsklasse bestimmt den initialen Pool-Vorschlag.',
    options: [
      { value: 'OWN', label: 'OWN – Eigene Daten', description: 'Eigene Redaktion, intern erzeugte Inhalte' },
      { value: 'COOP', label: 'COOP – Kooperation', description: 'Partnerlieferung, autorisierte API/Feeds' },
      { value: 'PLATFORM', label: 'PLATFORM – Plattform', description: 'YouTube, Social Media APIs, Plattform-Daten' },
      { value: 'UNCOOP', label: 'UNCOOP – Unkooperativ', description: 'Scraping trotz Verbot, Umgehung technischer Barrieren → BLOCK' },
      { value: 'UNKNOWN', label: 'UNKNOWN – Unbekannt', description: 'Herkunft/Zugang nicht belegbar' }
    ]
  },
  {
    id: 'coop_present',
    stage: 1,
    section: 'S1.1',
    question: 'S1-02: Kooperationsnachweis vorhanden?',
    hint: 'Ein Kooperationsnachweis fließt in Stufe 2 ein.',
    condition: (answers) => answers.source_class !== 'UNCOOP' && answers.source_class !== 'OWN',
    options: [
      { value: 'yes', label: 'Ja', description: 'Nachweis über Kooperation liegt vor' },
      { value: 'no', label: 'Nein', description: 'Kein Kooperationsnachweis' },
      { value: 'unknown', label: 'Unklar', description: 'Nicht feststellbar' }
    ]
  },

  // S1.2 Komponenten-Check
  {
    id: 'components_present',
    stage: 1,
    section: 'S1.2',
    question: 'S1-03: Welche Komponenten enthält der Datensatz?',
    hint: 'Mehrfachauswahl. Steuert relevante Zeilen in der Entscheidungsmatrix.',
    condition: (answers) => answers.source_class !== 'UNCOOP',
    multiSelect: true,
    options: [
      { value: 'FACTS', label: 'FACTS', description: 'Strukturierte Fakten: Titel, Autor, Jahr, URL, Schlagworte' },
      { value: 'TEXT', label: 'TEXT', description: 'Texte (schöpferisch): Beschreibung, Abstract, Fließtext' },
      { value: 'MEDIA', label: 'MEDIA', description: 'Bilder/Videos: Thumbnails, Previews' },
      { value: 'COMPENDIUM_TEXT', label: 'COMPENDIUM_TEXT', description: 'Derivat: Zusammenfassungen aus Text/Media' },
      { value: 'QA_PAIRS', label: 'QA_PAIRS', description: 'Derivat: Frage-Antwort-Paare' },
      { value: 'INDEX', label: 'INDEX', description: 'Derivat: Suchindex/Embeddings' },
      { value: 'MODEL_WEIGHTS', label: 'MODEL_WEIGHTS', description: 'Derivat: Trainierte Modellgewichte' }
    ]
  },
  {
    id: 'media_storage_mode',
    stage: 1,
    section: 'S1.2',
    question: 'S1-04: Umgang mit Mediendateien?',
    hint: 'COPIED nur zulässig wenn Rechte in Stufe 2 geklärt.',
    condition: (answers) => answers.components_present?.includes('MEDIA'),
    options: [
      { value: 'LINK_ONLY', label: 'Nur verlinken', description: 'Medien werden nur verlinkt, nicht kopiert → REQ.LINK_ONLY' },
      { value: 'COPIED', label: 'Kopiert', description: 'Medien werden lokal gespeichert' }
    ]
  },

  // S1.3 Datenschutz / PII-Check
  {
    id: 'pii_status',
    stage: 1,
    section: 'S1.3',
    question: 'S1-05: Personenbezogene Daten (PII) im Datensatz?',
    hint: 'Bei hohem Risiko ohne Mitigation → BLOCK.PII_QUARANTINE.',
    condition: (answers) => answers.source_class !== 'UNCOOP',
    options: [
      { value: 'none', label: 'Keine PII', description: 'Keine personenbezogenen Daten erkennbar' },
      { value: 'possible', label: 'PII möglich', description: 'Möglicherweise personenbezogene Daten enthalten' },
      { value: 'high', label: 'Hohes PII-Risiko', description: 'Eindeutig personenbezogene Daten vorhanden' }
    ]
  },
  {
    id: 'pii_mitigated',
    stage: 1,
    section: 'S1.3',
    question: 'S1-06: PII erfolgreich minimiert/anonymisiert?',
    hint: 'Bei Nein und hohem PII-Risiko → BLOCK.PII_QUARANTINE bleibt.',
    condition: (answers) => answers.pii_status === 'high',
    options: [
      { value: true, label: 'Ja, erfolgreich mitigiert', description: 'PII wurden entfernt/anonymisiert' },
      { value: false, label: 'Nein, nicht mitigiert', description: 'PII noch vorhanden → Quarantäne' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // STUFE 2 – RECHTE & POLICY
  // ═══════════════════════════════════════════════════════════════════════════

  // S2.1 Herkunfts- & Plattform-Overrides (Priorität)
  {
    id: 'uncoop_violation',
    stage: 2,
    section: 'S2.1',
    question: 'S2-01: Unkooperative Nutzung gegen explizite Verbote?',
    hint: 'Scraping trotz Verbot, Umgehung technischer Barrieren.',
    condition: (answers) => answers.source_class !== 'UNCOOP' && answers.source_class !== 'OWN',
    options: [
      { value: true, label: 'Ja, Verbot missachtet', description: '→ BLOCK.UNCOOP' },
      { value: false, label: 'Nein', description: 'Kein Verstoß' }
    ]
  },
  {
    id: 'platform_ai_optin',
    stage: 2,
    section: 'S2.1',
    question: 'S2-02: Plattform: KI-Opt-in vorhanden?',
    hint: 'Ohne Opt-in bei Plattform-Daten → BLOCK.PLATFORM_NO_OPTIN.',
    condition: (answers) => answers.source_class === 'PLATFORM',
    options: [
      { value: 'yes', label: 'Ja, Opt-in vorhanden', description: 'Rechteinhaber hat KI-Nutzung erlaubt' },
      { value: 'no', label: 'Nein, kein Opt-in', description: '→ BLOCK.PLATFORM_NO_OPTIN' },
      { value: 'n/a', label: 'Nicht anwendbar', description: 'Keine Plattform-Quelle' }
    ]
  },
  {
    id: 'platform_display_mode',
    stage: 2,
    section: 'S2.1',
    question: 'S2-03: Plattform: Anzeigeform erlaubt?',
    hint: 'LINK_ONLY = nur einbetten, keine Kopie.',
    condition: (answers) => answers.source_class === 'PLATFORM',
    options: [
      { value: 'LINK_ONLY', label: 'Nur verlinken', description: '→ REQ.LINK_ONLY' },
      { value: 'OK_COPY', label: 'Kopie erlaubt', description: 'Kopieren ist gestattet' },
      { value: 'n/a', label: 'Nicht anwendbar', description: 'Keine Plattform-Quelle' }
    ]
  },

  // S2.2 Rechtekette / Rechteinhaber
  {
    id: 'rights_holder_status',
    stage: 2,
    section: 'S2.2',
    question: 'S2-04: Quelle berechtigt (Rechteinhaber)?',
    hint: 'Bei Unklar → BLOCK.RIGHTS_UNKNOWN für TEXT/MEDIA/Derivate.',
    condition: (answers) => answers.source_class !== 'UNCOOP' && answers.source_class !== 'OWN',
    options: [
      { value: 'rights_holder', label: 'Ist Rechteinhaber', description: 'Quelle ist selbst Rechteinhaber' },
      { value: 'authorized', label: 'Berechtigt', description: 'Quelle ist zur Weitergabe berechtigt' },
      { value: 'unknown', label: 'Unklar', description: '→ BLOCK.RIGHTS_UNKNOWN' }
    ]
  },

  // S2.3 Lizenz je Komponente
  {
    id: 'license_text',
    stage: 2,
    section: 'S2.3',
    question: 'S2-05a: Lizenz für TEXT-Komponente?',
    hint: 'Bei UNKNOWN → BLOCK.LICENSE_UNKNOWN. NC → LIMIT.NC_ONLY.',
    condition: (answers) => answers.source_class !== 'UNCOOP' && answers.source_class !== 'OWN' && answers.coop_present !== 'yes' && answers.components_present?.includes('TEXT'),
    options: [
      { value: 'CC0_PD', label: 'CC0/PD – Public Domain', description: 'Keine Einschränkungen' },
      { value: 'CC_BY', label: 'CC BY', description: '→ REQ.ATTRIBUTION' },
      { value: 'CC_BY_NC', label: 'CC BY-NC', description: '→ REQ.ATTRIBUTION + LIMIT.NC_ONLY' },
      { value: 'PROPRIETARY', label: 'Proprietär', description: '→ LIMIT.DISPLAY_ONLY' },
      { value: 'UNKNOWN', label: 'Unbekannt', description: '→ BLOCK.LICENSE_UNKNOWN' }
    ]
  },
  {
    id: 'license_media',
    stage: 2,
    section: 'S2.3',
    question: 'S2-05b: Lizenz für MEDIA-Komponente?',
    hint: 'Bei UNKNOWN → BLOCK.LICENSE_UNKNOWN. NC → LIMIT.NC_ONLY.',
    condition: (answers) => answers.source_class !== 'UNCOOP' && answers.source_class !== 'OWN' && answers.coop_present !== 'yes' && answers.components_present?.includes('MEDIA'),
    options: [
      { value: 'CC0_PD', label: 'CC0/PD – Public Domain', description: 'Keine Einschränkungen' },
      { value: 'CC_BY', label: 'CC BY', description: '→ REQ.ATTRIBUTION' },
      { value: 'CC_BY_NC', label: 'CC BY-NC', description: '→ REQ.ATTRIBUTION + LIMIT.NC_ONLY' },
      { value: 'PROPRIETARY', label: 'Proprietär', description: '→ LIMIT.DISPLAY_ONLY' },
      { value: 'UNKNOWN', label: 'Unbekannt', description: '→ BLOCK.LICENSE_UNKNOWN' }
    ]
  },
  {
    id: 'mixed_licenses',
    stage: 2,
    section: 'S2.3',
    question: 'S2-06: Gemischte Lizenztypen im Datensatz?',
    hint: 'Bei Ja → LIMIT.MIXED_TREAT_AS_UNKNOWN (wirkt wie Unbekannt).',
    condition: (answers) => answers.source_class !== 'UNCOOP' && answers.source_class !== 'OWN' && answers.coop_present !== 'yes',
    options: [
      { value: true, label: 'Ja, gemischt', description: '→ LIMIT.MIXED_TREAT_AS_UNKNOWN' },
      { value: false, label: 'Nein, einheitlich', description: 'Alle Items gleiche Lizenz' }
    ]
  },

  // S2.4 Nutzungsbedingungen / Robots / TDM-Opt-out
  {
    id: 'tos_ai_forbidden',
    stage: 2,
    section: 'S2.4',
    question: 'S2-07: AGB verbieten KI-Nutzung?',
    hint: 'Bei Ja → BLOCK.TOS_AI. Bei Kooperationsvertrag irrelevant.',
    condition: (answers) => answers.source_class !== 'UNCOOP' && answers.source_class !== 'OWN' && answers.coop_present !== 'yes',
    options: [
      { value: true, label: 'Ja, verboten', description: '→ BLOCK.TOS_AI' },
      { value: false, label: 'Nein', description: 'Keine AGB-Einschränkung' }
    ]
  },
  {
    id: 'tos_redistribution_forbidden',
    stage: 2,
    section: 'S2.4',
    question: 'S2-08: AGB verbieten Weitergabe/Redistribution?',
    hint: 'Bei "Ja" → BLOCK.TOS_REDIST. Bei Kooperationsvertrag irrelevant.',
    condition: (answers) => answers.source_class !== 'UNCOOP' && answers.source_class !== 'OWN' && answers.coop_present !== 'yes',
    options: [
      { value: true, label: 'Ja, verboten', description: '→ BLOCK.TOS_REDIST' },
      { value: false, label: 'Nein', description: 'Keine AGB-Einschränkung' }
    ]
  },
  {
    id: 'tdm_optout_machine',
    stage: 2,
    section: 'S2.4',
    question: 'S2-09: Maschinenlesbares TDM Opt-out vorhanden?',
    hint: 'robots.txt, ai.txt, TDM-Reservation. Bei Kooperationsvertrag irrelevant.',
    condition: (answers) => answers.source_class !== 'UNCOOP' && answers.source_class !== 'OWN' && answers.coop_present !== 'yes',
    options: [
      { value: true, label: 'Ja, TDM Opt-out vorhanden', description: '→ BLOCK.TDM_OPTOUT' },
      { value: false, label: 'Nein', description: 'Kein TDM Opt-out' }
    ]
  },
  {
    id: 'robots_disallow_crawl',
    stage: 2,
    section: 'S2.4',
    question: 'S2-10: robots.txt untersagt Crawler?',
    hint: 'Bei Kooperationsvertrag irrelevant (Vertrag überschreibt).',
    condition: (answers) => answers.source_class !== 'UNCOOP' && answers.source_class !== 'OWN' && answers.coop_present !== 'yes',
    options: [
      { value: true, label: 'Ja, Crawl verboten', description: '→ LIMIT.CRAWL_DISALLOWED' },
      { value: false, label: 'Nein', description: 'Crawl erlaubt' }
    ]
  },

  // S2.5 Datenbankrecht / Massenentnahme
  {
    id: 'db_mass_extraction',
    stage: 2,
    section: 'S2.5',
    question: 'S2-11: Wesentliche Teile systematisch entnommen (DB-Recht)?',
    hint: 'Bei Kooperationsvertrag durch Vertrag geregelt.',
    condition: (answers) => answers.source_class !== 'UNCOOP' && answers.source_class !== 'OWN' && answers.coop_present !== 'yes',
    options: [
      { value: true, label: 'Ja, wesentliche Entnahme', description: '→ LIMIT.DB_RISK_COMM' },
      { value: false, label: 'Nein', description: 'Kein DB-Risiko' }
    ]
  },

  // S2.6 Derivate: Vererbungsregel
  {
    id: 'derived_from',
    stage: 2,
    section: 'S2.6',
    question: 'S2-12: Derivat abgeleitet von welchem Ursprungstyp?',
    hint: 'Derivate übernehmen BLOCK/LIMIT-Tags der Ursprungskomponenten.',
    condition: (answers) => {
      const derivates = ['COMPENDIUM_TEXT', 'QA_PAIRS', 'INDEX', 'MODEL_WEIGHTS'];
      return answers.components_present?.some(c => derivates.includes(c));
    },
    options: [
      { value: 'FACTS', label: 'FACTS', description: 'Abgeleitet aus strukturierten Fakten' },
      { value: 'TEXT', label: 'TEXT', description: 'Abgeleitet aus Texten' },
      { value: 'MEDIA', label: 'MEDIA', description: 'Abgeleitet aus Medien' },
      { value: 'MIXED', label: 'MIXED', description: 'Gemischt → restriktivste Regel' }
    ]
  }
];

export const stages = [
  { id: 1, label: 'Stufe 1: Intake & Hygiene', description: 'S1.1-S1.3' },
  { id: 2, label: 'Stufe 2: Rechte & Policy', description: 'S2.1-S2.6' },
  { id: 3, label: 'Stufe 3: Entscheidungsmatrix', description: 'Use Cases vs. Komponenten' }
];

// Pool-Zuordnungen
export const POOLS = {
  Z0_BLOCK: { id: 'Z0', label: 'BLOCK', description: 'Nutzung untersagt', color: 'red' },
  Z1_QUARANTINE: { id: 'Z1', label: 'QUARANTINE', description: 'PII-Quarantäne', color: 'red' },
  Z2_PLATFORM: { id: 'Z2', label: 'PLATFORM', description: 'Plattform ohne Opt-in', color: 'orange' },
  Z3_NC: { id: 'Z3', label: 'NC', description: 'Nur nicht-kommerziell', color: 'orange' },
  Z4_SAFE: { id: 'Z4', label: 'SAFE', description: 'Keine Einschränkungen', color: 'green' },
  Z5_UNKLAR: { id: 'Z5', label: 'UNKLAR', description: 'Klärung in Stufe 2 nötig', color: 'gray' }
};
