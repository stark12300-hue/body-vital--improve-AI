import React, { useState } from "react";
import { FullPlan, UserProfile, WorkoutDay } from "../types";
import {
  ArrowDownToLine,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Dumbbell,
  Flame,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";

interface WorkoutPlanOverviewProps {
  plan: FullPlan;
  profile: UserProfile;
  onOpenChatWithQuery?: (query: string) => void;
  onSelectDayForWorkout?: (dayIndex: number) => void;
  onOpenDownloadModal?: () => void;
}

export const WorkoutPlanOverview: React.FC<WorkoutPlanOverviewProps> = ({
  plan,
  profile,
  onOpenChatWithQuery,
  onSelectDayForWorkout,
  onOpenDownloadModal,
}) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [copied, setCopied] = useState(false);

  const toggleDay = (dayNumber: number) => {
    setExpandedDay(expandedDay === dayNumber ? null : dayNumber);
  };

  const handleCopyPlan = () => {
    const text = `FitForge Workout Split: ${plan.workoutPlan.splitName}\n\n` +
      plan.workoutPlan.days.map((d) => 
        `[Day ${d.dayNumber}: ${d.dayName} - ${d.focus}]\n` +
        (d.isRestDay ? "Rest & Recovery Day\n" : d.exercises.map((e) => `- ${e.name} (${e.sets} sets x ${e.reps})`).join("\n"))
      ).join("\n\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                7-Day Split Master Structure
              </span>
              <span className="text-xs text-slate-400">
                Frequency: <strong className="text-white">{profile.daysPerWeek} Training Days/Week</strong>
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {plan.workoutPlan.splitName}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              {plan.workoutPlan.overview}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenDownloadModal && (
              <button
                onClick={onOpenDownloadModal}
                className="px-3.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 text-xs font-bold border border-indigo-500/40 flex items-center gap-1.5 transition-all shadow-md"
              >
                <ArrowDownToLine className="w-3.5 h-3.5 text-indigo-400" />
                <span>Download Routine / PDF</span>
              </button>
            )}

            <button
              onClick={handleCopyPlan}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-400" />}
              {copied ? "Copied Split!" : "Copy Split Routine"}
            </button>
          </div>
        </div>

        {/* Quick Days Overview Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mt-4">
          {plan.workoutPlan.days.map((day) => (
            <div
              key={day.dayNumber}
              onClick={() => setExpandedDay(day.dayNumber)}
              className={`p-3 rounded-xl cursor-pointer border transition-all ${
                expandedDay === day.dayNumber
                  ? "bg-indigo-600/20 border-indigo-500 text-white shadow-lg ring-1 ring-indigo-500/40"
                  : "bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700"
              }`}
            >
              <div className="text-[10px] font-bold uppercase text-indigo-400">
                Day {day.dayNumber}
              </div>
              <div className="text-xs font-bold text-white truncate mt-0.5">
                {day.dayName}
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-1">
                {day.isRestDay ? "🛌 Rest & Recover" : day.focus}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Days Accordion List */}
      <div className="space-y-3">
        {plan.workoutPlan.days.map((day, idx) => {
          const isExpanded = expandedDay === day.dayNumber;

          return (
            <div
              key={day.dayNumber}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all"
            >
              {/* Day Trigger */}
              <div
                onClick={() => toggleDay(day.dayNumber)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black ${
                      day.isRestDay
                        ? "bg-emerald-950 border border-emerald-500/30 text-emerald-400"
                        : "bg-indigo-600/20 border border-indigo-500/30 text-indigo-400"
                    }`}
                  >
                    D{day.dayNumber}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      {day.dayName}: {day.focus}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {day.isRestDay
                        ? "Active recovery, light mobility, protein nutrition"
                        : `${day.exercises.length} Exercises | Target: ~${profile.workoutDuration} mins`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {!day.isRestDay && onSelectDayForWorkout && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDayForWorkout(idx);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all hidden sm:inline-flex items-center gap-1"
                    >
                      <Zap className="w-3.5 h-3.5" /> Start Daily Routine
                    </button>
                  )}
                  <div className="p-2 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Day Exercises Expanded */}
              {isExpanded && (
                <div className="p-5 pt-0 border-t border-slate-800/60 space-y-4">
                  {day.isRestDay ? (
                    <div className="p-4 rounded-xl bg-slate-950 text-xs text-slate-300">
                      🛌 Rest day is crucial for muscle repair, glycogen replenishment, and central nervous system (CNS) restoration. Focus on eating all meals according to the diet chart.
                    </div>
                  ) : (
                    <div className="space-y-3 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {day.exercises.map((ex, exIdx) => (
                          <div
                            key={ex.id || exIdx}
                            className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                                <span className="text-indigo-400 font-extrabold">{exIdx + 1}.</span> {ex.name}
                              </h4>
                              <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[11px] font-bold border border-slate-800">
                                {ex.sets} Sets × {ex.reps}
                              </span>
                            </div>
                            <div className="text-[11px] text-indigo-300 font-medium">
                              Target: <span className="text-slate-400">{ex.targetMuscle}</span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-snug">
                              <strong className="text-slate-400">Form: </strong>{ex.formTips}
                            </p>
                            {ex.safetyNote && (
                              <div className="text-[10px] text-emerald-300 bg-emerald-950/20 p-1.5 rounded border border-emerald-500/20">
                                <strong>Safety: </strong>{ex.safetyNote}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
