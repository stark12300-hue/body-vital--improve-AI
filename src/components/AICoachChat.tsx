import React, { useState, useRef, useEffect } from 'react';
import { useFitness } from '../context/FitnessContext';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  Lightbulb, 
  Copy, 
  Check, 
  RefreshCw, 
  Zap, 
  Activity,
  Flame
} from 'lucide-react';

export const AICoachChat: React.FC = () => {
  const { chatMessages, sendChatMessage, userProfile, dietPlan, workoutPlan } = useFitness();
  const [inputText, setInputText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isSending]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isSending) return;

    setInputText('');
    setIsSending(true);
    try {
      await sendChatMessage(text);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    { label: '🦵 Knee / Joint Pain Safe Swap', text: 'Ghutne me halka dard hai, squats aur lunges ka safe replacement batao' },
    { label: '🥗 High-Protein Veg Snacks under ₹50', text: 'Vegetarian high protein snacks batao jo saste aur 20g+ protein wale hon' },
    { label: '💪 Chest Hypertrophy & Upper Pecs', text: 'Upper chest grow karne ke liye best exercise aur rep range kya hai?' },
    { label: '🕒 Pre vs Post Workout Nutrition', text: 'Gym se pehle aur gym ke turant baad kya khana sabse best hai?' },
    { label: '⚡ Energy & Craving Control', text: 'Afternoon me sugar craving aur gym me low energy ko kaise theek karein?' },
  ];

  return (
    <div id="ai-chat-view-container" className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-white border border-slate-200/90 rounded-3xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  FitGuru AI Coach (Arogya Support)
                </h2>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                24/7 Personal Trainer & Sports Nutritionist • Natural Hinglish & English Support
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-medium">
              Target: <strong className="text-blue-700">{dietPlan?.macroTargets.calories} kcal</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-medium">
              Protein: <strong className="text-emerald-700">{dietPlan?.macroTargets.proteinGrams}g</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs flex flex-col h-[580px]">
        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 shrink-0 pl-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Quick Questions:
          </span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q.text)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-slate-900 text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 shadow-2xs"
            >
              <span>{q.label}</span>
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-slate-50/40">
          {chatMessages.map((msg) => {
            const isAi = msg.sender === 'ai';

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isAi ? '' : 'flex-row-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isAi
                      ? 'bg-blue-50 border border-blue-200 text-blue-700 shadow-2xs'
                      : 'bg-slate-200 border border-slate-300 text-slate-700 shadow-2xs'
                  }`}
                >
                  {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isAi
                      ? 'bg-white border border-slate-200 text-slate-800 shadow-2xs'
                      : 'bg-blue-600 text-white font-medium shadow-xs'
                  }`}
                >
                  {/* Content */}
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Message footer */}
                  <div
                    className={`mt-2 pt-1.5 flex items-center justify-between gap-4 text-[10px] ${
                      isAi ? 'text-slate-400 border-t border-slate-100 font-medium' : 'text-blue-100'
                    }`}
                  >
                    <span>{msg.timestamp}</span>

                    {isAi && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:text-slate-700 flex items-center gap-1 transition-colors font-medium"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-600 flex items-center gap-2 shadow-2xs font-medium">
                <Activity className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>FitGuru Coach is typing personalized advice...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            id="input-ai-chat"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Poochiye — diet recipe swap, workout form, injury protection..."
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors font-medium"
          />

          <button
            id="btn-send-chat"
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-colors disabled:opacity-40 shrink-0 shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
