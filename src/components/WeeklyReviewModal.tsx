import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { WeeklyReview } from '../types';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  TrendingDown, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Utensils, 
  Dumbbell, 
  Activity, 
  Zap, 
  Calendar, 
  X, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WeeklyReviewModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    userProfile,
    dietPlan,
    weeklyReviews,
    submitWeeklyCheckin,
    isLoadingAi,
    language,
  } = useFitness();

  const [activeTab, setActiveTab] = useState<'checkin' | 'history'>('checkin');
  const [latestReviewResult, setLatestReviewResult] = useState<WeeklyReview | null>(null);

  // Check-in Form state
  const [checkinData, setCheckinData] = useState({
    currentWeightKg: userProfile?.currentWeightKg || 74,
    workoutCompliancePct: 85,
    dietCompliancePct: 90,
    energyScore: 4,
    painScore: 1,
    notes: 'Feeling lighter and stronger. Struggling a little with 4 PM cravings.',
    symptomUpdate: 'Knee discomfort reduced significantly with box squats.',
  });

  if (!isOpen) return null;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitWeeklyCheckin(checkinData);
    if (result.success && result.review) {
      setLatestReviewResult(result.review);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f59e0b'],
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        id="weekly-review-modal"
        className="w-full max-w-3xl bg-white border border-slate-200/90 text-slate-800 rounded-3xl shadow-xl overflow-hidden flex flex-col my-auto max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-6 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Weekly AI Progress Review & Diet Adaptation
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                AI evaluates your past week&apos;s results and automatically optimizes your Diet Chart!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-3 bg-white border-b border-slate-200 flex items-center gap-4 text-xs font-bold">
          <button
            onClick={() => {
              setActiveTab('checkin');
              setLatestReviewResult(null);
            }}
            className={`pb-2.5 border-b-2 transition-all ${
              activeTab === 'checkin'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Conduct Week {(dietPlan?.weekNumber || 1) + 1} Review
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>Review History</span>
            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold">
              {weeklyReviews.length}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          {activeTab === 'checkin' && !latestReviewResult && (
            <form onSubmit={handleSubmitReview} className="space-y-5 text-xs">
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl text-slate-700 leading-relaxed font-medium">
                <strong className="text-slate-900 font-bold">How it works:</strong> Provide your updated body weight and honest
                adherence scores. FitGuru AI will diagnose your metabolic rate, check for plateaus or joint recovery,
                and update your calorie/protein targets and meal chart for the coming week.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Current Weight at End of Week (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={checkinData.currentWeightKg}
                    onChange={(e) =>
                      setCheckinData({ ...checkinData, currentWeightKg: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-sm focus:border-blue-600 focus:bg-white font-medium"
                    required
                  />
                  <div className="text-[11px] text-slate-500 mt-1 font-medium">
                    Previous week: {userProfile?.currentWeightKg} kg
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Joint Pain & Injury Status (0 to 5)
                  </label>
                  <div className="grid grid-cols-6 gap-1.5">
                    {[0, 1, 2, 3, 4, 5].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setCheckinData({ ...checkinData, painScore: p })}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          checkinData.painScore === p
                            ? 'bg-rose-50 border-rose-400 text-rose-800 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 font-medium">0 = No pain, 5 = Severe discomfort</div>
                </div>
              </div>

              {/* Compliance Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Dumbbell className="w-3.5 h-3.5 text-blue-600" /> Workout Adherence
                    </span>
                    <span className="font-mono font-bold text-blue-700">{checkinData.workoutCompliancePct}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={checkinData.workoutCompliancePct}
                    onChange={(e) =>
                      setCheckinData({ ...checkinData, workoutCompliancePct: Number(e.target.value) })
                    }
                    className="w-full accent-blue-600"
                  />
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-amber-500" /> Diet & Nutrition Adherence
                    </span>
                    <span className="font-mono font-bold text-amber-700">{checkinData.dietCompliancePct}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={checkinData.dietCompliancePct}
                    onChange={(e) =>
                      setCheckinData({ ...checkinData, dietCompliancePct: Number(e.target.value) })
                    }
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Injury / Joint Symptom Update
                </label>
                <input
                  type="text"
                  value={checkinData.symptomUpdate}
                  onChange={(e) => setCheckinData({ ...checkinData, symptomUpdate: e.target.value })}
                  placeholder="e.g. Knee felt much better with box squats, no swelling"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-600 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  How did you feel overall this week? (Energy, cravings, sleep)
                </label>
                <textarea
                  rows={2}
                  value={checkinData.notes}
                  onChange={(e) => setCheckinData({ ...checkinData, notes: e.target.value })}
                  placeholder="Share details on your hunger, energy in the gym, or foods you enjoyed/missed..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-600 focus:bg-white font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isLoadingAi}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50 text-sm"
              >
                {isLoadingAi ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    AI Analyzing Week & Updating Diet Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Submit Review & Generate Next Week Diet
                  </>
                )}
              </button>
            </form>
          )}

          {/* AI Result View */}
          {latestReviewResult && (
            <div className="space-y-5 text-xs animate-in zoom-in-95 duration-300">
              <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-3xl shadow-2xs">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Week {latestReviewResult.weekNumber} Transformation Report & Diet Update
                </div>
                <p className="text-slate-700 mt-2 leading-relaxed text-xs font-medium">
                  {language === 'english'
                    ? latestReviewResult.aiDiagnosis
                    : latestReviewResult.hindiAiDiagnosis || latestReviewResult.aiDiagnosis}
                </p>
              </div>

              {/* Macro Adjustments Box */}
              {latestReviewResult.macroAdjustments && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Dynamic Macro Adjustments Applied:
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg font-mono font-bold">
                      Calories:{' '}
                      {latestReviewResult.macroAdjustments.caloriesChange > 0 ? '+' : ''}
                      {latestReviewResult.macroAdjustments.caloriesChange} kcal
                    </span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-mono font-bold">
                      Protein:{' '}
                      {latestReviewResult.macroAdjustments.proteinChange > 0 ? '+' : ''}
                      {latestReviewResult.macroAdjustments.proteinChange}g
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 font-medium">
                    {latestReviewResult.macroAdjustments.explanation}
                  </p>
                </div>
              )}

              {/* Key Wins & Next Focus */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-200/80">
                  <div className="font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Wins This Week
                  </div>
                  <ul className="space-y-1.5 text-slate-700 text-[11px] font-medium">
                    {latestReviewResult.keyWins.map((win, wIdx) => (
                      <li key={wIdx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        {win}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-blue-50/40 rounded-2xl border border-blue-200/80">
                  <div className="font-bold text-blue-900 mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" /> Next Week Focus Areas
                  </div>
                  <ul className="space-y-1.5 text-slate-700 text-[11px] font-medium">
                    {latestReviewResult.focusAreasNextWeek.map((focus, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        {focus}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Diet and Workout updates list */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-emerald-600" /> Diet Chart Changes for New Week
                </div>
                <ul className="space-y-1 text-slate-700 text-[11px] list-disc list-inside font-medium">
                  {latestReviewResult.dietUpdatesSummary.map((item, dIdx) => (
                    <li key={dIdx}>{item}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-colors text-sm shadow-xs"
              >
                View Updated Diet Chart & Routine
              </button>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-3 text-xs">
              {weeklyReviews.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-medium">
                  No past weekly reviews yet. Complete your first week check-in to track how your diet evolves!
                </div>
              ) : (
                weeklyReviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">Week {rev.weekNumber} Review</span>
                      <span className="text-[11px] text-slate-400 font-mono font-medium">{rev.date.slice(0, 10)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-emerald-700 font-mono font-bold">
                        Weight: {rev.startWeightKg}kg → {rev.endWeightKg}kg ({rev.weightDeltaKg > 0 ? '+' : ''}
                        {rev.weightDeltaKg}kg)
                      </span>
                      <span className="text-slate-600 font-medium">Workout: {rev.workoutCompliancePct}%</span>
                      <span className="text-slate-600 font-medium">Diet: {rev.dietCompliancePct}%</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-1 font-medium">
                      {rev.hindiAiDiagnosis || rev.aiDiagnosis}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
