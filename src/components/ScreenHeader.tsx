'use client';

import { useGameStore } from '@/lib/gameStore';

interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
  rightContent?: React.ReactNode;
  showStars?: boolean;
  avatar?: { image: string; name: string; onClick?: () => void };
}

export default function ScreenHeader({ title, onBack, rightContent, showStars = true, avatar }: ScreenHeaderProps) {
  const { stars } = useGameStore();

  return (
    <div className="screen-header">
      <div className="screen-header-left">
        <button className="back-btn" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        {avatar && (
          <div className="screen-header-avatar" onClick={avatar.onClick} role={avatar.onClick ? 'button' : undefined} tabIndex={avatar.onClick ? 0 : undefined}>
            <img src={avatar.image} alt={avatar.name} />
          </div>
        )}
      </div>
      <h2 className="screen-title">{title}</h2>
      {rightContent ?? (
        showStars ? (
          <div className="header-stars">
            <span className="star-icon">★</span> {stars}
          </div>
        ) : <div style={{ width: 36 }} />
      )}
    </div>
  );
}
