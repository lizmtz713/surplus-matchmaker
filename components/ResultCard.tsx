import React, { useState } from 'react';
import { MatchResult } from '../types';
import { ConsultantChat } from './ConsultantChat';
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
  ArrowRight
} from 'lucide-react';

interface ResultCardProps {
  result: MatchResult;
  isProMode: boolean;
  onUnlock: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, isProMode, onUnlock }) => {
  const [activeTab, setActiveTab] = useState<'step1' | 'step2' | 'step3' | 'step4' | 'phone'>('step1');
  const [freightTab, setFreightTab] = useState<'email' | 'call'>('email');
  
  // Payment / Unlock State
  const [accessCode, setAccessCode] = useState('');
  const [codeError, setCodeError] = useState('');

  // LIVE STRIPE LINK
  const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/eVq4gydxd7KSbaF4Cg8AE00"; 
  
  // Valid Codes (Set these in your Stripe Success Page / Email)
  const VALID_CODES = ["PRO-BUYER-2025", "ADMIN-UNLOCK", "SURPLUS-VIP", "PRO2025"];

  const handleUnlockAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    // Normalize input: trim spaces and convert to uppercase
    const cleanCode = accessCode.trim().toUpperCase();
    
    if (VALID_CODES.includes(cleanCode)) {
      onUnlock();
      setCodeError('');
    } else {
      setCodeError('Invalid Access Code. Please check your payment confirmation.');
    }
  };

  const openStripe = () => {
    window.open(STRIPE_PAYMENT_LINK, '_blank');
  };

  const getEmailContent = () => {
    if (!result?.cadence) return null;
    
    switch (activeTab) {
      case 'step1': return result.cadence.step1_pitch;
      case 'step2': return result.cadence.step2_nudge;
      case 'step4': return result.cadence.step4_breakup;
      default: return null;
    }
  };

  const emailContent = getEmailContent();

  const handleCopy = () => {
    let content = "";
    if (activeTab === 'step3') {
      content = result?.cadence?.step3_sms || "";
    } else if (activeTab === 'phone') {
      if (result?.cadence?.phone_script) {
        const s = result.cadence.phone_script;
        content = `Opener: ${s.opener}\n\nPitch: ${s.pitch}\n\nHandling: ${s.objection_handling}\n\nClosing: ${s.closing}`;
      }
    } else {
       if (emailContent) {
         content = `${emailContent?.subject || ''}\n\n${emailContent?.body || ''}`;
       }
    }
    navigator.clipboard.writeText(content);
  };

  const handleCopyQuote = () => {
    if (freightTab === 'email') {
      if (result.logistics?.freightQuoteEmail) {
        const content = `${result.logistics.freightQuoteEmail.subject}\n\n${result.logistics.freightQuoteEmail.body}`;
        navigator.clipboard.writeText(content);
      }
    } else {
      if (result.logistics?.freightCallScript) {
        navigator.clipboard.writeText(result.logistics.freightCallScript);
      }
    }
  };

  const handleDraftEmail = () => {
    if (!result.logistics?.freightQuoteEmail) return;
    const { subject, body } = result.logistics.freightQuoteEmail;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* 1. Item Analysis & Valuation Header (ALWAYS FREE) */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-700 bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <div className="text-amber-500 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Phase 1: Market Valuation & Pricing Strategy
            </div>
            <div className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded border border-green-500/20 font-medium">
                Free Preview
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-6">
            {result?.itemAnalysis || "Analysis Pending"}
          </h2>
          
          {/* 3-Column Valuation Grid (TOTAL LOT) */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 text-center relative group">
               <div className="text-xs text-slate-400 mb-1 flex items-center justify-center gap-1 uppercase tracking-wide">
                 <Recycle className="w-3 h-3" /> Lot Scrap Floor
               </div>
               <div className="text-xl font-bold text-slate-300">{result?.valuation?.scrapValue || 'N/A'}</div>
            </div>

            <div className="bg-amber-500/10 p-4 rounded-lg border border-amber-500/30 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
               <div className="text-xs text-amber-500 mb-1 font-bold uppercase tracking-wide">Total Lot Surplus Value</div>
               <div className="text-2xl font-bold text-white">{result?.valuation?.surplusValue || 'N/A'}</div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 text-center">
               <div className="text-xs text-slate-400 mb-1 flex items-center justify-center gap-1 uppercase tracking-wide">
                 <Store className="w-3 h-3" /> Lot Retail Ceiling
               </div>
               <div className="text-xl font-bold text-slate-300">{result?.valuation?.retailValue || 'N/A'}</div>
            </div>
          </div>

          {/* NEW: Itemized Breakdown Table */}
          {result?.valuation?.lineItems && result.valuation.lineItems.length > 0 && (
             <div className="mb-6 bg-slate-800/80 rounded-lg border border-slate-700 overflow-hidden shadow-inner">
               <div className="px-4 py-2 bg-slate-700/50 border-b border-slate-700 flex items-center gap-2">
                 <ListChecks className="w-4 h-4 text-green-400" />
                 <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">Itemized Inventory Valuation</span>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-sm">
                   <thead>
                     <tr className="border-b border-slate-700 text-left bg-slate-800/50 text-xs uppercase text-slate-500">
                       <th className="px-4 py-3 font-bold w-[30%]">Item Name</th>
                       <th className="px-4 py-3 font-bold w-[15%]">Condition</th>
                       <th className="px-4 py-3 font-bold text-center w-[10%]">Qty</th>
                       <th className="px-4 py-3 font-bold text-right w-[15%]">Est. Retail</th>
                       <th className="px-4 py-3 font-bold text-right w-[15%]">Unit Value</th>
                       <th className="px-4 py-3 font-bold text-right w-[15%]">Total Surplus</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-700/50">
                     {result.valuation.lineItems.map((item, idx) => (
                       <tr key={idx} className="hover:bg-slate-700/20 transition-colors">
                         <td className="px-4 py-3 text-white font-medium">
                           {item.name}
                           {item.notes && <div className="text-[10px] text-slate-400 font-normal italic mt-0.5">{item.notes}</div>}
                         </td>
                         <td className="px-4 py-3 text-slate-300">{item.condition}</td>
                         <td className="px-4 py-3 text-slate-300 text-center">{item.qty}</td>
                         <td className="px-4 py-3 text-slate-400 text-right font-mono text-xs">{item.retailPrice}</td>
                         <td className="px-4 py-3 text-slate-200 text-right font-mono">{item.unitPrice}</td>
                         <td className="px-4 py-3 text-amber-400 font-bold text-right font-mono">{item.totalPrice}</td>
                       </tr>
                     ))}
                   </tbody>
                   <tfoot className="bg-slate-800 border-t-2 border-slate-700">
                     <tr>
                       <td colSpan={5} className="px-4 py-3 text-right font-bold text-slate-300 uppercase tracking-wider text-xs">
                         Grand Total (Surplus Value)
                       </td>
                       <td className="px-4 py-3 text-right font-bold text-amber-500 font-mono text-lg">
                         {result.valuation.surplusValue}
                       </td>
                     </tr>
                   </tfoot>
                 </table>
               </div>
             </div>
          )}

          {/* Visual Price Spectrum */}
          <div className="bg-slate-800/80 rounded-xl border border-slate-700 p-6 mb-6">
             <div className="flex items-end justify-between mb-2 text-sm">
                <div className="text-slate-500 font-medium">Lot Pricing Spectrum</div>
                <div className="text-amber-500 font-bold flex items-center gap-1">
                   Recommended Ask Range: {result?.valuation?.askRange?.min || 'N/A'} - {result?.valuation?.askRange?.max || 'N/A'}
                </div>
             </div>
             
             {/* The Bar */}
             <div className="h-4 w-full bg-slate-700 rounded-full relative overflow-hidden flex">
                {/* Scrap Section (Grey) */}
                <div className="h-full bg-slate-600 w-[20%] border-r border-slate-800" title="Scrap Value"></div>
                {/* Surplus Section (Amber Gradient) */}
                <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 w-[50%] border-r border-slate-800" title="Target Surplus Zone"></div>
                {/* Retail Section (Blue) */}
                <div className="h-full bg-blue-900/50 w-[30%]" title="Retail Ceiling"></div>
             </div>

             {/* Labels below bar */}
             <div className="flex justify-between mt-3 text-xs">
                <div className="text-center w-[20%]">
                   <div className="text-slate-400 font-bold flex justify-center items-center gap-1"><Recycle className="w-3 h-3"/> Scrap</div>
                </div>
                <div className="text-center w-[50%] -ml-4">
                   <div className="text-amber-500 font-bold flex justify-center items-center gap-1"><TrendingUp className="w-3 h-3"/> Market Value</div>
                </div>
                <div className="text-center w-[30%]">
                   <div className="text-blue-400 font-bold flex justify-center items-center gap-1"><Store className="w-3 h-3"/> Retail</div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Market Insights */}
             <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
               <div className="text-xs text-blue-400 font-bold uppercase mb-2 flex items-center gap-2">
                 <Info className="w-3 h-3" /> Market Intelligence
               </div>
               <p className="text-sm text-slate-300 leading-relaxed">
                 {result?.valuation?.marketInsights || "Analyzing market trends..."}
               </p>
             </div>

             {/* Scrap Details */}
             <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
               <div className="text-xs text-slate-500 font-bold uppercase mb-2 flex items-center gap-2">
                 <Gavel className="w-3 h-3" /> Scrap Calculation Basis
               </div>
               <p className="text-sm text-slate-400 font-mono">
                 {result?.valuation?.scrapDetails || "Calculating weight & rates..."}
               </p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        
        {/* PAYWALL OVERLAY - Only shows if NOT Pro Mode */}
        {!isProMode && (
           <div className="absolute inset-0 z-50 bg-slate-900/70 backdrop-blur-sm rounded-xl flex items-center justify-center p-6">
              <div className="bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center relative overflow-hidden">
                 <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 to-amber-300"></div>
                 
                 <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-amber-500" />
                 </div>
                 
                 <h3 className="text-xl font-bold text-white mb-2">Unlock Buyer Data</h3>
                 <p className="text-slate-400 text-sm mb-6">
                   We found <strong className="text-white">{result.topBuyers.length} Verified Buyers</strong> for this item. Get their phone numbers and the outreach scripts.
                 </p>
                 
                 {/* Step 1: Buy */}
                 <button 
                   onClick={openStripe}
                   className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold rounded-lg shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] mb-4"
                 >
                   <CreditCard className="w-5 h-5" />
                   Get Access Code - $9.99
                 </button>

                 {/* Step 2: Enter Code */}
                 <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                    <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 block text-left">
                       Have a code?
                    </label>
                    <form onSubmit={handleUnlockAttempt} className="flex gap-2">
                       <div className="relative flex-1">
                          <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                          <input 
                            type="text" 
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            placeholder="e.g. PRO-BUYER-2025"
                            className="w-full bg-slate-800 border border-slate-600 rounded-md py-2 pl-9 pr-3 text-sm text-white focus:border-amber-500 outline-none uppercase placeholder-slate-600"
                          />
                       </div>
                       <button 
                         type="submit"
                         className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-md transition-colors"
                       >
                         <ArrowRight className="w-4 h-4" />
                       </button>
                    </form>
                    {codeError && (
                       <p className="text-xs text-red-400 mt-2 text-left">{codeError}</p>
                    )}
                 </div>
                 
                 <div className="text-center mt-4">
                   <div className="flex items-center justify-center gap-1 text-[10px] text-green-500 font-medium opacity-80">
                      <Zap className="w-3 h-3" />
                      <span>Small price, huge ROI.</span>
                   </div>
                 </div>
              </div>
           </div>
        )}

        {/* 2. Buyer Matching (Blurred if Free) */}
        <div className={`bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl h-full flex flex-col ${!isProMode ? 'filter blur-sm opacity-50 pointer-events-none' : ''}`}>
          <div className="p-4 border-b border-slate-700 bg-slate-800/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
               <Users className="w-5 h-5 text-blue-400" />
               <h3 className="font-bold text-slate-200">Phase 2: Top 10 Web-Researched Matches</h3>
            </div>
            {isProMode && (
              <div className="text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                 Unlocked
              </div>
            )}
          </div>
          <div className="divide-y divide-slate-700/50 overflow-y-auto max-h-[600px] custom-scrollbar">
            {result?.topBuyers?.map((buyer, index) => (
              <div key={index} className="p-4 hover:bg-slate-700/20 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
                      {index + 1}
                    </div>
                    <span className="font-bold text-white">{buyer.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-12 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${buyer.score > 85 ? 'bg-green-500' : 'bg-blue-500'}`} 
                        style={{ width: `${buyer.score}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-300">{buyer.score}%</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-snug mb-3 pl-7 italic">{buyer.reason}</p>
                
                {/* Contact Details Section */}
                <div className="mt-2 pt-2 border-t border-slate-700/50 grid grid-cols-1 gap-1.5 text-xs pl-7">
                  {buyer.address && (
                    <div className="flex items-start gap-2 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                      {buyer.googleMapsUri ? (
                        <a 
                          href={buyer.googleMapsUri} 
                          target="_blank" 
                          rel="noreferrer"
                          className="hover:text-blue-400 hover:underline flex items-start gap-1"
                        >
                          {buyer.address}
                          <ExternalLink className="w-3 h-3 opacity-50" />
                        </a>
                      ) : (
                        <span>{buyer.address || 'Address not available'}</span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex gap-4">
                      {buyer.phone && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <a href={`tel:${buyer.phone}`} className="hover:text-blue-400">{buyer.phone}</a>
                        </div>
                      )}
                      
                      {buyer.email && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <a href={`mailto:${buyer.email}`} className="hover:text-blue-400">{buyer.email}</a>
                        </div>
                      )}
                  </div>

                  {buyer.website && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <a 
                        href={buyer.website.startsWith('http') ? buyer.website : `https://${buyer.website}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="hover:text-blue-400 truncate max-w-[200px]"
                      >
                        {buyer.website.replace(/^https?:\/\/(www\.)?/, '')}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {(!result?.topBuyers || result.topBuyers.length === 0) && (
              <div className="p-4 text-sm text-slate-500 text-center">No buyers matched.</div>
            )}
          </div>
        </div>

        {/* 3. Outreach Cadence (Blurred if Free) */}
        <div className={`bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl flex flex-col h-full ${!isProMode ? 'filter blur-sm opacity-50 pointer-events-none' : ''}`}>
          <div className="p-4 border-b border-slate-700 bg-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-200">Phase 3: Sales Cadence</h3>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-slate-700 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('step1')}
              className={`flex-1 min-w-[60px] py-3 text-xs font-medium text-center border-b-2 transition-colors ${activeTab === 'step1' ? 'border-amber-500 text-white bg-amber-500/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              Day 0
            </button>
            <button 
              onClick={() => setActiveTab('step2')}
              className={`flex-1 min-w-[60px] py-3 text-xs font-medium text-center border-b-2 transition-colors ${activeTab === 'step2' ? 'border-amber-500 text-white bg-amber-500/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              Day 3
            </button>
            <button 
              onClick={() => setActiveTab('step3')}
              className={`flex-1 min-w-[60px] py-3 text-xs font-medium text-center border-b-2 transition-colors ${activeTab === 'step3' ? 'border-amber-500 text-white bg-amber-500/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              SMS
            </button>
            <button 
              onClick={() => setActiveTab('step4')}
              className={`flex-1 min-w-[60px] py-3 text-xs font-medium text-center border-b-2 transition-colors ${activeTab === 'step4' ? 'border-amber-500 text-white bg-amber-500/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              Close
            </button>
            <button 
              onClick={() => setActiveTab('phone')}
              className={`flex-1 min-w-[60px] py-3 text-xs font-medium text-center border-b-2 transition-colors flex items-center justify-center gap-1 ${activeTab === 'phone' ? 'border-amber-500 text-white bg-amber-500/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              <PhoneCall className="w-3 h-3" /> Call
            </button>
          </div>

          {/* Content */}
          <div className="p-5 flex-1 bg-slate-900/30 font-mono text-sm relative group min-h-[200px]">
            <button 
              onClick={handleCopy}
              className="absolute top-2 right-2 p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>

            {activeTab === 'step3' ? (
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 max-w-xs mx-auto mt-4">
                 <div className="flex items-center gap-2 mb-2 text-xs text-slate-400">
                    <MessageSquare className="w-3 h-3" /> SMS Preview
                 </div>
                 <p className="text-white whitespace-pre-wrap">{result?.cadence?.step3_sms || 'No SMS content generated.'}</p>
              </div>
            ) : activeTab === 'phone' ? (
               <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                 <div className="bg-slate-800/50 p-3 rounded border border-slate-700/50">
                    <span className="text-slate-500 text-xs uppercase font-bold block mb-1">Opener</span>
                    <p className="text-slate-300">{result?.cadence?.phone_script?.opener || "Loading..."}</p>
                 </div>
                 <div className="bg-amber-500/10 p-3 rounded border border-amber-500/20">
                    <span className="text-amber-500 text-xs uppercase font-bold block mb-1">The Pitch</span>
                    <p className="text-white font-medium">{result?.cadence?.phone_script?.pitch || "Loading..."}</p>
                 </div>
                 <div className="bg-slate-800/50 p-3 rounded border border-slate-700/50">
                    <span className="text-slate-500 text-xs uppercase font-bold block mb-1">Objection Handling</span>
                    <p className="text-slate-300 italic">"{result?.cadence?.phone_script?.objection_handling || "Loading..."}"</p>
                 </div>
                 <div className="bg-slate-800/50 p-3 rounded border border-slate-700/50">
                    <span className="text-slate-500 text-xs uppercase font-bold block mb-1">The Close</span>
                    <p className="text-slate-300">{result?.cadence?.phone_script?.closing || "Loading..."}</p>
                 </div>
               </div>
            ) : (
              <div className="space-y-4">
                <div className="border-b border-slate-700/50 pb-2">
                  <span className="text-slate-500">Subject: </span>
                  <span className="text-white">{emailContent?.subject ? emailContent.subject : <span className="text-slate-600 italic">No subject generated</span>}</span>
                </div>
                <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">{emailContent?.body ? emailContent.body : <span className="text-slate-600 italic">No content generated for this step.</span>}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Logistics & Freight (Updated) */}
      {result?.logistics && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-700 bg-slate-800/80 flex items-center gap-2">
            <Truck className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-slate-200">Phase 4: Logistics & Freight Estimator</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
             {/* Detected Specs (Phase 0) */}
             {result.logistics.detectedSpecs && (
               <div className="md:col-span-3 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-amber-500" />
                    <span className="text-slate-400">AI-Researched Specs:</span>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-slate-800 px-3 py-1 rounded border border-slate-700">
                      <span className="text-slate-500 text-xs uppercase mr-2">Weight</span>
                      <span className="text-white font-mono">{result.logistics.detectedSpecs.weight}</span>
                    </div>
                    <div className="bg-slate-800 px-3 py-1 rounded border border-slate-700">
                      <span className="text-slate-500 text-xs uppercase mr-2">Dims</span>
                      <span className="text-white font-mono">{result.logistics.detectedSpecs.dimensions}</span>
                    </div>
                  </div>
               </div>
             )}

             {/* Cost Estimate */}
             <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 flex flex-col justify-center items-center text-center">
                <div className="bg-indigo-500/20 p-3 rounded-full mb-3">
                   <Scale className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="text-xs text-indigo-300 uppercase font-bold tracking-wide mb-1">Estimated Shipping</div>
                <div className="text-xl font-bold text-white mb-2">{result.logistics.estimatedRange || "Pending..."}</div>
                <div className="text-xs text-slate-400 bg-slate-900/50 px-2 py-1 rounded">
                   Rec: {result.logistics.transportType || "Standard"}
                </div>
             </div>

             {/* Questions Checklist */}
             <div className="md:col-span-1">
                <div className="flex items-center gap-2 mb-3 text-slate-300 font-medium">
                   <ClipboardList className="w-4 h-4 text-slate-500" />
                   <span>Critical Logistics Questions</span>
                </div>
                <ul className="space-y-2">
                   {(result.logistics.criticalQuestions || []).map((q, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                         <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div>
                         {q}
                      </li>
                   ))}
                   {(!result.logistics.criticalQuestions || result.logistics.criticalQuestions.length === 0) && (
                      <li className="text-sm text-slate-500 italic">No specific questions generated.</li>
                   )}
                </ul>
             </div>

             {/* Advice */}
             <div className="md:col-span-1">
                <div className="flex items-center gap-2 mb-3 text-slate-300 font-medium">
                   <Container className="w-4 h-4 text-slate-500" />
                   <span>Handling Advice</span>
                </div>
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 text-sm text-slate-400 leading-relaxed italic">
                   "{result.logistics.advice || "No specific advice provided."}"
                </div>
             </div>

             {/* Action: Freight Quotes & Brokers (New) */}
             <div className="md:col-span-3 border-t border-slate-700/50 pt-6 mt-2">
               <h4 className="text-indigo-400 font-bold mb-4 flex items-center gap-2">
                 <Send className="w-4 h-4" />
                 Action: Request Live Freight Quotes
               </h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 
                 {/* Left: Recommended Brokers */}
                 <div>
                    <h5 className="text-sm font-semibold text-slate-300 mb-3">Top 5 Recommended Freight Brokers</h5>
                    <div className="space-y-3">
                       {(result.logistics.topFreightBrokers || []).map((broker, i) => (
                          <div key={i} className="bg-slate-900/40 p-3 rounded border border-slate-700/50 flex flex-col gap-1">
                             <div className="flex justify-between items-start">
                                <span className="font-bold text-white text-sm">{broker.name}</span>
                                <span className="text-xs text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">{broker.location}</span>
                             </div>
                             <div className="text-xs text-slate-400 mt-1">
                                <span className="text-indigo-400">Contact: </span>{broker.contact}
                             </div>
                             {broker.website && (
                               <a href={broker.website} target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-indigo-400 truncate mt-0.5 block">
                                  {broker.website}
                               </a>
                             )}
                          </div>
                       ))}
                       {(!result.logistics.topFreightBrokers || result.logistics.topFreightBrokers.length === 0) && (
                         <div className="text-sm text-slate-500 italic">No brokers found.</div>
                       )}
                    </div>
                 </div>

                 {/* Right: Quote Template */}
                 <div>
                    <div className="flex items-center justify-between mb-2">
                       <h5 className="text-sm font-semibold text-slate-300">Quote Request</h5>
                       <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                          <button 
                             onClick={() => setFreightTab('email')}
                             className={`px-3 py-1 text-xs font-medium rounded transition-colors ${freightTab === 'email' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                          >
                            Email Draft
                          </button>
                          <button 
                             onClick={() => setFreightTab('call')}
                             className={`px-3 py-1 text-xs font-medium rounded transition-colors ${freightTab === 'call' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                          >
                            Phone Script
                          </button>
                       </div>
                       <div className="flex gap-2">
                           {freightTab === 'email' && (
                            <button 
                              onClick={handleDraftEmail}
                              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                              title="Open in default mail app"
                            >
                              <Mail className="w-3 h-3" /> Draft
                            </button>
                           )}
                           <button 
                             onClick={handleCopyQuote} 
                             className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                           >
                             <Copy className="w-3 h-3" /> Copy
                           </button>
                       </div>
                    </div>
                    
                    {freightTab === 'email' ? (
                        result.logistics.freightQuoteEmail ? (
                           <div className="bg-slate-900 border border-slate-700 p-3 rounded font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap h-[300px] overflow-y-auto custom-scrollbar group relative">
                              <div className="mb-2 pb-2 border-b border-slate-800">
                                 <span className="text-slate-500">Subject:</span> {result.logistics.freightQuoteEmail.subject}
                              </div>
                              {result.logistics.freightQuoteEmail.body}
                           </div>
                        ) : (
                           <div className="bg-slate-900 border border-slate-700 p-8 rounded text-center text-slate-500 text-sm h-[300px] flex items-center justify-center">
                              Email template pending...
                           </div>
                        )
                    ) : (
                        <div className="bg-slate-900 border border-slate-700 p-4 rounded h-[300px] overflow-y-auto custom-scrollbar">
                           <div className="flex items-center gap-2 mb-3 text-indigo-400 text-xs font-bold uppercase tracking-wide">
                              <PhoneCall className="w-3 h-3" /> Broker Call Script
                           </div>
                           <p className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                              {result.logistics.freightCallScript || "Script pending..."}
                           </p>
                           <p className="text-xs text-slate-500 mt-4 italic border-t border-slate-800 pt-2">
                              Tip: Be ready to provide specific dates and zip codes immediately.
                           </p>
                        </div>
                    )}
                 </div>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* NEW: Ask SurplusAI Consultant Chat */}
      <ConsultantChat result={result} />
      
      {/* Summary Footer */}
      <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
        <div>
           <p className="text-sm font-semibold text-white">Execution Summary</p>
           <p className="text-sm text-slate-400">{result?.summary || "Analysis complete."}</p>
        </div>
      </div>
    </div>
  );
};