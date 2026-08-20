import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { CommunityCategory, CommunityQuestion } from '../types';
import confetti from 'canvas-confetti';
import {
  MessageSquare,
  HelpCircle,
  PlusCircle,
  Search,
  CheckCircle2,
  ThumbsUp,
  Award,
  Sparkles,
  Share2,
  Filter,
  Check,
  Tag,
  Clock,
  ShieldCheck,
  Dumbbell,
  Utensils,
  HeartPulse,
  Flame,
  Zap,
  ChevronDown,
  ChevronUp,
  Send,
  X,
  User,
  Trash2,
  Lightbulb,
  AlertCircle
} from 'lucide-react';

const CATEGORY_MAP: Record<
  CommunityCategory | 'all',
  { label: string; hindi: string; icon: any; color: string }
> = {
  all: { label: 'All Topics', hindi: 'Sabhi Sawal', icon: MessageSquare, color: 'bg-slate-100 text-slate-800' },
  workout_form: { label: 'Workout & Form', hindi: 'Workout & Form Check', icon: Dumbbell, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  diet_nutrition: { label: 'Diet & Nutrition', hindi: 'Diet & Protein Recipes', icon: Utensils, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  injury_recovery: { label: 'Joint & Injury Rehab', hindi: 'Joint Pain & Safety', icon: HeartPulse, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  fat_loss_bulking: { label: 'Fat Loss & Bulking', hindi: 'Weight Loss & Bulking', icon: Flame, color: 'bg-rose-50 text-rose-700 border-rose-200' },
  supplements: { label: 'Supplements & Creatine', hindi: 'Supplements & Protein', icon: Zap, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  motivation: { label: 'General & Motivation', hindi: 'Consistency & Tips', icon: Sparkles, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
};

export const CommunityHelpForum: React.FC = () => {
  const {
    communityQuestions,
    addCommunityQuestion,
    addCommunityAnswer,
    upvoteQuestion,
    upvoteAnswer,
    toggleAcceptSolution,
    deleteCommunityQuestion,
    userProfile,
    language
  } = useFitness();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CommunityCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'solved' | 'unsolved'>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // New Question Modal State
  const [isAskModalOpen, setIsAskModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newCategory, setNewCategory] = useState<CommunityCategory>('workout_form');
  const [newTags, setNewTags] = useState<string>('');

  // Reply Drafts per Question
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filtered Questions
  const filteredQuestions = communityQuestions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      q.authorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === 'all' || q.category === selectedCategory;
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'solved'
        ? q.isSolved
        : !q.isSolved;

    return matchesSearch && matchesCat && matchesStatus;
  });

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    addCommunityQuestion({
      title: newTitle,
      description: newDescription,
      category: newCategory,
      tags: tagsArray.length > 0 ? tagsArray : ['Fitness', 'Advice'],
    });

    setNewTitle('');
    setNewDescription('');
    setNewTags('');
    setIsAskModalOpen(false);

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleSendAnswer = (questionId: string) => {
    const text = replyDrafts[questionId]?.trim();
    if (!text) return;

    addCommunityAnswer(questionId, text);
    setReplyDrafts((prev) => ({ ...prev, [questionId]: '' }));

    try {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.7 },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleCopyLink = (qId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/#question-${qId}`);
    setCopiedId(qId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const solvedCount = communityQuestions.filter((q) => q.isSolved).length;
  const totalAnswers = communityQuestions.reduce((acc, q) => acc + q.answers.length, 0);

  return (
    <div id="community-help-forum-container" className="space-y-6">
      {/* Top Welcome & Community Help Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 bottom-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
              <span>Arogya Fitness Problem Solutions & Discussion</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Community Q&A & Problem Solutions
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Apna koi bhi sawal ya problem (Workout form, Joint pain, Diet recipes, Supplements) post karein — coaches aur community athletes milkar turant practical solutions denge!
            </p>
          </div>

          <button
            id="btn-open-ask-modal"
            onClick={() => setIsAskModalOpen(true)}
            className="px-5 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-transform active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>Post Your Problem / Sawal</span>
          </button>
        </div>

        {/* Live Community Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-700/60 text-xs">
          <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/50">
            <div className="text-slate-400 text-[11px] font-medium">Total Discussions</div>
            <div className="text-lg font-bold text-white font-mono mt-0.5">{communityQuestions.length} Problems</div>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/50">
            <div className="text-slate-400 text-[11px] font-medium">Verified Solutions</div>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">{solvedCount} Solved</div>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/50">
            <div className="text-slate-400 text-[11px] font-medium">Answers & Advice</div>
            <div className="text-lg font-bold text-blue-400 font-mono mt-0.5">{totalAnswers} Tips Shared</div>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/50">
            <div className="text-slate-400 text-[11px] font-medium">Active Coaches & Members</div>
            <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">24/7 Support</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="input-search-questions"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems by keyword (e.g. Knee pain, Protein, Creatine)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1 shrink-0">
              Status:
            </span>
            {[
              { id: 'all', label: 'All' },
              { id: 'solved', label: '✅ Solved' },
              { id: 'unsolved', label: '⏳ Needs Advice' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  statusFilter === st.id
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100">
          {(Object.keys(CATEGORY_MAP) as (CommunityCategory | 'all')[]).map((catKey) => {
            const cat = CATEGORY_MAP[catKey];
            const Icon = cat.icon;
            const isSelected = selectedCategory === catKey;

            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{language === 'hinglish' ? cat.hindi : cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions Feed */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <HelpCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Koi sawal nahi mila</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Aapke search query ke mutabik koi problem nahi mili. Aap pehle vyakti bankar yeh sawal post kar sakte hain!
              </p>
            </div>
            <button
              onClick={() => setIsAskModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Naya Sawal Post Karein</span>
            </button>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const cat = CATEGORY_MAP[q.category] || CATEGORY_MAP.workout_form;
            const CatIcon = cat.icon;
            const isExpanded = expandedQuestionId === q.id || q.answers.length > 0;
            const acceptedAnswer = q.answers.find((a) => a.isAcceptedSolution);
            const otherAnswers = q.answers.filter((a) => !a.isAcceptedSolution);

            return (
              <div
                key={q.id}
                id={`question-card-${q.id}`}
                className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-2xs transition-all hover:border-slate-300 space-y-4"
              >
                {/* Question Header: Author, Category, Status */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {q.authorAvatar ? (
                      <img
                        src={q.authorAvatar}
                        alt={q.authorName}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm border border-blue-200">
                        {q.authorName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{q.authorName}</span>
                        {q.authorTier && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                            {q.authorTier}
                          </span>
                        )}
                        {q.authorCity && (
                          <span className="text-[11px] text-slate-400 hidden sm:inline">• {q.authorCity}</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{q.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {q.isSolved ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Solved</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Needs Advice</span>
                      </span>
                    )}

                    <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1 ${cat.color}`}>
                      <CatIcon className="w-3 h-3" />
                      <span>{cat.label}</span>
                    </span>
                  </div>
                </div>

                {/* Question Content */}
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
                    {q.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {q.description}
                  </p>
                </div>

                {/* Tags */}
                {q.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {q.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold flex items-center gap-1"
                      >
                        <Tag className="w-2.5 h-2.5 text-slate-400" />
                        <span>#{tag}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Question Actions Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    {/* Upvote Question */}
                    <button
                      id={`btn-upvote-q-${q.id}`}
                      onClick={() => upvoteQuestion(q.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                        q.upvotedByUser
                          ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${q.upvotedByUser ? 'fill-blue-600 text-blue-600' : ''}`} />
                      <span>Helpful ({q.upvotes})</span>
                    </button>

                    {/* Answers count toggle */}
                    <button
                      onClick={() => setExpandedQuestionId(expandedQuestionId === q.id ? null : q.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      <span>{q.answers.length} Solutions & Answers</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyLink(q.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="Share link"
                    >
                      {copiedId === q.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    </button>

                    {q.authorId === (userProfile?.id || 'user-current') && (
                      <button
                        onClick={() => deleteCommunityQuestion(q.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Answers / Solutions Section */}
                {isExpanded && (
                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <span>Community Advice & Solutions ({q.answers.length})</span>
                      </h4>
                    </div>

                    {/* Accepted / Verified Solution First */}
                    {acceptedAnswer && (
                      <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2.5">
                            {acceptedAnswer.authorAvatar ? (
                              <img
                                src={acceptedAnswer.authorAvatar}
                                alt={acceptedAnswer.authorName}
                                referrerPolicy="no-referrer"
                                className="w-8 h-8 rounded-full object-cover border border-emerald-300"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-800 font-bold flex items-center justify-center text-xs">
                                {acceptedAnswer.authorName.charAt(0)}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-900">{acceptedAnswer.authorName}</span>
                                {acceptedAnswer.authorRole && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold">
                                    {acceptedAnswer.authorRole}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-emerald-800 font-medium">{acceptedAnswer.createdAt}</span>
                            </div>
                          </div>

                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-extrabold shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verified Best Solution</span>
                          </div>
                        </div>

                        <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line pl-1">
                          {acceptedAnswer.text}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60 text-xs">
                          <button
                            onClick={() => upvoteAnswer(q.id, acceptedAnswer.id)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                              acceptedAnswer.upvotedByUser
                                ? 'bg-emerald-600 text-white'
                                : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>Helpful Solution ({acceptedAnswer.upvotes})</span>
                          </button>

                          <button
                            onClick={() => toggleAcceptSolution(q.id, acceptedAnswer.id)}
                            className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold"
                          >
                            Change Accepted Solution
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Other Community Answers */}
                    {otherAnswers.map((ans) => (
                      <div
                        key={ans.id}
                        className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-2.5"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2.5">
                            {ans.authorAvatar ? (
                              <img
                                src={ans.authorAvatar}
                                alt={ans.authorName}
                                referrerPolicy="no-referrer"
                                className="w-7 h-7 rounded-full object-cover border border-slate-200"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                                {ans.authorName.charAt(0)}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-900">{ans.authorName}</span>
                                {ans.authorRole && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                                    {ans.authorRole}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400">{ans.createdAt}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => toggleAcceptSolution(q.id, ans.id)}
                            className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 transition-colors flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Mark as Solution</span>
                          </button>
                        </div>

                        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                          {ans.text}
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => upvoteAnswer(q.id, ans.id)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all ${
                              ans.upvotedByUser
                                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>Helpful ({ans.upvotes})</span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Write a Solution / Reply Box */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-2xs space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        <span>Apna Solution ya Experience Share Karein</span>
                      </div>

                      <textarea
                        rows={2}
                        id={`textarea-reply-${q.id}`}
                        value={replyDrafts[q.id] || ''}
                        onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [q.id]: e.target.value }))}
                        placeholder="Yahan apna detailed advice ya exercise replacement likhein..."
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                      />

                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          Posting as: <strong className="text-slate-700">{userProfile?.name || 'Arogya Member'}</strong>
                        </span>
                        <button
                          id={`btn-submit-reply-${q.id}`}
                          onClick={() => handleSendAnswer(q.id)}
                          disabled={!replyDrafts[q.id]?.trim()}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold disabled:opacity-40 transition-colors shadow-2xs flex items-center gap-1.5"
                        >
                          <span>Send Solution</span>
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Post New Problem / Question Modal */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Post Fitness Problem or Question</h3>
                  <p className="text-xs text-slate-500">Coaches aur community members aapko best advice denge</p>
                </div>
              </div>
              <button
                onClick={() => setIsAskModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePostQuestion} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Problem / Question Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  id="input-new-question-title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Squats ke baad lower back me tightness ho rahi hai, form kaise theek karun?"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(
                    [
                      'workout_form',
                      'diet_nutrition',
                      'injury_recovery',
                      'fat_loss_bulking',
                      'supplements',
                      'motivation',
                    ] as CommunityCategory[]
                  ).map((catKey) => {
                    const cat = CATEGORY_MAP[catKey];
                    const Icon = cat.icon;
                    const isSelected = newCategory === catKey;

                    return (
                      <button
                        type="button"
                        key={catKey}
                        onClick={() => setNewCategory(catKey)}
                        className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all text-left ${
                          isSelected
                            ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Problem Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  id="textarea-new-question-desc"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Batayein: kitne din se issue hai, kya try kiya hai, aur aapka current workout/diet setup kya hai..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. BackPain, SquatForm, Rehab"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAskModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim() || !newDescription.trim()}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-colors disabled:opacity-40 flex items-center gap-1.5"
                >
                  <span>Post Problem</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
