import * as THREE from 'three';
import { TrackId } from '../types';

/**
 * VOID-RIDER 3D — FUTURISTIC SPACE RACE ENVIRONMENT SYSTEM
 * Provides cinematic 360° environment surrounding the racing track:
 * - 3 Depth Layers: Close Range, Mid Range, Far Range
 * - 10 Distinct Track Themes with specific planetary, city, storm, and megastructure assets
 * - Living environmental animations: rotating rings, moving spacecraft, flying traffic,
 *   shooting stars, pulsing plasma towers, and dynamic atmospheric lighting.
 */

export interface EnvironmentThemeConfig {
  name: string;
  fogColor: number;
  fogDensity: number;
  ambientColor: number;
  ambientIntensity: number;
  primaryDirColor: number;
  primaryDirIntensity: number;
  secondaryDirColor: number;
  secondaryDirIntensity: number;
  skyTint: number;
  nebulaColors: number[];
}

export const THEME_CONFIGS: Record<string, EnvironmentThemeConfig> = {
  neon_orbit: {
    name: 'NEON CIRCUIT',
    fogColor: 0x050718,
    fogDensity: 0.0009,
    ambientColor: 0x141838,
    ambientIntensity: 1.4,
    primaryDirColor: 0x00f0ff,
    primaryDirIntensity: 2.2,
    secondaryDirColor: 0xff00aa,
    secondaryDirIntensity: 1.6,
    skyTint: 0x00f0ff,
    nebulaColors: [0x00f0ff, 0x8b5cf6, 0xec4899],
  },
  circuit_alpha: {
    name: 'NEON CIRCUIT',
    fogColor: 0x050718,
    fogDensity: 0.0009,
    ambientColor: 0x141838,
    ambientIntensity: 1.4,
    primaryDirColor: 0x00f0ff,
    primaryDirIntensity: 2.2,
    secondaryDirColor: 0xff00aa,
    secondaryDirIntensity: 1.6,
    skyTint: 0x00f0ff,
    nebulaColors: [0x00f0ff, 0x8b5cf6, 0xec4899],
  },
  asteroid_run: {
    name: 'ASTEROID RUN',
    fogColor: 0x0c0905,
    fogDensity: 0.0011,
    ambientColor: 0x241708,
    ambientIntensity: 1.3,
    primaryDirColor: 0xffaa00,
    primaryDirIntensity: 2.5,
    secondaryDirColor: 0x00e5ff,
    secondaryDirIntensity: 1.2,
    skyTint: 0xffaa00,
    nebulaColors: [0xff9900, 0xd97706, 0x06b6d4],
  },
  void_rift: {
    name: 'WORMHOLE EXPRESS',
    fogColor: 0x090314,
    fogDensity: 0.001,
    ambientColor: 0x1e0e33,
    ambientIntensity: 1.5,
    primaryDirColor: 0xc026d3,
    primaryDirIntensity: 2.4,
    secondaryDirColor: 0x00f0ff,
    secondaryDirIntensity: 1.8,
    skyTint: 0xc026d3,
    nebulaColors: [0xc026d3, 0x7c3aed, 0x00f0ff],
  },
  wormhole_express: {
    name: 'WORMHOLE EXPRESS',
    fogColor: 0x090314,
    fogDensity: 0.001,
    ambientColor: 0x1e0e33,
    ambientIntensity: 1.5,
    primaryDirColor: 0xc026d3,
    primaryDirIntensity: 2.4,
    secondaryDirColor: 0x00f0ff,
    secondaryDirIntensity: 1.8,
    skyTint: 0xc026d3,
    nebulaColors: [0xc026d3, 0x7c3aed, 0x00f0ff],
  },
  solar_storm: {
    name: 'SOLAR STORM',
    fogColor: 0x140702,
    fogDensity: 0.001,
    ambientColor: 0x3d1704,
    ambientIntensity: 1.8,
    primaryDirColor: 0xff5500,
    primaryDirIntensity: 3.5,
    secondaryDirColor: 0xffcc00,
    secondaryDirIntensity: 2.0,
    skyTint: 0xff6600,
    nebulaColors: [0xff3300, 0xff8800, 0xffd700],
  },
  gravity_free: {
    name: 'GRAVITY FREE',
    fogColor: 0x030612,
    fogDensity: 0.0007,
    ambientColor: 0x0f1b2b,
    ambientIntensity: 1.3,
    primaryDirColor: 0x38bdf8,
    primaryDirIntensity: 2.0,
    secondaryDirColor: 0xa855f7,
    secondaryDirIntensity: 1.4,
    skyTint: 0x38bdf8,
    nebulaColors: [0x38bdf8, 0x6366f1, 0xec4899],
  },
  plasma_storm: {
    name: 'PLASMA STORM',
    fogColor: 0x0a0418,
    fogDensity: 0.0012,
    ambientColor: 0x220e3a,
    ambientIntensity: 1.6,
    primaryDirColor: 0xa855f7,
    primaryDirIntensity: 2.8,
    secondaryDirColor: 0x00f5ff,
    secondaryDirIntensity: 2.2,
    skyTint: 0xa855f7,
    nebulaColors: [0x9333ea, 0x3b82f6, 0x06b6d4],
  },
  skyline_rush: {
    name: 'SKYLINE RUSH',
    fogColor: 0x040816,
    fogDensity: 0.0009,
    ambientColor: 0x111c38,
    ambientIntensity: 1.5,
    primaryDirColor: 0x00f0ff,
    primaryDirIntensity: 2.4,
    secondaryDirColor: 0xf43f5e,
    secondaryDirIntensity: 1.7,
    skyTint: 0x00f0ff,
    nebulaColors: [0x00f0ff, 0xec4899, 0x8b5cf6],
  },
  collapsing_track: {
    name: 'COLLAPSING TRACK',
    fogColor: 0x140505,
    fogDensity: 0.0011,
    ambientColor: 0x301010,
    ambientIntensity: 1.5,
    primaryDirColor: 0xff3b30,
    primaryDirIntensity: 2.6,
    secondaryDirColor: 0xff9500,
    secondaryDirIntensity: 1.8,
    skyTint: 0xff3b30,
    nebulaColors: [0xef4444, 0xf97316, 0x78350f],
  },
  cosmic_ring: {
    name: 'RING RUNNER',
    fogColor: 0x020a14,
    fogDensity: 0.0008,
    ambientColor: 0x0a2233,
    ambientIntensity: 1.4,
    primaryDirColor: 0x00ffcc,
    primaryDirIntensity: 2.4,
    secondaryDirColor: 0x38bdf8,
    secondaryDirIntensity: 1.5,
    skyTint: 0x00ffcc,
    nebulaColors: [0x00ffcc, 0x0284c7, 0x10b981],
  },
  ring_runner: {
    name: 'RING RUNNER',
    fogColor: 0x020a14,
    fogDensity: 0.0008,
    ambientColor: 0x0a2233,
    ambientIntensity: 1.4,
    primaryDirColor: 0x00ffcc,
    primaryDirIntensity: 2.4,
    secondaryDirColor: 0x38bdf8,
    secondaryDirIntensity: 1.5,
    skyTint: 0x00ffcc,
    nebulaColors: [0x00ffcc, 0x0284c7, 0x10b981],
  },
  quantum_highway: {
    name: 'HYPERSPACE SPRINT',
    fogColor: 0x0a001a,
    fogDensity: 0.0008,
    ambientColor: 0x220538,
    ambientIntensity: 1.6,
    primaryDirColor: 0xff007f,
    primaryDirIntensity: 2.6,
    secondaryDirColor: 0x00f0ff,
    secondaryDirIntensity: 2.0,
    skyTint: 0xff007f,
    nebulaColors: [0xff007f, 0x7928ca, 0x00f0ff],
  },
  hyperspace_sprint: {
    name: 'HYPERSPACE SPRINT',
    fogColor: 0x0a001a,
    fogDensity: 0.0008,
    ambientColor: 0x220538,
    ambientIntensity: 1.6,
    primaryDirColor: 0xff007f,
    primaryDirIntensity: 2.6,
    secondaryDirColor: 0x00f0ff,
    secondaryDirIntensity: 2.0,
    skyTint: 0xff007f,
    nebulaColors: [0xff007f, 0x7928ca, 0x00f0ff],
  },
  nebula_rift: {
    name: 'WORMHOLE EXPRESS',
    fogColor: 0x090314,
    fogDensity: 0.001,
    ambientColor: 0x1e0e33,
    ambientIntensity: 1.5,
    primaryDirColor: 0xc026d3,
    primaryDirIntensity: 2.4,
    secondaryDirColor: 0x00f0ff,
    secondaryDirIntensity: 1.8,
    skyTint: 0xc026d3,
    nebulaColors: [0xc026d3, 0x7c3aed, 0x00f0ff],
  },
};

interface MovingShip {
  mesh: THREE.Object3D;
  startPos: THREE.Vector3;
  velocity: THREE.Vector3;
  maxDistance: number;
}

interface ShootingStar {
  line: THREE.Line;
  pos: THREE.Vector3;
  dir: THREE.Vector3;
  speed: number;
  life: number;
  maxLife: number;
  active: boolean;
}

export class SpaceEnvironmentSystem {
  public group: THREE.Group;
  public trackId: TrackId;
  private scene: THREE.Scene;

  // Environment Sub-Groups
  private farRangeGroup: THREE.Group;
  private midRangeGroup: THREE.Group;
  private closeRangeGroup: THREE.Group;

  // Animated elements
  private rotatingRings: { mesh: THREE.Object3D; speed: THREE.Vector3 }[] = [];
  private animatedTowers: { mesh: THREE.Object3D; baseIntensity: number; light?: THREE.PointLight }[] = [];
  private movingShips: MovingShip[] = [];
  private shootingStars: ShootingStar[] = [];
  private nebulaParticles: THREE.Points | null = null;
  private spaceDustParticles: THREE.Points | null = null;
  private spiralGalaxies: THREE.Group[] = [];
  private solarStarMesh: THREE.Mesh | null = null;
  private solarStarLight: THREE.PointLight | null = null;
  private cityInstancedMesh: THREE.InstancedMesh | null = null;
  private trafficMesh: THREE.InstancedMesh | null = null;
  private trafficCount: number = 0;
  private trafficPositions: { pos: THREE.Vector3; speed: number; lane: number }[] = [];
  private stormLightningTimer: number = 0;
  private primaryDirLight: THREE.DirectionalLight | null = null;
  private secondaryDirLight: THREE.DirectionalLight | null = null;
  private ambientLight: THREE.AmbientLight | null = null;

  constructor(scene: THREE.Scene, trackId: TrackId) {
    this.scene = scene;
    this.trackId = trackId;
    this.group = new THREE.Group();
    this.group.name = 'VoidRider_Environment';

    this.farRangeGroup = new THREE.Group();
    this.farRangeGroup.name = 'FarRange_Universe';

    this.midRangeGroup = new THREE.Group();
    this.midRangeGroup.name = 'MidRange_Infrastructure';

    this.closeRangeGroup = new THREE.Group();
    this.closeRangeGroup.name = 'CloseRange_TrackSurrounds';

    this.group.add(this.farRangeGroup);
    this.group.add(this.midRangeGroup);
    this.group.add(this.closeRangeGroup);
    this.scene.add(this.group);

    this.buildEnvironment(trackId);
  }

  public getThemeConfig(trackId: TrackId): EnvironmentThemeConfig {
    return THEME_CONFIGS[trackId] || THEME_CONFIGS.neon_orbit;
  }

  public buildEnvironment(trackId: TrackId) {
    this.trackId = trackId;
    this.clear();

    const config = this.getThemeConfig(trackId);

    // 1. Dynamic Atmosphere & Volumetric Fog
    if (this.scene.fog instanceof THREE.FogExp2) {
      this.scene.fog.color.setHex(config.fogColor);
      this.scene.fog.density = config.fogDensity;
    }

    // 2. Cinematic Lighting
    this.setupLighting(config);

    // 3. Far Range Layer: Deep cosmos, stars, nebulae, galaxies, shooting stars, giant planets
    this.buildFarRangeLayer(config);

    // 4. Mid Range Layer: Space stations, megastructures, orbital rings, traffic, antennas
    this.buildMidRangeLayer(config);

    // 5. Close Range Layer: Track infrastructure, plasma towers, service gantries, holographic guides
    this.buildCloseRangeLayer(config);

    // 6. Theme-Specific Specialized Megastructures
    this.buildThemeSpecializedStructures(trackId, config);
  }

  private setupLighting(config: EnvironmentThemeConfig) {
    this.ambientLight = new THREE.AmbientLight(config.ambientColor, config.ambientIntensity);
    this.group.add(this.ambientLight);

    this.primaryDirLight = new THREE.DirectionalLight(config.primaryDirColor, config.primaryDirIntensity);
    this.primaryDirLight.position.set(250, 450, 300);
    this.group.add(this.primaryDirLight);

    this.secondaryDirLight = new THREE.DirectionalLight(config.secondaryDirColor, config.secondaryDirIntensity);
    this.secondaryDirLight.position.set(-300, -180, -350);
    this.group.add(this.secondaryDirLight);
  }

  // ==========================================
  // 1. FAR RANGE LAYER (Deep Universe & Cosmic Scale)
  // ==========================================
  private buildFarRangeLayer(config: EnvironmentThemeConfig) {
    // Multi-Layer Dense Starfield
    const starCount = 3800;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starCols = new Float32Array(starCount * 3);

    const palette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0x00f0ff),
      new THREE.Color(0xa855f7),
      new THREE.Color(0x38bdf8),
      new THREE.Color(0xf43f5e),
      new THREE.Color(config.skyTint),
    ];

    for (let i = 0; i < starCount; i++) {
      const dist = 1400 + Math.random() * 1600;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPos[i * 3] = dist * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = dist * Math.cos(phi);

      const c = palette[Math.floor(Math.random() * palette.length)];
      starCols[i * 3] = c.r;
      starCols[i * 3 + 1] = c.g;
      starCols[i * 3 + 2] = c.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starCols, 3));

    const starMat = new THREE.PointsMaterial({
      size: 2.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });
    const starField = new THREE.Points(starGeo, starMat);
    this.farRangeGroup.add(starField);

    // Volumetric Nebula Gas Clouds (Layered particle cloud volumes)
    const nebulaCount = 600;
    const nebulaGeo = new THREE.BufferGeometry();
    const nebulaPos = new Float32Array(nebulaCount * 3);
    const nebulaCols = new Float32Array(nebulaCount * 3);

    for (let i = 0; i < nebulaCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 800 + Math.random() * 900;
      const height = (Math.random() - 0.5) * 800;

      nebulaPos[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 200;
      nebulaPos[i * 3 + 1] = height + 100;
      nebulaPos[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 200;

      const colHex = config.nebulaColors[Math.floor(Math.random() * config.nebulaColors.length)];
      const col = new THREE.Color(colHex);
      nebulaCols[i * 3] = col.r;
      nebulaCols[i * 3 + 1] = col.g;
      nebulaCols[i * 3 + 2] = col.b;
    }

    nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));
    nebulaGeo.setAttribute('color', new THREE.BufferAttribute(nebulaCols, 3));

    const nebulaMat = new THREE.PointsMaterial({
      size: 65,
      vertexColors: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.nebulaParticles = new THREE.Points(nebulaGeo, nebulaMat);
    this.farRangeGroup.add(this.nebulaParticles);

    // Distant Spiral Galaxies
    this.buildSpiralGalaxy(new THREE.Vector3(-1200, 480, -1800), 220, config.nebulaColors[0]);
    this.buildSpiralGalaxy(new THREE.Vector3(1400, -320, -1500), 180, config.nebulaColors[1] || 0xc026d3);

    // Periodic Shooting Stars Pool
    this.initShootingStars();

    // Floating Space Dust
    this.initSpaceDust();
  }

  private buildSpiralGalaxy(pos: THREE.Vector3, radius: number, primaryColorHex: number) {
    const galaxyGroup = new THREE.Group();
    galaxyGroup.position.copy(pos);

    const count = 1200;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const primaryCol = new THREE.Color(primaryColorHex);
    const coreCol = new THREE.Color(0xffffff);

    for (let i = 0; i < count; i++) {
      const arm = i % 2;
      const armAngle = arm * Math.PI;
      const r = Math.pow(Math.random(), 1.6) * radius;
      const angle = armAngle + (r / radius) * 4.5 + (Math.random() - 0.5) * 0.45;

      const x = Math.cos(angle) * r;
      const y = (Math.random() - 0.5) * 22 * (1 - r / radius);
      const z = Math.sin(angle) * r;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const t = r / radius;
      const c = coreCol.clone().lerp(primaryCol, t);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 4.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geo, mat);
    galaxyGroup.add(points);

    // Glowing Galactic Core
    const coreGeo = new THREE.SphereGeometry(18, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    galaxyGroup.add(coreMesh);

    galaxyGroup.rotation.x = 0.6;
    galaxyGroup.rotation.y = 0.3;
    this.farRangeGroup.add(galaxyGroup);
    this.spiralGalaxies.push(galaxyGroup);
  }

  private initShootingStars() {
    this.shootingStars = [];
    for (let i = 0; i < 4; i++) {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(6); // 2 vertices: head and tail
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

      const mat = new THREE.LineBasicMaterial({
        color: 0x67e8f9,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });

      const line = new THREE.Line(geo, mat);
      this.farRangeGroup.add(line);

      this.shootingStars.push({
        line,
        pos: new THREE.Vector3(),
        dir: new THREE.Vector3(),
        speed: 800,
        life: 0,
        maxLife: 1.2,
        active: false,
      });
    }
  }

  private initSpaceDust() {
    const count = 450;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 350;
      positions[i + 1] = (Math.random() - 0.5) * 180;
      positions[i + 2] = (Math.random() - 0.5) * 350;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 1.8,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });

    this.spaceDustParticles = new THREE.Points(geo, mat);
    this.farRangeGroup.add(this.spaceDustParticles);
  }

  // ==========================================
  // 2. MID RANGE LAYER (Megastructures, Fleet Traffic & Spire Stations)
  // ==========================================
  private buildMidRangeLayer(config: EnvironmentThemeConfig) {
    // A. Giant Orbital Rings (Megastructure Ring Gates)
    const ringPositions = [
      new THREE.Vector3(0, 140, -420),
      new THREE.Vector3(280, 80, -950),
      new THREE.Vector3(-320, 160, -1450),
    ];

    ringPositions.forEach((pos, idx) => {
      const ringGroup = new THREE.Group();
      ringGroup.position.copy(pos);

      const radius = 95 + idx * 25;
      const torusGeo = new THREE.TorusGeometry(radius, 4.5, 16, 64);
      const torusMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.85,
        roughness: 0.25,
        emissive: 0x003355,
      });
      const outerRing = new THREE.Mesh(torusGeo, torusMat);
      ringGroup.add(outerRing);

      // Inner Glowing Energy Ring
      const energyRingGeo = new THREE.TorusGeometry(radius - 2.5, 1.2, 12, 64);
      const energyRingMat = new THREE.MeshBasicMaterial({
        color: config.primaryDirColor,
        wireframe: true,
        transparent: true,
        opacity: 0.75,
      });
      const energyRing = new THREE.Mesh(energyRingGeo, energyRingMat);
      ringGroup.add(energyRing);

      // 8 Radial Energy Nodes
      for (let n = 0; n < 8; n++) {
        const a = (n * Math.PI * 2) / 8;
        const nodeGeo = new THREE.BoxGeometry(4, 10, 6);
        const nodeMat = new THREE.MeshStandardMaterial({
          color: 0x0284c7,
          emissive: config.primaryDirColor,
          emissiveIntensity: 2.2,
        });
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
        node.rotation.z = a;
        ringGroup.add(node);
      }

      ringGroup.rotation.x = 0.4 + idx * 0.2;
      ringGroup.rotation.y = idx * 0.5;
      this.midRangeGroup.add(ringGroup);

      this.rotatingRings.push({
        mesh: ringGroup,
        speed: new THREE.Vector3(0, 0, (idx % 2 === 0 ? 1 : -1) * 0.003),
      });
    });

    // B. Modular Deep Space Station
    this.buildModularSpaceStation(new THREE.Vector3(-420, 180, -780), config);

    // C. Distant Spacecraft Fleets & Cargo Haulers
    this.initDistantSpacecraftFleets(config);

    // D. Radar & Communication Spire Arrays
    this.buildCommunicationArray(new THREE.Vector3(380, 220, -620), config);
  }

  private buildModularSpaceStation(pos: THREE.Vector3, config: EnvironmentThemeConfig) {
    const stationGroup = new THREE.Group();
    stationGroup.position.copy(pos);

    // Central Megastructure Spire
    const spireGeo = new THREE.CylinderGeometry(8, 16, 260, 24);
    const spireMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.2,
    });
    const spire = new THREE.Mesh(spireGeo, spireMat);
    stationGroup.add(spire);

    // Dual rotating habitat centrifuge rings
    const ringHeights = [-45, 35];
    const ringRadii = [52, 68];

    ringHeights.forEach((h, i) => {
      const r = ringRadii[i];
      const habGeo = new THREE.TorusGeometry(r, 3.8, 12, 36);
      const habMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        emissive: config.primaryDirColor,
        emissiveIntensity: 1.2,
        metalness: 0.7,
        roughness: 0.3,
      });
      const habRing = new THREE.Mesh(habGeo, habMat);
      habRing.rotation.x = Math.PI / 2;
      habRing.position.y = h;
      stationGroup.add(habRing);

      // 4 Spokes connecting to central hub
      for (let s = 0; s < 4; s++) {
        const a = (s * Math.PI) / 2;
        const spokeGeo = new THREE.CylinderGeometry(1.2, 1.2, r, 8);
        const spokeMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
        const spoke = new THREE.Mesh(spokeGeo, spokeMat);
        spoke.rotation.z = Math.PI / 2;
        spoke.rotation.y = a;
        spoke.position.set((Math.cos(a) * r) / 2, h, (Math.sin(a) * r) / 2);
        stationGroup.add(spoke);
      }
    });

    // Solar Sail Panels (Blue/gold reflective grid)
    for (let p = 0; p < 2; p++) {
      const panelGeo = new THREE.BoxGeometry(90, 1.5, 24);
      const panelMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        emissive: 0x0369a1,
        emissiveIntensity: 1.5,
        roughness: 0.1,
        metalness: 0.95,
      });
      const panel = new THREE.Mesh(panelGeo, panelMat);
      panel.position.set(p === 0 ? 80 : -80, 105, 0);
      stationGroup.add(panel);
    }

    // Blinking Station Beacon Light
    const beaconLight = new THREE.PointLight(config.primaryDirColor, 4.0, 180);
    beaconLight.position.set(0, 135, 0);
    stationGroup.add(beaconLight);

    this.midRangeGroup.add(stationGroup);
    this.rotatingRings.push({
      mesh: stationGroup,
      speed: new THREE.Vector3(0, 0.0018, 0),
    });
  }

  private buildCommunicationArray(pos: THREE.Vector3, config: EnvironmentThemeConfig) {
    const arrayGroup = new THREE.Group();
    arrayGroup.position.copy(pos);

    // Triangular Truss Pylon
    const pylonGeo = new THREE.CylinderGeometry(2, 7, 140, 6);
    const pylonMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85 });
    const pylon = new THREE.Mesh(pylonGeo, pylonMat);
    arrayGroup.add(pylon);

    // Rotating Deep-Space Parabolic Dish
    const dishGeo = new THREE.SphereGeometry(24, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.4);
    const dishMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.9,
      roughness: 0.2,
      side: THREE.DoubleSide,
    });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.position.set(0, 72, 0);
    dish.rotation.x = Math.PI / 4;
    arrayGroup.add(dish);

    // Antenna feed horn
    const hornGeo = new THREE.CylinderGeometry(0.5, 1.2, 16, 8);
    const hornMat = new THREE.MeshBasicMaterial({ color: config.secondaryDirColor });
    const horn = new THREE.Mesh(hornGeo, hornMat);
    horn.position.set(0, 80, 12);
    horn.rotation.x = Math.PI / 4;
    arrayGroup.add(horn);

    this.midRangeGroup.add(arrayGroup);
    this.rotatingRings.push({
      mesh: dish,
      speed: new THREE.Vector3(0, 0.006, 0),
    });
  }

  private initDistantSpacecraftFleets(config: EnvironmentThemeConfig) {
    this.movingShips = [];
    const fleetPaths = [
      { start: new THREE.Vector3(-800, 220, -1100), vel: new THREE.Vector3(45, 0, 15), maxDist: 1600 },
      { start: new THREE.Vector3(750, 140, -1400), vel: new THREE.Vector3(-38, 5, 20), maxDist: 1500 },
      { start: new THREE.Vector3(-250, 320, -1600), vel: new THREE.Vector3(25, -4, 40), maxDist: 1800 },
    ];

    fleetPaths.forEach((fp, i) => {
      const shipGroup = new THREE.Group();

      // Heavy Cargo Cruiser Hull
      const hullGeo = new THREE.ConeGeometry(8, 38, 5);
      const hullMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.85,
        roughness: 0.3,
      });
      const hull = new THREE.Mesh(hullGeo, hullMat);
      hull.rotation.x = Math.PI / 2;
      shipGroup.add(hull);

      // Wing Flares
      const wingGeo = new THREE.BoxGeometry(26, 1.2, 14);
      const wingMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 });
      const wing = new THREE.Mesh(wingGeo, wingMat);
      wing.position.z = -6;
      shipGroup.add(wing);

      // Twin Thruster Glow
      [-5, 5].forEach(xOff => {
        const glowGeo = new THREE.SphereGeometry(2.2, 8, 8);
        const glowMat = new THREE.MeshBasicMaterial({ color: config.primaryDirColor });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        glow.position.set(xOff, 0, -18);
        shipGroup.add(glow);
      });

      // Navigation Strobe
      const navGeo = new THREE.SphereGeometry(1.2, 6, 6);
      const navMat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xff0055 : 0x00ff88 });
      const nav = new THREE.Mesh(navGeo, navMat);
      nav.position.set(0, 4, 12);
      shipGroup.add(nav);

      shipGroup.position.copy(fp.start);
      this.midRangeGroup.add(shipGroup);

      this.movingShips.push({
        mesh: shipGroup,
        startPos: fp.start.clone(),
        velocity: fp.vel.clone(),
        maxDistance: fp.maxDist,
      });
    });
  }

  // ==========================================
  // 3. CLOSE RANGE LAYER (Track Edge & Track Surrounds)
  // ==========================================
  private buildCloseRangeLayer(config: EnvironmentThemeConfig) {
    // Energy Arcs & Plasma Conductor Towers along sector margins
    const towerPoints = [
      new THREE.Vector3(-45, 12, -180),
      new THREE.Vector3(45, 12, -180),
      new THREE.Vector3(-60, 24, -580),
      new THREE.Vector3(60, 24, -580),
      new THREE.Vector3(-50, 18, -1050),
      new THREE.Vector3(50, 18, -1050),
    ];

    towerPoints.forEach((pos, idx) => {
      const towerGroup = new THREE.Group();
      towerGroup.position.copy(pos);

      // Pylon Column
      const pylonGeo = new THREE.CylinderGeometry(1.5, 3.2, 38, 8);
      const pylonMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.9,
        roughness: 0.2,
      });
      const pylon = new THREE.Mesh(pylonGeo, pylonMat);
      pylon.position.y = 19;
      towerGroup.add(pylon);

      // Plasma Capacitor Core
      const coreGeo = new THREE.SphereGeometry(3.2, 16, 16);
      const coreMat = new THREE.MeshStandardMaterial({
        color: config.primaryDirColor,
        emissive: config.primaryDirColor,
        emissiveIntensity: 3.5,
        roughness: 0.1,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.y = 39;
      towerGroup.add(core);

      // Surrounding magnetic ring
      const ringGeo = new THREE.TorusGeometry(5.5, 0.6, 8, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: config.secondaryDirColor });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = 39;
      ring.rotation.x = Math.PI / 2;
      towerGroup.add(ring);

      const pLight = new THREE.PointLight(config.primaryDirColor, 2.5, 65);
      pLight.position.y = 40;
      towerGroup.add(pLight);

      this.closeRangeGroup.add(towerGroup);
      this.animatedTowers.push({
        mesh: core,
        baseIntensity: 3.5,
        light: pLight,
      });
    });

    // Floating Service Platforms with Drone Arms
    const servicePlatforms = [
      new THREE.Vector3(38, -5, -340),
      new THREE.Vector3(-42, 8, -750),
      new THREE.Vector3(40, 15, -1250),
    ];

    servicePlatforms.forEach(pos => {
      const platGroup = new THREE.Group();
      platGroup.position.copy(pos);

      // Hexagonal Docking Pad
      const padGeo = new THREE.CylinderGeometry(12, 14, 2.5, 6);
      const padMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.8,
        roughness: 0.3,
      });
      const pad = new THREE.Mesh(padGeo, padMat);
      platGroup.add(pad);

      // Glowing Landing Chevron
      const chevronGeo = new THREE.RingGeometry(3, 8, 6);
      const chevronMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true,
        side: THREE.DoubleSide,
      });
      const chevron = new THREE.Mesh(chevronGeo, chevronMat);
      chevron.rotation.x = Math.PI / 2;
      chevron.position.y = 1.3;
      platGroup.add(chevron);

      // Articulated robotic service arm
      const arm1Geo = new THREE.CylinderGeometry(0.5, 0.5, 10, 6);
      const armMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 0.9 });
      const arm1 = new THREE.Mesh(arm1Geo, armMat);
      arm1.position.set(6, 6, 0);
      arm1.rotation.z = -0.3;
      platGroup.add(arm1);

      this.closeRangeGroup.add(platGroup);
    });

    // Overhead Suspended Truss Bridges
    const gantryPositions = [
      new THREE.Vector3(0, 16, -240),
      new THREE.Vector3(0, 22, -680),
      new THREE.Vector3(0, 20, -1120),
    ];

    gantryPositions.forEach(pos => {
      const gantryGroup = new THREE.Group();
      gantryGroup.position.copy(pos);

      const spanGeo = new THREE.BoxGeometry(42, 2.2, 4);
      const spanMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85 });
      const span = new THREE.Mesh(spanGeo, spanMat);
      gantryGroup.add(span);

      // Holographic directional chevron display
      const screenGeo = new THREE.PlaneGeometry(16, 4);
      const screenMat = new THREE.MeshBasicMaterial({
        color: config.primaryDirColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.set(0, -1.5, 2.2);
      gantryGroup.add(screen);

      this.closeRangeGroup.add(gantryGroup);
    });
  }

  // ==========================================
  // 4. THEME-SPECIFIC SPECIALIZED MEGASTRUCTURES
  // ==========================================
  private buildThemeSpecializedStructures(trackId: TrackId, config: EnvironmentThemeConfig) {
    if (trackId === 'neon_orbit' || trackId === 'circuit_alpha' || trackId === 'skyline_rush') {
      this.buildFuturisticCitySkylines(config);
    } else if (trackId === 'asteroid_run') {
      this.buildAsteroidFieldEnvironment(config);
    } else if (trackId === 'void_rift' || trackId === 'wormhole_express' || trackId === 'nebula_rift') {
      this.buildSubspaceWormholes(config);
    } else if (trackId === 'solar_storm') {
      this.buildSolarProminenceStar(config);
    } else if (trackId === 'gravity_free') {
      this.buildZeroGGyroPlatforms(config);
    } else if (trackId === 'plasma_storm') {
      this.buildPlasmaLightningFields(config);
    } else if (trackId === 'collapsing_track') {
      this.buildCollapsingSuperstructure(config);
    } else if (trackId === 'ring_runner' || trackId === 'cosmic_ring') {
      this.buildRingRunnerAcceleratorTunnels(config);
    } else if (trackId === 'hyperspace_sprint' || trackId === 'quantum_highway') {
      this.buildHyperspaceSpeedCorridors(config);
    }
  }

  // A. NEON CIRCUIT / SKYLINE RUSH (Gigantic 3D Megacity Below)
  private buildFuturisticCitySkylines(config: EnvironmentThemeConfig) {
    const buildingCount = 220;
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x060914,
      metalness: 0.9,
      roughness: 0.25,
      emissive: 0x001428,
    });

    this.cityInstancedMesh = new THREE.InstancedMesh(boxGeo, boxMat, buildingCount);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < buildingCount; i++) {
      const laneX = (Math.random() - 0.5) * 800 + (Math.random() > 0.5 ? 240 : -240);
      const laneZ = -Math.random() * 2200;
      const height = 80 + Math.random() * 260;
      const width = 20 + Math.random() * 35;
      const depth = 20 + Math.random() * 35;

      dummy.position.set(laneX, -height / 2 - 10, laneZ);
      dummy.scale.set(width, height, depth);
      dummy.updateMatrix();
      this.cityInstancedMesh.setMatrixAt(i, dummy.matrix);
    }

    this.cityInstancedMesh.instanceMatrix.needsUpdate = true;
    this.midRangeGroup.add(this.cityInstancedMesh);

    // Flying Civilian Vehicle Streams along skyways
    this.trafficCount = 60;
    const trafficGeo = new THREE.BoxGeometry(3, 1.2, 7);
    const trafficMat = new THREE.MeshBasicMaterial({ color: config.primaryDirColor });
    this.trafficMesh = new THREE.InstancedMesh(trafficGeo, trafficMat, this.trafficCount);

    this.trafficPositions = [];
    for (let i = 0; i < this.trafficCount; i++) {
      const lane = i % 4;
      const x = lane === 0 ? -120 : lane === 1 ? -80 : lane === 2 ? 80 : 120;
      const y = -25 - (lane % 2) * 15;
      const z = -Math.random() * 1800;
      const speed = 40 + Math.random() * 35;

      this.trafficPositions.push({ pos: new THREE.Vector3(x, y, z), speed, lane });
    }
    this.midRangeGroup.add(this.trafficMesh);
  }

  // B. ASTEROID RUN (Broken Moons & Mining Lasers)
  private buildAsteroidFieldEnvironment(config: EnvironmentThemeConfig) {
    // Shattered Moon in Far Horizon
    const moonGeo = new THREE.SphereGeometry(140, 32, 32);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0x33251a,
      roughness: 0.85,
      metalness: 0.15,
      emissive: 0x221100,
      emissiveIntensity: 0.3,
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(-450, 280, -1350);
    this.farRangeGroup.add(moon);

    // Dynamic Mining Lasers (Cyan cutting beams piercing asteroids)
    const laserPositions = [
      { start: new THREE.Vector3(-180, 80, -420), target: new THREE.Vector3(-120, 50, -400) },
      { start: new THREE.Vector3(220, 95, -850), target: new THREE.Vector3(150, 70, -820) },
    ];

    laserPositions.forEach(lp => {
      const dist = lp.start.distanceTo(lp.target);
      const laserGeo = new THREE.CylinderGeometry(0.6, 0.6, dist, 8);
      const laserMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });
      const laser = new THREE.Mesh(laserGeo, laserMat);
      laser.position.copy(lp.start.clone().lerp(lp.target, 0.5));
      laser.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), lp.target.clone().sub(lp.start).normalize());
      this.midRangeGroup.add(laser);
    });
  }

  // C. WORMHOLE EXPRESS / VOID RIFT (Swirling Accretion Disks & Event Horizons)
  private buildSubspaceWormholes(config: EnvironmentThemeConfig) {
    const wormholePositions = [
      new THREE.Vector3(380, 220, -1100),
      new THREE.Vector3(-340, 160, -750),
    ];

    wormholePositions.forEach((pos, idx) => {
      const whGroup = new THREE.Group();
      whGroup.position.copy(pos);

      // Event Horizon (Black sphere absorbing light)
      const horizonGeo = new THREE.SphereGeometry(32 + idx * 8, 32, 32);
      const horizonMat = new THREE.MeshBasicMaterial({ color: 0x020008 });
      const horizon = new THREE.Mesh(horizonGeo, horizonMat);
      whGroup.add(horizon);

      // Chromatic Accretion Disk
      const diskGeo = new THREE.RingGeometry(35, 110, 48);
      const diskMat = new THREE.MeshBasicMaterial({
        color: idx === 0 ? 0xc026d3 : 0x00f0ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      const disk = new THREE.Mesh(diskGeo, diskMat);
      whGroup.add(disk);

      // Outer Gravitational Distortion Torus
      const torusGeo = new THREE.TorusGeometry(125, 4.0, 16, 48);
      const torusMat = new THREE.MeshBasicMaterial({
        color: 0x7928ca,
        wireframe: true,
        transparent: true,
        opacity: 0.65,
      });
      const torus = new THREE.Mesh(torusGeo, torusMat);
      whGroup.add(torus);

      this.midRangeGroup.add(whGroup);
      this.rotatingRings.push({
        mesh: disk,
        speed: new THREE.Vector3(0, 0, (idx === 0 ? 1 : -1) * 0.02),
      });
    });
  }

  // D. SOLAR STORM (Gigantic Coronal Star & Solar Prominences)
  private buildSolarProminenceStar(config: EnvironmentThemeConfig) {
    const starGeo = new THREE.SphereGeometry(380, 48, 48);
    const starMat = new THREE.MeshBasicMaterial({
      color: 0xff4400,
    });
    this.solarStarMesh = new THREE.Mesh(starGeo, starMat);
    this.solarStarMesh.position.set(0, 380, -1800);
    this.farRangeGroup.add(this.solarStarMesh);

    // High-Intensity Dynamic Solar Light
    this.solarStarLight = new THREE.PointLight(0xff5500, 4.0, 3200);
    this.solarStarLight.position.copy(this.solarStarMesh.position);
    this.farRangeGroup.add(this.solarStarLight);

    // 3 Solar Prominence Corona Arcs
    for (let p = 0; p < 3; p++) {
      const arcGeo = new THREE.TorusGeometry(410 + p * 30, 8, 12, 48, Math.PI * 0.45);
      const arcMat = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
      });
      const arc = new THREE.Mesh(arcGeo, arcMat);
      arc.position.copy(this.solarStarMesh.position);
      arc.rotation.z = p * 1.8;
      this.farRangeGroup.add(arc);
      this.rotatingRings.push({ mesh: arc, speed: new THREE.Vector3(0, 0, 0.001) });
    }
  }

  // E. GRAVITY FREE (Open Space & 3-Axis Gyro Rings)
  private buildZeroGGyroPlatforms(config: EnvironmentThemeConfig) {
    const gyroGroup = new THREE.Group();
    gyroGroup.position.set(0, 160, -950);

    const radii = [90, 75, 60];
    radii.forEach((r, i) => {
      const ringGeo = new THREE.TorusGeometry(r, 2.5, 12, 48);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        emissive: config.primaryDirColor,
        emissiveIntensity: 1.8,
        metalness: 0.9,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      gyroGroup.add(ring);

      this.rotatingRings.push({
        mesh: ring,
        speed: new THREE.Vector3(
          i === 0 ? 0.004 : 0,
          i === 1 ? 0.005 : 0,
          i === 2 ? 0.006 : 0
        ),
      });
    });

    this.midRangeGroup.add(gyroGroup);
  }

  // F. PLASMA STORM (Lightning Arcs & Storm Clouds)
  private buildPlasmaLightningFields(config: EnvironmentThemeConfig) {
    // Floating damaged orbital stations
    const ruinedStation = new THREE.Group();
    ruinedStation.position.set(-220, 140, -820);

    const chunkGeo = new THREE.DodecahedronGeometry(28);
    const chunkMat = new THREE.MeshStandardMaterial({
      color: 0x1f1728,
      wireframe: true,
    });
    const chunk = new THREE.Mesh(chunkGeo, chunkMat);
    ruinedStation.add(chunk);

    // Flashing spark light
    const sparkLight = new THREE.PointLight(0xa855f7, 3.5, 120);
    ruinedStation.add(sparkLight);

    this.midRangeGroup.add(ruinedStation);
  }

  // G. COLLAPSING TRACK (Damaged Infrastructure & Emergency Lights)
  private buildCollapsingSuperstructure(config: EnvironmentThemeConfig) {
    const wreckPositions = [
      new THREE.Vector3(-35, -8, -380),
      new THREE.Vector3(42, -12, -720),
      new THREE.Vector3(-45, -5, -1150),
    ];

    wreckPositions.forEach(pos => {
      const wreck = new THREE.Group();
      wreck.position.copy(pos);

      // Twisted broken girders
      const beamGeo = new THREE.BoxGeometry(22, 2.5, 2.5);
      const beamMat = new THREE.MeshStandardMaterial({ color: 0x331111, metalness: 0.8 });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.rotation.set(0.4, 0.2, 0.6);
      wreck.add(beam);

      // Flashing Emergency Warning Strobe
      const strobe = new THREE.PointLight(0xff3b30, 3.0, 70);
      strobe.position.y = 4;
      wreck.add(strobe);

      this.closeRangeGroup.add(wreck);
    });
  }

  // H. RING RUNNER (Colossal Nested Accelerator Rings)
  private buildRingRunnerAcceleratorTunnels(config: EnvironmentThemeConfig) {
    const tunnelZs = [-280, -640, -1080, -1450];
    tunnelZs.forEach((z, i) => {
      const megaRing = new THREE.Group();
      megaRing.position.set(0, 18, z);

      const torusGeo = new THREE.TorusGeometry(38, 3.2, 16, 48);
      const torusMat = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00e5bb,
        emissiveIntensity: 2.8,
        roughness: 0.15,
      });
      const ringMesh = new THREE.Mesh(torusGeo, torusMat);
      megaRing.add(ringMesh);

      // High-G outer machinery gear
      const gearGeo = new THREE.TorusGeometry(46, 1.8, 8, 24);
      const gearMat = new THREE.MeshStandardMaterial({ color: 0x0f2533, metalness: 0.9 });
      const gearMesh = new THREE.Mesh(gearGeo, gearMat);
      megaRing.add(gearMesh);

      this.closeRangeGroup.add(megaRing);
      this.rotatingRings.push({
        mesh: gearMesh,
        speed: new THREE.Vector3(0, 0, (i % 2 === 0 ? 1 : -1) * 0.008),
      });
    });
  }

  // I. HYPERSPACE SPRINT (Geometric Warp Speed Tunnel)
  private buildHyperspaceSpeedCorridors(config: EnvironmentThemeConfig) {
    const tunnelZs = [-200, -500, -800, -1100, -1400, -1700];
    tunnelZs.forEach((z, idx) => {
      const portal = new THREE.Group();
      portal.position.set(0, 15, z);

      // Hexagonal Speed Portal
      const hexGeo = new THREE.RingGeometry(24, 26, 6);
      const hexMat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? 0xff007f : 0x00f0ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const hex = new THREE.Mesh(hexGeo, hexMat);
      portal.add(hex);

      this.closeRangeGroup.add(portal);
      this.rotatingRings.push({
        mesh: hex,
        speed: new THREE.Vector3(0, 0, 0.015),
      });
    });
  }

  // ==========================================
  // UPDATE TICK
  // ==========================================
  public update(dt: number, shipPosition: THREE.Vector3, shipSpeed: number, isBoosting: boolean) {
    // 1. Rotating Rings & Megastructure machinery
    for (let i = 0; i < this.rotatingRings.length; i++) {
      const rr = this.rotatingRings[i];
      rr.mesh.rotation.x += rr.speed.x;
      rr.mesh.rotation.y += rr.speed.y;
      rr.mesh.rotation.z += rr.speed.z;
    }

    // 2. Animated Energy & Plasma Towers (Pulsing arcs)
    const time = Date.now() * 0.003;
    for (let i = 0; i < this.animatedTowers.length; i++) {
      const at = this.animatedTowers[i];
      const pulse = at.baseIntensity + Math.sin(time + i * 1.5) * 1.2 + (isBoosting ? 1.5 : 0);
      if (at.mesh instanceof THREE.Mesh && at.mesh.material instanceof THREE.MeshStandardMaterial) {
        at.mesh.material.emissiveIntensity = pulse;
      }
      if (at.light) {
        at.light.intensity = pulse;
      }
    }

    // 3. Moving Civilian Vehicles & Spacecraft Fleets
    for (let i = 0; i < this.movingShips.length; i++) {
      const s = this.movingShips[i];
      s.mesh.position.addScaledVector(s.velocity, dt);
      if (s.mesh.position.distanceTo(s.startPos) > s.maxDistance) {
        s.mesh.position.copy(s.startPos);
      }
    }

    // 4. Moving Skyline Traffic (Instanced)
    if (this.trafficMesh && this.trafficPositions.length > 0) {
      const dummy = new THREE.Object3D();
      for (let i = 0; i < this.trafficPositions.length; i++) {
        const tp = this.trafficPositions[i];
        tp.pos.z += tp.speed * dt;
        if (tp.pos.z > 200) {
          tp.pos.z = -1800;
        }
        dummy.position.copy(tp.pos);
        dummy.updateMatrix();
        this.trafficMesh.setMatrixAt(i, dummy.matrix);
      }
      this.trafficMesh.instanceMatrix.needsUpdate = true;
    }

    // 5. Dynamic Shooting Stars
    this.updateShootingStars(dt);

    // 6. Dynamic Solar Star Flares
    if (this.solarStarLight && this.trackId === 'solar_storm') {
      this.solarStarLight.intensity = 4.0 + Math.sin(time * 3.5) * 1.5 + (Math.random() > 0.96 ? 2.5 : 0);
    }

    // 7. Dynamic Storm Lightning Flashes
    if (this.trackId === 'plasma_storm') {
      this.stormLightningTimer -= dt;
      if (this.stormLightningTimer <= 0) {
        this.stormLightningTimer = 1.5 + Math.random() * 3.0;
        if (this.primaryDirLight) {
          this.primaryDirLight.intensity = 6.0;
          setTimeout(() => {
            if (this.primaryDirLight) this.primaryDirLight.intensity = 2.8;
          }, 80);
        }
      }
    }

    // 8. Space Dust tracking ship position
    if (this.spaceDustParticles) {
      this.spaceDustParticles.position.lerp(shipPosition, 0.08);
    }

    // 9. Boost Atmospheric Scaling
    if (this.nebulaParticles) {
      this.nebulaParticles.rotation.y += 0.0002;
    }
  }

  private updateShootingStars(dt: number) {
    for (let i = 0; i < this.shootingStars.length; i++) {
      const ss = this.shootingStars[i];
      if (!ss.active) {
        if (Math.random() < 0.008) {
          ss.active = true;
          ss.life = ss.maxLife;
          const startRadius = 900 + Math.random() * 400;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI * 0.4 + 0.2;
          ss.pos.set(
            startRadius * Math.sin(phi) * Math.cos(theta),
            startRadius * Math.cos(phi),
            startRadius * Math.sin(phi) * Math.sin(theta)
          );
          ss.dir.set(-0.8 - Math.random() * 0.4, -0.6 - Math.random() * 0.4, -0.2).normalize();
          (ss.line.material as THREE.LineBasicMaterial).opacity = 0.9;
        }
      } else {
        ss.life -= dt;
        ss.pos.addScaledVector(ss.dir, ss.speed * dt);

        const tail = ss.pos.clone().addScaledVector(ss.dir, -45);
        const posAttr = ss.line.geometry.getAttribute('position') as THREE.BufferAttribute;
        posAttr.setXYZ(0, ss.pos.x, ss.pos.y, ss.pos.z);
        posAttr.setXYZ(1, tail.x, tail.y, tail.z);
        posAttr.needsUpdate = true;

        const alpha = Math.max(0, ss.life / ss.maxLife);
        (ss.line.material as THREE.LineBasicMaterial).opacity = alpha * 0.9;

        if (ss.life <= 0) {
          ss.active = false;
          (ss.line.material as THREE.LineBasicMaterial).opacity = 0;
        }
      }
    }
  }

  // Dispose all resources cleanly
  public clear() {
    this.rotatingRings = [];
    this.animatedTowers = [];
    this.movingShips = [];
    this.shootingStars = [];
    this.trafficPositions = [];
    this.solarStarMesh = null;
    this.solarStarLight = null;
    this.cityInstancedMesh = null;
    this.trafficMesh = null;

    const disposeChild = (obj: THREE.Object3D) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.Line) {
        obj.geometry?.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose());
        } else if (obj.material) {
          obj.material.dispose();
        }
      }
    };

    this.farRangeGroup.traverse(disposeChild);
    this.midRangeGroup.traverse(disposeChild);
    this.closeRangeGroup.traverse(disposeChild);

    while (this.farRangeGroup.children.length > 0) {
      this.farRangeGroup.remove(this.farRangeGroup.children[0]);
    }
    while (this.midRangeGroup.children.length > 0) {
      this.midRangeGroup.remove(this.midRangeGroup.children[0]);
    }
    while (this.closeRangeGroup.children.length > 0) {
      this.closeRangeGroup.remove(this.closeRangeGroup.children[0]);
    }
    while (this.group.children.length > 3) {
      this.group.remove(this.group.children[3]);
    }
  }

  public destroy() {
    this.clear();
    this.scene.remove(this.group);
  }
}
