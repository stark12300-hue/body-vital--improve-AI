import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { Exercise, WorkoutDay } from '../types';
import confetti from 'canvas-confetti';
import { 
  Dumbbell, 
  CheckCircle2, 
  Circle, 
  Timer, 
  ShieldAlert, 
  Info, 
  Flame, 
  Clock, 
  RotateCcw, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Trophy,
  ArrowRight
} from 'lucide-react';

interface Props {
  onOpenExerciseAi: (exercise: Exercise) => void;
}

export const WorkoutView: React.FC<Props> = ({ onOpenExerciseAi }) => {
  const {
    workoutPlan,
    selectedDayNumber,
    setSelectedDayNumber,
    isSetCompleted,
    toggleSetCompleted,
    getSetData,
    startRestTimer,
    language,
    userProfile,
  } = useFitness();

  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [localWeights, setLocalWeights] = useState<Record<string, { weight: number; reps: number }>>({});

  if (!workoutPlan) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 shadow-sm">
        <Dumbbell className="w-12 h-12 text-slate-300 mx-auto mb-3 animate-pulse" />
        <h3 className="text-lg font-bold text-slate-900">No Workout Routine Found</h3>
        <p className="text-xs mt-1">Please complete the initial assessment to generate your personalized plan.</p>
      </div>
    );
  }

  const currentDay =
    workoutPlan.schedule.find((d) => d.dayNumber === selectedDayNumber) || workoutPlan.schedule[0];

  // Calculate day completion status
  const totalSetsToday = currentDay.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  let completedSetsToday = 0;
  currentDay.exercises.forEach((ex) => {
    for (let s = 1; s <= ex.sets; s++) {
      if (isSetCompleted(currentDay.dayNumber, ex.id, s)) {
        completedSetsToday++;
      }
    }
  });

  const isDayFullyFinished = totalSetsToday > 0 && completedSetsToday === totalSetsToday;

  const handleSetToggle = (ex: Exercise, setNum: number) => {
    const key = `${currentDay.dayNumber}-${ex.id}-${setNum}`;
    const wasCompleted = isSetCompleted(currentDay.dayNumber, ex.id, setNum);
    const existing = getSetData(currentDay.dayNumber, ex.id, setNum) || localWeights[key];

    toggleSetCompleted(
      currentDay.dayNumber,
      ex.id,
      setNum,
      existing?.weight ?? 20,
      existing?.reps ?? 10
    );

    // If newly completing the very last set of the day, fire celebratory confetti!
    if (!wasCompleted && completedSetsToday + 1 === totalSetsToday) {
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#3b82f6', '#10b981', '#f59e0b'],
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleWeightChange = (key: string, weight: number, reps: number) => {
    setLocalWeights((prev) => ({
      ...prev,
      [key]: { weight, reps },
    }));
  };

  return (
    <div id="workout-view-container" className="space-y-6">
      {/* Top Banner: Split & Injury Precautions */}
      <div className="p-6 bg-white border border-slate-200/90 rounded-3xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>{workoutPlan.splitName}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Daily Training & Biomechanics Guide
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed font-medium">
              {language === 'english' ? workoutPlan.overview : workoutPlan.hindiOverview || workoutPlan.overview}
            </p>
          </div>

          {/* Cardio guidance mini box */}
          <div className="sm:max-w-xs p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
            <div className="flex items-center gap-1.5 text-amber-700 font-bold mb-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Cardio Target
            </div>
            <p className="text-[11px] text-slate-600 leading-normal">
              {workoutPlan.weeklyCardioRecommendation}
            </p>
          </div>
        </div>

        {/* Health / Injury specific safety banner if present */}
        {userProfile?.healthConditions?.injuries &&
          userProfile.healthConditions.injuries.length > 0 &&
          !userProfile.healthConditions.injuries.includes('none') && (
            <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-950 font-bold">Joint-Safety Protocols Active:</strong>{' '}
                {workoutPlan.injurySafetyNotes?.join(' • ') ||
                  'Modified exercises chosen to avoid joint strain and accelerate healthy recovery.'}
              </div>
            </div>
          )}
      </div>

      {/* 7-Day Day Selector Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-7 gap-2.5">
        {workoutPlan.schedule.map((day) => {
          const isSelected = day.dayNumber === selectedDayNumber;
          const dayTotalSets = day.exercises.reduce((sum, ex) => sum + ex.sets, 0);
          let dayCompletedSets = 0;
          day.exercises.forEach((ex) => {
            for (let s = 1; s <= ex.sets; s++) {
              if (isSetCompleted(day.dayNumber, ex.id, s)) dayCompletedSets++;
            }
          });
          const isDone = dayTotalSets > 0 && dayCompletedSets === dayTotalSets;

          return (
            <button
              key={day.dayNumber}
              id={`select-day-${day.dayNumber}`}
              onClick={() => setSelectedDayNumber(day.dayNumber)}
              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between shadow-2xs ${
                isSelected
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isSelected ? 'text-white' : 'text-slate-800'
                  }`}
                >
                  {day.dayName.slice(0, 3)}
                </span>
                {day.isRestDay ? (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                      isSelected ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    Rest
                  </span>
                ) : isDone ? (
                  <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-emerald-500'}`} />
                ) : dayCompletedSets > 0 ? (
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      isSelected ? 'text-blue-100' : 'text-blue-600'
                    }`}
                  >
                    {dayCompletedSets}/{dayTotalSets}
                  </span>
                ) : null}
              </div>

              <div
                className={`mt-2 text-xs font-bold truncate ${
                  isSelected ? 'text-white' : 'text-slate-900'
                }`}
              >
                {day.isRestDay ? 'Recovery' : day.focus.split('(')[0]}
              </div>

              <div
                className={`text-[10px] mt-0.5 font-medium ${
                  isSelected ? 'text-blue-100' : 'text-slate-400'
                }`}
              >
                {day.isRestDay ? 'Light Walk' : `${day.durationMinutes} min • ${day.exercises.length} ex`}
              </div>
            </button>
          );
        })}
      </div>

      {/* Current Day Detail Header */}
      <div className="p-6 bg-white border border-slate-200/90 rounded-3xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-blue-600" />
                {currentDay.dayName}: {currentDay.focus}
              </h3>
            </div>
            <p className="text-xs text-blue-700 mt-0.5 font-bold">
              {currentDay.hindiFocus || currentDay.focus}
            </p>
          </div>

          {/* Progress / Completion metrics */}
          {!currentDay.isRestDay && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">SETS COMPLETED</div>
                <div className="text-sm font-bold font-mono text-slate-900">
                  <span className="text-blue-600">{completedSetsToday}</span> / {totalSetsToday}
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-xs text-blue-700 font-mono">
                {totalSetsToday > 0 ? Math.round((completedSetsToday / totalSetsToday) * 100) : 0}%
              </div>
            </div>
          )}
        </div>

        {/* Warmup & Cooldown summary tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-700 mb-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> 5-Min Warmup Routine (Joint Prep)
            </div>
            <ul className="space-y-1 text-slate-600 text-[11px]">
              {currentDay.warmup.length > 0
                ? currentDay.warmup.map((w, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      {w}
                    </li>
                  ))
                : ['5 min dynamic stretching and light rotations']}
            </ul>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-teal-700 mb-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-teal-600" /> Cooldown & Flexibility
            </div>
            <ul className="space-y-1 text-slate-600 text-[11px]">
              {currentDay.cooldown.length > 0
                ? currentDay.cooldown.map((c, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                      {c}
                    </li>
                  ))
                : ['Static stretches for worked muscle groups']}
            </ul>
          </div>
        </div>
      </div>

      {/* Rest Day view */}
      {currentDay.isRestDay && (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Active Recovery & Rest Day</h3>
          <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
            Muscles grow during rest! Drink 3.5L water, get 8 hours of sleep, and do light walking or foam rolling to
            relieve soreness.
          </p>
        </div>
      )}

      {/* Exercise Cards List */}
      {!currentDay.isRestDay && (
        <div className="space-y-4">
          {currentDay.exercises.map((exercise, index) => {
            const isExpanded = expandedExerciseId === exercise.id;
            const completedCount = Array.from({ length: exercise.sets }).filter((_, sIdx) =>
              isSetCompleted(currentDay.dayNumber, exercise.id, sIdx + 1)
            ).length;
            const isExDone = completedCount === exercise.sets;

            return (
              <div
                key={exercise.id}
                id={`exercise-card-${exercise.id}`}
                className={`bg-white border rounded-3xl p-5 sm:p-6 transition-all ${
                  isExDone
                    ? 'border-emerald-300 bg-emerald-50/20 shadow-xs'
                    : 'border-slate-200/90 shadow-xs hover:border-slate-300'
                }`}
              >
                {/* Exercise Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isExDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-slate-900 tracking-tight">
                          {exercise.name}
                        </h4>
                        <span className="text-xs text-slate-500 font-medium">
                          ({exercise.hindiName || exercise.name})
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1 flex-wrap text-xs">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-bold">
                          {exercise.targetMuscle}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-600 font-medium">{exercise.equipment}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rest timer quick starter & AI deep-dive */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      id={`btn-rest-timer-${exercise.id}`}
                      onClick={() => startRestTimer(exercise.restSeconds || 60)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
                      title="Start rest timer"
                    >
                      <Timer className="w-3.5 h-3.5 text-blue-600" />
                      <span>{exercise.restSeconds || 60}s Rest</span>
                    </button>

                    <button
                      id={`btn-ai-tips-${exercise.id}`}
                      onClick={() => onOpenExerciseAi(exercise)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs text-blue-700 font-bold flex items-center gap-1.5 transition-colors"
                      title="Ask AI Coach for exact form cues and injury-safe cues"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>AI Form Guide</span>
                    </button>

                    <button
                      onClick={() => setExpandedExerciseId(isExpanded ? null : exercise.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
                      title="Toggle instructions"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Injury Modification Callout */}
                {exercise.injuryModifications && (
                  <div className="mt-3.5 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2 text-xs text-amber-900">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      <strong>Joint Protection Note:</strong> {exercise.injuryModifications}
                    </span>
                  </div>
                )}

                {/* Expandable Form Instructions */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-in fade-in duration-150">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="font-bold text-emerald-700 mb-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Proper Form & Execution
                      </div>
                      <ul className="space-y-1 text-slate-600 text-[11px] list-disc list-inside">
                        {exercise.formTips.map((tip, tIdx) => (
                          <li key={tIdx}>{tip}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="font-bold text-rose-700 mb-1 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-rose-600" /> Common Mistakes to Avoid
                      </div>
                      <ul className="space-y-1 text-slate-600 text-[11px] list-disc list-inside">
                        {exercise.mistakesToAvoid.map((mistake, mIdx) => (
                          <li key={mIdx}>{mistake}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Interactive Set Logger Table */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-500 mb-2.5 flex items-center justify-between">
                    <span>Sets Progression ({exercise.sets} Sets × {exercise.reps} Reps Target)</span>
                    <span className="text-[11px] text-blue-600 font-bold">Log Weight & Check Off</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                    {Array.from({ length: exercise.sets }).map((_, sIdx) => {
                      const setNum = sIdx + 1;
                      const isDone = isSetCompleted(currentDay.dayNumber, exercise.id, setNum);
                      const key = `${currentDay.dayNumber}-${exercise.id}-${setNum}`;
                      const savedData = getSetData(currentDay.dayNumber, exercise.id, setNum);
                      const currentWeight = savedData?.weight ?? localWeights[key]?.weight ?? 20;
                      const currentReps = savedData?.reps ?? localWeights[key]?.reps ?? 10;

                      return (
                        <div
                          key={setNum}
                          className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 shadow-2xs ${
                            isDone
                              ? 'bg-blue-50/60 border-blue-300'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500">S{setNum}</span>
                            <div className="flex items-center gap-1 text-xs">
                              <input
                                type="number"
                                value={currentWeight}
                                onChange={(e) =>
                                  handleWeightChange(key, Number(e.target.value), currentReps)
                                }
                                className="w-12 px-1.5 py-0.5 bg-white border border-slate-300 rounded-lg text-center text-slate-900 font-mono text-xs focus:border-blue-500 focus:outline-none"
                                title="Weight in kg"
                              />
                              <span className="text-[10px] text-slate-400 font-medium">kg ×</span>
                              <input
                                type="number"
                                value={currentReps}
                                onChange={(e) =>
                                  handleWeightChange(key, currentWeight, Number(e.target.value))
                                }
                                className="w-10 px-1 py-0.5 bg-white border border-slate-300 rounded-lg text-center text-slate-900 font-mono text-xs focus:border-blue-500 focus:outline-none"
                                title="Reps completed"
                              />
                            </div>
                          </div>

                          <button
                            id={`check-set-${exercise.id}-${setNum}`}
                            type="button"
                            onClick={() => handleSetToggle(exercise, setNum)}
                            className={`p-2 rounded-xl transition-all ${
                              isDone
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-300'
                            }`}
                            title={isDone ? 'Mark as incomplete' : 'Complete set & start rest timer'}
                          >
                            {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Completion Banner if all finished today */}
      {isDayFullyFinished && (
        <div className="p-6 bg-slate-900 text-white border border-slate-800 rounded-3xl shadow-lg flex items-center justify-between gap-4 animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Shabash! Today&apos;s Workout Complete!</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Aapne aaj ka target pura kar liya. Ab high-protein post-workout meal aur paani lijiye!
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedDayNumber(selectedDayNumber < 7 ? selectedDayNumber + 1 : 1)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
          >
            Next Day <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
