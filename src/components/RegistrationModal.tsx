import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { UserProfile, FitnessGoal, FitnessLevel, DietType, Gender } from '../types';
import confetti from 'canvas-confetti';
import { 
  UserPlus, 
  Sparkles, 
  X, 
  Check, 
  Trophy, 
  Flame, 
  ShieldCheck, 
  MapPin, 
  Mail, 
  Quote, 
  Dumbbell, 
  ArrowRight,
  Smile
} from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
];

export const RegistrationModal: React.FC = () => {
  const { 
    isRegistrationModalOpen, 
    setIsRegistrationModalOpen, 
    userProfile, 
    registerUserToCommunity,
    updateProfileLocal,
    fetchCommunityMembers
  } = useFitness();

  const [name, setName] = useState<string>(userProfile?.name || '');
  const [email, setEmail] = useState<string>(userProfile?.email || '');
  const [city, setCity] = useState<string>(userProfile?.city || 'Delhi NCR, India');
  const [bio, setBio] = useState<string>(userProfile?.bio || 'Consistent fitness journey with joint-safe training & clean nutrition! 💪');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    userProfile?.avatarUrl || AVATAR_PRESETS[0]
  );
  const [age, setAge] = useState<number>(userProfile?.age || 26);
  const [gender, setGender] = useState<Gender>(userProfile?.gender || 'male');
  const [currentWeight, setCurrentWeight] = useState<number>(userProfile?.currentWeightKg || 74);
  const [targetWeight, setTargetWeight] = useState<number>(userProfile?.targetWeightKg || 68);
  const [goal, setGoal] = useState<FitnessGoal>(userProfile?.goal || 'fat_loss');
  const [experience, setExperience] = useState<FitnessLevel>(userProfile?.experienceLevel || 'intermediate');
  const [dietType, setDietType] = useState<DietType>(userProfile?.dietType || 'vegetarian');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  if (!isRegistrationModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    const newProfile: UserProfile = {
      ...(userProfile || {
        workoutLocation: 'gym',
        daysPerWeek: 5,
        activityLevel: 'moderately_active',
        healthConditions: { injuries: ['none'], chronicConditions: [], allergies: [] },
        cuisinePreference: 'indian_north',
        mealsPerDay: 4,
        language: 'hinglish',
        createdAt: new Date().toISOString(),
      }),
      id: userProfile?.id || `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@fitguru.community`,
      city: city.trim() || 'India',
      bio: bio.trim(),
      avatarUrl: selectedAvatar,
      age: Number(age),
      gender,
      currentWeightKg: Number(currentWeight),
      targetWeightKg: Number(targetWeight),
      goal,
      experienceLevel: experience,
      dietType,
      updatedAt: new Date().toISOString(),
    };

    const ok = await registerUserToCommunity(newProfile);
    updateProfileLocal(newProfile);
    await fetchCommunityMembers();

    setIsSubmitting(false);

    if (ok) {
      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.log(e);
      }

      setSuccessMessage('🎉 Profile successfully registered on Community Leaderboard!');
      setTimeout(() => {
        setSuccessMessage('');
        setIsRegistrationModalOpen(false);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div 
        id="registration-modal-card"
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8"
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Community Registration & Profile</h3>
                <span className="text-[10px] bg-blue-500/30 text-blue-300 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Live Showcase
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Create your public fitness profile, show your score on the leaderboard & inspire others!
              </p>
            </div>
          </div>

          <button
            id="btn-close-registration-modal"
            onClick={() => setIsRegistrationModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-4 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-sm font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Avatar Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Choose Profile Avatar
            </label>
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {AVATAR_PRESETS.map((avatar, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`relative w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedAvatar === avatar
                      ? 'border-blue-600 ring-4 ring-blue-500/20 scale-105 shadow-md'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={avatar}
                    alt={`Avatar ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {selectedAvatar === avatar && (
                    <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white drop-shadow-md" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="input-reg-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sahil Sharma"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Email / Handle
              </label>
              <input
                id="input-reg-email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. sahil.fit@gmail.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> City / Location
              </label>
              <input
                id="input-reg-city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Mumbai, MH"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Quote className="w-3.5 h-3.5 text-slate-400" /> Fitness Bio / Motto
              </label>
              <input
                id="input-reg-bio"
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. Striving for 10% body fat & high energy!"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Physical Stats Grid */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-blue-600" />
              <span>Body Metrics & Goals</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Age</label>
                <input
                  id="input-reg-age"
                  type="number"
                  min="14"
                  max="80"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Gender</label>
                <select
                  id="select-reg-gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Current Weight (kg)</label>
                <input
                  id="input-reg-currweight"
                  type="number"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Target Weight (kg)</label>
                <input
                  id="input-reg-targetweight"
                  type="number"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Primary Goal</label>
                <select
                  id="select-reg-goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as FitnessGoal)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="fat_loss">Fat Loss / Cutting</option>
                  <option value="muscle_gain">Muscle Gain / Bulk</option>
                  <option value="lean_recomp">Lean Recomposition</option>
                  <option value="strength_endurance">Functional Strength</option>
                  <option value="general_fitness">General Fitness</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Experience Level</label>
                <select
                  id="select-reg-experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value as FitnessLevel)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="beginner">Beginner (0-6 months)</option>
                  <option value="intermediate">Intermediate (1-3 yrs)</option>
                  <option value="advanced">Advanced (3+ yrs)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Diet Style</label>
                <select
                  id="select-reg-diet"
                  value={dietType}
                  onChange={(e) => setDietType(e.target.value as DietType)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="vegetarian">Vegetarian</option>
                  <option value="eggetarian">Eggetarian</option>
                  <option value="non_vegetarian">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="jain">Jain</option>
                </select>
              </div>
            </div>
          </div>

          {/* Leaderboard Perks Preview */}
          <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-start gap-3">
            <Trophy className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900">
              <span className="font-bold">Public Leaderboard Visibility:</span> As you log workouts, hit your diet goals, and stay consistent, your performance score will automatically rank you on the community board with Gold/Titan badges!
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              id="btn-cancel-reg"
              type="button"
              onClick={() => setIsRegistrationModalOpen(false)}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              id="btn-submit-reg"
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all"
            >
              {isSubmitting ? (
                <span>Registering...</span>
              ) : (
                <>
                  <span>Save & Join Leaderboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
