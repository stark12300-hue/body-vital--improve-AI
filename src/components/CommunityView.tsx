import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { CommunityMember, FitnessGoal } from '../types';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Flame, 
  Award, 
  Sparkles, 
  Search, 
  Filter, 
  Heart, 
  Share2, 
  RefreshCw, 
  UserPlus, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  TrendingUp, 
  Crown, 
  MapPin, 
  Dumbbell, 
  Utensils, 
  X, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronRight,
  Droplets,
  Activity
} from 'lucide-react';

export const CommunityView: React.FC = () => {
  const { 
    communityMembers, 
    isLoadingCommunity, 
    fetchCommunityMembers, 
    cheerMember, 
    performanceScoreBreakdown, 
    userProfile, 
    syncUserScoreToCommunity,
    setIsRegistrationModalOpen 
  } = useFitness();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [goalFilter, setGoalFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'streak' | 'workouts' | 'cheers'>('score');
  
  // Selected Member for Detail Modal
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);
  
  // Share Card Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const [cheeredIds, setCheeredIds] = useState<Record<string, boolean>>({});

  // Filter and sort members
  const filteredMembers = communityMembers
    .filter((member) => {
      const matchesSearch = 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.bio.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGoal = goalFilter === 'all' || member.goal === goalFilter;
      const matchesTier = tierFilter === 'all' || member.tier.toLowerCase() === tierFilter.toLowerCase();

      return matchesSearch && matchesGoal && matchesTier;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.performanceScore - a.performanceScore;
      if (sortBy === 'streak') return b.streakDays - a.streakDays;
      if (sortBy === 'workouts') return b.totalWorkoutsCompleted - a.totalWorkoutsCompleted;
      if (sortBy === 'cheers') return b.cheersCount - a.cheersCount;
      return 0;
    });

  // Top 3 Podium
  const topThree = [...communityMembers]
    .sort((a, b) => b.performanceScore - a.performanceScore)
    .slice(0, 3);

  const handleCheer = (e: React.MouseEvent, memberId: string) => {
    e.stopPropagation();
    cheerMember(memberId);
    setCheeredIds((prev) => ({ ...prev, [memberId]: true }));
    
    // Quick micro confetti
    try {
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.7 },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleCopyShareLink = () => {
    const textToCopy = `🏋️‍♂️ My FitGuru Performance Score: ${performanceScoreBreakdown.total}/100 (${performanceScoreBreakdown.tierBadge})!\nGoal: ${userProfile?.goal.replace('_', ' ') || 'Fitness'}\nJoin the Transformation Community: ${window.location.href}`;
    navigator.clipboard.writeText(textToCopy);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const getTierColorClass = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'titan':
        return 'bg-amber-500/10 text-amber-600 border-amber-300 ring-amber-400/30';
      case 'gold':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-300 ring-yellow-400/30';
      case 'silver':
        return 'bg-slate-200/60 text-slate-700 border-slate-300 ring-slate-400/30';
      case 'bronze':
        return 'bg-orange-500/10 text-orange-700 border-orange-300 ring-orange-400/30';
      default:
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-300 ring-emerald-400/30';
    }
  };

  return (
    <div id="community-view-container" className="space-y-6">
      {/* Top Banner & Personal Score Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Global Community & Live Leaderboard</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Athletes & Performance Showcase
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Track real-time fitness scores, celebration streaks, and injury-safe body transformations. Register your profile to showcase your score!
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-open-register-top"
              onClick={() => setIsRegistrationModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30"
            >
              <UserPlus className="w-4 h-4" />
              <span>{userProfile?.name ? 'Edit Public Profile' : 'Register Profile'}</span>
            </button>

            <button
              id="btn-open-share-card"
              onClick={() => setIsShareModalOpen(true)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
            >
              <Share2 className="w-4 h-4 text-blue-400" />
              <span>Share My Scorecard</span>
            </button>

            <button
              id="btn-refresh-leaderboard"
              onClick={() => {
                fetchCommunityMembers();
                syncUserScoreToCommunity();
              }}
              title="Sync & Refresh Leaderboard"
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingCommunity ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Your Live Performance Score Breakdown Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
          {/* Main Score Hero */}
          <div className="lg:col-span-2 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex flex-col items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 shrink-0">
              <span className="text-xl leading-none">{performanceScoreBreakdown.total}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider">Score</span>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">YOUR LIVE RATING</div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                <span>{performanceScoreBreakdown.tierBadge}</span>
                <span className="text-xs text-amber-400 font-semibold">• {performanceScoreBreakdown.rankTitle}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                {userProfile?.name || 'You'} (Registered Athlete)
              </div>
            </div>
          </div>

          {/* Sub Score Items */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-3 text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Workout Power</div>
            <div className="text-base font-extrabold text-blue-400 mt-1 font-mono">
              {performanceScoreBreakdown.workoutScore} <span className="text-xs text-slate-500 font-sans">/ 35</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(performanceScoreBreakdown.workoutScore / 35) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-3 text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Diet Adherence</div>
            <div className="text-base font-extrabold text-emerald-400 mt-1 font-mono">
              {performanceScoreBreakdown.dietScore} <span className="text-xs text-slate-500 font-sans">/ 25</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(performanceScoreBreakdown.dietScore / 25) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-3 text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Streak & Will</div>
            <div className="text-base font-extrabold text-amber-400 mt-1 font-mono flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{performanceScoreBreakdown.consistencyScore}</span>
              <span className="text-xs text-slate-500 font-sans">/ 20</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(performanceScoreBreakdown.consistencyScore / 20) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-3 text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hydration & Delta</div>
            <div className="text-base font-extrabold text-indigo-400 mt-1 font-mono flex items-center justify-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-indigo-400" />
              <span>{performanceScoreBreakdown.hydrationScore + performanceScoreBreakdown.progressScore}</span>
              <span className="text-xs text-slate-500 font-sans">/ 20</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${((performanceScoreBreakdown.hydrationScore + performanceScoreBreakdown.progressScore) / 20) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {topThree.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 2nd Place */}
          <div className="order-2 md:order-1 bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1">
                🥈 Rank #2 Silver Titan
              </span>
              <button
                onClick={(e) => handleCheer(e, topThree[1].id)}
                className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold flex items-center gap-1 transition-all"
              >
                <Heart className={`w-3.5 h-3.5 ${cheeredIds[topThree[1].id] ? 'fill-rose-600' : ''}`} />
                <span>{topThree[1].cheersCount}</span>
              </button>
            </div>

            <div className="my-4 flex items-center gap-3.5">
              <img
                src={topThree[1].avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'}
                alt={topThree[1].name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  {topThree[1].name}
                </h4>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" /> {topThree[1].city}
                </p>
                <div className="text-[11px] text-blue-600 font-bold capitalize mt-0.5">
                  {topThree[1].goal.replace('_', ' ')} • {topThree[1].streakDays}d Streak
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Performance Score</span>
              <span className="text-lg font-black text-slate-900 font-mono">{topThree[1].performanceScore} pts</span>
            </div>
          </div>

          {/* 1st Place Champion */}
          <div className="order-1 md:order-2 bg-gradient-to-b from-amber-500/10 to-amber-500/5 border-2 border-amber-300 rounded-3xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden scale-102">
            <div className="absolute top-2 right-2 opacity-10">
              <Crown className="w-24 h-24 text-amber-500" />
            </div>

            <div className="flex items-center justify-between relative z-10">
              <span className="px-3.5 py-1 rounded-full bg-amber-500 text-white text-xs font-black flex items-center gap-1 shadow-sm">
                <Crown className="w-3.5 h-3.5 fill-white" /> Rank #1 Champion
              </span>
              <button
                onClick={(e) => handleCheer(e, topThree[0].id)}
                className="px-3 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300 text-xs font-bold flex items-center gap-1 transition-all"
              >
                <Heart className={`w-3.5 h-3.5 ${cheeredIds[topThree[0].id] ? 'fill-amber-600 text-amber-600' : 'text-amber-700'}`} />
                <span>{topThree[0].cheersCount} Cheers</span>
              </button>
            </div>

            <div className="my-4 flex items-center gap-4 relative z-10">
              <div className="relative">
                <img
                  src={topThree[0].avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={topThree[0].name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md ring-4 ring-amber-300/30"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  👑
                </div>
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                  {topThree[0].name}
                </h4>
                <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5 font-medium">
                  <MapPin className="w-3 h-3 text-slate-400" /> {topThree[0].city}
                </p>
                <div className="text-xs text-amber-700 font-bold capitalize mt-0.5 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                  <span>{topThree[0].streakDays} Days Unbroken Streak</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-amber-200/60 flex items-center justify-between relative z-10">
              <span className="text-xs text-amber-900 font-bold">Titan Performance Rating</span>
              <span className="text-xl font-black text-amber-600 font-mono">{topThree[0].performanceScore} pts</span>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="order-3 bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold flex items-center gap-1">
                🥉 Rank #3 Bronze Titan
              </span>
              <button
                onClick={(e) => handleCheer(e, topThree[2].id)}
                className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold flex items-center gap-1 transition-all"
              >
                <Heart className={`w-3.5 h-3.5 ${cheeredIds[topThree[2].id] ? 'fill-rose-600' : ''}`} />
                <span>{topThree[2].cheersCount}</span>
              </button>
            </div>

            <div className="my-4 flex items-center gap-3.5">
              <img
                src={topThree[2].avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                alt={topThree[2].name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  {topThree[2].name}
                </h4>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" /> {topThree[2].city}
                </p>
                <div className="text-[11px] text-blue-600 font-bold capitalize mt-0.5">
                  {topThree[2].goal.replace('_', ' ')} • {topThree[2].streakDays}d Streak
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Performance Score</span>
              <span className="text-lg font-black text-slate-900 font-mono">{topThree[2].performanceScore} pts</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-community"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, city, bio..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            id="select-filter-goal"
            value={goalFilter}
            onChange={(e) => setGoalFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Goals</option>
            <option value="fat_loss">Fat Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="lean_recomp">Lean Recomp</option>
            <option value="strength_endurance">Strength & Endurance</option>
          </select>

          <select
            id="select-filter-tier"
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Tiers</option>
            <option value="titan">Titan Tier</option>
            <option value="gold">Gold Elite</option>
            <option value="silver">Silver Pro</option>
          </select>

          <select
            id="select-sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="score">Sort: Highest Score</option>
            <option value="streak">Sort: Longest Streak</option>
            <option value="workouts">Sort: Workouts Logged</option>
            <option value="cheers">Sort: Most Cheers</option>
          </select>
        </div>
      </div>

      {/* Community Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member, index) => {
          const isCurrentUser = member.isCurrentUser || (userProfile && member.id === userProfile.id);

          return (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className={`bg-white border rounded-3xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between relative group ${
                isCurrentUser
                  ? 'border-blue-300 ring-2 ring-blue-500/20 bg-gradient-to-b from-blue-50/30 to-white'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={member.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-xs">
                        #{index + 1}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-slate-900 text-sm leading-tight">
                          {member.name}
                        </h4>
                        {isCurrentUser && (
                          <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-bold uppercase">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" /> {member.city}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-xl border ${getTierColorClass(member.tier)}`}>
                    {member.tier}
                  </span>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-600 line-clamp-2 italic font-medium my-2.5 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                  &ldquo;{member.bio}&rdquo;
                </p>

                {/* Tags Pill */}
                <div className="flex flex-wrap items-center gap-1.5 my-3">
                  <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-lg font-bold capitalize">
                    {member.goal.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-lg font-bold capitalize">
                    {member.dietType}
                  </span>
                  <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-lg font-bold flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{member.streakDays}d Streak</span>
                  </span>
                </div>
              </div>

              {/* Card Footer Metrics */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Score Rating</div>
                  <div className="text-base font-black text-slate-900 font-mono">
                    {member.performanceScore} <span className="text-xs text-slate-400 font-sans font-normal">pts</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleCheer(e, member.id)}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                  >
                    <Heart className={`w-3.5 h-3.5 ${cheeredIds[member.id] ? 'fill-rose-600' : ''}`} />
                    <span>{member.cheersCount}</span>
                  </button>

                  <span className="p-1.5 bg-slate-100 text-slate-500 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Member Deep Performance Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Top Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <img
                  src={selectedMember.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={selectedMember.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20 shadow-md"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <span>{selectedMember.name}</span>
                    <span className="text-xs bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full font-bold uppercase">
                      {selectedMember.tier}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" /> {selectedMember.city} • Joined {selectedMember.joinedDate}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMember(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Overall Score Badge */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-amber-500" />
                  <div>
                    <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">ATHLETE SCORE & TIER</div>
                    <div className="text-base font-extrabold text-amber-950">
                      {selectedMember.performanceScore} / 100 Points • {selectedMember.scoreBreakdown.rankTitle}
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => handleCheer(e, selectedMember.id)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-500/20 transition-all"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Cheer Up! ({selectedMember.cheersCount})</span>
                </button>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Athlete Motto
                </label>
                <p className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                  &ldquo;{selectedMember.bio}&rdquo;
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Weight Delta</div>
                  <div className="text-sm font-bold text-slate-900 mt-1 font-mono">
                    {selectedMember.currentWeightKg} kg <span className="text-[10px] text-slate-400">→ {selectedMember.targetWeightKg}kg</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Streak</div>
                  <div className="text-sm font-bold text-amber-600 mt-1 flex items-center justify-center gap-1 font-mono">
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{selectedMember.streakDays} Days</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Workouts</div>
                  <div className="text-sm font-bold text-blue-600 mt-1 font-mono">
                    {selectedMember.totalWorkoutsCompleted} Sessions
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Diet Accuracy</div>
                  <div className="text-sm font-bold text-emerald-600 mt-1 font-mono">
                    {selectedMember.avgDietAdherence}%
                  </div>
                </div>
              </div>

              {/* Badges Trophy Case */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Earned Transformation Badges
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedMember.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3"
                    >
                      <span className="text-2xl">{badge.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{badge.name}</div>
                        <div className="text-[10px] text-slate-500">{badge.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shareable Performance Scorecard Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold">Share Your Performance Scorecard</h3>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scorecard Visual Banner */}
            <div className="p-6 space-y-5">
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white p-6 rounded-3xl shadow-xl border border-slate-700 relative overflow-hidden text-center">
                <div className="text-[10px] uppercase tracking-widest text-blue-400 font-extrabold mb-1">
                  OFFICIAL ATHLETE SCORECARD
                </div>
                <h2 className="text-xl font-black text-white">
                  {userProfile?.name || 'Transformation Champion'}
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  {userProfile?.goal.replace('_', ' ').toUpperCase()} • {userProfile?.city || 'India'}
                </p>

                <div className="my-5 inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
                  <div className="text-3xl font-black text-amber-400 font-mono">
                    {performanceScoreBreakdown.total}
                  </div>
                  <div className="text-left border-l border-white/20 pl-3">
                    <div className="text-[10px] uppercase font-bold text-slate-300">Fitness Rating</div>
                    <div className="text-xs font-bold text-white">{performanceScoreBreakdown.tierBadge}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400">Workout</div>
                    <div className="font-bold text-blue-400">{performanceScoreBreakdown.workoutScore}/35</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Diet Adherence</div>
                    <div className="font-bold text-emerald-400">{performanceScoreBreakdown.dietScore}/25</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Consistency</div>
                    <div className="font-bold text-amber-400">{performanceScoreBreakdown.consistencyScore}/20</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  id="btn-copy-scorecard"
                  onClick={handleCopyShareLink}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20"
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Copied Score & Link to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Scorecard & App Link</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-slate-500 font-medium">
                  Share your score with friends on WhatsApp, Instagram, or Twitter!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
