export type Gender = 'male' | 'female' | 'other';

export type FitnessGoal = 
  | 'muscle_gain' // Bulking / Muscle Hypertrophy
  | 'fat_loss' // Cutting / Weight Loss
  | 'lean_recomp' // Body Recomposition (Build muscle + lose fat)
  | 'strength_endurance' // Functional Strength & Stamina
  | 'general_fitness'; // Active Lifestyle & Mobility

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export type WorkoutLocation = 'gym' | 'home_dumbbells' | 'home_calisthenics';

export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';

export type DietType = 'vegetarian' | 'non_vegetarian' | 'eggetarian' | 'vegan' | 'jain';

export type CuisinePreference = 'indian_north' | 'indian_south' | 'indian_balanced' | 'continental' | 'high_protein_budget';

export interface HealthConditions {
  injuries: string[]; // e.g. 'lower_back', 'knee_pain', 'shoulder_pain', 'wrist_pain', 'neck_pain', 'none'
  injuryDetails?: string;
  chronicConditions: string[]; // e.g. 'diabetes', 'hypertension', 'thyroid', 'pcos', 'cholesterol', 'asthma', 'gerd', 'none'
  chronicDetails?: string;
  allergies: string[]; // e.g. 'lactose', 'gluten', 'peanuts', 'soy', 'none'
  allergyDetails?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  city?: string;
  isPublicLeaderboard?: boolean;
  age: number;
  gender: Gender;
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  goal: FitnessGoal;
  experienceLevel: FitnessLevel;
  workoutLocation: WorkoutLocation;
  daysPerWeek: number;
  activityLevel: ActivityLevel;
  healthConditions: HealthConditions;
  dietType: DietType;
  cuisinePreference: CuisinePreference;
  dailyBudget?: 'budget_friendly' | 'moderate' | 'premium';
  mealsPerDay: number;
  language: 'hinglish' | 'english' | 'hindi';
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceScoreBreakdown {
  workoutScore: number; // Max 35
  dietScore: number; // Max 25
  consistencyScore: number; // Max 20
  hydrationScore: number; // Max 10
  progressScore: number; // Max 10
  total: number; // Max 100
  tier: 'Titan' | 'Gold' | 'Silver' | 'Bronze' | 'RisingStar';
  tierBadge: string;
  rankTitle: string;
}

export interface CommunityBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt?: string;
}

export interface CommunityMember {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  city: string;
  bio: string;
  goal: FitnessGoal;
  experienceLevel: FitnessLevel;
  dietType: DietType;
  currentWeightKg: number;
  targetWeightKg: number;
  startWeightKg?: number;
  performanceScore: number; // 0 - 100
  scoreBreakdown: PerformanceScoreBreakdown;
  streakDays: number;
  totalWorkoutsCompleted: number;
  avgDietAdherence: number;
  tier: 'Titan' | 'Gold' | 'Silver' | 'Bronze' | 'RisingStar';
  badges: CommunityBadge[];
  cheersCount: number;
  joinedDate: string;
  lastActive: string;
  isCurrentUser?: boolean;
}

export interface MacroTargets {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  fiberGrams: number;
  waterLiters: number;
}

export interface MealItem {
  id: string;
  name: string;
  hindiName?: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  description?: string;
}

export interface Meal {
  id: string;
  timeSlot: string; // e.g. "8:00 AM"
  mealType: 'breakfast' | 'mid_morning' | 'lunch' | 'pre_workout' | 'post_workout' | 'dinner' | 'bedtime';
  title: string;
  hindiTitle?: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  items: MealItem[];
  swaps?: {
    vegetarianSwap?: string;
    quickAlternative?: string;
  };
  healthBenefitNote?: string;
}

export interface DietPlan {
  id: string;
  weekNumber: number;
  generatedAt: string;
  overview: string;
  hindiOverview?: string;
  macroTargets: MacroTargets;
  meals: Meal[];
  healthPrecautions: string[];
  hydrationGuidelines: string;
  supplementRecommendations?: {
    name: string;
    timing: string;
    purpose: string;
    isOptional: boolean;
  }[];
}

export interface ExerciseSet {
  setNumber: number;
  targetReps: string; // e.g. "8-12"
  actualWeightKg?: number;
  actualReps?: number;
  isCompleted: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  hindiName?: string;
  targetMuscle: string;
  secondaryMuscle?: string;
  sets: number;
  reps: string;
  restSeconds: number;
  equipment: string;
  formTips: string[];
  mistakesToAvoid: string[];
  injuryModifications?: string;
  alternativeExercise?: string;
  setLogs?: ExerciseSet[];
}

export interface WorkoutDay {
  dayNumber: number;
  dayName: string; // e.g. "Monday"
  focus: string; // e.g. "Chest & Triceps (Push Day)"
  hindiFocus?: string;
  isRestDay: boolean;
  warmup: string[];
  exercises: Exercise[];
  cooldown: string[];
  durationMinutes: number;
}

export interface WorkoutPlan {
  id: string;
  weekNumber: number;
  generatedAt: string;
  splitName: string;
  overview: string;
  hindiOverview?: string;
  schedule: WorkoutDay[];
  weeklyCardioRecommendation: string;
  injurySafetyNotes: string[];
}

export interface ProgressLog {
  id: string;
  date: string;
  weightKg: number;
  bodyFatPct?: number;
  chestCm?: number;
  waistCm?: number;
  bicepCm?: number;
  thighCm?: number;
  energyScore: number; // 1 to 5
  painScore: number; // 0 to 5 (0: no pain, 5: severe)
  symptomNotes?: string;
  workoutCompleted: boolean;
  dietAdherencePct: number; // 0 to 100
  waterLitersDrank: number;
  sleepHours: number;
  notes?: string;
}

export interface WeeklyReview {
  id: string;
  weekNumber: number;
  date: string;
  startWeightKg: number;
  endWeightKg: number;
  weightDeltaKg: number;
  workoutCompliancePct: number;
  dietCompliancePct: number;
  overallFeeling: string;
  painSymptomsUpdate: string;
  aiDiagnosis: string;
  hindiAiDiagnosis?: string;
  keyWins: string[];
  focusAreasNextWeek: string[];
  macroAdjustments?: {
    caloriesChange: number;
    proteinChange: number;
    explanation: string;
  };
  dietUpdatesSummary: string[];
  workoutUpdatesSummary: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  quickActions?: {
    label: string;
    action: string;
  }[];
}
