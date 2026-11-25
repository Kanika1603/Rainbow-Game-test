import React from 'react';
import { X, Sparkles, Compass, ShieldAlert, Zap } from 'lucide-react';

interface InstructionsModalProps {
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg max-h-[90vh] flex flex-col bg-slate-900 border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center shadow-md">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">How to Play</h2>
              <p className="text-xs text-white/50">Master the Rainbow Obstacle Course</p>
            </div>
          </div>
          <button
            id="btn-close-help"
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-white/80">
          {/* Controls Section */}
          <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-4">
            <h3 className="text-white font-bold mb-2.5 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Controls</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                <span className="text-white/60">Move Left / Right</span>
                <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-white">A / D or ← / →</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                <span className="text-white/60">Jump & Double Jump</span>
                <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-white">Space / W / ↑</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                <span className="text-white/60">Rainbow Dash</span>
                <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-white">Shift or Z</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                <span className="text-white/60">Quick Respawn</span>
                <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-white">R Key</span>
              </div>
            </div>
            <p className="text-[11px] text-white/50 mt-2 italic">
              * On touchscreen devices, tap or hold the on-screen movement and action buttons!
            </p>
          </div>

          {/* Rainbow Elements */}
          <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-4">
            <h3 className="text-white font-bold mb-2.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Rainbow Elements</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Bouncy Clouds:</strong> Springy marshmallow clouds that propel you high into the sky!
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Speed Strips:</strong> Glowing turbo lanes that give your runner a massive forward burst.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Vanishing Tiles:</strong> Translucent prismatic steps that shake and disappear after stepped on!
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-purple-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Checkpoints:</strong> Reach the rainbow flags to save your progress if you fall.
                </div>
              </div>
            </div>
          </div>

          {/* Hazards & Goal */}
          <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-4">
            <h3 className="text-white font-bold mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Hazards & Goal</span>
            </h3>
            <p className="text-xs leading-relaxed text-white/70">
              Avoid crystal spikes, swinging pendulums, and rotating rainbow lasers. Collect all 3 Prismatic Stars in each course and sprint through the Finish Arch under par time for 3-star mastery!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950/50 flex justify-end">
          <button
            id="btn-got-it"
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            Got It, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
};
