'use client';

import { useState } from 'react';
import { AVATARS, getSkillDescription } from '@/lib/avatars';
import { useGameStore } from '@/lib/gameStore';

interface AvatarGalleryProps {
  onBack: () => void;
  onViewSkills: (avatarId: string) => void;
}

export default function AvatarGallery({ onBack, onViewSkills }: AvatarGalleryProps) {
  const { selectedAvatarId, unlockedAvatarIds, stars, selectAvatar, unlockAvatar, getSkillLevel } = useGameStore();
  const [tapMsg, setTapMsg] = useState<{ id: string; text: string } | null>(null);

  const handleLockedTap = (avatarId: string, cost: number) => {
    const canAfford = stars >= cost;
    const msg = canAfford
      ? `Tap "Unlock" to get this avatar for ★${cost}`
      : `You need ★${cost - stars} more to unlock`;
    setTapMsg({ id: avatarId, text: msg });
    setTimeout(() => setTapMsg(prev => prev?.id === avatarId ? null : prev), 2500);
  };

  return (
    <div className="menu-container">
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <h2 className="screen-title">Avatars</h2>
        <div className="header-stars">
          <span className="star-icon">★</span> {stars}
        </div>
      </div>

      <div className="avatar-grid">
        {AVATARS.map(avatar => {
          const unlocked = unlockedAvatarIds.includes(avatar.id);
          const selected = avatar.id === selectedAvatarId;
          const canAfford = stars >= avatar.unlockCost;
          const skillLevel = getSkillLevel(avatar.id);
          const showMsg = tapMsg?.id === avatar.id;

          return (
            <button
              key={avatar.id}
              className={`avatar-card ${selected ? 'selected' : ''} ${!unlocked ? 'locked' : ''}`}
              onClick={() => unlocked ? selectAvatar(avatar.id) : handleLockedTap(avatar.id, avatar.unlockCost)}
            >
              <div className="avatar-card-image">
                <img src={avatar.image} alt={avatar.name} />
                {selected && <div className="avatar-selected-badge">✓</div>}
              </div>
              <div className="avatar-card-info">
                <span className="avatar-card-name">{avatar.name}</span>
                {!unlocked && (
                  <span className={`avatar-card-cost ${!canAfford ? 'cant-afford' : ''}`}>
                    <span className="star-icon">★</span> {avatar.unlockCost}
                  </span>
                )}
                {unlocked && !selected && (
                  <span className="avatar-card-owned">Owned</span>
                )}
                {selected && (
                  <span className="avatar-card-active">Active</span>
                )}
              </div>

              {showMsg && (
                <span className={`avatar-tap-msg ${canAfford ? 'afford' : 'no-afford'}`}>{tapMsg.text}</span>
              )}

              {!unlocked && (
                <span
                  className={`avatar-buy-btn ${!canAfford ? 'disabled' : ''}`}
                  onClick={(e) => { e.stopPropagation(); if (canAfford) unlockAvatar(avatar.id); }}
                >
                  {canAfford ? 'Unlock' : 'Need more ★'}
                </span>
              )}

              <span
                className="avatar-skill-link"
                onClick={(e) => { e.stopPropagation(); onViewSkills(avatar.id); }}
              >
                {avatar.skill}
                {unlocked && <span className="avatar-skill-level"> Lv{skillLevel}</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
