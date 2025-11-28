import React, { useState, useEffect } from 'react';
import { QuizConfigState, QuizData, UserAnswer, QuizMode, UserProfile } from './types';
import { generateQuiz } from './services/gemini';
import { processGoogleToken, saveSession, getSession, clearSession, loginWithEmail } from './services/authService';
import QuizSetup from './components/QuizSetup';
import QuizSession from './components/QuizSession';
import QuizSummary from './components/QuizSummary';
import Dashboard from './components/Dashboard';
import SocialHub from './components/SocialHub';
import Analytics from './components/Analytics';
import AIChat from './components/AIChat';
import Leaderboard from './components/Leaderboard';
import { GraduationCap, LayoutDashboard, MessageSquare, Users, BarChart2, Award, LogOut, Menu, X, AlertCircle, User, Settings, Mail, Lock, ArrowRight } from 'lucide-react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

enum ViewState {
  AUTH,
  DASHBOARD,
  QUIZ_SETUP,
  QUIZ_SESSION,
  QUIZ_SUMMARY,
  SOCIAL,
  ANALYTICS,
  AI_CHAT,
  LEADERBOARD
}

// Helper to convert File to base64 part for Gemini
const fileToPart = (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type || 'application/octet-stream', 
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

interface AppProps {
  googleAuthEnabled?: boolean;
}

const App: React.FC<AppProps> = ({ googleAuthEnabled = true }) => {
  const [view, setView] = useState<ViewState>(ViewState.AUTH);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // Quiz State
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [quizConfig, setQuizConfig] = useState<QuizConfigState | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [authError, setAuthError] = useState('');

  // Check for existing session on mount
  useEffect(() => {
    const session = getSession();
    if (session) {
      setCurrentUser(session);
      setView(ViewState.DASHBOARD);
    }
  }, []);

  // Authentication Handlers
  const handleGoogleLoginSuccess = (response: CredentialResponse) => {
    try {
      if (response.credential) {
        const { user, token } = processGoogleToken(response.credential);
        setCurrentUser(user);
        saveSession(user, token);
        setView(ViewState.DASHBOARD);
        setAuthError('');
      }
    } catch (err) {
      console.error("Login processing error:", err);
      setAuthError("Failed to process login credentials.");
    }
  };

  const handleGoogleLoginError = () => {
    setAuthError("Google Sign-In failed. Please try again.");
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError("Please fill in all fields.");
      return;
    }
    
    setAuthLoading(true);
    setAuthError('');

    try {
      // Login/Register and get JWT token
      const { user, token } = await loginWithEmail(email, password);
      setCurrentUser(user);
      saveSession(user, token);
      setView(ViewState.DASHBOARD);
    } catch (err) {
      setAuthError("Authentication failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guestUser: UserProfile = {
      id: 'guest_demo',
      name: 'Guest Student',
      email: 'guest@mindforge.ai',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest',
      level: 1,
      points: 0,
      streak: 0,
      badges: []
    };
    const mockToken = "guest.token.jwt";
    setCurrentUser(guestUser);
    saveSession(guestUser, mockToken);
    setView(ViewState.DASHBOARD);
    setAuthError('');
  };

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
    setView(ViewState.AUTH);
    setEmail('');
    setPassword('');
  };

  // Navigation Helper
  const navigateTo = (newView: ViewState) => {
    setView(newView);
    setIsSidebarOpen(false); // Close sidebar on mobile nav
    setErrorMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quiz Handlers
  const handleStartQuiz = async (config: QuizConfigState) => {
    setIsGenerating(true);
    setQuizConfig(config);
    setErrorMsg('');
    
    try {
      const fileParts = await Promise.all(config.files.map(fileToPart));
      const data = await generateQuiz(
        config.topic, 
        config.difficulty, 
        config.questionCount,
        fileParts,
        config.videoLink
      );
      setQuizData(data);
      navigateTo(ViewState.QUIZ_SESSION);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to generate quiz. Please check your inputs or try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuizComplete = (answers: UserAnswer[]) => {
    setUserAnswers(answers);
    navigateTo(ViewState.QUIZ_SUMMARY);
  };

  // --------------------------------------------------------------------------
  // Auth Screen
  // --------------------------------------------------------------------------
  if (view === ViewState.AUTH) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 p-4">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl max-w-md w-full">
          <div className="text-center mb-8">
            <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600 shadow-inner">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">MindForge AI</h1>
            <p className="text-slate-500">Master any subject with your personalized AI tutor.</p>
          </div>
          
          {authError && (
             <div className="mb-6 bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {authError}
             </div>
          )}

          {/* Google Login - Only show if configured */}
          {googleAuthEnabled && (
            <div className="flex justify-center w-full mb-6">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
                useOneTap={false}
                theme="outline"
                size="large"
                shape="rectangular"
                width="320"
                text="continue_with"
              />
            </div>
          )}

          {googleAuthEnabled && (
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with email</span>
              </div>
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full pl-10 px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full pl-10 px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
            >
              {authLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLoginMode ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center justify-between text-sm mb-6">
             <button 
                type="button"
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-indigo-600 font-medium hover:text-indigo-700 hover:underline"
             >
               {isLoginMode ? "Need an account? Sign up" : "Already have an account? Sign in"}
             </button>
          </div>

          <div className="relative mb-6">
             <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Testing?</span>
            </div>
          </div>

          <button
            onClick={handleGuestLogin}
            className="w-full py-2 px-4 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <User className="w-4 h-4" />
            Continue as Guest
          </button>
          
          <div className="mt-8 text-xs text-center text-slate-400">
            <p>By continuing, you agree to our Terms of Service.</p>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // Main Layout
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-auto`}>
        <div className="h-full flex flex-col">
          <div className="h-20 flex items-center px-6 border-b border-slate-100">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg mr-3">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">MindForge</span>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden ml-auto text-slate-400">
                <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <NavItem icon={<LayoutDashboard />} label="Dashboard" active={view === ViewState.DASHBOARD} onClick={() => navigateTo(ViewState.DASHBOARD)} />
            <NavItem icon={<MessageSquare />} label="AI Tutor" active={view === ViewState.AI_CHAT} onClick={() => navigateTo(ViewState.AI_CHAT)} />
            <NavItem icon={<Users />} label="Social Hub" active={view === ViewState.SOCIAL} onClick={() => navigateTo(ViewState.SOCIAL)} />
            <NavItem icon={<BarChart2 />} label="Analytics" active={view === ViewState.ANALYTICS} onClick={() => navigateTo(ViewState.ANALYTICS)} />
            <NavItem icon={<Award />} label="Leaderboard" active={view === ViewState.LEADERBOARD} onClick={() => navigateTo(ViewState.LEADERBOARD)} />
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 px-2 mb-4">
                <img src={currentUser?.avatar} className="w-10 h-10 rounded-full bg-slate-200 object-cover" alt="Avatar" referrerPolicy="no-referrer" />
                <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-800 truncate">{currentUser?.name}</p>
                    <p className="text-xs text-slate-500 truncate">Lvl {currentUser?.level} Scholar</p>
                </div>
            </div>
            <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
            >
                <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header (Mobile Trigger + Title) */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8 flex-shrink-0">
           <div className="flex items-center gap-3">
               <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-slate-500 hover:text-indigo-600">
                   <Menu className="w-6 h-6" />
               </button>
               <h2 className="text-xl font-bold text-slate-800">
                  {view === ViewState.DASHBOARD && 'Dashboard'}
                  {view === ViewState.AI_CHAT && 'AI Tutor Assistant'}
                  {view === ViewState.SOCIAL && 'Community & Groups'}
                  {view === ViewState.ANALYTICS && 'Performance Analytics'}
                  {view === ViewState.LEADERBOARD && 'Global Leaderboard'}
                  {view === ViewState.QUIZ_SETUP && 'Create Quiz'}
                  {view === ViewState.QUIZ_SESSION && quizData?.title}
                  {view === ViewState.QUIZ_SUMMARY && 'Quiz Results'}
               </h2>
           </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                {errorMsg && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3 animate-fade-in">
                        <span className="text-xl">⚠️</span>
                        <p>{errorMsg}</p>
                    </div>
                )}

                {view === ViewState.DASHBOARD && currentUser && (
                    <Dashboard user={currentUser} onNavigate={(v) => {
                        if(v === 'quiz-setup') navigateTo(ViewState.QUIZ_SETUP);
                        else if(v === 'social') navigateTo(ViewState.SOCIAL);
                        else if(v === 'ai-chat') navigateTo(ViewState.AI_CHAT);
                    }} />
                )}

                {view === ViewState.QUIZ_SETUP && (
                    <QuizSetup onStart={handleStartQuiz} isGenerating={isGenerating} />
                )}

                {view === ViewState.QUIZ_SESSION && quizData && quizConfig && (
                    <QuizSession 
                        quiz={quizData} 
                        mode={quizConfig.mode} 
                        onComplete={handleQuizComplete} 
                        onExit={() => navigateTo(ViewState.DASHBOARD)} 
                    />
                )}

                {view === ViewState.QUIZ_SUMMARY && quizData && (
                    <QuizSummary 
                        quiz={quizData} 
                        answers={userAnswers} 
                        onRetry={() => {
                            setQuizData(null);
                            navigateTo(ViewState.QUIZ_SETUP);
                        }} 
                        onHome={() => navigateTo(ViewState.DASHBOARD)} 
                    />
                )}

                {view === ViewState.SOCIAL && <SocialHub />}
                {view === ViewState.ANALYTICS && <Analytics />}
                {view === ViewState.LEADERBOARD && <Leaderboard />}
                {view === ViewState.AI_CHAT && <AIChat />}
            </div>
        </main>
      </div>
    </div>
  );
};

// Nav Item Helper
const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium ${
            active 
            ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
        }`}
    >
        <div className={active ? 'text-indigo-600' : 'text-slate-400'}>{icon}</div>
        <span>{label}</span>
    </button>
);

export default App;