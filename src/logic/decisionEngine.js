// Entscheidungslogik für die Tag-Engine und Use-Case-Bewertung
// Schema: S1.1-S1.3, S2.1-S2.6, Stufe 3 Matrix

export const SOURCE_CLASSES = {
  OWN: 'OWN',
  COOP: 'COOP',
  PLATFORM: 'PLATFORM',
  UNCOOP: 'UNCOOP',
  UNKNOWN: 'UNKNOWN'
};

// Basis-Komponenten
export const BASE_COMPONENTS = ['FACTS', 'TEXT', 'MEDIA'];

// Derivat-Komponenten (erben Tags von Basis)
export const DERIVED_COMPONENTS = ['COMPENDIUM_TEXT', 'QA_PAIRS', 'INDEX', 'MODEL_WEIGHTS'];

// Alle Komponenten
export const COMPONENTS = [...BASE_COMPONENTS, ...DERIVED_COMPONENTS];

// Use Cases nach neuem Schema
export const USE_CASES = ['SEARCH_DISPLAY', 'TRAIN_INT', 'TRAIN_EXT', 'DATASET_NC', 'DATASET_COMM', 'MODEL_SHARE'];

// Status-Typen (nur für interne Berechnung, Matrix zeigt Tags)
export const STATUS = {
  GREEN: 'green',   // Keine Einschränkung
  YELLOW: 'yellow', // LIMIT-Tags aktiv
  RED: 'red'        // BLOCK-Tags aktiv
};

// Pool-Zuordnungen
export const POOLS = {
  Z0_BLOCK: 'Z0_BLOCK',
  Z1_QUARANTINE: 'Z1_QUARANTINE',
  Z2_PLATFORM: 'Z2_PLATFORM',
  Z3_NC: 'Z3_NC',
  Z4_SAFE: 'Z4_SAFE',
  Z5_UNKLAR: 'Z5_UNKLAR'
};

// Stufe 1: Intake & Hygiene - Erzeugt Datenpass (S1.1-S1.3)
export function evaluateStufe1(answers) {
  const components_present = answers.components_present || ['FACTS'];
  
  const dataPass = {
    // S1.1 Quelle & Zugriff
    source_class: answers.source_class || SOURCE_CLASSES.UNKNOWN,
    coop_present: answers.coop_present || 'unknown',
    
    // S1.2 Komponenten
    components_present: components_present,
    media_storage_mode: answers.media_storage_mode || null,
    
    // S1.3 PII
    pii_status: answers.pii_status || 'none',
    pii_mitigated: answers.pii_mitigated ?? null,
    pii_quarantine: false,
    
    // Pool-Vorschlag
    pool_candidate: POOLS.Z4_SAFE
  };

  // Pool-Zuordnung nach source_class
  switch (dataPass.source_class) {
    case SOURCE_CLASSES.OWN:
    case SOURCE_CLASSES.COOP:
      dataPass.pool_candidate = POOLS.Z4_SAFE;
      break;
    case SOURCE_CLASSES.PLATFORM:
      dataPass.pool_candidate = POOLS.Z2_PLATFORM;
      break;
    case SOURCE_CLASSES.UNCOOP:
      dataPass.pool_candidate = POOLS.Z0_BLOCK;
      break;
    case SOURCE_CLASSES.UNKNOWN:
      dataPass.pool_candidate = POOLS.Z5_UNKLAR;
      break;
  }

  // S1-05/S1-06: PII Quarantine Check
  if (dataPass.pii_status === 'high' && dataPass.pii_mitigated !== true) {
    dataPass.pii_quarantine = true;
    dataPass.pool_candidate = POOLS.Z1_QUARANTINE;
  }

  return dataPass;
}

// Stufe 2: Rechte & Policy - Erzeugt Tags (S2.1-S2.6)
export function evaluateStufe2(dataPass, answers) {
  // Initialisiere Matrix mit Tags pro Komponente/UseCase
  const initComponentTags = () => {
    const tags = {};
    USE_CASES.forEach(uc => { tags[uc] = []; });
    return tags;
  };

  const tags = {
    blockers: [],
    limits: [],
    requirements: [],
    componentTags: {}
  };

  // Initialisiere für alle Komponenten
  COMPONENTS.forEach(comp => {
    tags.componentTags[comp] = initComponentTags();
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // GLOBALE BLOCKER (wirken auf ALLE Komponenten und Use Cases)
  // ═══════════════════════════════════════════════════════════════════════════

  // S1-01: UNCOOP → BLOCK.UNCOOP (sofort in Stufe 1 erkannt)
  if (dataPass.source_class === SOURCE_CLASSES.UNCOOP) {
    tags.blockers.push('BLOCK.UNCOOP');
  }

  // S1-05/S1-06: PII_QUARANTINE
  if (dataPass.pii_quarantine) {
    tags.blockers.push('BLOCK.PII_QUARANTINE');
  }

  // S2-01: uncoop_violation
  if (answers.uncoop_violation === true) {
    tags.blockers.push('BLOCK.UNCOOP');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // S2.1 Herkunfts- & Plattform-Overrides
  // ═══════════════════════════════════════════════════════════════════════════

  // S2-02: platform_ai_optin
  if (dataPass.source_class === SOURCE_CLASSES.PLATFORM && answers.platform_ai_optin === 'no') {
    tags.blockers.push('BLOCK.PLATFORM_NO_OPTIN');
  }

  // S2-03: platform_display_mode
  if (answers.platform_display_mode === 'LINK_ONLY') {
    tags.requirements.push('REQ.LINK_ONLY');
  }

  // S1-04: media_storage_mode
  if (dataPass.media_storage_mode === 'LINK_ONLY') {
    tags.requirements.push('REQ.LINK_ONLY');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // S2.2 Rechtekette / Rechteinhaber
  // ═══════════════════════════════════════════════════════════════════════════

  // S2-04: rights_holder_status
  if (answers.rights_holder_status === 'unknown') {
    tags.blockers.push('BLOCK.RIGHTS_UNKNOWN');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // S2.3 Lizenz je Komponente
  // ═══════════════════════════════════════════════════════════════════════════

  // S2-05a/b und S2-06: Lizenzfragen nur relevant wenn KEIN Kooperationsvertrag
  // Bei coop_present='yes' regelt der Vertrag die Nutzungsrechte
  const hasCoopContract = dataPass.coop_present === 'yes';
  
  if (!hasCoopContract) {
    // S2-05a: license_text
    if (answers.license_text === 'UNKNOWN') {
      tags.blockers.push('BLOCK.LICENSE_UNKNOWN');
    }
    if (answers.license_text === 'CC_BY' || answers.license_text === 'CC_BY_NC') {
      tags.requirements.push('REQ.ATTRIBUTION');
    }
    if (answers.license_text === 'CC_BY_NC') {
      tags.limits.push('LIMIT.NC_ONLY');
    }
    if (answers.license_text === 'PROPRIETARY') {
      tags.limits.push('LIMIT.DISPLAY_ONLY');
    }

    // S2-05b: license_media
    if (answers.license_media === 'UNKNOWN') {
      tags.blockers.push('BLOCK.LICENSE_UNKNOWN');
    }
    if (answers.license_media === 'CC_BY' || answers.license_media === 'CC_BY_NC') {
      tags.requirements.push('REQ.ATTRIBUTION');
    }
    if (answers.license_media === 'CC_BY_NC') {
      tags.limits.push('LIMIT.NC_ONLY');
    }
    if (answers.license_media === 'PROPRIETARY') {
      tags.limits.push('LIMIT.DISPLAY_ONLY');
    }

    // S2-06: mixed_licenses
    if (answers.mixed_licenses === true) {
      tags.limits.push('LIMIT.MIXED_TREAT_AS_UNKNOWN');
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // S2.4 & S2.5: Nur relevant wenn KEIN Kooperationsvertrag
  // Bei coop_present='yes' überschreibt der Vertrag öffentliche AGB/ToS/TDM
  // ═══════════════════════════════════════════════════════════════════════════

  if (!hasCoopContract) {
    // S2-07: tos_ai_forbidden
    if (answers.tos_ai_forbidden === true) {
      tags.blockers.push('BLOCK.TOS_AI');
    }

    // S2-08: tos_redistribution_forbidden
    if (answers.tos_redistribution_forbidden === true) {
      tags.blockers.push('BLOCK.TOS_REDIST');
    }

    // S2-09: tdm_optout_machine
    if (answers.tdm_optout_machine === true) {
      tags.blockers.push('BLOCK.TDM_OPTOUT');
    }

    // S2-10: robots_disallow_crawl
    if (answers.robots_disallow_crawl === true) {
      tags.limits.push('LIMIT.CRAWL_DISALLOWED');
    }

    // S2-11: db_mass_extraction
    if (answers.db_mass_extraction === true) {
      tags.limits.push('LIMIT.DB_RISK_COMM');
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TAG-VERTEILUNG AUF MATRIX (Komponente × UseCase)
  // ═══════════════════════════════════════════════════════════════════════════

  // GLOBALE Tags (alle Komponenten, alle Use Cases)
  const globalBlockers = ['BLOCK.UNCOOP', 'BLOCK.PII_QUARANTINE'];
  globalBlockers.forEach(blocker => {
    if (tags.blockers.includes(blocker)) {
      COMPONENTS.forEach(comp => {
        USE_CASES.forEach(uc => {
          tags.componentTags[comp][uc].push(blocker);
        });
      });
    }
  });

  // BLOCK.PLATFORM_NO_OPTIN: Sperrt ALLE Use Cases (inkl. SEARCH_DISPLAY)
  if (tags.blockers.includes('BLOCK.PLATFORM_NO_OPTIN')) {
    COMPONENTS.forEach(comp => {
      USE_CASES.forEach(uc => {
        tags.componentTags[comp][uc].push('BLOCK.PLATFORM_NO_OPTIN');
      });
    });
  }

  // BLOCK.RIGHTS_UNKNOWN: Sperrt TEXT, MEDIA und Derivate
  if (tags.blockers.includes('BLOCK.RIGHTS_UNKNOWN')) {
    [...['TEXT', 'MEDIA'], ...DERIVED_COMPONENTS].forEach(comp => {
      USE_CASES.forEach(uc => {
        tags.componentTags[comp][uc].push('BLOCK.RIGHTS_UNKNOWN');
      });
    });
  }

  // BLOCK.LICENSE_UNKNOWN: Sperrt TEXT, MEDIA und Derivate
  if (tags.blockers.includes('BLOCK.LICENSE_UNKNOWN')) {
    [...['TEXT', 'MEDIA'], ...DERIVED_COMPONENTS].forEach(comp => {
      USE_CASES.forEach(uc => {
        tags.componentTags[comp][uc].push('BLOCK.LICENSE_UNKNOWN');
      });
    });
  }

  // BLOCK.TOS_AI: Sperrt alle KI-Use-Cases
  if (tags.blockers.includes('BLOCK.TOS_AI')) {
    COMPONENTS.forEach(comp => {
      ['TRAIN_INT', 'TRAIN_EXT', 'MODEL_SHARE'].forEach(uc => {
        tags.componentTags[comp][uc].push('BLOCK.TOS_AI');
      });
    });
  }

  // BLOCK.TOS_REDIST: Sperrt Dataset-Weitergabe UND Model-Share
  if (tags.blockers.includes('BLOCK.TOS_REDIST')) {
    COMPONENTS.forEach(comp => {
      ['DATASET_NC', 'DATASET_COMM', 'MODEL_SHARE'].forEach(uc => {
        tags.componentTags[comp][uc].push('BLOCK.TOS_REDIST');
      });
    });
  }

  // BLOCK.TDM_OPTOUT: Sperrt KI-Training und Model
  if (tags.blockers.includes('BLOCK.TDM_OPTOUT')) {
    COMPONENTS.forEach(comp => {
      ['TRAIN_INT', 'TRAIN_EXT', 'MODEL_SHARE'].forEach(uc => {
        tags.componentTags[comp][uc].push('BLOCK.TDM_OPTOUT');
      });
    });
  }

  // LIMIT.NC_ONLY: Sperrt kommerzielle Use Cases (inkl. internes Training für komm. Unternehmen)
  if (tags.limits.includes('LIMIT.NC_ONLY')) {
    COMPONENTS.forEach(comp => {
      ['TRAIN_INT', 'TRAIN_EXT', 'DATASET_COMM', 'MODEL_SHARE'].forEach(uc => {
        tags.componentTags[comp][uc].push('LIMIT.NC_ONLY');
      });
    });
  }

  // LIMIT.DISPLAY_ONLY: Nur Anzeige erlaubt
  if (tags.limits.includes('LIMIT.DISPLAY_ONLY')) {
    ['TEXT', 'MEDIA', ...DERIVED_COMPONENTS].forEach(comp => {
      ['TRAIN_INT', 'TRAIN_EXT', 'DATASET_NC', 'DATASET_COMM', 'MODEL_SHARE'].forEach(uc => {
        tags.componentTags[comp][uc].push('LIMIT.DISPLAY_ONLY');
      });
    });
  }

  // LIMIT.MIXED_TREAT_AS_UNKNOWN: Wirkt wie LICENSE_UNKNOWN
  if (tags.limits.includes('LIMIT.MIXED_TREAT_AS_UNKNOWN')) {
    ['TEXT', 'MEDIA', ...DERIVED_COMPONENTS].forEach(comp => {
      USE_CASES.forEach(uc => {
        tags.componentTags[comp][uc].push('LIMIT.MIXED_TREAT_AS_UNKNOWN');
      });
    });
  }

  // LIMIT.DB_RISK_COMM: Sperrt FACTS.DATASET_COMM
  if (tags.limits.includes('LIMIT.DB_RISK_COMM')) {
    tags.componentTags['FACTS']['DATASET_COMM'].push('LIMIT.DB_RISK_COMM');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // S2.6 Derivate: Vererbungsregel
  // ═══════════════════════════════════════════════════════════════════════════

  // Derivate erben Tags von Ursprungskomponenten
  const derivedFrom = answers.derived_from || 'MIXED';
  const sourceComps = derivedFrom === 'MIXED' 
    ? ['FACTS', 'TEXT', 'MEDIA'] 
    : [derivedFrom];

  DERIVED_COMPONENTS.forEach(derivComp => {
    if (dataPass.components_present.includes(derivComp)) {
      USE_CASES.forEach(uc => {
        sourceComps.forEach(srcComp => {
          tags.componentTags[derivComp][uc] = [
            ...tags.componentTags[derivComp][uc],
            ...tags.componentTags[srcComp][uc]
          ];
        });
        // Deduplizieren
        tags.componentTags[derivComp][uc] = [...new Set(tags.componentTags[derivComp][uc])];
      });
    }
  });

  // Dedupliziere globale Tags
  tags.blockers = [...new Set(tags.blockers)];
  tags.limits = [...new Set(tags.limits)];
  tags.requirements = [...new Set(tags.requirements)];

  return tags;
}

// Stufe 3: Entscheidungsmatrix (Use Cases vs. Komponenten)
export function evaluateStufe3(dataPass, tags) {
  const result = {
    header: {
      source_class: dataPass.source_class,
      coop_present: dataPass.coop_present,
      pii_quarantine: dataPass.pii_quarantine,
      blockers: tags.blockers,
      limits: tags.limits,
      requirements: tags.requirements
    },
    // Matrix: Komponente × UseCase → Array von Tags
    matrix: JSON.parse(JSON.stringify(tags.componentTags)),
    // Pool-Zuordnung
    pool: determinePool(dataPass, tags),
    // Auflagen-Liste (REQ.* Tags)
    auflagen: tags.requirements
  };

  // Filtere Matrix auf vorhandene Komponenten
  const presentComponents = dataPass.components_present || ['FACTS'];
  result.presentComponents = presentComponents;

  return result;
}

// Pool-Zuordnung nach Trigger-Bedingungen
function determinePool(dataPass, tags) {
  // Z0 BLOCK: UNCOOP
  if (tags.blockers.includes('BLOCK.UNCOOP')) {
    return { pool: POOLS.Z0_BLOCK, reason: 'Unkooperative Herkunft' };
  }
  
  // Z1 QUARANTINE: PII
  if (tags.blockers.includes('BLOCK.PII_QUARANTINE')) {
    return { pool: POOLS.Z1_QUARANTINE, reason: 'PII hohes Risiko' };
  }
  
  // Z2 PLATFORM: Ohne Opt-in
  if (tags.blockers.includes('BLOCK.PLATFORM_NO_OPTIN')) {
    return { pool: POOLS.Z2_PLATFORM, reason: 'Plattform ohne KI-Opt-in' };
  }
  
  // Z3 NC: NC-Only
  if (tags.limits.includes('LIMIT.NC_ONLY')) {
    return { pool: POOLS.Z3_NC, reason: 'Nur nicht-kommerzielle Nutzung' };
  }
  
  // Z5 UNKLAR: Unknown source
  if (dataPass.source_class === SOURCE_CLASSES.UNKNOWN) {
    return { pool: POOLS.Z5_UNKLAR, reason: 'Herkunft unklar' };
  }
  
  // Z4 SAFE: Keine Trigger
  return { pool: POOLS.Z4_SAFE, reason: 'Keine Einschränkungen' };
}

// Hilfsfunktion: Bestimme Status einer Zelle basierend auf Tags
export function getCellStatus(cellTags) {
  if (!cellTags || cellTags.length === 0) {
    return STATUS.GREEN; // Keine Tags = erlaubt
  }
  
  // Prüfe auf BLOCK-Tags
  const hasBlock = cellTags.some(tag => tag.startsWith('BLOCK.'));
  if (hasBlock) {
    return STATUS.RED;
  }
  
  // Prüfe auf LIMIT-Tags
  const hasLimit = cellTags.some(tag => tag.startsWith('LIMIT.'));
  if (hasLimit) {
    return STATUS.YELLOW;
  }
  
  return STATUS.GREEN;
}

// Vollständige Evaluation durch alle 3 Stufen
export function evaluateAll(answers) {
  const dataPass = evaluateStufe1(answers);
  const tags = evaluateStufe2(dataPass, answers);
  const result = evaluateStufe3(dataPass, tags);
  
  return {
    stufe1: dataPass,
    stufe2: tags,
    stufe3: result
  };
}
