import React from 'react';
import { UserProfile } from '../types';
import { Flame, Trophy, BookOpen, Activity, ArrowRight, Zap } from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  onNavigate: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
            <p className="text-indigo-100 mb-6 max-w-lg">
                You're on a roll! Keep up your {user.streak}-day streak and you'll reach the next level soon.
            </p>
            <button 
                onClick={() => onNavigate('quiz-setup')}
                className="bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:bg-indigo-50 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
                <Zap className="w-5 h-5" />
                Start Daily Quiz
            </button>
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-white opacity-10 rounded-full mb-8"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
            <div className="bg-orange-100 p-2 rounded-full text-orange-600 mb-2">
                <Flame className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{user.streak}</span>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Day Streak</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
            <div className="bg-yellow-100 p-2 rounded-full text-yellow-600 mb-2">
                <Trophy className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{user.points}</span>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Total Points</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
            <div className="bg-blue-100 p-2 rounded-full text-blue-600 mb-2">
                <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{user.level}</span>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Current Level</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
            <div className="bg-green-100 p-2 rounded-full text-green-600 mb-2">
                <Activity className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-slate-900">85%</span>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Avg Accuracy</span>
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">Recent Groups</h3>
                <button onClick={() => onNavigate('social')} className="text-indigo-600 text-sm font-medium hover:underline">View All</button>
            </div>
            <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer" onClick={() => onNavigate('social')}>
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">BS</div>
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-slate-900">Biology Squad</h4>
                        <p className="text-xs text-slate-500">2 new messages</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                </div>
                 <div className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer" onClick={() => onNavigate('social')}>
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">CC</div>
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-slate-900">Calculus Club</h4>
                        <p className="text-xs text-slate-500">Active now</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                </div>
            </div>
         </div>

         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4">AI Study Recommendations</h3>
            <div className="space-y-3">
                <div className="p-3 border border-indigo-100 bg-indigo-50 rounded-xl">
                    <p className="text-sm text-indigo-900 font-medium mb-1">Physics: Thermodynamics</p>
                    <p className="text-xs text-indigo-700">Your accuracy dropped to 65% here. Review the 2nd law?</p>
                </div>
                <div className="p-3 border border-slate-100 bg-white hover:bg-slate-50 rounded-xl cursor-pointer transition-colors" onClick={() => onNavigate('ai-chat')}>
                    <p className="text-sm text-slate-800 font-medium flex items-center gap-2">
                        <Zap className="w-3 h-3 text-amber-500" />
                        Ask AI Tutor a question
                    </p>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
