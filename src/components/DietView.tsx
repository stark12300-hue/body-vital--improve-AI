import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { Meal, MealItem } from '../types';
import { 
  Utensils, 
  Droplets, 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Plus, 
  RotateCcw, 
  Info, 
  Check, 
  Shuffle, 
  Layers,
  Leaf,
  Heart
} from 'lucide-react';

export const DietView: React.FC = () => {
  const { dietPlan, language, waterIntakeMl, addWater, resetWater, userProfile } = useFitness();
  const [activeSwapView, setActiveSwapView] = useState<Record<string, 'standard' | 'veg_swap' | 'quick_alt'>>({});
  const [checkedMeals, setCheckedMeals] = useState<Record<string, boolean>>({});

  if (!dietPlan) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 shadow-sm">
        <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-3 animate-pulse" />
        <h3 className="text-lg font-bold text-slate-900">No Diet Plan Available</h3>
        <p className="text-xs mt-1">Please complete the initial assessment to calculate your custom nutrition chart.</p>
      </div>
    );
  }

  const { macroTargets, meals, healthPrecautions, hydrationGuidelines, supplementRecommendations } = dietPlan;
  const targetWaterMl = (macroTargets.waterLiters || 3.5) * 1000;
  const waterProgressPct = Math.min(100, Math.round((waterIntakeMl / targetWaterMl) * 100));

  const toggleMealCheck = (mealId: string) => {
    setCheckedMeals((prev) => ({
      ...prev,
      [mealId]: !prev[mealId],
    }));
  };

  const setMealMode = (mealId: string, mode: 'standard' | 'veg_swap' | 'quick_alt') => {
    setActiveSwapView((prev) => ({
      ...prev,
      [mealId]: mode,
    }));
  };

  return (
    <div id="diet-view-container" className="space-y-6">
      {/* Top Banner: Nutrition Strategy */}
      <div className="p-6 bg-white border border-slate-200/90 rounded-3xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Week {dietPlan.weekNumber || 1} Nutrition Blueprint</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Personalized Diet & Macro Chart
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed font-medium">
              {language === 'english' ? dietPlan.overview : dietPlan.hindiOverview || dietPlan.overview}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold capitalize">
              {userProfile?.dietType?.replace('_', ' ') || 'Vegetarian'}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold capitalize">
              {userProfile?.cuisinePreference?.replace('_', ' ') || 'Indian'}
            </span>
          </div>
        </div>

        {/* Health Conditions Dietary Adaptations */}
        {healthPrecautions && healthPrecautions.length > 0 && (
          <div className="mt-4 p-3.5 bg-teal-50 border border-teal-200 rounded-2xl flex items-start gap-2.5 text-xs text-teal-900">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-teal-950 font-bold">Health-Tailored Nutrition Rules:</strong>
              <ul className="mt-1 space-y-0.5 list-disc list-inside text-slate-600 text-[11px]">
                {healthPrecautions.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Target Macros Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          {
            label: 'Daily Calories',
            val: `${macroTargets.calories}`,
            unit: 'kcal',
            color: 'text-amber-600',
            bg: 'bg-amber-50/50 border-amber-200',
            sub: 'Energy Target',
          },
          {
            label: 'Protein Target',
            val: `${macroTargets.proteinGrams}`,
            unit: 'g',
            color: 'text-emerald-600',
            bg: 'bg-emerald-50/50 border-emerald-200',
            sub: `${Math.round((macroTargets.proteinGrams * 4 / macroTargets.calories) * 100)}% of calories`,
          },
          {
            label: 'Carbohydrates',
            val: `${macroTargets.carbsGrams}`,
            unit: 'g',
            color: 'text-blue-600',
            bg: 'bg-blue-50/50 border-blue-200',
            sub: 'Complex energy',
          },
          {
            label: 'Healthy Fats',
            val: `${macroTargets.fatsGrams}`,
            unit: 'g',
            color: 'text-rose-600',
            bg: 'bg-rose-50/50 border-rose-200',
            sub: 'Hormone health',
          },
          {
            label: 'Dietary Fiber',
            val: `${macroTargets.fiberGrams || 32}`,
            unit: 'g',
            color: 'text-teal-600',
            bg: 'bg-teal-50/50 border-teal-200',
            sub: 'Gut & digestion',
          },
          {
            label: 'Daily Water',
            val: `${macroTargets.waterLiters}`,
            unit: 'Liters',
            color: 'text-cyan-600',
            bg: 'bg-cyan-50/50 border-cyan-200',
            sub: 'Hydration quota',
          },
        ].map((m, idx) => (
          <div key={idx} className={`p-4 rounded-2xl border ${m.bg} bg-white shadow-2xs flex flex-col justify-between`}>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{m.label}</div>
            <div className="my-1.5 flex items-baseline gap-1">
              <span className={`text-2xl font-bold font-mono ${m.color}`}>{m.val}</span>
              <span className="text-xs text-slate-400 font-semibold">{m.unit}</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Hydration Tracker Card */}
      <div className="p-5 sm:p-6 bg-white border border-slate-200/90 rounded-3xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 shadow-2xs">
            <Droplets className="w-8 h-8" />
            <div
              className="absolute inset-0 rounded-2xl border-2 border-cyan-500 pointer-events-none opacity-60"
              style={{ clipPath: `inset(0 0 ${100 - waterProgressPct}% 0)` }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Daily Hydration Log</h3>
              <span className="text-xs font-mono font-bold text-cyan-600">
                {(waterIntakeMl / 1000).toFixed(1)} / {macroTargets.waterLiters}L ({waterProgressPct}%)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {hydrationGuidelines || 'Drink water steadily throughout the day to support recovery and joint health.'}
            </p>
          </div>
        </div>

        {/* Quick tap buttons */}
        <div className="flex items-center gap-2">
          <button
            id="btn-add-water-250"
            onClick={() => addWater(250)}
            className="px-3.5 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-800 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" /> 1 Glass (250ml)
          </button>
          <button
            id="btn-add-water-500"
            onClick={() => addWater(500)}
            className="px-3.5 py-2 rounded-xl bg-cyan-100 hover:bg-cyan-200 border border-cyan-300 text-cyan-900 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" /> 1 Bottle (500ml)
          </button>
          <button
            onClick={resetWater}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            title="Reset water count"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Meal Schedule Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            Daily Meal Breakdown & Recipes
          </h3>
          <span className="text-xs text-slate-500 font-bold">
            {Object.values(checkedMeals).filter(Boolean).length}/{meals.length} Meals Eaten
          </span>
        </div>

        {meals.map((meal, index) => {
          const isDone = Boolean(checkedMeals[meal.id]);
          const mode = activeSwapView[meal.id] || 'standard';

          return (
            <div
              key={meal.id}
              id={`meal-card-${meal.id}`}
              className={`bg-white border rounded-3xl p-5 sm:p-6 transition-all ${
                isDone
                  ? 'border-emerald-300 bg-emerald-50/20 shadow-xs'
                  : 'border-slate-200/90 shadow-xs hover:border-slate-300'
              }`}
            >
              {/* Meal Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <button
                    id={`btn-toggle-meal-${meal.id}`}
                    onClick={() => toggleMealCheck(meal.id)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                    title={isDone ? 'Mark as not eaten' : 'Mark as eaten'}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : <Utensils className="w-4 h-4" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-blue-700 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200">
                        {meal.timeSlot}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 tracking-tight">{meal.title}</h4>
                      {meal.hindiTitle && (
                        <span className="text-xs text-slate-500 font-medium">({meal.hindiTitle})</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Macro pill summary */}
                <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                    {meal.calories} kcal
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                    {meal.protein}g P
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-medium">
                    {meal.carbs}g C
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 font-medium">
                    {meal.fats}g F
                  </span>
                </div>
              </div>

              {/* Recipe / Swap Tabs */}
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setMealMode(meal.id, 'standard')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    mode === 'standard'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  Standard Meal
                </button>
                {meal.swaps?.vegetarianSwap && (
                  <button
                    onClick={() => setMealMode(meal.id, 'veg_swap')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      mode === 'veg_swap'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    <Leaf className="w-3 h-3" /> Veg Swap
                  </button>
                )}
                {meal.swaps?.quickAlternative && (
                  <button
                    onClick={() => setMealMode(meal.id, 'quick_alt')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      mode === 'quick_alt'
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-amber-700 bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    <Shuffle className="w-3 h-3" /> 5-Min Quick Alternative
                  </button>
                )}
              </div>

              {/* Meal Content based on selected mode */}
              <div className="mt-3.5">
                {mode === 'standard' && (
                  <div className="space-y-2.5">
                    {meal.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {item.name}{' '}
                            {item.hindiName && <span className="text-slate-500 font-medium">({item.hindiName})</span>}
                          </div>
                          {item.description && (
                            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{item.description}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs shrink-0 font-mono">
                          <span className="text-slate-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 text-[11px] font-bold">
                            {item.portion}
                          </span>
                          <span className="text-emerald-700 font-bold">{item.protein}g protein</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {mode === 'veg_swap' && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-slate-800">
                    <div className="font-bold text-emerald-800 mb-1 flex items-center gap-1.5">
                      <Leaf className="w-3.5 h-3.5 text-emerald-600" /> High Protein Plant / Vegetarian Swap:
                    </div>
                    <p className="leading-relaxed text-[11px] text-slate-700 font-medium">{meal.swaps?.vegetarianSwap}</p>
                  </div>
                )}

                {mode === 'quick_alt' && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-slate-800">
                    <div className="font-bold text-amber-800 mb-1 flex items-center gap-1.5">
                      <Shuffle className="w-3.5 h-3.5 text-amber-600" /> 5-Minute Quick Alternative:
                    </div>
                    <p className="leading-relaxed text-[11px] text-slate-700 font-medium">{meal.swaps?.quickAlternative}</p>
                  </div>
                )}
              </div>

              {/* Health Benefit Note */}
              {meal.healthBenefitNote && (
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-teal-800 font-medium">
                  <Heart className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>{meal.healthBenefitNote}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Safe Supplements Section */}
      {supplementRecommendations && supplementRecommendations.length > 0 && (
        <div className="p-6 bg-white border border-slate-200/90 rounded-3xl shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Scientifically Safe Supplement Recommendations (Optional)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {supplementRecommendations.map((supp, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 font-bold">{supp.name}</strong>
                  <span className="text-[10px] text-blue-700 font-bold bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                    {supp.isOptional ? 'Optional' : 'Recommended'}
                  </span>
                </div>
                <div className="text-slate-500 text-[11px] mt-1 font-medium">
                  <span className="text-amber-700 font-bold">Timing:</span> {supp.timing}
                </div>
                <p className="text-slate-600 text-[11px] mt-1 leading-normal font-medium">{supp.purpose}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
