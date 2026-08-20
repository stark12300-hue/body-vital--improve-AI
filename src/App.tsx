import React, { useState } from 'react';
import { FitnessProvider, useFitness } from './context/FitnessContext';
import { AssessmentWizard } from './components/AssessmentWizard';
import { WorkoutView } from './components/WorkoutView';
import { DietView } from './components/DietView';
import { ProgressTrackerView } from './components/ProgressTrackerView';
import { AICoachChat } from './components/AICoachChat';
import { WeeklyReviewModal } from './components/WeeklyReviewModal';
import { ExerciseAiModal } from './components/ExerciseAiModal';
import { RestTimer } from './components/RestTimer';
import { CommunityView } from './components/CommunityView';
import { RegistrationModal } from './components/RegistrationModal';
import { Exercise } from './types';
import { 
  Dumbbell, 
  Utensils, 
  TrendingUp, 
  Bot, 
  Sparkles, 
  User, 
  Flame, 
  Scale, 
  HeartPulse,
  Globe,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Activity,
  Trophy,
  UserPlus
} from 'lucide-react';

function FitnessAppContent() {
  const {
    userProfile,
    workoutPlan,
    dietPlan,
    language,
    toggleLanguage,
    performanceScoreBreakdown,
    setIsRegistrationModalOpen,
  } = useFitness();

  const [activeTab, setActiveTab] = useState<'workout' | 'diet' | 'progress' | 'community' | 'chat'>('workout');
  const [isAssessmentOpen, setIsAssessmentOpen] = useState<boolean>(false);
  const [isWeeklyReviewOpen, setIsWeeklyReviewOpen] = useState<boolean>(false);
  const [selectedExerciseForAi, setSelectedExerciseForAi] = useState<Exercise | null>(null);

  // If user profile is not configured yet, show onboarding
  const hasConfiguredProfile = Boolean(userProfile && workoutPlan && dietPlan);

  const activeInjuries = userProfile?.healthConditions?.injuries?.filter((i) => i !== 'none') || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white flex flex-col antialiased">
      {/* Top Professional Polish Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Brand & Identity */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-extrabold text-base shadow-sm ring-1 ring-slate-800">
              <span className="bg-gradient-to-tr from-blue-400 to-indigo-300 bg-clip-text text-transparent">V</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-900 tracking-tight">
                  VITALFORM AI
                </span>
                <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Transformation Pro
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block font-medium">
                Clinical Biomechanics • Smart Nutrition • Health Monitoring
              </p>
            </div>
          </div>

          {/* User Welcome & Health Status Pill & Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Live Performance Score Pill */}
            <button
              id="btn-header-score-pill"
              onClick={() => setActiveTab('community')}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 hover:from-amber-500/20 hover:to-yellow-500/20 border border-amber-300/80 text-amber-800 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs"
              title="View Leaderboard & Performance Breakdown"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-mono">{performanceScoreBreakdown.total}</span>
              <span className="hidden sm:inline text-[11px] font-semibold text-amber-700">
                • {performanceScoreBreakdown.tierBadge}
              </span>
            </button>

            {/* Health Alert status badge */}
            <div className="hidden md:flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span>
                {activeInjuries.length > 0 
                  ? `Safety Active: ${activeInjuries.length}` 
                  : 'Safety Clear'}
              </span>
            </div>

            {/* Language toggle */}
            <button
              id="btn-language-toggle"
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all shadow-2xs"
              title="Switch language between Hinglish and English"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === 'hinglish' ? 'Hinglish' : 'English'}</span>
            </button>

            {/* Registration / Public Profile trigger */}
            <button
              id="btn-open-registration"
              onClick={() => setIsRegistrationModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
              title="Register or Edit Public Fitness Profile"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Register / Profile</span>
            </button>

            {/* Weekly Review trigger */}
            <button
              id="btn-open-weekly-review"
              onClick={() => setIsWeeklyReviewOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-blue-500/20"
              title="Perform Weekly Progress Review & Update Diet"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-100" />
              <span className="hidden sm:inline">Weekly Review</span>
              <span className="sm:hidden">Review</span>
            </button>

            {/* Profile / Assessment edit */}
            <button
              id="btn-edit-profile"
              onClick={() => setIsAssessmentOpen(true)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all shadow-2xs"
              title="Edit Profile & Health Details"
            >
              <div className="w-5 h-5 bg-slate-200 text-slate-700 rounded-full flex items-center justify-center text-xs font-bold">
                {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden sm:inline font-bold">
                {userProfile?.name ? userProfile.name.split(' ')[0] : 'Profile'}
              </span>
            </button>
          </div>
        </div>

        {/* Global Navigation Tabs (Executive Segmented Bar) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between border-t border-slate-100 py-2">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'workout', label: 'Training Plan', hindi: 'Daily Exercises', icon: Dumbbell },
              { id: 'diet', label: 'Diet & Nutrition', hindi: 'Diet Chart', icon: Utensils },
              { id: 'progress', label: 'Progress Metrics', hindi: 'Progress & Health', icon: TrendingUp },
              { id: 'community', label: 'Community & Leaderboard', hindi: 'Leaderboard & Sabke Scores', icon: Trophy },
              { id: 'chat', label: 'AI Health Assistant', hindi: 'AI Coach Chat', icon: Bot },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  id={`tab-nav-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{language === 'hinglish' ? tab.hindi : tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Current Goal Indicator */}
          {userProfile && (
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-semibold pl-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Goal:</span>
              <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg font-bold border border-slate-200 capitalize">
                {userProfile.goal.replace('_', ' ')}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        {/* Quick User Context Card */}
        {userProfile && (
          <div className="mb-6 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-xs">
                  {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">MEMBER PROFILE</div>
                  <div className="font-bold text-slate-900">
                    {userProfile.name || 'Member'}{' '}
                    <span className="text-slate-500 font-normal">({userProfile.age}y, {userProfile.gender})</span>
                  </div>
                </div>
              </div>

              <div className="hidden sm:block h-8 w-px bg-slate-200" />

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">WEIGHT TRACKER</div>
                <div className="font-bold text-slate-900 font-mono">
                  {userProfile.currentWeightKg} kg <span className="text-slate-400 font-sans font-normal">→ Target</span>{' '}
                  <span className="text-blue-600">{userProfile.targetWeightKg} kg</span>
                </div>
              </div>

              <div className="hidden sm:block h-8 w-px bg-slate-200" />

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">COMMUNITY SCORE</div>
                <div className="font-bold text-amber-600 flex items-center gap-1 font-mono">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>{performanceScoreBreakdown.total} pts</span>
                  <span className="text-[10px] text-slate-400 font-sans">({performanceScoreBreakdown.tierBadge})</span>
                </div>
              </div>

              <div className="hidden sm:block h-8 w-px bg-slate-200" />

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">JOINT SAFETY</div>
                <div className="font-bold text-slate-800">
                  {activeInjuries.length > 0 ? (
                    <span className="text-amber-700 flex items-center gap-1 font-semibold">
                      <HeartPulse className="w-3.5 h-3.5 text-amber-500" />
                      {activeInjuries.join(', ')} (Protected)
                    </span>
                  ) : (
                    <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      All Joints Clear & Healthy
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-bold capitalize">
                {userProfile.experienceLevel}
              </span>
              <span className="text-xs px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold capitalize">
                {userProfile.workoutLocation.replace('_', ' ')} • {userProfile.daysPerWeek}d/wk
              </span>
            </div>
          </div>
        )}

        {/* Tab Views */}
        {activeTab === 'workout' && (
          <WorkoutView onOpenExerciseAi={(exercise) => setSelectedExerciseForAi(exercise)} />
        )}

        {activeTab === 'diet' && <DietView />}

        {activeTab === 'progress' && <ProgressTrackerView />}

        {activeTab === 'community' && <CommunityView />}

        {activeTab === 'chat' && <AICoachChat />}
      </main>

      {/* Floating Rest Timer Widget */}
      <RestTimer />

      {/* Community Registration Modal */}
      <RegistrationModal />

      {/* Assessment / Profile Onboarding Modal */}
      <AssessmentWizard
        isOpen={isAssessmentOpen || !hasConfiguredProfile}
        onClose={() => setIsAssessmentOpen(false)}
        isInitial={!hasConfiguredProfile}
      />

      {/* Weekly Review Modal */}
      <WeeklyReviewModal
        isOpen={isWeeklyReviewOpen}
        onClose={() => setIsWeeklyReviewOpen(false)}
      />

      {/* Exercise AI Biomechanics Guide Modal */}
      <ExerciseAiModal
        exercise={selectedExerciseForAi}
        onClose={() => setSelectedExerciseForAi(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <FitnessProvider>
      <FitnessAppContent />
    </FitnessProvider>
  );
}

