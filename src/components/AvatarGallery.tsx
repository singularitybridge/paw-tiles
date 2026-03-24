'use client';

import { AVATARS, getSkillDescription } from '@/lib/avatars';
import { useGameStore } from '@/lib/gameStore';

interface AvatarGalleryProps {
  onBack: () => void;
  onViewSkills: (avatarId: string) => void;
}

export default function AvatarGallery({ onBack, onViewSkills }: AvatarGalleryProps) {
  const { selectedAvatarId, unlockedAvatarIds, stars, selectAvatar, unlockAvatar, getSkillLevel } = useGameStore();

  const handleTap = (id: string) => {
    if (unlockedAvatarIds.includes(id)) {
      selectAvatar(id);
    } else {
      unlockAvatar(id);
    }
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

          return (
            <div key={avatar.id} className={`avatar-card ${selected ? 'selected' : ''} ${!unlocked ? 'locked' : ''}`}>
              <button
                className="avatar-card-tap"
                onClick={() => handleTap(avatar.id)}
                disabled={!unlocked && !canAfford}
              >
                <div className="avatar-card-image">
                  <img src={avatar.image} alt={avatar.name} />
                  {!unlocked && (
                    <div className="avatar-lock-overlay">
                      <span className="avatar-lock-cost">
                        <span className="star-icon">★</span> {avatar.unlockCost}
                      </span>
                    </div>
                  )}
                  {selected && <div className="avatar-selected-badge">✓</div>}
                </div>
                <span className="avatar-card-name">{avatar.name}</span>
              </button>
              <button
                className="avatar-skill-link"
                onClick={() => onViewSkills(avatar.id)}
              >
                {avatar.skill}
                {unlocked && <span className="avatar-skill-level"> Lv{skillLevel}</span>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
