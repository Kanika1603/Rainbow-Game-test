import { Player, Platform, Hazard, StarCollectible, Checkpoint, Particle, LevelData, CustomizationSettings } from '../types';
import { RAINBOW_COLORS } from './levels';

export interface Camera {
  x: number;
  y: number;
  shake: number;
}

export function createCamera(): Camera {
  return { x: 0, y: 0, shake: 0 };
}

export function updateCamera(camera: Camera, player: Player, level: LevelData, viewWidth: number, viewHeight: number, dt: number) {
  // Target position: center player with lookahead
  const lookAhead = player.facing * 90;
  const targetX = player.x + player.width / 2 + lookAhead - viewWidth / 2;
  const targetY = player.y + player.height / 2 - viewHeight / 2;

  // Smooth lerp
  camera.x += (targetX - camera.x) * 0.1;
  camera.y += (targetY - camera.y) * 0.1;

  // Camera boundaries
  camera.x = Math.max(0, Math.min(level.worldWidth - viewWidth, camera.x));
  camera.y = Math.max(-150, Math.min(level.worldHeight - viewHeight + 80, camera.y));

  // Camera screen shake decay
  if (camera.shake > 0) {
    camera.shake = Math.max(0, camera.shake - dt * 18);
  }
}

export function renderGame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  player: Player,
  level: LevelData,
  camera: Camera,
  particles: Particle[],
  customization: CustomizationSettings,
  gameTime: number
) {
  ctx.save();
  ctx.clearRect(0, 0, width, height);

  // 1. Render Parallax Sky & Rainbow Background
  renderSky(ctx, width, height, level.skyTheme, camera, gameTime);

  // Apply camera transformation (with screen shake)
  ctx.save();
  const shakeX = (Math.random() - 0.5) * camera.shake * 5;
  const shakeY = (Math.random() - 0.5) * camera.shake * 5;
  ctx.translate(-Math.round(camera.x + shakeX), -Math.round(camera.y + shakeY));

  // 2. Parallax Rainbow Arch & Distant Clouds
  renderParallaxDecor(ctx, level, camera, gameTime);

  // 3. Render Checkpoints
  renderCheckpoints(ctx, level.checkpoints, gameTime);

  // 4. Render Goal Arch & Trophy
  renderGoal(ctx, level.goal, gameTime);

  // 5. Render Platforms
  renderPlatforms(ctx, level.platforms, gameTime);

  // 6. Render Hazards
  renderHazards(ctx, level.hazards, gameTime);

  // 7. Render Stars
  renderStars(ctx, level.stars, gameTime);

  // 8. Render Particles
  renderParticles(ctx, particles, dtParticles);

  // 9. Render Player & Trail
  if (player.isAlive) {
    renderPlayer(ctx, player, customization, gameTime);
  }

  ctx.restore();
  ctx.restore();
}

let lastTime = 0;
let dtParticles = 0.016;

function renderSky(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  skyTheme: LevelData['skyTheme'],
  camera: Camera,
  time: number
) {
  const grad = ctx.createLinearGradient(0, 0, 0, height);

  if (skyTheme === 'noon') {
    grad.addColorStop(0, '#56CCF2');
    grad.addColorStop(0.65, '#D5EEFD');
    grad.addColorStop(1, '#FFF2D6');
  } else if (skyTheme === 'sunrise') {
    grad.addColorStop(0, '#FFA07A');
    grad.addColorStop(0.5, '#FFD1DC');
    grad.addColorStop(1, '#B0E0E6');
  } else if (skyTheme === 'twilight') {
    grad.addColorStop(0, '#2C3E50');
    grad.addColorStop(0.5, '#FD746C');
    grad.addColorStop(1, '#FFA07A');
  } else if (skyTheme === 'aurora') {
    grad.addColorStop(0, '#0B0C1E');
    grad.addColorStop(0.4, '#192A56');
    grad.addColorStop(0.75, '#00D2D3');
    grad.addColorStop(1, '#9B59B6');
  } else {
    // cosmic
    grad.addColorStop(0, '#0F0C29');
    grad.addColorStop(0.5, '#302B63');
    grad.addColorStop(1, '#24243E');
  }

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Distant glowing stars for darker themes
  if (skyTheme === 'aurora' || skyTheme === 'cosmic' || skyTheme === 'twilight') {
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 45; i++) {
      const sx = ((i * 137.5 + time * 6) % width);
      const sy = ((i * 83.2) % (height * 0.7));
      const sAlpha = 0.3 + Math.sin(time * 3 + i) * 0.25;
      ctx.globalAlpha = Math.max(0.1, sAlpha);
      ctx.fillRect(sx, sy, (i % 3 === 0) ? 2.5 : 1.5, (i % 3 === 0) ? 2.5 : 1.5);
    }
    ctx.restore();
  }
}

function renderParallaxDecor(ctx: CanvasRenderingContext2D, level: LevelData, camera: Camera, time: number) {
  // Giant Rainbow in the backdrop
  ctx.save();
  const rainbowX = camera.x * 0.3 + 300;
  const rainbowY = level.worldHeight * 0.55;
  const outerR = 600;
  const bandThickness = 14;

  RAINBOW_COLORS.forEach((color, i) => {
    ctx.beginPath();
    ctx.arc(rainbowX, rainbowY, outerR - i * bandThickness, Math.PI, 0, false);
    ctx.strokeStyle = color;
    ctx.lineWidth = bandThickness + 0.8;
    ctx.globalAlpha = 0.32;
    ctx.stroke();
  });
  ctx.restore();

  // Floating background puffy clouds
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  for (let c = 0; c < 14; c++) {
    const cx = (c * 340 + time * 12) % (level.worldWidth + 400) - 200;
    const cy = 200 + (c % 4) * 160 + Math.sin(time + c) * 12;
    const scale = 0.7 + (c % 3) * 0.3;

    ctx.globalAlpha = 0.28 + (c % 2) * 0.15;
    drawPuffyCloud(ctx, cx, cy, scale);
  }
  ctx.restore();
}

function drawPuffyCloud(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.beginPath();
  ctx.arc(0, 0, 30, 0, Math.PI * 2);
  ctx.arc(32, -8, 38, 0, Math.PI * 2);
  ctx.arc(75, 2, 28, 0, Math.PI * 2);
  ctx.arc(42, 16, 32, 0, Math.PI * 2);
  ctx.arc(8, 14, 25, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function renderPlatforms(ctx: CanvasRenderingContext2D, platforms: Platform[], time: number) {
  platforms.forEach((plat) => {
    if (plat.isVanished) return;

    ctx.save();

    // Shaking if vanishing platform is countdown active
    let offsetX = 0;
    let offsetY = 0;
    if (plat.type === 'vanishing' && plat.vanishTimer !== undefined) {
      const shakeIntensity = (1 - (plat.vanishTimer / (plat.vanishDuration || 1))) * 3.5;
      offsetX = (Math.random() - 0.5) * shakeIntensity;
      offsetY = (Math.random() - 0.5) * shakeIntensity;
    }

    const x = plat.x + offsetX;
    const y = plat.y + offsetY;
    const w = plat.width;
    const h = plat.height;

    if (plat.type === 'cloud_bounce') {
      // Fluffy bouncy rainbow cloud
      renderCloudBouncePlatform(ctx, x, y, w, h, time);
    } else if (plat.type === 'speed_strip') {
      // Neon turbo speed strip
      renderSpeedStripPlatform(ctx, x, y, w, h, time);
    } else if (plat.pattern === 'rainbow_stripes') {
      // Multi-band spectral rainbow platform
      renderRainbowPlatform(ctx, x, y, w, h);
    } else if (plat.type === 'vanishing') {
      // Prismatic glass vanishing block
      renderVanishingPlatform(ctx, x, y, w, h, plat, time);
    } else {
      // Solid / Moving colored platform
      renderStandardPlatform(ctx, x, y, w, h, plat.color || '#3498DB', plat.type === 'moving', time);
    }

    ctx.restore();
  });
}

function renderRainbowPlatform(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  // Rounded base
  const r = 10;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.clip();

  // Draw 7 spectral color vertical bands
  const bandW = w / 7;
  RAINBOW_COLORS.forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.fillRect(x + i * bandW, y, bandW + 1, h);
  });

  // Top highlight gloss
  const glossGrad = ctx.createLinearGradient(x, y, x, y + h * 0.45);
  glossGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
  glossGrad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
  ctx.fillStyle = glossGrad;
  ctx.fillRect(x, y, w, h * 0.45);

  ctx.restore();

  // Subtle outer glow outline
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.stroke();
}

function renderStandardPlatform(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  isMoving: boolean,
  time: number
) {
  const r = 8;
  ctx.save();

  // Drop shadow
  ctx.shadowColor = 'rgba(0,0,0,0.18)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 4;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  // Top gloss
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.beginPath();
  ctx.roundRect(x + 2, y + 2, w - 4, (h - 4) * 0.45, 5);
  ctx.fill();

  // Moving platform thrusters
  if (isMoving) {
    const thrusterOffset = Math.sin(time * 12) * 3;
    ctx.fillStyle = '#FFD233';
    ctx.beginPath();
    ctx.arc(x + 18, y + h + 3, 5 + thrusterOffset * 0.4, 0, Math.PI * 2);
    ctx.arc(x + w - 18, y + h + 3, 5 + thrusterOffset * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function renderCloudBouncePlatform(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  time: number
) {
  ctx.save();
  // Cloud base
  const cloudGrad = ctx.createLinearGradient(x, y, x, y + h);
  cloudGrad.addColorStop(0, '#FFFFFF');
  cloudGrad.addColorStop(0.7, '#E0F7FA');
  cloudGrad.addColorStop(1, '#B2EBF2');

  ctx.fillStyle = cloudGrad;
  ctx.shadowColor = 'rgba(0, 210, 211, 0.4)';
  ctx.shadowBlur = 12;

  // Cloud circles
  const bubbleCount = 4;
  const radius = h * 0.75;
  for (let i = 0; i < bubbleCount; i++) {
    const bx = x + (i / (bubbleCount - 1)) * (w - radius * 1.5) + radius * 0.75;
    const by = y + h * 0.5 + Math.sin(time * 4 + i) * 1.5;
    ctx.beginPath();
    ctx.arc(bx, by, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bouncy spring rainbow chevron in center
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = '#00D2D3';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  const midX = x + w / 2;
  const midY = y + h * 0.45;
  ctx.beginPath();
  ctx.moveTo(midX - 10, midY + 4);
  ctx.lineTo(midX, midY - 6);
  ctx.lineTo(midX + 10, midY + 4);
  ctx.stroke();

  ctx.restore();
}

function renderSpeedStripPlatform(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  time: number
) {
  const r = 8;
  ctx.save();
  ctx.fillStyle = '#FF8533';
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();

  // Sliding arrows
  ctx.fillStyle = '#FFF275';
  const arrowSpacing = 28;
  const offset = (time * 80) % arrowSpacing;

  for (let ax = x + offset - arrowSpacing; ax < x + w - 10; ax += arrowSpacing) {
    if (ax > x + 6 && ax < x + w - 14) {
      ctx.beginPath();
      ctx.moveTo(ax, y + 5);
      ctx.lineTo(ax + 10, y + h / 2);
      ctx.lineTo(ax, y + h - 5);
      ctx.lineTo(ax + 4, y + h / 2);
      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.restore();
}

function renderVanishingPlatform(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  plat: Platform,
  time: number
) {
  const r = 6;
  ctx.save();

  // Alpha pulses when stepped on
  let alpha = 0.85;
  if (plat.vanishTimer !== undefined) {
    const ratio = plat.vanishTimer / (plat.vanishDuration || 1);
    alpha = Math.max(0.2, ratio * 0.85 + (Math.sin(time * 30) > 0 ? 0.2 : -0.1));
  }

  ctx.globalAlpha = alpha;
  ctx.fillStyle = plat.color || '#2ECC71';
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();

  // Crystal glass lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x + 8, y + h - 4);
  ctx.lineTo(x + w - 8, y + 4);
  ctx.stroke();

  ctx.restore();
}

function renderHazards(ctx: CanvasRenderingContext2D, hazards: Hazard[], time: number) {
  hazards.forEach((h) => {
    ctx.save();
    if (h.type === 'spike') {
      renderSpikeRow(ctx, h.x, h.y, h.width, h.height, h.color || '#FF4B4B');
    } else if (h.type === 'spinner') {
      renderSpinner(ctx, h, time);
    } else if (h.type === 'pendulum') {
      renderPendulum(ctx, h);
    } else if (h.type === 'laser_beam') {
      renderLaserBeam(ctx, h, time);
    }
    ctx.restore();
  });
}

function renderSpikeRow(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  const spikeW = 16;
  const count = Math.floor(w / spikeW);

  for (let i = 0; i < count; i++) {
    const sx = x + i * spikeW;
    ctx.fillStyle = RAINBOW_COLORS[i % RAINBOW_COLORS.length];
    ctx.beginPath();
    ctx.moveTo(sx, y + h);
    ctx.lineTo(sx + spikeW / 2, y);
    ctx.lineTo(sx + spikeW, y + h);
    ctx.closePath();
    ctx.fill();

    // Specular edge
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function renderSpinner(ctx: CanvasRenderingContext2D, h: Hazard, time: number) {
  const angle = h.angle || 0;
  const len = h.length || 80;

  ctx.save();
  ctx.translate(h.x, h.y);

  // Central glowing core
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = h.color || '#FF4B4B';
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fill();

  // 4-arm or 2-arm spinning laser beam
  ctx.rotate(angle);
  for (let arm = 0; arm < 2; arm++) {
    ctx.rotate(Math.PI);
    const grad = ctx.createLinearGradient(0, 0, len, 0);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.5, h.color || '#FF4B4B');
    grad.addColorStop(1, 'rgba(255, 75, 75, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(len, -2);
    ctx.lineTo(len + 8, 0);
    ctx.lineTo(len, 2);
    ctx.lineTo(0, 6);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

function renderPendulum(ctx: CanvasRenderingContext2D, h: Hazard) {
  if (h.pivotX === undefined || h.pivotY === undefined) return;
  ctx.save();

  // Connecting cord
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(h.pivotX, h.pivotY);
  ctx.lineTo(h.x, h.y);
  ctx.stroke();

  // Pivot point
  ctx.fillStyle = '#FFD233';
  ctx.beginPath();
  ctx.arc(h.pivotX, h.pivotY, 6, 0, Math.PI * 2);
  ctx.fill();

  // Swinging spiked prismatic orb
  ctx.translate(h.x, h.y);
  ctx.fillStyle = h.color || '#FF4B4B';
  ctx.shadowColor = h.color || '#FF4B4B';
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.fill();

  // Outer crystal spikes
  ctx.fillStyle = '#FFD233';
  for (let s = 0; s < 6; s++) {
    const a = (s / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a - 0.2) * 15, Math.sin(a - 0.2) * 15);
    ctx.lineTo(Math.cos(a) * 23, Math.sin(a) * 23);
    ctx.lineTo(Math.cos(a + 0.2) * 15, Math.sin(a + 0.2) * 15);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

function renderLaserBeam(ctx: CanvasRenderingContext2D, h: Hazard, time: number) {
  ctx.save();
  const isActive = h.isActive;

  if (isActive) {
    // Full blazing laser
    ctx.shadowColor = h.color || '#00D2D3';
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(h.x + 2, h.y, h.width - 4, h.height);

    ctx.fillStyle = h.color || '#00D2D3';
    ctx.globalAlpha = 0.8;
    ctx.fillRect(h.x, h.y, h.width, h.height);
  } else {
    // Warning flicker beam
    ctx.strokeStyle = h.color || '#00D2D3';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.globalAlpha = 0.4 + Math.sin(time * 20) * 0.3;
    ctx.beginPath();
    ctx.moveTo(h.x + h.width / 2, h.y);
    ctx.lineTo(h.x + h.width / 2, h.y + h.height);
    ctx.stroke();
  }

  // Laser emitters at top and bottom
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#333333';
  ctx.fillRect(h.x - 4, h.y - 6, h.width + 8, 8);
  ctx.fillRect(h.x - 4, h.y + h.height - 2, h.width + 8, 8);

  ctx.restore();
}

function renderCheckpoints(ctx: CanvasRenderingContext2D, checkpoints: Checkpoint[], time: number) {
  checkpoints.forEach((cp) => {
    ctx.save();
    const cx = cp.x + cp.width / 2;
    const cy = cp.y + cp.height;

    // Base cloud pad
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(cx, cy - 4, 28, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pole
    ctx.strokeStyle = '#BDC3C7';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 4);
    ctx.lineTo(cx, cy - 65);
    ctx.stroke();

    // Flag
    const wave = Math.sin(time * 6 + cp.x) * 4;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 65);
    ctx.lineTo(cx + 34, cy - 50 + wave);
    ctx.lineTo(cx, cy - 35);
    ctx.closePath();

    if (cp.activated) {
      // Fluttering rainbow flag with ascending light pillar!
      const flagGrad = ctx.createLinearGradient(cx, cy - 65, cx + 34, cy - 35);
      flagGrad.addColorStop(0, '#FF4B4B');
      flagGrad.addColorStop(0.5, '#FFD233');
      flagGrad.addColorStop(1, '#00D2D3');
      ctx.fillStyle = flagGrad;
      ctx.fill();

      // Rainbow light pillar
      const beamGrad = ctx.createLinearGradient(cx - 15, cy - 200, cx + 15, cy);
      beamGrad.addColorStop(0, 'rgba(0, 210, 211, 0)');
      beamGrad.addColorStop(1, 'rgba(46, 204, 113, 0.35)');
      ctx.fillStyle = beamGrad;
      ctx.fillRect(cx - 14, cy - 240, 28, 240);
    } else {
      ctx.fillStyle = '#95A5A6';
      ctx.fill();
    }

    ctx.restore();
  });
}

function renderGoal(ctx: CanvasRenderingContext2D, goal: { x: number; y: number; width: number; height: number }, time: number) {
  ctx.save();
  const gx = goal.x + goal.width / 2;
  const gy = goal.y + goal.height;

  // Giant Rainbow Finish Arch
  const archRadius = 55;
  const bandW = 4;
  RAINBOW_COLORS.forEach((col, i) => {
    ctx.beginPath();
    ctx.arc(gx, gy - 20, archRadius - i * bandW, Math.PI, 0, false);
    ctx.strokeStyle = col;
    ctx.lineWidth = bandW + 0.5;
    ctx.shadowColor = col;
    ctx.shadowBlur = 10;
    ctx.stroke();
  });

  // Finish Banner
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#FFD233';
  ctx.beginPath();
  ctx.roundRect(gx - 36, gy - archRadius - 38, 72, 22, 6);
  ctx.fill();

  ctx.fillStyle = '#2C3E50';
  ctx.font = 'bold 12px "Fredoka", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('FINISH!', gx, gy - archRadius - 27);

  // Golden Pot of Rainbow Gold underneath
  const bob = Math.sin(time * 3) * 4;
  ctx.fillStyle = '#F39C12';
  ctx.beginPath();
  ctx.ellipse(gx, gy - 12 + bob, 22, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Sparkles
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(gx + Math.sin(time * 5) * 16, gy - 24 + bob, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function renderStars(ctx: CanvasRenderingContext2D, stars: StarCollectible[], time: number) {
  stars.forEach((star) => {
    if (star.collected) return;
    ctx.save();
    const bob = Math.sin(time * 3.5 + star.pulseOffset) * 6;
    const rot = time * 1.8 + star.pulseOffset;

    ctx.translate(star.x, star.y + bob);
    ctx.rotate(rot);

    // Glowing aura
    ctx.shadowColor = '#FFD233';
    ctx.shadowBlur = 16;

    // Draw 5-pointed star
    drawStarShape(ctx, 0, 0, 5, 16, 8, '#FFD233', '#FFFFFF');

    ctx.restore();
  });
}

function drawStarShape(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number,
  fillColor: string,
  strokeColor: string
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();

  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 1.8;
  ctx.stroke();
}

function renderPlayer(
  ctx: CanvasRenderingContext2D,
  player: Player,
  customization: CustomizationSettings,
  time: number
) {
  ctx.save();

  // 1. Render Player Trail
  if (player.trail.length > 1) {
    renderPlayerTrail(ctx, player.trail, customization.trail);
  }

  // 2. Render Player Body
  const px = player.x + player.width / 2;
  const py = player.y + player.height / 2;

  ctx.translate(px, py);
  ctx.scale(player.facing * player.squashX, player.squashY);

  const w = player.width;
  const h = player.height;

  // Selected Runner Color or Rainbow shift
  const colorList = ['#FF4B4B', '#FF8533', '#FFD233', '#2ECC71', '#00D2D3', '#3498DB', '#9B59B6', '#FFFFFF'];
  const playerColor = colorList[customization.colorIndex % colorList.length];

  // Character soft rounded pill body
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 4;

  ctx.fillStyle = playerColor;
  ctx.beginPath();
  ctx.roundRect(-w / 2, -h / 2, w, h, 14);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  // Rainbow belly patch
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(-w / 2 + 4, -h / 2 + 8, w - 8, h - 14, 10);
  ctx.clip();
  const bellyBandH = (h - 14) / 7;
  RAINBOW_COLORS.forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.fillRect(-w / 2 + 4, -h / 2 + 8 + i * bellyBandH, w - 8, bellyBandH + 1);
  });
  ctx.restore();

  // Expressive Eyes (with blink and direction tracking)
  const eyeOffsetX = 5;
  const eyeOffsetY = -5;
  const eyeR = 4.5;

  if (player.isBlinking) {
    // Closed happy curve eyes
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(eyeOffsetX, eyeOffsetY, 4, 0, Math.PI);
    ctx.stroke();
  } else {
    // Open eyes with sparkle
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(eyeOffsetX, eyeOffsetY, eyeR, 0, Math.PI * 2);
    ctx.fill();

    // Pupil
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(eyeOffsetX + 1.5, eyeOffsetY, eyeR * 0.58, 0, Math.PI * 2);
    ctx.fill();

    // White eye shine
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(eyeOffsetX + 1, eyeOffsetY - 1.2, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Rosy cheek blush
  ctx.fillStyle = 'rgba(255, 105, 180, 0.55)';
  ctx.beginPath();
  ctx.arc(eyeOffsetX - 2, eyeOffsetY + 7, 3, 0, Math.PI * 2);
  ctx.fill();

  // Render Hats / Accessories
  renderHat(ctx, customization.hat, -w / 2, -h / 2, w, h, time);

  ctx.restore();
}

function renderPlayerTrail(ctx: CanvasRenderingContext2D, trail: Player['trail'], style: CustomizationSettings['trail']) {
  ctx.save();
  for (let i = 0; i < trail.length; i++) {
    const pt = trail[i];
    const alpha = (1 - i / trail.length) * 0.7;
    const size = pt.size * (1 - i / trail.length);

    ctx.globalAlpha = alpha;
    ctx.fillStyle = pt.color;

    if (style === 'sparkle' || style === 'starlight') {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (style === 'bubble') {
      ctx.strokeStyle = pt.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, size * 0.6, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Default rainbow ribbon
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, size * 0.75, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function renderHat(
  ctx: CanvasRenderingContext2D,
  hat: CustomizationSettings['hat'],
  x: number,
  y: number,
  w: number,
  h: number,
  time: number
) {
  if (hat === 'rainbow_crown') {
    // Golden crown with rainbow jewels
    ctx.fillStyle = '#FFD233';
    ctx.beginPath();
    ctx.moveTo(-10, y + 2);
    ctx.lineTo(-12, y - 10);
    ctx.lineTo(-4, y - 5);
    ctx.lineTo(0, y - 13);
    ctx.lineTo(4, y - 5);
    ctx.lineTo(12, y - 10);
    ctx.lineTo(10, y + 2);
    ctx.closePath();
    ctx.fill();

    // Center ruby jewel
    ctx.fillStyle = '#FF4B4B';
    ctx.beginPath();
    ctx.arc(0, y - 6, 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (hat === 'cloud_wings') {
    // Tiny fluttering angel/cloud wings on back
    const wingFlap = Math.sin(time * 15) * 3;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(-w / 2 - 4, -2 + wingFlap, 9, 5, -0.4, 0, Math.PI * 2);
    ctx.fill();
  } else if (hat === 'star_halo') {
    // Floating star halo
    const haloBob = Math.sin(time * 4) * 2;
    ctx.strokeStyle = '#FFD233';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(0, y - 9 + haloBob, 12, 4, 0, 0, Math.PI * 2);
    ctx.stroke();
  } else if (hat === 'unicorn_horn') {
    // Spiral rainbow unicorn horn
    ctx.fillStyle = '#FF8533';
    ctx.beginPath();
    ctx.moveTo(-3, y + 2);
    ctx.lineTo(0, y - 16);
    ctx.lineTo(4, y + 2);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#FFD233';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
}

function renderParticles(ctx: CanvasRenderingContext2D, particles: Particle[], dt: number) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life += dt;
    if (p.life >= p.maxLife) {
      particles.splice(i, 1);
      continue;
    }

    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.08; // subtle particle gravity

    const progress = p.life / p.maxLife;
    const currentAlpha = (1 - progress) * p.alpha;
    const currentSize = p.size * (1 - progress * 0.5);

    ctx.save();
    ctx.globalAlpha = Math.max(0, currentAlpha);
    ctx.fillStyle = p.color;

    if (p.shape === 'star') {
      drawStarShape(ctx, p.x, p.y, 4, currentSize, currentSize * 0.45, p.color, '#FFF');
    } else if (p.shape === 'sparkle') {
      // 4-point sparkle cross
      ctx.beginPath();
      ctx.moveTo(p.x - currentSize, p.y);
      ctx.lineTo(p.x + currentSize, p.y);
      ctx.moveTo(p.x, p.y - currentSize);
      ctx.lineTo(p.x, p.y + currentSize);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
