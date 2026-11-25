import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Clock, Star, Skull, ArrowRight, RotateCcw, Menu } from 'lucide-react';
import { LevelData } from '../types';

interface VictoryModalProps {
  level: LevelData;
  time: number;
  starsEarned: number;
  deaths: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onLevelSelect: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  level,
  time,
  starsEarned,
  deaths,
  hasNextLevel,
  onNextLevel,
  onReplay,
  onLevelSelect,
}) => {
  useEffect(() => {
    // Rainbow confetti burst!
    const colors = ['#FF4B4B', '#FF8533', '#FFD233', '#2ECC71', '#00D2D3', '#3498DB', '#9B59B6'];
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors,
    });

    const timeout = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
    }, 250);

    return () => clearTimeout(timeout);
  }, []);

  const formatTime = (timeInSeconds: number) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    const ms = Math.floor((timeInSeconds * 100) % 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const isUnderPar = time <= level.parTime;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-2 border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
        {/* Rainbow Accent Band at top */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-red-500 via-yellow-400 via-emerald-400 via-blue-500 to-purple-500" />

        {/* Victory Icon */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-200 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-4 border-2 border-white/60">
          <Trophy className="w-10 h-10 text-amber-900" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
          Stage Cleared!
        </h2>
        <p className="text-amber-400 font-semibold text-sm mb-6">
          {level.name}
        </p>

        {/* Star Rating */}
        <div className="flex justify-center items-center gap-3 mb-6">
          {[1, 2, 3].map((starIndex) => (
            <div
              key={starIndex}
              className={`transition-all duration-500 transform ${
                starIndex <= starsEarned
                  ? 'text-yellow-400 scale-125 drop-shadow-[0_0_12px_rgba(250,204,21,0.8)] animate-bounce'
                  : 'text-slate-600 scale-95 opacity-50'
              }`}
              style={{ animationDelay: `${starIndex * 150}ms` }}
            >
              <Star className="w-10 h-10 fill-current" />
            </div>
          ))}
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-3 flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-xs text-white/60 mb-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Clear Time</span>
            </div>
            <span className="text-xl font-mono font-bold text-white">
              {formatTime(time)}
            </span>
            <span className={`text-[11px] font-medium mt-1 ${isUnderPar ? 'text-emerald-400' : 'text-slate-400'}`}>
              Par: {level.parTime}s {isUnderPar ? '⚡ Under Par!' : ''}
            </span>
          </div>

          <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-3 flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-xs text-white/60 mb-1">
              <Skull className="w-3.5 h-3.5 text-rose-400" />
              <span>Deaths</span>
            </div>
            <span className="text-xl font-mono font-bold text-white">
              {deaths}
            </span>
            <span className="text-[11px] font-medium text-slate-400 mt-1">
              {deaths === 0 ? '✨ Flawless Run!' : 'Well fought!'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {hasNextLevel ? (
            <button
              id="btn-victory-next"
              type="button"
              onClick={onNextLevel}
              className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Next Stage</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              id="btn-victory-select"
              type="button"
              onClick={onLevelSelect}
              className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>All Stages</span>
              <Menu className="w-5 h-5" />
            </button>
          )}

          <button
            id="btn-victory-replay"
            type="button"
            onClick={onReplay}
            className="py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-white/15 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay</span>
          </button>

          <button
            id="btn-victory-stages"
            type="button"
            onClick={onLevelSelect}
            className="py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-white/15 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Menu className="w-4 h-4" />
            <span>Stages</span>
          </button>
        </div>
      </div>
    </div>
  );
};
