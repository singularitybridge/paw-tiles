'use client';

import { useGameStore } from '@/lib/gameStore';

export type Screen =
  | 'menu' | 'playing' | 'avatar' | 'avatar-skills'
  | 'designer' | 'designer-tiles' | 'designer-backgrounds' | 'designer-music'
  | 'settings' | 'world-map';

interface MainMenuProps {
  onNavigate: (screen: Screen) => void;
}

export default function MainMenu({ onNavigate }: MainMenuProps) {
  const { selectedAvatar, stars } = useGameStore();

  return (
    <div className="menu-container">
      <div className="menu-content">
        {/* Title */}
        <h1 className="menu-title">Paw Tiles</h1>
        <div className="menu-subtitle">Tile Matching Game</div>

        {/* Avatar preview */}
        <button className="menu-avatar-btn" onClick={() => onNavigate('avatar')}>
          <div className="menu-avatar-frame">
            <img src={selectedAvatar.image} alt={selectedAvatar.name} />
          </div>
          <span className="menu-avatar-name">{selectedAvatar.name}</span>
        </button>

        {/* Stars */}
        <div className="menu-stars">
          <span className="star-icon">★</span>
          <span>{stars}</span>
        </div>

        {/* Buttons */}
        <div className="menu-buttons">
          <button className="menu-btn primary" onClick={() => onNavigate('world-map')}>
            Adventure
          </button>
          <button className="menu-btn" onClick={() => onNavigate('playing')}>
            Quick Play
          </button>
          <button className="menu-btn" onClick={() => onNavigate('designer')}>
            Game Designer
          </button>
          <button className="menu-btn" onClick={() => onNavigate('settings')}>
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}
