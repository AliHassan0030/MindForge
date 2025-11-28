import React from 'react';
import { MOCK_LEADERBOARD } from '../services/mockData';
import { Trophy, Medal, ArrowUp, ArrowDown, Minus } from 'lucide-react';

const Leaderboard: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Global Leaderboard</h2>
            <p className="text-slate-500">See how you stack up against the best learners.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 grid grid-cols-12 gap-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <div className="col-span-2 text-center">Rank</div>
                <div className="col-span-6">User</div>
                <div className="col-span-2 text-right">Points</div>
                <div className="col-span-2 text-center">Trend</div>
            </div>

            <div className="divide-y divide-slate-100">
                {MOCK_LEADERBOARD.map((entry) => (
                    <div key={entry.rank} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors">
                        <div className="col-span-2 flex justify-center">
                            {entry.rank === 1 ? (
                                <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                                    <Trophy className="w-5 h-5" />
                                </div>
                            ) : entry.rank === 2 ? (
                                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                                    <Medal className="w-5 h-5" />
                                </div>
                            ) : entry.rank === 3 ? (
                                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                                    <Medal className="w-5 h-5" />
                                </div>
                            ) : (
                                <span className="text-slate-500 font-bold">#{entry.rank}</span>
                            )}
                        </div>
                        <div className="col-span-6 flex items-center gap-3">
                            <img src={entry.user.avatar} alt={entry.user.name} className="w-10 h-10 rounded-full border border-slate-200" />
                            <span className="font-semibold text-slate-800">{entry.user.name}</span>
                        </div>
                        <div className="col-span-2 text-right font-bold text-indigo-600">
                            {entry.points.toLocaleString()}
                        </div>
                        <div className="col-span-2 flex justify-center">
                            {entry.trend === 'up' && <ArrowUp className="w-4 h-4 text-green-500" />}
                            {entry.trend === 'down' && <ArrowDown className="w-4 h-4 text-red-500" />}
                            {entry.trend === 'same' && <Minus className="w-4 h-4 text-slate-300" />}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default Leaderboard;
