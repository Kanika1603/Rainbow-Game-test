import { LevelData, Platform, Hazard, StarCollectible, Checkpoint } from '../types';

export const RAINBOW_COLORS = [
  '#FF4B4B', // Red
  '#FF8533', // Orange
  '#FFD233', // Yellow
  '#2ECC71', // Green
  '#00D2D3', // Cyan
  '#3498DB', // Blue
  '#9B59B6', // Violet
];

export const LEVELS: LevelData[] = [
  // ================= STAGE 1 =================
  {
    id: 1,
    name: 'Stage 1: Pastel Cloud Walk',
    subtitle: 'Learn the rainbow basics & bouncy clouds',
    description: 'Jump across vibrant rainbow bridges and leap on springy clouds to reach the rainbow arch!',
    parTime: 25,
    worldWidth: 2600,
    worldHeight: 900,
    skyTheme: 'noon',
    spawn: { x: 100, y: 650 },
    goal: { x: 2380, y: 550, width: 80, height: 100 },
    checkpoints: [
      { id: 'cp1_1', x: 1100, y: 640, width: 60, height: 40, activated: false }
    ],
    stars: [
      { id: 's1_1', x: 480, y: 560, collected: false, pulseOffset: 0 },
      { id: 's1_2', x: 1350, y: 440, collected: false, pulseOffset: 1.5 },
      { id: 's1_3', x: 1980, y: 390, collected: false, pulseOffset: 3.0 },
    ],
    platforms: [
      // Starting platform (Rainbow stripes)
      { id: 'p1_start', x: 50, y: 720, width: 220, height: 40, type: 'solid', color: '#FF4B4B', pattern: 'rainbow_stripes' },

      // Stepping rainbow stones
      { id: 'p1_2', x: 330, y: 700, width: 110, height: 26, type: 'solid', color: '#FF8533' },
      { id: 'p1_3', x: 470, y: 650, width: 100, height: 26, type: 'solid', color: '#FFD233' },
      { id: 'p1_4', x: 610, y: 620, width: 110, height: 26, type: 'solid', color: '#2ECC71' },

      // Bouncy Cloud 1!
      { id: 'p1_cloud1', x: 770, y: 670, width: 100, height: 35, type: 'cloud_bounce', bounceForce: -16.5, pattern: 'cloud' },

      // High landing after bounce
      { id: 'p1_5', x: 920, y: 480, width: 120, height: 26, type: 'solid', color: '#00D2D3' },

      // Checkpoint platform
      { id: 'p1_cp_plat', x: 1070, y: 680, width: 170, height: 30, type: 'solid', color: '#3498DB', pattern: 'rainbow_stripes' },

      // Moving Rainbow Platform
      {
        id: 'p1_mov1',
        x: 1280,
        y: 650,
        width: 120,
        height: 24,
        type: 'moving',
        color: '#9B59B6',
        startX: 1280,
        startY: 650,
        targetX: 1540,
        targetY: 650,
        moveSpeed: 1.6,
        moveProgress: 0,
      },

      // Platform after moving one
      { id: 'p1_6', x: 1690, y: 630, width: 110, height: 26, type: 'solid', color: '#FF4B4B' },

      // Second Super Cloud Launcher
      { id: 'p1_cloud2', x: 1850, y: 680, width: 110, height: 35, type: 'cloud_bounce', bounceForce: -18, pattern: 'cloud' },

      // High aerial bridge
      { id: 'p1_7', x: 1960, y: 460, width: 140, height: 24, type: 'solid', color: '#FF8533' },
      { id: 'p1_8', x: 2140, y: 520, width: 120, height: 24, type: 'solid', color: '#FFD233' },

      // Final victory platform
      { id: 'p1_goal_plat', x: 2300, y: 650, width: 220, height: 40, type: 'solid', color: '#2ECC71', pattern: 'rainbow_stripes' },
    ],
    hazards: [
      // Crystal spikes at the bottom gap
      { id: 'h1_spk1', type: 'spike', x: 740, y: 880, width: 180, height: 25, color: '#FF4B4B' },
      { id: 'h1_spk2', type: 'spike', x: 1250, y: 880, width: 380, height: 25, color: '#FF8533' },
      { id: 'h1_spk3', type: 'spike', x: 1800, y: 880, width: 300, height: 25, color: '#9B59B6' },
    ],
  },

  // ================= STAGE 2 =================
  {
    id: 2,
    name: 'Stage 2: Prismatic Pendulums',
    subtitle: 'Vanishing glass & swinging rainbow hazards',
    description: 'Blink and they disappear! Run fast across vanishing spectrum tiles and time your jumps past swinging crystals.',
    parTime: 32,
    worldWidth: 2900,
    worldHeight: 950,
    skyTheme: 'sunrise',
    spawn: { x: 90, y: 620 },
    goal: { x: 2680, y: 480, width: 80, height: 100 },
    checkpoints: [
      { id: 'cp2_1', x: 1280, y: 620, width: 60, height: 40, activated: false }
    ],
    stars: [
      { id: 's2_1', x: 620, y: 450, collected: false, pulseOffset: 0.5 },
      { id: 's2_2', x: 1600, y: 380, collected: false, pulseOffset: 2.0 },
      { id: 's2_3', x: 2360, y: 320, collected: false, pulseOffset: 1.0 },
    ],
    platforms: [
      { id: 'p2_start', x: 50, y: 700, width: 200, height: 40, type: 'solid', color: '#FF4B4B', pattern: 'rainbow_stripes' },

      // Vanishing rainbow steps
      { id: 'p2_v1', x: 290, y: 680, width: 90, height: 22, type: 'vanishing', color: '#FF8533', vanishDuration: 0.9 },
      { id: 'p2_v2', x: 420, y: 640, width: 90, height: 22, type: 'vanishing', color: '#FFD233', vanishDuration: 0.9 },
      { id: 'p2_v3', x: 550, y: 600, width: 90, height: 22, type: 'vanishing', color: '#2ECC71', vanishDuration: 0.9 },

      // Rest platform with crystal arch
      { id: 'p2_solid1', x: 690, y: 620, width: 140, height: 26, type: 'solid', color: '#00D2D3' },

      // Vertical Moving Platform
      {
        id: 'p2_mov_v',
        x: 880,
        y: 650,
        width: 100,
        height: 24,
        type: 'moving',
        color: '#3498DB',
        startX: 880,
        startY: 650,
        targetX: 880,
        targetY: 420,
        moveSpeed: 1.8,
        moveProgress: 0,
      },

      // High bridge
      { id: 'p2_solid2', x: 1030, y: 440, width: 130, height: 26, type: 'solid', color: '#9B59B6' },

      // Slide down to checkpoint
      { id: 'p2_cp_plat', x: 1240, y: 660, width: 180, height: 32, type: 'solid', color: '#FF4B4B', pattern: 'rainbow_stripes' },

      // Bouncy cloud into pendulum gauntlet
      { id: 'p2_cloud1', x: 1460, y: 680, width: 90, height: 32, type: 'cloud_bounce', bounceForce: -17, pattern: 'cloud' },

      // Floating stepping stones
      { id: 'p2_v4', x: 1590, y: 520, width: 90, height: 22, type: 'vanishing', color: '#FF8533', vanishDuration: 0.8 },
      { id: 'p2_v5', x: 1720, y: 520, width: 90, height: 22, type: 'vanishing', color: '#FFD233', vanishDuration: 0.8 },
      { id: 'p2_v6', x: 1850, y: 520, width: 90, height: 22, type: 'vanishing', color: '#2ECC71', vanishDuration: 0.8 },

      // Moving horizontal platform
      {
        id: 'p2_mov_h',
        x: 1980,
        y: 540,
        width: 110,
        height: 24,
        type: 'moving',
        color: '#00D2D3',
        startX: 1980,
        startY: 540,
        targetX: 2180,
        targetY: 540,
        moveSpeed: 2.0,
        moveProgress: 0,
      },

      // Cloud bounce to high goal
      { id: 'p2_cloud2', x: 2320, y: 560, width: 100, height: 34, type: 'cloud_bounce', bounceForce: -18.5, pattern: 'cloud' },

      // Aerial landing
      { id: 'p2_solid3', x: 2460, y: 420, width: 110, height: 24, type: 'solid', color: '#3498DB' },

      // Goal platform
      { id: 'p2_goal_plat', x: 2620, y: 580, width: 200, height: 40, type: 'solid', color: '#9B59B6', pattern: 'rainbow_stripes' },
    ],
    hazards: [
      // Swinging pendulum hazard 1
      {
        id: 'h2_pend1',
        type: 'pendulum',
        x: 760,
        y: 400,
        pivotX: 760,
        pivotY: 300,
        radius: 170,
        swingSpeed: 2.2,
        maxAngle: 0.9,
        currentAngle: 0,
        width: 32,
        height: 32,
        color: '#FF4B4B',
      },
      // Swinging pendulum hazard 2
      {
        id: 'h2_pend2',
        type: 'pendulum',
        x: 1720,
        y: 350,
        pivotX: 1720,
        pivotY: 260,
        radius: 180,
        swingSpeed: 2.6,
        maxAngle: 1.0,
        currentAngle: 1.5,
        width: 32,
        height: 32,
        color: '#FF8533',
      },
      // Bottom Spikes
      { id: 'h2_spk1', type: 'spike', x: 280, y: 920, width: 500, height: 30, color: '#FF4B4B' },
      { id: 'h2_spk2', type: 'spike', x: 1400, y: 920, width: 850, height: 30, color: '#00D2D3' },
    ],
  },

  // ================= STAGE 3 =================
  {
    id: 3,
    name: 'Stage 3: Speedway Slides & Launchers',
    subtitle: 'High velocity turbo strips & giant leap gaps',
    description: 'Sprint across rainbow acceleration lanes and shoot across huge sky chasms with supercharged bounce pads!',
    parTime: 30,
    worldWidth: 3200,
    worldHeight: 1000,
    skyTheme: 'twilight',
    spawn: { x: 80, y: 650 },
    goal: { x: 2980, y: 520, width: 80, height: 100 },
    checkpoints: [
      { id: 'cp3_1', x: 1450, y: 580, width: 60, height: 40, activated: false }
    ],
    stars: [
      { id: 's3_1', x: 720, y: 380, collected: false, pulseOffset: 0.8 },
      { id: 's3_2', x: 1880, y: 280, collected: false, pulseOffset: 1.2 },
      { id: 's3_3', x: 2680, y: 340, collected: false, pulseOffset: 2.4 },
    ],
    platforms: [
      { id: 'p3_start', x: 40, y: 730, width: 200, height: 40, type: 'solid', color: '#FF4B4B', pattern: 'rainbow_stripes' },

      // Turbo Speed Strip!
      { id: 'p3_boost1', x: 270, y: 730, width: 220, height: 26, type: 'speed_strip', speedBoost: 7, color: '#FFD233' },

      // Super launcher into the sky
      { id: 'p3_cloud1', x: 520, y: 730, width: 100, height: 35, type: 'cloud_bounce', bounceForce: -21, pattern: 'cloud' },

      // Mid-air landing strip
      { id: 'p3_solid1', x: 670, y: 460, width: 130, height: 24, type: 'solid', color: '#2ECC71' },
      { id: 'p3_solid2', x: 840, y: 520, width: 120, height: 24, type: 'solid', color: '#00D2D3' },

      // Pulsing laser gap platform
      { id: 'p3_solid3', x: 1010, y: 580, width: 130, height: 24, type: 'solid', color: '#3498DB' },

      // Moving hoverboard
      {
        id: 'p3_mov1',
        x: 1180,
        y: 600,
        width: 110,
        height: 24,
        type: 'moving',
        color: '#9B59B6',
        startX: 1180,
        startY: 600,
        targetX: 1360,
        targetY: 600,
        moveSpeed: 2.2,
        moveProgress: 0,
      },

      // Checkpoint island
      { id: 'p3_cp_plat', x: 1410, y: 620, width: 170, height: 32, type: 'solid', color: '#FF4B4B', pattern: 'rainbow_stripes' },

      // Second Turbo Runway
      { id: 'p3_boost2', x: 1620, y: 620, width: 220, height: 26, type: 'speed_strip', speedBoost: 8, color: '#FF8533' },

      // Mega Cloud Jump
      { id: 'p3_cloud2', x: 1860, y: 620, width: 100, height: 35, type: 'cloud_bounce', bounceForce: -22, pattern: 'cloud' },

      // High sky islands with vanishing steps
      { id: 'p3_v1', x: 2040, y: 380, width: 80, height: 22, type: 'vanishing', color: '#FFD233', vanishDuration: 0.7 },
      { id: 'p3_v2', x: 2170, y: 380, width: 80, height: 22, type: 'vanishing', color: '#2ECC71', vanishDuration: 0.7 },
      { id: 'p3_v3', x: 2300, y: 420, width: 80, height: 22, type: 'vanishing', color: '#00D2D3', vanishDuration: 0.7 },

      // Vertical elevator to goal
      {
        id: 'p3_mov_v',
        x: 2440,
        y: 560,
        width: 100,
        height: 24,
        type: 'moving',
        color: '#3498DB',
        startX: 2440,
        startY: 560,
        targetX: 2440,
        targetY: 340,
        moveSpeed: 2.4,
        moveProgress: 0,
      },

      // High sky dash platform
      { id: 'p3_solid4', x: 2610, y: 440, width: 140, height: 24, type: 'solid', color: '#9B59B6' },

      // Final cloud bounce
      { id: 'p3_cloud3', x: 2790, y: 520, width: 90, height: 35, type: 'cloud_bounce', bounceForce: -17, pattern: 'cloud' },

      // Goal runway
      { id: 'p3_goal_plat', x: 2920, y: 620, width: 220, height: 40, type: 'solid', color: '#FF4B4B', pattern: 'rainbow_stripes' },
    ],
    hazards: [
      // Pulsing laser beams between islands
      {
        id: 'h3_laser1',
        type: 'laser_beam',
        x: 980,
        y: 430,
        width: 14,
        height: 150,
        pulsePeriod: 3.0,
        activeTime: 1.4,
        timer: 0,
        color: '#FF4B4B',
      },
      {
        id: 'h3_laser2',
        type: 'laser_beam',
        x: 2230,
        y: 240,
        width: 14,
        height: 180,
        pulsePeriod: 2.6,
        activeTime: 1.2,
        timer: 1.3,
        color: '#00D2D3',
      },
      // Bottom Spikes
      { id: 'h3_spk1', type: 'spike', x: 300, y: 960, width: 1100, height: 30, color: '#FF4B4B' },
      { id: 'h3_spk2', type: 'spike', x: 1500, y: 960, width: 1400, height: 30, color: '#FF8533' },
    ],
  },

  // ================= STAGE 4 =================
  {
    id: 4,
    name: 'Stage 4: The Prism Spire',
    subtitle: 'Ascend the revolving rainbow tower',
    description: 'Scale higher and higher! Dodge rotating rainbow laser beams and leap on orbiting platforms as you climb the sky.',
    parTime: 38,
    worldWidth: 2200,
    worldHeight: 1400,
    skyTheme: 'aurora',
    spawn: { x: 100, y: 1250 },
    goal: { x: 1020, y: 180, width: 80, height: 100 },
    checkpoints: [
      { id: 'cp4_1', x: 1050, y: 780, width: 60, height: 40, activated: false }
    ],
    stars: [
      { id: 's4_1', x: 1650, y: 1050, collected: false, pulseOffset: 0.3 },
      { id: 's4_2', x: 420, y: 620, collected: false, pulseOffset: 1.8 },
      { id: 's4_3', x: 1120, y: 320, collected: false, pulseOffset: 2.7 },
    ],
    platforms: [
      // Base
      { id: 'p4_start', x: 60, y: 1320, width: 240, height: 40, type: 'solid', color: '#FF4B4B', pattern: 'rainbow_stripes' },

      // Lower stepping stones
      { id: 'p4_1', x: 340, y: 1260, width: 110, height: 24, type: 'solid', color: '#FF8533' },
      { id: 'p4_2', x: 500, y: 1200, width: 110, height: 24, type: 'solid', color: '#FFD233' },

      // Cloud bounce to level 2
      { id: 'p4_c1', x: 670, y: 1220, width: 90, height: 34, type: 'cloud_bounce', bounceForce: -19, pattern: 'cloud' },

      // Level 2 Platforms (around y: 1000)
      { id: 'p4_3', x: 800, y: 1080, width: 120, height: 24, type: 'solid', color: '#2ECC71' },

      // Moving platform passing under hazard
      {
        id: 'p4_mov1',
        x: 980,
        y: 1080,
        width: 110,
        height: 24,
        type: 'moving',
        color: '#00D2D3',
        startX: 980,
        startY: 1080,
        targetX: 1260,
        targetY: 1080,
        moveSpeed: 2.0,
        moveProgress: 0,
      },

      { id: 'p4_4', x: 1420, y: 1100, width: 110, height: 24, type: 'solid', color: '#3498DB' },

      // Super cloud bounce towards checkpoint
      { id: 'p4_c2', x: 1580, y: 1120, width: 90, height: 34, type: 'cloud_bounce', bounceForce: -21, pattern: 'cloud' },

      // High aerial platforms heading back left
      { id: 'p4_5', x: 1430, y: 920, width: 100, height: 22, type: 'vanishing', color: '#9B59B6', vanishDuration: 0.8 },
      { id: 'p4_6', x: 1260, y: 880, width: 100, height: 22, type: 'vanishing', color: '#FF4B4B', vanishDuration: 0.8 },

      // Checkpoint Tower
      { id: 'p4_cp_plat', x: 1010, y: 820, width: 170, height: 30, type: 'solid', color: '#FF8533', pattern: 'rainbow_stripes' },

      // Upper Ascent (y: 800 down to 250)
      { id: 'p4_c3', x: 850, y: 820, width: 90, height: 34, type: 'cloud_bounce', bounceForce: -19, pattern: 'cloud' },

      { id: 'p4_7', x: 670, y: 680, width: 110, height: 24, type: 'solid', color: '#FFD233' },
      { id: 'p4_8', x: 490, y: 640, width: 110, height: 24, type: 'solid', color: '#2ECC71' },

      // High moving elevator
      {
        id: 'p4_mov_v',
        x: 320,
        y: 620,
        width: 100,
        height: 24,
        type: 'moving',
        color: '#00D2D3',
        startX: 320,
        startY: 620,
        targetX: 320,
        targetY: 380,
        moveSpeed: 2.2,
        moveProgress: 0,
      },

      // Upper cross bridge
      { id: 'p4_9', x: 460, y: 360, width: 100, height: 22, type: 'vanishing', color: '#3498DB', vanishDuration: 0.7 },
      { id: 'p4_10', x: 600, y: 340, width: 100, height: 22, type: 'vanishing', color: '#9B59B6', vanishDuration: 0.7 },
      { id: 'p4_11', x: 740, y: 320, width: 100, height: 22, type: 'vanishing', color: '#FF4B4B', vanishDuration: 0.7 },

      // Final cloud to summit
      { id: 'p4_c4', x: 870, y: 320, width: 85, height: 34, type: 'cloud_bounce', bounceForce: -17, pattern: 'cloud' },

      // Summit Goal Platform
      { id: 'p4_goal_plat', x: 970, y: 280, width: 220, height: 36, type: 'solid', color: '#FFD233', pattern: 'rainbow_stripes' },
    ],
    hazards: [
      // Rotating Rainbow Spinners!
      {
        id: 'h4_spin1',
        type: 'spinner',
        x: 1120,
        y: 990,
        width: 20,
        height: 20,
        length: 85,
        angle: 0,
        spinSpeed: 2.2,
        color: '#FF4B4B',
      },
      {
        id: 'h4_spin2',
        type: 'spinner',
        x: 670,
        y: 540,
        width: 20,
        height: 20,
        length: 90,
        angle: 1.5,
        spinSpeed: -2.4,
        color: '#9B59B6',
      },
      // Bottom spikes
      { id: 'h4_spk1', type: 'spike', x: 200, y: 1380, width: 1800, height: 30, color: '#FF4B4B' },
    ],
  },

  // ================= STAGE 5 =================
  {
    id: 5,
    name: 'Stage 5: Rainbow Dimension',
    subtitle: 'The Ultimate Prismatic Gauntlet',
    description: 'Master every jump, dash, and bounce to claim the Golden Rainbow Trophy at the summit!',
    parTime: 45,
    worldWidth: 3500,
    worldHeight: 1100,
    skyTheme: 'cosmic',
    spawn: { x: 100, y: 750 },
    goal: { x: 3280, y: 440, width: 80, height: 100 },
    checkpoints: [
      { id: 'cp5_1', x: 1200, y: 720, width: 60, height: 40, activated: false },
      { id: 'cp5_2', x: 2250, y: 550, width: 60, height: 40, activated: false }
    ],
    stars: [
      { id: 's5_1', x: 800, y: 520, collected: false, pulseOffset: 0 },
      { id: 's5_2', x: 1850, y: 380, collected: false, pulseOffset: 1.5 },
      { id: 's5_3', x: 2950, y: 290, collected: false, pulseOffset: 3.0 },
    ],
    platforms: [
      // Starting platform
      { id: 'p5_start', x: 50, y: 820, width: 200, height: 40, type: 'solid', color: '#FF4B4B', pattern: 'rainbow_stripes' },

      // Speed boost across triple vanishing stones
      { id: 'p5_boost1', x: 270, y: 820, width: 140, height: 26, type: 'speed_strip', speedBoost: 7.5, color: '#FF8533' },
      { id: 'p5_v1', x: 440, y: 800, width: 80, height: 22, type: 'vanishing', color: '#FFD233', vanishDuration: 0.65 },
      { id: 'p5_v2', x: 550, y: 760, width: 80, height: 22, type: 'vanishing', color: '#2ECC71', vanishDuration: 0.65 },
      { id: 'p5_v3', x: 660, y: 720, width: 80, height: 22, type: 'vanishing', color: '#00D2D3', vanishDuration: 0.65 },

      // Cloud bounce to spinner dodge
      { id: 'p5_c1', x: 770, y: 740, width: 90, height: 34, type: 'cloud_bounce', bounceForce: -19.5, pattern: 'cloud' },

      // High landing
      { id: 'p5_sol1', x: 930, y: 560, width: 120, height: 24, type: 'solid', color: '#3498DB' },

      // Checkpoint 1
      { id: 'p5_cp1', x: 1160, y: 760, width: 160, height: 30, type: 'solid', color: '#9B59B6', pattern: 'rainbow_stripes' },

      // Double moving platforms in counter-motion
      {
        id: 'p5_mov1',
        x: 1370,
        y: 720,
        width: 100,
        height: 24,
        type: 'moving',
        color: '#FF4B4B',
        startX: 1370,
        startY: 720,
        targetX: 1560,
        targetY: 660,
        moveSpeed: 2.2,
        moveProgress: 0,
      },
      {
        id: 'p5_mov2',
        x: 1620,
        y: 640,
        width: 100,
        height: 24,
        type: 'moving',
        color: '#FF8533',
        startX: 1620,
        startY: 640,
        targetX: 1800,
        targetY: 540,
        moveSpeed: 2.5,
        moveProgress: 0.5,
      },

      // Super cloud bounce across laser corridor
      { id: 'p5_c2', x: 1940, y: 640, width: 95, height: 34, type: 'cloud_bounce', bounceForce: -21, pattern: 'cloud' },

      // Vanishing steps high in the air
      { id: 'p5_v4', x: 2070, y: 460, width: 75, height: 22, type: 'vanishing', color: '#FFD233', vanishDuration: 0.6 },
      { id: 'p5_v5', x: 2170, y: 460, width: 75, height: 22, type: 'vanishing', color: '#2ECC71', vanishDuration: 0.6 },

      // Checkpoint 2
      { id: 'p5_cp2', x: 2220, y: 600, width: 160, height: 30, type: 'solid', color: '#00D2D3', pattern: 'rainbow_stripes' },

      // High velocity speed lane
      { id: 'p5_boost2', x: 2420, y: 600, width: 180, height: 26, type: 'speed_strip', speedBoost: 8.5, color: '#3498DB' },

      // Giant Cloud Launch
      { id: 'p5_c3', x: 2630, y: 600, width: 100, height: 35, type: 'cloud_bounce', bounceForce: -23, pattern: 'cloud' },

      // Aerial precision platforms
      { id: 'p5_sol2', x: 2790, y: 380, width: 90, height: 24, type: 'solid', color: '#9B59B6' },
      { id: 'p5_sol3', x: 2950, y: 400, width: 90, height: 24, type: 'solid', color: '#FF4B4B' },
      { id: 'p5_sol4', x: 3100, y: 460, width: 90, height: 24, type: 'solid', color: '#FF8533' },

      // Golden Trophy Summit Platform
      { id: 'p5_goal_plat', x: 3220, y: 540, width: 220, height: 40, type: 'solid', color: '#FFD233', pattern: 'rainbow_stripes' },
    ],
    hazards: [
      // Rotating laser hazard 1
      {
        id: 'h5_spin1',
        type: 'spinner',
        x: 800,
        y: 600,
        width: 20,
        height: 20,
        length: 95,
        angle: 0.5,
        spinSpeed: 2.5,
        color: '#FF4B4B',
      },
      // Swinging pendulum hazard
      {
        id: 'h5_pend1',
        type: 'pendulum',
        x: 1720,
        y: 420,
        pivotX: 1720,
        pivotY: 300,
        radius: 180,
        swingSpeed: 2.8,
        maxAngle: 1.1,
        currentAngle: 0,
        width: 34,
        height: 34,
        color: '#00D2D3',
      },
      // Double pulsing laser
      {
        id: 'h5_laser1',
        type: 'laser_beam',
        x: 2020,
        y: 320,
        width: 14,
        height: 180,
        pulsePeriod: 2.4,
        activeTime: 1.1,
        timer: 0.4,
        color: '#FF4B4B',
      },
      {
        id: 'h5_spin2',
        type: 'spinner',
        x: 2880,
        y: 330,
        width: 20,
        height: 20,
        length: 85,
        angle: 2.0,
        spinSpeed: -2.8,
        color: '#FFD233',
      },
      // Bottom Spikes
      { id: 'h5_spk1', type: 'spike', x: 200, y: 1060, width: 3100, height: 35, color: '#FF4B4B' },
    ],
  },
];

/**
 * Generates an endless procedural rainbow obby chunk as the player advances!
 */
export function generateEndlessLevel(seed: number = 1): LevelData {
  const worldWidth = 10000;
  const worldHeight = 900;
  const platforms: Platform[] = [
    { id: 'endless_start', x: 50, y: 700, width: 240, height: 40, type: 'solid', color: '#FF4B4B', pattern: 'rainbow_stripes' },
  ];
  const hazards: Hazard[] = [
    { id: 'endless_spk', type: 'spike', x: 200, y: 880, width: worldWidth - 400, height: 30, color: '#FF4B4B' }
  ];
  const stars: StarCollectible[] = [];
  const checkpoints: Checkpoint[] = [];

  let curX = 320;
  let curY = 680;
  let idCounter = 1;

  while (curX < worldWidth - 600) {
    const color = RAINBOW_COLORS[idCounter % RAINBOW_COLORS.length];
    const roll = Math.random();

    if (roll < 0.28) {
      // Standard solid platform
      const width = 90 + Math.random() * 50;
      curY = Math.max(380, Math.min(740, curY + (Math.random() * 80 - 40)));
      platforms.push({
        id: `e_p_${idCounter}`,
        x: curX,
        y: curY,
        width,
        height: 24,
        type: 'solid',
        color,
      });
      curX += width + 60 + Math.random() * 50;
    } else if (roll < 0.50) {
      // Vanishing steps
      const stepCount = 2 + Math.floor(Math.random() * 2);
      for (let s = 0; s < stepCount; s++) {
        platforms.push({
          id: `e_v_${idCounter}_${s}`,
          x: curX,
          y: curY,
          width: 75,
          height: 22,
          type: 'vanishing',
          color: RAINBOW_COLORS[(idCounter + s) % RAINBOW_COLORS.length],
          vanishDuration: 0.8,
        });
        curX += 110;
        curY += (Math.random() * 60 - 30);
      }
    } else if (roll < 0.72) {
      // Cloud bounce over chasm
      platforms.push({
        id: `e_c_${idCounter}`,
        x: curX,
        y: curY,
        width: 90,
        height: 32,
        type: 'cloud_bounce',
        bounceForce: -18 - Math.random() * 3,
        pattern: 'cloud',
      });
      curX += 150 + Math.random() * 70;
      curY = Math.max(400, curY - 100);
      platforms.push({
        id: `e_sol_${idCounter}`,
        x: curX,
        y: curY,
        width: 110,
        height: 24,
        type: 'solid',
        color,
      });
      curX += 150;
    } else if (roll < 0.88) {
      // Moving platform
      const targetDeltaX = 140 + Math.random() * 80;
      platforms.push({
        id: `e_mov_${idCounter}`,
        x: curX,
        y: curY,
        width: 100,
        height: 24,
        type: 'moving',
        color,
        startX: curX,
        startY: curY,
        targetX: curX + targetDeltaX,
        targetY: curY,
        moveSpeed: 1.8 + Math.random() * 0.8,
        moveProgress: 0,
      });
      curX += targetDeltaX + 130;
    } else {
      // Speed strip
      platforms.push({
        id: `e_spd_${idCounter}`,
        x: curX,
        y: curY,
        width: 180,
        height: 26,
        type: 'speed_strip',
        speedBoost: 8,
        color: '#FFD233',
      });
      curX += 230;
    }

    // Occasional star
    if (Math.random() < 0.35) {
      stars.push({
        id: `e_star_${idCounter}`,
        x: curX - 40,
        y: curY - 70,
        collected: false,
        pulseOffset: Math.random() * 3,
      });
    }

    // Occasional spinner hazard
    if (Math.random() < 0.25 && curX < worldWidth - 1000) {
      hazards.push({
        id: `e_spin_${idCounter}`,
        type: 'spinner',
        x: curX - 30,
        y: curY - 50,
        width: 18,
        height: 18,
        length: 75,
        angle: Math.random() * Math.PI,
        spinSpeed: 2.2 * (Math.random() > 0.5 ? 1 : -1),
        color: RAINBOW_COLORS[idCounter % RAINBOW_COLORS.length],
      });
    }

    // Checkpoint every ~1800 units
    if (curX > (checkpoints.length + 1) * 1800 && curX < worldWidth - 800) {
      const cpX = curX;
      platforms.push({
        id: `e_cp_plat_${checkpoints.length}`,
        x: cpX,
        y: curY,
        width: 160,
        height: 30,
        type: 'solid',
        color: '#FF4B4B',
        pattern: 'rainbow_stripes',
      });
      checkpoints.push({
        id: `e_cp_${checkpoints.length}`,
        x: cpX + 50,
        y: curY - 40,
        width: 60,
        height: 40,
        activated: false,
      });
      curX += 200;
    }

    idCounter++;
  }

  // End goal
  platforms.push({
    id: 'endless_goal_plat',
    x: worldWidth - 450,
    y: 650,
    width: 260,
    height: 40,
    type: 'solid',
    color: '#FFD233',
    pattern: 'rainbow_stripes',
  });

  return {
    id: 99,
    name: 'Endless Rainbow Rush',
    subtitle: 'Survive the infinite rainbow track',
    description: 'A procedurally generated gauntlet of bouncy clouds, vanishing tiles, and spinning stars!',
    parTime: 120,
    worldWidth,
    worldHeight,
    skyTheme: 'aurora',
    spawn: { x: 100, y: 630 },
    goal: { x: worldWidth - 360, y: 550, width: 80, height: 100 },
    platforms,
    hazards,
    stars,
    checkpoints,
  };
}
