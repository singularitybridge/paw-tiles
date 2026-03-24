'use client';

interface PlaceholderScreenProps {
  title: string;
  onBack: () => void;
}

export default function PlaceholderScreen({ title, onBack }: PlaceholderScreenProps) {
  return (
    <div className="menu-container">
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <h2 className="screen-title">{title}</h2>
        <div style={{ width: 36 }} />
      </div>

      <div className="placeholder-content">
        <div className="placeholder-icon">🚧</div>
        <p>Coming soon</p>
      </div>
    </div>
  );
}
