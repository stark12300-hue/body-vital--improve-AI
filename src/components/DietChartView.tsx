import React, { useState } from "react";
import { DietChart, FullPlan, Meal, MealItem, PlanSummary, UserProfile } from "../types";
import {
  Apple,
  ArrowDownToLine,
  Check,
  ChevronDown,
  Clock,
  Download,
  Droplets,
  Flame,
  Info,
  Pill,
  RefreshCw,
  Sparkles,
  Utensils,
  Zap,
} from "lucide-react";

interface DietChartViewProps {
  plan: FullPlan;
  profile: UserProfile;
  onOpenChatWithQuery?: (query: string) => void;
  onOpenWeeklyModal?: () => void;
  onOpenDownloadModal?: () => void;
}

export const DietChartView: React.FC<DietChartViewProps> = ({
  plan,
  profile,
  onOpenChatWithQuery,
  onOpenWeeklyModal,
  onOpenDownloadModal,
}) => {
  const { summary, dietChart } = plan;

  // Water intake state
  const [loggedWaterMl, setLoggedWaterMl] = useState<number>(1500);
  const targetWaterMl = (summary.waterLiters || 3.5) * 1000;

  // Swapped food item tracking
  const [swappedFoodMap, setSwappedFoodMap] = useState<Record<string, boolean>>({});

  const toggleFoodSwap = (foodKey: string) => {
    setSwappedFoodMap((prev) => ({
      ...prev,
      [foodKey]: !prev[foodKey],
    }));
  };

  const addWaterGlass = (ml: number) => {
    setLoggedWaterMl((prev) => Math.min(targetWaterMl + 1000, prev + ml));
  };

  const proteinPerKg = (summary.proteinGrams / (profile.weight || 70)).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Nutrition Header Cards */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Custom Nutrition Blueprint
              </span>
              <span className="text-xs text-slate-400">
                Category: <strong className="text-slate-200 capitalize">{profile.dietPreference} Diet</strong>
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {dietChart.dietType || "Targeted Bodybuilding Diet Chart"}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              {summary.coachInsight}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenDownloadModal && (
              <button
                onClick={onOpenDownloadModal}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all shadow-md"
                title="Download printable PDF diet chart or install app"
              >
                <ArrowDownToLine className="w-3.5 h-3.5 text-indigo-400" />
                <span>Download / Save PDF</span>
              </button>
            )}

            <button
              onClick={onOpenWeeklyModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Weekly Progress Diet Update</span>
            </button>
          </div>
        </div>

        {/* Macro KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-3.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Daily Target
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {summary.caloriesTarget}{" "}
              <span className="text-xs font-semibold text-slate-400">kcal</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">BMR: ~{summary.bmr || 1650} kcal</div>
          </div>

          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-3.5 bg-emerald-950/10">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" /> Protein Goal
            </div>
            <div className="text-2xl font-black text-emerald-300 mt-1">
              {summary.proteinGrams}{" "}
              <span className="text-xs font-semibold text-slate-400">g</span>
            </div>
            <div className="text-[11px] text-emerald-400/80 mt-0.5 font-medium">
              {proteinPerKg}g per kg bodyweight
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-3.5">
            <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-indigo-400" /> Carbs Energy
            </div>
            <div className="text-2xl font-black text-indigo-200 mt-1">
              {summary.carbsGrams}{" "}
              <span className="text-xs font-semibold text-slate-400">g</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Complex & clean carbs</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-3.5">
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Apple className="w-3.5 h-3.5 text-amber-400" /> Healthy Fats
            </div>
            <div className="text-2xl font-black text-amber-200 mt-1">
              {summary.fatsGrams}{" "}
              <span className="text-xs font-semibold text-slate-400">g</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Hormone & joint support</div>
          </div>
        </div>

        {/* Interactive Hydration Tracker */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                Daily Hydration Goal:{" "}
                <span className="text-cyan-400">{summary.waterLiters} Liters ({targetWaterMl}ml)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Logged today: <strong className="text-cyan-300">{(loggedWaterMl / 1000).toFixed(2)}L</strong> ({Math.round((loggedWaterMl / targetWaterMl) * 100)}%)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => addWaterGlass(250)}
              className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/60 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              +1 Glass (250ml)
            </button>
            <button
              onClick={() => addWaterGlass(500)}
              className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/60 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              +1 Shaker (500ml)
            </button>
          </div>
        </div>
      </div>

      {/* Health-Specific Diet Guidance Banner */}
      {summary.healthPrecautions && summary.healthPrecautions.length > 0 && (
        <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200">
          <h4 className="font-bold text-amber-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-400 shrink-0" /> Health Aware Dietary Precautions:
          </h4>
          <ul className="space-y-1 pl-5 list-disc text-amber-100/90">
            {summary.healthPrecautions.map((caution, i) => (
              <li key={i}>{caution}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Meal by Meal Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Utensils className="w-4 h-4 text-emerald-400" /> Meal-By-Meal Nutrition Plan ({dietChart.meals.length} Meals)
          </h2>
          <span className="text-xs text-slate-400">Click swap for budget or taste alternatives</span>
        </div>

        <div className="space-y-4">
          {dietChart.meals.map((meal: Meal, mealIdx: number) => (
            <div
              key={mealIdx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3"
            >
              {/* Meal Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-extrabold flex items-center justify-center text-xs shrink-0">
                    M{mealIdx + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">{meal.mealName}</h3>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Suggested Timing: <strong className="text-slate-300">{meal.timing}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs font-bold text-emerald-300">
                    {meal.mealProtein}g Protein
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300">
                    {meal.mealCalories} kcal
                  </div>
                </div>
              </div>

              {/* Meal Food Items */}
              <div className="space-y-2">
                {meal.items.map((item: MealItem, itemIdx: number) => {
                  const foodKey = `${mealIdx}-${itemIdx}`;
                  const isSwapped = swappedFoodMap[foodKey];
                  const displayFood = isSwapped && item.alternative ? item.alternative : item.food;

                  return (
                    <div
                      key={itemIdx}
                      className="bg-slate-950/60 border border-slate-800/70 hover:border-slate-700 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-slate-200">{displayFood}</div>
                          {isSwapped && (
                            <span className="text-[10px] text-amber-400 font-semibold">
                              (Alternative Option Active)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="text-right text-[11px]">
                          <span className="text-emerald-400 font-bold">{item.protein}g Prot</span>
                          <span className="text-slate-500 mx-1.5">•</span>
                          <span className="text-slate-400">{item.calories} kcal</span>
                        </div>

                        {item.alternative && (
                          <button
                            onClick={() => toggleFoodSwap(foodKey)}
                            className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-300 transition-colors flex items-center gap-1"
                            title="Swap for substitute"
                          >
                            <RefreshCw className="w-3 h-3" />
                            {isSwapped ? "Original" : "Swap"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Meal Notes / Digestion tip */}
              {meal.notes && (
                <div className="text-[11px] text-slate-400 bg-slate-950/30 px-3 py-1.5 rounded-lg border border-slate-800/40 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{meal.notes}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Supplements Guidance Section */}
      {dietChart.supplementsGuidance && dietChart.supplementsGuidance.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Pill className="w-4 h-4 text-indigo-400" /> Evidence-Based Supplement Guide
            </h2>
            <span className="text-xs text-slate-400">Optional support for optimum recovery</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dietChart.supplementsGuidance.map((supp, sIdx) => (
              <div
                key={sIdx}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <span>{supp.name}</span>
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      supp.isOptional
                        ? "bg-slate-800 text-slate-400"
                        : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                    }`}
                  >
                    {supp.isOptional ? "Optional" : "Recommended"}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{supp.purpose}</p>
                <div className="text-[11px] text-emerald-400/90 font-medium bg-emerald-950/20 p-2 rounded-lg border border-emerald-500/20">
                  <strong>Dosage & Timing:</strong> {supp.dosageTiming}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Ask query regarding diet */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-white">Diet mein koi recipe ya replacement chahiye?</h4>
          <p className="text-xs text-slate-400">
            AI Coach se puchiye: &quot;Hostel mein bina cooking protein kaise lein?&quot; ya &quot;Paneer digestion heavy ho toh kya khayein?&quot;
          </p>
        </div>
        <button
          onClick={() => onOpenChatWithQuery && onOpenChatWithQuery("Vegetarian high-protein diet ke budget friendly alternatives aur meal prep tips bataiye.")}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shrink-0 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" /> Ask AI Nutrition Coach
        </button>
      </div>
    </div>
  );
};
