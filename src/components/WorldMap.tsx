'use client';

import { useState } from 'react';
import { useGameStore } from '@/lib/gameStore';
import { AREAS, BOARDS_TO_UNLOCK, Area } from '@/lib/worldMap';
import { getAvatar } from '@/lib/avatars';
import ScreenHeader from './ScreenHeader';

interface WorldMapProps {
  onBack: () => void;
  onPlayBoard: (areaId: string, boardId: number) => void;
}

export default function WorldMap({ onBack, onPlayBoard }: WorldMapProps) {
  const {
    stars, selectedAvatar, isAreaUnlocked, getAreaCompletedCount,
    isBoardCompleted, setCurrentArea, currentAreaId,
  } = useGameStore();
  const [expandedArea, setExpandedArea] = useState<string | null>(null);

  const handleAreaTap = (area: Area) => {
    if (!isAreaUnlocked(area.id)) return;
    setExpandedArea(expandedArea === area.id ? null : area.id);
  };

  const handleBoardTap = (areaId: string, boardId: number) => {
    setCurrentArea(areaId);
    onPlayBoard(areaId, boardId);
  };

  return (
    <div className="menu-container">
      <ScreenHeader title="World Map" onBack={onBack} />

      {/* Map scroll area */}
      <div className="worldmap-scroll">
        {/* Player avatar indicator at top */}
        <div className="worldmap-player">
          <div className="worldmap-player-avatar">
            <img src={selectedAvatar.image} alt={selectedAvatar.name} />
          </div>
          <span className="worldmap-player-name">{selectedAvatar.name}&apos;s Journey</span>
        </div>

        {/* Path with areas */}
        <div className="worldmap-path">
          {AREAS.map((area, index) => {
            const unlocked = isAreaUnlocked(area.id);
            const completed = getAreaCompletedCount(area.id);
            const totalBoards = area.boards.length;
            const isExpanded = expandedArea === area.id;
            const avatar = getAvatar(area.avatarId);
            const isCurrent = currentAreaId === area.id;
            const isLast = index === AREAS.length - 1;

            return (
              <div key={area.id} className="worldmap-area-wrapper">
                {/* Connecting path line (except for last) */}
                {!isLast && (
                  <div className={`worldmap-connector ${unlocked ? 'unlocked' : ''}`}>
                    <div className="worldmap-connector-dots" />
                  </div>
                )}

                {/* Area node */}
                <button
                  className={`worldmap-area ${unlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'current' : ''} ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => handleAreaTap(area)}
                  disabled={!unlocked}
                >
                  <div className="worldmap-area-icon">
                    {unlocked ? (
                      <img src={avatar.image} alt={avatar.name} className="worldmap-area-avatar" />
                    ) : (
                      <span className="worldmap-area-lock">🔒</span>
                    )}
                  </div>
                  <div className="worldmap-area-info">
                    <span className="worldmap-area-name">{area.emoji} {area.name}</span>
                    <span className="worldmap-area-desc">{area.description}</span>
                    {unlocked && (
                      <span className="worldmap-area-progress">
                        {completed}/{totalBoards} boards
                        {completed >= BOARDS_TO_UNLOCK && index < AREAS.length - 1 && ' ✓'}
                      </span>
                    )}
                    {!unlocked && (
                      <span className="worldmap-area-locked-hint">
                        Complete {BOARDS_TO_UNLOCK} boards in {AREAS[index - 1]?.name || 'previous area'}
                      </span>
                    )}
                  </div>
                </button>

                {/* Expanded board list */}
                {isExpanded && unlocked && (
                  <div className="worldmap-boards">
                    {area.boards.map((board) => {
                      const done = isBoardCompleted(area.id, board.id);
                      return (
                        <button
                          key={board.id}
                          className={`worldmap-board ${done ? 'completed' : ''}`}
                          onClick={() => handleBoardTap(area.id, board.id)}
                        >
                          <span className="worldmap-board-num">{board.id}</span>
                          <span className="worldmap-board-name">{board.name}</span>
                          <span className="worldmap-board-reward">
                            {done ? (
                              <span className="worldmap-board-done">✓</span>
                            ) : (
                              <><span className="star-icon">★</span> {board.starReward}</>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
