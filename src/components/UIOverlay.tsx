import React from 'react';
import { Volume2, VolumeX, Pause, Play, Sparkles, Trophy, RotateCcw, Palette, HelpCircle } from 'lucide-react';
import { LevelData } from '../types';

interface UIOverlayProps {
  level: LevelData;
  elapsedTime: number;
  deaths: number;
  starsCollectedCount: number;
  dashCooldown: number;
  isPaused: boolean;
  isMuted: boolean;
  checkpointNotification: string | null;
  onTogglePause: () => void;
  onToggleMute: () => void;
  onOpenLevelSelect: () => void;
  onOpenCustomize: () => void;
  onOpenHelp: () => void;
  onRestartCheckpoint: () => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({
  level,
  elapsedTime,
  deaths,
  starsCollectedCount,
  dashCooldown,
  isPaused,
  isMuted,
  checkpointNotification,
  onTogglePause,
  onToggleMute,
  onOpenLevelSelect,
  onOpenCustomize,
  onOpenHelp,
  onRestartCheckpoint,
}) => {
  const formatTime = (timeInSeconds: number) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    const ms = Math.floor((timeInSeconds * 100) % 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-3 sm:p-5">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        {/* Left: Stage Title & Subtitle */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-white/15 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 via-amber-400 to-emerald-400 flex items-center justify-center text-white font-black text-sm shadow-md">
            {level.id === 99 ? '∞' : level.id}
          </div>
          <div>
            <h1 className="text-white font-bold text-sm sm:text-base leading-tight drop-shadow-sm flex items-center gap-1.5">
              {level.name}
            </h1>
            <p className="text-white/60 text-xs font-medium truncate max-w-[200px] sm:max-w-xs">
              {level.subtitle}
            </p>
          </div>
        </div>

        {/* Center: Live Timer & Stars & Deaths */}
        <div className="flex items-center gap-2 sm:gap-3 bg-slate-900/80 backdrop-blur-md border border-white/15 px-3.5 py-2 rounded-2xl shadow-xl">
          {/* Time Trial Stopwatch */}
          <div className="flex items-center gap-1.5 font-mono text-emerald-400 font-bold text-sm sm:text-base px-2 py-0.5 bg-slate-950/60 rounded-lg">
            <span>{formatTime(elapsedTime)}</span>
          </div>

          {/* Stars Collected */}
          <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-950/60 rounded-lg">
            {[0, 1, 2].map((idx) => (
              <span
                key={idx}
                className={`text-base transition-transform ${
                  idx < starsCollectedCount
                    ? 'text-yellow-400 scale-110 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]'
                    : 'text-white/20'
                }`}
              >
                ★
              </span>
            ))}
          </div>

          {/* Deaths */}
          <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-950/60 rounded-lg text-rose-400 text-xs sm:text-sm font-semibold">
            <span>💀</span>
            <span>{deaths}</span>
          </div>
        </div>

        {/* Right Toolbar Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Customizer */}
          <button
            id="btn-nav-customize"
            type="button"
            onClick={onOpenCustomize}
            className="w-10 h-10 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/15 hover:bg-slate-800 text-white/90 hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95"
            title="Customize Character"
            aria-label="Customize Character"
          >
            <Palette className="w-5 h-5 text-pink-400" />
          </button>

          {/* Level Select */}
          <button
            id="btn-nav-levels"
            type="button"
            onClick={onOpenLevelSelect}
            className="w-10 h-10 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/15 hover:bg-slate-800 text-white/90 hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95"
            title="Stage Select"
            aria-label="Stage Select"
          >
            <Trophy className="w-5 h-5 text-amber-400" />
          </button>

          {/* Restart from checkpoint */}
          <button
            id="btn-nav-restart"
            type="button"
            onClick={onRestartCheckpoint}
            className="w-10 h-10 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/15 hover:bg-slate-800 text-white/90 hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95"
            title="Restart Checkpoint (R)"
            aria-label="Restart Checkpoint"
          >
            <RotateCcw className="w-4.5 h-4.5 text-sky-400" />
          </button>

          {/* Sound Mute/Unmute */}
          <button
            id="btn-nav-sound"
            type="button"
            onClick={onToggleMute}
            className="w-10 h-10 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/15 hover:bg-slate-800 text-white/90 hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label="Toggle Sound"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-rose-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-emerald-400" />
            )}
          </button>

          {/* Help / Controls modal */}
          <button
            id="btn-nav-help"
            type="button"
            onClick={onOpenHelp}
            className="w-10 h-10 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/15 hover:bg-slate-800 text-white/90 hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95"
            title="Controls & Instructions"
            aria-label="Controls & Instructions"
          >
            <HelpCircle className="w-5 h-5 text-cyan-400" />
          </button>

          {/* Pause */}
          <button
            id="btn-nav-pause"
            type="button"
            onClick={onTogglePause}
            className="w-10 h-10 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/15 hover:bg-slate-800 text-white/90 hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95"
            title={isPaused ? 'Resume Game' : 'Pause Game'}
            aria-label="Pause Game"
          >
            {isPaused ? <Play className="w-5 h-5 text-amber-400" /> : <Pause className="w-5 h-5 text-white/90" />}
          </button>
        </div>
      </div>

      {/* Checkpoint Banner Toast Notification */}
      {checkpointNotification && (
        <div className="self-center mt-6 animate-bounce pointer-events-none">
          <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white px-5 py-2.5 rounded-full font-bold shadow-2xl flex items-center gap-2 border-2 border-white/60">
            <Sparkles className="w-5 h-5 animate-spin" />
            <span>{checkpointNotification}</span>
          </div>
        </div>
      )}

      {/* Subtle bottom keyboard reminder (hidden on small touch screens) */}
      <div className="hidden md:flex justify-center mb-2 pointer-events-none">
        <div className="bg-slate-900/60 backdrop-blur-sm border border-white/10 px-4 py-1 rounded-full text-xs text-white/60 flex items-center gap-4">
          <span><strong className="text-white">A / D</strong> or <strong className="text-white">← / →</strong> Move</span>
          <span><strong className="text-white">Space / W / ↑</strong> Jump (Double Jump!)</span>
          <span><strong className="text-white">Shift / Z</strong> Rainbow Dash</span>
          <span><strong className="text-white">R</strong> Respawn</span>
        </div>
      </div>
    </div>
  );
};
