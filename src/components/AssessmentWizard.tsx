import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { UserProfile, FitnessGoal, FitnessLevel, WorkoutLocation, DietType, CuisinePreference, Gender, ActivityLevel } from '../types';
import { SAMPLE_PROFILE } from '../data/defaultPlans';
import { 
  Dumbbell, 
  HeartPulse, 
  Utensils, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  TrendingUp, 
  ShieldAlert, 
  Leaf,
  Scale,
  Activity,
  Zap
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  isInitial?: boolean;
}

export const AssessmentWizard: React.FC<Props> = ({ isOpen, onClose, isInitial = false }) => {
  const { userProfile, updateProfileAndGenerate, isLoadingAi } = useFitness();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [formData, setFormData] = useState<UserProfile>(() => {
    return userProfile || {
      id: 'user-' + Date.now(),
      name: '',
      age: 25,
      gender: 'male',
      heightCm: 172,
      currentWeightKg: 75,
      targetWeightKg: 70,
      goal: 'fat_loss',
      experienceLevel: 'intermediate',
      workoutLocation: 'gym',
      daysPerWeek: 5,
      activityLevel: 'moderately_active',
      healthConditions: {
        injuries: ['knee_pain'],
        injuryDetails: '',
        chronicConditions: [],
        chronicDetails: '',
        allergies: [],
        allergyDetails: '',
      },
      dietType: 'vegetarian',
      cuisinePreference: 'indian_north',
      dailyBudget: 'moderate',
      mealsPerDay: 4,
      language: 'hinglish',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  if (!isOpen) return null;

  const handleInjuryToggle = (injuryKey: string) => {
    setFormData((prev) => {
      const current = prev.healthConditions.injuries;
      let updated: string[];
      if (injuryKey === 'none') {
        updated = ['none'];
      } else {
        const filtered = current.filter((item) => item !== 'none');
        if (filtered.includes(injuryKey)) {
          updated = filtered.filter((item) => item !== injuryKey);
        } else {
          updated = [...filtered, injuryKey];
        }
      }
      return {
        ...prev,
        healthConditions: {
          ...prev.healthConditions,
          injuries: updated.length === 0 ? ['none'] : updated,
        },
      };
    });
  };

  const handleChronicToggle = (conditionKey: string) => {
    setFormData((prev) => {
      const current = prev.healthConditions.chronicConditions;
      let updated: string[];
      if (conditionKey === 'none') {
        updated = [];
      } else {
        if (current.includes(conditionKey)) {
          updated = current.filter((item) => item !== conditionKey);
        } else {
          updated = [...current, conditionKey];
        }
      }
      return {
        ...prev,
        healthConditions: {
          ...prev.healthConditions,
          chronicConditions: updated,
        },
      };
    });
  };

  const handleAllergyToggle = (allergyKey: string) => {
    setFormData((prev) => {
      const current = prev.healthConditions.allergies;
      let updated: string[];
      if (allergyKey === 'none') {
        updated = [];
      } else {
        if (current.includes(allergyKey)) {
          updated = current.filter((item) => item !== allergyKey);
        } else {
          updated = [...current, allergyKey];
        }
      }
      return {
        ...prev,
        healthConditions: {
          ...prev.healthConditions,
          allergies: updated,
        },
      };
    });
  };

  const handleSubmit = async () => {
    const success = await updateProfileAndGenerate(formData);
    if (success && onClose) {
      onClose();
    }
  };

  const fillSample = () => {
    setFormData(SAMPLE_PROFILE);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div 
        id="assessment-wizard-card"
        className="w-full max-w-3xl bg-white border border-slate-200/90 text-slate-800 rounded-3xl shadow-xl overflow-hidden flex flex-col my-auto max-h-[90vh]"
      >
        {/* Header with Progress Tracker */}
        <div className="p-6 sm:p-8 bg-slate-50/80 border-b border-slate-200">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-2xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {isInitial ? 'AI Body Transformation & Fitness Assessment' : 'Update Fitness & Health Profile'}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Pehle apni details batayein — AI tailored workout & diet chart banayega
                </p>
              </div>
            </div>

            {/* Quick Demo Pre-fill button */}
            <button
              id="fill-sample-profile-btn"
              onClick={fillSample}
              type="button"
              className="text-xs text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-xl transition-all font-bold flex items-center gap-1 shadow-2xs"
            >
              <Zap className="w-3.5 h-3.5 text-blue-600" /> Demo Profile
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { num: 1, label: 'Personal Details', icon: User },
              { num: 2, label: 'Body Goal & Routine', icon: Dumbbell },
              { num: 3, label: 'Health & Injuries', icon: HeartPulse },
              { num: 4, label: 'Diet & Nutrition', icon: Utensils },
            ].map((step) => {
              const Icon = step.icon;
              const isPassed = currentStep > step.num;
              const isCurrent = currentStep === step.num;

              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setCurrentStep(step.num)}
                  className={`flex flex-col items-center text-center p-2 rounded-xl border transition-all ${
                    isCurrent
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-2xs'
                      : isPassed
                      ? 'border-slate-200 bg-slate-100/70 text-slate-700 font-medium'
                      : 'border-slate-200 bg-white text-slate-400 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{step.label}</span>
                    <span className="sm:hidden">S{step.num}</span>
                  </div>
                  <div
                    className={`w-full h-1 rounded-full mt-1.5 ${
                      isCurrent ? 'bg-blue-600' : isPassed ? 'bg-blue-400' : 'bg-slate-200'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Body - Scrollable */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-white">
          {/* STEP 1: Personal Details */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  Basic Body Measurements & Info
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Aapka naam, umar, height aur current vs target weight
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Aapka Naam / Full Name
                  </label>
                  <input
                    type="text"
                    id="input-user-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aman Sharma"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Gender
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['male', 'female', 'other'] as Gender[]).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: g })}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border capitalize transition-all ${
                          formData.gender === g
                            ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {g === 'male' ? 'Male (Purush)' : g === 'female' ? 'Female (Mahila)' : 'Other'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Age (Umar)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="input-user-age"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                      min="14"
                      max="90"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors text-sm font-medium"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">years</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Height (Lambai)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="input-user-height"
                      value={formData.heightCm}
                      onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                      min="120"
                      max="230"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors text-sm font-medium"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
                      cm (~{Math.floor(formData.heightCm / 30.48)}&apos;{Math.round((formData.heightCm % 30.48) / 2.54)}&quot;)
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Current Weight (Abhi ka Vajan)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="input-user-current-weight"
                      value={formData.currentWeightKg}
                      onChange={(e) => setFormData({ ...formData, currentWeightKg: Number(e.target.value) })}
                      step="0.5"
                      min="30"
                      max="250"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors text-sm font-medium"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">kg</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Target Weight (Kitna Vajan Chahiye)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="input-user-target-weight"
                      value={formData.targetWeightKg}
                      onChange={(e) => setFormData({ ...formData, targetWeightKg: Number(e.target.value) })}
                      step="0.5"
                      min="30"
                      max="250"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors text-sm font-medium"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">kg</span>
                  </div>
                </div>
              </div>

              {/* BMI Indicator preview */}
              {formData.heightCm > 0 && formData.currentWeightKg > 0 && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-blue-600" />
                    <span className="text-slate-600">Current BMI:</span>
                    <strong className="text-slate-900 font-mono text-sm">
                      {(formData.currentWeightKg / Math.pow(formData.heightCm / 100, 2)).toFixed(1)}
                    </strong>
                  </div>
                  <div className="text-slate-600">
                    Difference to Target:{' '}
                    <span className={`font-bold ${formData.targetWeightKg < formData.currentWeightKg ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {formData.targetWeightKg - formData.currentWeightKg > 0 ? '+' : ''}
                      {(formData.targetWeightKg - formData.currentWeightKg).toFixed(1)} kg
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Body Goal & Workout Routine */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  Primary Goal, Level & Workout Setup
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Aap body me kya badlav chahte hain aur kahan workout karenge
                </p>
              </div>

              {/* Goal Cards */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Main Transformation Goal (Mukhya Lakshya)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      id: 'fat_loss',
                      title: 'Fat Loss & Cutting (Vajan Ghatana)',
                      desc: 'Burn belly fat, lean toned physique, high metabolism & calorie deficit diet',
                      icon: Flame,
                    },
                    {
                      id: 'muscle_gain',
                      title: 'Muscle Gain & Bulking (Muscle Banana)',
                      desc: 'Hypertrophy weight training, calorie surplus, high protein muscle growth',
                      icon: Dumbbell,
                    },
                    {
                      id: 'lean_recomp',
                      title: 'Body Recomposition (Fat Loss + Muscle)',
                      desc: 'Simultaneously build lean muscle while dropping body fat percentage',
                      icon: TrendingUp,
                    },
                    {
                      id: 'strength_endurance',
                      title: 'Strength & Stamina (Takat & Stamina)',
                      desc: 'Functional strength, core stability, athletic endurance & joint longevity',
                      icon: Zap,
                    },
                  ].map((g) => {
                    const Icon = g.icon;
                    const isSelected = formData.goal === g.id;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, goal: g.id as FitnessGoal })}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-600 ring-1 ring-blue-600/30 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-xl ${
                            isSelected ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className={`text-sm font-bold ${isSelected ? 'text-blue-950' : 'text-slate-900'}`}>
                            {g.title}
                          </div>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">{g.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Workout Environment */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'gym',
                    label: 'Commercial Gym',
                    desc: 'Barbells, Cables, Dumbbells & Machines',
                  },
                  {
                    id: 'home_dumbbells',
                    label: 'Home Dumbbells',
                    desc: 'Dumbbells & Resistance Bands at home',
                  },
                  {
                    id: 'home_calisthenics',
                    label: 'Home Calisthenics',
                    desc: 'Pure bodyweight, pull-up bar & floor',
                  },
                ].map((loc) => {
                  const isSelected = formData.workoutLocation === loc.id;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, workoutLocation: loc.id as WorkoutLocation })}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-600 text-blue-900 ring-1 ring-blue-600/30 shadow-2xs font-medium'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">{loc.label}</div>
                      <div className="text-[11px] text-slate-500 mt-1 font-medium">{loc.desc}</div>
                    </button>
                  );
                })}
              </div>

              {/* Days & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Hafte me kitne din workout kar sakte hain? (Days/Week)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[3, 4, 5, 6].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setFormData({ ...formData, daysPerWeek: days })}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          formData.daysPerWeek === days
                            ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {days} Days
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Experience Level (Kitna Anubhav Hai)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'beginner', label: 'Beginner (0-6m)' },
                      { id: 'intermediate', label: 'Mid (6m-2y)' },
                      { id: 'advanced', label: 'Pro (2y+)' },
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, experienceLevel: lvl.id as FitnessLevel })}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all truncate ${
                          formData.experienceLevel === lvl.id
                            ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Health Issues & Injury Tracker */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-rose-500" />
                  Health Issues & Injury Screening (Joint Safety)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  AI aapke jodo (joints) aur bimariyo ke hisab se safe exercise select karega
                </p>
              </div>

              {/* Injuries Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                    Past or Current Injuries / Joint Pain (Select all that apply)
                  </label>
                  <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">Joint-Safe Filter Active</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'none', label: 'None (Koi chot nahi)' },
                    { id: 'knee_pain', label: 'Knee Pain (Ghutne me dard)' },
                    { id: 'lower_back', label: 'Lower Back / Spine pain' },
                    { id: 'shoulder_pain', label: 'Shoulder Impingement' },
                    { id: 'wrist_pain', label: 'Wrist / Elbow pain' },
                    { id: 'neck_pain', label: 'Cervical / Neck stiffness' },
                  ].map((inj) => {
                    const isSelected = formData.healthConditions.injuries.includes(inj.id);
                    return (
                      <button
                        key={inj.id}
                        type="button"
                        onClick={() => handleInjuryToggle(inj.id)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                          isSelected
                            ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {inj.label}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2.5">
                  <input
                    type="text"
                    value={formData.healthConditions.injuryDetails || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        healthConditions: { ...formData.healthConditions, injuryDetails: e.target.value },
                      })
                    }
                    placeholder="Injury ke bare me aur batayein (e.g., Squat karne par right knee me stiffness aati hai)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white font-medium"
                  />
                </div>
              </div>

              {/* Chronic Conditions */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Chronic Health Conditions (Blood Sugar, BP, Thyroid, etc.)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'diabetes', label: 'Diabetes / Pre-diabetes' },
                    { id: 'hypertension', label: 'Hypertension (High BP)' },
                    { id: 'thyroid', label: 'Thyroid (Hypo/Hyper)' },
                    { id: 'pcos', label: 'PCOS / PCOD' },
                    { id: 'cholesterol', label: 'High Cholesterol' },
                    { id: 'asthma', label: 'Asthma / Breathing' },
                    { id: 'gerd', label: 'GERD / Acidity' },
                    { id: 'none', label: 'None (Fit & Healthy)' },
                  ].map((cond) => {
                    const isSelected =
                      cond.id === 'none'
                        ? formData.healthConditions.chronicConditions.length === 0
                        : formData.healthConditions.chronicConditions.includes(cond.id);

                    return (
                      <button
                        key={cond.id}
                        type="button"
                        onClick={() => handleChronicToggle(cond.id)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                          isSelected
                            ? 'bg-rose-50 border-rose-400 text-rose-900 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {cond.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Food Allergies */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Food Allergies & Intolerances
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'lactose', label: 'Lactose Intolerant (No Milk)' },
                    { id: 'gluten', label: 'Gluten Sensitive' },
                    { id: 'peanuts', label: 'Nut / Peanut Allergy' },
                    { id: 'soy', label: 'Soy Allergy' },
                  ].map((all) => {
                    const isSelected = formData.healthConditions.allergies.includes(all.id);
                    return (
                      <button
                        key={all.id}
                        type="button"
                        onClick={() => handleAllergyToggle(all.id)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                          isSelected
                            ? 'bg-purple-50 border-purple-400 text-purple-900 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {all.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Diet & Nutrition Preferences */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-emerald-600" />
                  Dietary Preferences & Cuisine Style
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Aapka diet chart realistic, swadisht aur high-protein banayenge
                </p>
              </div>

              {/* Diet Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Dietary Type (Khan-paan ka tarika)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    {
                      id: 'vegetarian',
                      title: 'Vegetarian (Shakahari)',
                      desc: 'Paneer, Soya, Dahi, Dal, Sprouts, Tofu',
                    },
                    {
                      id: 'non_vegetarian',
                      title: 'Non-Vegetarian (Mamsahari)',
                      desc: 'Eggs, Chicken, Fish + Vegetarian foods',
                    },
                    {
                      id: 'eggetarian',
                      title: 'Eggetarian (Ande + Veg)',
                      desc: 'Whole eggs, Egg whites, Paneer, Dal',
                    },
                    {
                      id: 'vegan',
                      title: '100% Plant-based Vegan',
                      desc: 'Tofu, Soy, Plant protein, Lentils, Seeds',
                    },
                    {
                      id: 'jain',
                      title: 'Jain Vegetarian',
                      desc: 'No root vegetables, No onion/garlic',
                    },
                  ].map((d) => {
                    const isSelected = formData.dietType === d.id;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, dietType: d.id as DietType })}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-600 text-blue-900 ring-1 ring-blue-600/30 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100/70'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-900">{d.title}</div>
                        <div className="text-[11px] text-slate-500 mt-1 font-medium">{d.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cuisine preference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Cuisine Flavor Profile
                  </label>
                  <select
                    value={formData.cuisinePreference}
                    onChange={(e) => setFormData({ ...formData, cuisinePreference: e.target.value as CuisinePreference })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-medium"
                  >
                    <option value="indian_north">North Indian (Roti, Dal, Paneer, Sabzi, Chutney)</option>
                    <option value="indian_south">South Indian (Idli, Dosa, Sambhar, Sattu, Curd)</option>
                    <option value="indian_balanced">All-India Balanced Home Food</option>
                    <option value="high_protein_budget">Budget High-Protein (Soya, Chana, Eggs, Peanuts)</option>
                    <option value="continental">Continental / Global (Oats, Salads, Rice, Grilled)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Meals Per Day (Din me kitni baar khate hain)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[3, 4, 5].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setFormData({ ...formData, mealsPerDay: count })}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          formData.mealsPerDay === count
                            ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {count} Meals
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Plan Readiness preview */}
              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 leading-relaxed font-medium">
                  <strong className="text-slate-900 font-bold">AI Coach Ready:</strong> Gemini AI will now compute your exact BMR,
                  TDEE, and macros, cross-reference your health/injury precautions, and construct a full 7-day workout &
                  nutrition system!
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Navigation Controls */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 transition-colors bg-white shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="generate-plan-submit-btn"
              type="button"
              disabled={isLoadingAi}
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs disabled:opacity-50"
            >
              {isLoadingAi ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  Generating Plan with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate AI Workout & Diet Plan
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
