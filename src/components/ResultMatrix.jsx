import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, AlertCircle, Download, RotateCcw, Info } from 'lucide-react';
import { getCellStatus, USE_CASES, COMPONENTS, POOLS } from '../logic/decisionEngine';
import RiskIndicator from './RiskIndicator';

// Bestimme Icon basierend auf Tags in der Zelle
const CellIcon = ({ tags }) => {
  const status = getCellStatus(tags);
  switch (status) {
    case 'green':
      return <span className="text-xl">🟢</span>;
    case 'yellow':
      return <span className="text-xl">🟡</span>;
    case 'red':
      return <span className="text-xl">🔴</span>;
    default:
      return <span className="text-xl">⚪</span>;
  }
};

// Use Case Labels nach neuem Schema
const useCaseLabels = {
  SEARCH_DISPLAY: 'Suche/Anzeige',
  TRAIN_INT: 'Training (intern)',
  TRAIN_EXT: 'Training (extern)',
  DATASET_NC: 'Dataset (NC)',
  DATASET_COMM: 'Dataset (Komm.)',
  MODEL_SHARE: 'Modell teilen'
};

// Komponenten Labels nach neuem Schema
const componentLabels = {
  FACTS: 'FACTS',
  TEXT: 'TEXT',
  MEDIA: 'MEDIA',
  COMPENDIUM_TEXT: 'COMPENDIUM_TEXT',
  QA_PAIRS: 'QA_PAIRS',
  INDEX: 'INDEX',
  MODEL_WEIGHTS: 'MODEL_WEIGHTS'
};

// Pool Labels
const poolLabels = {
  Z0_BLOCK: { label: 'Z0 BLOCK', color: 'red', description: 'Nutzung untersagt' },
  Z1_QUARANTINE: { label: 'Z1 QUARANTINE', color: 'red', description: 'PII-Quarantäne' },
  Z2_PLATFORM: { label: 'Z2 PLATFORM', color: 'orange', description: 'Plattform ohne Opt-in' },
  Z3_NC: { label: 'Z3 NC', color: 'orange', description: 'Nur nicht-kommerziell' },
  Z4_SAFE: { label: 'Z4 SAFE', color: 'green', description: 'Keine Einschränkungen' },
  Z5_UNKLAR: { label: 'Z5 UNKLAR', color: 'gray', description: 'Klärung nötig' }
};

export default function ResultMatrix({ result, onReset }) {
  const { stufe1, stufe2, stufe3 } = result;

  // Nur vorhandene Komponenten anzeigen
  const presentComponents = stufe3.presentComponents || ['FACTS'];

  const exportResult = () => {
    const data = JSON.stringify(result, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'entscheidungsmatrix-ergebnis.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Pool-Badge
  const poolInfo = poolLabels[stufe3.pool?.pool] || poolLabels.Z5_UNKLAR;
  const poolColorClasses = {
    red: 'bg-red-100 text-red-800 border-red-300',
    orange: 'bg-orange-100 text-orange-800 border-orange-300',
    green: 'bg-green-100 text-green-800 border-green-300',
    gray: 'bg-gray-100 text-gray-800 border-gray-300'
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Stufe 3: Entscheidungsmatrix</h1>
          <div className="flex gap-2">
            <button
              onClick={exportResult}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Neue Prüfung
            </button>
          </div>
        </div>

        {/* Pool-Zuordnung (prominent) */}
        <div className="mb-4">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold ${poolColorClasses[poolInfo.color]}`}>
            <span className="text-lg">{poolInfo.label}</span>
            <span className="text-sm font-normal">– {stufe3.pool?.reason}</span>
          </div>
        </div>

      </div>

      {/* Risiko-Übersicht aus Stufe 1 */}
      <RiskIndicator stufe1Data={stufe1} />

      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        {/* Quelle Info */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Datenpass (Stufe 1)</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
          <div>
            <div className="text-sm text-gray-500">Herkunftsklasse</div>
            <div className="font-medium">{stufe1.source_class}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Kooperation</div>
            <div className="font-medium">{stufe1.coop_present}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">PII-Status</div>
            <div className="font-medium">{stufe1.pii_status} {stufe1.pii_quarantine ? '⚠️ Quarantäne' : ''}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Komponenten</div>
            <div className="font-medium text-xs">{presentComponents.join(', ')}</div>
          </div>
        </div>
      </div>

      {/* Warnungen & Blocker */}
      {(stufe3.header.pii_quarantine || stufe3.header.blockers.length > 0 || stufe3.header.limits.length > 0) && (
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Einschränkungen & Blocker
          </h2>
          
          <div className="space-y-3">
            {stufe3.header.pii_quarantine && (
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-red-800">PII Quarantäne aktiv</div>
                  <div className="text-sm text-red-600">Personenbezogene Daten nicht bereinigt. Alle Use-Cases gesperrt.</div>
                </div>
              </div>
            )}

            {stufe3.header.blockers.map((blocker) => (
              <div key={blocker} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-red-800">{blocker}</div>
                  <div className="text-sm text-red-600">{getBlockerDescription(blocker)}</div>
                </div>
              </div>
            ))}

            {stufe3.header.limits.map((limit) => (
              <div key={limit} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-amber-800">{limit}</div>
                  <div className="text-sm text-amber-600">{getLimitDescription(limit)}</div>
                </div>
              </div>
            ))}

            {stufe3.header.requirements.map((req) => (
              <div key={req} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-800">{req}</div>
                  <div className="text-sm text-blue-600">{getRequirementDescription(req)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Use-Case Matrix */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Matrix: Komponenten vs. Use Case mit Block-/Limit-Tags</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Komponente</th>
                {Object.keys(useCaseLabels).map((uc) => (
                  <th key={uc} className="text-center py-3 px-1 font-semibold text-gray-700 text-xs">
                    {useCaseLabels[uc]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* GLOBAL Zeile */}
              <tr className="border-b border-gray-200 bg-gray-50">
                <td className="py-3 px-2 font-semibold text-gray-600">GLOBAL</td>
                {Object.keys(useCaseLabels).map((uc) => {
                  const globalTags = ['BLOCK.PII_QUARANTINE', 'BLOCK.UNCOOP'].filter(t => stufe2.blockers.includes(t));
                  return (
                    <td key={uc} className="text-center py-2 px-1">
                      {globalTags.length > 0 ? (
                        <div className="flex flex-col items-center gap-1">
                          <CellIcon tags={globalTags} />
                          <div className="text-[10px] text-red-600 font-mono">
                            {globalTags.map(t => t.replace('BLOCK.', '')).join(', ')}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">–</span>
                      )}
                    </td>
                  );
                })}
              </tr>
              {/* Komponenten-Zeilen */}
              {presentComponents.map((comp) => (
                <tr key={comp} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2">
                    <div className="font-medium text-gray-800 text-xs">{componentLabels[comp] || comp}</div>
                  </td>
                  {Object.keys(useCaseLabels).map((uc) => {
                    const cellTags = stufe3.matrix[comp]?.[uc] || [];
                    const status = getCellStatus(cellTags);
                    return (
                      <td key={uc} className="text-center py-2 px-1">
                        <div className="flex flex-col items-center gap-1">
                          <CellIcon tags={cellTags} />
                          {cellTags.length > 0 && (
                            <div className={`text-[9px] font-mono leading-tight ${
                              status === 'red' ? 'text-red-600' : status === 'yellow' ? 'text-orange-600' : 'text-gray-500'
                            }`}>
                              {cellTags.slice(0, 2).map(t => t.replace('BLOCK.', '').replace('LIMIT.', '')).join(', ')}
                              {cellTags.length > 2 && '...'}
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Auflagen (REQ.*) */}
        {stufe3.auflagen && stufe3.auflagen.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-blue-800 text-sm">
            <strong>Auflagen (bei erlaubter Nutzung):</strong> {stufe3.auflagen.join(', ')}
          </div>
        )}
      </div>

      {/* Legende */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Ampel-Legende</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <span className="text-2xl">🟢</span>
            <div>
              <div className="font-medium text-green-800">Zulässig</div>
              <div className="text-sm text-green-600">Standardmaßnahmen genügen</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
            <span className="text-2xl">🟡</span>
            <div>
              <div className="font-medium text-yellow-800">Bedingt zulässig</div>
              <div className="text-sm text-yellow-600">Nur mit Auflagen/Trennung</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
            <span className="text-2xl">🔴</span>
            <div>
              <div className="font-medium text-red-800">Unzulässig</div>
              <div className="text-sm text-red-600">Stopp/Quarantäne bis Klärung</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getBlockerDescription(blocker) {
  const descriptions = {
    'BLOCK.UNCOOP': 'Daten wurden unkooperativ erhoben (Scraping trotz Verbot)',
    'BLOCK.PII_QUARANTINE': 'PII hohes Risiko, nicht mitigiert → Quarantäne',
    'BLOCK.PLATFORM_NO_OPTIN': 'Plattformdaten ohne KI-Opt-in des Rechteinhabers',
    'BLOCK.TDM_OPTOUT': 'Maschinenlesbares TDM Opt-out vorhanden',
    'BLOCK.TOS_AI': 'AGB verbieten KI-Nutzung',
    'BLOCK.TOS_REDIST': 'AGB verbieten Weitergabe/Redistribution',
    'BLOCK.LICENSE_UNKNOWN': 'Lizenz unbekannt für TEXT/MEDIA → gesperrt',
    'BLOCK.RIGHTS_UNKNOWN': 'Rechtebasis unklar (Quelle nicht berechtigt)'
  };
  return descriptions[blocker] || 'Unbekannter Blocker';
}

function getLimitDescription(limit) {
  const descriptions = {
    'LIMIT.NC_ONLY': 'Nur nicht-kommerzielle Nutzung erlaubt (NC-Lizenz)',
    'LIMIT.DB_RISK_COMM': 'Datenbankrecht-Risiko bei kommerzieller Nutzung',
    'LIMIT.DISPLAY_ONLY': 'Nur Anzeige erlaubt (proprietäre Lizenz)',
    'LIMIT.MIXED_TREAT_AS_UNKNOWN': 'Gemischte Lizenzen → wie UNKNOWN behandeln',
    'LIMIT.CRAWL_DISALLOWED': 'robots.txt verbietet Crawl'
  };
  return descriptions[limit] || 'Unbekannte Einschränkung';
}

function getRequirementDescription(req) {
  const descriptions = {
    'REQ.ATTRIBUTION': 'Quellenangabe/Attribution erforderlich (BY)',
    'REQ.LINK_ONLY': 'Nur verlinken, nicht kopieren'
  };
  return descriptions[req] || 'Unbekannte Auflage';
}
