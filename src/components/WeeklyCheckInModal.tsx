import React, { useState } from "react";
import { FullPlan, UserProfile, WeeklyCheckIn } from "../types";
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  ChevronRight,
  Flame,
  HeartPulse,
  RefreshCw,
  Scale,
  Sparkles,
  TrendingDown,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";

interface WeeklyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  currentPlan: FullPlan;
  onApplyUpdatedPlan: (newPlan: FullPlan, checkIn: WeeklyCheckIn) => void;
  latestWeight: number;
}

export const WeeklyCheckInModal: React.FC<WeeklyCheckInModalProps> = ({
  isOpen,
  onClose,
  profile,
  currentPlan,
  onApplyUpdatedPlan,
  latestWeight,
}) => {
  const [currentWeight, setCurrentWeight] = useState<number>(latestWeight || profile.weight);
  const [workoutAdherence, setWorkoutAdherence] = useState<number>(90);
  const [dietAdherence, setDietAdherence] = useState<number>(85);
  const [energyLevel, setEnergyLevel] = useState<string>("High & Strong");
  const [recoveryStatus, setRecoveryStatus] = useState<string>("Good recovery, mild chest/leg soreness");
  const [healthStatusUpdate, setHealthStatusUpdate] = useState<string>(
    profile.healthIssues && profile.healthIssues.length > 0
      ? `Monitoring: ${profile.healthIssues.join(", ")} - Feeling comfortable with current modifications.`
      : "No injuries or joint pains."
  );
  const [userNotes, setUserNotes] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  if (!isOpen) return null;

  const weightDifference = Number((currentWeight - profile.weight).toFixed(1));

  const handleRunWeeklyReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const payload = {
        userProfile: profile,
        currentPlan: currentPlan,
        weeklyCheckIn: {
          currentWeight,
          weightDifference,
          workoutAdherence,
          dietAdherence,
          energyLevel,
          recoveryStatus,
          healthStatusUpdate,
          userNotes,
        },
      };

      const response = await fetch("/api/update-weekly-diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success && data.data) {
        setAiResult(data.data);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } else {
        throw new Error(data.error || "Failed to update weekly diet.");
      }
    } catch (err: any) {
      console.error("Weekly review error:", err);
      setErrorMessage(err.message || "Failed to connect to AI Coach. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptAndApply = () => {
    if (!aiResult) return;

    const newPlan: FullPlan = {
      ...currentPlan,
      version: (currentPlan.version || 1) + 1,
      summary: {
        ...currentPlan.summary,
        caloriesTarget: aiResult.updatedSummary?.caloriesTarget || currentPlan.summary.caloriesTarget,
        proteinGrams: aiResult.updatedSummary?.proteinGrams || currentPlan.summary.proteinGrams,
        carbsGrams: aiResult.updatedSummary?.carbsGrams || currentPlan.summary.carbsGrams,
        fatsGrams: aiResult.updatedSummary?.fatsGrams || currentPlan.summary.fatsGrams,
        waterLiters: aiResult.updatedSummary?.waterLiters || currentPlan.summary.waterLiters,
        coachInsight: aiResult.updatedSummary?.coachInsight || aiResult.weeklyAnalysis?.coachWeeklyAdvice || currentPlan.summary.coachInsight,
      },
      dietChart: {
        ...currentPlan.dietChart,
        meals: aiResult.updatedDietMeals || currentPlan.dietChart.meals,
      },
    };

    const checkInRecord: WeeklyCheckIn = {
      id: `checkin-${Date.now()}`,
      weekNumber: currentPlan.version || 1,
      date: new Date().toISOString().split("T")[0],
      currentWeight,
      weightDifference,
      workoutAdherence,
      dietAdherence,
      energyLevel,
      recoveryStatus,
      healthStatusUpdate,
      userNotes,
      aiAnalysis: aiResult.weeklyAnalysis,
    };

    onApplyUpdatedPlan(newPlan, checkInRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 text-slate-100">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Weekly Progress Check-in & AI Diet Calibrator
              </h2>
              <p className="text-xs text-slate-400">
                Har hafte apne weight aur progress ke hisab se diet aur workout recalibrate karein
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* If Result Ready -> Show Review Screen */}
          {aiResult ? (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">
                    Weekly Analysis Verdict
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {aiResult.weeklyAnalysis?.verdict || "Progress Calibrated"}
                  </h3>
                  <p className="text-xs text-emerald-200/90 mt-1 leading-relaxed">
                    {aiResult.weeklyAnalysis?.weightTrendAnalysis}
                  </p>
                </div>
              </div>

              {/* Calorie & Macro Shift Comparison */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Adjustment</div>
                  <div className="text-lg font-extrabold text-indigo-400 mt-0.5">
                    {aiResult.weeklyAnalysis?.calorieAdjustment}
                  </div>
                  <div className="text-[10px] text-slate-400">vs Previous Week</div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
                  <div className="text-[10px] font-bold text-amber-400 uppercase">New Calories</div>
                  <div className="text-lg font-extrabold text-white mt-0.5">
                    {aiResult.updatedSummary?.caloriesTarget} kcal
                  </div>
                  <div className="text-[10px] text-slate-500">
                    (Was {currentPlan.summary.caloriesTarget})
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase">New Protein</div>
                  <div className="text-lg font-extrabold text-emerald-300 mt-0.5">
                    {aiResult.updatedSummary?.proteinGrams}g
                  </div>
                  <div className="text-[10px] text-slate-500">
                    (Was {currentPlan.summary.proteinGrams}g)
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
                  <div className="text-[10px] font-bold text-cyan-400 uppercase">Daily Water</div>
                  <div className="text-lg font-extrabold text-cyan-300 mt-0.5">
                    {aiResult.updatedSummary?.waterLiters}L
                  </div>
                  <div className="text-[10px] text-slate-500">Hydration target</div>
                </div>
              </div>

              {/* Coach Weekly Advice */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
                <div className="font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Coach Next 7-Day Action Plan:
                </div>
                <p className="leading-relaxed text-slate-300">
                  {aiResult.weeklyAnalysis?.coachWeeklyAdvice}
                </p>
                {aiResult.weeklyAnalysis?.healthRecoveryNotes && (
                  <div className="text-amber-300/90 pt-1 border-t border-slate-800 flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{aiResult.weeklyAnalysis.healthRecoveryNotes}</span>
                  </div>
                )}
              </div>

              {/* Workout Modifications */}
              {aiResult.workoutModifications && aiResult.workoutModifications.length > 0 && (
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">
                    🏋️‍♂️ Next Week Workout Adjustments:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {aiResult.workoutModifications.map((mod: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                        <span>{mod}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAiResult(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Edit Input Values
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAndApply}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <Award className="w-4 h-4" /> Apply & Update My Diet Chart
                </button>
              </div>
            </div>
          ) : (
            /* Check-in Form */
            <form onSubmit={handleRunWeeklyReview} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Current Measured Weight (kg) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                    <Scale className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Starting: {profile.weight} kg (
                    {weightDifference > 0
                      ? `+${weightDifference} kg change`
                      : `${weightDifference} kg change`}
                    )
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Energy & Strength in Gym
                  </label>
                  <select
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Peak Energy & Increasing Weights">Peak Energy (PRs breaking, heavy weights)</option>
                    <option value="High & Strong">High & Strong (Consistent performance)</option>
                    <option value="Moderate / Normal">Moderate / Normal</option>
                    <option value="Fatigued / Low Recovery">Fatigued / Feeling drained</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Workout Adherence (Consistency)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="30"
                      max="100"
                      step="5"
                      value={workoutAdherence}
                      onChange={(e) => setWorkoutAdherence(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                    <span className="text-xs font-bold text-emerald-400 w-12 text-right">
                      {workoutAdherence}%
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Diet & Protein Adherence
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="30"
                      max="100"
                      step="5"
                      value={dietAdherence}
                      onChange={(e) => setDietAdherence(Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                    <span className="text-xs font-bold text-indigo-400 w-12 text-right">
                      {dietAdherence}%
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Muscle Recovery & Soreness Status
                </label>
                <input
                  type="text"
                  value={recoveryStatus}
                  onChange={(e) => setRecoveryStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Chest sore for 2 days, back feeling very stable."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Health / Injury Check (Any Pain or Symptoms this week?)
                </label>
                <input
                  type="text"
                  value={healthStatusUpdate}
                  onChange={(e) => setHealthStatusUpdate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Slight knee twinge on heavy press, need safer quad variation."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Weekly Notes / How do you feel? (Optional)
                </label>
                <textarea
                  rows={2}
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. I felt hungry late night; weight increased by 0.5kg as expected."
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      AI Calibrating Next Week&apos;s Diet...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Analyze & Recalibrate Diet
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
