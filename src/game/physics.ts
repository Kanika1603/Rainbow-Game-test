import { Player, Platform, Hazard, StarCollectible, Checkpoint, Particle, LevelData } from '../types';
import { soundManager } from '../audio/soundManager';

export const GRAVITY = 0.58;
export const MOVE_SPEED = 6.8;
export const ACCELERATION = 1.4;
export const FRICTION = 0.76;
export const AIR_FRICTION = 0.88;
export const JUMP_FORCE = -12.2;
export const DOUBLE_JUMP_FORCE = -10.8;
export const MAX_FALL_SPEED = 16;
export const DASH_SPEED = 18;
export const DASH_DURATION = 0.16;
export const DASH_COOLDOWN = 1.0;
export const COYOTE_TIME = 0.12;
export const JUMP_BUFFER_TIME = 0.14;

export interface InputState {
  left: boolean;
  right: boolean;
  jumpPressed: boolean;
  jumpHeld: boolean;
  dashPressed: boolean;
  restartPressed: boolean;
}

export function createInitialPlayer(spawn: { x: number; y: number }): Player {
  return {
    x: spawn.x,
    y: spawn.y,
    vx: 0,
    vy: 0,
    width: 32,
    height: 38,
    isGrounded: false,
    isOnMovingPlatform: false,
    movingPlatformVx: 0,
    movingPlatformVy: 0,
    jumpsLeft: 2,
    maxJumps: 2,
    isDashing: false,
    dashTimer: 0,
    dashCooldown: 0,
    facing: 1,
    squashX: 1,
    squashY: 1,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    trail: [],
    isAlive: true,
    respawnCountdown: 0,
    currentCheckpoint: null,
    blinkTimer: 0,
    isBlinking: false,
  };
}

export function updatePhysics(
  player: Player,
  input: InputState,
  level: LevelData,
  dt: number,
  particles: Particle[],
  onStarCollect: (starId: string) => void,
  onCheckpointReach: (cpId: string) => void,
  onPlayerDeath: () => void,
  onGoalReach: () => void
) {
  // Handle respawn delay
  if (!player.isAlive) {
    player.respawnCountdown -= dt;
    if (player.respawnCountdown <= 0) {
      respawnPlayer(player, level, particles);
    }
    return;
  }

  // Blinking eyes animation timer
  player.blinkTimer += dt;
  if (player.blinkTimer > 3.5) {
    player.isBlinking = true;
    if (player.blinkTimer > 3.7) {
      player.isBlinking = false;
      player.blinkTimer = 0;
    }
  }

  // Decay squash & stretch smoothly back to 1
  player.squashX += (1 - player.squashX) * 0.18;
  player.squashY += (1 - player.squashY) * 0.18;

  // Jump buffering & coyote time counters
  if (input.jumpPressed) {
    player.jumpBufferTimer = JUMP_BUFFER_TIME;
  } else {
    player.jumpBufferTimer = Math.max(0, player.jumpBufferTimer - dt);
  }

  if (player.isGrounded) {
    player.coyoteTimer = COYOTE_TIME;
    player.jumpsLeft = player.maxJumps;
  } else {
    player.coyoteTimer = Math.max(0, player.coyoteTimer - dt);
  }

  // Dash timers
  player.dashCooldown = Math.max(0, player.dashCooldown - dt);
  if (player.isDashing) {
    player.dashTimer -= dt;
    if (player.dashTimer <= 0) {
      player.isDashing = false;
    }
  }

  // Dash initiation
  if (input.dashPressed && player.dashCooldown <= 0 && !player.isDashing) {
    player.isDashing = true;
    player.dashTimer = DASH_DURATION;
    player.dashCooldown = DASH_COOLDOWN;
    player.vx = player.facing * DASH_SPEED;
    player.vy = 0;
    player.squashX = 1.4;
    player.squashY = 0.7;
    soundManager.playDash();

    // Dash burst particles
    for (let i = 0; i < 14; i++) {
      particles.push({
        x: player.x + player.width / 2,
        y: player.y + player.height / 2,
        vx: -player.facing * (Math.random() * 5 + 2),
        vy: (Math.random() - 0.5) * 4,
        size: Math.random() * 8 + 4,
        color: ['#FF4B4B', '#FFD233', '#00D2D3', '#9B59B6'][Math.floor(Math.random() * 4)],
        alpha: 1,
        life: 0,
        maxLife: 0.35,
        shape: 'sparkle',
      });
    }
  }

  // Horizontal movement
  if (!player.isDashing) {
    let targetVx = 0;
    if (input.left) {
      targetVx -= MOVE_SPEED;
      player.facing = -1;
    }
    if (input.right) {
      targetVx += MOVE_SPEED;
      player.facing = 1;
    }

    const currentFriction = player.isGrounded ? FRICTION : AIR_FRICTION;
    if (targetVx !== 0) {
      player.vx += (targetVx - player.vx) * 0.22;
    } else {
      player.vx *= currentFriction;
    }

    // Add moving platform horizontal velocity if standing on one
    if (player.isOnMovingPlatform) {
      player.x += player.movingPlatformVx;
    }
  }

  // Jump mechanics
  if (player.jumpBufferTimer > 0) {
    if (player.coyoteTimer > 0 || player.isGrounded) {
      // First jump from ground
      player.vy = JUMP_FORCE;
      player.isGrounded = false;
      player.coyoteTimer = 0;
      player.jumpBufferTimer = 0;
      player.jumpsLeft = 1;
      player.squashX = 0.75;
      player.squashY = 1.35;
      soundManager.playJump();

      // Cloud puff particles on jump
      spawnGroundPuff(player, particles);
    } else if (player.jumpsLeft > 0) {
      // Mid-air double jump!
      player.vy = DOUBLE_JUMP_FORCE;
      player.jumpsLeft = 0;
      player.jumpBufferTimer = 0;
      player.squashX = 0.7;
      player.squashY = 1.4;
      soundManager.playDoubleJump();

      // Rainbow ring particles for double jump
      for (let i = 0; i < 16; i++) {
        const ang = (i / 16) * Math.PI * 2;
        particles.push({
          x: player.x + player.width / 2,
          y: player.y + player.height - 4,
          vx: Math.cos(ang) * 4,
          vy: Math.sin(ang) * 2 + 1,
          size: 5,
          color: ['#FF4B4B', '#FF8533', '#FFD233', '#2ECC71', '#00D2D3', '#9B59B6'][i % 6],
          alpha: 1,
          life: 0,
          maxLife: 0.4,
          shape: 'star',
        });
      }
    }
  }

  // Variable jump height: release jump button early to truncate jump
  if (!input.jumpHeld && player.vy < -3 && !player.isDashing) {
    player.vy *= 0.82;
  }

  // Apply gravity (unless dashing)
  if (!player.isDashing) {
    player.vy = Math.min(MAX_FALL_SPEED, player.vy + GRAVITY);
  }

  // Pre-update platform states (moving platforms, vanishing timers)
  updatePlatforms(level.platforms, dt, particles);

  // Update hazard states (spinners, pendulums, lasers)
  updateHazards(level.hazards, dt);

  // Integrate movement & resolve collisions
  player.x += player.vx;
  resolveHorizontalCollisions(player, level.platforms);

  player.y += player.vy;
  player.isOnMovingPlatform = false;
  player.movingPlatformVx = 0;
  player.movingPlatformVy = 0;
  player.isGrounded = false;
  resolveVerticalCollisions(player, level.platforms, particles);

  // Bounds checking (falling off the course into the rainbow abyss)
  if (player.y > level.worldHeight + 80) {
    killPlayer(player, onPlayerDeath, particles);
    return;
  }

  // Hazard collisions
  if (checkHazardCollisions(player, level.hazards)) {
    killPlayer(player, onPlayerDeath, particles);
    return;
  }

  // Star collectibles check
  level.stars.forEach((star) => {
    if (!star.collected) {
      const starRadius = 16;
      const playerCenterX = player.x + player.width / 2;
      const playerCenterY = player.y + player.height / 2;
      const dx = playerCenterX - star.x;
      const dy = playerCenterY - star.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < starRadius + player.width / 2) {
        star.collected = true;
        soundManager.playStarCollect();
        onStarCollect(star.id);

        // Star sparkle burst
        for (let i = 0; i < 20; i++) {
          const angle = Math.random() * Math.PI * 2;
          const spd = Math.random() * 5 + 2;
          particles.push({
            x: star.x,
            y: star.y,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            size: Math.random() * 6 + 4,
            color: ['#FFD233', '#FFF', '#FF8533', '#00D2D3'][Math.floor(Math.random() * 4)],
            alpha: 1,
            life: 0,
            maxLife: 0.6,
            shape: 'star',
          });
        }
      }
    }
  });

  // Checkpoints check
  level.checkpoints.forEach((cp) => {
    if (!cp.activated) {
      if (
        player.x + player.width > cp.x &&
        player.x < cp.x + cp.width &&
        player.y + player.height > cp.y &&
        player.y < cp.y + cp.height + 30
      ) {
        cp.activated = true;
        player.currentCheckpoint = { x: cp.x + cp.width / 2, y: cp.y - 10 };
        soundManager.playCheckpoint();
        onCheckpointReach(cp.id);

        // Checkpoint pillar beam particles
        for (let i = 0; i < 30; i++) {
          particles.push({
            x: cp.x + Math.random() * cp.width,
            y: cp.y + cp.height - Math.random() * 80,
            vx: (Math.random() - 0.5) * 2,
            vy: -(Math.random() * 6 + 3),
            size: Math.random() * 7 + 4,
            color: ['#2ECC71', '#00D2D3', '#FFD233', '#FF4B4B'][i % 4],
            alpha: 1,
            life: 0,
            maxLife: 0.7,
            shape: 'sparkle',
          });
        }
      }
    }
  });

  // Goal reach check
  const goal = level.goal;
  if (
    player.x + player.width > goal.x &&
    player.x < goal.x + goal.width &&
    player.y + player.height > goal.y &&
    player.y < goal.y + goal.height
  ) {
    onGoalReach();
  }

  // Player trail recording
  if (Math.abs(player.vx) > 0.5 || Math.abs(player.vy) > 0.5 || player.isDashing) {
    const rainbowColors = ['#FF4B4B', '#FF8533', '#FFD233', '#2ECC71', '#00D2D3', '#9B59B6'];
    player.trail.unshift({
      x: player.x + player.width / 2,
      y: player.y + player.height / 2,
      color: rainbowColors[Math.floor(Date.now() / 80) % rainbowColors.length],
      alpha: 0.85,
      size: player.isDashing ? 20 : 12,
    });
    if (player.trail.length > 16) {
      player.trail.pop();
    }
  } else if (player.trail.length > 0) {
    player.trail.pop();
  }
}

function updatePlatforms(platforms: Platform[], dt: number, particles: Particle[]) {
  platforms.forEach((plat) => {
    // Moving platforms
    if (plat.type === 'moving' && plat.startX !== undefined && plat.targetX !== undefined) {
      plat.moveProgress = (plat.moveProgress || 0) + (plat.moveSpeed || 1) * dt;
      const t = (Math.sin(plat.moveProgress) + 1) / 2; // smooth easing 0..1
      const prevX = plat.x;
      const prevY = plat.y;

      plat.x = plat.startX + (plat.targetX - plat.startX) * t;
      plat.y = plat.startY! + (plat.targetY! - plat.startY!) * t;

      plat.moveVx = plat.x - prevX;
      plat.moveVy = plat.y - prevY;
    }

    // Vanishing platforms
    if (plat.type === 'vanishing') {
      if (plat.vanishTimer !== undefined && plat.vanishTimer > 0) {
        plat.vanishTimer -= dt;
        if (plat.vanishTimer <= 0) {
          plat.isVanished = true;
          plat.respawnTimer = 2.4; // respawn in 2.4s

          // Vanishing crumble particles
          for (let i = 0; i < 12; i++) {
            particles.push({
              x: plat.x + Math.random() * plat.width,
              y: plat.y + Math.random() * plat.height,
              vx: (Math.random() - 0.5) * 3,
              vy: Math.random() * 3 + 1,
              size: Math.random() * 5 + 3,
              color: plat.color || '#FFD233',
              alpha: 0.9,
              life: 0,
              maxLife: 0.5,
              shape: 'sparkle',
            });
          }
        }
      } else if (plat.isVanished && plat.respawnTimer !== undefined) {
        plat.respawnTimer -= dt;
        if (plat.respawnTimer <= 0) {
          plat.isVanished = false;
          plat.vanishTimer = undefined;
        }
      }
    }
  });
}

function updateHazards(hazards: Hazard[], dt: number) {
  hazards.forEach((hazard) => {
    if (hazard.type === 'spinner') {
      hazard.angle = (hazard.angle || 0) + (hazard.spinSpeed || 2) * dt;
    } else if (hazard.type === 'pendulum') {
      hazard.currentAngle =
        Math.sin((Date.now() / 1000) * (hazard.swingSpeed || 2)) * (hazard.maxAngle || 1.0);
      if (hazard.pivotX !== undefined && hazard.pivotY !== undefined && hazard.radius !== undefined) {
        hazard.x = hazard.pivotX + Math.sin(hazard.currentAngle) * hazard.radius;
        hazard.y = hazard.pivotY + Math.cos(hazard.currentAngle) * hazard.radius;
      }
    } else if (hazard.type === 'laser_beam') {
      hazard.timer = ((hazard.timer || 0) + dt) % (hazard.pulsePeriod || 3);
      hazard.isActive = hazard.timer < (hazard.activeTime || 1.5);
    }
  });
}

function resolveHorizontalCollisions(player: Player, platforms: Platform[]) {
  for (const plat of platforms) {
    if (plat.isVanished) continue;
    // Allow jumping through cloud bounce & speed strip sides
    if (plat.type === 'cloud_bounce' || plat.type === 'speed_strip') continue;

    if (
      player.x < plat.x + plat.width &&
      player.x + player.width > plat.x &&
      player.y < plat.y + plat.height - 4 &&
      player.y + player.height > plat.y + 4
    ) {
      if (player.vx > 0) {
        player.x = plat.x - player.width;
        player.vx = 0;
      } else if (player.vx < 0) {
        player.x = plat.x + plat.width;
        player.vx = 0;
      }
    }
  }
}

function resolveVerticalCollisions(player: Player, platforms: Platform[], particles: Particle[]) {
  for (const plat of platforms) {
    if (plat.isVanished) continue;

    // Check collision bounding box
    if (
      player.x + player.width > plat.x + 3 &&
      player.x < plat.x + plat.width - 3 &&
      player.y + player.height >= plat.y &&
      player.y + player.height <= plat.y + plat.height + Math.max(10, player.vy + 4)
    ) {
      // Landing on top of platform
      if (player.vy >= 0) {
        player.y = plat.y - player.height;
        player.vy = 0;
        player.isGrounded = true;

        // Bouncy Cloud Pad interaction!
        if (plat.type === 'cloud_bounce') {
          player.vy = plat.bounceForce || -17.5;
          player.isGrounded = false;
          player.squashX = 1.35;
          player.squashY = 0.65;
          soundManager.playBounce();

          // Cloud bounce puff particles
          for (let i = 0; i < 18; i++) {
            particles.push({
              x: plat.x + Math.random() * plat.width,
              y: plat.y + 10,
              vx: (Math.random() - 0.5) * 6,
              vy: -(Math.random() * 4 + 1),
              size: Math.random() * 7 + 4,
              color: ['#FFF', '#00D2D3', '#FFD233', '#FF8533'][i % 4],
              alpha: 0.9,
              life: 0,
              maxLife: 0.45,
              shape: 'circle',
            });
          }
          return;
        }

        // Speed strip boost!
        if (plat.type === 'speed_strip') {
          player.vx = player.facing * (plat.speedBoost || 7);
          soundManager.playDash();
        }

        // Vanishing tile activation
        if (plat.type === 'vanishing') {
          if (plat.vanishTimer === undefined) {
            plat.vanishTimer = plat.vanishDuration || 0.8;
          }
        }

        // Moving platform carrying
        if (plat.type === 'moving') {
          player.isOnMovingPlatform = true;
          player.movingPlatformVx = plat.moveVx || 0;
          player.movingPlatformVy = plat.moveVy || 0;
        }

        // Landing squash animation
        if (player.squashY > 0.85) {
          player.squashX = 1.25;
          player.squashY = 0.75;
        }
      }
    } else if (
      plat.type === 'solid' &&
      player.x + player.width > plat.x + 3 &&
      player.x < plat.x + plat.width - 3 &&
      player.y <= plat.y + plat.height &&
      player.y >= plat.y + plat.height - 12 &&
      player.vy < 0
    ) {
      // Hitting bottom of platform
      player.y = plat.y + plat.height;
      player.vy = 0;
    }
  }
}

function checkHazardCollisions(player: Player, hazards: Hazard[]): boolean {
  const pBox = {
    x: player.x + 4,
    y: player.y + 4,
    w: player.width - 8,
    h: player.height - 8,
  };
  const pCenter = {
    x: player.x + player.width / 2,
    y: player.y + player.height / 2,
  };

  for (const h of hazards) {
    if (h.type === 'spike') {
      if (
        pBox.x < h.x + h.width &&
        pBox.x + pBox.w > h.x &&
        pBox.y < h.y + h.height &&
        pBox.y + pBox.h > h.y + 6
      ) {
        return true;
      }
    } else if (h.type === 'spinner') {
      const angle = h.angle || 0;
      const len = h.length || 80;
      const x1 = h.x;
      const y1 = h.y;
      const x2 = h.x + Math.cos(angle) * len;
      const y2 = h.y + Math.sin(angle) * len;
      const x3 = h.x - Math.cos(angle) * len;
      const y3 = h.y - Math.sin(angle) * len;

      if (
        distToSegment(pCenter.x, pCenter.y, x1, y1, x2, y2) < 14 ||
        distToSegment(pCenter.x, pCenter.y, x1, y1, x3, y3) < 14
      ) {
        return true;
      }
    } else if (h.type === 'pendulum') {
      const radius = 18;
      const dx = pCenter.x - h.x;
      const dy = pCenter.y - h.y;
      if (Math.sqrt(dx * dx + dy * dy) < radius + 12) {
        return true;
      }
    } else if (h.type === 'laser_beam' && h.isActive) {
      if (
        pBox.x < h.x + h.width &&
        pBox.x + pBox.w > h.x &&
        pBox.y < h.y + h.height &&
        pBox.y + pBox.h > h.y
      ) {
        return true;
      }
    }
  }
  return false;
}

function distToSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
  const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
}

function killPlayer(player: Player, onPlayerDeath: () => void, particles: Particle[]) {
  if (!player.isAlive) return;
  player.isAlive = false;
  player.respawnCountdown = 0.55; // Quick snappy respawn!
  soundManager.playDeath();
  onPlayerDeath();

  // Rainbow explosion particles
  for (let i = 0; i < 28; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 7 + 2;
    particles.push({
      x: player.x + player.width / 2,
      y: player.y + player.height / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 8 + 4,
      color: ['#FF4B4B', '#FF8533', '#FFD233', '#2ECC71', '#00D2D3', '#9B59B6', '#FFF'][i % 7],
      alpha: 1,
      life: 0,
      maxLife: 0.6,
      shape: 'sparkle',
    });
  }
}

function respawnPlayer(player: Player, level: LevelData, particles: Particle[]) {
  player.isAlive = true;
  const spawnPos = player.currentCheckpoint || level.spawn;
  player.x = spawnPos.x;
  player.y = spawnPos.y - 20;
  player.vx = 0;
  player.vy = 0;
  player.jumpsLeft = player.maxJumps;
  player.trail = [];

  // Spawn cloud pop
  for (let i = 0; i < 16; i++) {
    particles.push({
      x: player.x + player.width / 2,
      y: player.y + player.height / 2,
      vx: (Math.random() - 0.5) * 5,
      vy: -(Math.random() * 4 + 1),
      size: Math.random() * 6 + 4,
      color: '#FFF',
      alpha: 0.9,
      life: 0,
      maxLife: 0.4,
      shape: 'circle',
    });
  }
}

function spawnGroundPuff(player: Player, particles: Particle[]) {
  for (let i = 0; i < 8; i++) {
    particles.push({
      x: player.x + player.width / 2 + (Math.random() - 0.5) * player.width,
      y: player.y + player.height - 2,
      vx: (Math.random() - 0.5) * 3,
      vy: -(Math.random() * 1.5 + 0.5),
      size: Math.random() * 5 + 3,
      color: '#FFFFFF',
      alpha: 0.8,
      life: 0,
      maxLife: 0.35,
      shape: 'circle',
    });
  }
}
