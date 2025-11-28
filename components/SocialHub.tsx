import React, { useState } from 'react';
import { Users, MessageSquare, Plus, Search } from 'lucide-react';
import { MOCK_GROUPS, MOCK_GROUP_MESSAGES } from '../services/mockData';
import { ChatMessage } from '../types';

const SocialHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'groups' | 'friends'>('groups');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_GROUP_MESSAGES);
  const [chatInput, setChatInput] = useState('');

  const currentGroup = MOCK_GROUPS.find(g => g.id === selectedGroup);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if(!chatInput.trim()) return;
    
    const newMsg: ChatMessage = {
        id: Date.now().toString(),
        senderId: 'u1', // Current user
        senderName: 'Alex',
        text: chatInput,
        timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMsg]);
    setChatInput('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Sidebar List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
         <div className="p-4 border-b border-slate-100 flex gap-2">
             <button 
                onClick={() => setActiveTab('groups')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'groups' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
             >
                Study Groups
             </button>
             <button 
                onClick={() => setActiveTab('friends')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'friends' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
             >
                Friends
             </button>
         </div>

         <div className="p-4 border-b border-slate-100">
             <div className="relative">
                 <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                 <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
                 />
             </div>
         </div>

         <div className="flex-1 overflow-y-auto p-2">
            {activeTab === 'groups' && MOCK_GROUPS.map(group => (
                <div 
                    key={group.id}
                    onClick={() => setSelectedGroup(group.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-colors flex items-center gap-3 ${selectedGroup === group.id ? 'bg-indigo-50 border-indigo-100 border' : 'hover:bg-slate-50 border border-transparent'}`}
                >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                        {group.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <h4 className={`font-semibold text-sm ${selectedGroup === group.id ? 'text-indigo-900' : 'text-slate-700'}`}>{group.name}</h4>
                        <p className="text-xs text-slate-400">{group.memberCount} members • {group.category}</p>
                    </div>
                </div>
            ))}
            
            {activeTab === 'groups' && (
                <button className="w-full mt-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                    <Plus className="w-4 h-4" /> Create New Group
                </button>
            )}
         </div>
      </div>

      {/* Main Content / Chat */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
         {selectedGroup ? (
             <>
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold">
                            {currentGroup?.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">{currentGroup?.name}</h3>
                            <p className="text-xs text-slate-500">{currentGroup?.description}</p>
                        </div>
                    </div>
                    <div className="flex -space-x-2">
                         {[1,2,3].map(i => (
                             <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                         ))}
                         <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                             +{currentGroup ? currentGroup.memberCount - 3 : 0}
                         </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex gap-3 ${msg.senderId === 'u1' ? 'flex-row-reverse' : ''}`}>
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-500">
                                {msg.senderName[0]}
                            </div>
                            <div className={`max-w-[70%]`}>
                                <div className={`p-3 rounded-2xl text-sm ${
                                    msg.senderId === 'u1' 
                                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                                    : 'bg-slate-100 text-slate-800 rounded-tl-none'
                                }`}>
                                    {msg.text}
                                </div>
                                <p className={`text-[10px] mt-1 ${msg.senderId === 'u1' ? 'text-right text-slate-400' : 'text-slate-400'}`}>
                                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {msg.senderName}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={chatInput}
                            onChange={e => setChatInput(e.target.value)}
                            placeholder={`Message #${currentGroup?.name}...`}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                         <button type="submit" className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
                            <MessageSquare className="w-5 h-5" />
                         </button>
                    </div>
                </form>
             </>
         ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                 <Users className="w-16 h-16 mb-4 opacity-20" />
                 <p className="text-lg font-medium">Select a group to start chatting</p>
                 <p className="text-sm">Connect with peers, share notes, and study together.</p>
             </div>
         )}
      </div>
    </div>
  );
};

export default SocialHub;
