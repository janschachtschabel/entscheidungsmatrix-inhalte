import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, HelpCircle, Globe, Database, Users, AlertOctagon, FileQuestion } from 'lucide-react';

const SOURCE_INFO = {
  OWN: {
    label: 'Eigene Daten',
    description: 'Eigene Redaktion, intern erzeugte Inhalte',
    risk: 'low',
    icon: CheckCircle,
    color: 'green'
  },
  COOP: {
    label: 'Kooperation',
    description: 'Partnerlieferung, autorisierte API/Feeds',
    risk: 'low',
    icon: Users,
    color: 'green'
  },
  PLATFORM: {
    label: 'Plattform',
    description: 'YouTube, Social Media, Plattform-APIs',
    risk: 'medium',
    icon: Globe,
    color: 'yellow'
  },
  UNCOOP: {
    label: 'Unkooperativ',
    description: 'Scraping trotz Verbot, Umgehung technischer Barrieren',
    risk: 'blocked',
    icon: XCircle,
    color: 'red'
  },
  UNKNOWN: {
    label: 'Unbekannt',
    description: 'Herkunft nicht belegbar',
    risk: 'unclear',
    icon: HelpCircle,
    color: 'gray'
  }
};

const COMPONENT_INFO = {
  FACTS: { label: 'FACTS', description: 'Strukturierte Fakten', risk: 'low' },
  TEXT: { label: 'TEXT', description: 'Schöpferische Texte', risk: 'medium' },
  MEDIA: { label: 'MEDIA', description: 'Bilder/Videos', risk: 'medium' },
  COMPENDIUM_TEXT: { label: 'COMPENDIUM', description: 'Zusammenfassungen', risk: 'inherited' },
  QA_PAIRS: { label: 'QA_PAIRS', description: 'Frage-Antwort', risk: 'inherited' },
  INDEX: { label: 'INDEX', description: 'Suchindex', risk: 'inherited' },
  MODEL_WEIGHTS: { label: 'MODEL', description: 'Modellgewichte', risk: 'inherited' }
};

const RISK_LEVELS = {
  blocked: {
    label: 'BLOCKIERT',
    emoji: '⛔',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-500',
    textColor: 'text-red-800',
    description: 'Nutzung unzulässig'
  },
  high: {
    label: 'HOCH',
    emoji: '🔴',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-400',
    textColor: 'text-red-700',
    description: 'Mehrere Risikofaktoren'
  },
  medium: {
    label: 'MITTEL',
    emoji: '🟡',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-400',
    textColor: 'text-yellow-700',
    description: 'Prüfung in Stufe 2 erforderlich'
  },
  low: {
    label: 'NIEDRIG',
    emoji: '🟢',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-400',
    textColor: 'text-green-700',
    description: 'Geringe Risiken'
  },
  unclear: {
    label: 'UNKLAR',
    emoji: '❓',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-400',
    textColor: 'text-gray-700',
    description: 'Klärung erforderlich'
  }
};

function calculateOverallRisk(sourceClass, components, piiStatus, coopPresent) {
  // Blocked: Unkooperativ oder PII-Quarantäne
  if (sourceClass === 'UNCOOP') return 'blocked';
  if (piiStatus === 'high') return 'high';
  
  // Unclear: Unbekannte Herkunft
  if (sourceClass === 'UNKNOWN') return 'unclear';
  
  // Low: Eigene Daten
  if (sourceClass === 'OWN') return 'low';
  
  // Kooperation mit Vertrag = niedrig
  if (sourceClass === 'COOP' && coopPresent === 'yes') return 'low';
  
  // Plattform ohne Vertrag = mittel bis hoch
  if (sourceClass === 'PLATFORM') {
    const hasCreativeContent = components?.includes('TEXT') || components?.includes('MEDIA');
    return hasCreativeContent ? 'high' : 'medium';
  }
  
  // Kooperation ohne Vertrag mit schöpferischen Inhalten
  if (sourceClass === 'COOP' && coopPresent !== 'yes') {
    const hasCreativeContent = components?.includes('TEXT') || components?.includes('MEDIA');
    return hasCreativeContent ? 'medium' : 'low';
  }
  
  return 'medium';
}

export default function RiskIndicator({ stufe1Data, answers }) {
  const sourceClass = stufe1Data?.source_class || 'UNKNOWN';
  const components = stufe1Data?.components_present || [];
  const piiStatus = stufe1Data?.pii_status || 'none';
  const coopPresent = stufe1Data?.coop_present || 'no';
  
  const sourceInfo = SOURCE_INFO[sourceClass] || SOURCE_INFO.UNKNOWN;
  const overallRisk = calculateOverallRisk(sourceClass, components, piiStatus, coopPresent);
  const riskLevel = RISK_LEVELS[overallRisk];
  
  const SourceIcon = sourceInfo.icon;
  
  return (
    <div className={`rounded-xl border-2 ${riskLevel.borderColor} ${riskLevel.bgColor} p-6 mb-6`}>
      {/* Header mit Ampel */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          📋 Risiko-Übersicht Stufe 1
        </h3>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${riskLevel.bgColor} ${riskLevel.textColor} font-bold`}>
          <span className="text-2xl">{riskLevel.emoji}</span>
          <span>{riskLevel.label}</span>
        </div>
      </div>
      
      {/* Herkunft */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <SourceIcon className={`w-5 h-5 text-${sourceInfo.color}-600`} />
            <span className="font-semibold text-gray-700">Herkunft</span>
          </div>
          <div className="text-lg font-bold text-gray-900">{sourceInfo.label}</div>
          <div className="text-sm text-gray-500">{sourceInfo.description}</div>
        </div>
        
        {/* Kooperationsvertrag */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-5 h-5 text-indigo-600" />
            <span className="font-semibold text-gray-700">Kooperationsvertrag</span>
          </div>
          <div className="text-lg font-bold text-gray-900">
            {coopPresent === 'yes' ? '✅ Vorhanden' : coopPresent === 'unknown' ? '❓ Unklar' : '❌ Nicht vorhanden'}
          </div>
          <div className="text-sm text-gray-500">
            {coopPresent === 'yes' 
              ? 'Vertrag überschreibt öffentliche Policies' 
              : 'Stufe 2 prüft alle Rechtefragen'}
          </div>
        </div>
      </div>
      
      {/* Komponenten */}
      <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-3">
          <FileQuestion className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold text-gray-700">Komponenten im Datensatz</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {components.length > 0 ? components.map(comp => {
            const info = COMPONENT_INFO[comp] || { label: comp, risk: 'medium' };
            const isDerivative = ['COMPENDIUM_TEXT', 'QA_PAIRS', 'INDEX', 'MODEL_WEIGHTS'].includes(comp);
            return (
              <span 
                key={comp}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isDerivative 
                    ? 'bg-purple-100 text-purple-700' 
                    : info.risk === 'low' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {info.label}
              </span>
            );
          }) : (
            <span className="text-gray-500 italic">Keine Komponenten ausgewählt</span>
          )}
        </div>
      </div>
      
      {/* PII-Status */}
      {piiStatus !== 'none' && (
        <div className={`rounded-lg p-4 ${piiStatus === 'high' ? 'bg-red-100' : 'bg-yellow-100'}`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-5 h-5 ${piiStatus === 'high' ? 'text-red-600' : 'text-yellow-600'}`} />
            <span className={`font-semibold ${piiStatus === 'high' ? 'text-red-700' : 'text-yellow-700'}`}>
              {piiStatus === 'high' ? '⚠️ Hohes PII-Risiko – Quarantäne erforderlich!' : '⚠️ PII möglich – Prüfung empfohlen'}
            </span>
          </div>
        </div>
      )}
      
      {/* Risiko-Beschreibung */}
      <div className={`mt-4 p-3 rounded-lg ${riskLevel.bgColor} border ${riskLevel.borderColor}`}>
        <p className={`text-sm ${riskLevel.textColor}`}>
          <strong>Einschätzung:</strong> {riskLevel.description}
          {overallRisk === 'blocked' && ' – Keine weitere Verarbeitung möglich.'}
          {overallRisk === 'high' && ' – Sorgfältige Prüfung in Stufe 2 erforderlich.'}
          {overallRisk === 'medium' && ' – Standardprüfung in Stufe 2 durchführen.'}
          {overallRisk === 'low' && ' – Schnelle Prüfung in Stufe 2 möglich.'}
          {overallRisk === 'unclear' && ' – Herkunft muss zuerst geklärt werden.'}
        </p>
      </div>
    </div>
  );
}
