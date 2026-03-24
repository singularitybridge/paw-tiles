'use client';

import { getAvatar, getSkillDescription } from '@/lib/avatars';
import { useGameStore } from '@/lib/gameStore';

interface AvatarSkillsProps {
  avatarId: string;
  onBack: () => void;
}

export default function AvatarSkills({ avatarId, onBack }: AvatarSkillsProps) {
  const { stars, getSkillLevel, upgradeSkill, unlockedAvatarIds } = useGameStore();
  const avatar = getAvatar(avatarId);
  const currentLevel = getSkillLevel(avatarId);
  const isOwned = unlockedAvatarIds.includes(avatarId);
  const maxLevel = avatar.skillLevels.length;
  const nextLevel = avatar.skillLevels.find(sl => sl.level === currentLevel + 1);

  return (
    <div className="menu-container">
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <h2 className="screen-title">{avatar.name}</h2>
        <div className="header-stars">
          <span className="star-icon">★</span> {stars}
        </div>
      </div>

      <div className="skill-detail">
        {/* Avatar portrait */}
        <div className="skill-avatar-frame">
          <img src={avatar.image} alt={avatar.name} />
        </div>

        {/* Skill name */}
        <h3 className="skill-name">{avatar.skill}</h3>

        {/* Level pips */}
        <div className="skill-level-pips">
          {avatar.skillLevels.map(sl => (
            <div
              key={sl.level}
              className={`skill-pip ${sl.level <= currentLevel ? 'filled' : ''}`}
            />
          ))}
        </div>
        <div className="skill-level-label">
          Level {currentLevel} / {maxLevel}
        </div>

        {/* All levels */}
        <div className="skill-levels-list">
          {avatar.skillLevels.map(sl => (
            <div
              key={sl.level}
              className={`skill-level-row ${sl.level === currentLevel ? 'active' : ''} ${sl.level > currentLevel ? 'future' : ''}`}
            >
              <span className="skill-level-num">Lv{sl.level}</span>
              <span className="skill-level-desc">{sl.description}</span>
              {sl.level <= currentLevel && <span className="skill-level-check">✓</span>}
            </div>
          ))}
        </div>

        {/* Upgrade button */}
        {isOwned && nextLevel && (
          <button
            className="skill-upgrade-btn"
            onClick={() => upgradeSkill(avatarId)}
            disabled={stars < nextLevel.upgradeCost}
          >
            Upgrade to Lv{nextLevel.level}
            <span className="skill-upgrade-cost">
              <span className="star-icon">★</span> {nextLevel.upgradeCost}
            </span>
          </button>
        )}

        {isOwned && !nextLevel && (
          <div className="skill-max-label">Max Level Reached</div>
        )}

        {!isOwned && (
          <div className="skill-max-label">Unlock {avatar.name} first</div>
        )}
      </div>
    </div>
  );
}
