import React from 'react';
import { BarChart3, TrendingUp, Clock, Target } from 'lucide-react';
import { MOCK_ANALYTICS, MOCK_USER } from '../services/mockData';

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-2 text-indigo-600">
                <Target className="w-5 h-5" />
                <h3 className="font-semibold text-slate-700">Overall Accuracy</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">78.5%</p>
            <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +12% this month
            </p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex items-center gap-3 mb-2 text-violet-600">
                <Clock className="w-5 h-5" />
                <h3 className="font-semibold text-slate-700">Study Time</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">12.5h</p>
            <p className="text-sm text-slate-500 mt-1">Total this week</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex items-center gap-3 mb-2 text-amber-600">
                <BarChart3 className="w-5 h-5" />
                <h3 className="font-semibold text-slate-700">Quizzes Taken</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">42</p>
            <p className="text-sm text-slate-500 mt-1">Top 10% of users</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Subject Performance</h3>
        <div className="space-y-6">
            {MOCK_ANALYTICS.map((item) => (
                <div key={item.subject}>
                    <div className="flex justify-between text-sm font-medium mb-2">
                        <span className="text-slate-700">{item.subject}</span>
                        <span className="text-slate-500">{item.score}% Accuracy</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                                item.score >= 90 ? 'bg-green-500' :
                                item.score >= 70 ? 'bg-blue-500' :
                                item.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${item.score}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
