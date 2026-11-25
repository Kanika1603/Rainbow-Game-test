import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Sparkles, Crown, Cloud, Star, Wand2 } from 'lucide-react';
import { CustomizationSettings, HatStyle, TrailStyle } from '../types';

interface CustomizeModalProps {
  settings: CustomizationSettings;
  onSave: (newSettings: CustomizationSettings) => void;
  onClose: () => void;
}

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  settings,
  onSave,
  onClose,
}) => {
  const [current, setCurrent] = useState<CustomizationSettings>(settings);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const colors = [
    { name: 'Cherry Red', hex: '#FF4B4B' },
    { name: 'Sunset Orange', hex: '#FF8533' },
    { name: 'Sunbeam Yellow', hex: '#FFD233' },
    { name: 'Emerald Green', hex: '#2ECC71' },
    { name: 'Aqua Cyan', hex: '#00D2D3' },
    { name: 'Sky Blue', hex: '#3498DB' },
    { name: 'Magic Violet', hex: '#9B59B6' },
    { name: 'Cloud White', hex: '#FFFFFF' },
  ];

  const hats: { id: HatStyle; label: string; icon: React.ReactNode }[] = [
    { id: 'none', label: 'No Hat', icon: <span className="text-xs text-white/50">None</span> },
    { id: 'rainbow_crown', label: 'Rainbow Crown', icon: <Crown className="w-5 h-5 text-amber-400" /> },
    { id: 'cloud_wings', label: 'Cloud Wings', icon: <Cloud className="w-5 h-5 text-sky-300" /> },
    { id: 'star_halo', label: 'Star Halo', icon: <Star className="w-5 h-5 text-yellow-300" /> },
    { id: 'unicorn_horn', label: 'Unicorn Horn', icon: <Wand2 className="w-5 h-5 text-pink-400" /> },
  ];

  const trails: { id: TrailStyle; label: string; desc: string }[] = [
    { id: 'rainbow', label: 'Rainbow Ribbon', desc: 'Classic multi-color ribbon' },
    { id: 'starlight', label: 'Starlight Sparkles', desc: 'Shining diamond stars' },
    { id: 'bubble', label: 'Bubble Cloud', desc: 'Floating soap bubbles' },
    { id: 'sparkle', label: 'Neon Spectrum', desc: 'High-energy cross sparkles' },
  ];

  // Draw animated character preview
  useEffect(() => {
    let animId: number;
    let time = 0;

    const render = () => {
      const canvas = previewCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      time += 0.04;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + Math.sin(time * 3) * 6;

      ctx.save();
      ctx.translate(cx, cy);

      const w = 44;
      const h = 52;
      const colorHex = colors[current.colorIndex % colors.length].hex;

      // Soft shadow
      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 6;

      // Body
      ctx.fillStyle = colorHex;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, 18);
      ctx.fill();
      ctx.shadowColor = 'transparent';

      // Rainbow belly
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(-w / 2 + 5, -h / 2 + 10, w - 10, h - 18, 12);
      ctx.clip();
      const rainbowColors = ['#FF4B4B', '#FF8533', '#FFD233', '#2ECC71', '#00D2D3', '#3498DB', '#9B59B6'];
      const bandH = (h - 18) / 7;
      rainbowColors.forEach((col, idx) => {
        ctx.fillStyle = col;
        ctx.fillRect(-w / 2 + 5, -h / 2 + 10 + idx * bandH, w - 10, bandH + 1);
      });
      ctx.restore();

      // Eyes
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(6, -6, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(8, -6, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(7.5, -7.5, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Blush
      ctx.fillStyle = 'rgba(255, 105, 180, 0.6)';
      ctx.beginPath();
      ctx.arc(4, 8, 4, 0, Math.PI * 2);
      ctx.fill();

      // Hat
      const hatY = -h / 2;
      if (current.hat === 'rainbow_crown') {
        ctx.fillStyle = '#FFD233';
        ctx.beginPath();
        ctx.moveTo(-14, hatY + 3);
        ctx.lineTo(-16, hatY - 14);
        ctx.lineTo(-6, hatY - 7);
        ctx.lineTo(0, hatY - 18);
        ctx.lineTo(6, hatY - 7);
        ctx.lineTo(16, hatY - 14);
        ctx.lineTo(14, hatY + 3);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#FF4B4B';
        ctx.beginPath();
        ctx.arc(0, hatY - 8, 3, 0, Math.PI * 2);
        ctx.fill();
      } else if (current.hat === 'cloud_wings') {
        const wingFlap = Math.sin(time * 8) * 4;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(-w / 2 - 6, -4 + wingFlap, 12, 7, -0.4, 0, Math.PI * 2);
        ctx.fill();
      } else if (current.hat === 'star_halo') {
        const haloBob = Math.sin(time * 4) * 3;
        ctx.strokeStyle = '#FFD233';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, hatY - 12 + haloBob, 16, 5, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (current.hat === 'unicorn_horn') {
        ctx.fillStyle = '#FF8533';
        ctx.beginPath();
        ctx.moveTo(-4, hatY + 3);
        ctx.lineTo(0, hatY - 20);
        ctx.lineTo(4, hatY + 3);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [current]);

  const handleSave = () => {
    onSave(current);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg max-h-[92vh] flex flex-col bg-slate-900 border border-white/15 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">Customize Runner</h2>
              <p className="text-xs text-white/50">Personalize your rainbow avatar</p>
            </div>
          </div>
          <button
            id="btn-close-customize"
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Avatar Preview */}
          <div className="flex justify-center items-center py-2">
            <div className="relative w-36 h-36 rounded-3xl bg-gradient-to-b from-slate-800 to-slate-950 border border-white/10 flex items-center justify-center shadow-inner overflow-hidden">
              <canvas ref={previewCanvasRef} width={144} height={144} />
            </div>
          </div>

          {/* Color Chooser */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-white/60 mb-2.5 block">
              Runner Color
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {colors.map((c, idx) => (
                <button
                  key={c.name}
                  id={`btn-color-${idx}`}
                  type="button"
                  onClick={() => setCurrent({ ...current, colorIndex: idx })}
                  style={{ backgroundColor: c.hex }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all active:scale-95 ${
                    current.colorIndex === idx
                      ? 'ring-4 ring-white scale-105 shadow-lg'
                      : 'opacity-80 hover:opacity-100 hover:scale-105'
                  }`}
                  title={c.name}
                  aria-label={c.name}
                >
                  {current.colorIndex === idx && (
                    <Check className={`w-5 h-5 ${c.hex === '#FFFFFF' ? 'text-slate-900' : 'text-white'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Hats Chooser */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-white/60 mb-2.5 block">
              Hats & Accessories
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {hats.map((h) => (
                <button
                  key={h.id}
                  id={`btn-hat-${h.id}`}
                  type="button"
                  onClick={() => setCurrent({ ...current, hat: h.id })}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                    current.hat === h.id
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                      : 'bg-slate-950/40 border-white/10 text-white/70 hover:bg-white/5'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    {h.icon}
                  </div>
                  <span className="text-xs font-semibold">{h.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Trail Chooser */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-white/60 mb-2.5 block">
              Dash & Run Trail
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {trails.map((t) => (
                <button
                  key={t.id}
                  id={`btn-trail-${t.id}`}
                  type="button"
                  onClick={() => setCurrent({ ...current, trail: t.id })}
                  className={`p-3 rounded-xl border flex flex-col transition-all text-left ${
                    current.trail === t.id
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                      : 'bg-slate-950/40 border-white/10 text-white/70 hover:bg-white/5'
                  }`}
                >
                  <span className="text-xs font-bold text-white mb-0.5">{t.label}</span>
                  <span className="text-[11px] text-white/50">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950/50 flex justify-end gap-2">
          <button
            id="btn-cancel-customize"
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            id="btn-save-customize"
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:brightness-110 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
          >
            Apply Style
          </button>
        </div>
      </div>
    </div>
  );
};
