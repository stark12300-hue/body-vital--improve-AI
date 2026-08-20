import React, { useState } from "react";
import { FullPlan, ProgressEntry, UserProfile } from "../types";
import {
  Activity,
  Award,
  Calendar,
  ChevronUp,
  Plus,
  Scale,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";

interface ProgressTrackerViewProps {
  entries: ProgressEntry[];
  onAddEntry: (entry: ProgressEntry) => void;
  profile: UserProfile;
  plan: FullPlan;
  onOpenWeeklyCheckInModal: () => void;
  onOpenChatWithQuery?: (query: string) => void;
}

export const ProgressTrackerView: React.FC<ProgressTrackerViewProps> = ({
  entries,
  onAddEntry,
  profile,
  plan,
  onOpenWeeklyCheckInModal,
  onOpenChatWithQuery,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [newWeight, setNewWeight] = useState(profile.weight);
  const [newChest, setNewChest] = useState<number | undefined>(undefined);
  const [newWaist, setNewWaist] = useState<number | undefined>(undefined);
  const [newBiceps, setNewBiceps] = useState<number | undefined>(undefined);
  const [newThighs, setNewThighs] = useState<number | undefined>(undefined);
  const [newEnergy, setNewEnergy] = useState<"low" | "medium" | "high" | "peak">("high");
  const [newAdherence, setNewAdherence] = useState(90);
  const [newNotes, setNewNotes] = useState("");

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const initialEntry = sortedEntries[0] || { weight: profile.weight, date: "Start" };
  const latestEntry = sortedEntries[sortedEntries.length - 1] || initialEntry;

  const totalWeightChange = latestEntry.weight - initialEntry.weight;
  const isGainGoal = profile.targetWeight > profile.weight;
  const weightToTarget = Math.abs(profile.targetWeight - latestEntry.weight);

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: ProgressEntry = {
      id: `progress-${Date.now()}`,
      date: newDate,
      weight: Number(newWeight),
      chest: newChest ? Number(newChest) : undefined,
      waist: newWaist ? Number(newWaist) : undefined,
      biceps: newBiceps ? Number(newBiceps) : undefined,
      thighs: newThighs ? Number(newThighs) : undefined,
      energyLevel: newEnergy,
      adherenceScore: Number(newAdherence),
      notes: newNotes || undefined,
    };
    onAddEntry(entry);
    setIsModalOpen(false);
    setNewNotes("");
  };

  // SVG Chart calculation
  const minWeight = Math.min(...sortedEntries.map((e) => e.weight), profile.targetWeight) - 2;
  const maxWeight = Math.max(...sortedEntries.map((e) => e.weight), profile.targetWeight) + 2;
  const range = maxWeight - minWeight || 1;

  const chartHeight = 160;
  const chartWidth = 500;

  const points = sortedEntries.map((entry, index) => {
    const x = (index / Math.max(sortedEntries.length - 1, 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - 20 - ((entry.weight - minWeight) / range) * (chartHeight - 40);
    return { x, y, entry };
  });

  const pathD = points.length > 1
    ? points.reduce((acc, curr, idx) => `${acc} ${idx === 0 ? "M" : "L"} ${curr.x} ${curr.y}`, "")
    : "";

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Summary */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Body Transformation Tracker
              </span>
              <span className="text-xs text-slate-400">
                Goal: <strong className="text-slate-200 capitalize">{profile.goal.replace("_", " ")}</strong>
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Progress & Body Metrics History
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Initial: <strong className="text-slate-200">{initialEntry.weight} kg</strong> &rarr; Current:{" "}
              <strong className="text-indigo-400">{latestEntry.weight} kg</strong> &rarr; Target:{" "}
              <strong className="text-emerald-400">{profile.targetWeight} kg</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" /> Log Today&apos;s Weight
            </button>
            <button
              onClick={onOpenWeeklyCheckInModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" /> Weekly AI Review
            </button>
          </div>
        </div>

        {/* 4 Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-indigo-400" /> Current Weight
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {latestEntry.weight} <span className="text-xs text-slate-400 font-semibold">kg</span>
            </div>
            <div className="text-[11px] flex items-center gap-1 mt-0.5">
              {totalWeightChange > 0 ? (
                <span className="text-emerald-400 font-bold flex items-center">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> +{totalWeightChange.toFixed(1)} kg
                </span>
              ) : totalWeightChange < 0 ? (
                <span className="text-emerald-400 font-bold flex items-center">
                  <TrendingDown className="w-3 h-3 mr-0.5" /> {totalWeightChange.toFixed(1)} kg
                </span>
              ) : (
                <span className="text-slate-400">0.0 kg change</span>
              )}
              <span className="text-slate-500">since start</span>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-emerald-400" /> To Target Goal
            </div>
            <div className="text-2xl font-black text-emerald-300 mt-1">
              {weightToTarget.toFixed(1)} <span className="text-xs text-slate-400 font-semibold">kg</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {isGainGoal ? "to bulk target" : "to cut target"} ({profile.targetWeight} kg)
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Energy & Drive
            </div>
            <div className="text-2xl font-black text-amber-300 mt-1 capitalize">
              {latestEntry.energyLevel || "High"}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Gym performance score</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-cyan-400" /> Consistency
            </div>
            <div className="text-2xl font-black text-cyan-300 mt-1">
              {latestEntry.adherenceScore || 92}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Diet & workout follow-rate</div>
          </div>
        </div>

        {/* Visual SVG Trend Graph */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-400" /> Weight Transformation Curve
            </h3>
            <span className="text-[11px] text-slate-400">
              Target Line: <strong className="text-emerald-400">{profile.targetWeight} kg</strong>
            </span>
          </div>

          <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 overflow-x-auto">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="20" y1="20" x2={chartWidth - 20} y2="20" stroke="#334155" strokeDasharray="3 3" />
              <line x1="20" y1={chartHeight / 2} x2={chartWidth - 20} y2={chartHeight / 2} stroke="#334155" strokeDasharray="3 3" />
              <line x1="20" y1={chartHeight - 20} x2={chartWidth - 20} y2={chartHeight - 20} stroke="#334155" strokeDasharray="3 3" />

              {/* Target Weight horizontal line */}
              {(() => {
                const targetY = chartHeight - 20 - ((profile.targetWeight - minWeight) / range) * (chartHeight - 40);
                return (
                  <line
                    x1="20"
                    y1={targetY}
                    x2={chartWidth - 20}
                    y2={targetY}
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                );
              })()}

              {/* Path area */}
              {points.length > 1 && (
                <path
                  d={`${pathD} L ${points[points.length - 1].x} ${chartHeight - 20} L ${points[0].x} ${chartHeight - 20} Z`}
                  fill="url(#areaGrad)"
                />
              )}

              {/* Path line */}
              {points.length > 1 && (
                <path d={pathD} fill="none" stroke="url(#lineGrad)" strokeWidth="3" strokeLinecap="round" />
              )}

              {/* Points */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle cx={p.x} cy={p.y} r="5" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2.5" />
                  <text
                    x={p.x}
                    y={p.y - 10}
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {p.entry.weight} kg
                  </text>
                  <text
                    x={p.x}
                    y={chartHeight - 5}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="9"
                  >
                    {p.entry.date.slice(5)}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Body Measurements & Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" /> Logged Entries History ({sortedEntries.length})
          </h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> New Entry
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Weight (kg)</th>
                <th className="py-2.5 px-3">Chest (cm)</th>
                <th className="py-2.5 px-3">Biceps / Arms (cm)</th>
                <th className="py-2.5 px-3">Waist (cm)</th>
                <th className="py-2.5 px-3">Energy</th>
                <th className="py-2.5 px-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {sortedEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">{entry.date}</td>
                  <td className="py-3 px-3 font-bold text-indigo-300">{entry.weight} kg</td>
                  <td className="py-3 px-3">{entry.chest ? `${entry.chest} cm` : "—"}</td>
                  <td className="py-3 px-3">{entry.biceps ? `${entry.biceps} cm` : "—"}</td>
                  <td className="py-3 px-3">{entry.waist ? `${entry.waist} cm` : "—"}</td>
                  <td className="py-3 px-3 capitalize">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      {entry.energyLevel || "High"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 max-w-xs truncate">{entry.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Log Today&apos;s Progress & Metrics</h3>
            <form onSubmit={handleSaveEntry} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Chest (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 98"
                    value={newChest || ""}
                    onChange={(e) => setNewChest(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Biceps / Arms (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 35"
                    value={newBiceps || ""}
                    onChange={(e) => setNewBiceps(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Waist (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 81"
                    value={newWaist || ""}
                    onChange={(e) => setNewWaist(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Adherence (%)</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={newAdherence}
                    onChange={(e) => setNewAdherence(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Notes / Feelings</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Muscle pump was great, felt strong on bench press."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg"
                >
                  Save Progress Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
