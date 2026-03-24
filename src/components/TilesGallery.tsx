'use client';

import { useState } from 'react';
import { TILE_TYPES } from '@/lib/mahjong';

const TILE_IMAGES: Record<string, string> = {
  'dots-1': '/tiles/dots-1.png', 'dots-2': '/tiles/dots-2.png', 'dots-3': '/tiles/dots-3.png',
  'dots-4': '/tiles/dots-4.png', 'dots-5': '/tiles/dots-5.png', 'dots-6': '/tiles/dots-6.png',
  'bamboo-1': '/tiles/bamboo-1.png', 'bamboo-2': '/tiles/bamboo-2.png', 'bamboo-3': '/tiles/bamboo-3.png',
  'bamboo-4': '/tiles/bamboo-4.png', 'bamboo-5': '/tiles/bamboo-5.png', 'bamboo-6': '/tiles/bamboo-6.png',
  'characters-1': '/tiles/characters-1.png', 'characters-2': '/tiles/characters-2.png', 'characters-3': '/tiles/characters-3.png',
  'characters-4': '/tiles/characters-4.png', 'characters-5': '/tiles/characters-5.png', 'characters-6': '/tiles/characters-6.png',
};

const SUITS = [
  { key: 'dots', label: 'Dots' },
  { key: 'bamboo', label: 'Bamboo' },
  { key: 'characters', label: 'Characters' },
];

interface TilesGalleryProps {
  onBack: () => void;
}

export default function TilesGallery({ onBack }: TilesGalleryProps) {
  const [zoomed, setZoomed] = useState<string | null>(null);

  return (
    <div className="menu-container">
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <h2 className="screen-title">Tiles</h2>
        <div style={{ width: 36 }} />
      </div>

      <div className="tiles-gallery-scroll">
        {SUITS.map(suit => {
          const suitTiles = TILE_TYPES.filter(t => t.suit === suit.key);
          return (
            <div key={suit.key} className="tiles-suit-section">
              <h3 className="tiles-suit-label">{suit.label}</h3>
              <div className="tiles-suit-grid">
                {suitTiles.map(tile => (
                  <button
                    key={tile.matchGroup}
                    className="tiles-gallery-card"
                    onClick={() => setZoomed(tile.matchGroup)}
                  >
                    <img
                      src={TILE_IMAGES[tile.matchGroup]}
                      alt={tile.label}
                    />
                    <span className="tiles-gallery-label">{tile.label}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Zoom overlay */}
      {zoomed && (
        <div className="tiles-zoom-overlay" onClick={() => setZoomed(null)}>
          <div className="tiles-zoom-card">
            <img src={TILE_IMAGES[zoomed]} alt={zoomed} />
            <span className="tiles-zoom-label">
              {TILE_TYPES.find(t => t.matchGroup === zoomed)?.label}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
