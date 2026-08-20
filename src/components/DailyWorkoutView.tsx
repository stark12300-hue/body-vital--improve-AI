import React, { useState, useEffect } from "react";
import { Exercise, FullPlan, SetLog, UserProfile, WorkoutDay } from "../types";
import {
  Activity,
  AlertCircle,
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";

interface DailyWorkoutViewProps {
  plan: FullPlan;
  profile: UserProfile;
  onOpenChatWithQuery?: (query: string) => void;
  onOpenProfileModal?: () => void;
}

export const DailyWorkoutView: React.FC<DailyWorkoutViewProps> = ({
  plan,
  profile,
  onOpenChatWithQuery,
  onOpenProfileModal,
}) => {
  // Current day index based on system day or user selection
  const currentDayOfWeek = new Date().getDay(); // 0 is Sunday, 1 is Monday...
  const defaultDayIndex = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1; // map 1 (Mon) -> 0, ... 0 (Sun) -> 6

  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(
    defaultDayIndex < plan.workoutPlan.days.length ? defaultDayIndex : 0
  );

  const activeDay: WorkoutDay = plan.workoutPlan.days[selectedDayIndex] || plan.workoutPlan.days[0];

  // Rest Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [activeTimerExercise, setActiveTimerExercise] = useState<string>("");

  // Completed sets local tracking map: exerciseId -> array of completed set booleans
  const [completedSetsMap, setCompletedSetsMap] = useState<Record<string, boolean[]>>({});
  // Set logs for weight and reps: exerciseId -> SetLog[]
  const [setLogsMap, setSetLogsMap] = useState<Record<string, SetLog[]>>({});
  // Show swap alternatives state
  const [swappedExercises, setSwappedExercises] = useState<Record<string, boolean>>({});
  // Day completed banner
  const [isDayDone, setIsDayDone] = useState<boolean>(false);

  // Timer interval effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Play a soft beep sound using web audio api
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      } catch (e) {
        // ignore audio failure
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const startRestTimer = (seconds: number, exerciseName: string) => {
    setTimerSeconds(seconds);
    setActiveTimerExercise(exerciseName);
    setIsTimerRunning(true);
  };

  const toggleSetCompletion = (exerciseId: string, setIndex: number, restSeconds: number, exerciseName: string) => {
    setCompletedSetsMap((prev) => {
      const current = prev[exerciseId] || [];
      const updated = [...current];
      updated[setIndex] = !updated[setIndex];

      // Auto start timer if set was checked to complete
      if (updated[setIndex]) {
        startRestTimer(restSeconds, exerciseName);
      }

      return { ...prev, [exerciseId]: updated };
    });
  };

  const updateSetLog = (exerciseId: string, setIndex: number, field: "weightKg" | "reps", value: number) => {
    setSetLogsMap((prev) => {
      const logs = prev[exerciseId] || [];
      const updatedLogs = [...logs];
      if (!updatedLogs[setIndex]) {
        updatedLogs[setIndex] = {
          setNumber: setIndex + 1,
          weightKg: 0,
          reps: 10,
          completed: false,
        };
      }
      updatedLogs[setIndex] = {
        ...updatedLogs[setIndex],
        [field]: value,
      };
      return { ...prev, [exerciseId]: updatedLogs };
    });
  };

  const toggleSwap = (exerciseId: string) => {
    setSwappedExercises((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  const handleFinishDayWorkout = () => {
    setIsDayDone(true);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Calculate total sets & completed sets count for progress bar
  const totalSets = activeDay.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const completedSetsCount = activeDay.exercises.reduce((acc, ex) => {
    const list = completedSetsMap[ex.id] || [];
    return acc + list.filter(Boolean).length;
  }, 0);
  const progressPercent = totalSets > 0 ? Math.round((completedSetsCount / totalSets) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner: Day selection & Focus Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/50 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Daily Workout Engine
              </span>
              <span className="text-xs text-slate-400">
                Split: <strong className="text-slate-200">{plan.workoutPlan.splitName}</strong>
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              {activeDay.dayName}: {activeDay.focus}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Target Duration: <strong className="text-indigo-300">{profile.workoutDuration} mins</strong> | Goal:{" "}
              <span className="text-emerald-400 font-medium capitalize">{profile.goal.replace("_", " ")}</span>
            </p>
          </div>

          {/* Quick Stats or Actions */}
          <div className="flex items-center gap-2">
            {profile.healthIssues && profile.healthIssues.length > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Joint-Safe Mode Active</span>
              </div>
            )}
          </div>
        </div>

        {/* 7-Day Quick Tabs */}
        <div className="grid grid-cols-7 gap-1.5 mt-4">
          {plan.workoutPlan.days.map((day, idx) => {
            const isSelected = idx === selectedDayIndex;
            const isToday = idx === defaultDayIndex;
            return (
              <button
                key={day.dayNumber}
                onClick={() => {
                  setSelectedDayIndex(idx);
                  setIsDayDone(false);
                }}
                className={`py-2 px-1.5 rounded-xl text-center transition-all border ${
                  isSelected
                    ? "bg-indigo-600 border-indigo-400 text-white font-bold shadow-lg shadow-indigo-600/40"
                    : isToday
                    ? "bg-slate-800/90 border-indigo-500/50 text-indigo-300 hover:bg-slate-700"
                    : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <div className="text-[10px] uppercase font-semibold tracking-wider opacity-80">
                  {day.dayName.slice(0, 3)}
                </div>
                <div className="text-xs font-extrabold truncate mt-0.5">
                  {day.isRestDay ? "Rest" : `D${day.dayNumber}`}
                </div>
                {isToday && <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mx-auto mt-1" />}
              </button>
            );
          })}
        </div>

        {/* Progress Tracker Bar */}
        {!activeDay.isRestDay && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>
                Today&apos;s Workout Adherence:{" "}
                <strong className="text-white">
                  {completedSetsCount} / {totalSets} Sets Completed ({progressPercent}%)
                </strong>
              </span>
            </div>
            <div className="w-full sm:w-48 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Floating Rest Timer Bar (if active) */}
      {timerSeconds > 0 && (
        <div className="sticky top-4 z-40 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border-2 border-indigo-500/70 rounded-2xl p-4 shadow-2xl flex items-center justify-between text-white animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-mono font-bold text-lg">
              {timerSeconds}s
            </div>
            <div>
              <div className="text-xs text-indigo-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Rest Interval Running
              </div>
              <div className="text-sm font-bold truncate max-w-xs">{activeTimerExercise || "Catch your breath"}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setTimerSeconds((prev) => prev + 30)}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 text-xs font-bold"
            >
              +30s
            </button>
            <button
              onClick={() => {
                setTimerSeconds(0);
                setIsTimerRunning(false);
              }}
              className="p-2 rounded-lg bg-red-950/60 text-red-300 hover:bg-red-900/60"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* REST DAY VIEW */}
      {activeDay.isRestDay ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-bold">
            🛌
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Active Recovery & Muscle Growth Day</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              &quot;Muscles gym mein break hoti hain aur rest day par repair hokar grow hoti hain!&quot; Aaj light walking, stretching, aur apna pura protein target pura karein.
            </p>
          </div>

          {activeDay.warmup && activeDay.warmup.length > 0 && (
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 max-w-lg mx-auto text-left">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Recommended Light Recovery Routine:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeDay.warmup.map((step, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={() => onOpenChatWithQuery && onOpenChatWithQuery("Rest day par diet aur recovery maximize karne ke best tips kya hain?")}
              className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-all inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> AI Coach: Rest Day Recovery Guide
            </button>
          </div>
        </div>
      ) : (
        /* WORKOUT DAY EXERCISE CARDS */
        <div className="space-y-6">
          {/* Warmup Section */}
          {activeDay.warmup && activeDay.warmup.length > 0 && (
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" /> Warm-Up & Joint Mobility (5-8 Mins)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {activeDay.warmup.map((w, i) => (
                  <div key={i} className="flex items-center gap-2 bg-slate-950/50 px-3 py-2 rounded-lg border border-slate-800/60">
                    <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold">
                      {i + 1}
                    </span>
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exercise List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-indigo-400" /> Daily Exercise Routine ({activeDay.exercises.length} Exercises)
              </h3>
              <span className="text-xs text-slate-400">Tick checkmarks to auto-start rest timer</span>
            </div>

            {activeDay.exercises.map((exercise, exIndex) => {
              const isSwapped = swappedExercises[exercise.id];
              const displayName = isSwapped && exercise.alternativeExercise ? exercise.alternativeExercise : exercise.name;
              const completedSets = completedSetsMap[exercise.id] || [];
              const logs = setLogsMap[exercise.id] || [];

              return (
                <div
                  key={exercise.id || exIndex}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg transition-all"
                >
                  {/* Exercise Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-extrabold flex items-center justify-center text-sm shrink-0">
                        {exIndex + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-bold text-white tracking-tight">{displayName}</h4>
                          {isSwapped && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Swapped Alternative
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-indigo-300 font-medium mt-0.5">
                          Target Muscle: <span className="text-slate-300">{exercise.targetMuscle}</span>
                        </p>
                      </div>
                    </div>

                    {/* Prescription Badge */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200">
                        <span className="text-indigo-400">{exercise.sets}</span> Sets ×{" "}
                        <span className="text-emerald-400">{exercise.reps}</span>
                      </div>
                      <button
                        onClick={() => startRestTimer(exercise.restSeconds || 60, displayName)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Start Rest Timer"
                      >
                        <Clock className="w-3.5 h-3.5 text-indigo-400" /> {exercise.restSeconds}s Rest
                      </button>
                    </div>
                  </div>

                  {/* Form Tips & Health Caution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 my-3 text-xs">
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 text-slate-300 flex items-start gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-200">Form Tip: </strong>
                        {exercise.formTips}
                      </div>
                    </div>

                    {exercise.safetyNote ? (
                      <div className="bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/30 text-emerald-200 flex items-start gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-emerald-300">Health Safety: </strong>
                          {exercise.safetyNote}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60 text-slate-400 flex items-center justify-between">
                        <span>Tempo: 2s Negative, 1s Pause</span>
                        {exercise.alternativeExercise && (
                          <button
                            onClick={() => toggleSwap(exercise.id)}
                            className="text-[11px] text-indigo-400 hover:underline font-semibold"
                          >
                            {isSwapped ? "Show Original" : "Swap Alternative"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Set-by-Set Interactive Logger Table */}
                  <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80">
                    <div className="grid grid-cols-4 sm:grid-cols-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                      <span>Set</span>
                      <span>Target</span>
                      <span>Weight (kg)</span>
                      <span>Reps</span>
                      <span className="text-right">Done</span>
                    </div>

                    <div className="space-y-1.5">
                      {Array.from({ length: exercise.sets }).map((_, sIdx) => {
                        const isDone = !!completedSets[sIdx];
                        const log = logs[sIdx] || { weightKg: 0, reps: 10 };

                        return (
                          <div
                            key={sIdx}
                            className={`grid grid-cols-4 sm:grid-cols-5 items-center px-2 py-1.5 rounded-lg text-xs transition-colors ${
                              isDone
                                ? "bg-emerald-950/30 border border-emerald-500/30 text-slate-200"
                                : "bg-slate-900/60 border border-slate-800/50 text-slate-300"
                            }`}
                          >
                            <span className="font-bold flex items-center gap-1">
                              Set {sIdx + 1}
                            </span>
                            <span className="text-slate-400 text-[11px]">{exercise.reps}</span>
                            <div>
                              <input
                                type="number"
                                placeholder="kg"
                                value={log.weightKg || ""}
                                onChange={(e) => updateSetLog(exercise.id, sIdx, "weightKg", Number(e.target.value))}
                                className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                              />
                            </div>
                            <div>
                              <input
                                type="number"
                                placeholder="reps"
                                value={log.reps || ""}
                                onChange={(e) => updateSetLog(exercise.id, sIdx, "reps", Number(e.target.value))}
                                className="w-14 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                              />
                            </div>
                            <div className="text-right">
                              <button
                                onClick={() =>
                                  toggleSetCompletion(exercise.id, sIdx, exercise.restSeconds, displayName)
                                }
                                className={`p-1.5 rounded-lg transition-all ${
                                  isDone
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/40"
                                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                                }`}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ask AI for form guide button */}
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-1">
                    <button
                      onClick={() =>
                        onOpenChatWithQuery &&
                        onOpenChatWithQuery(`${displayName} exercise ka sahi form aur posture kaise banaye?`)
                      }
                      className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> AI Coach: Form video & cues
                    </button>
                    {exercise.alternativeExercise && !isSwapped && (
                      <button
                        onClick={() => toggleSwap(exercise.id)}
                        className="text-slate-400 hover:text-slate-200"
                      >
                        Safe Swap: {exercise.alternativeExercise}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cooldown section */}
          {activeDay.cooldown && activeDay.cooldown.length > 0 && (
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" /> Cool Down & Stretching (3-5 Mins)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {activeDay.cooldown.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 bg-slate-950/50 px-3 py-2 rounded-lg border border-slate-800/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Finish Workout CTA */}
          <div className="p-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-2xl text-center space-y-3">
            <h3 className="text-lg font-bold text-white">Aaj ka Session Complete Kiya?</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Workout ke baad immediate post-workout whey shake/sattu lein aur water log karein for optimum protein synthesis.
            </p>
            <button
              onClick={handleFinishDayWorkout}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/20 inline-flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Award className="w-5 h-5" /> Mark Today&apos;s Workout Complete! 🎉
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
