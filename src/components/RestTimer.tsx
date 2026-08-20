import React from 'react';
import { useFitness } from '../context/FitnessContext';
import { Play, Pause, X, Plus, Minus, BellRing } from 'lucide-react';

export const RestTimer: React.FC = () => {
  const { activeRestTimer, stopRestTimer, startRestTimer } = useFitness();

  if (!activeRestTimer) return null;

  const minutes = Math.floor(activeRestTimer.remaining / 60);
  const seconds = activeRestTimer.remaining % 60;
  const progressPct = ((activeRestTimer.duration - activeRestTimer.remaining) / activeRestTimer.duration) * 100;

  return (
    <div
      id="rest-timer-widget"
      className="fixed bottom-6 right-6 z-50 bg-white text-slate-900 rounded-2xl p-4 shadow-xl border border-slate-200/90 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-5"
      style={{ minWidth: '280px' }}
    >
      {/* Progress ring or countdown badge */}
      <div className="relative flex items-center justify-center w-14 h-14 bg-blue-50 rounded-xl border border-blue-200 text-blue-700 font-mono font-bold text-xl shadow-2xs">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        <div
          className="absolute inset-0 rounded-xl border-2 border-blue-600 pointer-events-none opacity-60"
          style={{ clipPath: `inset(0 0 ${100 - progressPct}% 0)` }}
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider">
          <BellRing className="w-3.5 h-3.5 animate-pulse text-blue-600" />
          <span>Rest Between Sets</span>
        </div>
        <p className="text-xs text-slate-600 font-medium mt-0.5">
          {activeRestTimer.remaining === 0 ? 'Rest complete! Next set!' : 'Take deep breaths & hydrate'}
        </p>

        {/* Quick add/subtract time */}
        <div className="flex items-center gap-2 mt-2">
          <button
            id="timer-minus-15"
            onClick={() => startRestTimer(Math.max(15, activeRestTimer.remaining - 15))}
            className="px-2.5 py-0.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 font-bold transition-colors flex items-center gap-0.5"
            title="Minus 15 seconds"
          >
            <Minus className="w-3 h-3" /> 15s
          </button>
          <button
            id="timer-plus-15"
            onClick={() => startRestTimer(activeRestTimer.remaining + 15)}
            className="px-2.5 py-0.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 font-bold transition-colors flex items-center gap-0.5"
            title="Plus 15 seconds"
          >
            <Plus className="w-3 h-3" /> 15s
          </button>
        </div>
      </div>

      {/* Close button */}
      <button
        id="close-rest-timer"
        onClick={stopRestTimer}
        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        title="Dismiss Timer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
