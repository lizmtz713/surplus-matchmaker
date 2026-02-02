import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, MessageSquareText } from 'lucide-react';
import { MatchResult, ChatMessage } from '../types.ts';
import { askSurplusAI } from '../services/geminiService.ts';

interface ConsultantChatProps {
  result: MatchResult;
}

export const ConsultantChat: React.FC<ConsultantChatProps> = ({ result }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'ai',
      text: `Analysis complete. I've reviewed the specs, valuation, and potential buyers. What would you like to know more about?`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await askSurplusAI(result, messages, input);
      setMessages(prev => [...prev, { role: 'ai', text: responseText, timestamp: Date.now() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "I encountered an error analyzing that request.", timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (question: string) => {
    setInput(question);
    // Optional: Auto-send on click
    // handleSend();
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
      {/* Header */}
      <div className="bg-slate-900/80 border-b border-slate-700 p-4 flex items-center justify-between backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
            <Bot className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Ask SurplusMatchmaker</h3>
            <p className="text-xs text-slate-500">Live Contextual Consultant</p>
          </div>
        </div>
        <div className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700">
           Beta
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-900 to-slate-800 custom-scrollbar"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
            )}
            
            <div 
              className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-slate-700/50 text-slate-200 border border-slate-600/50 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4 text-blue-400" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3 justify-start">
             <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-amber-500" />
             </div>
             <div className="bg-slate-700/50 p-3 rounded-2xl rounded-tl-none border border-slate-600/50 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                <span className="text-xs text-slate-400 italic">Thinking...</span>
             </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length < 3 && !isTyping && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto custom-scrollbar">
          <button 
            onClick={() => handleSuggestion("Why is the scrap value that low?")}
            className="whitespace-nowrap px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-full text-xs text-slate-300 transition-colors"
          >
            Why is scrap value low?
          </button>
          <button 
            onClick={() => handleSuggestion("Draft a negotiation email for the top buyer")}
            className="whitespace-nowrap px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-full text-xs text-slate-300 transition-colors"
          >
            Draft negotiation email
          </button>
          <button 
            onClick={() => handleSuggestion("What are the freight risks?")}
            className="whitespace-nowrap px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-full text-xs text-slate-300 transition-colors"
          >
            Freight risks?
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-700">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about pricing, buyers, or freight..."
            className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder-slate-500"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`p-3 rounded-xl transition-all ${
              input.trim() && !isTyping
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-lg shadow-amber-500/20'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 text-center flex items-center justify-center gap-1">
          <MessageSquareText className="w-3 h-3" />
          AI can make mistakes. Verify critical data.
        </p>
      </div>
    </div>
  );
};