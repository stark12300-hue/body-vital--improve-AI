import React, { useState } from "react";
import { FullPlan, UserProfile } from "../types";
import {
  AlertTriangle,
  CheckCircle2,
  Edit3,
  HeartPulse,
  Plus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";

interface HealthIssuesViewProps {
  profile: UserProfile;
  plan: FullPlan;
  onOpenProfileModal: () => void;
  onOpenChatWithQuery?: (query: string) => void;
}

const HEALTH_SAFETY_KNOWLEDGE: Record<
  string,
  {
    cautions: string[];
    strictlyAvoid: string[];
    safeReplacements: string[];
    dietAdjustments: string[];
  }
> = {
  "Lower Back Pain / Slip Disc": {
    cautions: [
      "Maintain neutral lumbar spine at all times.",
      "Avoid heavy axial compression (axial loading through spine).",
      "Engage core before every push or pull movement."
    ],
    strictlyAvoid: [
      "Heavy Conventional Floor Deadlifts",
      "Heavy Barbell Back Squats with forward lean (Good Mornings)",
      "Bent-Over Barbell Rows without chest support",
      "Standing Overhead Military Press with arched lower back"
    ],
    safeReplacements: [
      "Chest-Supported Incline Dumbbell Rows (Zero spinal load)",
      "Leg Press / Goblet Squats with upright torso",
      "Lat Pulldowns & Seated Cable Rows",
      "Bulgarian Split Squats / Dumbbell Lunges"
    ],
    dietAdjustments: [
      "Adequate anti-inflammatory fats (Omega-3 fish/flax oil).",
      "Consistent hydration to keep spinal discs hydrated."
    ]
  },
  "Knee Joint Pain / Meniscus": {
    cautions: [
      "Do not allow knees to cave inwards (valgus collapse).",
      "Warm up knee synovial fluid with 5 mins stationary cycling or backward walking."
    ],
    strictlyAvoid: [
      "Deep heavy knee flexion squats past 90 degrees",
      "High impact plyometric box jumps",
      "Heavy sissy squats"
    ],
    safeReplacements: [
      "Box Squats (sitting back to parallel)",
      "Romanian Deadlifts (Hamstring & Glute focus)",
      "Seated Leg Curls & Controlled Leg Extensions (moderate weight)",
      "Glute Bridges & Hip Thrusts"
    ],
    dietAdjustments: [
      "Glucosamine / Collagen / Vitamin C for joint cartilage.",
      "Curcumin / Turmeric milk for joint inflammation."
    ]
  },
  "Shoulder Impingement / Rotator Cuff": {
    cautions: [
      "Warm up external rotators with light resistance bands before pressing.",
      "Tuck elbows at 45-degree angle during bench presses instead of 90-degree flare."
    ],
    strictlyAvoid: [
      "Behind-the-neck Barbell Presses & Lat Pulldowns",
      "Upright Barbell Rows with narrow grip",
      "Deep dips with excessive shoulder extension"
    ],
    safeReplacements: [
      "Neutral-Grip Dumbbell Bench Press",
      "Incline Dumbbell Press (30° angle)",
      "Face Pulls with external rotation hold",
      "Seated Dumbbell Arnold Press"
    ],
    dietAdjustments: [
      "Adequate protein for tendon repair.",
      "Omega-3 fatty acids to reduce subacromial bursa swelling."
    ]
  },
  "High Blood Pressure (Hypertension)": {
    cautions: [
      "Breathe continuously on concentric contractions; never hold your breath (Valsalva).",
      "Avoid upside-down inversion exercises."
    ],
    strictlyAvoid: [
      "Prolonged maximum isometric breath-holding",
      "Excessive high-stimulant pre-workout powders (>300mg caffeine)"
    ],
    safeReplacements: [
      "Controlled tempo 10-15 rep hypertrophy sets",
      "Low impact steady-state walking cardio (LISS)",
      "Compound machines with back support"
    ],
    dietAdjustments: [
      "Moderate sodium intake (avoid processed namkeen/chips).",
      "High potassium foods (Bananas, Coconut water, Spinach, Potatoes)."
    ]
  },
  "Diabetes / Pre-Diabetes": {
    cautions: [
      "Keep a fast-acting carb (like glucose candy or dates) handy in gym bag.",
      "Resistance training dramatically improves insulin sensitivity."
    ],
    strictlyAvoid: [
      "Sudden high sugar spike post-workout drinks without protein"
    ],
    safeReplacements: [
      "Full body resistance training 3-5 times weekly",
      "Post-meal 10-minute brisk walk"
    ],
    dietAdjustments: [
      "Complex Low-GI Carbs (Oats, Brown Rice, Sweet Potato, Dalia).",
      "High dietary fiber (at least 35-40g/day) with every meal.",
      "Cinnamon (dalchini) in morning oats."
    ]
  }
};

export const HealthIssuesView: React.FC<HealthIssuesViewProps> = ({
  profile,
  plan,
  onOpenProfileModal,
  onOpenChatWithQuery,
}) => {
  const activeIssues = profile.healthIssues || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">
                Health & Injury Guardian
              </span>
              <span className="text-xs text-slate-400">
                Active Tracked Conditions: <strong className="text-white">{activeIssues.length}</strong>
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Personal Health Issue & Joint Safety Manager
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Aapke health conditions ke hisab se workout aur diet auto-filtered hain taaki injury ka risk 0 ho aur muscle building maximum ho sake.
            </p>
          </div>

          <button
            onClick={onOpenProfileModal}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all shrink-0"
          >
            <Edit3 className="w-4 h-4 text-indigo-400" />
            Update Health Profile
          </button>
        </div>

        {/* Current Active Health Badges */}
        <div className="mt-5">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Currently Monitored Conditions:
          </div>
          {activeIssues.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {activeIssues.map((issue, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs font-bold flex items-center gap-2"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{issue}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Koi primary health issue ya injury reported nahi hai. Standard high-intensity bodybuilding protocol active hai.</span>
            </div>
          )}

          {profile.healthNotes && (
            <div className="mt-3 p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300">
              <strong className="text-slate-200">Doctor/User Medical Notes: </strong>
              {profile.healthNotes}
            </div>
          )}
        </div>
      </div>

      {/* Red-Flag vs Green-Flag Safety Protocol Breakdown */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-400" /> Clinical Exercise & Nutrition Guard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strict Red-Flags */}
          <div className="bg-slate-900 border border-rose-900/50 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-rose-400 font-bold text-sm">
              <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>Strictly Avoided Exercises (Red-Flags)</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2 bg-rose-950/20 p-2.5 rounded-xl border border-rose-900/30">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-rose-200">Behind-the-Neck Shoulder Presses: </strong>
                  Places rotator cuff and cervical spine under extreme vulnerable shearing angle.
                </div>
              </li>
              <li className="flex items-start gap-2 bg-rose-950/20 p-2.5 rounded-xl border border-rose-900/30">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-rose-200">Round-Back Heavy Deadlifts: </strong>
                  Causes excessive posterior disc herniation risk. Substituted with chest-supported lifts.
                </div>
              </li>
              <li className="flex items-start gap-2 bg-rose-950/20 p-2.5 rounded-xl border border-rose-900/30">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-rose-200">Uncontrolled Knee Lockout: </strong>
                  Hyperextending knees on leg press transfers load directly to meniscus and cruciate ligaments.
                </div>
              </li>
            </ul>
          </div>

          {/* Safe Green-Flags */}
          <div className="bg-slate-900 border border-emerald-900/50 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-emerald-400 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Bio-Mechanically Safe Green-Flag Lifts</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-900/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-emerald-200">Chest-Supported Incline Rows: </strong>
                  Isolates lats, rhomboids and traps with 100% spinal decompression.
                </div>
              </li>
              <li className="flex items-start gap-2 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-900/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-emerald-200">Neutral-Grip Dumbbell Presses: </strong>
                  Aligns humerus in scapular plane for smooth shoulder pressing without impingement.
                </div>
              </li>
              <li className="flex items-start gap-2 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-900/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-emerald-200">Box Squats & Romanian Deadlifts: </strong>
                  Targets glutes and hamstrings with controlled hip hinge, protecting patellar tendons.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Ask AI for Injury Consultation */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-white">Kisi specific muscle ya joint mein stiffness mehsoos ho rahi hai?</h4>
          <p className="text-xs text-slate-400">
            AI Coach se rehab stretches, safe warming protocols aur joint-safe replacements lijiye.
          </p>
        </div>
        <button
          onClick={() => onOpenChatWithQuery && onOpenChatWithQuery("Mujhe lower back aur shoulder stiffness ke liye 5-minute pre-workout mobility routine batao.")}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shrink-0 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" /> Ask AI Health Rehab Coach
        </button>
      </div>
    </div>
  );
};
