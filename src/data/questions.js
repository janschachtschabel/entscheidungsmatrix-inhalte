export const questions = [
  // Stufe 1: Intake & Hygiene
  {
    id: 'sourceClass',
    stage: 1,
    question: 'Woher stammen die Daten und wie wurden sie erhoben?',
    hint: 'Die Herkunft bestimmt die Grundbewertung und mögliche Einschränkungen.',
    options: [
      { value: 'OWN', label: 'Eigene Daten (OWN)', description: 'Eigene Redaktion, intern erzeugte Inhalte, KI ohne Fremdmaterial' },
      { value: 'COOP', label: 'Kooperation (COOP)', description: 'Partnerlieferung, autorisierte API/Feeds, Vertrag vorhanden' },
      { value: 'PLATFORM', label: 'Plattform (PLATFORM)', description: 'YouTube, Social Media APIs, Plattform-Daten' },
      { value: 'UNCOOP', label: 'Unkooperativ (UNCOOP)', description: 'Scraping trotz Verbot, Umgehung technischer Barrieren' },
      { value: 'UNKNOWN', label: 'Unbekannt (UNKNOWN)', description: 'Herkunft/Zugang nicht belegbar' }
    ]
  },
  {
    id: 'sourceDomain',
    stage: 1,
    question: 'Von welcher Domain/Quelle stammen die Daten?',
    hint: 'Geben Sie die Haupt-Domain oder den Quellnamen an.',
    type: 'text',
    placeholder: 'z.B. example.com, Partner-API, Interne Redaktion'
  },
  {
    id: 'components',
    stage: 1,
    question: 'Welche Komponenten enthält die Datenlieferung?',
    hint: 'Mehrfachauswahl möglich. Jede Komponente wird separat bewertet.',
    multiSelect: true,
    options: [
      { value: 'FACTS', label: 'FACTS', description: 'Titel, Autor, Jahr, URL, Schlagworte, formale Felder' },
      { value: 'TEXT', label: 'TEXT', description: 'Beschreibung, Abstract, Fließtext' },
      { value: 'MEDIA', label: 'MEDIA', description: 'Thumbnail, Bild, Preview, Video' },
      { value: 'DERIVED', label: 'DERIVED', description: 'Embeddings, Summaries, Klassifikationsergebnisse' }
    ]
  },
  {
    id: 'piiStatus',
    stage: 1,
    question: 'Enthält die Lieferung personenbezogene Daten (PII)?',
    hint: 'Bei hohem PII-Risiko ohne Bereinigung wird Quarantäne ausgelöst.',
    options: [
      { value: 'none', label: 'Keine PII', description: 'Keine personenbezogenen Daten erkennbar' },
      { value: 'possible', label: 'PII möglich', description: 'Möglicherweise personenbezogene Daten enthalten' },
      { value: 'high', label: 'Hohes PII-Risiko', description: 'Eindeutig personenbezogene Daten vorhanden' }
    ]
  },
  {
    id: 'piiHandling',
    stage: 1,
    question: 'Wurden PII-Maßnahmen durchgeführt?',
    hint: 'Minimierung, Anonymisierung oder Zugriffsbeschränkung.',
    condition: (answers) => answers.piiStatus === 'possible' || answers.piiStatus === 'high',
    options: [
      { value: 'minimized', label: 'Minimiert', description: 'Unnötige personenbezogene Felder entfernt/verkürzt' },
      { value: 'anonymized', label: 'Anonymisiert', description: 'Identifikatoren entfernt/ersetzt' },
      { value: 'restricted', label: 'Zugriff beschränkt', description: 'Zugriff und Retention eingeschränkt' },
      { value: 'none', label: 'Keine Maßnahmen', description: 'Keine PII-Bereinigung durchgeführt' }
    ]
  },

  // Stufe 2: Rechte & Policies
  {
    id: 'platformOptIn',
    stage: 2,
    question: 'Liegt ein Opt-in der Rechteinhaber für Plattformdaten vor?',
    hint: 'Relevant wenn source_class = PLATFORM. Ohne Opt-in sind KI/Training/Sharing gesperrt.',
    condition: (answers) => answers.sourceClass === 'PLATFORM',
    options: [
      { value: true, label: 'Ja, Opt-in vorhanden', description: 'Rechteinhaber hat explizit zugestimmt' },
      { value: false, label: 'Nein, kein Opt-in', description: 'Keine explizite Zustimmung vorhanden' }
    ]
  },
  {
    id: 'rightsStatus',
    stage: 2,
    question: 'Ist die Quelle Rechteinhaber oder ausdrücklich berechtigt?',
    hint: 'Aggregatoren ohne eigene Rechte führen zu Einschränkungen für TEXT/MEDIA.',
    options: [
      { value: 'rights_holder', label: 'Rechteinhaber', description: 'Quelle ist selbst Rechteinhaber' },
      { value: 'authorized', label: 'Berechtigt', description: 'Quelle ist ausdrücklich zur Weitergabe berechtigt' },
      { value: 'aggregator_no_rights', label: 'Aggregator ohne Rechte', description: 'Quelle aggregiert fremde Inhalte ohne eigene Rechte' },
      { value: 'unknown', label: 'Unklar', description: 'Rechtebasis nicht geklärt' }
    ]
  },
  {
    id: 'hasContract',
    stage: 2,
    question: 'Gibt es einen Vertrag/Kooperationsvereinbarung?',
    hint: 'Verträge können Nutzungsrechte erweitern oder einschränken.',
    options: [
      { value: true, label: 'Ja, Vertrag vorhanden', description: 'Es existiert eine vertragliche Vereinbarung' },
      { value: false, label: 'Nein, kein Vertrag', description: 'Keine vertragliche Regelung' }
    ]
  },
  {
    id: 'contractProhibitsAI',
    stage: 2,
    question: 'Verbietet der Vertrag KI-Training?',
    hint: 'Vertragliche Einschränkungen haben Vorrang.',
    condition: (answers) => answers.hasContract === true,
    options: [
      { value: true, label: 'Ja, KI verboten', description: 'Vertrag untersagt KI-Training/Fine-Tuning' },
      { value: false, label: 'Nein, erlaubt oder nicht geregelt', description: 'Vertrag erlaubt KI oder schweigt dazu' }
    ]
  },
  {
    id: 'contractProhibitsRedist',
    stage: 2,
    question: 'Verbietet der Vertrag Weitergabe/Redistribution?',
    hint: 'Betrifft Dataset-Weitergabe (NC und kommerziell).',
    condition: (answers) => answers.hasContract === true,
    options: [
      { value: true, label: 'Ja, Weitergabe verboten', description: 'Vertrag untersagt Redistribution' },
      { value: false, label: 'Nein, erlaubt oder nicht geregelt', description: 'Vertrag erlaubt Weitergabe oder schweigt dazu' }
    ]
  },
  {
    id: 'licenseStatus',
    stage: 2,
    question: 'Ist die Lizenz bekannt und belegt?',
    hint: 'Unbekannte Lizenzen führen zu Sperrung von TEXT/MEDIA.',
    options: [
      { value: 'known', label: 'Ja, bekannt und belegt', description: 'Lizenz ist dokumentiert und nachweisbar' },
      { value: 'unknown', label: 'Unbekannt', description: 'Lizenz ist nicht bekannt' },
      { value: 'no_evidence', label: 'Kein Nachweis', description: 'Lizenz behauptet aber nicht belegt' }
    ]
  },
  {
    id: 'licenseType',
    stage: 2,
    question: 'Welche Lizenz liegt vor?',
    hint: 'Die Lizenz bestimmt erlaubte Nutzungsarten.',
    condition: (answers) => answers.licenseStatus === 'known',
    options: [
      { value: 'CC0', label: 'CC0 / Public Domain', description: 'Keine Einschränkungen' },
      { value: 'CC_BY', label: 'CC BY', description: 'Namensnennung erforderlich' },
      { value: 'CC_BY_NC', label: 'CC BY-NC', description: 'Namensnennung + nur nicht-kommerziell' },
      { value: 'proprietary', label: 'Proprietär', description: 'Eigene Lizenz, eingeschränkte Nutzung' }
    ]
  },
  {
    id: 'tosProhibitsAI',
    stage: 2,
    question: 'Verbieten die AGB/ToS der Quelle KI-Training?',
    hint: 'ToS-Einschränkungen gelten unabhängig von Lizenzen.',
    options: [
      { value: true, label: 'Ja, verboten', description: 'AGB/ToS untersagen KI-Training explizit' },
      { value: false, label: 'Nein', description: 'Keine Einschränkung in AGB/ToS' }
    ]
  },
  {
    id: 'tosProhibitsRedist',
    stage: 2,
    question: 'Verbieten die AGB/ToS Redistribution/Weitergabe?',
    hint: 'Betrifft Dataset-Weitergabe.',
    options: [
      { value: true, label: 'Ja, verboten', description: 'AGB/ToS untersagen Weitergabe explizit' },
      { value: false, label: 'Nein', description: 'Keine Einschränkung in AGB/ToS' }
    ]
  },
  {
    id: 'tdmOptOut',
    stage: 2,
    question: 'Liegt ein TDM-Opt-out vor (KI/Data-Mining untersagt)?',
    hint: 'Z.B. robots.txt ai.txt oder explizite TDM-Reservation.',
    options: [
      { value: true, label: 'Ja, TDM-Opt-out', description: 'Quelle hat TDM/KI-Nutzung explizit untersagt' },
      { value: false, label: 'Nein', description: 'Kein Opt-out vorhanden' }
    ]
  },
  {
    id: 'dbRiskHigh',
    stage: 2,
    question: 'Besteht Datenbankrecht-Risiko bei kommerzieller Nutzung?',
    hint: 'Systematischer Abruf ohne Vertrag kann DB-Recht verletzen.',
    options: [
      { value: true, label: 'Ja, hohes Risiko', description: 'Systematische/kommerzielle Nutzung problematisch' },
      { value: false, label: 'Nein', description: 'Kein besonderes DB-Risiko' }
    ]
  }
];

export const stages = [
  { id: 1, label: 'Stufe 1: Intake', description: 'Herkunft & Hygiene' },
  { id: 2, label: 'Stufe 2: Rechte', description: 'Policies & Lizenzen' },
  { id: 3, label: 'Stufe 3: Ergebnis', description: 'Use-Case Matrix' }
];
