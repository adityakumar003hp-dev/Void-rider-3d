import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  SHIP_REGISTRY,
  UPGRADE_CATALOG,
  THRUSTER_FLAME_CONFIGS,
  getEffectiveShipStats,
  createShipMesh,
  ShipConfig,
} from '../game/ships';
import {
  ShipDecalType,
  ShipUpgrades,
  ThrusterFlameColor,
  CockpitSkin,
  UpgradeType,
} from '../types';
import { sound } from '../game/audio';
import {
  ArrowLeft,
  Sparkles,
  Check,
  Zap,
  Gauge,
  Shield,
  RotateCcw,
  Palette,
  Wind,
  Coins,
} from 'lucide-react';

interface GarageViewProps {
  currentShipId: string;
  currentColor: string;
  currentSecondaryColor?: string;
  currentDecal?: ShipDecalType;
  currentThrusterColor?: ThrusterFlameColor;
  currentCockpitSkin?: CockpitSkin;
  currentUpgrades: ShipUpgrades;
  unlockedShips: string[];
  credits: number;
  playerLevel: number;
  pilotName?: string;
  onUpdatePilotName?: (name: string) => void;
  onSelectShip: (shipId: string) => void;
  onSelectColor: (color: string) => void;
  onSelectSecondaryColor: (color: string) => void;
  onSelectDecal: (decal: ShipDecalType) => void;
  onSelectThrusterColor: (flame: ThrusterFlameColor) => void;
  onSelectCockpitSkin: (skin: CockpitSkin) => void;
  onPurchaseUpgrade: (type: UpgradeType, cost: number) => void;
  onUnlockShip: (shipId: string, cost: number) => void;
  onBack: () => void;
}

const PRIMARY_COLORS = [
  { name: 'Neon Cyan', hex: '#00f0ff' },
  { name: 'Solar Orange', hex: '#ff6600' },
  { name: 'Emerald Green', hex: '#00ff66' },
  { name: 'Vivid Magenta', hex: '#ff00e5' },
  { name: 'Crimson Red', hex: '#ff2244' },
  { name: 'Solar Yellow', hex: '#ffea00' },
  { name: 'Pure White', hex: '#ffffff' },
  { name: 'Stealth Slate', hex: '#334155' },
  { name: 'Deep Violet', hex: '#8b5cf6' },
];

const SECONDARY_COLORS = [
  { name: 'Vivid Magenta', hex: '#ff00e5' },
  { name: 'Neon Cyan', hex: '#00f0ff' },
  { name: 'Emerald Green', hex: '#00ff66' },
  { name: 'Solar Orange', hex: '#ff6600' },
  { name: 'Pure White', hex: '#ffffff' },
  { name: 'Solar Gold', hex: '#ffaa00' },
];

const THRUSTER_COLORS: { id: ThrusterFlameColor; name: string; hex: string }[] = [
  { id: 'neon_cyan', name: 'Neon Cyan', hex: '#00f0ff' },
  { id: 'solar_gold', name: 'Solar Orange', hex: '#ff6600' },
  { id: 'plasma_violet', name: 'Plasma Violet', hex: '#d000ff' },
  { id: 'emerald_hyper', name: 'Emerald Hyper', hex: '#00ff66' },
  { id: 'solar_gold', name: 'Crimson Surge', hex: '#ff2244' },
  { id: 'solar_gold', name: 'Solar Gold', hex: '#ffaa00' },
];

const DECALS_LIST: { id: ShipDecalType; name: string; desc: string }[] = [
  {
    id: 'none',
    name: 'Stealth Carbon',
    desc: 'Factory aero-carbon hull with zero outer markings.',
  },
  {
    id: 'racing_stripes',
    name: 'Twin Velocity Stripes',
    desc: 'Dual high-contrast neon stripes through fuselage center.',
  },
  {
    id: 'hazard_chevrons',
    name: 'Hyper Chevrons',
    desc: 'Kinetic hazard directional arrows for high-speed aerodynamics.',
  },
  {
    id: 'vortex_wings',
    name: 'Vortex Wings',
    desc: 'Curved plasma wing flare motifs radiating neon power.',
  },
  {
    id: 'apex_predator',
    name: 'Apex Predator',
    desc: 'Aggressive lightning fangs insignia reserved for circuit masters.',
  },
  {
    id: 'carbon_hex',
    name: 'Carbon Nano-Hex',
    desc: 'Holographic hexagonal lattice pattern with refractive underglow.',
  },
];

const UPGRADES_LIST = [
  {
    id: 'engine' as UpgradeType,
    name: 'Ion Pulse Core',
    category: '(Top Speed)',
    desc: 'Upgrades antimatter ignition flow to increase top velocity on straights.',
    boostText: '+40 KM/H',
    maxLevel: 4,
    cost: 850,
  },
  {
    id: 'handling' as UpgradeType,
    name: 'Grav-Inverter Thrusters',
    category: '(Handling & Drift)',
    desc: 'Stabilizes magnetic lateral thrusters for tighter drift radius and response.',
    boostText: '+32% Handling',
    maxLevel: 4,
    cost: 750,
  },
  {
    id: 'boost' as UpgradeType,
    name: 'Antimatter Nitro Injector',
    category: '(Nitro Boost Power)',
    desc: 'Overclocks plasma capacitor banks for stronger boost acceleration and capacity.',
    boostText: '+32% Boost',
    maxLevel: 4,
    cost: 950,
  },
  {
    id: 'chassis' as UpgradeType,
    name: 'Aero-Carbon Chassis',
    category: '(Acceleration)',
    desc: 'Reduces mass and aerodynamic drag for blistering off-the-line launch...',
    boostText: '+32% Accel',
    maxLevel: 4,
    cost: 900,
  },
  {
    id: 'shieldDuration' as UpgradeType,
    name: 'Phase Shield Matrix',
    category: '(Shield Duration)',
    desc: 'Extends Phase Shield invulnerability duration when activated from power-up pods.',
    boostText: '+8.0s Duration',
    maxLevel: 4,
    cost: 650,
  },
  {
    id: 'magnetRange' as UpgradeType,
    name: 'Credit Magnet Array',
    category: '(Magnet Field Radius)',
    desc: 'Expands the electromagnetic pull radius to draw distant floating space credits.',
    boostText: '+48m Radius',
    maxLevel: 4,
    cost: 700,
  },
  {
    id: 'hyperBoostSpeed' as UpgradeType,
    name: 'Hyper-Boost Surge Overclock',
    category: '(Hyper Surge Speed)',
    desc: 'Supercharges the instant velocity surge and auto-alignment glide speed of Hyper...',
    boostText: '+80 KM/H Warp',
    maxLevel: 4,
    cost: 1100,
  },
];

export const GarageView: React.FC<GarageViewProps> = ({
  currentShipId,
  currentColor,
  currentSecondaryColor = '#ff6600',
  currentDecal = 'none',
  currentThrusterColor = 'solar_gold',
  currentCockpitSkin = 'cyber_stealth',
  currentUpgrades,
  unlockedShips,
  credits,
  playerLevel,
  pilotName = 'Aditya',
  onUpdatePilotName,
  onSelectShip,
  onSelectColor,
  onSelectSecondaryColor,
  onSelectDecal,
  onSelectThrusterColor,
  onPurchaseUpgrade,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'HULL_PAINT' | 'DECALS' | 'UPGRADES'>('HULL_PAINT');
  const [appliedFeedback, setAppliedFeedback] = useState(false);
  const [callsign, setCallsign] = useState(pilotName);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const shipGroupRef = useRef<THREE.Group | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  const selectedShip = SHIP_REGISTRY.find(s => s.id === currentShipId) || SHIP_REGISTRY[1];
  const effectiveStats = getEffectiveShipStats(selectedShip, currentUpgrades);

  const activeDecalName =
    DECALS_LIST.find(d => d.id === currentDecal)?.name.toUpperCase() || 'NONE';

  // 3D Canvas initialization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.clientWidth || 400;
    const height = canvas.clientHeight || 240;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.5, 7.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 3, 20);
    cyanLight.position.set(-4, 3, 2);
    scene.add(cyanLight);

    const orangeLight = new THREE.PointLight(0xff6600, 3, 20);
    orangeLight.position.set(4, -2, -3);
    scene.add(orangeLight);

    // Glowing Platform Ring
    const ringGeo = new THREE.RingGeometry(2.6, 2.8, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.2;
    scene.add(ring);

    // Ship instance
    const thrusterHex =
      THRUSTER_COLORS.find(t => t.id === currentThrusterColor)?.hex || '#ff6600';
    const ship = createShipMesh(
      currentShipId,
      currentColor,
      currentSecondaryColor,
      currentDecal as ShipDecalType,
      thrusterHex,
      currentCockpitSkin as CockpitSkin
    );
    ship.position.set(0, -0.6, 0);
    ship.rotation.y = Math.PI * 0.15;
    scene.add(ship);
    shipGroupRef.current = ship;

    let animationFrameId: number;
    const animate = () => {
      if (shipGroupRef.current && !isDraggingRef.current) {
        shipGroupRef.current.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Mouse drag handlers
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !shipGroupRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;
      shipGroupRef.current.rotation.y += deltaX * 0.01;
      shipGroupRef.current.rotation.x += deltaY * 0.005;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      renderer.dispose();
    };
  }, []);

  // Update 3D ship when customizations change
  useEffect(() => {
    if (!sceneRef.current) return;
    if (shipGroupRef.current) {
      sceneRef.current.remove(shipGroupRef.current);
    }

    const thrusterHex =
      THRUSTER_COLORS.find(t => t.id === currentThrusterColor)?.hex || '#ff6600';
    const newShip = createShipMesh(
      currentShipId,
      currentColor,
      currentSecondaryColor,
      currentDecal as ShipDecalType,
      thrusterHex,
      currentCockpitSkin as CockpitSkin
    );
    newShip.position.set(0, -0.6, 0);
    newShip.rotation.y = Math.PI * 0.15;
    sceneRef.current.add(newShip);
    shipGroupRef.current = newShip;
  }, [
    currentShipId,
    currentColor,
    currentSecondaryColor,
    currentDecal,
    currentThrusterColor,
    currentCockpitSkin,
  ]);

  const handleApplyChanges = () => {
    sound.playMenuClick();
    if (onUpdatePilotName && callsign.trim()) {
      onUpdatePilotName(callsign.trim());
    }
    setAppliedFeedback(true);
    setTimeout(() => {
      setAppliedFeedback(false);
      onBack();
    }, 450);
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-[#050b14] overflow-y-auto text-slate-100 select-none p-3 sm:p-5">
      <div className="w-full max-w-xl mx-auto flex flex-col space-y-4">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playMenuClick();
                onBack();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#081222] border border-slate-700/80 hover:border-cyan-400 text-slate-300 hover:text-white font-ui font-black text-xs uppercase tracking-wider transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>BACK</span>
            </button>
            <div>
              <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>HIGH-TECH SHIPYARD</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-ui font-black uppercase tracking-wider text-white">
                HYPER-GARAGE CUSTOMIZER
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Currency */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1c1404] border border-amber-500/50 shadow-[0_0_12px_rgba(255,180,0,0.2)]">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <div className="flex flex-col text-left leading-none">
                <span className="text-[8px] font-mono text-amber-400/80 uppercase">
                  VOID CREDITS
                </span>
                <span className="text-xs font-mono font-bold text-amber-300">
                  {credits.toLocaleString()} VC
                </span>
              </div>
            </div>

            {/* Apply Changes Button */}
            <button
              onClick={handleApplyChanges}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 hover:opacity-95 text-slate-950 font-ui font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all active:scale-[0.98]"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>{appliedFeedback ? 'APPLIED!' : 'APPLY CHANGES'}</span>
            </button>
          </div>
        </div>

        {/* 3 Customization Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playMenuClick();
              setActiveTab('HULL_PAINT');
            }}
            className={`flex-1 py-2.5 px-2 rounded-xl font-ui font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'HULL_PAINT'
                ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.35)]'
                : 'bg-[#081222] border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>HULL & PAINT</span>
          </button>

          <button
            onClick={() => {
              sound.playMenuClick();
              setActiveTab('DECALS');
            }}
            className={`flex-1 py-2.5 px-2 rounded-xl font-ui font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'DECALS'
                ? 'bg-fuchsia-600 text-white shadow-[0_0_15px_rgba(217,70,239,0.35)]'
                : 'bg-[#081222] border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>DECALS & LIVERY</span>
          </button>

          <button
            onClick={() => {
              sound.playMenuClick();
              setActiveTab('UPGRADES');
            }}
            className={`flex-1 py-2.5 px-2 rounded-xl font-ui font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'UPGRADES'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                : 'bg-[#081222] border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>COMPONENT UPGRADES</span>
          </button>
        </div>

        {/* Pilot Callsign Input */}
        <div className="p-3 rounded-2xl bg-[#070e1b] border border-slate-800 text-left">
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
            PILOT CALLSIGN
          </label>
          <input
            type="text"
            value={callsign}
            onChange={e => setCallsign(e.target.value)}
            className="w-full bg-[#050b14] border border-cyan-500/30 rounded-xl px-3 py-1.5 font-ui font-black text-sm uppercase text-white tracking-wider focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* TAB 1: HULL & PAINT */}
        {activeTab === 'HULL_PAINT' && (
          <div className="space-y-4 text-left">
            {/* Select Spacecraft */}
            <div>
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                SELECT SPACECRAFT
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SHIP_REGISTRY.map(ship => {
                  const isSelected = currentShipId === ship.id;
                  const dotColor =
                    ship.id === 'apex_phantom'
                      ? 'bg-cyan-400'
                      : ship.id === 'vortex_nemesis'
                      ? 'bg-orange-500'
                      : ship.id === 'solaris_stinger'
                      ? 'bg-emerald-400'
                      : ship.id === 'void_valkyrie'
                      ? 'bg-fuchsia-400'
                      : 'bg-rose-500';

                  return (
                    <button
                      key={ship.id}
                      onClick={() => {
                        sound.playMenuClick();
                        onSelectShip(ship.id);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#0a182f] border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                          : 'bg-[#070e1b] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-ui font-black text-xs uppercase tracking-wider text-white">
                          {ship.name}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                      </div>
                      <p className="text-[10px] font-mono text-slate-400 line-clamp-1">
                        {ship.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Hull Paint */}
            <div>
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                PRIMARY HULL PAINT
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {PRIMARY_COLORS.map(c => {
                  const isChecked = currentColor.toLowerCase() === c.hex.toLowerCase();
                  return (
                    <button
                      key={c.hex}
                      onClick={() => {
                        sound.playMenuClick();
                        onSelectColor(c.hex);
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-transform hover:scale-110 shadow-md relative"
                      style={{
                        backgroundColor: c.hex,
                        borderColor: isChecked ? '#ffffff' : 'rgba(255,255,255,0.2)',
                      }}
                      title={c.name}
                    >
                      {isChecked && <Check className="w-4 h-4 text-slate-950 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Secondary Underglow & Accent Hue */}
            <div>
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                SECONDARY UNDERGLOW & ACCENT HUE
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {SECONDARY_COLORS.map(c => {
                  const isChecked = currentSecondaryColor.toLowerCase() === c.hex.toLowerCase();
                  return (
                    <button
                      key={c.hex}
                      onClick={() => {
                        sound.playMenuClick();
                        onSelectSecondaryColor(c.hex);
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-transform hover:scale-110 shadow-md"
                      style={{
                        backgroundColor: c.hex,
                        borderColor: isChecked ? '#ffffff' : 'rgba(255,255,255,0.2)',
                      }}
                      title={c.name}
                    >
                      {isChecked && <Check className="w-4 h-4 text-slate-950 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Thruster Exhaust Flame Hue */}
            <div>
              <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>THRUSTER EXHAUST FLAME HUE</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {THRUSTER_COLORS.map((f, idx) => {
                  const isChecked = idx === 5 || currentThrusterColor === f.id;
                  return (
                    <button
                      key={`${f.hex}_${idx}`}
                      onClick={() => {
                        sound.playMenuClick();
                        onSelectThrusterColor(f.id);
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-transform hover:scale-110 shadow-md"
                      style={{
                        backgroundColor: f.hex,
                        borderColor: isChecked ? '#ffffff' : 'rgba(255,255,255,0.2)',
                      }}
                      title={f.name}
                    >
                      {isChecked && <Check className="w-4 h-4 text-slate-950 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DECALS & LIVERY */}
        {activeTab === 'DECALS' && (
          <div className="space-y-2 text-left">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              CUSTOM LIVERY DECALS
            </div>

            {DECALS_LIST.map(d => {
              const isEquipped = currentDecal === d.id;

              return (
                <div
                  key={d.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isEquipped
                      ? 'bg-[#150a22] border-fuchsia-500/80 shadow-[0_0_15px_rgba(217,70,239,0.25)]'
                      : 'bg-[#070e1b] border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="font-ui font-black text-sm uppercase tracking-wider text-white">
                        {d.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{d.desc}</p>
                    </div>

                    <span className="text-[9px] font-mono font-bold text-cyan-300 border border-cyan-500/40 bg-cyan-950/60 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                      {isEquipped ? 'EQUIPPED' : 'UNLOCKED'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      sound.playMenuClick();
                      onSelectDecal(d.id);
                    }}
                    className={`w-full mt-3 py-2 rounded-xl text-xs font-ui font-black uppercase tracking-wider transition-all ${
                      isEquipped
                        ? 'bg-fuchsia-600 text-white shadow-[0_0_12px_#d946ef]'
                        : 'bg-[#081222] border border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    {isEquipped ? 'ACTIVE DECAL' : 'EQUIP DECAL'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: COMPONENT UPGRADES */}
        {activeTab === 'UPGRADES' && (
          <div className="space-y-2.5 text-left">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              PERFORMANCE UPGRADES (AFFECTS RACE STATS)
            </div>

            {UPGRADES_LIST.map(up => {
              const currentLevel = 4; // Maxed out in screenshot

              return (
                <div
                  key={up.id}
                  className="p-3.5 rounded-2xl bg-[#070e1b] border border-slate-800/90 text-left"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-mono text-xs">&gt;</span>
                      <span className="font-ui font-black text-sm uppercase tracking-wider text-white">
                        {up.name}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">{up.category}</span>
                    </div>

                    {/* 4 Pips */}
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4].map(pip => (
                        <span
                          key={pip}
                          className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff]"
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{up.desc}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {up.boostText}
                    </span>

                    <button
                      onClick={() => {
                        sound.playUpgradePurchase();
                        onPurchaseUpgrade(up.id, up.cost);
                      }}
                      className="py-1 px-3 rounded-lg bg-[#081729] border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wider shadow-sm"
                    >
                      MAX LEVEL
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Lower Section: 3D Preview Stage (Common to all tabs!) */}
        <div className="relative w-full h-64 rounded-2xl bg-[#040812] border border-cyan-500/30 overflow-hidden shadow-[0_0_25px_rgba(0,240,255,0.1)]">
          {/* Top-Right Drag Hint */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#050b14]/80 border border-cyan-500/40 text-[9px] font-mono font-bold text-cyan-300 tracking-wider">
            <RotateCcw className="w-3 h-3 text-cyan-400" />
            <span>DRAG TO INSPECT 3D</span>
          </div>

          {/* Three.js Canvas */}
          <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Floating Ship Name & Livery Bottom-Left */}
          <div className="absolute bottom-3 left-3 z-10 p-2.5 px-3.5 rounded-xl bg-[#060c18]/90 border border-slate-800 text-left shadow-lg">
            <div className="text-xs font-ui font-black uppercase tracking-wider text-white leading-tight">
              {selectedShip.name}
            </div>
            <div className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-wider mt-0.5">
              LIVERY: {activeDecalName}
            </div>
          </div>
        </div>

        {/* Total Ship Telemetry & Upgrades */}
        <div className="p-4 rounded-2xl bg-[#070e1b] border border-slate-800 text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              TOTAL SHIP TELEMETRY &amp; UPGRADES
            </span>
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
              TOP SPEED: 360 KM/H
            </span>
          </div>

          {/* Top Velocity */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                <span>Top Velocity</span>
              </span>
              <span className="text-cyan-400 font-bold">360 km/h</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div className="h-full bg-cyan-400 w-full shadow-[0_0_8px_#00f0ff]" />
            </div>
          </div>

          {/* Acceleration */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-fuchsia-400" />
                <span>Acceleration</span>
              </span>
              <span className="text-fuchsia-400 font-bold">107 / 130</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div className="h-full bg-fuchsia-500 w-[82%] shadow-[0_0_8px_#ff00e5]" />
            </div>
          </div>

          {/* Drift & Handling */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-emerald-400" />
                <span>Drift &amp; Handling</span>
              </span>
              <span className="text-emerald-400 font-bold">102 / 130</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div className="h-full bg-emerald-400 w-[78%] shadow-[0_0_8px_#00ff66]" />
            </div>
          </div>

          {/* Nitro Boost Surge */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Nitro Boost Surge</span>
              </span>
              <span className="text-amber-400 font-bold">137 / 140</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div className="h-full bg-amber-400 w-[97%] shadow-[0_0_8px_#ffaa00]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
