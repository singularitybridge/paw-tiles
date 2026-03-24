'use client';

import { MUSIC_TRACKS } from '@/lib/music';
import { useGameStore } from '@/lib/gameStore';

interface MusicScreenProps {
  onBack: () => void;
}

export default function MusicScreen({ onBack }: MusicScreenProps) {
  const { selectedMusicId, unlockedMusicIds, stars, selectMusic, unlockMusic } = useGameStore();

  const handleTap = (id: string) => {
    if (unlockedMusicIds.includes(id)) {
      selectMusic(id);
    } else {
      unlockMusic(id);
    }
  };

  return (
    <div className="menu-container">
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <h2 className="screen-title">Music</h2>
        <div className="header-stars">
          <span className="star-icon">★</span> {stars}
        </div>
      </div>

      <div className="music-list">
        {MUSIC_TRACKS.map(track => {
          const unlocked = unlockedMusicIds.includes(track.id);
          const selected = track.id === selectedMusicId;
          const canAfford = stars >= track.unlockCost;

          return (
            <button
              key={track.id}
              className={`music-track ${selected ? 'selected' : ''} ${!unlocked ? 'locked' : ''}`}
              onClick={() => handleTap(track.id)}
              disabled={!unlocked && !canAfford}
            >
              <div className="music-track-icon">
                {selected ? '♫' : unlocked ? '♪' : '🔒'}
              </div>
              <div className="music-track-info">
                <span className="music-track-name">{track.name}</span>
                <span className="music-track-desc">{track.description}</span>
              </div>
              <div className="music-track-right">
                {!unlocked ? (
                  <span className="music-track-cost">
                    <span className="star-icon">★</span> {track.unlockCost}
                  </span>
                ) : (
                  <span className="music-track-duration">{track.duration}</span>
                )}
              </div>
            </button>
          );
        })}

        <div className="music-note">
          Audio tracks coming soon — select to set your preference
        </div>
      </div>
    </div>
  );
}
