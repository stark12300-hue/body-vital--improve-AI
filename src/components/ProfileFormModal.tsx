import React, { useState } from "react";
import { UserProfile } from "../types";
import { Activity, AlertTriangle, Check, Dumbbell, HeartPulse, Sparkles, Utensils, X } from "lucide-react";

interface ProfileFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProfile: UserProfile;
  onSaveAndGenerate: (profile: UserProfile) => Promise<void>;
  isLoading: boolean;
}

const COMMON_HEALTH_ISSUES = [
  { id: "Lower Back Pain / Slip Disc", label: "Lower Back Pain / Slip Disc (Kamar dard)", icon: "🛡️", desc: "Spinal compression avoid karke chest-supported exercises suggest hongi." },
  { id: "Knee Joint Pain / Meniscus", label: "Knee Pain / Ligament Issue (Ghutne ka dard)", icon: "🦵", desc: "Deep squat flexion ke bajaye joint-friendly quad variations." },
  { id: "Shoulder Impingement / Rotator Cuff", label: "Shoulder Impingement (Kandhe mein dard)", icon: "💪", desc: "Behind-neck presses band, neutral grip aur rotator cuff warmup." },
  { id: "High Blood Pressure (Hypertension)", label: "High Blood Pressure (BP issue)", icon: "❤️", desc: "Extreme heavy breath-holding (Valsalva) avoided, low sodium diet." },
  { id: "Diabetes / Pre-Diabetes", label: "Type 2 Diabetes / Insulin Resistance", icon: "🩸", desc: "Low glycemic index carbs aur high fiber diet structure." },
  { id: "Uric Acid / Gout", label: "High Uric Acid / Joint Gout", icon: "🧪", desc: "High purine sources ko balance karke clean hydration plan." },
  { id: "Asthma / Breathing Issue", label: "Asthma / Respiratory Sensitivity", icon: "🫁", desc: "Steady rest intervals aur gradual heart rate ramp-up." },
  { id: "Lactose Intolerance / Weak Digestion", label: "Lactose Intolerance (Doodh/Dairy allergy)", icon: "🥛", desc: "Lactose-free whey, plant protein, tofu aur curd focus." },
  { id: "Cervical / Neck Stiffness", label: "Cervical / Neck Pain", icon: "🧘", desc: "Trapezius shrugs aur neck alignment cues." },
];

export const ProfileFormModal: React.FC<ProfileFormModalProps> = ({
  isOpen,
  onClose,
  initialProfile,
  onSaveAndGenerate,
  isLoading,
}) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  if (!isOpen) return null;

  const toggleHealthIssue = (issue: string) => {
    setProfile((prev) => {
      const exists = prev.healthIssues.includes(issue);
      if (exists) {
        return { ...prev, healthIssues: prev.healthIssues.filter((i) => i !== issue) };
      } else {
        return { ...prev, healthIssues: [...prev.healthIssues, issue] };
      }
    });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveAndGenerate(profile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 text-slate-100">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Body Profile & Health Assessment
              </h2>
              <p className="text-xs text-slate-400">
                Aapki body details aur health status ke hisab se AI Custom Plan banayega
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 border-b border-slate-800 text-xs font-semibold text-center bg-slate-950/60">
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`py-3 transition-colors flex items-center justify-center gap-1.5 ${
              activeStep === 1
                ? "text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/10 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> 1. Body Stats
          </button>
          <button
            type="button"
            onClick={() => setActiveStep(2)}
            className={`py-3 transition-colors flex items-center justify-center gap-1.5 ${
              activeStep === 2
                ? "text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/10 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" /> 2. Goals & Workout
          </button>
          <button
            type="button"
            onClick={() => setActiveStep(3)}
            className={`py-3 transition-colors flex items-center justify-center gap-1.5 ${
              activeStep === 3
                ? "text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/10 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Utensils className="w-3.5 h-3.5" /> 3. Diet & Budget
          </button>
          <button
            type="button"
            onClick={() => setActiveStep(4)}
            className={`py-3 transition-colors flex items-center justify-center gap-1.5 ${
              activeStep === 4
                ? "text-emerald-400 border-b-2 border-emerald-500 bg-emerald-500/10 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" /> 4. Health & Injuries
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleGenerate} className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* STEP 1: Body Stats */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Aapka Naam / Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Rahul, Aman"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Age / Umar (Years)
                  </label>
                  <input
                    type="number"
                    min="14"
                    max="80"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Gender
                  </label>
                  <select
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="male">Male (Purush)</option>
                    <option value="female">Female (Mahila)</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    min="120"
                    max="230"
                    value={profile.height}
                    onChange={(e) => setProfile({ ...profile, height: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="175 cm (~5ft 9in)"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Current Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="35"
                    max="200"
                    value={profile.weight}
                    onChange={(e) => setProfile({ ...profile, weight: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. 70"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Target Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="35"
                    max="200"
                    value={profile.targetWeight}
                    onChange={(e) => setProfile({ ...profile, targetWeight: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. 75"
                    required
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {profile.targetWeight > profile.weight
                      ? `Goal: +${(profile.targetWeight - profile.weight).toFixed(1)} kg Lean Muscle Gain`
                      : profile.targetWeight < profile.weight
                      ? `Goal: -${(profile.weight - profile.targetWeight).toFixed(1)} kg Fat Loss`
                      : "Goal: Body Recomposition (Maintain weight, build muscle)"}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Experience Level / Anubhav
                  </label>
                  <select
                    value={profile.experienceLevel}
                    onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="beginner">Beginner (Shuruat / 0-6 months)</option>
                    <option value="intermediate">Intermediate (6 months - 2 years)</option>
                    <option value="advanced">Advanced (2+ years heavy training)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Goals & Workout */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Primary Fitness / Bodybuilding Goal
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: "muscle_building", title: "Muscle Building (Hypertrophy)", desc: "Solid muscle size, boulder shoulders, chest growth & high protein" },
                    { id: "lean_bulk", title: "Clean Lean Bulking", desc: "Gain pure muscle mass with minimum fat gain" },
                    { id: "fat_loss", title: "Fat Loss & Six-Pack Cut", desc: "Burn stubborn belly fat while protecting lean muscle" },
                    { id: "strength", title: "Strength & Power", desc: "Max bench, squat, overhead press & athletic power" },
                    { id: "recomp", title: "Body Recomposition", desc: "Lose fat and build muscle simultaneously at current weight" },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setProfile({ ...profile, goal: g.id as any })}
                      className={`p-3.5 rounded-xl text-left border transition-all ${
                        profile.goal === g.id
                          ? "bg-indigo-600/20 border-indigo-500 text-white shadow-lg ring-1 ring-indigo-500/50"
                          : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <div className="font-bold text-sm text-indigo-300 mb-1 flex items-center justify-between">
                        {g.title}
                        {profile.goal === g.id && <Check className="w-4 h-4 text-indigo-400" />}
                      </div>
                      <div className="text-xs text-slate-400">{g.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Workout Location
                  </label>
                  <select
                    value={profile.workoutLocation}
                    onChange={(e) => setProfile({ ...profile, workoutLocation: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="gym">Gym (Full Equipment & Cables)</option>
                    <option value="home_equipment">Home Gym (Dumbbells / Rod)</option>
                    <option value="bodyweight_only">Home / Calisthenics (No weights)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Days / Week (Din)
                  </label>
                  <select
                    value={profile.daysPerWeek}
                    onChange={(e) => setProfile({ ...profile, daysPerWeek: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value={3}>3 Days (Full Body / Alternate)</option>
                    <option value={4}>4 Days (Upper / Lower Split)</option>
                    <option value={5}>5 Days (Push-Pull-Legs-Upper-Lower)</option>
                    <option value={6}>6 Days (Push-Pull-Legs x 2)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Session Duration
                  </label>
                  <select
                    value={profile.workoutDuration}
                    onChange={(e) => setProfile({ ...profile, workoutDuration: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value={45}>45 Minutes (Quick & Intense)</option>
                    <option value={60}>60 Minutes (Standard Gold Standard)</option>
                    <option value={75}>75 Minutes (Heavy Hypertrophy)</option>
                    <option value={90}>90 Minutes (Bodybuilding Split)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Diet & Nutrition Preferences */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Dietary Category (Aapka Khana)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: "veg", title: "Vegetarian", emoji: "🥦", sub: "Paneer, Soya, Dal, Milk, Oats" },
                    { id: "eggetarian", title: "Eggetarian", emoji: "🥚", sub: "Eggs + Vegetarian Meals" },
                    { id: "non_veg", title: "Non-Veg", emoji: "🍗", sub: "Chicken, Fish, Eggs, Paneer" },
                    { id: "vegan", title: "Pure Vegan", emoji: "🌱", sub: "Plant-only (Tofu, Soya, Pulses)" },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setProfile({ ...profile, dietPreference: d.id as any })}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        profile.dietPreference === d.id
                          ? "bg-emerald-600/20 border-emerald-500 text-white shadow-lg ring-1 ring-emerald-500/50"
                          : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <div className="text-xl mb-1">{d.emoji}</div>
                      <div className="font-bold text-xs text-emerald-300">{d.title}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{d.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Cuisine / Food Style
                  </label>
                  <input
                    type="text"
                    value={profile.cuisinePreference}
                    onChange={(e) => setProfile({ ...profile, cuisinePreference: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. North Indian (Roti, Dal, Paneer, Rice)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Diet Budget
                  </label>
                  <select
                    value={profile.budgetPreference}
                    onChange={(e) => setProfile({ ...profile, budgetPreference: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="budget_friendly">Budget Friendly (Soya Chunks, Eggs/Paneer, Dal, Sattu, Peanuts)</option>
                    <option value="moderate">Moderate (Whey Protein, Paneer, Oats, Chicken/Tofu, Greek Yogurt)</option>
                    <option value="premium">Premium (Isolate Whey, Salmon/Fish, Almond Butter, Superfoods)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Health Issues & Injuries Tracking */}
          {activeStep === 4 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200/90 leading-relaxed">
                  <strong>Personal Health & Injury Protection:</strong> Agar aapko koi kamar dard, ghutne ka dard, ya BP/Sugar ki dikkat hai toh zaroor select karein. AI automatically harmful exercises ko block karke safe alternatives plan karega.
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Select Any Existing Health Issues / Injuries:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {COMMON_HEALTH_ISSUES.map((issue) => {
                    const isSelected = profile.healthIssues.includes(issue.id);
                    return (
                      <button
                        key={issue.id}
                        type="button"
                        onClick={() => toggleHealthIssue(issue.id)}
                        className={`p-3 rounded-xl text-left border transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? "bg-red-950/40 border-red-500 text-white ring-1 ring-red-500/50"
                            : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <span className="text-lg">{issue.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold flex items-center justify-between">
                            <span className={isSelected ? "text-red-300" : "text-slate-200"}>{issue.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{issue.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Additional Medical Notes / Doctor Guidance (Optional)
                </label>
                <textarea
                  rows={2}
                  value={profile.healthNotes}
                  onChange={(e) => setProfile({ ...profile, healthNotes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Doctor advised not to do heavy deadlifts; slightly low energy in the morning."
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <div>
              {activeStep > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => (prev - 1) as any)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Back
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {activeStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => (prev + 1) as any)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center gap-1.5 shadow-lg shadow-indigo-600/30"
                >
                  Next Step &rarr;
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/40 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      AI Generating Custom Plan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate AI Workout & Diet Plan
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
