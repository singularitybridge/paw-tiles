'use client';

import { AVATARS } from '@/lib/avatars';
import { useGameStore } from '@/lib/gameStore';
import ScreenHeader from './ScreenHeader';
import type { Screen } from './MainMenu';

interface DesignerHubProps {
  onNavigate: (screen: Screen) => void;
}

export default function DesignerHub({ onNavigate }: DesignerHubProps) {
  const { stars, addStars, resetProgress, selectedAvatar, unlockedAvatarIds } = useGameStore();

  return (
    <div className="menu-container">
      <ScreenHeader title="Game Designer" onBack={() => onNavigate('menu')} showStars={false} />

      <div className="designer-grid">
        {/* Debug: Game State */}
        <div className="designer-debug-section">
          <span className="designer-debug-label">Debug: Game State</span>

          <div className="designer-debug-row">
            <div className="designer-debug-avatar">
              <img src={selectedAvatar.image} alt={selectedAvatar.name} />
            </div>
            <div className="designer-debug-state">
              <span className="designer-debug-stat">{selectedAvatar.name}</span>
              <span className="designer-debug-stat-sub">{unlockedAvatarIds.length} avatars unlocked</span>
            </div>
            <span className="designer-debug-balance"><span className="star-icon">★</span> {stars}</span>
          </div>

          <div className="designer-debug-btns">
            <button className="designer-debug-btn" onClick={() => addStars(10)}>+10</button>
            <button className="designer-debug-btn" onClick={() => addStars(50)}>+50</button>
            <button className="designer-debug-btn" onClick={() => addStars(200)}>+200</button>
            <button className="designer-debug-btn remove" onClick={() => resetProgress()}>Reset State</button>
          </div>
        </div>

        <button className="designer-card" onClick={() => onNavigate('designer-tiles')}>
          <div className="designer-card-icon">
            <img src="/tiles/dots-3.png" alt="Tiles" style={{ width: 48, height: 48, objectFit: 'contain' }} />
          </div>
          <span className="designer-card-label">Tiles</span>
          <span className="designer-card-desc">18 designs</span>
        </button>

        {/* Avatar Worlds — each cat with their background */}
        <div className="designer-worlds-section">
          <span className="designer-debug-label">Avatar Worlds</span>
          <div className="designer-worlds-list">
            {AVATARS.map(avatar => {
              const isUnlocked = unlockedAvatarIds.includes(avatar.id);
              const isActive = avatar.id === selectedAvatar.id;
              return (
                <div key={avatar.id} className={`designer-world-card ${isActive ? 'active' : ''}`}>
                  <div className="designer-world-bg">
                    <img src={avatar.background} alt={`${avatar.name}'s world`} />
                  </div>
                  <div className="designer-world-overlay">
                    <div className="designer-world-avatar">
                      <img src={avatar.image} alt={avatar.name} />
                    </div>
                    <span className="designer-world-name">{avatar.name}</span>
                    <div className="designer-world-footer">
                      {avatar.unlockCost > 0 && (
                        <span className="designer-world-cost"><span className="star-icon">★</span> {avatar.unlockCost}</span>
                      )}
                      {isActive && (
                        <span className="designer-world-active">Active</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
