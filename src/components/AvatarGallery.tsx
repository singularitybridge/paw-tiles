'use client';

import { useState } from 'react';
import { AVATARS, getSkillDescription } from '@/lib/avatars';
import { useGameStore } from '@/lib/gameStore';
import ScreenHeader from './ScreenHeader';

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
      <ScreenHeader title="Avatars" onBack={onBack} />

      <div className="designer-worlds-list" style={{ padding: '8px 16px 16px' }}>
        {AVATARS.map(avatar => {
          const unlocked = unlockedAvatarIds.includes(avatar.id);
          const selected = avatar.id === selectedAvatarId;
          const canAfford = stars >= avatar.unlockCost;
          const skillLevel = getSkillLevel(avatar.id);
          const showMsg = tapMsg?.id === avatar.id;

          return (
            <button
              key={avatar.id}
              className={`designer-world-card ${selected ? 'active' : ''}`}
              onClick={() => unlocked ? selectAvatar(avatar.id) : handleLockedTap(avatar.id, avatar.unlockCost)}
              style={{ border: 'none', cursor: 'pointer' }}
            >
              <div className="designer-world-bg">
                <img src={avatar.background} alt={`${avatar.name}'s world`} />
              </div>
              <div className="designer-world-overlay">
                <div className="designer-world-avatar">
                  <img src={avatar.image} alt={avatar.name} />
                </div>
                <span className="designer-world-name">{avatar.name}</span>
                <div className="designer-world-footer">
                  {!unlocked && (
                    <span
                      className={`designer-world-cost ${!canAfford ? 'cant-afford' : ''}`}
                      onClick={(e) => { e.stopPropagation(); if (canAfford) unlockAvatar(avatar.id); }}
                    >
                      {canAfford ? <>Unlock <span className="star-icon">★</span> {avatar.unlockCost}</> : <>Need <span className="star-icon">★</span> {avatar.unlockCost}</>}
                    </span>
                  )}
                  {unlocked && selected && (
                    <span className="designer-world-active">Active</span>
                  )}
                  {unlocked && !selected && (
                    <span className="designer-world-owned">Owned</span>
                  )}
                </div>
              </div>

              {showMsg && (
                <span className="avatar-tap-msg" style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 5 }}>{tapMsg.text}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
