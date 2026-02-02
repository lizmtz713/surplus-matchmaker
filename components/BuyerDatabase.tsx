import React, { useState, useMemo } from 'react';
import { Database, Plus, Pencil, Trash2, X, Save, Search, Star, ChevronDown, ChevronUp, CheckCircle2, Crown, MapPin, Phone, Mail, Globe, UserPlus, Lock } from 'lucide-react';
import { Buyer, BuyerMatch } from '../types.ts';

interface BuyerDatabaseProps {
  buyers: Buyer[];
  onUpdateBuyers: (buyers: Buyer[]) => void;
  matchedBuyers?: BuyerMatch[];
  isProMode: boolean;
}

export const BuyerDatabase: React.FC<BuyerDatabaseProps> = ({ buyers, onUpdateBuyers, matchedBuyers, isProMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const handleJoinRequest = () => {
    const adminEmail = "lizmtz713@gmail.com"; 
    const subject = "Application: Add Company to Surplus Matchmaker Network";
    const body = `Company Details:\nName:\nLocation:\nWhat we buy:`;
    window.open(`mailto:${adminEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const enrichedBuyers = useMemo(() => {
    return buyers.map(b => {
      const match = matchedBuyers?.find(m => m.name.toLowerCase().includes(b.name.toLowerCase()));
      return { ...b, isMatch: !!match, matchScore: match?.score || 0 };
    }).sort((a, b) => (b.isMatch ? 1 : 0) - (a.isMatch ? 1 : 0) || b.matchScore - a.matchScore);
  }, [buyers, matchedBuyers]);

  const displayList = searchQuery 
    ? enrichedBuyers.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : showAll ? enrichedBuyers : enrichedBuyers.slice(0, 5);

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 flex flex-col shadow-lg">
      <div className="p-4 bg-slate-900/50 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-slate-500" />
          <h3 className="font-bold text-slate-200 text-xs uppercase tracking-widest">Buyer Database</h3>
        </div>
        <button onClick={handleJoinRequest} className="text-[10px] font-bold bg-slate-700 px-2 py-1 rounded border border-slate-600 text-slate-300">JOIN LIST</button>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
          <input type="text" placeholder="Search buyers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500" />
        </div>

        <div className="space-y-3">
          {displayList.map(buyer => (
            <div key={buyer.id} className={`p-3 rounded-lg border transition-all ${buyer.isMatch ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-900/40 border-slate-700/50'}`}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs text-white truncate pr-2">{buyer.name}</span>
                {buyer.isMatch && <span className="text-[10px] font-black text-amber-500">{buyer.matchScore}%</span>}
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1 mb-2"><MapPin className="w-3 h-3 text-slate-600" /> {buyer.location}</div>
              
              <div className="mt-2 pt-2 border-t border-slate-700/50">
                {isProMode ? (
                  <div className="text-[10px] text-slate-400 italic truncate">{buyer.contact || 'Direct contact enabled'}</div>
                ) : (
                  <div className="flex items-center justify-between opacity-30 grayscale blur-[2px] select-none">
                    <span className="text-[10px] text-slate-500">Contact Blurred</span>
                    <Lock className="w-2.5 h-2.5 text-slate-600" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => setShowAll(!showAll)} className="w-full py-2 text-[10px] text-slate-500 uppercase font-black hover:text-slate-300 border border-dashed border-slate-700 rounded-lg">
          {showAll ? 'Show Less' : `View All ${buyers.length} Buyers`}
        </button>
      </div>
    </div>
  );
};