import { FullPlan, ProgressEntry, UserProfile, WeeklyCheckIn, ChatMessage } from "../types";
import { DEFAULT_PROFILE, SAMPLE_FULL_PLAN } from "../data/defaultPlans";

const STORAGE_KEYS = {
  PROFILE: "fitforge_user_profile",
  PLAN: "fitforge_current_plan",
  PROGRESS: "fitforge_progress_logs",
  WEEKLY_CHECKINS: "fitforge_weekly_checkins",
  ACTIVE_DAY: "fitforge_active_workout_day",
  CHAT: "fitforge_chat_messages",
  COMPLETED_SETS: "fitforge_completed_exercise_sets",
};

export const getStoredProfile = (): UserProfile => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load profile from storage", e);
  }
  return DEFAULT_PROFILE;
};

export const saveProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save profile", e);
  }
};

export const getStoredPlan = (): FullPlan => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PLAN);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load plan from storage", e);
  }
  return SAMPLE_FULL_PLAN;
};

export const savePlan = (plan: FullPlan): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(plan));
  } catch (e) {
    console.error("Failed to save plan", e);
  }
};

export const getStoredProgress = (): ProgressEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load progress from storage", e);
  }
  return [
    {
      id: "entry-1",
      date: new Date(Date.now() - 21 * 86400000).toISOString().split("T")[0],
      weight: 68.5,
      chest: 96,
      waist: 82,
      biceps: 34,
      thighs: 53,
      energyLevel: "medium",
      adherenceScore: 85,
      notes: "Started program, initial measurements taken."
    },
    {
      id: "entry-2",
      date: new Date(Date.now() - 14 * 86400000).toISOString().split("T")[0],
      weight: 69.2,
      chest: 97,
      waist: 81.5,
      biceps: 34.5,
      thighs: 53.5,
      energyLevel: "high",
      adherenceScore: 92,
      notes: "Strength increasing in incline press."
    },
    {
      id: "entry-3",
      date: new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0],
      weight: 69.8,
      chest: 98,
      waist: 81.5,
      biceps: 35,
      thighs: 54,
      energyLevel: "high",
      adherenceScore: 95,
      notes: "Feeling solid pump, recovery is smooth with high protein."
    },
    {
      id: "entry-4",
      date: new Date().toISOString().split("T")[0],
      weight: 70.4,
      chest: 98.5,
      waist: 81.5,
      biceps: 35.5,
      thighs: 54.5,
      energyLevel: "peak",
      adherenceScore: 98,
      notes: "Current week check-in. Muscle definition visibly improved."
    }
  ];
};

export const saveProgress = (entries: ProgressEntry[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(entries));
  } catch (e) {
    console.error("Failed to save progress", e);
  }
};

export const getStoredWeeklyCheckIns = (): WeeklyCheckIn[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WEEKLY_CHECKINS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load weekly checkins", e);
  }
  return [
    {
      id: "chk-1",
      weekNumber: 1,
      date: new Date(Date.now() - 14 * 86400000).toISOString().split("T")[0],
      currentWeight: 69.2,
      weightDifference: 0.7,
      workoutAdherence: 90,
      dietAdherence: 85,
      energyLevel: "High",
      recoveryStatus: "Good, mild soreness in chest",
      healthStatusUpdate: "No back pain experienced with chest-supported rows",
      userNotes: "Protein intake maintained at 130-140g.",
      aiAnalysis: {
        verdict: "Great Lean Bulk Momentum",
        weightTrendAnalysis: "0.7kg increase over 7 days is a healthy rate. Muscle glycogen and protein assimilation are positive.",
        calorieAdjustment: "+100 kcal / maintained",
        coachWeeklyAdvice: "Keep progressive overload constant on compound lifts. Add 1 extra warm-up set for shoulder stability.",
        healthRecoveryNotes: "Chest-supported back rows are protecting the lower back perfectly."
      }
    }
  ];
};

export const saveWeeklyCheckIns = (checkins: WeeklyCheckIn[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.WEEKLY_CHECKINS, JSON.stringify(checkins));
  } catch (e) {
    console.error("Failed to save weekly checkins", e);
  }
};

export const getStoredChat = (): ChatMessage[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CHAT);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load chat", e);
  }
  return [
    {
      id: "msg-1",
      sender: "ai",
      text: "Namaste & Welcome to FitForge AI! Main aapka personal Bodybuilding & Fitness Coach hoon. Aapka customized workout plan, daily exercises, aur health-safe diet chart ready hai. Har hafte hum aapke progress ke hisab se diet aur workout adjust karenge. Aap mujhse gym routines, diet alternatives, ya health issues ke baare mein kuch bhi puch sakte hain!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ];
};

export const saveChat = (messages: ChatMessage[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(messages));
  } catch (e) {
    console.error("Failed to save chat", e);
  }
};
