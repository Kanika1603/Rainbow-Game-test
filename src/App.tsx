/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { UIOverlay } from './components/UIOverlay';
import { TouchControls } from './components/TouchControls';
import { VictoryModal } from './components/VictoryModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { CustomizeModal } from './components/CustomizeModal';
import { InstructionsModal } from './components/InstructionsModal';
import { LEVELS, generateEndlessLevel } from './game/levels';
import { CustomizationSettings, LevelProgress } from './types';
import { soundManager } from './audio/soundManager';

const STORAGE_KEY_PROGRESS = 'rainbow_obby_progress_v1';
const STORAGE_KEY_CUSTOMIZATION = 'rainbow_obby_customization_v1';

export default function App() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [levelInstance, setLevelInstance] = useState(() => LEVELS[0]);

  // Level Progression & Highscores
  const [progress, setProgress] = useState<Record<number, LevelProgress>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      1: { unlocked: true, completed: false, bestTime: null, starsEarned: 0, collectedStars: [false, false, false] },
      2: { unlocked: false, completed: false, bestTime: null, starsEarned: 0, collectedStars: [false, false, false] },
      3: { unlocked: false, completed: false, bestTime: null, starsEarned: 0, collectedStars: [false, false, false] },
      4: { unlocked: false, completed: false, bestTime: null, starsEarned: 0, collectedStars: [false, false, false] },
      5: { unlocked: false, completed: false, bestTime: null, starsEarned: 0, collectedStars: [false, false, false] },
      99: { unlocked: true, completed: false, bestTime: null, starsEarned: 0, collectedStars: [false, false, false] },
    };
  });

  // Customization
  const [customization, setCustomization] = useState<CustomizationSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOMIZATION);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      colorIndex: 4, // Aqua Cyan default
      hat: 'rainbow_crown',
      trail: 'rainbow',
    };
  });

  // Save progress & customization to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
    } catch {}
  }, [progress]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOMIZATION, JSON.stringify(customization));
    } catch {}
  }, [customization]);

  // Game active state & UI
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [deaths, setDeaths] = useState<number>(0);
  const [starsCollectedCount, setStarsCollectedCount] = useState<number>(0);
  const [dashCooldown, setDashCooldown] = useState<number>(0);
  const [checkpointNotification, setCheckpointNotification] = useState<string | null>(null);

  // Modals
  const [showLevelSelect, setShowLevelSelect] = useState<boolean>(false);
  const [showCustomize, setShowCustomize] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [victoryData, setVictoryData] = useState<{
    time: number;
    stars: number;
    deaths: number;
  } | null>(null);

  // Touch controls input state
  const [touchInput, setTouchInput] = useState({
    left: false,
    right: false,
    jumpStart: false,
    jumpHeld: false,
    dash: false,
    restart: false,
  });

  // Check if touch device or narrow screen
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth < 1024
      );
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  // Update current level instance when level index changes
  const loadLevelByIndex = useCallback((index: number) => {
    setCurrentLevelIndex(index);
    if (index === 5) {
      // Endless mode
      setLevelInstance(generateEndlessLevel(Date.now()));
    } else {
      setLevelInstance(LEVELS[index] || LEVELS[0]);
    }
    setVictoryData(null);
    setShowLevelSelect(false);
    setIsPaused(false);
  }, []);

  // Update stats from canvas
  const handleUpdateStats = useCallback((time: number, dCount: number, sCount: number, dashPct: number) => {
    setElapsedTime(time);
    setDeaths(dCount);
    setStarsCollectedCount(sCount);
    setDashCooldown(dashPct);
  }, []);

  // Checkpoint reached toast
  const handleCheckpointReach = useCallback((_cpId: string) => {
    setCheckpointNotification('Checkpoint Saved!');
    setTimeout(() => {
      setCheckpointNotification(null);
    }, 2200);
  }, []);

  // Victory reached handler
  const handleVictory = useCallback((time: number, stars: number, deathCount: number) => {
    setVictoryData({
      time,
      stars,
      deaths: deathCount,
    });

    const levelId = levelInstance.id;

    setProgress((prev) => {
      const current = prev[levelId] || {
        unlocked: true,
        completed: false,
        bestTime: null,
        starsEarned: 0,
        collectedStars: [false, false, false],
      };

      const newBestTime = current.bestTime === null ? time : Math.min(current.bestTime, time);
      const newStars = Math.max(current.starsEarned, stars, 1);

      // Unlock next level if standard level
      const nextLevelId = levelId + 1;
      const nextLevelProg = prev[nextLevelId]
        ? { ...prev[nextLevelId], unlocked: true }
        : undefined;

      return {
        ...prev,
        [levelId]: {
          ...current,
          completed: true,
          bestTime: newBestTime,
          starsEarned: newStars,
        },
        ...(nextLevelProg ? { [nextLevelId]: nextLevelProg } : {}),
      };
    });
  }, [levelInstance.id]);

  // Touch control callbacks
  const handleLeftChange = useCallback((active: boolean) => {
    setTouchInput((prev) => ({ ...prev, left: active }));
  }, []);

  const handleRightChange = useCallback((active: boolean) => {
    setTouchInput((prev) => ({ ...prev, right: active }));
  }, []);

  const handleJumpStart = useCallback(() => {
    setTouchInput((prev) => ({ ...prev, jumpStart: true, jumpHeld: true }));
  }, []);

  const handleJumpEnd = useCallback(() => {
    setTouchInput((prev) => ({ ...prev, jumpHeld: false }));
  }, []);

  const handleDash = useCallback(() => {
    setTouchInput((prev) => ({ ...prev, dash: true }));
  }, []);

  const handleRestart = useCallback(() => {
    setTouchInput((prev) => ({ ...prev, restart: true }));
  }, []);

  const handleClearTouchTrigger = useCallback((trigger: 'jumpStart' | 'dash' | 'restart') => {
    setTouchInput((prev) => ({ ...prev, [trigger]: false }));
  }, []);

  const handleToggleMute = useCallback(() => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  }, []);

  const handleNextLevel = useCallback(() => {
    if (currentLevelIndex < 4) {
      loadLevelByIndex(currentLevelIndex + 1);
    } else {
      // Endless mode or loop
      loadLevelByIndex(5);
    }
  }, [currentLevelIndex, loadLevelByIndex]);

  const handleReplay = useCallback(() => {
    loadLevelByIndex(currentLevelIndex);
  }, [currentLevelIndex, loadLevelByIndex]);

  return (
    <div id="game-app-root" className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* 60FPS High Performance Canvas Engine */}
      <GameCanvas
        level={levelInstance}
        customization={customization}
        isPaused={isPaused || Boolean(victoryData) || showLevelSelect || showCustomize || showHelp}
        onUpdateStats={handleUpdateStats}
        onCheckpointReach={handleCheckpointReach}
        onVictory={handleVictory}
        touchInput={touchInput}
        onClearTouchTrigger={handleClearTouchTrigger}
      />

      {/* Modern HUD Overlay */}
      <UIOverlay
        level={levelInstance}
        elapsedTime={elapsedTime}
        deaths={deaths}
        starsCollectedCount={starsCollectedCount}
        dashCooldown={dashCooldown}
        isPaused={isPaused}
        isMuted={isMuted}
        checkpointNotification={checkpointNotification}
        onTogglePause={() => setIsPaused(!isPaused)}
        onToggleMute={handleToggleMute}
        onOpenLevelSelect={() => setShowLevelSelect(true)}
        onOpenCustomize={() => setShowCustomize(true)}
        onOpenHelp={() => setShowHelp(true)}
        onRestartCheckpoint={handleRestart}
      />

      {/* On-Screen Touch Controls for Mobile/Tablet or Touch Displays */}
      {isTouchDevice && (
        <TouchControls
          onLeftChange={handleLeftChange}
          onRightChange={handleRightChange}
          onJumpStart={handleJumpStart}
          onJumpEnd={handleJumpEnd}
          onDash={handleDash}
          onRestart={handleRestart}
          dashCooldownPercent={dashCooldown}
        />
      )}

      {/* Victory Celebration Modal */}
      {victoryData && (
        <VictoryModal
          level={levelInstance}
          time={victoryData.time}
          starsEarned={victoryData.stars}
          deaths={victoryData.deaths}
          hasNextLevel={currentLevelIndex < 4}
          onNextLevel={handleNextLevel}
          onReplay={handleReplay}
          onLevelSelect={() => {
            setVictoryData(null);
            setShowLevelSelect(true);
          }}
        />
      )}

      {/* Level Select Modal */}
      {showLevelSelect && (
        <LevelSelectModal
          currentLevelIndex={currentLevelIndex}
          progress={progress}
          onSelectLevel={loadLevelByIndex}
          onClose={() => setShowLevelSelect(false)}
        />
      )}

      {/* Customize Avatar Modal */}
      {showCustomize && (
        <CustomizeModal
          settings={customization}
          onSave={(newSettings) => setCustomization(newSettings)}
          onClose={() => setShowCustomize(false)}
        />
      )}

      {/* Instructions & Help Modal */}
      {showHelp && (
        <InstructionsModal onClose={() => setShowHelp(false)} />
      )}
    </div>
  );
}
