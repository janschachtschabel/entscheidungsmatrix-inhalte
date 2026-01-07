import React from 'react';
import { ChevronRight, ChevronLeft, Info } from 'lucide-react';

export default function QuestionCard({ 
  question, 
  options, 
  value, 
  onChange, 
  onNext, 
  onPrev, 
  canGoBack,
  canGoNext,
  hint,
  multiSelect = false
}) {
  const handleSelect = (optionValue) => {
    if (multiSelect) {
      const currentValues = value || [];
      if (currentValues.includes(optionValue)) {
        onChange(currentValues.filter(v => v !== optionValue));
      } else {
        onChange([...currentValues, optionValue]);
      }
    } else {
      onChange(optionValue);
    }
  };

  const isSelected = (optionValue) => {
    if (multiSelect) {
      return (value || []).includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{question}</h2>
      
      {hint && (
        <div className="flex items-start gap-2 mb-6 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{hint}</span>
        </div>
      )}

      <div className="space-y-3 mb-8">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
              isSelected(option.value)
                ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                isSelected(option.value)
                  ? 'border-indigo-500 bg-indigo-500'
                  : 'border-gray-300'
              }`}>
                {isSelected(option.value) && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <div>
                <div className="font-medium">{option.label}</div>
                {option.description && (
                  <div className="text-sm text-gray-500 mt-1">{option.description}</div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          disabled={!canGoBack}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            canGoBack
              ? 'text-gray-600 hover:bg-gray-100'
              : 'text-gray-300 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Zurück
        </button>
        
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
            canGoNext
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Weiter
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
