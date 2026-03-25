'use client';

import { useState } from 'react';
import { useGameStore } from '@/lib/gameStore';

interface SettingsScreenProps {
  onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { stars, unlockedAvatarIds, unlockedBackgroundIds, unlockedMusicIds, hapticsEnabled, toggleHaptics, resetProgress } = useGameStore();
  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetProgress();
    setConfirmReset(false);
  };

  return (
    <div className="menu-container">
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <h2 className="screen-title">Settings</h2>
        <div style={{ width: 36 }} />
      </div>

      <div className="settings-scroll">
        {/* Stats section */}
        <div className="settings-section">
          <div className="settings-section-title">Your Progress</div>
          <div className="settings-stats">
            <div className="settings-stat">
              <span className="settings-stat-value">
                <span className="star-icon">★</span> {stars}
              </span>
              <span className="settings-stat-label">Stars</span>
            </div>
            <div className="settings-stat">
              <span className="settings-stat-value">{unlockedAvatarIds.length}</span>
              <span className="settings-stat-label">Avatars</span>
            </div>
            <div className="settings-stat">
              <span className="settings-stat-value">{unlockedBackgroundIds.length}</span>
              <span className="settings-stat-label">Backgrounds</span>
            </div>
            <div className="settings-stat">
              <span className="settings-stat-value">{unlockedMusicIds.length}</span>
              <span className="settings-stat-label">Music</span>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="settings-section">
          <div className="settings-section-title">Preferences</div>
          <div className="settings-toggle-row" onClick={toggleHaptics}>
            <span className="settings-toggle-label">Haptic Feedback</span>
            <div className={`settings-toggle ${hapticsEnabled ? 'on' : ''}`}>
              <div className="settings-toggle-knob" />
            </div>
          </div>
        </div>

        {/* About section */}
        <div className="settings-section">
          <div className="settings-section-title">About</div>
          <div className="settings-about">
            <div className="settings-about-row">
              <span className="settings-about-label">Game</span>
              <span className="settings-about-value">Vita Mahjong</span>
            </div>
            <div className="settings-about-row">
              <span className="settings-about-label">Version</span>
              <span className="settings-about-value">1.0.0</span>
            </div>
          </div>
        </div>

        {/* How to Play section */}
        <div className="settings-section">
          <div className="settings-section-title">How to Play</div>
          <div className="settings-howto">
            <p>Match 3 identical tiles to clear them from the board.</p>
            <p>Tap tiles to select them into your slots. When 3 match, they disappear and you earn points.</p>
            <p>If all 4 slots fill without a match, it&apos;s game over!</p>
            <p>Clear all tiles to win and earn stars.</p>
          </div>
        </div>

        {/* Danger zone */}
        <div className="settings-section">
          <div className="settings-section-title settings-danger-title">Reset</div>
          <p className="settings-danger-desc">
            This will erase all stars, unlocked avatars, backgrounds, and skill upgrades.
          </p>
          <button
            className={`settings-reset-btn ${confirmReset ? 'confirm' : ''}`}
            onClick={handleReset}
          >
            {confirmReset ? 'Tap again to confirm' : 'Reset All Progress'}
          </button>
        </div>
      </div>
    </div>
  );
}
