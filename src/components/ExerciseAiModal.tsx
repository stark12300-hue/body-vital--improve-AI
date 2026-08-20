import React, { useState, useEffect } from 'react';
import { useFitness } from '../context/FitnessContext';
import { Exercise } from '../types';
import { 
  Sparkles, 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Flame, 
  Activity,
  Dumbbell
} from 'lucide-react';

interface Props {
  exercise: Exercise | null;
  onClose: () => void;
}

export const ExerciseAiModal: React.FC<Props> = ({ exercise, onClose }) => {
  const { getExerciseAiAdvice, userProfile } = useFitness();
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!exercise) return;
    let isMounted = true;
    setIsLoading(true);
    setAdvice(null);

    getExerciseAiAdvice(exercise.name)
      .then((res) => {
        if (isMounted) {
          setAdvice(res);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setAdvice('Could not load real-time form tips at this moment.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [exercise, getExerciseAiAdvice]);

  if (!exercise) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        id="exercise-ai-modal"
        className="w-full max-w-2xl bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-2xs">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">{exercise.name}</h3>
                <span className="text-xs text-blue-600 font-bold">({exercise.targetMuscle})</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                AI Biomechanics & Injury-Safe Execution Protocols
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Exercise Specs */}
        <div className="grid grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-slate-500 block text-[11px] font-medium">Recommended Sets</span>
            <strong className="text-slate-900 font-mono font-bold">{exercise.sets} Sets × {exercise.reps} Reps</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-slate-500 block text-[11px] font-medium">Rest Interval</span>
            <strong className="text-blue-700 font-mono font-bold">{exercise.restSeconds || 60} Seconds</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-slate-500 block text-[11px] font-medium">Equipment</span>
            <strong className="text-slate-800 truncate block font-bold">{exercise.equipment}</strong>
          </div>
        </div>

        {/* Form Checklist & Mistakes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80">
            <div className="font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Core Form Cues
            </div>
            <ul className="space-y-1.5 text-slate-700 text-[11px] list-disc list-inside font-medium">
              {exercise.formTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200/80">
            <div className="font-bold text-rose-900 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" /> Avoid These Mistakes
            </div>
            <ul className="space-y-1.5 text-slate-700 text-[11px] list-disc list-inside font-medium">
              {exercise.mistakesToAvoid.map((mistake, i) => (
                <li key={i}>{mistake}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Real-time AI Biomechanical Coach Advice */}
        <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-200 text-xs">
          <div className="flex items-center gap-2 text-blue-900 font-bold mb-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            AI Coach Biomechanical Deep Dive & Injury Adaptations:
          </div>

          {isLoading ? (
            <div className="py-4 flex items-center gap-2 text-slate-500 font-medium">
              <Activity className="w-4 h-4 animate-spin text-blue-600" />
              <span>Analyzing movement mechanics and joint safety parameters...</span>
            </div>
          ) : advice ? (
            <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-xs font-medium">
              {advice}
            </div>
          ) : (
            <p className="text-slate-500 font-medium">No additional advice loaded.</p>
          )}
        </div>

        {/* Action button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-xs shadow-xs"
          >
            Got It, Back to Workout
          </button>
        </div>
      </div>
    </div>
  );
};
