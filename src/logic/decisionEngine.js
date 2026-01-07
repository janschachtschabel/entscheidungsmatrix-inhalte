// Entscheidungslogik für die Tag-Engine und Use-Case-Bewertung

export const SOURCE_CLASSES = {
  OWN: 'OWN',
  COOP: 'COOP',
  PLATFORM: 'PLATFORM',
  UNCOOP: 'UNCOOP',
  UNKNOWN: 'UNKNOWN'
};

export const COMPONENTS = ['FACTS', 'TEXT', 'MEDIA', 'DERIVED'];

export const USE_CASES = ['SEARCH', 'TRAIN', 'DS_NC', 'DS_COMM', 'MODEL_SHARE'];

export const STATUS = {
  GREEN: 'green',
  YELLOW: 'yellow',
  RED: 'red'
};

// Stufe 1: Intake & Hygiene - Erzeugt Datenpass
export function evaluateStufe1(answers) {
  const dataPass = {
    source_class: answers.sourceClass || SOURCE_CLASSES.UNKNOWN,
    source_domain: answers.sourceDomain || 'unbekannt',
    access_method: answers.accessMethod || 'unbekannt',
    coop_present: answers.coopPresent || 'unknown',
    contract_id: answers.contractId || null,
    components: {
      has_facts: answers.hasFacts ?? true,
      has_text: answers.hasText ?? false,
      has_media: answers.hasMedia ?? false,
      has_derived: answers.hasDerived ?? false
    },
    pii: {
      PII_STATUS: answers.piiStatus || 'none',
      PII_MINIMIZED: answers.piiMinimized ?? false,
      PII_ANON: answers.piiAnon ?? false,
      PII_RESTRICTED: answers.piiRestricted ?? false,
      PII_QUARANTINE: false
    },
    pool_candidate: 'SAFE_CANDIDATE'
  };

  // Stufe-1-Regeln
  if (dataPass.source_class === SOURCE_CLASSES.UNCOOP) {
    dataPass.pool_candidate = 'QUARANTINE';
  } else if (dataPass.source_class === SOURCE_CLASSES.UNKNOWN) {
    dataPass.pool_candidate = 'UNKLAR_CANDIDATE';
  } else if (dataPass.source_class === SOURCE_CLASSES.PLATFORM) {
    dataPass.pool_candidate = 'PLATFORM_CANDIDATE';
  }

  // PII Quarantine Check
  if (dataPass.pii.PII_STATUS === 'high' && !dataPass.pii.PII_MINIMIZED && !dataPass.pii.PII_ANON) {
    dataPass.pii.PII_QUARANTINE = true;
    dataPass.pool_candidate = 'QUARANTINE';
  }

  return dataPass;
}

// Stufe 2: Rechte & Policies - Erzeugt Rights Profile mit Tags
export function evaluateStufe2(dataPass, answers) {
  const tags = {
    blockers: [],
    limits: [],
    requirements: [],
    useCaseTags: {
      FACTS: { SEARCH: STATUS.GREEN, TRAIN: STATUS.GREEN, DS_NC: STATUS.GREEN, DS_COMM: STATUS.GREEN, MODEL_SHARE: STATUS.YELLOW },
      TEXT: { SEARCH: STATUS.GREEN, TRAIN: STATUS.GREEN, DS_NC: STATUS.GREEN, DS_COMM: STATUS.GREEN, MODEL_SHARE: STATUS.YELLOW },
      MEDIA: { SEARCH: STATUS.GREEN, TRAIN: STATUS.GREEN, DS_NC: STATUS.GREEN, DS_COMM: STATUS.GREEN, MODEL_SHARE: STATUS.YELLOW },
      DERIVED: { SEARCH: STATUS.GREEN, TRAIN: STATUS.GREEN, DS_NC: STATUS.GREEN, DS_COMM: STATUS.GREEN, MODEL_SHARE: STATUS.YELLOW }
    }
  };

  // Gate 2A: Harte Ausschlüsse aus Herkunft
  if (dataPass.source_class === SOURCE_CLASSES.UNCOOP) {
    tags.blockers.push('BLOCK.UNCOOP');
    setAllUseCases(tags.useCaseTags, STATUS.RED);
  }

  if (dataPass.source_class === SOURCE_CLASSES.PLATFORM && !answers.platformOptIn) {
    tags.blockers.push('BLOCK.PLATFORM_NO_OPTIN');
    tags.requirements.push('REQ.LINK_ONLY');
    
    tags.useCaseTags.FACTS.SEARCH = STATUS.GREEN;
    tags.useCaseTags.TEXT.SEARCH = STATUS.YELLOW;
    tags.useCaseTags.MEDIA.SEARCH = STATUS.YELLOW;
    
    COMPONENTS.forEach(comp => {
      tags.useCaseTags[comp].TRAIN = STATUS.RED;
      tags.useCaseTags[comp].DS_NC = STATUS.RED;
      tags.useCaseTags[comp].DS_COMM = STATUS.RED;
      tags.useCaseTags[comp].MODEL_SHARE = STATUS.RED;
    });
    tags.useCaseTags.DERIVED.SEARCH = STATUS.RED;
  }

  // Gate 2B: Rechtebasis
  if (answers.rightsStatus === 'aggregator_no_rights' || answers.rightsStatus === 'unknown') {
    tags.blockers.push('BLOCK.RIGHTS_UNKNOWN');
    ['TEXT', 'MEDIA', 'DERIVED'].forEach(comp => {
      setComponentUseCases(tags.useCaseTags[comp], STATUS.RED);
    });
  }

  // Gate 2C: Vertrag/Kooperation
  if (answers.contractProhibitsAI) {
    tags.blockers.push('BLOCK.TOS_AI');
    COMPONENTS.forEach(comp => {
      tags.useCaseTags[comp].TRAIN = STATUS.RED;
      tags.useCaseTags[comp].MODEL_SHARE = STATUS.RED;
    });
  }

  if (answers.contractProhibitsRedist) {
    tags.blockers.push('BLOCK.TOS_REDIST');
    COMPONENTS.forEach(comp => {
      tags.useCaseTags[comp].DS_NC = STATUS.RED;
      tags.useCaseTags[comp].DS_COMM = STATUS.RED;
    });
  }

  // Gate 2D: Lizenz
  if (answers.licenseStatus === 'unknown' || answers.licenseStatus === 'no_evidence') {
    tags.blockers.push('BLOCK.LICENSE_UNKNOWN');
    ['TEXT', 'MEDIA', 'DERIVED'].forEach(comp => {
      setComponentUseCases(tags.useCaseTags[comp], STATUS.RED);
    });
  } else {
    applyLicenseRules(tags, answers.licenseType);
  }

  // Gate 2E: Opt-outs & Policies
  if (answers.tosProhibitsAI) {
    tags.blockers.push('BLOCK.TOS_AI');
    COMPONENTS.forEach(comp => {
      tags.useCaseTags[comp].TRAIN = STATUS.RED;
      tags.useCaseTags[comp].MODEL_SHARE = STATUS.RED;
    });
  }

  if (answers.tosProhibitsRedist) {
    tags.blockers.push('BLOCK.TOS_REDIST');
    COMPONENTS.forEach(comp => {
      tags.useCaseTags[comp].DS_NC = STATUS.RED;
      tags.useCaseTags[comp].DS_COMM = STATUS.RED;
    });
  }

  if (answers.tdmOptOut) {
    tags.blockers.push('BLOCK.TDM_OPTOUT');
    COMPONENTS.forEach(comp => {
      tags.useCaseTags[comp].TRAIN = STATUS.RED;
      tags.useCaseTags[comp].MODEL_SHARE = STATUS.RED;
    });
  }

  // Gate 2F: Datenbankrecht
  if (answers.dbRiskHigh && !dataPass.contract_id) {
    tags.limits.push('LIMIT.DB_RISK_COMM');
    tags.useCaseTags.FACTS.DS_COMM = STATUS.RED;
  }

  // Dedupliziere Tags
  tags.blockers = [...new Set(tags.blockers)];
  tags.limits = [...new Set(tags.limits)];
  tags.requirements = [...new Set(tags.requirements)];

  return tags;
}

// Stufe 3: Use-Case-Auskunft - Finale Entscheidungsmatrix
export function evaluateStufe3(dataPass, tags) {
  const result = {
    header: {
      source_domain: dataPass.source_domain,
      source_class: dataPass.source_class,
      pii_quarantine: dataPass.pii.PII_QUARANTINE,
      blockers: tags.blockers,
      limits: tags.limits,
      requirements: tags.requirements
    },
    matrix: JSON.parse(JSON.stringify(tags.useCaseTags)),
    auflagen: {}
  };

  // Globale Overrides
  if (dataPass.pii.PII_QUARANTINE) {
    COMPONENTS.forEach(comp => {
      setComponentUseCases(result.matrix[comp], STATUS.RED);
    });
    result.auflagen.global = 'QUARANTÄNE - PII nicht bereinigt';
    return result;
  }

  if (tags.blockers.includes('BLOCK.UNCOOP')) {
    COMPONENTS.forEach(comp => {
      setComponentUseCases(result.matrix[comp], STATUS.RED);
    });
    result.auflagen.global = 'BLOCK - Unkooperative Erhebung';
    return result;
  }

  // DERIVED nie freier als Basis
  USE_CASES.forEach(useCase => {
    const basisStatuses = ['FACTS', 'TEXT', 'MEDIA'].map(comp => 
      dataPass.components[`has_${comp.toLowerCase()}`] ? result.matrix[comp][useCase] : null
    ).filter(Boolean);
    
    if (basisStatuses.includes(STATUS.RED)) {
      result.matrix.DERIVED[useCase] = STATUS.RED;
    } else if (basisStatuses.includes(STATUS.YELLOW) && result.matrix.DERIVED[useCase] === STATUS.GREEN) {
      result.matrix.DERIVED[useCase] = STATUS.YELLOW;
    }
  });

  // Auflagen pro Komponente
  if (tags.requirements.includes('REQ.ATTRIBUTION')) {
    result.auflagen.TEXT = result.auflagen.TEXT || [];
    result.auflagen.TEXT.push('Quellenangabe erforderlich (BY)');
  }
  if (tags.requirements.includes('REQ.LINK_ONLY')) {
    result.auflagen.MEDIA = result.auflagen.MEDIA || [];
    result.auflagen.MEDIA.push('Nur Link/Embed, keine Kopie');
  }
  if (tags.limits.includes('LIMIT.NC_ONLY')) {
    result.auflagen.global = (result.auflagen.global || '') + ' NC-Trennung erforderlich';
  }
  if (tags.limits.includes('LIMIT.DB_RISK_COMM')) {
    result.auflagen.FACTS = result.auflagen.FACTS || [];
    result.auflagen.FACTS.push('DB-Risiko bei kommerzieller Nutzung');
  }

  return result;
}

// Helper functions
function setAllUseCases(useCaseTags, status) {
  COMPONENTS.forEach(comp => {
    setComponentUseCases(useCaseTags[comp], status);
  });
}

function setComponentUseCases(componentTags, status) {
  USE_CASES.forEach(useCase => {
    componentTags[useCase] = status;
  });
}

function applyLicenseRules(tags, licenseType) {
  switch (licenseType) {
    case 'CC0':
    case 'PD':
      // Alles erlaubt
      break;
    case 'CC_BY':
      tags.requirements.push('REQ.ATTRIBUTION');
      break;
    case 'CC_BY_NC':
      tags.requirements.push('REQ.ATTRIBUTION');
      tags.limits.push('LIMIT.NC_ONLY');
      COMPONENTS.forEach(comp => {
        tags.useCaseTags[comp].DS_COMM = STATUS.RED;
        tags.useCaseTags[comp].MODEL_SHARE = STATUS.RED;
      });
      break;
    case 'proprietary':
      ['TEXT', 'MEDIA', 'DERIVED'].forEach(comp => {
        tags.useCaseTags[comp].DS_COMM = STATUS.RED;
        tags.useCaseTags[comp].MODEL_SHARE = STATUS.RED;
        tags.useCaseTags[comp].TRAIN = STATUS.YELLOW;
        tags.useCaseTags[comp].DS_NC = STATUS.YELLOW;
      });
      break;
    default:
      break;
  }
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
