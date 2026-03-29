'use client';

import { AVATARS } from '@/lib/avatars';
import { useGameStore } from '@/lib/gameStore';
import ScreenHeader from './ScreenHeader';

interface MusicScreenProps {
  onBack: () => void;
}

export default function MusicScreen({ onBack }: MusicScreenProps) {
  const { selectedAvatar, unlockedAvatarIds, stars } = useGameStore();

  return (
    <div className="menu-container">
      <ScreenHeader title="Music" onBack={onBack} />

      <div className="music-list">
        <div className="music-note" style={{ marginBottom: 8 }}>
          Each avatar brings their own background music. Select an avatar to hear their world.
        </div>

        {AVATARS.map(avatar => {
          const unlocked = unlockedAvatarIds.includes(avatar.id);
          const active = avatar.id === selectedAvatar.id;

          return (
            <div
              key={avatar.id}
              className={`music-track ${active ? 'selected' : ''} ${!unlocked ? 'locked' : ''}`}
            >
              <div className="music-track-icon" style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                <img src={avatar.image} alt={avatar.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="music-track-info">
                <span className="music-track-name">{avatar.name}</span>
                <span className="music-track-desc">
                  {active ? 'Now playing' : unlocked ? 'Unlocked' : `★ ${avatar.unlockCost} to unlock`}
                </span>
              </div>
              <div className="music-track-right">
                {active ? (
                  <span style={{ fontSize: '1.2rem' }}>♫</span>
                ) : unlocked ? (
                  <span style={{ fontSize: '1rem', opacity: 0.4 }}>♪</span>
                ) : (
                  <span style={{ fontSize: '1rem', opacity: 0.3 }}>🔒</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
