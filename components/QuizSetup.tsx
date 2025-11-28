import React, { useState } from 'react';
import { Difficulty, QuizConfigState, QuizMode } from '../types';
import { BookOpen, Brain, Clock, Layers, Sparkles, Upload, FileText, X, Link as LinkIcon } from 'lucide-react';

interface QuizSetupProps {
  onStart: (config: QuizConfigState) => void;
  isGenerating: boolean;
}

const QuizSetup: React.FC<QuizSetupProps> = ({ onStart, isGenerating }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.INTERMEDIATE);
  const [count, setCount] = useState(5);
  const [mode, setMode] = useState<QuizMode>(QuizMode.PRACTICE);
  const [files, setFiles] = useState<File[]>([]);
  const [videoLink, setVideoLink] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onStart({ topic, difficulty, questionCount: count, mode, files, videoLink });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const difficultyColors = {
    [Difficulty.BEGINNER]: 'bg-green-100 text-green-700 border-green-200',
    [Difficulty.INTERMEDIATE]: 'bg-blue-100 text-blue-700 border-blue-200',
    [Difficulty.ADVANCED]: 'bg-purple-100 text-purple-700 border-purple-200',
    [Difficulty.EXPERT]: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6" />
            <h2 className="text-xl font-medium opacity-90">AI Tutor</h2>
          </div>
          <h1 className="text-3xl font-bold mb-4">Create Your Study Session</h1>
          <p className="text-indigo-100">
            Tell me what you want to learn, and I'll generate a custom quiz to test your knowledge and help you improve.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Topic Input */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              Subject or Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Photosynthesis, World War II, React Hooks, Derivatives"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-lg placeholder:text-slate-400"
              required
              disabled={isGenerating}
            />
          </div>

          {/* Reference Material Section */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
              <Upload className="w-4 h-4" />
              Reference Materials (Optional)
            </label>
            
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors relative group">
                <input 
                    type="file" 
                    multiple 
                    onChange={handleFileChange} 
                    disabled={isGenerating}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                />
                <div className="flex flex-col items-center gap-2 text-slate-500 group-hover:text-indigo-500 transition-colors">
                    <div className="bg-indigo-50 p-3 rounded-full">
                       <Upload className="w-6 h-6 text-indigo-500" />
                    </div>
                    <p className="font-medium text-slate-700">Click to upload slides, PDF, or docs</p>
                    <p className="text-xs text-slate-400">Supports PDF, PPTX, DOCX, TXT</p>
                </div>
            </div>

            {/* Uploaded Files List */}
            {files.length > 0 && (
                <div className="grid grid-cols-1 gap-2 mt-2">
                    {files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm group">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <FileText className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                                <span className="truncate font-medium text-slate-700">{file.name}</span>
                                <span className="text-xs text-slate-400">({(file.size / 1024).toFixed(0)} KB)</span>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => removeFile(idx)} 
                                disabled={isGenerating}
                                className="text-slate-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Video Link Input */}
            <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-4 w-4 text-slate-400" />
                </div>
                <input
                    type="text"
                    value={videoLink}
                    onChange={(e) => setVideoLink(e.target.value)}
                    placeholder="Paste YouTube or video link for context..."
                    disabled={isGenerating}
                    className="w-full pl-10 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Difficulty Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                <Brain className="w-4 h-4" />
                Difficulty Level
              </label>
              <div className="grid grid-cols-1 gap-2">
                {(Object.values(Difficulty) as Difficulty[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    disabled={isGenerating}
                    className={`px-4 py-2 rounded-lg text-left transition-all border ${
                      difficulty === level
                        ? difficultyColors[level] + ' ring-2 ring-offset-1 ring-offset-white'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
               {/* Question Count */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  <Layers className="w-4 h-4" />
                  Number of Questions: <span className="text-indigo-600 font-bold">{count}</span>
                </label>
                <input
                  type="range"
                  min="3"
                  max="20"
                  step="1"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  disabled={isGenerating}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>3</span>
                  <span>10</span>
                  <span>20</span>
                </div>
              </div>

               {/* Mode Selection */}
               <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  <Clock className="w-4 h-4" />
                  Study Mode
                </label>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setMode(QuizMode.PRACTICE)}
                    disabled={isGenerating}
                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all ${
                      mode === QuizMode.PRACTICE
                        ? 'bg-white text-indigo-700 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Practice
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode(QuizMode.EXAM)}
                    disabled={isGenerating}
                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all ${
                      mode === QuizMode.EXAM
                        ? 'bg-white text-indigo-700 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Exam
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {mode === QuizMode.PRACTICE
                    ? "Immediate feedback after each question."
                    : "Answers revealed at the end of the quiz."}
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating || !topic.trim()}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg text-white shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
              isGenerating || !topic.trim()
                ? 'bg-indigo-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-300'
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Content...
              </span>
            ) : (
              'Start Quiz'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuizSetup;