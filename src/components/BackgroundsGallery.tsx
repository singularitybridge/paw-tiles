'use client';

import { BACKGROUNDS } from '@/lib/backgrounds';
import { useGameStore } from '@/lib/gameStore';

interface BackgroundsGalleryProps {
  onBack: () => void;
}

export default function BackgroundsGallery({ onBack }: BackgroundsGalleryProps) {
  const { selectedBackgroundId, unlockedBackgroundIds, stars, selectBackground, unlockBackground } = useGameStore();

  const handleTap = (id: string) => {
    if (unlockedBackgroundIds.includes(id)) {
      selectBackground(id);
    } else {
      unlockBackground(id);
    }
  };

  return (
    <div className="menu-container">
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <h2 className="screen-title">Backgrounds</h2>
        <div className="header-stars">
          <span className="star-icon">★</span> {stars}
        </div>
      </div>

      <div className="bg-gallery-scroll">
        {BACKGROUNDS.map(bg => {
          const unlocked = unlockedBackgroundIds.includes(bg.id);
          const selected = bg.id === selectedBackgroundId;
          const canAfford = stars >= bg.unlockCost;

          const previewStyle: React.CSSProperties = bg.image
            ? { background: `#0a2010 url('${bg.image}') center / cover no-repeat` }
            : { background: bg.gradient };

          return (
            <button
              key={bg.id}
              className={`bg-gallery-card ${selected ? 'selected' : ''} ${!unlocked ? 'locked' : ''}`}
              onClick={() => handleTap(bg.id)}
              disabled={!unlocked && !canAfford}
            >
              <div className="bg-gallery-preview" style={previewStyle}>
                {!unlocked && (
                  <div className="bg-lock-overlay">
                    <span className="bg-lock-cost">
                      <span className="star-icon">★</span> {bg.unlockCost}
                    </span>
                  </div>
                )}
                {selected && <div className="bg-selected-badge">Selected</div>}
              </div>
              <span className="bg-gallery-name">{bg.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
