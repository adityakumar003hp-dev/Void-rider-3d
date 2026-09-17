import React, { useState } from 'react';
import {
  Layers,
  X,
  Play,
  Timer,
  Radio,
  Skull,
  Crosshair,
  Compass,
  ChevronRight,
} from 'lucide-react';
import { GameMode, TrackId, AIDifficulty } from '../types';
import { sound } from '../game/audio';

export interface GameModeConfig {
  mode: GameMode;
  trackId: TrackId;
  laps: number;
  difficulty: AIDifficulty;
  botCount: number;
}

interface GameModeSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode?: (mode: GameMode) => void;
  onStartConfiguredRace?: (config: GameModeConfig) => void;
}

interface ProtocolDef {
  id: GameMode;
  title: string;
  subtitle: string;
  desc: string;
  badge: string;
  badgeColor: string;
  icon: any;
  defaultBots: number;
}

const PROTOCOLS: ProtocolDef[] = [
  {
    id: 'GRAND_PRIX',
    title: 'Circuit Championship',
    subtitle: 'Classic High-Speed Grand Prix',
    desc: 'Compete against a full 6-ship grid across futuristic orbital tracks. Claim 1st place to earn maximum credits and championship XP.',
    badge: 'CORE MODE',
    badgeColor: 'border-cyan-500/50 bg-cyan-950/60 text-cyan-300',
    icon: Play,
    defaultBots: 5,
  },
  {
    id: 'TIME_TRIAL',
    title: 'Time Trial',
    subtitle: 'Solo Lap Attack & Ghost Splits',
    desc: 'Solo speedrun against the timer. Refine your apex lines, drift arcs, and optimize boost pad routes with real-time personal best delta...',
    badge: 'SPEEDRUN',
    badgeColor: 'border-blue-500/50 bg-blue-950/60 text-blue-300',
    icon: Timer,
    defaultBots: 0,
  },
  {
    id: 'SURVIVAL',
    title: 'Void Survival',
    subtitle: 'Endless Hazard Gauntlet',
    desc: 'Dodge escalating waves of high-density asteroid swarms, electrified energy barriers, and space mines. Shield cores deplete...',
    badge: 'HIGH RISK',
    badgeColor: 'border-rose-500/50 bg-rose-950/60 text-rose-300',
    icon: Radio,
    defaultBots: 3,
  },
  {
    id: 'ELIMINATOR',
    title: 'Elimination',
    subtitle: 'Last Place Vaporization',
    desc: 'Every 25 seconds, the racer in last place is vaporized by track laser defenses! Fight relentlessly for position to be the final...',
    badge: 'KNOCKOUT',
    badgeColor: 'border-red-500/50 bg-red-950/60 text-red-300',
    icon: Skull,
    defaultBots: 5,
  },
  {
    id: 'DUEL',
    title: '1v1 Ace Duel',
    subtitle: 'Head-to-Head Dogfight Race',
    desc: 'Challenge a legendary rival ace pilot in a fierce two-ship clash. Superior drafting, weaponized power-ups, and cornering mastery...',
    badge: 'RIVAL CLASH',
    badgeColor: 'border-purple-500/50 bg-purple-950/60 text-purple-300',
    icon: Crosshair,
    defaultBots: 1,
  },
  {
    id: 'FREE_RIDE',
    title: 'Free Cruise',
    subtitle: 'Zen Exploration',
    desc: 'Explore interstellar tracks freely with no time limits, no rival collisions, and infinite boost regeneration. Discover hidden...',
    badge: 'EXPLORATION',
    badgeColor: 'border-emerald-500/50 bg-emerald-950/60 text-emerald-300',
    icon: Compass,
    defaultBots: 0,
  },
];

interface SectorDef {
  id: TrackId;
  name: string;
  subtitle: string;
  difficulty: 'STANDARD' | 'EXPERT';
}

const SECTORS: SectorDef[] = [
  {
    id: 'circuit_alpha',
    name: 'Neon Orbit',
    subtitle: 'Ringed Gas Giant & Orbital Spire',
    difficulty: 'STANDARD',
  },
  {
    id: 'asteroid_run',
    name: 'Asteroid Run',
    subtitle: 'Dense Hazard Belt & Ore Mines',
    difficulty: 'EXPERT',
  },
  {
    id: 'void_rift',
    name: 'Void Rift',
    subtitle: 'Dimensional Abyss & Singularity',
    difficulty: 'EXPERT',
  },
  {
    id: 'cosmic_ring',
    name: 'Cosmic Ring',
    subtitle: 'Pulsar Megastructure & Solar Arcs',
    difficulty: 'STANDARD',
  },
  {
    id: 'quantum_highway',
    name: 'Quantum Highway',
    subtitle: 'Hyper-Tunnel & Energy Laser Barriers',
    difficulty: 'EXPERT',
  },
  {
    id: 'circuit_alpha',
    name: 'Circuit Alpha (Neon Orbit)',
    subtitle: 'Void Valley & Ion Chasm',
    difficulty: 'STANDARD',
  },
];

export const GameModeSelectModal: React.FC<GameModeSelectModalProps> = ({
  isOpen,
  onClose,
  onSelectMode,
  onStartConfiguredRace,
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('GRAND_PRIX');
  const [selectedSector, setSelectedSector] = useState<TrackId>('circuit_alpha');
  const [lapCount, setLapCount] = useState<number>(3);
  const [difficulty, setDifficulty] = useState<AIDifficulty>('STANDARD');

  if (!isOpen) return null;

  const activeDef = PROTOCOLS.find(p => p.id === selectedMode) || PROTOCOLS[0];

  const handleLaunch = () => {
    sound.playMenuClick();
    if (onStartConfiguredRace) {
      onStartConfiguredRace({
        mode: selectedMode,
        trackId: selectedSector,
        laps: selectedMode === 'SURVIVAL' ? 99 : lapCount,
        difficulty,
        botCount: activeDef.defaultBots,
      });
    } else if (onSelectMode) {
      onSelectMode(selectedMode);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-xl bg-[#060c18]/95 border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-[0_0_40px_rgba(0,240,255,0.15)] flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-cyan-500/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/70 border border-cyan-400/60 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.25)] shrink-0">
              <Play className="w-5 h-5 fill-cyan-400/20" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-ui font-black uppercase tracking-wider text-white">
                SELECT FLIGHT MISSION PROTOCOL
              </h2>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Configure mission mode, orbital sector, and competitive parameters.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
              SYSTEM READY
            </div>
            <button
              onClick={() => {
                sound.playMenuClick();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Available Game Modes Header */}
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mt-4 mb-2.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>AVAILABLE GAME MODES (6)</span>
        </div>

        {/* 6 Mode Cards */}
        <div className="space-y-2 mb-4">
          {PROTOCOLS.map(proto => {
            const Icon = proto.icon;
            const isSelected = selectedMode === proto.id;

            return (
              <div
                key={proto.id}
                onClick={() => {
                  sound.playMenuClick();
                  setSelectedMode(proto.id);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#08172c] border-cyan-400 shadow-[0_0_18px_rgba(0,240,255,0.25)]'
                    : 'bg-[#060e1b]/80 border-slate-800/90 hover:border-slate-700 hover:bg-[#081222]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-cyan-950 border border-cyan-400 text-cyan-300'
                          : 'bg-slate-900 border border-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-ui font-black uppercase tracking-wider text-white">
                        {proto.title}
                      </h3>
                      <div className="text-[11px] font-mono text-slate-400 tracking-wider">
                        {proto.subtitle}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed mt-1 line-clamp-2">
                        {proto.desc}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap border shrink-0 ${proto.badgeColor}`}
                  >
                    {proto.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Protocol Preview Card */}
        <div className="p-3.5 rounded-2xl bg-[#081426] border border-cyan-500/40 text-left mb-4 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
          <div className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider uppercase mb-1">
            ACTIVE PROTOCOL
          </div>
          <div className="text-sm font-ui font-black uppercase text-white tracking-wider">
            {activeDef.title}{' '}
            <span className="text-xs font-mono text-slate-400 lowercase tracking-normal">
              ({activeDef.subtitle})
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mt-1">
            {activeDef.desc}
          </p>
        </div>

        {/* Circuit Location Selector */}
        <div className="mb-4">
          <div className="text-[11px] font-mono font-bold text-cyan-400 tracking-wider uppercase mb-2 text-left">
            CIRCUIT LOCATION (7 SECTORS)
          </div>

          <div className="grid grid-cols-2 gap-2">
            {SECTORS.map((sector, idx) => {
              const isSelected = selectedSector === sector.id && (idx === 0 || selectedSector !== 'circuit_alpha');

              return (
                <button
                  key={`${sector.id}_${idx}`}
                  onClick={() => {
                    sound.playMenuClick();
                    setSelectedSector(sector.id);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#091a32] border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                      : 'bg-[#060e1b] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-ui font-black uppercase tracking-wider text-white leading-tight">
                    {sector.name}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                    {sector.subtitle} &bull;{' '}
                    <span className="text-cyan-400/80 font-bold">{sector.difficulty}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lap Count & AI Difficulty Row */}
        <div className="grid grid-cols-2 gap-4 mb-5 text-left">
          {/* Lap Count */}
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              LAP COUNT
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 5].map(l => (
                <button
                  key={l}
                  onClick={() => {
                    sound.playMenuClick();
                    setLapCount(l);
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    lapCount === l
                      ? 'bg-cyan-400 text-slate-950 shadow-[0_0_10px_#00f0ff]'
                      : 'bg-[#060e1b] border border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* AI Difficulty */}
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              AI DIFFICULTY
            </div>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'RECRUIT', label: 'REC' },
                { id: 'STANDARD', label: 'STA' },
                { id: 'ACE', label: 'ACE' },
                { id: 'ELITE', label: 'ELI' },
              ].map(diff => (
                <button
                  key={diff.id}
                  onClick={() => {
                    sound.playMenuClick();
                    setDifficulty(diff.id as AIDifficulty);
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    difficulty === diff.id
                      ? 'bg-fuchsia-500 text-white shadow-[0_0_10px_#d946ef]'
                      : 'bg-[#060e1b] border border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              sound.playMenuClick();
              onClose();
            }}
            className="py-2.5 px-6 rounded-xl bg-[#060e1b] border border-slate-700 hover:border-slate-500 text-slate-300 font-ui font-black text-xs uppercase tracking-wider transition-all"
          >
            CANCEL
          </button>

          <button
            onClick={handleLaunch}
            className="flex-1 py-2.5 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-600 to-fuchsia-500 hover:opacity-95 active:scale-[0.98] text-slate-950 font-ui font-black text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
          >
            <span>ENGAGE HYPERDRIVE</span>
            <ChevronRight className="w-4 h-4 text-slate-950 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
