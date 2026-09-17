import React, { useRef, useState, useEffect } from 'react';
import { Zap, Shield, RotateCcw, Flame } from 'lucide-react';
import { PlayerInput } from '../types';

interface MobileControlsProps {
  onInputChange: (input: Partial<PlayerInput>) => void;
  onRecover: () => void;
  isBoosting: boolean;
  boostEnergy: number;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onInputChange,
  onRecover,
  isBoosting,
  boostEnergy,
}) => {
  const [touchActive, setTouchActive] = useState(false);
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 });
  const dpadRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (touchIdRef.current !== null) return;

    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setTouchActive(true);
    updateDpad(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        updateDpad(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setTouchActive(false);
        setStickPos({ x: 0, y: 0 });
        onInputChange({ steer: 0, throttle: 0 });
        break;
      }
    }
  };

  const updateDpad = (clientX: number, clientY: number) => {
    if (!dpadRef.current) return;
    const rect = dpadRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let deltaX = clientX - centerX;
    let deltaY = clientY - centerY;
    const maxRadius = rect.width / 2;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (distance > maxRadius) {
      deltaX = (deltaX / distance) * maxRadius;
      deltaY = (deltaY / distance) * maxRadius;
    }

    setStickPos({ x: deltaX, y: deltaY });

    const steer = Math.max(-1, Math.min(1, deltaX / maxRadius));
    // Invert Y so up is positive throttle
    const throttle = Math.max(-1, Math.min(1, -deltaY / maxRadius));

    onInputChange({
      steer: Math.abs(steer) > 0.1 ? steer : 0,
      throttle: Math.abs(throttle) > 0.1 ? throttle : 0,
    });
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none flex justify-between items-end p-6 md:hidden">
      {/* Left Circular Analog D-Pad */}
      <div
        ref={dpadRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="pointer-events-auto relative w-36 h-36 rounded-full bg-slate-950/70 border-2 border-cyan-500/40 backdrop-blur-md shadow-[0_0_25px_rgba(0,240,255,0.2)] flex items-center justify-center touch-none"
      >
        {/* Inner Axis Guides */}
        <div className="absolute w-full h-0.5 bg-cyan-500/20" />
        <div className="absolute h-full w-0.5 bg-cyan-500/20" />
        <div className="w-16 h-16 rounded-full border border-cyan-500/30" />

        {/* Thumb Stick */}
        <div
          className={`absolute w-14 h-14 rounded-full border-2 border-cyan-300 shadow-[0_0_15px_#00f0ff] transition-transform duration-75 flex items-center justify-center ${
            touchActive ? 'bg-cyan-500/50 scale-95' : 'bg-cyan-950/80 scale-100'
          }`}
          style={{
            transform: `translate(${stickPos.x}px, ${stickPos.y}px)`,
          }}
        >
          <div className="w-4 h-4 rounded-full bg-cyan-300 shadow-[0_0_8px_#fff]" />
        </div>
      </div>

      {/* Right Action Trigger Buttons */}
      <div className="pointer-events-auto flex flex-col items-end gap-3.5">
        {/* Quick Respawn / Recover Button */}
        <button
          onTouchStart={e => {
            e.preventDefault();
            onRecover();
          }}
          className="w-12 h-12 rounded-2xl bg-slate-900/80 border border-slate-700 text-slate-300 active:bg-cyan-500 active:text-slate-950 flex items-center justify-center shadow-lg transition-all"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Drift Brake Button */}
        <button
          onTouchStart={e => {
            e.preventDefault();
            onInputChange({ drift: true });
          }}
          onTouchEnd={e => {
            e.preventDefault();
            onInputChange({ drift: false });
          }}
          className="w-16 h-16 rounded-2xl bg-fuchsia-950/80 border-2 border-fuchsia-500/60 active:bg-fuchsia-500 active:text-slate-950 text-fuchsia-300 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(255,0,229,0.3)] transition-all"
        >
          <Flame className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-ui font-black uppercase tracking-wider">DRIFT</span>
        </button>

        {/* Hyper-Boost Button */}
        <button
          onTouchStart={e => {
            e.preventDefault();
            if (boostEnergy > 5) onInputChange({ boost: true });
          }}
          onTouchEnd={e => {
            e.preventDefault();
            onInputChange({ boost: false });
          }}
          disabled={boostEnergy <= 5}
          className={`w-20 h-20 rounded-3xl border-2 flex flex-col items-center justify-center shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all ${
            isBoosting
              ? 'bg-cyan-400 text-slate-950 border-white scale-95 shadow-[0_0_35px_#00f0ff]'
              : boostEnergy > 5
              ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 active:bg-cyan-400 active:text-slate-950'
              : 'bg-slate-950/60 border-slate-800 text-slate-600'
          }`}
        >
          <Zap className={`w-7 h-7 mb-0.5 ${isBoosting ? 'animate-bounce' : ''}`} />
          <span className="text-[11px] font-ui font-black uppercase tracking-widest">BOOST</span>
        </button>
      </div>
    </div>
  );
};
