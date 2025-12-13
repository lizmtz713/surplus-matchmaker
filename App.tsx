import React, { useState, useEffect } from 'react';
import { PackageSearch, Boxes, ArrowRight, Activity, CheckCircle2, Loader2, Search, BrainCircuit, PenTool, Lock, Unlock, Database, Map, AlertTriangle } from 'lucide-react';
import { BuyerDatabase } from './components/BuyerDatabase';
import { InputForm } from './components/InputForm';
import { ResultCard } from './components/ResultCard';
import { Logo } from './components/Logo';
import { matchItemToBuyer } from './services/geminiService';
import { MatchResult, Buyer } from './types';
import { BUYERS as INITIAL_BUYERS } from './constants';

const LOADING_STEPS = [
  { message: "Analyzing item specifications...", icon: PackageSearch, duration: 2000 },
  { message: "Conducting global market research (Search & Maps)...", icon: Search, duration: 4000 },
  { message: "Scoring internal buyer network...", icon: BrainCircuit, duration: 2500 },
  { message: "Drafting high-conversion outreach...", icon: PenTool, duration: 2000 }
];

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  
  // Persistence Logic for Buyers
  const [buyers, setBuyers] = useState<Buyer[]>(() => {
    try {
      const saved = localStorage.getItem('surplus_buyer_db');
      return saved ? JSON.parse(saved) : INITIAL_BUYERS;
    } catch (e) {
      console.warn("Failed to load buyers from storage", e);
      return INITIAL_BUYERS;
    }
  });

  // Check for API Key on mount
  useEffect(() => {
    const key = process.env.API_KEY;
    // Check if key is empty, undefined, or still has the default placeholder
    if (!key || key.includes("YOUR_ACTUAL_API_KEY") || key.includes("YOUR_REAL_KEY")) {
      setApiKeyMissing(true);
    }
  }, []);

  // Save buyers on change
  useEffect(() => {
    try {
      localStorage.setItem('surplus_buyer_db', JSON.stringify(buyers));
    } catch (e) {
      console.warn("Failed to save buyers to storage", e);
    }
  }, [buyers]);
  
  // New State for Paywall Simulation with Local Storage Persistence
  const [isProMode, setIsProMode] = useState(() => {
    try {
      // Check local storage on initial load
      const saved = localStorage.getItem('surplus_pro_mode');
      return saved === 'true';
    } catch (e) {
      // Fallback if localStorage is disabled (e.g. Incognito)
      return false;
    }
  });

  // Save to local storage whenever isProMode changes
  useEffect(() => {
    try {
      localStorage.setItem('surplus_pro_mode', isProMode.toString());
    } catch (e) {
      console.warn("Could not save to localStorage");
    }
  }, [isProMode]);

  useEffect(() => {
    if (!loading) {
      setLoadingStepIndex(0);
      return;
    }

    let currentStep = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const runSteps = () => {
      if (currentStep >= LOADING_STEPS.length - 1) return;
      
      const duration = LOADING_STEPS[currentStep].duration;
      timeoutId = setTimeout(() => {
        currentStep++;
        setLoadingStepIndex(currentStep);
        runSteps();
      }, duration);
    };

    runSteps();

    return () => clearTimeout(timeoutId);
  }, [loading]);

  const handleMatchRequest = async (
    description: string, 
    condition: string,
    imageFiles: File[], 
    logistics: { 
      origin: string; 
      weight: string; 
      dimensions: string;
      truckType: string;
      requiresTarps: boolean;
      requiresChains: boolean;
      requiresLiftgate: boolean;
      pickupDate: string;
      pickupContact: string;
      loadingHours: string;
    },
    referenceUrl: string
  ) => {
    if (apiKeyMissing) {
      setError("Cannot proceed: API Key is missing. Please configure your environment variables.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const matchData = await matchItemToBuyer(description, condition, imageFiles, buyers, logistics, referenceUrl);
      setResult(matchData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while analyzing the item.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetDb = () => {
    if (confirm("Are you sure you want to reset the buyer database to defaults? All custom entries will be lost.")) {
      setBuyers(INITIAL_BUYERS);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-8">
      {/* API Key Warning Banner */}
      {apiKeyMissing && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-3 text-center z-50 flex items-center justify-center gap-2 font-bold shadow-lg">
          <AlertTriangle className="w-5 h-5" />
          <span>SETUP REQUIRED: API Key Missing. Please add API_KEY to your .env file (Local) or Project Settings (Netlify).</span>
        </div>
      )}

      <header className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row items-center justify-between border-b border-slate-700 pb-6 gap-4 pt-6">
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 p-2 rounded-xl border border-slate-700 shadow-xl">
            <Logo className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Surplus<span className="text-amber-500">Matchmaker</span>
            </h1>
            <p className="text-slate-400 text-sm">Industrial Pocket Listing & Valuation Engine</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 justify-end">
           {/* DB Reset Tool */}
           <button 
             onClick={handleResetDb}
             className="text-xs text-slate-600 hover:text-red-400 transition-colors flex items-center gap-1"
             title="Reset Database to Defaults"
           >
             <Database className="w-3 h-3" /> Reset DB
           </button>

          {/* Admin Toggle for Demo Purposes */}
          <button 
             onClick={() => setIsProMode(!isProMode)}
             className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
               isProMode 
                ? 'bg-amber-500 text-slate-900 border-amber-500 shadow-lg shadow-amber-500/20' 
                : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-white'
             }`}
             title="Toggle Paywall Simulation (Admin Bypass)"
          >
             {isProMode ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
             {isProMode ? 'Admin: Pro Mode Active' : 'Admin: View as Free User'}
          </button>

          <div className="hidden md:flex items-center gap-2 text-sm text-amber-500 font-medium bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20">
            <Activity className="w-4 h-4" />
            <span>Gemini 2.5 + Search & Maps</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Context & Input */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <PackageSearch className="w-32 h-32 text-amber-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Boxes className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-semibold text-white">New Item Entry</h2>
              </div>
              <p className="text-slate-400 text-sm mb-6">
                Upload photos, describe a single item, or paste a <strong>full inventory list</strong>. SurplusMatchmaker will perform live valuation, identify top buyers, and generate your sales cadence.
              </p>
              <InputForm onSubmit={handleMatchRequest} isLoading={loading} />
            </div>
          </div>
          
          <BuyerDatabase 
            buyers={buyers} 
            onUpdateBuyers={setBuyers} 
            matchedBuyers={result?.internalBuyerMatches}
          />
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 animate-fade-in flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Analysis Failed</p>
                <p className="text-sm opacity-80 mt-1">{error}</p>
              </div>
            </div>
          )}

          {!result && !loading && !error && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-xl bg-slate-800/30">
              <div className="p-4 bg-slate-800 rounded-full mb-4">
                <ArrowRight className="w-8 h-8 opacity-50" />
              </div>
              <p className="text-lg font-medium text-slate-400">System Ready</p>
              <p className="text-sm max-w-xs text-center mt-2">Awaiting inventory data to initiate market research and matching sequence.</p>
            </div>
          )}

          {loading && (
             <div className="h-full min-h-[500px] flex flex-col items-center justify-center border border-slate-700 rounded-xl bg-slate-800 relative overflow-hidden p-8">
               <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50"></div>
               
               <div className="relative z-10 w-full max-w-md space-y-8">
                 <div className="text-center">
                    <div className="w-16 h-16 border-4 border-slate-700 border-t-amber-500 rounded-full animate-spin mx-auto mb-6"></div>
                    <h3 className="text-xl font-bold text-white">SurplusMatchmaker Processing</h3>
                    <p className="text-slate-400 text-sm mt-2">Executing sales intelligence protocols</p>
                 </div>

                 <div className="space-y-4">
                    {LOADING_STEPS.map((step, index) => {
                      const isActive = index === loadingStepIndex;
                      const isCompleted = index < loadingStepIndex;
                      const Icon = step.icon;

                      return (
                        <div 
                          key={index} 
                          className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-500 ${
                            isActive ? 'bg-slate-700/50 border border-amber-500/30 translate-x-2' : 
                            isCompleted ? 'bg-slate-800/50 opacity-50' : 'opacity-30'
                          }`}
                        >
                          <div className={`p-2 rounded-full ${
                            isActive ? 'bg-amber-500 text-slate-900' : 
                            isCompleted ? 'bg-green-500/20 text-green-500' : 'bg-slate-700 text-slate-500'
                          }`}>
                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : 
                             isActive ? <Loader2 className="w-5 h-5 animate-spin" /> :
                             <Icon className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className={`font-medium ${
                              isActive ? 'text-amber-400' : 
                              isCompleted ? 'text-slate-300' : 'text-slate-500'
                            }`}>
                              {step.message}
                            </p>
                            {isActive && (
                              <p className="text-xs text-amber-500/70 mt-0.5 animate-pulse">Processing...</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                 </div>
               </div>
             </div>
          )}

          {result && !loading && (
            <div className="animate-fade-in">
              <ResultCard 
                result={result} 
                isProMode={isProMode} 
                onUnlock={() => setIsProMode(true)}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;