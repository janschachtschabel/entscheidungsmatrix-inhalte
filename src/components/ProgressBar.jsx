import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function ProgressBar({ currentStep, totalSteps, stages }) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between mb-2">
        {stages.map((stage, index) => (
          <div key={stage.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
              stage.completed
                ? 'bg-green-500 border-green-500 text-white'
                : stage.active
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white border-gray-300 text-gray-400'
            }`}>
              {stage.completed ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <span className="font-semibold">{index + 1}</span>
              )}
            </div>
            {index < stages.length - 1 && (
              <div className={`w-16 sm:w-24 h-1 mx-2 rounded ${
                stage.completed ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between text-xs sm:text-sm">
        {stages.map((stage) => (
          <div key={stage.id} className={`text-center ${
            stage.active ? 'text-indigo-600 font-medium' : 'text-gray-500'
          }`}>
            {stage.label}
          </div>
        ))}
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        Frage {currentStep} von {totalSteps}
      </div>
    </div>
  );
}
