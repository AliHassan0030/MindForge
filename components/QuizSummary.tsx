import React from 'react';
import { QuizData, UserAnswer } from '../types';
import { CheckCircle2, XCircle, RotateCcw, Home, Award, TrendingUp } from 'lucide-react';

interface QuizSummaryProps {
  quiz: QuizData;
  answers: UserAnswer[];
  onRetry: () => void;
  onHome: () => void;
}

const QuizSummary: React.FC<QuizSummaryProps> = ({ quiz, answers, onRetry, onHome }) => {
  const correctCount = answers.filter(a => a.isCorrect).length;
  const totalCount = quiz.questions.length;
  const scorePercentage = Math.round((correctCount / totalCount) * 100);

  let message = "";
  let colorClass = "";
  
  if (scorePercentage >= 90) {
    message = "Outstanding! You've mastered this.";
    colorClass = "text-green-600 bg-green-50";
  } else if (scorePercentage >= 70) {
    message = "Great job! You're well on your way.";
    colorClass = "text-blue-600 bg-blue-50";
  } else if (scorePercentage >= 50) {
    message = "Good effort. Review the weak spots!";
    colorClass = "text-amber-600 bg-amber-50";
  } else {
    message = "Keep practicing. Learning takes time!";
    colorClass = "text-red-600 bg-red-50";
  }

  return (
    <div className="max-w-4xl mx-auto w-full pb-12">
      {/* Score Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        <div className="p-8 text-center border-b border-slate-100">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm mb-4 ${colorClass}`}>
            <Award className="w-4 h-4" />
            {message}
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{quiz.title}</h1>
          <p className="text-slate-500 mb-8">Quiz Completed</p>

          <div className="flex justify-center items-center gap-12">
            <div className="text-center">
              <div className="text-5xl font-black text-slate-900 mb-1">{scorePercentage}%</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Final Score</div>
            </div>
            <div className="h-16 w-px bg-slate-200"></div>
            <div className="text-center">
              <div className="text-5xl font-black text-slate-900 mb-1">{correctCount}<span className="text-2xl text-slate-400">/{totalCount}</span></div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Correct Answers</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 flex justify-center gap-4">
          <button 
            onClick={onRetry}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm"
          >
            <RotateCcw className="w-5 h-5" />
            Try Another Quiz
          </button>
          <button 
            onClick={onHome}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
          >
            <Home className="w-5 h-5" />
            Return Home
          </button>
        </div>
      </div>

      {/* Detailed Review */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 px-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Performance Review
        </h3>
        
        {quiz.questions.map((question, index) => {
          const userAnswer = answers.find(a => a.questionId === question.id);
          const isCorrect = userAnswer?.isCorrect;
          
          return (
            <div key={question.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Question {index + 1}</span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{question.topicTag}</span>
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">{question.text}</h4>
                    
                    <div className="space-y-2 mb-4">
                      {question.options.map((opt, i) => {
                        const isSelected = userAnswer?.selectedOption === opt;
                        const isCorrectOption = question.correctAnswer === opt;
                        
                        let style = "border-slate-100 text-slate-500 bg-slate-50";
                        if (isCorrectOption) style = "border-green-200 bg-green-50 text-green-800 font-medium";
                        else if (isSelected && !isCorrect) style = "border-red-200 bg-red-50 text-red-800 line-through decoration-red-400";

                        return (
                          <div key={i} className={`px-4 py-2 rounded-lg border text-sm ${style}`}>
                            {opt} {isCorrectOption && <span className="ml-2 text-xs font-bold uppercase">(Correct)</span>} {isSelected && !isCorrect && <span className="ml-2 text-xs font-bold uppercase">(Your Answer)</span>}
                          </div>
                        )
                      })}
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-600 leading-relaxed">
                      <span className="font-bold text-indigo-600 block mb-1">Explanation:</span>
                      {question.explanation}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizSummary;
