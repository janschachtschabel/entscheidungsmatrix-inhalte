import React, { useState, useMemo } from 'react';
import { Database, Shield, FileCheck, HelpCircle } from 'lucide-react';
import QuestionCard from './components/QuestionCard';
import ProgressBar from './components/ProgressBar';
import ResultMatrix from './components/ResultMatrix';
import { questions, stages } from './data/questions';
import { evaluateAll } from './logic/decisionEngine';

function IntroScreen({ onStart }) {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Database className="w-10 h-10 text-indigo-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Entscheidungsmatrix für Datennutzung
        </h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Dieses Tool hilft Ihnen, die zulässige Nutzung von Datenquellen und deren Komponenten 
          zu bestimmen. Beantworten Sie einige Fragen zu Herkunft, Rechten und Policies – 
          und erhalten Sie eine klare Übersicht der erlaubten Use-Cases.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-gray-50 rounded-xl">
            <Shield className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800">Stufe 1</h3>
            <p className="text-sm text-gray-600">Intake & Hygiene</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <FileCheck className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800">Stufe 2</h3>
            <p className="text-sm text-gray-600">Rechte & Policies</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <HelpCircle className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800">Stufe 3</h3>
            <p className="text-sm text-gray-600">Use-Case Auskunft</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-left">
          <h4 className="font-semibold text-amber-800 mb-2">Ampel-Legende</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl">🟢</span>
              <span className="text-amber-700"><strong>Zulässig</strong> – Standardmaßnahmen genügen</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🟡</span>
              <span className="text-amber-700"><strong>Bedingt zulässig</strong> – Nur mit Auflagen/Trennung</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🔴</span>
              <span className="text-amber-700"><strong>Unzulässig</strong> – Stopp/Quarantäne bis Klärung</span>
            </div>
          </div>
        </div>

        <button
          onClick={onStart}
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg"
        >
          Prüfung starten
        </button>
      </div>

      <p className="text-sm text-gray-500">
        Fail-safe Default: Bei Unklarheit FACTS-only oder Quarantäne (keine stille Freigabe)
      </p>
    </div>
  );
}

function TextInput({ question, value, onChange, onNext, onPrev, canGoBack, canGoNext }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{question.question}</h2>
      
      {question.hint && (
        <p className="text-gray-500 text-sm mb-6">{question.hint}</p>
      )}

      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder}
        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none mb-8"
      />

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          disabled={!canGoBack}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            canGoBack ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'
          }`}
        >
          Zurück
        </button>
        
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
            canGoNext ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Weiter
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({
    hasFacts: true,
    hasText: false,
    hasMedia: false,
    hasDerived: false
  });
  const [result, setResult] = useState(null);

  // Filter questions based on conditions
  const activeQuestions = useMemo(() => {
    return questions.filter(q => {
      if (!q.condition) return true;
      return q.condition(answers);
    });
  }, [answers]);

  const currentQuestion = activeQuestions[currentQuestionIndex];
  
  const currentStage = currentQuestion?.stage || 3;
  
  const stageProgress = stages.map(s => ({
    ...s,
    active: s.id === currentStage,
    completed: s.id < currentStage || result !== null
  }));

  const handleAnswer = (value) => {
    const questionId = currentQuestion.id;
    
    if (questionId === 'components') {
      // Handle component selection
      setAnswers(prev => ({
        ...prev,
        hasFacts: value.includes('FACTS'),
        hasText: value.includes('TEXT'),
        hasMedia: value.includes('MEDIA'),
        hasDerived: value.includes('DERIVED'),
        [questionId]: value
      }));
    } else if (questionId === 'piiHandling') {
      // Map PII handling to specific flags
      setAnswers(prev => ({
        ...prev,
        piiMinimized: value === 'minimized',
        piiAnon: value === 'anonymized',
        piiRestricted: value === 'restricted',
        [questionId]: value
      }));
    } else {
      setAnswers(prev => ({
        ...prev,
        [questionId]: value
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Evaluate and show results
      const evaluation = evaluateAll(answers);
      setResult(evaluation);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setStarted(false);
    setCurrentQuestionIndex(0);
    setAnswers({
      hasFacts: true,
      hasText: false,
      hasMedia: false,
      hasDerived: false
    });
    setResult(null);
  };

  const canGoNext = () => {
    if (!currentQuestion) return false;
    const value = answers[currentQuestion.id];
    if (currentQuestion.type === 'text') {
      return value && value.trim().length > 0;
    }
    if (currentQuestion.multiSelect) {
      return value && value.length > 0;
    }
    return value !== undefined && value !== null;
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
        <IntroScreen onStart={() => setStarted(true)} />
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
        <ResultMatrix result={result} onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <ProgressBar 
        currentStep={currentQuestionIndex + 1} 
        totalSteps={activeQuestions.length}
        stages={stageProgress}
      />

      {currentQuestion.type === 'text' ? (
        <TextInput
          question={currentQuestion}
          value={answers[currentQuestion.id]}
          onChange={handleAnswer}
          onNext={handleNext}
          onPrev={handlePrev}
          canGoBack={currentQuestionIndex > 0}
          canGoNext={canGoNext()}
        />
      ) : (
        <QuestionCard
          question={currentQuestion.question}
          hint={currentQuestion.hint}
          options={currentQuestion.options}
          value={answers[currentQuestion.id]}
          onChange={handleAnswer}
          onNext={handleNext}
          onPrev={handlePrev}
          canGoBack={currentQuestionIndex > 0}
          canGoNext={canGoNext()}
          multiSelect={currentQuestion.multiSelect}
        />
      )}
    </div>
  );
}
