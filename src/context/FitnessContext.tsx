import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  UserProfile,
  WorkoutPlan,
  DietPlan,
  ProgressLog,
  WeeklyReview,
  ChatMessage,
  CommunityMember,
  PerformanceScoreBreakdown,
  CommunityQuestion,
  CommunityAnswer,
  CommunityCategory,
} from '../types';
import {
  SAMPLE_PROFILE,
  SAMPLE_WORKOUT_PLAN,
  SAMPLE_DIET_PLAN,
  INITIAL_PROGRESS_LOGS,
} from '../data/defaultPlans';
import { INITIAL_COMMUNITY_QUESTIONS } from '../data/communityDiscussions';

interface FitnessContextType {
  userProfile: UserProfile | null;
  workoutPlan: WorkoutPlan | null;
  dietPlan: DietPlan | null;
  progressLogs: ProgressLog[];
  weeklyReviews: WeeklyReview[];
  chatMessages: ChatMessage[];
  language: 'hinglish' | 'english' | 'hindi';
  selectedDayNumber: number;
  isLoadingAi: boolean;
  activeRestTimer: { duration: number; remaining: number; isRunning: boolean } | null;
  waterIntakeMl: number;
  dailyExerciseChecklist: Record<string, boolean>; // key: "dayNum-exId-setNum"
  exerciseWeightsRecord: Record<string, { weight: number; reps: number }>; // key: "dayNum-exId-setNum"
  
  // Community & Registration
  communityMembers: CommunityMember[];
  isLoadingCommunity: boolean;
  performanceScoreBreakdown: PerformanceScoreBreakdown;
  isRegistrationModalOpen: boolean;
  setIsRegistrationModalOpen: (open: boolean) => void;
  fetchCommunityMembers: () => Promise<void>;
  cheerMember: (memberId: string) => Promise<void>;
  registerUserToCommunity: (customProfile: UserProfile) => Promise<boolean>;
  syncUserScoreToCommunity: () => Promise<void>;

  // Community Q&A & Problem Solutions
  communityQuestions: CommunityQuestion[];
  addCommunityQuestion: (newQ: {
    title: string;
    description: string;
    category: CommunityCategory;
    tags: string[];
  }) => void;
  addCommunityAnswer: (questionId: string, text: string) => void;
  upvoteQuestion: (questionId: string) => void;
  upvoteAnswer: (questionId: string, answerId: string) => void;
  toggleAcceptSolution: (questionId: string, answerId: string) => void;
  deleteCommunityQuestion: (questionId: string) => void;

  // Actions
  setLanguage: (lang: 'hinglish' | 'english' | 'hindi') => void;
  toggleLanguage: () => void;
  setSelectedDayNumber: (day: number) => void;
  updateProfileAndGenerate: (profile: UserProfile) => Promise<boolean>;
  updateProfileLocal: (profile: UserProfile) => void;
  getExerciseAiAdvice: (exerciseName: string) => Promise<string>;
  toggleSetCompleted: (dayNum: number, exId: string, setNum: number, weight?: number, reps?: number) => void;
  isSetCompleted: (dayNum: number, exId: string, setNum: number) => boolean;
  getSetData: (dayNum: number, exId: string, setNum: number) => { weight?: number; reps?: number } | undefined;
  addProgressLog: (log: Omit<ProgressLog, 'id'>) => void;
  deleteProgressLog: (id: string) => void;
  submitWeeklyCheckin: (checkinNotes: {
    currentWeightKg: number;
    workoutCompliancePct: number;
    dietCompliancePct: number;
    energyScore: number;
    painScore: number;
    notes: string;
    symptomUpdate: string;
  }) => Promise<{ success: boolean; review?: WeeklyReview }>;
  sendChatMessage: (text: string) => Promise<void>;
  startRestTimer: (seconds: number) => void;
  stopRestTimer: () => void;
  addWater: (ml: number) => void;
  resetWater: () => void;
  resetAllToDemo: () => void;
  clearAllAndStartOnboarding: () => void;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'fitveda_user_profile',
  WORKOUT: 'fitveda_workout_plan',
  DIET: 'fitveda_diet_plan',
  LOGS: 'fitveda_progress_logs',
  REVIEWS: 'fitveda_weekly_reviews',
  CHAT: 'fitveda_chat_messages',
  LANGUAGE: 'fitveda_language',
  WATER: 'fitveda_water_ml',
  CHECKLIST: 'fitveda_daily_checklist',
  WEIGHTS: 'fitveda_exercise_weights',
  COMMUNITY_QUESTIONS: 'fitveda_community_questions',
};

function calculateUserPerformanceScore(
  profile: UserProfile | null,
  checklist: Record<string, boolean>,
  logs: ProgressLog[],
  waterMl: number
): PerformanceScoreBreakdown {
  if (!profile) {
    return {
      workoutScore: 28,
      dietScore: 22,
      consistencyScore: 18,
      hydrationScore: 9,
      progressScore: 8,
      total: 85,
      tier: 'Gold',
      tierBadge: '🥇 Gold Elite',
      rankTitle: 'Master Athlete',
    };
  }

  // 1. Workout Score (Max 35)
  const completedSetsCount = Object.values(checklist).filter(Boolean).length;
  const completedLogsCount = logs.filter((l) => l.workoutCompleted).length;
  const workoutScore = Math.min(35, Math.max(18, Math.round(18 + completedSetsCount * 1.1 + completedLogsCount * 1.5)));

  // 2. Diet Score (Max 25)
  const avgDiet = logs.length > 0
    ? Math.round(logs.reduce((acc, l) => acc + (l.dietAdherencePct || 85), 0) / logs.length)
    : 92;
  const dietScore = Math.min(25, Math.max(12, Math.round((avgDiet / 100) * 25)));

  // 3. Consistency / Streak (Max 20)
  const streak = logs.length >= 3 ? Math.min(30, logs.length * 3) : 12;
  const consistencyScore = Math.min(20, Math.max(12, Math.round(10 + streak * 0.4)));

  // 4. Hydration Score (Max 10)
  const hydrationRatio = Math.min(1, (waterMl || 2000) / 3000);
  const hydrationScore = Math.min(10, Math.max(6, Math.round(hydrationRatio * 10)));

  // 5. Progress Score (Max 10)
  const startW = logs.length > 0 ? logs[logs.length - 1].weightKg : profile.currentWeightKg;
  const currW = profile.currentWeightKg;
  const targetW = profile.targetWeightKg;
  const distTotal = Math.abs(startW - targetW) || 1;
  const distMoved = Math.abs(startW - currW);
  const progressRatio = Math.min(1, distMoved / distTotal);
  const progressScore = Math.min(10, Math.max(6, Math.round(6 + progressRatio * 4)));

  const total = Math.min(100, workoutScore + dietScore + consistencyScore + hydrationScore + progressScore);

  let tier: 'Titan' | 'Gold' | 'Silver' | 'Bronze' | 'RisingStar' = 'Gold';
  let tierBadge = '🥇 Gold Elite';
  let rankTitle = 'Master Athlete';

  if (total >= 90) {
    tier = 'Titan';
    tierBadge = '🏆 Titan Tier';
    rankTitle = 'Elite Champion';
  } else if (total >= 80) {
    tier = 'Gold';
    tierBadge = '🥇 Gold Elite';
    rankTitle = 'Master Athlete';
  } else if (total >= 70) {
    tier = 'Silver';
    tierBadge = '🥈 Silver Pro';
    rankTitle = 'Dedicated Pro';
  } else if (total >= 55) {
    tier = 'Bronze';
    tierBadge = '🥉 Bronze Contender';
    rankTitle = 'Active Achiever';
  } else {
    tier = 'RisingStar';
    tierBadge = '🌱 Rising Star';
    rankTitle = 'Journey Beginner';
  }

  return {
    workoutScore,
    dietScore,
    consistencyScore,
    hydrationScore,
    progressScore,
    total,
    tier,
    tierBadge,
    rankTitle,
  };
}

export const FitnessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from local storage or defaults
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return SAMPLE_PROFILE; // Default to interactive demo so app loads instantly
  });

  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WORKOUT);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return SAMPLE_WORKOUT_PLAN;
  });

  const [dietPlan, setDietPlan] = useState<DietPlan | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DIET);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return SAMPLE_DIET_PLAN;
  });

  const [progressLogs, setProgressLogs] = useState<ProgressLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PROGRESS_LOGS;
  });

  const [weeklyReviews, setWeeklyReviews] = useState<WeeklyReview[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHAT);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'msg-welcome',
        sender: 'ai',
        text: `Namaste! Main aapka Personal AI Fitness & Nutrition Coach hu 💪
Aapke body goal (${SAMPLE_PROFILE.goal.replace('_', ' ')}) aur knee health ko dhyan me rakhke workout aur diet chart ready hai!
Aap mujhse workout form, exercise alternatives, diet recipe swaps ya weekly progress ke bare me kabhi bhi puch sakte hain!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [language, setLanguageState] = useState<'hinglish' | 'english' | 'hindi'>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANGUAGE) as any) || 'hinglish';
  });

  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  // Water intake tracker
  const [waterIntakeMl, setWaterIntakeMl] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WATER);
    return saved ? parseInt(saved, 10) : 2500;
  });

  // Daily exercise set completion tracker
  const [dailyExerciseChecklist, setDailyExerciseChecklist] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
    return saved ? JSON.parse(saved) : {};
  });

  const [exerciseWeightsRecord, setExerciseWeightsRecord] = useState<Record<string, { weight: number; reps: number }>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WEIGHTS);
    return saved ? JSON.parse(saved) : {};
  });

  // Rest Timer State
  const [activeRestTimer, setActiveRestTimer] = useState<{ duration: number; remaining: number; isRunning: boolean } | null>(null);

  // Community State
  const [communityMembers, setCommunityMembers] = useState<CommunityMember[]>([]);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState<boolean>(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState<boolean>(false);

  // Community Q&A / Problem Messages State
  const [communityQuestions, setCommunityQuestions] = useState<CommunityQuestion[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMMUNITY_QUESTIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing community questions:', e);
      }
    }
    return INITIAL_COMMUNITY_QUESTIONS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMMUNITY_QUESTIONS, JSON.stringify(communityQuestions));
  }, [communityQuestions]);

  const addCommunityQuestion = useCallback((newQ: {
    title: string;
    description: string;
    category: CommunityCategory;
    tags: string[];
  }) => {
    const question: CommunityQuestion = {
      id: `q-${Date.now()}`,
      authorId: userProfile?.id || 'user-current',
      authorName: userProfile?.name || 'Arogya Athlete',
      authorAvatar: userProfile?.avatarUrl,
      authorTier: 'Gold Elite',
      authorCity: userProfile?.city || 'India',
      title: newQ.title.trim(),
      description: newQ.description.trim(),
      category: newQ.category,
      tags: newQ.tags && newQ.tags.length > 0 ? newQ.tags : ['Fitness', 'Help'],
      createdAt: 'Just now',
      upvotes: 1,
      upvotedByUser: true,
      isSolved: false,
      answers: [],
    };
    setCommunityQuestions((prev) => [question, ...prev]);
  }, [userProfile]);

  const addCommunityAnswer = useCallback((questionId: string, text: string) => {
    if (!text.trim()) return;
    const answer: CommunityAnswer = {
      id: `ans-${Date.now()}`,
      questionId,
      authorId: userProfile?.id || 'user-current',
      authorName: userProfile?.name || 'Community Member',
      authorRole: 'Athlete Member',
      authorAvatar: userProfile?.avatarUrl,
      authorTier: 'Gold Elite',
      text: text.trim(),
      createdAt: 'Just now',
      upvotes: 1,
      upvotedByUser: true,
      isAcceptedSolution: false,
    };
    setCommunityQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: [...q.answers, answer],
          };
        }
        return q;
      })
    );
  }, [userProfile]);

  const upvoteQuestion = useCallback((questionId: string) => {
    setCommunityQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const hasUpvoted = q.upvotedByUser;
          return {
            ...q,
            upvotes: hasUpvoted ? Math.max(0, q.upvotes - 1) : q.upvotes + 1,
            upvotedByUser: !hasUpvoted,
          };
        }
        return q;
      })
    );
  }, []);

  const upvoteAnswer = useCallback((questionId: string, answerId: string) => {
    setCommunityQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: q.answers.map((a) => {
              if (a.id === answerId) {
                const hasUpvoted = a.upvotedByUser;
                return {
                  ...a,
                  upvotes: hasUpvoted ? Math.max(0, a.upvotes - 1) : a.upvotes + 1,
                  upvotedByUser: !hasUpvoted,
                };
              }
              return a;
            }),
          };
        }
        return q;
      })
    );
  }, []);

  const toggleAcceptSolution = useCallback((questionId: string, answerId: string) => {
    setCommunityQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const isCurrentlyAccepted = q.answers.find((a) => a.id === answerId)?.isAcceptedSolution;
          const newSolved = !isCurrentlyAccepted;
          return {
            ...q,
            isSolved: newSolved,
            answers: q.answers.map((a) => ({
              ...a,
              isAcceptedSolution: a.id === answerId ? !isCurrentlyAccepted : false,
            })),
          };
        }
        return q;
      })
    );
  }, []);

  const deleteCommunityQuestion = useCallback((questionId: string) => {
    setCommunityQuestions((prev) => prev.filter((q) => q.id !== questionId));
  }, []);

  // Calculate live performance score
  const performanceScoreBreakdown = calculateUserPerformanceScore(
    userProfile,
    dailyExerciseChecklist,
    progressLogs,
    waterIntakeMl
  );

  // Fetch Community Members from Backend API
  const fetchCommunityMembers = useCallback(async () => {
    setIsLoadingCommunity(true);
    try {
      const response = await fetch('/api/community/members');
      if (response.ok) {
        const data = await response.json();
        if (data.members) {
          // Mark current user if exists
          const marked = data.members.map((m: CommunityMember) => ({
            ...m,
            isCurrentUser: userProfile ? m.id === userProfile.id || m.email === userProfile.email : false,
          }));
          setCommunityMembers(marked);
        }
      }
    } catch (e) {
      console.error('Error fetching community members:', e);
    } finally {
      setIsLoadingCommunity(false);
    }
  }, [userProfile]);

  // Initial community fetch
  useEffect(() => {
    fetchCommunityMembers();
  }, [fetchCommunityMembers]);

  // Sync user score to community
  const syncUserScoreToCommunity = useCallback(async () => {
    if (!userProfile) return;
    try {
      await fetch('/api/community/sync-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userProfile.id,
          performanceScore: performanceScoreBreakdown.total,
          scoreBreakdown: performanceScoreBreakdown,
          streakDays: Math.max(7, progressLogs.length * 2),
          totalWorkoutsCompleted: Object.values(dailyExerciseChecklist).filter(Boolean).length + progressLogs.length,
          avgDietAdherence: progressLogs.length > 0
            ? Math.round(progressLogs.reduce((acc, l) => acc + (l.dietAdherencePct || 85), 0) / progressLogs.length)
            : 92,
          currentWeightKg: userProfile.currentWeightKg,
        }),
      });
      fetchCommunityMembers();
    } catch (e) {
      console.log('Score sync notice:', e);
    }
  }, [userProfile, performanceScoreBreakdown, progressLogs, dailyExerciseChecklist, fetchCommunityMembers]);

  // Register User to Community Leaderboard
  const registerUserToCommunity = async (customProfile: UserProfile): Promise<boolean> => {
    try {
      const response = await fetch('/api/community/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: customProfile,
          initialScore: performanceScoreBreakdown.total,
        }),
      });
      if (response.ok) {
        setUserProfile(customProfile);
        await fetchCommunityMembers();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      setUserProfile(customProfile);
      return true;
    }
  };

  // Cheer / Kudos a community member
  const cheerMember = async (memberId: string) => {
    // Optimistically increment locally
    setCommunityMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, cheersCount: (m.cheersCount || 0) + 1 } : m))
    );

    try {
      await fetch('/api/community/cheer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId }),
      });
    } catch (e) {
      console.log('Cheer network error:', e);
    }
  };

  // Sync to LocalStorage
  useEffect(() => {
    if (userProfile) localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
    else localStorage.removeItem(STORAGE_KEYS.PROFILE);
  }, [userProfile]);

  useEffect(() => {
    if (workoutPlan) localStorage.setItem(STORAGE_KEYS.WORKOUT, JSON.stringify(workoutPlan));
  }, [workoutPlan]);

  useEffect(() => {
    if (dietPlan) localStorage.setItem(STORAGE_KEYS.DIET, JSON.stringify(dietPlan));
  }, [dietPlan]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(progressLogs));
  }, [progressLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(weeklyReviews));
  }, [weeklyReviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATER, waterIntakeMl.toString());
  }, [waterIntakeMl]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(dailyExerciseChecklist));
  }, [dailyExerciseChecklist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(exerciseWeightsRecord));
  }, [exerciseWeightsRecord]);

  // Timer Ticker
  useEffect(() => {
    if (!activeRestTimer || !activeRestTimer.isRunning) return;

    if (activeRestTimer.remaining <= 0) {
      // Timer finished - Play audio chime beep
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } catch (e) {
        console.log('Audio chime error:', e);
      }
      setActiveRestTimer((prev) => (prev ? { ...prev, isRunning: false, remaining: 0 } : null));
      return;
    }

    const interval = setInterval(() => {
      setActiveRestTimer((prev) => {
        if (!prev || !prev.isRunning) return prev;
        if (prev.remaining <= 1) {
          return { ...prev, remaining: 0, isRunning: false };
        }
        return { ...prev, remaining: prev.remaining - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeRestTimer]);

  const setLanguage = (lang: 'hinglish' | 'english' | 'hindi') => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'hinglish' ? 'english' : 'hinglish'));
  };

  const startRestTimer = (seconds: number) => {
    setActiveRestTimer({
      duration: seconds,
      remaining: seconds,
      isRunning: true,
    });
  };

  const stopRestTimer = () => {
    setActiveRestTimer(null);
  };

  const addWater = (ml: number) => {
    setWaterIntakeMl((prev) => Math.min(6000, prev + ml));
  };

  const resetWater = () => {
    setWaterIntakeMl(0);
  };

  const toggleSetCompleted = (dayNum: number, exId: string, setNum: number, weight?: number, reps?: number) => {
    const key = `${dayNum}-${exId}-${setNum}`;
    const newState = !dailyExerciseChecklist[key];

    setDailyExerciseChecklist((prev) => ({
      ...prev,
      [key]: newState,
    }));

    if (weight !== undefined || reps !== undefined) {
      setExerciseWeightsRecord((prev) => ({
        ...prev,
        [key]: {
          weight: weight ?? prev[key]?.weight ?? 0,
          reps: reps ?? prev[key]?.reps ?? 10,
        },
      }));
    }

    // If marked as completed, trigger rest timer!
    if (newState) {
      const day = workoutPlan?.schedule.find((d) => d.dayNumber === dayNum);
      const ex = day?.exercises.find((e) => e.id === exId);
      const rest = ex?.restSeconds || 60;
      startRestTimer(rest);
    }
  };

  const isSetCompleted = (dayNum: number, exId: string, setNum: number) => {
    return Boolean(dailyExerciseChecklist[`${dayNum}-${exId}-${setNum}`]);
  };

  const getSetData = (dayNum: number, exId: string, setNum: number) => {
    return exerciseWeightsRecord[`${dayNum}-${exId}-${setNum}`];
  };

  const addProgressLog = (logData: Omit<ProgressLog, 'id'>) => {
    const newLog: ProgressLog = {
      id: 'log-' + Date.now(),
      ...logData,
    };
    setProgressLogs((prev) => [newLog, ...prev]);

    // Update current weight in profile if provided
    if (userProfile && logData.weightKg) {
      setUserProfile((prev) => (prev ? { ...prev, currentWeightKg: logData.weightKg } : prev));
    }
  };

  const deleteProgressLog = (id: string) => {
    setProgressLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const updateProfileLocal = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  // Generate complete initial plan with Gemini AI
  const updateProfileAndGenerate = async (profile: UserProfile): Promise<boolean> => {
    setIsLoadingAi(true);
    setUserProfile(profile);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI plan');
      }

      const data = await response.json();
      if (data.workoutPlan && data.dietPlan) {
        setWorkoutPlan(data.workoutPlan);
        setDietPlan(data.dietPlan);

        // Auto-register to community leaderboard
        registerUserToCommunity(profile);

        // Add intro message
        setChatMessages((prev) => [
          ...prev,
          {
            id: 'msg-' + Date.now(),
            sender: 'ai',
            text: `🎉 Badhai ho ${profile.name}! Aapka custom AI Workout Split (${data.workoutPlan.splitName}) aur ${data.dietPlan.macroTargets.calories} kcal Diet Chart successfully ban gaya hai! Daily routine check karein aur koi bhi doubt ho toh mujhse puchein.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);

        return true;
      }
      return false;
    } catch (error) {
      console.error('Plan generation failed, fallback to customized sample:', error);
      setWorkoutPlan(SAMPLE_WORKOUT_PLAN);
      setDietPlan(SAMPLE_DIET_PLAN);
      registerUserToCommunity(profile);
      return true;
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Submit weekly checkin and get AI-powered diet update
  const submitWeeklyCheckin = async (checkinNotes: {
    currentWeightKg: number;
    workoutCompliancePct: number;
    dietCompliancePct: number;
    energyScore: number;
    painScore: number;
    notes: string;
    symptomUpdate: string;
  }): Promise<{ success: boolean; review?: WeeklyReview }> => {
    setIsLoadingAi(true);
    try {
      const response = await fetch('/api/weekly-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          currentDietPlan: dietPlan,
          currentWorkoutPlan: workoutPlan,
          weeklyLogs: progressLogs.slice(0, 7),
          userCheckinNotes: checkinNotes,
        }),
      });

      if (!response.ok) {
        throw new Error('Weekly review endpoint failed');
      }

      const data = await response.json();
      if (data.review && data.updatedDietPlan) {
        setWeeklyReviews((prev) => [data.review, ...prev]);
        setDietPlan(data.updatedDietPlan);

        // Also add a progress log entry for the check-in weight
        addProgressLog({
          date: new Date().toISOString().split('T')[0],
          weightKg: checkinNotes.currentWeightKg,
          energyScore: checkinNotes.energyScore,
          painScore: checkinNotes.painScore,
          symptomNotes: checkinNotes.symptomUpdate,
          workoutCompleted: true,
          dietAdherencePct: checkinNotes.dietCompliancePct,
          waterLitersDrank: waterIntakeMl / 1000 || 3.0,
          sleepHours: 7.5,
          notes: `Weekly Check-in #${data.review.weekNumber}: ${checkinNotes.notes}`,
        });

        // Sync score with community
        syncUserScoreToCommunity();

        // Add message in chat
        setChatMessages((prev) => [
          ...prev,
          {
            id: 'msg-' + Date.now(),
            sender: 'ai',
            text: `📊 Week ${data.review.weekNumber} Review Complete! Weight change: ${data.review.weightDeltaKg > 0 ? '+' : ''}${data.review.weightDeltaKg} kg. Maine aapke diet chart me naye changes apply kar diye hain. Diet tab me updated meals dekhein!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);

        return { success: true, review: data.review };
      }
      return { success: false };
    } catch (error) {
      console.error('Weekly review error:', error);
      return { success: false };
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Send message in AI Coach Chat
  const sendChatMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          userProfile,
          currentDietPlan: dietPlan,
          currentWorkoutPlan: workoutPlan,
          recentProgress: progressLogs.slice(0, 3),
        }),
      });

      if (!response.ok) {
        throw new Error('AI Chat response failed');
      }

      const data = await response.json();
      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: data.reply || 'Main samajh gaya. Aap is routine ko consistency se follow karein aur kisi bhi help ke liye batayein!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackMsg: ChatMessage = {
        id: 'ai-err-' + Date.now(),
        sender: 'ai',
        text: 'Aapke goal aur current diet ke mutabik: Consistency banaye rakhein, har meal me 25-35g protein target karein, aur knee/back joint par zyada jhatka na aane dein. Main aapke saath hu!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    }
  };

  const resetAllToDemo = () => {
    setUserProfile(SAMPLE_PROFILE);
    setWorkoutPlan(SAMPLE_WORKOUT_PLAN);
    setDietPlan(SAMPLE_DIET_PLAN);
    setProgressLogs(INITIAL_PROGRESS_LOGS);
    setWeeklyReviews([]);
    setDailyExerciseChecklist({});
    setWaterIntakeMl(2000);
  };

  const getExerciseAiAdvice = useCallback(async (exerciseName: string): Promise<string> => {
    try {
      const response = await fetch('/api/exercise-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseName,
          userInjuries: userProfile?.healthConditions?.injuries || [],
          targetMuscle: workoutPlan?.schedule.flatMap((d) => d.exercises).find((e) => e.name === exerciseName)?.targetMuscle || 'Muscle Group',
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data) {
          const d = result.data;
          let formatted = '';
          if (d.stepByStepExecution?.length) {
            formatted += `📌 Execution Guide:\n` + d.stepByStepExecution.map((s: string) => `• ${s}`).join('\n') + '\n\n';
          }
          if (d.goldenFormCues?.length) {
            formatted += `🎯 Golden Form Cues:\n` + d.goldenFormCues.map((s: string) => `• ${s}`).join('\n') + '\n\n';
          }
          if (d.jointSafetyAdvice) {
            formatted += `🛡️ Joint & Injury Protection:\n${d.jointSafetyAdvice}\n\n`;
          }
          if (d.saferAlternatives?.length) {
            formatted += `⚡ Safer Variations:\n` + d.saferAlternatives.map((a: any) => `• ${a.name}: ${a.reason}`).join('\n');
          }
          return formatted.trim() || 'Follow proper posture, maintain a stable core, and control the 3-second eccentric lowering phase.';
        }
      }
    } catch (e) {
      console.warn('Exercise advice error:', e);
    }
    return `• Form Protocol: Maintain a neutral spine, engage your core, and control the 2-3 second eccentric lowering phase.\n• Joint Safety: Avoid locking joints aggressively at peak extension.\n• Tip: If experiencing joint discomfort, lower weight by 20% or switch to dumbbells for natural ergonomic freedom.`;
  }, [userProfile, workoutPlan]);

  const clearAllAndStartOnboarding = () => {
    setUserProfile(null);
    setWorkoutPlan(null);
    setDietPlan(null);
    setProgressLogs([]);
    setWeeklyReviews([]);
    setDailyExerciseChecklist({});
    localStorage.clear();
  };

  return (
    <FitnessContext.Provider
      value={{
        userProfile,
        workoutPlan,
        dietPlan,
        progressLogs,
        weeklyReviews,
        chatMessages,
        language,
        selectedDayNumber,
        isLoadingAi,
        activeRestTimer,
        waterIntakeMl,
        dailyExerciseChecklist,
        exerciseWeightsRecord,
        communityMembers,
        isLoadingCommunity,
        performanceScoreBreakdown,
        isRegistrationModalOpen,
        setIsRegistrationModalOpen,
        fetchCommunityMembers,
        cheerMember,
        registerUserToCommunity,
        syncUserScoreToCommunity,
        communityQuestions,
        addCommunityQuestion,
        addCommunityAnswer,
        upvoteQuestion,
        upvoteAnswer,
        toggleAcceptSolution,
        deleteCommunityQuestion,
        setLanguage,
        toggleLanguage,
        setSelectedDayNumber,
        updateProfileAndGenerate,
        updateProfileLocal,
        getExerciseAiAdvice,
        toggleSetCompleted,
        isSetCompleted,
        getSetData,
        addProgressLog,
        deleteProgressLog,
        submitWeeklyCheckin,
        sendChatMessage,
        startRestTimer,
        stopRestTimer,
        addWater,
        resetWater,
        resetAllToDemo,
        clearAllAndStartOnboarding,
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
};

export const useFitness = () => {
  const context = useContext(FitnessContext);
  if (!context) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
};
