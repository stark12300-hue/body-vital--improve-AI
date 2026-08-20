import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { ProgressLog } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  HeartPulse, 
  Activity, 
  Plus, 
  Trash2, 
  Calendar, 
  Zap, 
  ShieldAlert, 
  Sparkles,
  CheckCircle2,
  Smile,
  Frown,
  Meh,
  Trophy,
  Flame,
  Award,
  ArrowRight,
  UserPlus
} from 'lucide-react';

export const ProgressTrackerView: React.FC = () => {
  const { 
    progressLogs, 
    addProgressLog, 
    deleteProgressLog, 
    userProfile, 
    performanceScoreBreakdown,
    setIsRegistrationModalOpen 
  } = useFitness();
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);

  // New Log Form State
  const [newLog, setNewLog] = useState<Omit<ProgressLog, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    weightKg: userProfile?.currentWeightKg || 75,
    bodyFatPct: 20,
    waistCm: 86,
    chestCm: 100,
    bicepCm: 34,
    thighCm: 58,
    energyScore: 4,
    painScore: 1,
    symptomNotes: '',
    workoutCompleted: true,
    dietAdherencePct: 90,
    waterLitersDrank: 3.5,
    sleepHours: 7.5,
    notes: '',
  });

  const startWeight = progressLogs.length > 0 ? progressLogs[progressLogs.length - 1].weightKg : userProfile?.currentWeightKg || 75;
  const currentWeight = progressLogs.length > 0 ? progressLogs[0].weightKg : userProfile?.currentWeightKg || 75;
  const targetWeight = userProfile?.targetWeightKg || 70;
  const totalChangeKg = currentWeight - startWeight;
  const isLosingGoal = targetWeight < startWeight;

  // Calculate percentage toward goal
  const totalDistanceToGoal = Math.abs(startWeight - targetWeight);
  const achievedDistance = Math.abs(startWeight - currentWeight);
  const goalProgressPct = totalDistanceToGoal > 0 ? Math.min(100, Math.round((achievedDistance / totalDistanceToGoal) * 100)) : 100;

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    addProgressLog(newLog);
    setIsLogModalOpen(false);
  };

  // Prepare chart coordinates (chronological order)
  const chartData = [...progressLogs].reverse();
  const weights = chartData.map((d) => d.weightKg);
  const minW = Math.min(...weights, targetWeight) - 1;
  const maxW = Math.max(...weights, targetWeight) + 1;
  const range = maxW - minW || 1;

  return (
    <div id="progress-view-container" className="space-y-6">
      {/* Top Banner & Quick Metrics */}
      <div className="p-6 bg-white border border-slate-200/90 rounded-3xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              <span>Transformation Analytics & Health Log</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Progress & Health Symptom Tracker
            </h2>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Track weight changes, body measurements, daily energy, and joint recovery status.
            </p>
          </div>

          <button
            id="btn-open-log-modal"
            onClick={() => setIsLogModalOpen(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" /> Log Today&apos;s Progress
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs flex flex-col justify-between">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Current Weight</span>
            <Scale className="w-4 h-4 text-blue-600" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-slate-900">{currentWeight} kg</div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">
              Target: <strong className="text-blue-700">{targetWeight} kg</strong>
            </div>
          </div>
          <div className="text-[11px] font-semibold flex items-center gap-1">
            {totalChangeKg <= 0 ? (
              <span className="text-emerald-600 flex items-center">
                <TrendingDown className="w-3 h-3 mr-0.5" /> {Math.abs(totalChangeKg).toFixed(1)} kg dropped
              </span>
            ) : (
              <span className="text-blue-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +{totalChangeKg.toFixed(1)} kg gained
              </span>
            )}
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs flex flex-col justify-between">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Goal Achievement</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-amber-600">{goalProgressPct}%</div>
            <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden border border-slate-200/60">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${goalProgressPct}%` }} />
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {Math.abs(currentWeight - targetWeight).toFixed(1)} kg remaining to goal
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs flex flex-col justify-between">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Pain & Joint Status</span>
            <HeartPulse className="w-4 h-4 text-rose-500" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-slate-900 flex items-center gap-2">
              <span>{progressLogs[0]?.painScore ?? 0}</span>
              <span className="text-xs text-slate-400 font-normal">/ 5 pain</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-bold mt-1">
              {(progressLogs[0]?.painScore ?? 0) <= 1 ? 'Healthy & Recovering' : 'Managing with Safe Form'}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-medium truncate">
            {userProfile?.healthConditions?.injuries?.join(', ') || 'No active injuries'}
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs flex flex-col justify-between">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Average Energy</span>
            <Zap className="w-4 h-4 text-teal-600" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-teal-700">
              {progressLogs[0]?.energyScore ?? 4} / 5
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Sleep: {progressLogs[0]?.sleepHours ?? 7.5} hrs/night
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Diet Adherence: {progressLogs[0]?.dietAdherencePct ?? 90}%</div>
        </div>
      </div>

      {/* Live Community Performance Rating Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-3xl text-white shadow-md border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0 shadow-sm">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              COMMUNITY PERFORMANCE SCORE
            </div>
            <div className="text-base font-extrabold text-white flex items-center gap-2 mt-0.5">
              <span>{performanceScoreBreakdown.total} / 100 Points</span>
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold">
                {performanceScoreBreakdown.tierBadge}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Workout ({performanceScoreBreakdown.workoutScore}/35) • Diet ({performanceScoreBreakdown.dietScore}/25) • Consistency ({performanceScoreBreakdown.consistencyScore}/20)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-progress-register"
            onClick={() => setIsRegistrationModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5 text-blue-400" />
            <span>Profile</span>
          </button>
        </div>
      </div>

      {/* Interactive Visual Weight Trend Chart (Clean SVG) */}
      <div className="p-6 bg-white border border-slate-200/90 rounded-3xl shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Weight Progression Timeline
          </h3>
          <div className="flex items-center gap-3 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-blue-700">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Logged Weight (kg)
            </span>
            <span className="flex items-center gap-1.5 text-amber-700">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Target ({targetWeight} kg)
            </span>
          </div>
        </div>

        {chartData.length > 1 ? (
          <div className="relative h-56 w-full pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 180" preserveAspectRatio="none">
              {/* Grid Background lines */}
              <line x1="20" y1="20" x2="580" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="20" y1="90" x2="580" y2="90" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="20" y1="160" x2="580" y2="160" stroke="#e2e8f0" strokeWidth="1" />

              {/* Target Line */}
              {(() => {
                const targetY = 160 - ((targetWeight - minW) / range) * 140;
                return (
                  <line
                    x1="20"
                    y1={targetY}
                    x2="580"
                    y2={targetY}
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.8"
                  />
                );
              })()}

              {/* Points & Polyline */}
              {(() => {
                const points = chartData.map((d, idx) => {
                  const x = 30 + (idx / (chartData.length - 1)) * 540;
                  const y = 160 - ((d.weightKg - minW) / range) * 140;
                  return `${x},${y}`;
                });

                return (
                  <>
                    <polyline
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={points.join(' ')}
                    />
                    {chartData.map((d, idx) => {
                      const x = 30 + (idx / (chartData.length - 1)) * 540;
                      const y = 160 - ((d.weightKg - minW) / range) * 140;
                      return (
                        <g key={d.id}>
                          <circle cx={x} cy={y} r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                          <text x={x} y={y - 10} fill="#0f172a" fontSize="11" textAnchor="middle" fontWeight="bold">
                            {d.weightKg}kg
                          </text>
                          <text x={x} y="175" fill="#64748b" fontSize="10" textAnchor="middle" fontWeight="500">
                            {d.date.slice(5)}
                          </text>
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400 font-medium">
            Log at least 2 progress entries to see your transformation line chart!
          </div>
        )}
      </div>

      {/* Progress History Log List */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          Logged Entries History
        </h3>

        <div className="space-y-3">
          {progressLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-center shrink-0">
                  <div className="text-xs font-bold text-blue-700">{log.date.slice(8)}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{log.date.slice(5, 7)}</div>
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-bold text-slate-900 font-mono">{log.weightKg} kg</span>
                    {log.bodyFatPct && (
                      <span className="text-xs text-slate-500 font-mono">({log.bodyFatPct}% Body Fat)</span>
                    )}
                    <span className="text-xs text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md font-bold">
                      Energy {log.energyScore}/5
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md font-bold border ${
                        log.painScore === 0
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : log.painScore <= 2
                          ? 'bg-amber-50 border-amber-200 text-amber-800'
                          : 'bg-rose-50 border-rose-200 text-rose-800'
                      }`}
                    >
                      Pain Score: {log.painScore}/5
                    </span>
                  </div>

                  {/* Body tape measurements */}
                  {(log.waistCm || log.chestCm || log.bicepCm) && (
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 font-medium">
                      {log.waistCm && <span>Waist: {log.waistCm}cm</span>}
                      {log.chestCm && <span>Chest: {log.chestCm}cm</span>}
                      {log.bicepCm && <span>Bicep: {log.bicepCm}cm</span>}
                      {log.thighCm && <span>Thighs: {log.thighCm}cm</span>}
                    </div>
                  )}

                  {log.symptomNotes && (
                    <p className="text-xs text-amber-900 mt-1.5 bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-medium">
                      <strong className="text-amber-950">Health & Symptom Note:</strong> {log.symptomNotes}
                    </p>
                  )}

                  {log.notes && <p className="text-xs text-slate-600 mt-1 font-medium">{log.notes}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => deleteProgressLog(log.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Delete Log"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Progress Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Log Body Weight & Health Update
              </h3>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveLog} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Date</label>
                  <input
                    type="date"
                    value={newLog.date}
                    onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-blue-600 outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Body Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newLog.weightKg}
                    onChange={(e) => setNewLog({ ...newLog, weightKg: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold focus:bg-white focus:border-blue-600 outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-slate-500 text-[11px] font-bold mb-1">Waist (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newLog.waistCm || ''}
                    onChange={(e) => setNewLog({ ...newLog, waistCm: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:border-blue-600 outline-hidden"
                    placeholder="86"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[11px] font-bold mb-1">Chest (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newLog.chestCm || ''}
                    onChange={(e) => setNewLog({ ...newLog, chestCm: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:border-blue-600 outline-hidden"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[11px] font-bold mb-1">Bicep (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newLog.bicepCm || ''}
                    onChange={(e) => setNewLog({ ...newLog, bicepCm: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:border-blue-600 outline-hidden"
                    placeholder="34"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[11px] font-bold mb-1">Thighs (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newLog.thighCm || ''}
                    onChange={(e) => setNewLog({ ...newLog, thighCm: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:border-blue-600 outline-hidden"
                    placeholder="58"
                  />
                </div>
              </div>

              {/* Energy & Pain Scales */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Energy Score (1 to 5)</label>
                  <div className="grid grid-cols-5 gap-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setNewLog({ ...newLog, energyScore: num })}
                        className={`py-1.5 rounded-lg font-bold text-xs border ${
                          newLog.energyScore === num
                            ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Joint Pain Score (0 to 5)</label>
                  <div className="grid grid-cols-6 gap-1">
                    {[0, 1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setNewLog({ ...newLog, painScore: num })}
                        className={`py-1.5 rounded-lg font-bold text-xs border ${
                          newLog.painScore === num
                            ? num === 0
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                              : 'bg-rose-600 border-rose-600 text-white shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Health & Injury Symptom Details
                </label>
                <input
                  type="text"
                  value={newLog.symptomNotes}
                  onChange={(e) => setNewLog({ ...newLog, symptomNotes: e.target.value })}
                  placeholder="e.g. Knee pain reduced after doing box squats and hamstrings"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-blue-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">General Notes</label>
                <textarea
                  value={newLog.notes}
                  onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                  rows={2}
                  placeholder="How did you feel about your lifts and meals today?"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-blue-600 outline-hidden"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-xs"
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
