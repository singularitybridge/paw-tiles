'use client';

import type { Screen } from './MainMenu';

interface DesignerHubProps {
  onNavigate: (screen: Screen) => void;
}

export default function DesignerHub({ onNavigate }: DesignerHubProps) {
  return (
    <div className="menu-container">
      <div className="screen-header">
        <button className="back-btn" onClick={() => onNavigate('menu')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <h2 className="screen-title">Game Designer</h2>
        <div style={{ width: 36 }} />
      </div>

      <div className="designer-grid">
        <button className="designer-card" onClick={() => onNavigate('designer-tiles')}>
          <div className="designer-card-icon">
            <img src="/tiles/dots-3.png" alt="Tiles" style={{ width: 48, height: 48, objectFit: 'contain' }} />
          </div>
          <span className="designer-card-label">Tiles</span>
          <span className="designer-card-desc">18 designs</span>
        </button>

        <button className="designer-card" onClick={() => onNavigate('designer-backgrounds')}>
          <div className="designer-card-icon" style={{ fontSize: '2rem' }}>🖼️</div>
          <span className="designer-card-label">Backgrounds</span>
          <span className="designer-card-desc">1 available</span>
        </button>

        <button className="designer-card" onClick={() => onNavigate('designer-music')}>
          <div className="designer-card-icon" style={{ fontSize: '2rem' }}>🎵</div>
          <span className="designer-card-label">Music</span>
          <span className="designer-card-desc">Coming soon</span>
        </button>
      </div>
    </div>
  );
}
