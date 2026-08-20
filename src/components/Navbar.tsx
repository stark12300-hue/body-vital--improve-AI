import React from "react";
import { FullPlan, UserProfile } from "../types";
import {
  Activity,
  ArrowDownToLine,
  Bot,
  Calendar,
  Download,
  Dumbbell,
  HeartPulse,
  RefreshCw,
  Scale,
  Sparkles,
  Utensils,
  User,
} from "lucide-react";

export type NavTab = "daily" | "diet" | "split" | "progress" | "health" | "chat";

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  profile: UserProfile;
  plan: FullPlan;
  onOpenProfileModal: () => void;
  onOpenWeeklyModal: () => void;
  onOpenDownloadModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  plan,
  onOpenProfileModal,
  onOpenWeeklyModal,
  onOpenDownloadModal,
}) => {
  const tabs = [
    { id: "daily", label: "Today's Workout", icon: Dumbbell, badge: "Daily" },
    { id: "diet", label: "Diet Chart", icon: Utensils, badge: `${plan.summary.proteinGrams}g Prot` },
    { id: "split", label: "7-Day Split", icon: Calendar },
    { id: "progress", label: "Progress Logs", icon: Scale },
    { id: "health", label: "Health & Safety", icon: HeartPulse, badge: profile.healthIssues.length ? `${profile.healthIssues.length}` : undefined },
    { id: "chat", label: "AI Coach Chat", icon: Bot, highlight: true },
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Brand & Actions Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-emerald-500 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white tracking-tight">
                  Fit<span className="text-indigo-400">Forge</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  AI Coach
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">
                Bodybuilding, Daily Exercises, Health & Weekly Diet Updates
              </p>
            </div>
          </div>

          {/* User Profile Pill & Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Download / Install App & PDF button */}
            <button
              onClick={onOpenDownloadModal}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-indigo-500/25 flex items-center gap-1.5 transition-all border border-indigo-400/30 animate-pulse hover:animate-none"
              title="Download Mobile App (PWA) or PDF Plan"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>Download App</span>
            </button>

            <button
              onClick={onOpenWeeklyModal}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Weekly Diet Update</span>
              <span className="sm:hidden">Check-in</span>
            </button>

            <button
              onClick={onOpenProfileModal}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                {profile.name?.charAt(0) || "U"}
              </div>
              <span className="hidden md:inline font-bold text-white">{profile.name}</span>
              <span className="text-slate-400 hidden lg:inline text-[11px]">
                ({profile.weight}kg &rarr; {profile.targetWeight}kg)
              </span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-800/80 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as NavTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-extrabold"
                    : tab.highlight
                    ? "text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-300"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : tab.highlight ? "text-emerald-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      isActive
                        ? "bg-indigo-800 text-white"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
