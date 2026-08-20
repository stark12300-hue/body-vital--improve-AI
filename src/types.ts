export interface UserProfile {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  height: number; // in cm
  weight: number; // in kg
  targetWeight: number; // in kg
  goal: "muscle_building" | "lean_bulk" | "fat_loss" | "strength" | "recomp";
  experienceLevel: "beginner" | "intermediate" | "advanced";
  workoutLocation: "gym" | "home_equipment" | "bodyweight_only";
  equipment: string;
  daysPerWeek: number;
  workoutDuration: number; // in minutes (30, 45, 60, 75, 90)
  dietPreference: "veg" | "eggetarian" | "non_veg" | "vegan" | "jain";
  cuisinePreference: string;
  budgetPreference: "budget_friendly" | "moderate" | "premium";
  healthIssues: string[];
  healthNotes: string;
}

export interface SetLog {
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  sets: number;
  reps: string;
  restSeconds: number;
  formTips: string;
  safetyNote?: string;
  alternativeExercise?: string;
  logs?: SetLog[];
}

export interface WorkoutDay {
  dayNumber: number;
  dayName: string;
  focus: string;
  isRestDay: boolean;
  warmup: string[];
  cooldown: string[];
  exercises: Exercise[];
  completed?: boolean;
  completedAt?: string;
}

export interface WorkoutPlan {
  splitName: string;
  overview: string;
  days: WorkoutDay[];
}

export interface MealItem {
  food: string;
  protein: number;
  calories: number;
  alternative?: string;
}

export interface Meal {
  mealName: string;
  timing: string;
  items: MealItem[];
  mealProtein: number;
  mealCalories: number;
  notes?: string;
}

export interface SupplementItem {
  name: string;
  purpose: string;
  dosageTiming: string;
  isOptional: boolean;
}

export interface DietChart {
  dietType: string;
  meals: Meal[];
  supplementsGuidance: SupplementItem[];
  generalTips: string[];
}

export interface PlanSummary {
  caloriesTarget: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  waterLiters: number;
  bmr?: number;
  tdee?: number;
  coachInsight: string;
  healthPrecautions: string[];
}

export interface FullPlan {
  id: string;
  createdAt: string;
  version: number;
  summary: PlanSummary;
  workoutPlan: WorkoutPlan;
  dietChart: DietChart;
}

export interface ProgressEntry {
  id: string;
  date: string;
  weight: number;
  chest?: number;
  waist?: number;
  biceps?: number;
  thighs?: number;
  energyLevel?: "low" | "medium" | "high" | "peak";
  adherenceScore?: number; // 0-100
  notes?: string;
  healthStatus?: string;
}

export interface WeeklyCheckIn {
  id: string;
  weekNumber: number;
  date: string;
  currentWeight: number;
  weightDifference: number;
  workoutAdherence: number;
  dietAdherence: number;
  energyLevel: string;
  recoveryStatus: string;
  healthStatusUpdate: string;
  userNotes: string;
  aiAnalysis?: {
    verdict: string;
    weightTrendAnalysis: string;
    calorieAdjustment: string;
    coachWeeklyAdvice: string;
    healthRecoveryNotes?: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}
