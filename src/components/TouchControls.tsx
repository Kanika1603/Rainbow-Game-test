import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, Zap, RotateCcw } from 'lucide-react';

interface TouchControlsProps {
  onLeftChange: (active: boolean) => void;
  onRightChange: (active: boolean) => void;
  onJumpStart: () => void;
  onJumpEnd: () => void;
  onDash: () => void;
  onRestart: () => void;
  dashCooldownPercent: number; // 0 to 1
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onLeftChange,
  onRightChange,
  onJumpStart,
  onJumpEnd,
  onDash,
  onRestart,
  dashCooldownPercent,
}) => {
  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-none p-4 select-none flex justify-between items-end z-20 pb-6 md:pb-8">
      {/* Left / Right Movement Buttons */}
      <div className="flex gap-3 pointer-events-auto">
        <button
          id="btn-touch-left"
          type="button"
          onTouchStart={(e) => { e.preventDefault(); onLeftChange(true); }}
          onTouchEnd={(e) => { e.preventDefault(); onLeftChange(false); }}
          onMouseDown={() => onLeftChange(true)}
          onMouseUp={() => onLeftChange(false)}
          onMouseLeave={() => onLeftChange(false)}
          className="w-16 h-16 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/20 active:bg-blue-600/80 active:scale-95 shadow-xl flex items-center justify-center text-white transition-transform touch-none"
          aria-label="Move Left"
        >
          <ArrowLeft className="w-8 h-8" />
        </button>

        <button
          id="btn-touch-right"
          type="button"
          onTouchStart={(e) => { e.preventDefault(); onRightChange(true); }}
          onTouchEnd={(e) => { e.preventDefault(); onRightChange(false); }}
          onMouseDown={() => onRightChange(true)}
          onMouseUp={() => onRightChange(false)}
          onMouseLeave={() => onRightChange(false)}
          className="w-16 h-16 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/20 active:bg-blue-600/80 active:scale-95 shadow-xl flex items-center justify-center text-white transition-transform touch-none"
          aria-label="Move Right"
        >
          <ArrowRight className="w-8 h-8" />
        </button>
      </div>

      {/* Action Buttons: Jump & Dash & Respawn */}
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* Quick Respawn Button */}
        <button
          id="btn-touch-respawn"
          type="button"
          onClick={onRestart}
          className="w-12 h-12 rounded-xl bg-slate-800/80 backdrop-blur-md border border-white/10 active:scale-90 flex items-center justify-center text-slate-300 shadow-lg"
          title="Respawn from checkpoint (R)"
          aria-label="Respawn"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Dash Button with Cooldown Ring */}
        <button
          id="btn-touch-dash"
          type="button"
          disabled={dashCooldownPercent > 0}
          onClick={onDash}
          className={`relative w-15 h-15 rounded-2xl border flex items-center justify-center text-white font-bold shadow-xl active:scale-95 transition-all ${
            dashCooldownPercent > 0
              ? 'bg-slate-800/60 border-white/10 text-white/40 cursor-not-allowed'
              : 'bg-gradient-to-tr from-amber-500 to-yellow-400 border-yellow-200/50 hover:brightness-110'
          }`}
          aria-label="Dash"
        >
          <Zap className="w-7 h-7" />
          {dashCooldownPercent > 0 && (
            <div
              className="absolute inset-0 rounded-2xl bg-black/50 pointer-events-none"
              style={{
                clipPath: `polygon(50% 50%, 50% 0%, ${
                  dashCooldownPercent < 0.25 ? `${50 + dashCooldownPercent * 200}% 0%` : '100% 0%'
                }, ${
                  dashCooldownPercent >= 0.25 && dashCooldownPercent < 0.5 ? `100% ${(dashCooldownPercent - 0.25) * 400}%` : dashCooldownPercent >= 0.5 ? '100% 100%' : '100% 0%'
                }, ${
                  dashCooldownPercent >= 0.5 && dashCooldownPercent < 0.75 ? `${100 - (dashCooldownPercent - 0.5) * 400}% 100%` : dashCooldownPercent >= 0.75 ? '0% 100%' : '100% 100%'
                }, ${
                  dashCooldownPercent >= 0.75 ? `0% ${100 - (dashCooldownPercent - 0.75) * 400}%` : '0% 100%'
                })`,
              }}
            />
          )}
        </button>

        {/* Big Jump Button */}
        <button
          id="btn-touch-jump"
          type="button"
          onTouchStart={(e) => { e.preventDefault(); onJumpStart(); }}
          onTouchEnd={(e) => { e.preventDefault(); onJumpEnd(); }}
          onMouseDown={onJumpStart}
          onMouseUp={onJumpEnd}
          onMouseLeave={onJumpEnd}
          className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-indigo-500 border-2 border-white/40 active:scale-95 shadow-2xl flex flex-col items-center justify-center text-white font-bold transition-transform touch-none"
          aria-label="Jump"
        >
          <ArrowUp className="w-8 h-8" />
          <span className="text-[11px] font-bold tracking-wide uppercase mt-0.5">Jump</span>
        </button>
      </div>
    </div>
  );
};
