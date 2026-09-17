export type GameState =
  | 'MENU'
  | 'GARAGE'
  | 'UPGRADES'
  | 'LOBBY'
  | 'RACE'
  | 'RESULTS'
  | 'GAME_OVER'
  | 'AI_SELECT'
  | 'MISSIONS'
  | 'LEADERBOARDS'
  | 'PROFILE'
  | 'MODE_SELECT'
  | 'STORY'
  | 'SPACE_HUB';

export type GameMode =
  | 'STANDARD'
  | 'GRAND_PRIX'
  | 'TIME_TRIAL'
  | 'SURVIVAL'
  | 'ELIMINATION'
  | 'ELIMINATOR'
  | 'ENDURANCE'
  | 'DUEL'
  | 'CHALLENGE'
  | 'FREE_RIDE';

export type RoomStatus = 'LOBBY' | 'COUNTDOWN' | 'RACING' | 'FINISHED';

export type TrackId =
  | 'neon_orbit'
  | 'asteroid_run'
  | 'void_rift'
  | 'cosmic_ring'
  | 'quantum_highway'
  | 'circuit_alpha'
  | 'nebula_rift'
  | 'wormhole_express'
  | 'solar_storm'
  | 'gravity_free'
  | 'plasma_storm'
  | 'skyline_rush'
  | 'collapsing_track'
  | 'ring_runner'
  | 'hyperspace_sprint';

export type AIDifficulty = 'RECRUIT' | 'STANDARD' | 'VETERAN' | 'ACE' | 'ELITE';
export type AIPersonality = 'AGGRESSIVE' | 'DEFENSIVE' | 'BALANCED' | 'RISK_TAKER' | 'TECHNICAL';

export type CameraMode = 'CHASE_NEAR' | 'CHASE_FAR' | 'COCKPIT';
export type GraphicsQuality = 'LOW' | 'MEDIUM' | 'HIGH';

export interface AIRaceConfig {
  trackId: TrackId;
  difficulty: AIDifficulty;
  laps: number;
  botCount: number;
  mode?: GameMode;
}

export type { EnergyBarrier } from './game/trackData';

export type ShipDecalType =
  | 'none'
  | 'racing_stripes'
  | 'hazard_chevrons'
  | 'vortex_wings'
  | 'apex_predator'
  | 'carbon_hex';

export type ThrusterFlameColor =
  | 'neon_cyan'
  | 'plasma_violet'
  | 'solar_gold'
  | 'emerald_hyper';

export type CockpitSkin =
  | 'cyber_stealth'
  | 'titanium_gold'
  | 'neon_matrix'
  | 'void_shadow';

// 9 Collectible Power-Ups
export type PowerUpType =
  | 'NITRO_BOOST'
  | 'ENERGY_SHIELD'
  | 'REPAIR_CORE'
  | 'MAGNET_BOOST'
  | 'EMP_PULSE'
  | 'TIME_WARP'
  | 'GRAVITY_BURST'
  | 'DECOY_SHIP'
  | 'TEMPORARY_SPEED_SURGE'
  | 'PHASE_SHIELD'   // backward-compatible alias
  | 'CREDIT_MAGNET'  // backward-compatible alias
  | 'HYPER_BOOST';   // backward-compatible alias

export interface ActivePowerUp {
  type: PowerUpType;
  remainingTime: number;
  totalDuration: number;
}

// Advanced Damage System
export interface ShipDamageZones {
  frontHull: number;    // 0 = pristine, 100 = critical breach
  rearEngine: number;   // 0 = pristine, 100 = offline
  leftWing: number;     // 0 = pristine, 100 = damaged aero
  rightWing: number;    // 0 = pristine, 100 = damaged aero
  shieldCore: number;   // 100 = full shield, 0 = depleted
}

export type DamageZone = 'frontHull' | 'rearEngine' | 'leftWing' | 'rightWing' | 'shieldCore';
export type DamageMode = 'CASUAL' | 'SIMULATION';

export interface ShipUpgrades {
  engine: number; // 0 to 4 (adds to topSpeed)
  handling: number; // 0 to 4 (adds to handling)
  boost: number; // 0 to 4 (adds to boostPower & capacity)
  chassis: number; // 0 to 4 (adds to acceleration & armor)
  shieldDuration?: number; // 0 to 4 (extends Phase Shield)
  magnetRange?: number; // 0 to 4 (extends Credit Magnet pull radius)
  hyperBoostSpeed?: number; // 0 to 4 (increases Hyper-Boost surge speed)
}

export type UpgradeType = keyof ShipUpgrades;

export interface RunStats {
  distance: number;
  creditsEarned?: number;
  creditsCollected: number;
  maxSpeed?: number;
  topSpeed?: number;
  timeElapsed?: number;
  survivalTime?: number;
  hitCount?: number;
  obstaclesAvoided?: number;
  reason?: string;
  milestone?: string;
  isNewBestDistance?: boolean;
}

export type DynamicTrackEventType =
  | 'ASTEROID_SWARM'
  | 'GRAVITY_SHIFT'
  | 'TEMPORARY_SHORTCUT'
  | 'INVERSION_ZONE';

export interface DynamicTrackEvent {
  id: string;
  type: DynamicTrackEventType;
  title: string;
  description: string;
  active: boolean;
  remainingSec: number;
  sectorStartT: number;
  sectorEndT: number;
  severity?: 'low' | 'medium' | 'high';
  gravityMode?: 'LOW_G' | 'HIGH_G';
  shortcutTargetT?: number;
}

export interface ShipConfig {
  id: string;
  name: string;
  description: string;
  color: string;
  topSpeed: number; // km/h representation
  acceleration: number;
  handling: number; // turning responsiveness
  boostPower: number;
  boostCapacity: number;
  creditPrice?: number;
  unlockLevel?: number;
}

export interface PlayerInput {
  throttle: number; // -1 to 1 (W/S or Up/Down)
  steer: number;    // -1 to 1 (A/D or Left/Right)
  boost: boolean;   // Space
  drift: boolean;   // Shift
  recover: boolean; // R
}

export interface PlayerRaceState {
  x: number;
  y: number;
  z: number;
  qx: number;
  qy: number;
  qz: number;
  qw: number;
  speed: number;
  boost: number;
  isBoosting: boolean;
  isDrifting: boolean;
  lap: number;
  currentCheckpoint: number;
  progressDistance: number;
  finishTime?: number;
  rank?: number;
}

export interface PlayerInfo {
  id: string;
  name: string;
  shipId: string;
  color: string;
  secondaryColor?: string;
  thrusterColor?: ThrusterFlameColor;
  cockpitSkin?: CockpitSkin;
  decal?: ShipDecalType;
  upgrades?: ShipUpgrades;
  isHost: boolean;
  isReady: boolean;
  isBot?: boolean;
  ping: number;
  raceState?: PlayerRaceState;
}

export interface RoomState {
  id?: string;
  code: string;
  name: string;
  hostId: string;
  status: RoomStatus;
  maxPlayers: number;
  laps: number;
  trackId?: TrackId;
  countdown: number;
  raceStartTime: number;
  players: Record<string, PlayerInfo>;
  results: RaceResult[];
}

export interface RaceResult {
  playerId: string;
  name?: string;
  playerName?: string;
  shipId: string;
  rank: number;
  finishTime?: number; // milliseconds
  totalTime?: number;
  bestLapTime: number;
  completed?: boolean;
}

// Network message types
export type ClientMessageType =
  | 'JOIN_ROOM'
  | 'CREATE_ROOM'
  | 'QUICK_MATCH'
  | 'SET_READY'
  | 'SET_TRACK'
  | 'START_RACE'
  | 'UPDATE_SHIP'
  | 'PLAYER_UPDATE'
  | 'ADD_BOT'
  | 'RESTART_RACE'
  | 'LEAVE_ROOM'
  | 'USE_POWERUP'
  | 'DAMAGE_EVENT'
  | 'PING';

export interface ClientMessage {
  type: ClientMessageType;
  roomId?: string;
  name?: string;
  shipId?: string;
  color?: string;
  secondaryColor?: string;
  decal?: ShipDecalType;
  upgrades?: ShipUpgrades;
  trackId?: TrackId;
  laps?: number;
  isReady?: boolean;
  raceState?: PlayerRaceState;
  powerUpType?: PowerUpType;
  damageZone?: DamageZone;
  damageAmount?: number;
  timestamp?: number;
}

export type ServerMessageType =
  | 'CONNECTED'
  | 'ROOM_JOINED'
  | 'ROOM_UPDATED'
  | 'COUNTDOWN_TICK'
  | 'RACE_STARTED'
  | 'RACE_STATE_SYNC'
  | 'POWERUP_EVENT'
  | 'PLAYER_FINISHED'
  | 'RACE_FINISHED'
  | 'ERROR'
  | 'PONG';

export interface ServerMessage {
  type: ServerMessageType;
  playerId?: string;
  room?: RoomState;
  players?: Record<string, PlayerInfo>;
  countdown?: number;
  results?: RaceResult[];
  message?: string;
  powerUpType?: PowerUpType;
  targetPlayerId?: string;
  timestamp?: number;
}

// Multiplayer Mode Settings
export type MultiplayerMode = 'QUICK_MATCH' | 'PRIVATE' | 'DUEL_1V1' | 'COMPETITIVE' | 'CASUAL';

export interface CustomRoomSettings {
  mode: MultiplayerMode;
  trackId: TrackId;
  laps: number;
  aiBots: boolean;
  collisionsEnabled: boolean;
  powerUpsEnabled: boolean;
  damageMode: DamageMode;
}

// Player Progression & Missions
export interface Mission {
  id: string;
  title: string;
  description: string;
  category: 'DAILY' | 'WEEKLY' | 'ACHIEVEMENT';
  rewardCredits: number;
  rewardXP: number;
  progress: number;
  target: number;
  completed: boolean;
  claimed: boolean;
  icon?: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: number;
  icon: string;
}

export interface PlayerProfile {
  callsign: string;
  avatarIcon: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  credits: number;
  faction: 'APEX_SYNDICATE' | 'VOID_VANGUARD' | 'QUANTUM_PULSE' | 'SOLAR_PHALANX';
  totalRaces: number;
  wins: number;
  podiums: number;
  cleanRaces: number;
  favoriteTrack: TrackId;
  bestTimes: Record<string, number>; // trackId -> time in ms
  survivalRecordSec: number;
  unlockedShips: string[];
  unlockedSkins: string[];
  unlockedDecals: string[];
  currentWinStreak: number;
  highestWinStreak: number;
  achievements: AchievementBadge[];
}

export interface MissionItem {
  id: string;
  title: string;
  description: string;
  rewardCredits: number;
  progress: number;
  target: number;
  claimed: boolean;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  rewardCredits: number;
  progress: number;
  target: number;
  unlocked: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  pilotName: string;
  shipName: string;
  trackId: TrackId;
  mode: GameMode;
  lapTime: number; // ms
  totalTime: number; // ms
  timestamp: number;
  isPlayer?: boolean;
}

export interface PlayerProgression {
  playerName: string;
  credits: number;
  level: number;
  xp: number;
  selectedShipId: string;
  primaryColor: string;
  secondaryColor: string;
  decal: ShipDecalType;
  thrusterColor: ThrusterFlameColor;
  cockpitSkin: CockpitSkin;
  upgrades: ShipUpgrades;
  unlockedShipIds: string[];
  dailyMissions: MissionItem[];
  achievements: AchievementItem[];
  leaderboards: LeaderboardEntry[];
  stats: {
    racesCompleted: number;
    racesWon: number;
    topSpeedReached: number;
    totalDriftSeconds: number;
    asteroidsAvoided: number;
  };
}

export type FactionId = 'apex_syndicate' | 'void_vanguard' | 'quantum_pulse' | 'solar_phalanx';

export interface FactionInfo {
  id: FactionId;
  name: string;
  motto: string;
  lore: string;
  color: string;
  icon: string;
  bonusText: string;
  championPilot: string;
}

export interface StoryMission {
  id: string;
  chapter: number;
  title: string;
  location: string;
  trackId: TrackId;
  mode: GameMode;
  targetLaps: number;
  rivalPilot: string;
  rivalFaction: FactionId;
  briefing: string;
  objective: string;
  rewardCredits: number;
  rewardXP: number;
  unlocked: boolean;
  completed: boolean;
}
