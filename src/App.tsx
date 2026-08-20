import React, { useState, useEffect } from "react";
import {
  ChatMessage,
  FullPlan,
  ProgressEntry,
  UserProfile,
  WeeklyCheckIn,
} from "./types";
import {
  getStoredChat,
  getStoredPlan,
  getStoredProfile,
  getStoredProgress,
  getStoredWeeklyCheckIns,
  saveChat,
  savePlan,
  saveProfile,
  saveProgress,
  saveWeeklyCheckIns,
} from "./utils/storage";
import { Navbar, NavTab } from "./components/Navbar";
import { ProfileFormModal } from "./components/ProfileFormModal";
import { DailyWorkoutView } from "./components/DailyWorkoutView";
import { DietChartView } from "./components/DietChartView";
import { WorkoutPlanOverview } from "./components/WorkoutPlanOverview";
import { ProgressTrackerView } from "./components/ProgressTrackerView";
import { HealthIssuesView } from "./components/HealthIssuesView";
import { AiChatCoach } from "./components/AiChatCoach";
import { WeeklyCheckInModal } from "./components/WeeklyCheckInModal";
import { DownloadAndInstallModal } from "./components/DownloadAndInstallModal";
import { Sparkles, Dumbbell, ShieldCheck, HeartPulse } from "lucide-react";

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(getStoredProfile);
  const [plan, setPlan] = useState<FullPlan>(getStoredPlan);
  const [progressLogs, setProgressLogs] = useState<ProgressEntry[]>(getStoredProgress);
  const [weeklyCheckIns, setWeeklyCheckIns] = useState<WeeklyCheckIn[]>(getStoredWeeklyCheckIns);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(getStoredChat);

  const [activeTab, setActiveTab] = useState<NavTab>("daily");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isWeeklyModalOpen, setIsWeeklyModalOpen] = useState<boolean>(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const [chatPrefilledPrompt, setChatPrefilledPrompt] = useState<string>("");

  // Save changes to storage
  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    savePlan(plan);
  }, [plan]);

  useEffect(() => {
    saveProgress(progressLogs);
  }, [progressLogs]);

  useEffect(() => {
    saveWeeklyCheckIns(weeklyCheckIns);
  }, [weeklyCheckIns]);

  useEffect(() => {
    saveChat(chatHistory);
  }, [chatHistory]);

  // Handler: Generate Plan from Profile Wizard
  const handleSaveAndGenerate = async (newProfile: UserProfile) => {
    setIsGeneratingPlan(true);
    try {
      setProfile(newProfile);
      saveProfile(newProfile);

      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProfile),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const fullPlan: FullPlan = {
          id: `plan-${Date.now()}`,
          createdAt: new Date().toISOString(),
          version: 1,
          summary: json.data.summary,
          workoutPlan: json.data.workoutPlan,
          dietChart: json.data.dietChart,
        };
        setPlan(fullPlan);
        savePlan(fullPlan);

        // Add welcome AI chat message with the new plan insight
        const newAiMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          sender: "ai",
          text: `Aapka naya custom bodybuilding workout plan aur ${newProfile.dietPreference} diet chart successfully generate ho gaya hai! 🎉\n\n🎯 Daily Target: ${fullPlan.summary.caloriesTarget} kcal | ${fullPlan.summary.proteinGrams}g Protein\n🏋️ Split: ${fullPlan.workoutPlan.splitName}\n🛡️ Health Guard: ${newProfile.healthIssues.length ? newProfile.healthIssues.join(", ") : "All clear"}\n\nAap "Today's Workout" tab se daily exercise shuru kar sakte hain. Koi bhi sawal ho toh mujhse puchiye!`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setChatHistory((prev) => [...prev, newAiMsg]);

        setIsProfileModalOpen(false);
        setActiveTab("daily");
      } else {
        alert(json.error || "Plan generation failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Plan generation error:", err);
      alert(err.message || "Failed to generate plan. Please try again.");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Handler: Send AI Chat Message
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);
    setIsAiTyping(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          chatHistory: updatedHistory,
          userProfile: profile,
          currentPlan: plan,
          progressLogs: progressLogs,
        }),
      });

      const data = await res.json();
      const aiReplyText = data.success && data.reply ? data.reply : "Kuch takneeki kharabi aayi hai. Kripya apna sawal dobara puchiye!";

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "ai",
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setChatHistory((prev) => [...prev, aiMsg]);
    } catch (e: any) {
      console.error("AI Chat error:", e);
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "ai",
        text: "Maaf kijiye, server connect nahi ho paya. Kripya dobara try karein!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChatHistory((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsAiTyping(false);
    }
  };

  // Handler: Apply weekly check-in diet update
  const handleApplyUpdatedPlan = (newPlan: FullPlan, checkIn: WeeklyCheckIn) => {
    setPlan(newPlan);
    savePlan(newPlan);

    setWeeklyCheckIns((prev) => [checkIn, ...prev]);

    // Also add to progress history table
    const newProgressEntry: ProgressEntry = {
      id: `progress-${Date.now()}`,
      date: checkIn.date,
      weight: checkIn.currentWeight,
      energyLevel: checkIn.energyLevel.includes("Peak") ? "peak" : "high",
      adherenceScore: Math.round((checkIn.workoutAdherence + checkIn.dietAdherence) / 2),
      notes: `Weekly Check-in #${checkIn.weekNumber}: ${checkIn.aiAnalysis?.verdict || "Diet Calibrated"}`,
    };
    setProgressLogs((prev) => [...prev, newProgressEntry]);

    // Add notification to chat
    const aiMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "ai",
      text: `Weekly Check-in Complete! 🎉\n\n📊 Result: ${checkIn.aiAnalysis?.verdict}\n⚖️ Weight: ${checkIn.currentWeight}kg (${checkIn.weightDifference > 0 ? "+" : ""}${checkIn.weightDifference}kg)\n🔥 Calorie Adjustment: ${checkIn.aiAnalysis?.calorieAdjustment}\n🍽️ Updated Target: ${newPlan.summary.caloriesTarget} kcal & ${newPlan.summary.proteinGrams}g Protein\n\nAapka naya diet chart live ho chuka hai!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatHistory((prev) => [...prev, aiMsg]);

    setActiveTab("diet");
  };

  // Handler: Add Progress Log
  const handleAddProgressEntry = (entry: ProgressEntry) => {
    setProgressLogs((prev) => [...prev, entry]);
  };

  // Handler: Open chat with prefilled question
  const handleOpenChatWithQuery = (query: string) => {
    setChatPrefilledPrompt(query);
    setActiveTab("chat");
  };

  // Handler: Import / restore full backup
  const handleImportData = (imported: {
    profile?: UserProfile;
    plan?: FullPlan;
    progressLogs?: ProgressEntry[];
    weeklyCheckIns?: WeeklyCheckIn[];
  }) => {
    if (imported.profile) {
      setProfile(imported.profile);
      saveProfile(imported.profile);
    }
    if (imported.plan) {
      setPlan(imported.plan);
      savePlan(imported.plan);
    }
    if (imported.progressLogs) {
      setProgressLogs(imported.progressLogs);
      saveProgress(imported.progressLogs);
    }
    if (imported.weeklyCheckIns) {
      setWeeklyCheckIns(imported.weeklyCheckIns);
      saveWeeklyCheckIns(imported.weeklyCheckIns);
    }
  };

  const latestWeight = progressLogs.length > 0
    ? progressLogs[progressLogs.length - 1].weight
    : profile.weight;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        plan={plan}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenWeeklyModal={() => setIsWeeklyModalOpen(true)}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "daily" && (
          <DailyWorkoutView
            plan={plan}
            profile={profile}
            onOpenChatWithQuery={handleOpenChatWithQuery}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
          />
        )}

        {activeTab === "diet" && (
          <DietChartView
            plan={plan}
            profile={profile}
            onOpenChatWithQuery={handleOpenChatWithQuery}
            onOpenWeeklyModal={() => setIsWeeklyModalOpen(true)}
            onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
          />
        )}

        {activeTab === "split" && (
          <WorkoutPlanOverview
            plan={plan}
            profile={profile}
            onOpenChatWithQuery={handleOpenChatWithQuery}
            onSelectDayForWorkout={() => setActiveTab("daily")}
            onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
          />
        )}

        {activeTab === "progress" && (
          <ProgressTrackerView
            entries={progressLogs}
            onAddEntry={handleAddProgressEntry}
            profile={profile}
            plan={plan}
            onOpenWeeklyCheckInModal={() => setIsWeeklyModalOpen(true)}
            onOpenChatWithQuery={handleOpenChatWithQuery}
          />
        )}

        {activeTab === "health" && (
          <HealthIssuesView
            profile={profile}
            plan={plan}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            onOpenChatWithQuery={handleOpenChatWithQuery}
          />
        )}

        {activeTab === "chat" && (
          <AiChatCoach
            chatHistory={chatHistory}
            onSendMessage={handleSendMessage}
            isAiTyping={isAiTyping}
            profile={profile}
            plan={plan}
            progressLogs={progressLogs}
            initialPrefilledPrompt={chatPrefilledPrompt}
            onOpenWeeklyModal={() => setIsWeeklyModalOpen(true)}
          />
        )}
      </main>

      {/* Profile Assessment & Health Modal */}
      <ProfileFormModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        initialProfile={profile}
        onSaveAndGenerate={handleSaveAndGenerate}
        isLoading={isGeneratingPlan}
      />

      {/* Weekly Progress Review & Dynamic Diet Update Modal */}
      <WeeklyCheckInModal
        isOpen={isWeeklyModalOpen}
        onClose={() => setIsWeeklyModalOpen(false)}
        profile={profile}
        currentPlan={plan}
        onApplyUpdatedPlan={handleApplyUpdatedPlan}
        latestWeight={latestWeight}
      />

      {/* Download App & Export Blueprint Modal */}
      <DownloadAndInstallModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        profile={profile}
        plan={plan}
        progressLogs={progressLogs}
        weeklyCheckIns={weeklyCheckIns}
        onImportData={handleImportData}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>FitForge AI Coach • Science-Based Hypertrophy & Joint-Safe Nutrition</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Always consult a medical physician before beginning any extreme workout or diet routine.
          </div>
        </div>
      </footer>
    </div>
  );
}
