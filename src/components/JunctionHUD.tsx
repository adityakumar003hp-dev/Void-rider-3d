import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  GitBranch,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Timer,
  ChevronRight,
} from 'lucide-react';
import { ActiveJunctionTelemetry, BranchRouteDirection } from '../game/junctionSystem';

interface JunctionHUDProps {
  telemetry: ActiveJunctionTelemetry | null;
  onSelectRoute?: (direction: BranchRouteDirection) => void;
}

export const JunctionHUD: React.FC<JunctionHUDProps> = ({ telemetry, onSelectRoute }) => {
  if (!telemetry || telemetry.status === 'PASSED') return null;

  const isApproaching = telemetry.status === 'APPROACHING';
  const isActive = telemetry.status === 'ACTIVE';

  // If in branch, show current route progress
  if (telemetry.playerInBranch) {
    const currentRoute = telemetry.availableRoutes.find(r => r.id === telemetry.selectedRouteId);
    return (
      <div
        id="junction-branch-progress"
        className="fixed top-24 left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none flex flex-col items-center"
      >
        <div className="bg-slate-950/85 backdrop-blur-md border border-cyan-500/50 rounded-xl px-5 py-2.5 shadow-[0_0_25px_rgba(0,240,255,0.35)] flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
                BRANCH ROUTE ACTIVE
              </span>
              <span className="text-[10px] font-ui uppercase font-black px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {currentRoute?.name || 'CUSTOM PATH'}
              </span>
            </div>
            <div className="w-48 h-2 bg-slate-900/90 rounded-full overflow-hidden mt-1.5 border border-cyan-900/50">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-all duration-75 shadow-[0_0_10px_#00f0ff]"
                style={{ width: `${Math.round(telemetry.branchProgress * 100)}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-mono font-bold text-white ml-1">
            {Math.round(telemetry.branchProgress * 100)}%
          </span>
        </div>
      </div>
    );
  }

  const getDirectionIcon = (dir: BranchRouteDirection) => {
    switch (dir) {
      case 'LEFT':
        return <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'RIGHT':
        return <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'SHORTCUT':
        return <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'CENTER':
      default:
        return <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />;
    }
  };

  const getDirectionKeyPrompt = (dir: BranchRouteDirection) => {
    switch (dir) {
      case 'LEFT':
        return 'A / ←';
      case 'RIGHT':
        return 'D / →';
      case 'SHORTCUT':
        return 'S / ↓';
      case 'CENTER':
      default:
        return 'W / ↑';
    }
  };

  const getDifficultyBadgeColor = (diff: string) => {
    switch (diff) {
      case 'EASY':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'MEDIUM':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'HARD':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'EXTREME':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  const getRouteTheme = (dir: BranchRouteDirection, hasShortcut: boolean) => {
    if (hasShortcut || dir === 'SHORTCUT') {
      return {
        border: 'border-amber-400',
        glow: 'shadow-[0_0_25px_rgba(245,158,11,0.4)]',
        bg: 'bg-amber-950/80',
        activeBg: 'bg-amber-500 text-slate-950',
        text: 'text-amber-300',
      };
    }
    if (dir === 'LEFT') {
      return {
        border: 'border-cyan-400',
        glow: 'shadow-[0_0_25px_rgba(0,240,255,0.4)]',
        bg: 'bg-cyan-950/80',
        activeBg: 'bg-cyan-500 text-slate-950',
        text: 'text-cyan-300',
      };
    }
    if (dir === 'RIGHT') {
      return {
        border: 'border-fuchsia-400',
        glow: 'shadow-[0_0_25px_rgba(217,70,239,0.4)]',
        bg: 'bg-fuchsia-950/80',
        activeBg: 'bg-fuchsia-500 text-slate-950',
        text: 'text-fuchsia-300',
      };
    }
    return {
      border: 'border-blue-400',
      glow: 'shadow-[0_0_25px_rgba(96,165,250,0.4)]',
      bg: 'bg-blue-950/80',
      activeBg: 'bg-blue-500 text-slate-950',
      text: 'text-blue-300',
    };
  };

  return (
    <div
      id="junction-switching-hud"
      className="fixed inset-x-0 bottom-28 sm:bottom-24 z-40 pointer-events-none flex flex-col items-center select-none px-4"
    >
      {/* Top Banner Alert */}
      <div className="flex flex-col items-center mb-3">
        <div className="bg-slate-950/90 backdrop-blur-md border-2 border-cyan-400/80 rounded-2xl px-5 py-2 shadow-[0_0_30px_rgba(0,240,255,0.4)] flex items-center gap-3">
          <GitBranch className="w-5 h-5 text-cyan-400 animate-pulse" />
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-widest text-cyan-300 uppercase font-bold">
                {isApproaching ? 'APPROACHING JUNCTION' : 'JUNCTION ZONE ACTIVE'}
              </span>
              <span className="text-[11px] font-ui uppercase font-black text-white px-2 py-0.5 rounded bg-cyan-900/60 border border-cyan-400/40">
                {telemetry.name}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono text-slate-300 mt-0.5">
              <span>DISTANCE: <strong className="text-cyan-400">{Math.round(telemetry.distanceToJunction)}m</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Timer className="w-3 h-3 text-amber-400" />
                <span>DECISION WINDOW: <strong className={telemetry.timeRemainingSec < 2 ? 'text-rose-400 animate-ping' : 'text-amber-400'}>{telemetry.timeRemainingSec.toFixed(1)}s</strong></span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Route Selection Buttons (Mobile & Desktop) */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 max-w-xl w-full pointer-events-auto">
        {telemetry.availableRoutes.map(route => {
          const isSelected = route.id === telemetry.selectedRouteId;
          const theme = getRouteTheme(route.direction, route.hasShortcut);

          return (
            <button
              key={route.id}
              id={`junction-route-btn-${route.id}`}
              onClick={() => onSelectRoute?.(route.direction)}
              className={`relative flex-1 rounded-2xl border-2 p-2.5 sm:p-3.5 transition-all duration-200 cursor-pointer flex flex-col items-center backdrop-blur-lg ${
                isSelected
                  ? `${theme.border} ${theme.bg} ${theme.glow} ring-2 ring-white/60 scale-105`
                  : 'border-slate-700/80 bg-slate-950/70 opacity-75 hover:opacity-100 hover:scale-100'
              }`}
            >
              {/* Selected indicator badge */}
              {isSelected && (
                <div className="absolute -top-2.5 bg-cyan-400 text-slate-950 text-[8px] sm:text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full shadow-[0_0_10px_#00f0ff] flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  SELECTED
                </div>
              )}

              {/* Shortcut Tag */}
              {route.hasShortcut && (
                <div className="absolute -top-2.5 right-2 bg-amber-400 text-slate-950 text-[8px] font-mono font-black uppercase px-1.5 py-0.5 rounded-full shadow-[0_0_10px_#f59e0b] flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" />
                  SHORTCUT
                </div>
              )}

              {/* Direction Arrow & Desktop Key Prompt */}
              <div className="flex items-center justify-between w-full mb-1">
                <div className={`p-1.5 rounded-xl border ${theme.border} ${theme.bg} ${theme.text}`}>
                  {getDirectionIcon(route.direction)}
                </div>
                <span className="text-[10px] sm:text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900/90 text-slate-300 border border-slate-700">
                  {getDirectionKeyPrompt(route.direction)}
                </span>
              </div>

              {/* Route Name & Direction */}
              <div className="w-full text-left mt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-ui font-black uppercase tracking-wider text-white truncate">
                    {route.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className={`text-[8px] sm:text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded border ${getDifficultyBadgeColor(
                      route.difficulty
                    )}`}
                  >
                    {route.difficulty}
                  </span>
                  {route.boostPadCount > 0 && (
                    <span className="text-[8px] sm:text-[9px] font-mono text-cyan-400 flex items-center gap-0.5">
                      <Zap className="w-2.5 h-2.5" />
                      {route.boostPadCount}
                    </span>
                  )}
                  {route.obstacleCount > 0 && (
                    <span className="text-[8px] sm:text-[9px] font-mono text-rose-400 flex items-center gap-0.5">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      {route.obstacleCount}
                    </span>
                  )}
                </div>
              </div>

              {/* Description preview */}
              <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1 line-clamp-1 w-full text-left font-mono">
                {route.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
