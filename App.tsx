import React, { useState, useEffect, useRef } from 'react';
import { PackageSearch, Boxes, ArrowRight, Activity, CheckCircle2, Loader2, Search, BrainCircuit, PenTool, AlertTriangle } from 'lucide-react';
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
  
  // Reference for Auto-scrolling to results
  const resultsRef = useRef<HTMLDivElement>(null);
  
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

  // Save buyers on change
  useEffect(() => {
    try {
      localStorage.setItem('surplus_buyer_db', JSON.stringify(buyers));
    } catch (e) {
      console.warn("Failed to save buyers to storage", e);
    }
  }, [buyers]);
  
  // New State for Paywall Simulation with Local Storage Persistence
  // CHANGED KEY TO V2 TO FORCE RESET FOR USER
  const [isProMode, setIsProMode] = useState(() => {
    try {
      const saved = localStorage.getItem('surplus_pro_mode_v2');
      return saved === 'true';
    } catch (e) {
      return false;
    }
  });

  // Save to local storage whenever isProMode changes
  useEffect(() => {
    try {
      localStorage.setItem('surplus_pro_mode_v2', isProMode.toString());
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

  // Auto-scroll to results when analysis is done
  useEffect(() => {
    if (result && !loading && resultsRef.current) {
      // Small timeout to ensure DOM is fully rendered
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [result, loading]);

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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-8">
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
            isProMode={isProMode}
          />
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-8" ref={resultsRef}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-6 rounded-xl mb-6 animate-fade-in flex flex-col gap-4">
              <div className="flex items-center gap-3">
                 <AlertTriangle className="w-6 h-6 shrink-0" />
                 <div>
                   <p className="font-bold text-lg">System Diagnostic Alert</p>
                   <p className="text-sm opacity-90">The analysis sequence encountered an error.</p>
                 </div>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-red-300 border border-red-500/20 overflow-x-auto">
                 <strong>Diagnostic Log:</strong><br/>
                 {error}
              </div>
              <p className="text-xs text-red-300/80">
                 Tip: This usually happens if the server times out (took longer than 10s) or if the API Key is invalid. 
                 Try reducing the image size or description length and try again.
              </p>
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