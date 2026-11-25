import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Player, Particle, LevelData, CustomizationSettings } from '../types';
import { createInitialPlayer, updatePhysics, InputState } from '../game/physics';
import { createCamera, updateCamera, renderGame, Camera } from '../game/renderer';
import { soundManager } from '../audio/soundManager';

interface GameCanvasProps {
  level: LevelData;
  customization: CustomizationSettings;
  isPaused: boolean;
  onUpdateStats: (elapsedTime: number, deaths: number, starsCollected: number, dashCooldownPercent: number) => void;
  onCheckpointReach: (cpId: string) => void;
  onVictory: (clearTime: number, starsCollected: number, deaths: number) => void;
  // External inputs from TouchControls
  touchInput: {
    left: boolean;
    right: boolean;
    jumpStart: boolean;
    jumpHeld: boolean;
    dash: boolean;
    restart: boolean;
  };
  onClearTouchTrigger: (trigger: 'jumpStart' | 'dash' | 'restart') => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  level,
  customization,
  isPaused,
  onUpdateStats,
  onCheckpointReach,
  onVictory,
  touchInput,
  onClearTouchTrigger,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({
    width: 1200,
    height: 700,
  });

  // Game internal state stored in refs for 60fps performance
  const playerRef = useRef<Player>(createInitialPlayer(level.spawn));
  const cameraRef = useRef<Camera>(createCamera());
  const particlesRef = useRef<Particle[]>([]);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const lastTimeRef = useRef<number>(performance.now());
  const elapsedTimeRef = useRef<number>(0);
  const deathsRef = useRef<number>(0);
  const starsCollectedRef = useRef<Set<string>>(new Set());
  const isFinishedRef = useRef<boolean>(false);

  // Reset or initialize state whenever the level changes
  useEffect(() => {
    playerRef.current = createInitialPlayer(level.spawn);
    cameraRef.current = createCamera();
    particlesRef.current = [];
    elapsedTimeRef.current = 0;
    deathsRef.current = 0;
    starsCollectedRef.current = new Set();
    isFinishedRef.current = false;

    // Reset level star / checkpoint objects
    level.stars.forEach((s) => (s.collected = false));
    level.checkpoints.forEach((cp) => (cp.activated = false));
    level.platforms.forEach((p) => {
      p.isVanished = false;
      p.vanishTimer = undefined;
      p.respawnTimer = undefined;
    });

    onUpdateStats(0, 0, 0, 0);
  }, [level]);

  // Handle ResizeObserver on the container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setCanvasSize({
            width: Math.floor(width),
            height: Math.floor(height),
          });
        }
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser scrolling on Arrow keys and Space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Space'].includes(e.key)) {
        e.preventDefault();
      }

      keysRef.current[e.key.toLowerCase()] = true;
      keysRef.current[e.code] = true;

      // Start music on first player interaction
      soundManager.startBackgroundMusic();

      // Quick respawn
      if (e.key.toLowerCase() === 'r') {
        respawnToLastCheckpoint();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const respawnToLastCheckpoint = useCallback(() => {
    const player = playerRef.current;
    const target = player.currentCheckpoint || level.spawn;
    player.x = target.x;
    player.y = target.y - 20;
    player.vx = 0;
    player.vy = 0;
    player.isGrounded = false;
    deathsRef.current += 1;
    soundManager.playDeath();
  }, [level]);

  // Main 60fps Game Loop
  useEffect(() => {
    let animId: number;

    const loop = (currentTime: number) => {
      animId = requestAnimationFrame(loop);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rawDt = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;
      // Cap dt to prevent physics tunneling during background tabs
      const dt = Math.min(0.05, Math.max(0.001, rawDt));

      if (isPaused || isFinishedRef.current) {
        // Render current static frame without advancing physics/timers
        renderGame(
          ctx,
          canvasSize.width,
          canvasSize.height,
          playerRef.current,
          level,
          cameraRef.current,
          particlesRef.current,
          customization,
          currentTime / 1000
        );
        return;
      }

      // Advance Timer
      elapsedTimeRef.current += dt;

      // Compile input from keyboard and touch
      const k = keysRef.current;
      const keyLeft = k['arrowleft'] || k['a'] || k['keya'];
      const keyRight = k['arrowright'] || k['d'] || k['keyd'];
      const keyJump = k['arrowup'] || k['w'] || k['keyw'] || k[' '] || k['space'];
      const keyDash = k['shift'] || k['shiftleft'] || k['shiftright'] || k['z'] || k['keyz'];

      const input: InputState = {
        left: Boolean(keyLeft || touchInput.left),
        right: Boolean(keyRight || touchInput.right),
        jumpPressed: Boolean(k['just_jumped'] || touchInput.jumpStart),
        jumpHeld: Boolean(keyJump || touchInput.jumpHeld),
        dashPressed: Boolean(k['just_dashed'] || touchInput.dash),
        restartPressed: Boolean(touchInput.restart),
      };

      // Reset edge-triggered keys
      if (k['just_jumped']) k['just_jumped'] = false;
      if (k['just_dashed']) k['just_dashed'] = false;
      if (touchInput.jumpStart) onClearTouchTrigger('jumpStart');
      if (touchInput.dash) onClearTouchTrigger('dash');
      if (touchInput.restart) {
        respawnToLastCheckpoint();
        onClearTouchTrigger('restart');
      }

      // Update Physics & Collisions
      updatePhysics(
        playerRef.current,
        input,
        level,
        dt,
        particlesRef.current,
        (starId) => {
          starsCollectedRef.current.add(starId);
        },
        (cpId) => {
          onCheckpointReach(cpId);
        },
        () => {
          deathsRef.current += 1;
          cameraRef.current.shake = 1.2;
        },
        () => {
          if (!isFinishedRef.current) {
            isFinishedRef.current = true;
            soundManager.playVictory();
            onVictory(elapsedTimeRef.current, starsCollectedRef.current.size, deathsRef.current);
          }
        }
      );

      // Update Camera
      updateCamera(
        cameraRef.current,
        playerRef.current,
        level,
        canvasSize.width,
        canvasSize.height,
        dt
      );

      // Render Scene
      renderGame(
        ctx,
        canvasSize.width,
        canvasSize.height,
        playerRef.current,
        level,
        cameraRef.current,
        particlesRef.current,
        customization,
        currentTime / 1000
      );

      // Report stats to UI
      const dashCooldownRatio = playerRef.current.dashCooldown / 1.0;
      onUpdateStats(
        elapsedTimeRef.current,
        deathsRef.current,
        starsCollectedRef.current.size,
        dashCooldownRatio
      );
    };

    // Edge detector for keydown jump/dash
    const handleEdgeDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'w', 'W', ' ', 'Space'].includes(e.key) && !e.repeat) {
        keysRef.current['just_jumped'] = true;
      }
      if (['Shift', 'z', 'Z'].includes(e.key) && !e.repeat) {
        keysRef.current['just_dashed'] = true;
      }
    };
    window.addEventListener('keydown', handleEdgeDown);

    lastTimeRef.current = performance.now();
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleEdgeDown);
    };
  }, [
    level,
    customization,
    isPaused,
    canvasSize,
    touchInput,
    onUpdateStats,
    onCheckpointReach,
    onVictory,
    onClearTouchTrigger,
    respawnToLastCheckpoint,
  ]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-slate-950 flex items-center justify-center cursor-crosshair select-none"
    >
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="w-full h-full block"
      />
    </div>
  );
};
