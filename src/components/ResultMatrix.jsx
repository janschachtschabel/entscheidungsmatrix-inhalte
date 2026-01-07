import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, AlertCircle, Download, RotateCcw } from 'lucide-react';

const StatusIcon = ({ status }) => {
  switch (status) {
    case 'green':
      return <span className="text-2xl">🟢</span>;
    case 'yellow':
      return <span className="text-2xl">🟡</span>;
    case 'red':
      return <span className="text-2xl">🔴</span>;
    default:
      return <span className="text-2xl">⚪</span>;
  }
};

const StatusBadge = ({ status, label }) => {
  const colors = {
    green: 'bg-green-100 text-green-800 border-green-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    red: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${colors[status] || 'bg-gray-100'}`}>
      <StatusIcon status={status} />
      {label}
    </span>
  );
};

const useCaseLabels = {
  SEARCH: 'Suche/Anzeige',
  TRAIN: 'KI-Training',
  DS_NC: 'Dataset (NC)',
  DS_COMM: 'Dataset (Komm.)',
  MODEL_SHARE: 'Modell-Weitergabe'
};

const componentLabels = {
  FACTS: 'Fakten (Metadaten)',
  TEXT: 'Text (Beschreibung)',
  MEDIA: 'Media (Bilder/Video)',
  DERIVED: 'Abgeleitete Daten'
};

export default function ResultMatrix({ result, onReset }) {
  const { stufe1, stufe2, stufe3 } = result;

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

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Ergebnis der Prüfung</h1>
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

        {/* Quelle Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
          <div>
            <div className="text-sm text-gray-500">Quelle</div>
            <div className="font-medium">{stufe3.header.source_domain}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Herkunftsklasse</div>
            <div className="font-medium">{stufe1.source_class}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Pool-Routing</div>
            <div className="font-medium">{stufe1.pool_candidate}</div>
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
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Use-Case Entscheidungsmatrix</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Komponente</th>
                {Object.keys(useCaseLabels).map((uc) => (
                  <th key={uc} className="text-center py-3 px-2 font-semibold text-gray-700 text-sm">
                    {useCaseLabels[uc]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(componentLabels).map((comp) => (
                <tr key={comp} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-800">{componentLabels[comp]}</div>
                    {stufe3.auflagen[comp] && (
                      <div className="text-xs text-gray-500 mt-1">
                        {Array.isArray(stufe3.auflagen[comp]) 
                          ? stufe3.auflagen[comp].join(', ') 
                          : stufe3.auflagen[comp]}
                      </div>
                    )}
                  </td>
                  {Object.keys(useCaseLabels).map((uc) => (
                    <td key={uc} className="text-center py-4 px-2">
                      <StatusIcon status={stufe3.matrix[comp][uc]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {stufe3.auflagen.global && (
          <div className="mt-4 p-3 bg-amber-50 rounded-lg text-amber-800 text-sm">
            <strong>Globale Auflagen:</strong> {stufe3.auflagen.global}
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
    'BLOCK.UNCOOP': 'Daten wurden unkooperativ erhoben (z.B. Scraping trotz Verbot)',
    'BLOCK.PLATFORM_NO_OPTIN': 'Plattformdaten ohne Opt-in des Rechteinhabers',
    'BLOCK.TDM_OPTOUT': 'Quelle hat TDM/KI-Nutzung explizit untersagt',
    'BLOCK.TOS_AI': 'AGB/ToS verbieten KI-Training',
    'BLOCK.TOS_REDIST': 'AGB/ToS verbieten Weitergabe/Redistribution',
    'BLOCK.LICENSE_UNKNOWN': 'Lizenz/Beleg fehlt für TEXT/MEDIA',
    'BLOCK.RIGHTS_UNKNOWN': 'Rechtebasis unklar oder Aggregator ohne Rechte'
  };
  return descriptions[blocker] || 'Unbekannter Blocker';
}

function getLimitDescription(limit) {
  const descriptions = {
    'LIMIT.NC_ONLY': 'Nur nicht-kommerzielle Nutzung erlaubt',
    'LIMIT.DB_RISK_COMM': 'Datenbankrecht-Risiko bei kommerzieller Nutzung'
  };
  return descriptions[limit] || 'Unbekannte Einschränkung';
}

function getRequirementDescription(req) {
  const descriptions = {
    'REQ.ATTRIBUTION': 'Quellenangabe/Attribution erforderlich (BY)',
    'REQ.LINK_ONLY': 'Nicht kopieren, nur verlinken'
  };
  return descriptions[req] || 'Unbekannte Auflage';
}
