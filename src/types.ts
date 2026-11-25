export type PlatformType =
  | 'solid'
  | 'moving'
  | 'cloud_bounce'
  | 'vanishing'
  | 'speed_strip'
  | 'rainbow_bridge'
  | 'fragile';

export interface Platform {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: PlatformType;
  color?: string; // hex or spectral color name
  pattern?: 'rainbow_stripes' | 'solid' | 'cloud' | 'crystal';
  // Moving platform parameters
  moveVx?: number;
  moveVy?: number;
  startX?: number;
  startY?: number;
  targetX?: number;
  targetY?: number;
  moveSpeed?: number;
  moveProgress?: number;
  // Vanishing parameters
  vanishTimer?: number; // starts counting when touched
  vanishDuration?: number;
  isVanished?: boolean;
  respawnTimer?: number;
  // Cloud bounce parameters
  bounceForce?: number;
  bounceSquish?: number;
  // Speed strip
  speedBoost?: number;
}

export type HazardType =
  | 'spike'
  | 'spinner'
  | 'laser_beam'
  | 'pendulum'
  | 'prism_orb';

export interface Hazard {
  id: string;
  type: HazardType;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  // For spinner
  angle?: number;
  spinSpeed?: number;
  length?: number;
  // For laser beam
  pulsePeriod?: number;
  activeTime?: number;
  isActive?: boolean;
  timer?: number;
  // For pendulum
  pivotX?: number;
  pivotY?: number;
  radius?: number;
  swingSpeed?: number;
  currentAngle?: number;
  maxAngle?: number;
}

export interface StarCollectible {
  id: string;
  x: number;
  y: number;
  collected: boolean;
  pulseOffset: number;
}

export interface Checkpoint {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  activated: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'circle' | 'star' | 'sparkle' | 'heart';
}

export interface TrailPoint {
  x: number;
  y: number;
  color: string;
  alpha: number;
  size: number;
}

export type TrailStyle = 'rainbow' | 'starlight' | 'bubble' | 'sparkle';
export type HatStyle = 'none' | 'rainbow_crown' | 'cloud_wings' | 'star_halo' | 'unicorn_horn';

export interface CustomizationSettings {
  colorIndex: number;
  hat: HatStyle;
  trail: TrailStyle;
}

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isGrounded: boolean;
  isOnMovingPlatform: boolean;
  movingPlatformVx: number;
  movingPlatformVy: number;
  jumpsLeft: number;
  maxJumps: number;
  isDashing: boolean;
  dashTimer: number;
  dashCooldown: number;
  facing: 1 | -1;
  squashX: number;
  squashY: number;
  coyoteTimer: number;
  jumpBufferTimer: number;
  trail: TrailPoint[];
  isAlive: boolean;
  respawnCountdown: number;
  currentCheckpoint: { x: number; y: number } | null;
  blinkTimer: number;
  isBlinking: boolean;
}

export interface LevelData {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  parTime: number; // in seconds
  spawn: { x: number; y: number };
  goal: { x: number; y: number; width: number; height: number };
  platforms: Platform[];
  hazards: Hazard[];
  stars: StarCollectible[];
  checkpoints: Checkpoint[];
  worldWidth: number;
  worldHeight: number;
  skyTheme: 'sunrise' | 'noon' | 'twilight' | 'aurora' | 'cosmic';
}

export interface LevelProgress {
  unlocked: boolean;
  completed: boolean;
  bestTime: number | null; // seconds
  starsEarned: number; // 0-3
  collectedStars: boolean[];
}

export interface GameStats {
  deaths: number;
  starsCollected: number;
  currentLevelIndex: number;
  elapsedTime: number;
  isTimerRunning: boolean;
}
