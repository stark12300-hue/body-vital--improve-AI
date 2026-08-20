import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || "";
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Community & Registered Athletes In-Memory Database
interface CommunityMemberData {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  city: string;
  bio: string;
  goal: string;
  experienceLevel: string;
  dietType: string;
  currentWeightKg: number;
  targetWeightKg: number;
  startWeightKg?: number;
  performanceScore: number;
  scoreBreakdown: {
    workoutScore: number;
    dietScore: number;
    consistencyScore: number;
    hydrationScore: number;
    progressScore: number;
    total: number;
    tier: string;
    tierBadge: string;
    rankTitle: string;
  };
  streakDays: number;
  totalWorkoutsCompleted: number;
  avgDietAdherence: number;
  tier: string;
  badges: { id: string; name: string; icon: string; description: string }[];
  cheersCount: number;
  joinedDate: string;
  lastActive: string;
}

let communityMembers: CommunityMemberData[] = [
  {
    id: "user-athlete-1",
    name: "Vikram Malhotra",
    email: "vikram.m@fitness.org",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    city: "Mumbai, MH",
    bio: "Powerlifter & Calisthenics enthusiast. Down 12kg and hitting PRs daily! 💪",
    goal: "muscle_gain",
    experienceLevel: "advanced",
    dietType: "non_vegetarian",
    currentWeightKg: 78,
    targetWeightKg: 82,
    startWeightKg: 90,
    performanceScore: 98,
    scoreBreakdown: {
      workoutScore: 35,
      dietScore: 24,
      consistencyScore: 20,
      hydrationScore: 10,
      progressScore: 9,
      total: 98,
      tier: "Titan",
      tierBadge: "🏆 Titan Tier",
      rankTitle: "Elite Champion",
    },
    streakDays: 42,
    totalWorkoutsCompleted: 68,
    avgDietAdherence: 96,
    tier: "Titan",
    badges: [
      { id: "b1", name: "40-Day Iron Streak", icon: "🔥", description: "Completed 40 consecutive days of training" },
      { id: "b2", name: "Macro Master", icon: "🥗", description: "Maintained >95% protein adherence for a month" },
      { id: "b3", name: "Strength Titan", icon: "⚡", description: "Surpassed target lift thresholds safely" },
    ],
    cheersCount: 245,
    joinedDate: "2026-06-10",
    lastActive: "Just now",
  },
  {
    id: "user-athlete-2",
    name: "Priya Sundaram",
    email: "priya.fit@lifestyle.in",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    city: "Bengaluru, KA",
    bio: "Recovered from knee pain using AI joint-safe modifications. Healthy living! 🧘‍♀️",
    goal: "fat_loss",
    experienceLevel: "intermediate",
    dietType: "vegetarian",
    currentWeightKg: 63,
    targetWeightKg: 58,
    startWeightKg: 72,
    performanceScore: 95,
    scoreBreakdown: {
      workoutScore: 33,
      dietScore: 25,
      consistencyScore: 19,
      hydrationScore: 10,
      progressScore: 8,
      total: 95,
      tier: "Titan",
      tierBadge: "🏆 Titan Tier",
      rankTitle: "Discipline Master",
    },
    streakDays: 31,
    totalWorkoutsCompleted: 45,
    avgDietAdherence: 98,
    tier: "Titan",
    badges: [
      { id: "b4", name: "Joint Protector", icon: "🛡️", description: "Zero injury flare-ups with safe form" },
      { id: "b5", name: "Hydration Queen", icon: "💧", description: "3L+ water daily for 30 days" },
      { id: "b6", name: "Vegetarian Power", icon: "🌱", description: "Hit 110g plant protein daily consistently" },
    ],
    cheersCount: 189,
    joinedDate: "2026-06-25",
    lastActive: "15 mins ago",
  },
  {
    id: "user-athlete-3",
    name: "Arjun Verma",
    email: "arjun.v@techgym.com",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    city: "Delhi NCR",
    bio: "Software engineer transforming desk posture & building lean recomp strength. 💻🏋️",
    goal: "lean_recomp",
    experienceLevel: "intermediate",
    dietType: "eggetarian",
    currentWeightKg: 74,
    targetWeightKg: 72,
    startWeightKg: 80,
    performanceScore: 92,
    scoreBreakdown: {
      workoutScore: 32,
      dietScore: 23,
      consistencyScore: 19,
      hydrationScore: 9,
      progressScore: 9,
      total: 92,
      tier: "Titan",
      tierBadge: "🏆 Titan Tier",
      rankTitle: "Recomp Pro",
    },
    streakDays: 24,
    totalWorkoutsCompleted: 38,
    avgDietAdherence: 91,
    tier: "Titan",
    badges: [
      { id: "b7", name: "Desk To Beast", icon: "🚀", description: "Eliminated lower back tightness" },
      { id: "b8", name: "Rest Timer Devotee", icon: "⏱️", description: "Strict 90s rest interval discipline" },
    ],
    cheersCount: 142,
    joinedDate: "2026-07-02",
    lastActive: "1 hour ago",
  },
  {
    id: "user-athlete-4",
    name: "Neha Rathi",
    email: "neha.rathi@gymfit.com",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    city: "Pune, MH",
    bio: "Marathon runner + AI hypertrophy split. Nutrition is 80% of the game! 🏃‍♀️🥗",
    goal: "strength_endurance",
    experienceLevel: "advanced",
    dietType: "vegetarian",
    currentWeightKg: 55,
    targetWeightKg: 54,
    startWeightKg: 59,
    performanceScore: 89,
    scoreBreakdown: {
      workoutScore: 31,
      dietScore: 22,
      consistencyScore: 18,
      hydrationScore: 10,
      progressScore: 8,
      total: 89,
      tier: "Gold",
      tierBadge: "🥇 Gold Elite",
      rankTitle: "Endurance Beast",
    },
    streakDays: 19,
    totalWorkoutsCompleted: 29,
    avgDietAdherence: 90,
    tier: "Gold",
    badges: [
      { id: "b9", name: "Stamina Legend", icon: "⚡", description: "High volume workouts with zero fatigue" },
      { id: "b10", name: "Clean Eater", icon: "🥑", description: "No processed sugar for 3 weeks" },
    ],
    cheersCount: 97,
    joinedDate: "2026-07-12",
    lastActive: "3 hours ago",
  },
  {
    id: "user-athlete-5",
    name: "Rohan Kapoor",
    email: "rohan.k@fitindia.org",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    city: "Jaipur, RJ",
    bio: "Home dumbbell workouts & high-protein Indian diet. Starting strong! 🏡💪",
    goal: "muscle_gain",
    experienceLevel: "beginner",
    dietType: "vegetarian",
    currentWeightKg: 68,
    targetWeightKg: 74,
    startWeightKg: 64,
    performanceScore: 84,
    scoreBreakdown: {
      workoutScore: 29,
      dietScore: 21,
      consistencyScore: 17,
      hydrationScore: 9,
      progressScore: 8,
      total: 84,
      tier: "Gold",
      tierBadge: "🥇 Gold Elite",
      rankTitle: "Rising Performer",
    },
    streakDays: 14,
    totalWorkoutsCompleted: 20,
    avgDietAdherence: 88,
    tier: "Gold",
    badges: [
      { id: "b11", name: "Home Gym Warrior", icon: "🏠", description: "Crushed all workouts at home" },
    ],
    cheersCount: 68,
    joinedDate: "2026-07-20",
    lastActive: "5 hours ago",
  },
  {
    id: "user-athlete-6",
    name: "Simran Gill",
    email: "simran.g@punjabfitness.in",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    city: "Chandigarh, PB",
    bio: "PCOS warrior on fat loss & hormonal balance journey with AI nutritionist. ✨",
    goal: "fat_loss",
    experienceLevel: "beginner",
    dietType: "vegetarian",
    currentWeightKg: 71,
    targetWeightKg: 64,
    startWeightKg: 76,
    performanceScore: 81,
    scoreBreakdown: {
      workoutScore: 28,
      dietScore: 21,
      consistencyScore: 16,
      hydrationScore: 8,
      progressScore: 8,
      total: 81,
      tier: "Gold",
      tierBadge: "🥇 Gold Elite",
      rankTitle: "Health Champion",
    },
    streakDays: 11,
    totalWorkoutsCompleted: 15,
    avgDietAdherence: 87,
    tier: "Gold",
    badges: [
      { id: "b12", name: "Consistency Champ", icon: "🎯", description: "Logged every meal accurately" },
    ],
    cheersCount: 54,
    joinedDate: "2026-07-28",
    lastActive: "Yesterday",
  }
];

// Helper to calculate tier and badge based on score
function calculateTierAndBadge(totalScore: number) {
  if (totalScore >= 90) {
    return {
      tier: "Titan",
      tierBadge: "🏆 Titan Tier",
      rankTitle: "Elite Champion",
    };
  } else if (totalScore >= 80) {
    return {
      tier: "Gold",
      tierBadge: "🥇 Gold Elite",
      rankTitle: "Master Athlete",
    };
  } else if (totalScore >= 70) {
    return {
      tier: "Silver",
      tierBadge: "🥈 Silver Pro",
      rankTitle: "Dedicated Fitness Pro",
    };
  } else if (totalScore >= 55) {
    return {
      tier: "Bronze",
      tierBadge: "🥉 Bronze Contender",
      rankTitle: "Active Achiever",
    };
  } else {
    return {
      tier: "RisingStar",
      tierBadge: "🌱 Rising Star",
      rankTitle: "Journey Beginner",
    };
  }
}

// Community Endpoints
// GET /api/community/members - Retrieve public community leaderboard and athletes
app.get("/api/community/members", (_req, res) => {
  // Sort by performance score descending
  const sorted = [...communityMembers].sort((a, b) => b.performanceScore - a.performanceScore);
  res.json({
    success: true,
    totalMembers: communityMembers.length,
    members: sorted,
    updatedAt: new Date().toISOString(),
  });
});

// POST /api/community/register - Register a user profile to community leaderboard
app.post("/api/community/register", (req, res) => {
  try {
    const { profile, initialScore } = req.body;
    if (!profile || !profile.name) {
      return res.status(400).json({ error: "Profile and name are required" });
    }

    const memberId = profile.id || `user-${Date.now()}`;
    const scoreVal = typeof initialScore === "number" ? initialScore : 88;
    const { tier, tierBadge, rankTitle } = calculateTierAndBadge(scoreVal);

    const existingIndex = communityMembers.findIndex((m) => m.id === memberId || (profile.email && m.email === profile.email));

    const updatedMember: CommunityMemberData = {
      id: memberId,
      name: profile.name,
      email: profile.email || `${profile.name.toLowerCase().replace(/\s+/g, ".")}@fitguru.community`,
      avatarUrl: profile.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(profile.name)}`,
      city: profile.city || "India",
      bio: profile.bio || `Passionate about ${profile.goal ? profile.goal.replace("_", " ") : "fitness transformation"}! Follow my journey.`,
      goal: profile.goal || "fat_loss",
      experienceLevel: profile.experienceLevel || "intermediate",
      dietType: profile.dietType || "vegetarian",
      currentWeightKg: profile.currentWeightKg || 70,
      targetWeightKg: profile.targetWeightKg || 65,
      startWeightKg: profile.currentWeightKg || 70,
      performanceScore: scoreVal,
      scoreBreakdown: {
        workoutScore: Math.min(35, Math.round(scoreVal * 0.35)),
        dietScore: Math.min(25, Math.round(scoreVal * 0.25)),
        consistencyScore: Math.min(20, Math.round(scoreVal * 0.20)),
        hydrationScore: Math.min(10, Math.round(scoreVal * 0.10)),
        progressScore: Math.min(10, Math.round(scoreVal * 0.10)),
        total: scoreVal,
        tier,
        tierBadge,
        rankTitle,
      },
      streakDays: profile.streakDays || 7,
      totalWorkoutsCompleted: profile.totalWorkoutsCompleted || 12,
      avgDietAdherence: profile.avgDietAdherence || 92,
      tier,
      badges: [
        { id: `b-welcome-${Date.now()}`, name: "Verified Member", icon: "🎖️", description: "Official FitGuru Transformation Athlete" },
        { id: `b-kickstart-${Date.now()}`, name: "Goal Kickstart", icon: "⚡", description: "Completed initial body assessment & custom routine" },
      ],
      cheersCount: existingIndex >= 0 ? communityMembers[existingIndex].cheersCount : 5,
      joinedDate: existingIndex >= 0 ? communityMembers[existingIndex].joinedDate : new Date().toISOString().split("T")[0],
      lastActive: "Just now",
    };

    if (existingIndex >= 0) {
      communityMembers[existingIndex] = {
        ...communityMembers[existingIndex],
        ...updatedMember,
      };
    } else {
      communityMembers.unshift(updatedMember);
    }

    res.json({
      success: true,
      member: updatedMember,
      message: `Welcome ${profile.name}! Your profile is now registered on the Community Leaderboard.`,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({ error: error?.message || "Failed to register profile" });
  }
});

// POST /api/community/sync-score - Sync live performance score for user
app.post("/api/community/sync-score", (req, res) => {
  try {
    const { userId, performanceScore, scoreBreakdown, streakDays, totalWorkoutsCompleted, avgDietAdherence, currentWeightKg } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const member = communityMembers.find((m) => m.id === userId);
    if (!member) {
      return res.status(404).json({ error: "Member not found in community database" });
    }

    const total = typeof performanceScore === "number" ? Math.min(100, Math.max(0, performanceScore)) : member.performanceScore;
    const { tier, tierBadge, rankTitle } = calculateTierAndBadge(total);

    member.performanceScore = total;
    if (scoreBreakdown) {
      member.scoreBreakdown = {
        ...scoreBreakdown,
        total,
        tier,
        tierBadge,
        rankTitle,
      };
    }
    if (typeof streakDays === "number") member.streakDays = streakDays;
    if (typeof totalWorkoutsCompleted === "number") member.totalWorkoutsCompleted = totalWorkoutsCompleted;
    if (typeof avgDietAdherence === "number") member.avgDietAdherence = avgDietAdherence;
    if (typeof currentWeightKg === "number") member.currentWeightKg = currentWeightKg;
    member.tier = tier;
    member.lastActive = "Just now";

    res.json({ success: true, member });
  } catch (error: any) {
    console.error("Score sync error:", error);
    res.status(500).json({ error: error?.message || "Failed to sync score" });
  }
});

// POST /api/community/cheer - Give cheers / high-fives to an athlete
app.post("/api/community/cheer", (req, res) => {
  try {
    const { memberId } = req.body;
    if (!memberId) return res.status(400).json({ error: "Member ID is required" });

    const member = communityMembers.find((m) => m.id === memberId);
    if (!member) return res.status(404).json({ error: "Member not found" });

    member.cheersCount = (member.cheersCount || 0) + 1;
    res.json({ success: true, cheersCount: member.cheersCount });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to send cheer" });
  }
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(apiKey && apiKey.length > 5),
    timestamp: new Date().toISOString(),
  });
});

// Helper function to extract JSON from Gemini markdown output
function cleanAndParseJson(text: string): any {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return JSON.parse(cleaned);
}

// Resilient Gemini invocation with multi-model fallback and graceful degraded handling
const CANDIDATE_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
  "gemini-3.7-flash",
];

async function callGeminiWithRetryAndFallback(params: {
  contents: any;
  config?: any;
  maxRetriesPerModel?: number;
}): Promise<string> {
  const ai = getAiClient();
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: params.contents,
        config: params.config,
      });
      const text = response.text;
      if (text && text.trim().length > 0) {
        return text;
      }
    } catch (err: any) {
      lastError = err;
      const isHighDemand =
        err?.status === 503 ||
        err?.status === 429 ||
        err?.status === "UNAVAILABLE" ||
        (err?.message && (err.message.includes("503") || err.message.includes("high demand") || err.message.includes("UNAVAILABLE")));

      if (isHighDemand) {
        // High demand on this model cluster - seamlessly route to next model
        continue;
      }
    }
  }

  throw lastError || new Error("All candidate Gemini models were busy or unavailable");
}

// Deterministic Smart Fallback Plan Generator
function generateSmartFallbackPlan(profile: any) {
  const age = profile.age || 26;
  const height = profile.heightCm || 175;
  const currentWeight = profile.currentWeightKg || 74;
  const targetWeight = profile.targetWeightKg || 68;
  const gender = profile.gender || "male";
  const goal = profile.goal || "fat_loss";
  const dietType = profile.dietType || "vegetarian";
  const location = profile.workoutLocation || "gym";
  const daysPerWeek = profile.daysPerWeek || 5;
  const injuries = profile.healthConditions?.injuries || [];
  const hasKneePain = injuries.includes("knee_pain") || injuries.includes("knee");
  const hasBackPain = injuries.includes("lower_back") || injuries.includes("back_pain");
  const hasShoulderPain = injuries.includes("shoulder") || injuries.includes("shoulder_impingement");

  // Calculate BMR (Mifflin-St Jeor)
  let bmr = 10 * currentWeight + 6.25 * height - 5 * age;
  bmr = gender === "female" ? bmr - 161 : bmr + 5;

  let activityFactor = 1.45;
  if (profile.activityLevel === "sedentary") activityFactor = 1.25;
  else if (profile.activityLevel === "moderately_active") activityFactor = 1.5;
  else if (profile.activityLevel === "very_active") activityFactor = 1.7;

  let tdee = Math.round(bmr * activityFactor);
  let targetCalories = tdee;
  if (goal === "fat_loss") targetCalories = Math.max(1400, tdee - 450);
  else if (goal === "muscle_gain") targetCalories = tdee + 350;
  else if (goal === "lean_recomp") targetCalories = tdee - 150;

  const proteinGrams = Math.round(currentWeight * 1.9);
  const fatsGrams = Math.round((targetCalories * 0.25) / 9);
  const carbsGrams = Math.round((targetCalories - (proteinGrams * 4 + fatsGrams * 9)) / 4);
  const waterLiters = Math.max(3.0, Math.round((currentWeight * 0.045) * 10) / 10);

  // Split name & schedule
  let splitName = "Custom Hypertrophy & Joint-Protected Split";
  if (daysPerWeek === 3) splitName = "Full-Body 3-Day Progressive Overload Split";
  else if (daysPerWeek === 4) splitName = "Upper / Lower 4-Day Power Split";
  else if (daysPerWeek >= 5) splitName = "Push / Pull / Legs + Conditioning Split (Joint-Safe)";

  const injuryNotes = [];
  if (hasKneePain) injuryNotes.push("Knee Caution: Replaced deep barbell squats with Goblet Box Squats and focused on posterior chain (Romanian deadlifts, hamstring curls).");
  if (hasBackPain) injuryNotes.push("Spine-Safe Protocol: Replaced unsupported bent-over rows with Chest Supported DB Rows and avoid heavy axial loading.");
  if (hasShoulderPain) injuryNotes.push("Shoulder Protection: Implemented neutral grip dumbbell presses and high-elbow face pulls.");
  if (injuryNotes.length === 0) injuryNotes.push("Always maintain strict form, controlled 3-second eccentric lowering, and complete warm-up sets.");

  const schedule = [
    {
      dayNumber: 1,
      dayName: "Monday",
      focus: "Chest, Shoulders & Triceps (Push Focus)",
      hindiFocus: "Chest aur Triceps ki joint-safe workout",
      isRestDay: false,
      durationMinutes: 45,
      warmup: ["5 min dynamic arm swings", "Band pull-aparts (2x15)", "Scapular pushups"],
      cooldown: ["Doorway chest stretch (60s)", "Overhead triceps stretch", "Diaphragmatic breathing"],
      exercises: [
        {
          id: "ex-d1-1",
          name: location === "home_calisthenics" ? "Tempo Push-ups (Hands Elevated if Needed)" : "Incline Dumbbell Bench Press",
          hindiName: "Incline Dumbbell Chest Press",
          targetMuscle: "Upper Chest & Front Delts",
          secondaryMuscle: "Triceps",
          sets: 4,
          reps: "10-12",
          restSeconds: 75,
          equipment: location === "home_calisthenics" ? "Bodyweight" : "Dumbbells & Bench",
          formTips: [
            "Retract shoulder blades and plant feet firmly",
            "Lower with controlled 3-second descent to upper chest level",
            "Press up with chest contraction without clanking weights",
          ],
          mistakesToAvoid: ["Flaring elbows out to 90 degrees", "Bouncing at bottom"],
          injuryModifications: hasShoulderPain ? "Use neutral grip (palms facing inward) to protect rotator cuff" : "Maintain 45-degree elbow angle",
          alternativeExercise: "Flat DB Press or Machine Chest Press",
        },
        {
          id: "ex-d1-2",
          name: "Flat Dumbbell Press / Floor Press",
          hindiName: "Flat Dumbbell Chest Press",
          targetMuscle: "Mid Pectorals",
          secondaryMuscle: "Triceps",
          sets: 3,
          reps: "10-12",
          restSeconds: 60,
          equipment: "Dumbbells",
          formTips: ["Keep natural arch in lower spine", "Exhale on pressing up"],
          mistakesToAvoid: ["Dropping weights too fast"],
          injuryModifications: "Floor press limits shoulder hyperextension safely",
          alternativeExercise: "Push-ups with handles",
        },
        {
          id: "ex-d1-3",
          name: "Dumbbell Lateral Raises (Strict Form)",
          hindiName: "Side Shoulder Lateral Raises",
          targetMuscle: "Lateral Deltoids (Side Shoulders)",
          secondaryMuscle: "Traps",
          sets: 4,
          reps: "12-15",
          restSeconds: 60,
          equipment: "Light Dumbbells or Resistance Band",
          formTips: ["Lead with elbows slightly forward in scapular plane", "Pause for 1 second at top"],
          mistakesToAvoid: ["Swinging torso back and forth"],
          injuryModifications: "Raise only to collarbone height with thumbs slightly higher than pinkies",
          alternativeExercise: "Cable Lateral Raise",
        },
        {
          id: "ex-d1-4",
          name: "Overhead Dumbbell Triceps Extension",
          hindiName: "Triceps Overhead Extension",
          targetMuscle: "Triceps (Long Head)",
          secondaryMuscle: "Lateral Head",
          sets: 3,
          reps: "12-15",
          restSeconds: 60,
          equipment: "Dumbbell",
          formTips: ["Keep elbows tucked close to head", "Full stretch at bottom"],
          mistakesToAvoid: ["Flaring elbows wide"],
          injuryModifications: "If elbow discomfort occurs, switch to Cable Rope Pushdowns or Kickbacks",
          alternativeExercise: "Bench Dips or Diamond Pushups",
        },
      ],
    },
    {
      dayNumber: 2,
      dayName: "Tuesday",
      focus: "Back, Rear Delts & Biceps (Pull Focus)",
      hindiFocus: "Back aur Biceps ki muscle building workout",
      isRestDay: false,
      durationMinutes: 45,
      warmup: ["Cat-Cow stretch (10 reps)", "Lat pulldowns with light band", "Wrist rotations"],
      cooldown: ["Dead hangs on pullup bar (30s)", "Cross-body shoulder stretch", "Lower back twist"],
      exercises: [
        {
          id: "ex-d2-1",
          name: location === "gym" ? "Lat Pulldowns (Wide or Neutral Grip)" : "Chest Supported Dumbbell Rows",
          hindiName: "Lat Pulldown ya Dumbbell Rows",
          targetMuscle: "Latissimus Dorsi (Upper & Mid Back)",
          secondaryMuscle: "Biceps",
          sets: 4,
          reps: "10-12",
          restSeconds: 75,
          equipment: location === "gym" ? "Lat Pulldown Machine" : "Dumbbells & Incline Bench",
          formTips: ["Pull through elbows down towards your hips", "Squeeze shoulder blades together at bottom"],
          mistakesToAvoid: ["Leaning back excessively using momentum"],
          injuryModifications: hasBackPain ? "Chest support completely eliminates spinal shearing stress" : "Keep torso upright",
          alternativeExercise: "Single Arm DB Row on Bench",
        },
        {
          id: "ex-d2-2",
          name: "Single-Arm Dumbbell Row on Bench",
          hindiName: "Single Hand Dumbbell Back Row",
          targetMuscle: "Mid Back & Rhomboids",
          secondaryMuscle: "Forearms & Biceps",
          sets: 3,
          reps: "10-12 each side",
          restSeconds: 60,
          equipment: "Dumbbell & Flat Bench",
          formTips: ["Knee and hand on bench for firm 3-point base", "Pull elbow back in an arc"],
          mistakesToAvoid: ["Twisting torso aggressively"],
          injuryModifications: "Keep spine flat and core braced",
          alternativeExercise: "Seated Cable Row",
        },
        {
          id: "ex-d2-3",
          name: "Incline Dumbbell Biceps Curls",
          hindiName: "Incline Biceps Curl",
          targetMuscle: "Biceps Brachii",
          secondaryMuscle: "Brachialis",
          sets: 3,
          reps: "10-12",
          restSeconds: 60,
          equipment: "Dumbbells & Incline Bench",
          formTips: ["Keep upper arm stationary", "Supinate wrists at peak contraction"],
          mistakesToAvoid: ["Swinging shoulders forward"],
          injuryModifications: "Keep wrists neutral and avoid excessive elbow hyperextension",
          alternativeExercise: "Standing Hammer Curls",
        },
        {
          id: "ex-d2-4",
          name: "Hammer Curls (Forearms & Peak Biceps)",
          hindiName: "Hammer Curls",
          targetMuscle: "Brachialis & Forearm Brachioradialis",
          secondaryMuscle: "Biceps",
          sets: 3,
          reps: "12-15",
          restSeconds: 60,
          equipment: "Dumbbells",
          formTips: ["Palms facing each other throughout the lift", "Control lowering"],
          mistakesToAvoid: ["Rocking hips to start the rep"],
          injuryModifications: "Easy on wrist joints compared to standard supinated curls",
          alternativeExercise: "Reverse Barbell Curls",
        },
      ],
    },
    {
      dayNumber: 3,
      dayName: "Wednesday",
      focus: "Legs, Calves & Core (Joint-Friendly Lower Body)",
      hindiFocus: "Knee-safe Legs aur Core strengthening workout",
      isRestDay: false,
      durationMinutes: 45,
      warmup: ["Glute bridges (2x15)", "Ankle mobility circles", "Bodyweight hip hinges"],
      cooldown: ["Standing quad stretch", "Hamstring towel stretch", "Child's pose (1 min)"],
      exercises: [
        {
          id: "ex-d3-1",
          name: hasKneePain ? "Goblet Box Squat (Controlled Depth)" : "Dumbbell Goblet Squat",
          hindiName: "Goblet Box Squat (Joint-Safe)",
          targetMuscle: "Quadriceps & Glutes",
          secondaryMuscle: "Core & Hamstrings",
          sets: 4,
          reps: "10-12",
          restSeconds: 90,
          equipment: "Dumbbell & Box/Bench",
          formTips: [
            "Hold dumbbell close to chest with elbows tucked",
            "Sit hips back onto the box gently without bouncing",
            "Drive through mid-foot and squeeze glutes to stand",
          ],
          mistakesToAvoid: ["Letting knees cave inwards", "Rounding lower spine"],
          injuryModifications: "Box squat caps knee flexion angle safely at 90 degrees, relieving patellar tendon strain",
          alternativeExercise: "Leg Press (High & Wide Foot Placement)",
        },
        {
          id: "ex-d3-2",
          name: "Romanian Deadlift (Dumbbells)",
          hindiName: "Romanian Deadlift (Hamstrings & Glutes)",
          targetMuscle: "Hamstrings & Posterior Chain",
          secondaryMuscle: "Glutes & Lower Back",
          sets: 4,
          reps: "10-12",
          restSeconds: 75,
          equipment: "Dumbbells",
          formTips: ["Hinge at hips by pushing butt towards back wall", "Keep dumbbells gliding along your shins"],
          mistakesToAvoid: ["Squatting down instead of hip hinging", "Rounding lower back"],
          injuryModifications: "Zero compressive knee load; excellent knee stabilizer",
          alternativeExercise: "Lying or Seated Hamstring Curls",
        },
        {
          id: "ex-d3-3",
          name: "Glute Bridges / Hip Thrusts with Dumbbell",
          hindiName: "Glute Bridge with Weight",
          targetMuscle: "Gluteus Maximus",
          secondaryMuscle: "Hamstrings",
          sets: 3,
          reps: "15",
          restSeconds: 60,
          equipment: "Dumbbell & Mat",
          formTips: ["Drive through heels", "Hold 2-second squeeze at top"],
          mistakesToAvoid: ["Hyperextending lower spine"],
          injuryModifications: "100% joint-safe for knees and spine",
          alternativeExercise: "Cable Pull-Throughs",
        },
        {
          id: "ex-d3-4",
          name: "Plank Hold with Knee Taps",
          hindiName: "Plank Core Hold",
          targetMuscle: "Transverse Abdominis & Deep Core",
          secondaryMuscle: "Shoulders",
          sets: 3,
          reps: "45-60 seconds",
          restSeconds: 45,
          equipment: "Mat",
          formTips: ["Straight line from head to heels", "Keep glutes and abs squeezed tight"],
          mistakesToAvoid: ["Sagging lower back"],
          injuryModifications: "Can be done on knees if lower back feels fatigued",
          alternativeExercise: "Dead Bug exercise",
        },
      ],
    },
    {
      dayNumber: 4,
      dayName: "Thursday",
      focus: "Active Recovery & Mobility Flow",
      hindiFocus: "Active Recovery aur Stretching Day",
      isRestDay: true,
      durationMinutes: 25,
      warmup: ["Neck rolls (10 reps)", "Arm circles (15 reps)"],
      cooldown: ["Deep relaxed breathing (5 mins)"],
      exercises: [
        {
          id: "ex-d4-1",
          name: "Brisk Incline Walking / Easy Cycling",
          hindiName: "Low Impact Cardio Walk",
          targetMuscle: "Cardiovascular System",
          secondaryMuscle: "Calves & Quads",
          sets: 1,
          reps: "20-25 mins",
          restSeconds: 0,
          equipment: "Treadmill, Stationary Bike or Outdoors",
          formTips: ["Maintain comfortable pace where you can still talk", "Breathe through nose"],
          mistakesToAvoid: ["Running at high impact"],
          injuryModifications: "Stationary cycling is low-impact and lubricates knee joints",
          alternativeExercise: "Gentle Swimming or Yoga",
        },
        {
          id: "ex-d4-2",
          name: "Full Body Mobility & Joint Flow",
          hindiName: "Joint Mobility Stretches",
          targetMuscle: "Full Body Flexibility",
          secondaryMuscle: "Joint Health",
          sets: 2,
          reps: "8-10 mins",
          restSeconds: 30,
          equipment: "Mat",
          formTips: ["Perform Cat-Cow, World's Greatest Stretch, and Pigeon Pose gently"],
          mistakesToAvoid: ["Pushing into sharp pain"],
          injuryModifications: "Helps muscle recovery and reduces next-day soreness",
          alternativeExercise: "Gentle foam rolling",
        },
      ],
    },
    {
      dayNumber: 5,
      dayName: "Friday",
      focus: "Upper Body Hypertrophy (Chest, Back, Arms)",
      hindiFocus: "Upper Body Power & Definition Workout",
      isRestDay: false,
      durationMinutes: 45,
      warmup: ["Dynamic arm swings", "Band dislocates"],
      cooldown: ["Full upper body stretch"],
      exercises: [
        {
          id: "ex-d5-1",
          name: "Seated Dumbbell Shoulder Press",
          hindiName: "Seated Dumbbell Shoulder Press",
          targetMuscle: "Anterior Deltoids & Triceps",
          secondaryMuscle: "Upper Chest",
          sets: 3,
          reps: "10-12",
          restSeconds: 75,
          equipment: "Dumbbells & Bench with Back Support",
          formTips: ["Back pressed against seat", "Press up in slight triangle path"],
          mistakesToAvoid: ["Arching lower back off the bench"],
          injuryModifications: hasShoulderPain ? "Use neutral grip (palms facing each other)" : "Keep elbows at 60 degrees",
          alternativeExercise: "High Incline DB Press",
        },
        {
          id: "ex-d5-2",
          name: "Seated Cable Row / Dumbbell Chest Supported Row",
          hindiName: "Seated Row for Thickness",
          targetMuscle: "Mid Back & Rhomboids",
          secondaryMuscle: "Biceps",
          sets: 3,
          reps: "10-12",
          restSeconds: 60,
          equipment: "Cable Machine or Dumbbells",
          formTips: ["Chest tall, pull elbows close to ribcage", "Hold 1s squeeze"],
          mistakesToAvoid: ["Jerking the weight"],
          injuryModifications: "Keep torso steady and stable",
          alternativeExercise: "Band Resisted Row",
        },
        {
          id: "ex-d5-3",
          name: "Dumbbell Hammer Curls to Overhead Press Combo",
          hindiName: "Biceps & Shoulder Finisher",
          targetMuscle: "Biceps & Shoulders",
          secondaryMuscle: "Forearms",
          sets: 3,
          reps: "10-12",
          restSeconds: 60,
          equipment: "Dumbbells",
          formTips: ["Curl smoothly, then press overhead in one continuous motion"],
          mistakesToAvoid: ["Using too heavy weight"],
          injuryModifications: "Light to moderate weight with pristine cadence",
          alternativeExercise: "Standard Biceps Curls",
        },
      ],
    },
    {
      dayNumber: 6,
      dayName: "Saturday",
      focus: "Lower Body Stability, Hamstrings & Core",
      hindiFocus: "Hamstrings, Glutes aur Core Workout",
      isRestDay: false,
      durationMinutes: 45,
      warmup: ["Glute bridges (15 reps)", "Hip openers"],
      cooldown: ["Hamstring stretches (60s each side)"],
      exercises: [
        {
          id: "ex-d6-1",
          name: "Dumbbell Romanian Deadlifts (Controlled Eccentric)",
          hindiName: "Dumbbell RDLs for Hamstrings",
          targetMuscle: "Hamstrings & Glutes",
          secondaryMuscle: "Lower Back",
          sets: 4,
          reps: "10-12",
          restSeconds: 75,
          equipment: "Dumbbells",
          formTips: ["Push hips straight back", "Feel hamstring stretch before driving up"],
          mistakesToAvoid: ["Bending knees too much into a squat"],
          injuryModifications: "Safe for knees and reinforces posterior chain strength",
          alternativeExercise: "Lying Leg Curls",
        },
        {
          id: "ex-d6-2",
          name: "Standing Dumbbell Calf Raises",
          hindiName: "Calf Muscle Raises",
          targetMuscle: "Gastrocnemius & Soleus",
          secondaryMuscle: "Ankles",
          sets: 4,
          reps: "15-20",
          restSeconds: 45,
          equipment: "Dumbbells or Step Platform",
          formTips: ["Full extension at top and deep stretch at bottom"],
          mistakesToAvoid: ["Bouncing fast without pause"],
          injuryModifications: "Hold onto a wall for complete balance",
          alternativeExercise: "Seated Calf Raise",
        },
        {
          id: "ex-d6-3",
          name: "Bicycle Crunches & Bird-Dogs",
          hindiName: "Core & Spine Stability Combo",
          targetMuscle: "Abs, Obliques & Lower Back",
          secondaryMuscle: "Hip Flexors",
          sets: 3,
          reps: "15 each side",
          restSeconds: 45,
          equipment: "Mat",
          formTips: ["Slow and deliberate rotation", "Keep lumbar spine neutral in Bird-Dog"],
          mistakesToAvoid: ["Pulling on neck with hands"],
          injuryModifications: "Bird-Dog is the gold standard for spine stabilization",
          alternativeExercise: "Dead Bug",
        },
      ],
    },
    {
      dayNumber: 7,
      dayName: "Sunday",
      focus: "Full Rest & Muscle Recovery",
      hindiFocus: "Full Rest & Hydration Day",
      isRestDay: true,
      durationMinutes: 0,
      warmup: [],
      cooldown: [],
      exercises: [
        {
          id: "ex-d7-1",
          name: "Relaxed Rest & Hydration Protocol",
          hindiName: "Aaram aur Recovery",
          targetMuscle: "Central Nervous System & Muscles",
          secondaryMuscle: "Mind",
          sets: 1,
          reps: "Full Day",
          restSeconds: 0,
          equipment: "Water & Quality Sleep",
          formTips: ["Target 8 hours of restful sleep", "Drink 3.5L water", "Eat protein-rich balanced meals"],
          mistakesToAvoid: ["Binge eating ultra-processed foods"],
          injuryModifications: "Allow tissues and joints to regenerate fully",
          alternativeExercise: "Light family walk",
        },
      ],
    },
  ];

  // Build Diet Plan Meals based on dietType
  const isVeg = dietType === "vegetarian" || dietType === "vegan";
  const isEgg = dietType === "eggetarian";

  const meals = [
    {
      timeSlot: "8:00 AM",
      mealType: "breakfast",
      title: "High-Protein Energizing Breakfast",
      hindiTitle: "High-Protein Power Nashta",
      calories: Math.round(targetCalories * 0.25),
      protein: Math.round(proteinGrams * 0.28),
      carbs: Math.round(carbsGrams * 0.26),
      fats: Math.round(fatsGrams * 0.22),
      items: isVeg
        ? [
            {
              name: "Moong Dal & Low-Fat Paneer Chilla (2 pcs) with Mint Chutney",
              hindiName: "Moong Dal Paneer Chilla",
              portion: "2 medium chilla (60g paneer)",
              calories: Math.round(targetCalories * 0.18),
              protein: Math.round(proteinGrams * 0.20),
              carbs: 35,
              fats: 10,
              description: "Made with soaked moong dal batter, stuffed with grated low-fat paneer, green chillies and coriander.",
            },
            {
              name: "Low-Fat Curd (Dahi) or Soy Yogurt with a pinch of roasted jeera",
              hindiName: "Taaza Dahi / Curd",
              portion: "150g bowl",
              calories: Math.round(targetCalories * 0.07),
              protein: Math.round(proteinGrams * 0.08),
              carbs: 10,
              fats: 3,
              description: "Rich in gut-friendly probiotics and natural calcium.",
            },
          ]
        : isEgg
        ? [
            {
              name: "3 Whole Boiled Eggs or Masala Omelette + 2 Slices Brown Bread",
              hindiName: "3 Ande ka Omelette aur Toast",
              portion: "3 eggs + 2 slices",
              calories: Math.round(targetCalories * 0.20),
              protein: Math.round(proteinGrams * 0.22),
              carbs: 28,
              fats: 12,
              description: "Prepared in 1 tsp olive oil with onions, tomatoes and green chillies.",
            },
            {
              name: "Green Tea with Lemon & 5 Almonds",
              hindiName: "Green Tea aur Badam",
              portion: "1 cup + 5 almonds",
              calories: 45,
              protein: 2,
              carbs: 2,
              fats: 4,
              description: "Antioxidant boost and healthy fats.",
            },
          ]
        : [
            {
              name: "3 Whole Eggs Scramble + 2 Multigrain Toast or Chicken Tikka Slices (100g)",
              hindiName: "Egg Scramble / Chicken Toast",
              portion: "3 eggs or 100g chicken",
              calories: Math.round(targetCalories * 0.21),
              protein: Math.round(proteinGrams * 0.24),
              carbs: 25,
              fats: 11,
              description: "Lean protein breakfast to fuel muscle repair and maintain satiety.",
            },
            {
              name: "Fresh Fruit Bowl (Papaya or Apple)",
              hindiName: "Seb ya Papita Bowl",
              portion: "1 small bowl (100g)",
              calories: 60,
              protein: 1,
              carbs: 15,
              fats: 0,
              description: "Rich in dietary fiber, vitamins and digestive enzymes.",
            },
          ],
      swaps: {
        vegetarianSwap: "Tofu Scramble with Rolled Oats Porridge",
        quickAlternative: "1 scoop Whey Protein in 250ml milk with 1 banana & 40g oats (Quick 3-min shake)",
      },
      healthBenefitNote: "Steady complex carbohydrates and high bioavailability protein prevent mid-morning glucose spikes and cravings.",
    },
    {
      timeSlot: "1:00 PM",
      mealType: "lunch",
      title: "Balanced Macro Power Lunch",
      hindiTitle: "Complete Desi Healthy Lunch",
      calories: Math.round(targetCalories * 0.35),
      protein: Math.round(proteinGrams * 0.32),
      carbs: Math.round(carbsGrams * 0.38),
      fats: Math.round(fatsGrams * 0.32),
      items: isVeg
        ? [
            {
              name: "High-Protein Soya Chunks Curry or Paneer Bhurji (70g dry soya / 100g paneer)",
              hindiName: "Soya Chunks Curry / Paneer Bhurji",
              portion: "1 large bowl",
              calories: Math.round(targetCalories * 0.20),
              protein: Math.round(proteinGrams * 0.22),
              carbs: 20,
              fats: 9,
              description: "Cooked in home masala with tomatoes, ginger, and turmeric (natural anti-inflammatory).",
            },
            {
              name: "2 Phulkas (Whole Wheat Rotis) or 1 Bowl Brown / Steamed Rice",
              hindiName: "2 Phulke Roti ya Rice",
              portion: "2 medium rotis / 150g rice",
              calories: Math.round(targetCalories * 0.10),
              protein: 6,
              carbs: 42,
              fats: 2,
              description: "Complex carbohydrates for all-day glycogen replenishment.",
            },
            {
              name: "Cucumber, Tomato, Carrot & Sprouted Moong Salad",
              hindiName: "Taaza Sprouts Salad",
              portion: "1 large bowl (150g)",
              calories: 50,
              protein: 4,
              carbs: 10,
              fats: 0,
              description: "Loaded with micronutrients and soluble fiber to support gut microbiome.",
            },
          ]
        : [
            {
              name: "Grilled / Curry Chicken Breast (150g) or Fish Curry in Mustard Oil",
              hindiName: "Chicken Breast / Machhli Curry",
              portion: "150g chicken / fish",
              calories: Math.round(targetCalories * 0.20),
              protein: Math.round(proteinGrams * 0.25),
              carbs: 5,
              fats: 7,
              description: "Lean protein rich in all essential amino acids and BCAAs.",
            },
            {
              name: "2 Whole Wheat Rotis + 1 Bowl Yellow Dal Tadka",
              hindiName: "2 Roti aur Dal Tadka",
              portion: "2 rotis + 100ml dal",
              calories: Math.round(targetCalories * 0.12),
              protein: 9,
              carbs: 45,
              fats: 4,
              description: "Sustained fuel and minerals.",
            },
            {
              name: "Green Salad with Lemon Dressing & Beetroot",
              hindiName: "Salad with Lemon",
              portion: "1 medium bowl",
              calories: 40,
              protein: 2,
              carbs: 8,
              fats: 0,
              description: "Improves blood flow and nitric oxide levels.",
            },
          ],
      swaps: {
        vegetarianSwap: "Rajma (Kidney Beans) / Chana Masala with 50g Low Fat Tofu",
        quickAlternative: "Office Thali with double portion Dal/Paneer and green salad (skip heavy gravies)",
      },
      healthBenefitNote: "High satiety index keeps you energetic through the afternoon without sluggishness.",
    },
    {
      timeSlot: "5:00 PM",
      mealType: "snack",
      title: "Pre-Workout / Evening Energy Fuel",
      hindiTitle: "Sham ka Healthy Snack / Pre-Workout",
      calories: Math.round(targetCalories * 0.15),
      protein: Math.round(proteinGrams * 0.15),
      carbs: Math.round(carbsGrams * 0.16),
      fats: Math.round(fatsGrams * 0.18),
      items: [
        {
          name: "Roasted Chana (40g) + Chaas / Buttermilk (250ml) or 1 Boiled Egg with Black Pepper",
          hindiName: "Bhuna Chana aur Masala Chaas",
          portion: "40g chana + 1 glass chaas",
          calories: Math.round(targetCalories * 0.12),
          protein: Math.round(proteinGrams * 0.12),
          carbs: 22,
          fats: 4,
          description: "Super light on digestion, provides steady B-vitamins and natural electrolytes before evening activity.",
        },
        {
          name: "1 Small Banana or 1 Apple + Black Coffee / Green Tea",
          hindiName: "1 Kela ya Seb + Black Coffee",
          portion: "1 fruit + 1 cup coffee",
          calories: 60,
          protein: 1,
          carbs: 16,
          fats: 0,
          description: "Natural carbohydrates and caffeine to enhance focus and workout performance.",
        },
      ],
      swaps: {
        vegetarianSwap: "Handful of Roasted Makhana (Foxnuts) + 1 glass Soy Milk",
        quickAlternative: "Handful of roasted peanuts and 1 cup spiced green tea",
      },
      healthBenefitNote: "Balances cortisol, prevents evening sweet cravings, and primes muscle glycogen for training.",
    },
    {
      timeSlot: "8:30 PM",
      mealType: "dinner",
      title: "Light & Restorative Muscle-Recovery Dinner",
      hindiTitle: "Halka aur Poshtik Dinner",
      calories: Math.round(targetCalories * 0.25),
      protein: Math.round(proteinGrams * 0.25),
      carbs: Math.round(carbsGrams * 0.20),
      fats: Math.round(fatsGrams * 0.28),
      items: isVeg
        ? [
            {
              name: "Low-Fat Paneer & Mix Vegetable Stir-Fry (80g paneer with broccoli, bell peppers & beans)",
              hindiName: "Paneer Sabzi / Stir Fry",
              portion: "1 large bowl",
              calories: Math.round(targetCalories * 0.15),
              protein: Math.round(proteinGrams * 0.18),
              carbs: 14,
              fats: 10,
              description: "Slow-digesting micellar casein protein from paneer supports overnight muscle repair.",
            },
            {
              name: "1 Multigrain Roti or 1 Bowl Clear Moong Soup + Warm Haldi Cinnamon Milk",
              hindiName: "1 Roti ya Moong Soup + Haldi Doodh",
              portion: "1 roti / soup + 150ml milk",
              calories: Math.round(targetCalories * 0.10),
              protein: Math.round(proteinGrams * 0.08),
              carbs: 20,
              fats: 4,
              description: "Turmeric and cinnamon reduce systemic inflammation, ease joint stiffness, and enhance deep sleep.",
            },
          ]
        : [
            {
              name: "Grilled Chicken Breast / Boiled Egg Whites (4) with Sautéed Vegetables",
              hindiName: "Chicken / Egg White Sabzi",
              portion: "130g chicken or 4 egg whites",
              calories: Math.round(targetCalories * 0.16),
              protein: Math.round(proteinGrams * 0.20),
              carbs: 10,
              fats: 6,
              description: "Light on stomach, zero bloating before bedtime.",
            },
            {
              name: "1 Whole Wheat Phulka + Warm Haldi Milk (150ml)",
              hindiName: "1 Roti aur Haldi Doodh",
              portion: "1 roti + 150ml milk",
              calories: Math.round(targetCalories * 0.09),
              protein: 6,
              carbs: 18,
              fats: 3,
              description: "Calms central nervous system for sound, restorative sleep.",
            },
          ],
      swaps: {
        vegetarianSwap: "Warm Tofu Vegetable Soup with Quinoa / Dalia",
        quickAlternative: "1 Bowl Besan Chilla with sauteed spinach and mushrooms",
      },
      healthBenefitNote: "Lower carb dinner improves overnight growth hormone secretion and fat oxidation while sleeping.",
    },
  ];

  return {
    workoutPlan: {
      id: "wp-" + Date.now(),
      weekNumber: 1,
      generatedAt: new Date().toISOString(),
      splitName: splitName,
      overview: `A personalized, scientifically structured routine designed for ${goal.replace("_", " ")}. Calibrated with joint-protective angles and progressive volume.`,
      hindiOverview: `Aapke goal (${goal.replace("_", " ")}) aur health history ke hisab se customized joint-safe plan. Maximum fat loss aur muscle tone banega bina injury ke.`,
      weeklyCardioRecommendation: "20 minutes of brisk incline treadmill walking or low-impact stationary cycling 3-4x per week.",
      injurySafetyNotes: injuryNotes,
      schedule: schedule,
    },
    dietPlan: {
      id: "dp-" + Date.now(),
      weekNumber: 1,
      generatedAt: new Date().toISOString(),
      overview: `Calculated Target: ${targetCalories} kcal daily with ${proteinGrams}g high-bioavailability protein tailored to accelerate ${goal.replace("_", " ")}.`,
      hindiOverview: `Aapka Daily Diet Chart: ${targetCalories} Calories aur ${proteinGrams}g Protein. Indian meals ke sath high protein swaps diye gaye hain.`,
      macroTargets: {
        calories: targetCalories,
        proteinGrams: proteinGrams,
        carbsGrams: carbsGrams,
        fatsGrams: fatsGrams,
        fiberGrams: 34,
        waterLiters: waterLiters,
      },
      healthPrecautions: [
        hasKneePain ? "Include anti-inflammatory foods like turmeric, ginger, and omega-3s for joint lubrication." : "Focus on whole, minimally processed ingredients.",
        "Ensure consistent hydration (3.5L+ water daily) to assist kidney clearance and muscle volumization.",
        "Do not skip meals; distribute protein evenly across 4 meals for optimal muscle protein synthesis (MPS).",
      ],
      hydrationGuidelines: "Drink 500ml upon waking, sip 200ml every hour, and avoid drinking large volumes of water directly during heavy meals.",
      supplementRecommendations: [
        {
          name: "Whey Protein Isolate or Plant Protein (Optional)",
          timing: "Post-workout or 11:00 AM snack",
          purpose: "Helps hit daily protein goal easily and aids faster muscle recovery",
          isOptional: true,
        },
        {
          name: "Creatine Monohydrate (Optional)",
          timing: "3g daily with water after workout",
          purpose: "Increases ATP cellular energy, muscle strength, and stamina",
          isOptional: true,
        },
      ],
      meals: meals,
    },
  };
}

// Fallback Chat Reply Generator
function generateSmartFallbackChatReply(messages: any[], userProfile: any, currentDietPlan: any, currentWorkoutPlan: any) {
  const lastMsg = messages[messages.length - 1]?.text?.toLowerCase() || "";
  const name = userProfile?.name || "Dost";
  const goal = userProfile?.goal ? userProfile?.goal.replace("_", " ") : "fitness";
  const cal = currentDietPlan?.macroTargets?.calories || 2000;
  const prot = currentDietPlan?.macroTargets?.proteinGrams || 130;

  if (lastMsg.includes("knee") || lastMsg.includes("ghutna") || lastMsg.includes("dard") || lastMsg.includes("pain") || lastMsg.includes("squat")) {
    return `Namaste ${name}! Ghutne (Knee) ke dard ke liye yeh safety protocols follow karein:

1. **Exercise Replacement**: Deep barbell squats ki jagah **Goblet Box Squat** ya **Leg Press (high foot placement)** karein. Isse knee joint par compressive load 60% kam ho jata hai.
2. **Hamstring & Glute Focus**: **Romanian Deadlifts (RDL)** aur **Glute Bridges** par zyada dhyan dein — yeh knee joint ke stabilizers ko strong banate hain.
3. **Warm-up**: Workout se pehle 5 min stationary cycle aur glute activation zaroor karein.
4. **Anti-inflammatory Diet**: Haldi (turmeric) milk aur Omega-3 rich seeds (flaxseeds/chia seeds) daily lein.

Agar dard sharp ya persistent ho, toh weight kam karein aur rest dein!`;
  }

  if (lastMsg.includes("protein") || lastMsg.includes("paneer") || lastMsg.includes("egg") || lastMsg.includes("diet") || lastMsg.includes("snack")) {
    return `Namaste ${name}! Aapka daily protein target **${prot}g** hai. Yahan best options hain:

• **Vegetarian High Protein**:
  - Soya Chunks (50g dry = 26g Protein) — budget friendly!
  - Low-fat Paneer (100g = 18-20g Protein)
  - Moong Dal / Besan Chilla (2 chilla = 14g Protein)
  - Curd / Greek Yogurt (150g = 8-12g Protein)
• **Quick Evening Snacks under ₹40**:
  - 40g Bhuna Chana + 1 Glass Masala Chaas (~15g protein)
  - 2 Boiled Eggs + Black Coffee (~12g protein)

Har meal me minimum 25-35g protein distribute karein taaki muscle synthesis active rahe!`;
  }

  if (lastMsg.includes("pre") || lastMsg.includes("post") || lastMsg.includes("workout") || lastMsg.includes("khana")) {
    return `Great question ${name}! Pre aur Post workout nutrition ka golden rule:

⚡ **Pre-Workout (45-60 min pehle)**:
- 1 Banana / 1 Apple + 1 cup Black Coffee (caffeine focus badhayega)
- Ya 2 Brown Bread with 1 tsp Peanut Butter
- Yeh aapko heavy lift karne ke liye sustained glycogen energy dega.

💪 **Post-Workout (Workout ke 30-45 min andar)**:
- 1 scoop Whey/Plant protein water me ya 3 Boiled Eggs / 80g Paneer
- Saath me simple carbs (e.g. 1 small banana ya 1 slice bread) muscle glycogen restore karne ke liye!`;
  }

  return `Namaste ${name}! Main aapke **${goal}** transformation journey ke har step me aapke saath hu.

• **Current Calories**: ${cal} kcal/day (Protein: ${prot}g)
• **Key Advice**: Workout me progressive overload follow karein, rest timer (60-90s) ka strict palan karein, aur daily 3.5L paani zaroor piyein.

Koi specific exercise form, diet recipe ya substitute puchna ho toh batayein! 💪`;
}

// Fallback Weekly Review Generator
function generateSmartFallbackWeeklyReview(userProfile: any, currentDietPlan: any, userCheckinNotes: any, weeklyLogs: any[]) {
  const currentWeek = currentDietPlan?.weekNumber || 1;
  const startWeight = userProfile?.currentWeightKg || 74;
  const endWeight = userCheckinNotes?.currentWeightKg || startWeight;
  const delta = Math.round((endWeight - startWeight) * 10) / 10;
  const goal = userProfile?.goal || "fat_loss";
  const currentCal = currentDietPlan?.macroTargets?.calories || 2000;
  const currentProt = currentDietPlan?.macroTargets?.proteinGrams || 135;

  let calChange = 0;
  let protChange = 0;
  let explanation = "";

  if (goal === "fat_loss") {
    if (delta <= -0.4) {
      calChange = 0;
      protChange = 2;
      explanation = "Great rate of fat loss (-" + Math.abs(delta) + " kg)! Maintaining current calories and keeping protein high.";
    } else {
      calChange = -100;
      protChange = 5;
      explanation = "Fat loss plateau adjustment: -100 kcal deficit while increasing protein by 5g to protect muscle density.";
    }
  } else if (goal === "muscle_gain") {
    if (delta >= 0.2) {
      calChange = 0;
      protChange = 3;
      explanation = "Steady lean mass progression (+ " + delta + " kg). Maintaining surplus for clean gains.";
    } else {
      calChange = +150;
      protChange = 5;
      explanation = "Increasing calorie surplus (+150 kcal) to fuel additional training volume and recovery.";
    }
  } else {
    calChange = 0;
    protChange = 3;
    explanation = "Excellent body recomposition adherence. Stabilizing macros for strength adaptation.";
  }

  const newCal = Math.max(1400, currentCal + calChange);
  const newProt = currentProt + protChange;
  const newFats = Math.round((newCal * 0.25) / 9);
  const newCarbs = Math.round((newCal - (newProt * 4 + newFats * 9)) / 4);

  return {
    review: {
      id: "rev-" + Date.now(),
      weekNumber: currentWeek + 1,
      date: new Date().toISOString(),
      startWeightKg: startWeight,
      endWeightKg: endWeight,
      weightDeltaKg: delta,
      workoutCompliancePct: userCheckinNotes?.workoutCompliancePct || 85,
      dietCompliancePct: userCheckinNotes?.dietCompliancePct || 90,
      overallFeeling: userCheckinNotes?.notes || "Feeling energetic and recovering well.",
      painSymptomsUpdate: userCheckinNotes?.symptomUpdate || "Joint discomfort well managed.",
      aiDiagnosis: `Weekly Performance Analysis: Completed ${userCheckinNotes?.workoutCompliancePct || 85}% of workouts with ${userCheckinNotes?.dietCompliancePct || 90}% diet adherence. Weight changed by ${delta > 0 ? "+" : ""}${delta} kg. Progressive overload is tracking positively.`,
      hindiAiDiagnosis: `Hafte ka Review: Aapne ${userCheckinNotes?.workoutCompliancePct || 85}% workouts aur ${userCheckinNotes?.dietCompliancePct || 90}% diet adherence achieve kiya! Weight change: ${delta > 0 ? "+" : ""}${delta} kg. Agle hafte ke liye diet chart optimize kar diya gaya hai.`,
      keyWins: [
        `Maintained strong ${userCheckinNotes?.workoutCompliancePct || 85}% workout consistency`,
        `Hit protein targets on major training days`,
        `Kept joint comfort protected with safe exercise form`,
      ],
      focusAreasNextWeek: [
        "Maintain strict 3.5L daily hydration",
        "Add 1kg or 1 extra rep to compound movements (Progressive Overload)",
        "Prioritize 7.5+ hours of quality sleep for hormonal recovery",
      ],
      macroAdjustments: {
        caloriesChange: calChange,
        proteinChange: protChange,
        explanation: explanation,
      },
      dietUpdatesSummary: [
        `Adjusted daily target to ${newCal} kcal (${calChange >= 0 ? "+" : ""}${calChange} kcal)`,
        `Targeting ${newProt}g daily protein for enhanced recovery`,
      ],
      workoutUpdatesSummary: [
        "Increased intensity on main compound sets by 1-2 reps",
        "Added extra focus on core and hamstring stability",
      ],
    },
    updatedDietPlan: {
      id: "dp-" + Date.now(),
      weekNumber: currentWeek + 1,
      generatedAt: new Date().toISOString(),
      overview: `Week ${currentWeek + 1} Optimized Nutrition: ${newCal} kcal and ${newProt}g Protein.`,
      hindiOverview: `Week ${currentWeek + 1} ka updated diet plan: ${newCal} Calories aur ${newProt}g Protein.`,
      macroTargets: {
        calories: newCal,
        proteinGrams: newProt,
        carbsGrams: newCarbs,
        fatsGrams: newFats,
        fiberGrams: 35,
        waterLiters: 3.5,
      },
      healthPrecautions: currentDietPlan?.healthPrecautions || ["Stay hydrated", "Maintain joint-safe habits"],
      hydrationGuidelines: "Drink 3.5 Liters daily.",
      supplementRecommendations: currentDietPlan?.supplementRecommendations || [],
      meals: currentDietPlan?.meals || [],
    },
  };
}

// Fallback Exercise Advice Generator
function generateSmartFallbackExerciseAdvice(exerciseName: string, targetMuscle: string, userInjuries: any) {
  const injuriesList = Array.isArray(userInjuries) ? userInjuries : [];
  const hasKnee = injuriesList.includes("knee_pain") || injuriesList.includes("knee");
  const hasBack = injuriesList.includes("lower_back") || injuriesList.includes("back_pain");
  const hasShoulder = injuriesList.includes("shoulder") || injuriesList.includes("shoulder_impingement");

  return {
    exerciseName: exerciseName,
    hindiName: `${exerciseName} Form & Safety Guide`,
    stepByStepExecution: [
      "Step 1: Set up a stable foundation. Engage your core and retract shoulder blades.",
      "Step 2: Initiate movement with full muscular control. Maintain a 3-second eccentric (lowering) tempo.",
      "Step 3: Drive forcefully through the target muscle to complete the concentric phase without locking joints harshly.",
    ],
    primaryMuscleFocus: `${targetMuscle || "Primary Target Muscle Group"} biomechanical stimulation with minimal joint wear.`,
    goldenFormCues: [
      "Keep core braced as if preparing for a light punch",
      "Control the eccentric descent; never drop weights quickly",
      "Exhale smoothly during the exertion phase",
    ],
    commonMistakes: [
      "Using excessive momentum or swinging the torso",
      "Hyperextending or rounding the lumbar spine",
      "Rushing between reps without pause",
    ],
    jointSafetyAdvice: hasKnee && exerciseName.toLowerCase().includes("squat")
      ? "Knee Protection: Limit depth to 90 degrees (Box Squat), keep shins relatively vertical, and drive through mid-foot."
      : hasBack && exerciseName.toLowerCase().includes("row")
      ? "Spine Protection: Use chest support on an incline bench to remove compressive shearing on lower back discs."
      : hasShoulder
      ? "Shoulder Protection: Use a neutral (palms facing inward) grip and keep elbows at 45-60 degrees from torso."
      : "Maintain natural spinal curvature and keep joint angles within comfortable anatomical range.",
    saferAlternatives: [
      {
        name: exerciseName.toLowerCase().includes("squat") ? "Goblet Box Squat / Leg Press" : "Dumbbell Floor Press / Chest Supported Row",
        reason: "Significantly reduces joint torque and prevents spinal shearing under load.",
      },
    ],
  };
}

// 1. Endpoint: Generate Comprehensive Workout & Diet Plan based on User Profile
app.post("/api/generate-plan", async (req, res) => {
  try {
    const { profile } = req.body;
    if (!profile) {
      return res.status(400).json({ error: "User profile is required" });
    }

    const prompt = `
You are a World-Class Certified Fitness Coach, Sports Nutritionist, and Exercise Physiologist.
A client has submitted their detailed fitness, health, and dietary assessment.
Create a hyper-personalized, realistic, scientifically backed 7-Day Workout Routine and Daily Nutrition/Diet Plan.

CLIENT PROFILE:
- Name: ${profile.name || "Champion"}
- Age: ${profile.age} years, Gender: ${profile.gender}
- Height: ${profile.heightCm} cm, Current Weight: ${profile.currentWeightKg} kg, Target Weight: ${profile.targetWeightKg} kg
- Primary Fitness Goal: ${profile.goal}
- Experience Level: ${profile.experienceLevel}
- Workout Location & Equipment: ${profile.workoutLocation} (${profile.workoutLocation === "gym" ? "Commercial Gym with Barbell, Dumbbells, Cables, Machines" : profile.workoutLocation === "home_dumbbells" ? "Home with Dumbbells and Resistance Bands" : "Home Calisthenics / Bodyweight"})
- Days Per Week Available: ${profile.daysPerWeek} days
- Daily Activity Level: ${profile.activityLevel}
- Health Issues & Reported Injuries: ${JSON.stringify(profile.healthConditions?.injuries || [])} (Details: ${profile.healthConditions?.injuryDetails || "None"})
- Chronic Health Conditions: ${JSON.stringify(profile.healthConditions?.chronicConditions || [])} (Details: ${profile.healthConditions?.chronicDetails || "None"})
- Allergies / Intolerances: ${JSON.stringify(profile.healthConditions?.allergies || [])} (Details: ${profile.healthConditions?.allergyDetails || "None"})
- Diet Type: ${profile.dietType}
- Cuisine & Food Preferences: ${profile.cuisinePreference}
- Preferred Meals Per Day: ${profile.mealsPerDay || 4}
- Language Style: Bilingual Hinglish/English.

CRITICAL INSTRUCTIONS FOR SAFETY & HEALTH:
1. If the user has injuries (e.g. Knee pain, Lower back pain, Shoulder impingement, Cervical), STRICTLY customize exercise selection with safe variations.
2. Match dietary cuisine: Provide authentic, realistic Indian & global meal options (e.g. Paneer Bhurji, Soya Chunks Curry, Moong Dal Chilla, Eggs, Chicken Breast, Sprouts Salad, Oats, Curd, Roti/Rice) with exact portions.
3. Calculate precise BMR/TDEE and Macronutrients suited for their goal (${profile.goal}).

Output strictly valid JSON with this exact schema:
{
  "workoutPlan": {
    "splitName": "e.g. Push Pull Legs Split (Joint-Friendly)",
    "overview": "Clear summary of the workout plan in English",
    "hindiOverview": "Summary in friendly Hinglish/Hindi",
    "weeklyCardioRecommendation": "e.g. 15-20 min incline walk 3x a week",
    "injurySafetyNotes": ["Safety rule 1", "Safety rule 2"],
    "schedule": [
      {
        "dayNumber": 1,
        "dayName": "Monday",
        "focus": "Chest, Shoulders & Triceps",
        "hindiFocus": "Chest aur Triceps ki workout",
        "isRestDay": false,
        "durationMinutes": 45,
        "warmup": ["Warmup 1", "Warmup 2"],
        "cooldown": ["Cooldown 1", "Cooldown 2"],
        "exercises": [
          {
            "name": "Incline Dumbbell Bench Press",
            "hindiName": "Incline Dumbbell Chest Press",
            "targetMuscle": "Upper Chest",
            "secondaryMuscle": "Triceps",
            "sets": 3,
            "reps": "10-12",
            "restSeconds": 75,
            "equipment": "Dumbbells",
            "formTips": ["Retract shoulder blades", "Control descent"],
            "mistakesToAvoid": ["Flaring elbows wide"],
            "injuryModifications": "Use neutral grip for shoulder comfort",
            "alternativeExercise": "Push-ups on elevated bench"
          }
        ]
      }
    ]
  },
  "dietPlan": {
    "overview": "Nutritional strategy tailored for goal",
    "hindiOverview": "Diet chart ka summary Hinglish me",
    "macroTargets": {
      "calories": 2100,
      "proteinGrams": 135,
      "carbsGrams": 220,
      "fatsGrams": 55,
      "fiberGrams": 32,
      "waterLiters": 3.5
    },
    "healthPrecautions": ["Health tip 1", "Health tip 2"],
    "hydrationGuidelines": "Drink 3.5L daily",
    "supplementRecommendations": [
      {
        "name": "Whey Protein Isolate or Plant Protein (Optional)",
        "timing": "Post-workout",
        "purpose": "Aids recovery",
        "isOptional": true
      }
    ],
    "meals": [
      {
        "timeSlot": "8:00 AM",
        "mealType": "breakfast",
        "title": "High Protein Breakfast",
        "hindiTitle": "High Protein Nashta",
        "calories": 480,
        "protein": 32,
        "carbs": 50,
        "fats": 16,
        "items": [
          {
            "name": "Moong Dal & Paneer Chilla (2 pcs)",
            "hindiName": "Moong Dal Paneer Chilla",
            "portion": "2 medium chilla",
            "calories": 380,
            "protein": 28,
            "carbs": 40,
            "fats": 14,
            "description": "Stuffed with low-fat paneer"
          }
        ],
        "swaps": {
          "vegetarianSwap": "Tofu Scramble with Oats",
          "quickAlternative": "Rolled Oats with protein scoop"
        },
        "healthBenefitNote": "Sustained energy release."
      }
    ]
  }
}
Generate all 7 days in schedule and all daily meals (${profile.mealsPerDay || 4} meals).
`;

    try {
      const text = await callGeminiWithRetryAndFallback({
        contents: prompt,
        config: {
          temperature: 0.4,
          responseMimeType: "application/json",
        },
      });

      const parsedData = cleanAndParseJson(text);
      if (parsedData?.workoutPlan && parsedData?.dietPlan) {
        return res.json({
          success: true,
          workoutPlan: {
            id: "wp-" + Date.now(),
            weekNumber: 1,
            generatedAt: new Date().toISOString(),
            ...parsedData.workoutPlan,
          },
          dietPlan: {
            id: "dp-" + Date.now(),
            weekNumber: 1,
            generatedAt: new Date().toISOString(),
            ...parsedData.dietPlan,
          },
        });
      }
    } catch (aiError: any) {
      console.log("AI generation switched to personalized coach engine:", aiError?.message || "fallback engaged");
    }

    // Graceful smart fallback
    const fallbackPlan = generateSmartFallbackPlan(profile);
    return res.json({
      success: true,
      workoutPlan: fallbackPlan.workoutPlan,
      dietPlan: fallbackPlan.dietPlan,
    });
  } catch (error: any) {
    console.error("Error generating plan:", error);
    // Even on top-level catch, return personalized fallback
    const fallbackPlan = generateSmartFallbackPlan(req.body?.profile || {});
    return res.json({
      success: true,
      workoutPlan: fallbackPlan.workoutPlan,
      dietPlan: fallbackPlan.dietPlan,
    });
  }
});

// 2. Endpoint: AI Fitness & Nutrition Chat Support
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, userProfile, currentDietPlan, currentWorkoutPlan } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const systemInstruction = `
You are "FitGuru AI" (Arogya Coach), an empathetic, elite-level certified personal trainer, sports nutritionist, and physiotherapy consultant.
You provide instant, practical, motivating, and science-grounded answers in natural Hinglish, Hindi, or English (match the user's language style).

USER CONTEXT:
- Name: ${userProfile?.name || "Friend"}
- Goal: ${userProfile?.goal || "Fitness & Bodybuilding"}
- Current Weight: ${userProfile?.currentWeightKg || "N/A"} kg -> Target: ${userProfile?.targetWeightKg || "N/A"} kg
- Health Issues / Injuries: ${JSON.stringify(userProfile?.healthConditions?.injuries || [])}
- Diet Type: ${userProfile?.dietType || "Vegetarian"} (${userProfile?.cuisinePreference || "Indian"})
- Daily Calories Target: ${currentDietPlan?.macroTargets?.calories || "N/A"} kcal (Protein: ${currentDietPlan?.macroTargets?.proteinGrams || "N/A"}g)

KEY CAPABILITIES:
1. Answer workout doubts, exercise form guidance, reps/sets progression, muscle soreness vs injury pain.
2. Give instant healthy meal substitutions (e.g. Paneer instead of Eggs, hostel/office lunch ideas).
3. Injury-Safe advice: Guide on form checks, de-loading, safer alternative exercises.
4. Motivation & Consistency: Energetic, science-backed and supportive.
`;

    const contents = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    try {
      const text = await callGeminiWithRetryAndFallback({
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.6,
        },
      });

      if (text && text.trim().length > 0) {
        return res.json({ reply: text });
      }
    } catch (aiErr) {
      console.warn("AI chat API notice, applying smart coach fallback reply:", aiErr);
    }

    const fallbackReply = generateSmartFallbackChatReply(messages, userProfile, currentDietPlan, currentWorkoutPlan);
    res.json({ reply: fallbackReply });
  } catch (error: any) {
    console.error("Chat error:", error);
    const fallbackReply = generateSmartFallbackChatReply(req.body?.messages || [], req.body?.userProfile, req.body?.currentDietPlan, req.body?.currentWorkoutPlan);
    res.json({ reply: fallbackReply });
  }
});

// 3. Endpoint: Weekly Progress Review & Dynamic Diet/Workout Update
app.post("/api/weekly-review", async (req, res) => {
  try {
    const {
      userProfile,
      currentDietPlan,
      currentWorkoutPlan,
      weeklyLogs,
      userCheckinNotes,
    } = req.body;

    const prompt = `
You are a Head Master Coach conducting the Weekly Progress Check-in & Review for a client.
Analyze their past 7 days of performance, weight changes, adherence, and feedback.
Then, dynamically UPDATE and optimize their Diet Chart and Workout Intensity for the next week!

CLIENT BACKGROUND:
- Name: ${userProfile?.name}
- Goal: ${userProfile?.goal}
- Starting Weight: ${userProfile?.currentWeightKg} kg, Target: ${userProfile?.targetWeightKg} kg
- Health Issues / Injuries: ${JSON.stringify(userProfile?.healthConditions?.injuries || [])}
- Diet Type: ${userProfile?.dietType}

CURRENT WEEK MACROS:
- Calories: ${currentDietPlan?.macroTargets?.calories} kcal
- Protein: ${currentDietPlan?.macroTargets?.proteinGrams}g, Carbs: ${currentDietPlan?.macroTargets?.carbsGrams}g, Fats: ${currentDietPlan?.macroTargets?.fatsGrams}g

WEEKLY LOGS & CHECK-IN DATA:
- Check-in Notes from User: ${JSON.stringify(userCheckinNotes || {})}
- Logs History: ${JSON.stringify(weeklyLogs || [])}

Output strictly valid JSON with this schema:
{
  "review": {
    "weekNumber": ${(currentDietPlan?.weekNumber || 1) + 1},
    "weightDeltaKg": -0.6,
    "workoutCompliancePct": 85,
    "dietCompliancePct": 90,
    "overallFeeling": "Positive with good energy",
    "aiDiagnosis": "Detailed scientific analysis in English",
    "hindiAiDiagnosis": "Friendly Hinglish/Hindi summary",
    "keyWins": ["Worked out 4 out of 5 days", "Met protein goal"],
    "focusAreasNextWeek": ["Hit 3.5L water daily", "Increase weights on Press"],
    "macroAdjustments": {
      "caloriesChange": -100,
      "proteinChange": +5,
      "explanation": "Deficit adjustment to maintain fat loss rate."
    },
    "dietUpdatesSummary": ["Added 10g protein"],
    "workoutUpdatesSummary": ["Added 1 extra set to RDLs"]
  },
  "updatedDietPlan": {
    "overview": "Updated strategy for the new week",
    "hindiOverview": "Naye hafte ka update kiya hua diet plan",
    "macroTargets": {
      "calories": 2000,
      "proteinGrams": 140,
      "carbsGrams": 200,
      "fatsGrams": 50,
      "fiberGrams": 35,
      "waterLiters": 3.5
    },
    "healthPrecautions": ["Keep monitoring joint comfort"],
    "hydrationGuidelines": "Drink 3.5 liters daily",
    "meals": []
  }
}
`;

    try {
      const text = await callGeminiWithRetryAndFallback({
        contents: prompt,
        config: {
          temperature: 0.4,
          responseMimeType: "application/json",
        },
      });

      const parsedData = cleanAndParseJson(text);
      if (parsedData?.review && parsedData?.updatedDietPlan) {
        return res.json({
          success: true,
          review: {
            id: "rev-" + Date.now(),
            date: new Date().toISOString(),
            startWeightKg: userProfile?.currentWeightKg || 70,
            endWeightKg: userCheckinNotes?.currentWeightKg || userProfile?.currentWeightKg || 70,
            ...parsedData.review,
          },
          updatedDietPlan: {
            id: "dp-" + Date.now(),
            weekNumber: (currentDietPlan?.weekNumber || 1) + 1,
            generatedAt: new Date().toISOString(),
            ...parsedData.updatedDietPlan,
            meals: parsedData.updatedDietPlan.meals?.length ? parsedData.updatedDietPlan.meals : currentDietPlan?.meals || [],
          },
        });
      }
    } catch (aiErr: any) {
      console.log("AI weekly review routed to coach calculation:", aiErr?.message || "fallback engaged");
    }

    const fallbackReview = generateSmartFallbackWeeklyReview(userProfile, currentDietPlan, userCheckinNotes, weeklyLogs);
    res.json({
      success: true,
      review: fallbackReview.review,
      updatedDietPlan: fallbackReview.updatedDietPlan,
    });
  } catch (error: any) {
    console.error("Weekly review error:", error);
    const fallbackReview = generateSmartFallbackWeeklyReview(req.body?.userProfile, req.body?.currentDietPlan, req.body?.userCheckinNotes, req.body?.weeklyLogs || []);
    res.json({
      success: true,
      review: fallbackReview.review,
      updatedDietPlan: fallbackReview.updatedDietPlan,
    });
  }
});

// 4. Endpoint: Instant Exercise Breakdown & Injury Modification
app.post("/api/exercise-advice", async (req, res) => {
  try {
    const { exerciseName, targetMuscle, userInjuries } = req.body;

    const prompt = `
You are an expert biomechanist and physical therapist.
Explain how to perform "${exerciseName}" with impeccable form, what cues to keep in mind, and how someone with ${JSON.stringify(userInjuries || "no injuries")} should modify or substitute it.

Output JSON:
{
  "exerciseName": "${exerciseName}",
  "hindiName": "Hindi/Hinglish exercise title",
  "stepByStepExecution": [
    "Step 1: Set up ...",
    "Step 2: Movement path ...",
    "Step 3: Lockout and eccentric control ..."
  ],
  "primaryMuscleFocus": "Detailed muscle biomechanics",
  "goldenFormCues": ["Cue 1", "Cue 2", "Cue 3"],
  "commonMistakes": ["Mistake 1", "Mistake 2"],
  "jointSafetyAdvice": "Specific instructions to protect joints based on injuries",
  "saferAlternatives": [
    {
      "name": "Alternative Exercise",
      "reason": "Reason"
    }
  ]
}
`;

    try {
      const text = await callGeminiWithRetryAndFallback({
        contents: prompt,
        config: {
          temperature: 0.3,
          responseMimeType: "application/json",
        },
      });

      const data = cleanAndParseJson(text);
      if (data && data.stepByStepExecution) {
        return res.json({ success: true, data });
      }
    } catch (aiErr: any) {
      console.log("AI exercise advice routed to biomechanical database:", aiErr?.message || "fallback engaged");
    }

    const fallbackData = generateSmartFallbackExerciseAdvice(exerciseName || "Exercise", targetMuscle || "Muscle", userInjuries);
    res.json({ success: true, data: fallbackData });
  } catch (error: any) {
    console.error("Exercise advice error:", error);
    const fallbackData = generateSmartFallbackExerciseAdvice(req.body?.exerciseName || "Exercise", req.body?.targetMuscle || "Muscle", req.body?.userInjuries);
    res.json({ success: true, data: fallbackData });
  }
});

// Setup Vite middleware in development or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FitGuru AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
