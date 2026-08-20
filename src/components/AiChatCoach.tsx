import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, FullPlan, ProgressEntry, UserProfile } from "../types";
import { Bot, Send, Sparkles, User, Dumbbell, HeartPulse, RefreshCw, Zap } from "lucide-react";

interface AiChatCoachProps {
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isAiTyping: boolean;
  profile: UserProfile;
  plan: FullPlan;
  progressLogs: ProgressEntry[];
  initialPrefilledPrompt?: string;
  onOpenWeeklyModal?: () => void;
}

const QUICK_PROMPTS = [
  "Gym se 45 min pehle pre-workout meal mein kya khayein?",
  "Knee pain hai, leg day par squats ki jagah konsi safe exercise karu?",
  "Vegetarian 140g protein diet on a budget tips bataiye",
  "Creatine monohydrate kab aur kitna paani ke sath lena chahiye?",
  "Mera fat loss ruk gaya hai, diet mein kya change karu?",
  "Lower back ko injury se bachane ke key form cues kya hain?",
];

export const AiChatCoach: React.FC<AiChatCoachProps> = ({
  chatHistory,
  onSendMessage,
  isAiTyping,
  profile,
  plan,
  progressLogs,
  initialPrefilledPrompt,
  onOpenWeeklyModal,
}) => {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialPrefilledPrompt) {
      setInputText(initialPrefilledPrompt);
    }
  }, [initialPrefilledPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isAiTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isAiTyping) return;
    const text = inputText;
    setInputText("");
    await onSendMessage(text);
  };

  const handleQuickPromptClick = (prompt: string) => {
    onSendMessage(prompt);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[75vh]">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg">
              <Bot className="w-5 h-5" />
            </div>
            <div className="w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full absolute -bottom-0.5 -right-0.5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              FitForge AI Coach (Bodybuilding & Nutrition Expert)
            </h2>
            <p className="text-xs text-slate-400">
              Active Context: {profile.name || "Athlete"} ({profile.weight}kg &rarr; {profile.targetWeight}kg) | {profile.dietPreference} Diet
            </p>
          </div>
        </div>

        <button
          onClick={onOpenWeeklyModal}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/50 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Weekly Diet Check-in
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto flex items-center gap-2 no-scrollbar">
        <span className="text-[11px] font-bold text-indigo-400 shrink-0 flex items-center gap-1 uppercase tracking-wider">
          <Sparkles className="w-3 h-3" /> Quick Questions:
        </span>
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickPromptClick(qp)}
            className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white px-3 py-1 rounded-full whitespace-nowrap transition-colors shrink-0"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Chat Messages List */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {chatHistory.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  isUser
                    ? "bg-indigo-600 text-white"
                    : "bg-gradient-to-br from-emerald-500 to-indigo-600 text-white"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? "bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20"
                    : "bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg whitespace-pre-wrap"
                }`}
              >
                {msg.text}
                <div
                  className={`text-[10px] mt-2 text-right ${
                    isUser ? "text-indigo-200" : "text-slate-500"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isAiTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center text-white shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-2 text-xs text-indigo-400">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
              </div>
              <span className="text-[11px] text-slate-400 font-medium ml-1">AI Coach is typing advice...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Gym exercises, diet swaps, health injury queries, ya weekly plan ke baare mein puchiye..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isAiTyping}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};
