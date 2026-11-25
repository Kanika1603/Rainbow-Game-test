import React from 'react';
import { X, Play, Trophy, Clock, Star, Flame } from 'lucide-react';
import { LEVELS } from '../game/levels';
import { LevelProgress } from '../types';

interface LevelSelectModalProps {
  currentLevelIndex: number;
  progress: Record<number, LevelProgress>;
  onSelectLevel: (index: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  currentLevelIndex,
  progress,
  onSelectLevel,
  onClose,
}) => {
  const formatTime = (timeInSeconds: number | null) => {
    if (timeInSeconds === null) return '--:--.--';
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    const ms = Math.floor((timeInSeconds * 100) % 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  // 5 standard levels + Endless mode
  const allStages = [
    ...LEVELS,
    {
      id: 99,
      name: 'Endless Rainbow Rush',
      subtitle: 'Infinite procedural rainbow course',
      description: 'Test your endurance on an endless track of bouncing clouds and moving hazards!',
      parTime: 120,
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl max-h-[90vh] flex flex-col bg-slate-900 border border-white/15 rounded-3xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-md">
              <Trophy className="w-5 h-5 text-amber-950" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">Stage Select</h2>
              <p className="text-xs text-white/50">Choose an obstacle course to run</p>
            </div>
          </div>
          <button
            id="btn-close-levels"
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level List */}
        <div className="p-5 overflow-y-auto space-y-3">
          {allStages.map((stage, idx) => {
            const isCurrent = currentLevelIndex === idx;
            const stageProg = progress[stage.id] || {
              unlocked: idx === 0 || idx === 5,
              completed: false,
              bestTime: null,
              starsEarned: 0,
            };

            const isEndless = stage.id === 99;

            return (
              <div
                key={stage.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-blue-900/30 border-blue-500/50 shadow-lg shadow-blue-500/10'
                    : 'bg-slate-950/40 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-base shadow-md shrink-0 ${
                    isEndless
                      ? 'bg-gradient-to-tr from-purple-500 to-pink-500 text-white'
                      : isCurrent
                      ? 'bg-gradient-to-tr from-blue-500 to-cyan-400 text-white'
                      : 'bg-slate-800 text-white/80'
                  }`}>
                    {isEndless ? <Flame className="w-6 h-6" /> : stage.id}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base leading-snug">
                        {stage.name}
                      </h3>
                      {isCurrent && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          Playing
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/60 mb-1.5">{stage.subtitle}</p>

                    {/* Stars and Best Time */}
                    <div className="flex items-center gap-4 text-xs">
                      {!isEndless && (
                        <div className="flex items-center gap-0.5 text-yellow-400">
                          {[0, 1, 2].map((s) => (
                            <span key={s} className={s < stageProg.starsEarned ? 'text-yellow-400' : 'text-slate-600'}>
                              ★
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-white/60 font-mono text-[11px]">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        <span>Best: {formatTime(stageProg.bestTime)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Play Button */}
                <button
                  id={`btn-play-stage-${stage.id}`}
                  type="button"
                  onClick={() => onSelectLevel(idx)}
                  className={`py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:brightness-110'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isCurrent ? 'Continue' : 'Play Stage'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
