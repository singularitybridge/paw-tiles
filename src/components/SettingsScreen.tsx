'use client';

import { useState } from 'react';
import { useGameStore } from '@/lib/gameStore';
import ScreenHeader from './ScreenHeader';

interface SettingsScreenProps {
  onBack: () => void;
  onAvatarSelect?: () => void;
}

export default function SettingsScreen({ onBack, onAvatarSelect }: SettingsScreenProps) {
  const { stars, selectedAvatar, unlockedAvatarIds, unlockedBackgroundIds, unlockedMusicIds, hapticsEnabled, toggleHaptics, resetProgress } = useGameStore();
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
      <ScreenHeader title="Settings" onBack={onBack} showStars={false} />

      <div className="settings-scroll">
        {/* Current Avatar */}
        <div className="settings-section">
          <div className="settings-section-title">Your Avatar</div>
          <button className="settings-avatar-row" onClick={onAvatarSelect}>
            <div className="settings-avatar-img">
              <img src={selectedAvatar.image} alt={selectedAvatar.name} />
            </div>
            <div className="settings-avatar-info">
              <span className="settings-avatar-name">{selectedAvatar.name}</span>
              <span className="settings-avatar-skill">{selectedAvatar.skill}</span>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

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
              <span className="settings-about-value">Paw Tiles</span>
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
