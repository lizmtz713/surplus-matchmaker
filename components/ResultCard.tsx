import React, { useState } from 'react';
import { MatchResult } from '../types.ts';
import { ConsultantChat } from './ConsultantChat.tsx';
import { 
  CheckCircle2, 
  TrendingUp, 
  Recycle, 
  Tag, 
  Users, 
  Mail, 
  MessageSquare, 
  Copy,
  Truck,
  Scale,
  ClipboardList,
  Container,
  MapPin,
  Phone,
  Globe,
  ExternalLink,
  Search,
  Send,
  PhoneCall,
  Info,
  Gavel,
  Store,
  ListChecks,
  Lock,
  CreditCard,
  Zap,
  KeyRound,
  ArrowRight,
  ClipboardCopy,
  EyeOff,
  Eye,
  SearchCheck
} from 'lucide-react';

interface ResultCardProps {
  result: MatchResult;
  isProMode: boolean;
  onUnlock: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, isProMode, onUnlock }) => {
  const [activeTab, setActiveTab] = useState<'step1' | 'step2' | 'step3' | 'step4' | 'phone'>('step1');
  const [accessCode, setAccessCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [privacyMode, setPrivacyMode] = useState(false);

  const emailContent = 
    activeTab === 'step1' ? result.cadence.step1_pitch : 
    activeTab === 'step2' ? result.cadence.step2_nudge : 
    activeTab === 'step4' ? result.cadence.step4_breakup : undefined;

  const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/eVq4gydxd7KSbaF4Cg8AE00"; 
  const VALID_CODES = ["PRO-BUYER-2025", "ADMIN-UNLOCK", "SURPLUS-VIP", "PRO2025", "MATCH-2025", "7777", "9999"];

  const handleUnlockAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = accessCode.trim().toUpperCase();
    if (VALID_CODES.includes(cleanCode)) {
      onUnlock();
      setCodeError('');
      setAccessCode('');
    } else {
      setCodeError('Invalid Access Code.');
    }
  };

  const handleCopy = () => {
    let content = "";
    if (activeTab === 'step3') content = result?.cadence?.step3_sms || "";
    else if (activeTab === 'phone') {
      const s = result.cadence.phone_script;
      if (s) content = `Opener: ${s.opener}\n\nPitch: ${s.pitch}\n\nHandling: ${s.objection_handling}\n\nClosing: ${s.closing}`;
    } else {
       const email = emailContent;
       if (email) content = `${email.subject}\n\n${email.body}`;
    }
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-700 bg-slate-900">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div className="text-amber-500 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Phase 1: Valuation Strategy
            </div>
            <div className="flex items-center gap-2">
               <button onClick={() => setPrivacyMode(!privacyMode)} className="text-[10px] md:text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-600 text-slate-400">
                 {privacyMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                 {privacyMode ? "Show Prices" : "Hide Prices"}
               </button>
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-6">{result.itemAnalysis}</h2>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 text-center">
               <div className="text-[10px] text-slate-500 mb-1 uppercase tracking-widest font-bold">Lot Scrap Floor</div>
               <div className={`text-xl font-bold ${privacyMode ? 'blur-md opacity-50' : 'text-slate-300'}`}>{result.valuation.scrapValue}</div>
            </div>
            <div className="bg-amber-500/10 p-4 rounded-lg border border-amber-500/30 text-center relative">
               <div className="text-[10px] text-amber-500 mb-1 font-bold uppercase tracking-widest">Surplus Value</div>
               <div className={`text-2xl font-black ${privacyMode ? 'blur-md opacity-50' : 'text-white'}`}>{result.valuation.surplusValue}</div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 text-center">
               <div className="text-[10px] text-slate-500 mb-1 uppercase tracking-widest font-bold">Retail Ceiling</div>
               <div className={`text-xl font-bold ${privacyMode ? 'blur-md opacity-50' : 'text-slate-300'}`}>{result.valuation.retailValue}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
               <div className="text-[10px] text-blue-400 font-bold uppercase mb-2 flex items-center gap-2 tracking-widest"><Info className="w-3 h-3" /> Market Intelligence</div>
               <p className="text-sm text-slate-300 leading-relaxed">{result.valuation.marketInsights}</p>
             </div>
             <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
               <div className="text-[10px] text-slate-500 font-bold uppercase mb-2 flex items-center gap-2 tracking-widest"><Gavel className="w-3 h-3" /> Scrap Basis</div>
               <p className={`text-sm text-slate-400 font-mono ${privacyMode ? 'blur-sm opacity-50' : ''}`}>{result.valuation.scrapDetails}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl flex flex-col relative h-[600px]">
          <div className="p-4 border-b border-slate-700 bg-slate-800/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
               <Users className="w-5 h-5 text-blue-400" />
               <h3 className="font-bold text-slate-200">Phase 2: High-Intent Buyers</h3>
            </div>
          </div>
          
          <div className="divide-y divide-slate-700/50 overflow-y-auto custom-scrollbar flex-1">
            {result.researchSources && result.researchSources.length > 0 && (
              <div className="bg-slate-900/80 p-4 border-b border-slate-700/50">
                <div className="flex items-center gap-2 mb-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <SearchCheck className="w-3.5 h-3.5 text-blue-500" /> Grounding References
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.researchSources.map((url, idx) => (
                    <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 truncate max-w-[150px]">{new URL(url).hostname}</a>
                  ))}
                </div>
              </div>
            )}

            {result.topBuyers.map((buyer, index) => (
              <div key={index} className="p-4 hover:bg-slate-700/20 transition-colors group">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors">{index + 1}</div>
                    <span className="font-bold text-white text-sm">{buyer.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1.5 rounded">{buyer.score}% Match</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug mb-2 pl-7 italic">"{buyer.reason}"</p>
                
                <div className="mt-1 pt-2 border-t border-slate-700/50 pl-7">
                   {isProMode ? (
                      <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-300">
                        <div className="flex items-center gap-2"><MapPin className="w-3 h-3 text-slate-500" /> {buyer.address || buyer.location}</div>
                        <div className="flex gap-4">
                           {buyer.phone && <div className="flex items-center gap-2"><Phone className="w-3 h-3 text-slate-500" /> {buyer.phone}</div>}
                           {buyer.email && <div className="flex items-center gap-2"><Mail className="w-3 h-3 text-slate-500" /> {buyer.email}</div>}
                        </div>
                        {buyer.website && <div className="flex items-center gap-2"><Globe className="w-3 h-3 text-slate-500" /> {buyer.website}</div>}
                      </div>
                   ) : (
                      <div className="relative overflow-hidden opacity-40 grayscale blur-[3px]">
                         <div className="text-[10px] space-y-1">
                            <div className="flex gap-2 items-center"><MapPin className="w-3 h-3" /> Hidden Street Address</div>
                            <div className="flex gap-2 items-center"><Phone className="w-3 h-3" /> (•••) •••-••••</div>
                            <div className="flex gap-2 items-center"><Mail className="w-3 h-3" /> •••••@•••••.com</div>
                         </div>
                         <div className="absolute inset-0 flex items-center justify-start bg-slate-900/60 blur-none grayscale-0">
                            <span className="bg-slate-800 text-amber-500 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/20">LOCKED</span>
                         </div>
                      </div>
                   )}
                </div>
              </div>
            ))}
          </div>

          {!isProMode && (
            <div className="p-4 bg-slate-900/95 border-t border-slate-700">
               <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-xl border border-amber-500/30 text-center">
                  <h4 className="text-sm font-bold text-white mb-2">Unlock Decision Maker Data</h4>
                  <p className="text-[11px] text-slate-400 mb-4">Reveal direct phone lines and verified emails for these matches.</p>
                  <button onClick={() => window.open(STRIPE_PAYMENT_LINK, '_blank')} className="w-full py-2.5 bg-amber-500 text-slate-900 font-black rounded-lg text-xs mb-3 flex items-center justify-center gap-2">
                    <CreditCard className="w-4 h-4" /> PAY $9.99 TO UNLOCK
                  </button>
                  <form onSubmit={handleUnlockAttempt} className="flex gap-2 bg-slate-900 p-1.5 rounded-lg border border-slate-700">
                    <input type="text" value={accessCode} onChange={e => setAccessCode(e.target.value)} placeholder="ENTER ACCESS CODE" className="flex-1 bg-transparent border-none text-[10px] text-white focus:ring-0 uppercase font-mono tracking-widest" />
                    <button type="submit" className="text-[10px] bg-amber-500/20 text-amber-500 px-3 py-1 rounded font-bold border border-amber-500/20">OK</button>
                  </form>
                  {codeError && <p className="text-[10px] text-red-500 mt-2">{codeError}</p>}
               </div>
            </div>
          )}
        </div>

        <div className={`bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl flex flex-col h-[600px] transition-all duration-700 ${!isProMode ? 'filter blur-md opacity-30 select-none pointer-events-none' : ''}`}>
           <div className="p-4 bg-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-amber-500" /><h3 className="font-bold text-xs uppercase tracking-widest">Outreach Protocols</h3></div>
           </div>
           <div className="flex bg-slate-900/50 border-b border-slate-700">
              {['step1', 'step2', 'step3', 'step4', 'phone'].map(tab => (
                 <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-tighter transition-all ${activeTab === tab ? 'text-amber-500 bg-amber-500/10 border-b-2 border-amber-500' : 'text-slate-500'}`}>{tab}</button>
              ))}
           </div>
           <div className="p-6 flex-1 bg-slate-900/30 overflow-y-auto custom-scrollbar font-mono text-xs text-slate-300 leading-relaxed group relative">
              <button onClick={handleCopy} className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 rounded opacity-0 group-hover:opacity-100 transition-all border border-slate-600"><Copy className="w-4 h-4" /></button>
              {activeTab === 'phone' ? (
                 <div className="space-y-4">
                    <div className="bg-slate-800 p-3 rounded border border-slate-700"><span className="text-slate-500 block mb-1">OPENER</span> {result.cadence.phone_script?.opener}</div>
                    <div className="bg-amber-500/5 p-3 rounded border border-amber-500/20"><span className="text-amber-500 block mb-1">PITCH</span> {result.cadence.phone_script?.pitch}</div>
                 </div>
              ) : (
                 <div className="whitespace-pre-wrap">
                    <div className="mb-4 pb-4 border-b border-slate-800"><span className="text-slate-500">Subject:</span> {activeTab === 'step3' ? "SMS" : emailContent?.subject}</div>
                    {activeTab === 'step3' ? result.cadence.step3_sms : emailContent?.body}
                 </div>
              )}
           </div>
        </div>
      </div>

      <ConsultantChat result={result} />
    </div>
  );
};