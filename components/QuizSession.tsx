import React, { useState } from 'react';
import { QuizData, UserAnswer, QuizMode } from '../types';
import { CheckCircle, XCircle, ArrowRight, HelpCircle, Check, X } from 'lucide-react';

interface QuizSessionProps {
  quiz: QuizData;
  mode: QuizMode;
  onComplete: (answers: UserAnswer[]) => void;
  onExit: () => void;
}

const QuizSession: React.FC<QuizSessionProps> = ({ quiz, mode, onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = quiz.questions[currentIndex];
  const isLastQuestion = currentIndex === quiz.questions.length - 1;

  // Determine if we should show the explanation immediately
  const isPracticeMode = mode === QuizMode.PRACTICE;

  const handleOptionSelect = (option: string) => {
    if (showFeedback) return; // Prevent changing answer after feedback in practice mode

    setSelectedOption(option);
    
    // In practice mode, selecting an option triggers "Submit" logic effectively immediately for that question
    // but usually we want a confirm step. Let's do select -> confirm.
  };

  const handleConfirmAnswer = () => {
    if (!selectedOption) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOption,
      isCorrect,
    };

    // Use functional update to ensure we have the latest state
    setAnswers(prev => [...prev, newAnswer]);

    if (isPracticeMode) {
      setShowFeedback(true);
    } else {
      // Exam mode: move to next immediately
      moveToNext();
    }
  };

  const moveToNext = () => {
    if (isLastQuestion) {
      // Since `answers` state update might be async, we need to pass the *complete* list including current
      // However, we just called setAnswers. 
      // Safe approach: reconstruct the full list for the callback
      const finalAnswers = [...answers];
       // If we are in exam mode, we just added the answer. 
       // If we are in practice mode, the answer was added before feedback shown.
       // Actually, for exam mode, `handleConfirmAnswer` calls this immediately. 
       // For practice mode, this is called by "Next Question" button.
      onComplete(finalAnswers);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    }
  };

  // Progress Bar calculation
  const progress = ((currentIndex) / quiz.questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Header / Progress */}
      <div className="mb-6 flex items-center justify-between">
         <button 
            onClick={onExit}
            className="text-slate-500 hover:text-slate-800 text-sm font-medium"
         >
            Exit Quiz
         </button>
         <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <span>Question {currentIndex + 1} of {quiz.questions.length}</span>
            <span className={`px-2 py-0.5 rounded text-xs border ${
                currentQuestion.difficulty === 'Easy' ? 'bg-green-100 text-green-700 border-green-200' :
                currentQuestion.difficulty === 'Medium' || currentQuestion.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                'bg-red-100 text-red-700 border-red-200'
            }`}>
                {currentQuestion.difficulty || 'General'}
            </span>
         </div>
      </div>

      <div className="w-full bg-slate-200 h-2 rounded-full mb-8 overflow-hidden">
        <div 
            className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2 leading-relaxed">
                {currentQuestion.text}
            </h2>
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-6">
                {currentQuestion.topicTag}
            </div>

            <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === option;
                    const isCorrect = option === currentQuestion.correctAnswer;
                    
                    // Style logic
                    let buttonStyle = "border-slate-200 hover:border-indigo-300 hover:bg-slate-50";
                    let icon = <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center text-xs font-bold text-slate-400">{(idx + 10).toString(36).toUpperCase()}</div>;

                    if (showFeedback) {
                        if (isCorrect) {
                            buttonStyle = "border-green-500 bg-green-50 ring-1 ring-green-500";
                            icon = <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"><Check className="w-4 h-4 text-white" /></div>;
                        } else if (isSelected && !isCorrect) {
                            buttonStyle = "border-red-500 bg-red-50 ring-1 ring-red-500";
                            icon = <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center"><X className="w-4 h-4 text-white" /></div>;
                        } else {
                            buttonStyle = "border-slate-100 opacity-60";
                        }
                    } else {
                        if (isSelected) {
                            buttonStyle = "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600 shadow-sm";
                            icon = <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">{(idx + 10).toString(36).toUpperCase()}</div>;
                        }
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleOptionSelect(option)}
                            disabled={showFeedback}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 group ${buttonStyle}`}
                        >
                            <div className="flex-shrink-0">
                                {icon}
                            </div>
                            <span className={`text-base font-medium ${isSelected || (showFeedback && isCorrect) ? 'text-slate-900' : 'text-slate-600'}`}>
                                {option}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Action Bar */}
        <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-end items-center gap-4">
            {!showFeedback && (
                <button
                    onClick={handleConfirmAnswer}
                    disabled={!selectedOption}
                    className={`px-8 py-3 rounded-xl font-bold text-white transition-all transform active:scale-95 ${
                        selectedOption 
                        ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200' 
                        : 'bg-slate-300 cursor-not-allowed'
                    }`}
                >
                    {isPracticeMode ? 'Check Answer' : (isLastQuestion ? 'Finish Quiz' : 'Next Question')}
                </button>
            )}

            {showFeedback && (
                <button
                    onClick={moveToNext}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform active:scale-95"
                >
                    {isLastQuestion ? 'View Results' : 'Next Question'}
                    <ArrowRight className="w-5 h-5" />
                </button>
            )}
        </div>
      </div>

      {/* Explanation Card (Practice Mode Only) */}
      {showFeedback && (
        <div className="mt-6 bg-white rounded-2xl shadow-lg border-l-4 border-indigo-500 p-6 animate-fade-in-up">
            <div className="flex items-start gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 flex-shrink-0">
                    <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Explanation</h3>
                    <p className="text-slate-600 leading-relaxed">
                        {currentQuestion.explanation}
                    </p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default QuizSession;
