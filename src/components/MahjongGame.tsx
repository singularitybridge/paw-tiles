'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shuffle, Lightbulb, Undo2, RotateCcw, Trophy, Home,
} from 'lucide-react';
import {
  GameTile, SlotItem, TileType, TileState,
  generateGame, getTileState,
  findSlotMatch, findHint,
  getRemainingCount, shuffleRemaining,
  BOARD_COLS, BOARD_ROWS, SLOT_COUNT, MAX_LAYERS,
  type GeneratedGame,
} from '@/lib/mahjong';
import { useGameStore } from '@/lib/gameStore';
import TutorialOverlay, { useTutorial } from './TutorialOverlay';

// ── Audio ─────────────────────────────────
function useAudio() {
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const sfxRefs = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    const bgm = new Audio('/audio/bgm.mp3');
    bgm.loop = true;
    bgm.volume = 0.15;
    bgmRef.current = bgm;

    sfxRefs.current = {
      tap: new Audio('/audio/tap.mp3'),
      match: new Audio('/audio/match.mp3'),
      gameover: new Audio('/audio/gameover.mp3'),
      win: new Audio('/audio/win.mp3'),
    };
    sfxRefs.current.tap.volume = 0.3;
    sfxRefs.current.match.volume = 0.35;
    sfxRefs.current.gameover.volume = 0.3;
    sfxRefs.current.win.volume = 0.35;

    return () => { bgm.pause(); bgm.src = ''; };
  }, []);

  const startBgm = useCallback(() => {
    bgmRef.current?.play().catch(() => {});
  }, []);

  const stopBgm = useCallback(() => {
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.currentTime = 0;
    }
  }, []);

  const playSfx = useCallback((name: string) => {
    const sfx = sfxRefs.current[name];
    if (sfx) {
      sfx.currentTime = 0;
      sfx.play().catch(() => {});
    }
  }, []);

  return { startBgm, stopBgm, playSfx };
}

const TILE_IMAGES: Record<string, string> = {
  'dots-1': '/tiles/dots-1.png', 'dots-2': '/tiles/dots-2.png', 'dots-3': '/tiles/dots-3.png',
  'dots-4': '/tiles/dots-4.png', 'dots-5': '/tiles/dots-5.png', 'dots-6': '/tiles/dots-6.png',
  'bamboo-1': '/tiles/bamboo-1.png', 'bamboo-2': '/tiles/bamboo-2.png', 'bamboo-3': '/tiles/bamboo-3.png',
  'bamboo-4': '/tiles/bamboo-4.png', 'bamboo-5': '/tiles/bamboo-5.png', 'bamboo-6': '/tiles/bamboo-6.png',
  'characters-1': '/tiles/characters-1.png', 'characters-2': '/tiles/characters-2.png', 'characters-3': '/tiles/characters-3.png',
  'characters-4': '/tiles/characters-4.png', 'characters-5': '/tiles/characters-5.png', 'characters-6': '/tiles/characters-6.png',
};

const CONFETTI_COLORS = ['#fcd34d', '#f59e0b', '#ef4444', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
const CONFETTI = Array.from({ length: 50 }, (_, i) => ({
  left: ((i * 37 + 13) % 100),
  delay: i * 0.07,
  duration: 2.5 + (i % 5) * 0.4,
  color: CONFETTI_COLORS[i % 7],
  size: 6 + (i % 4) * 2,
  drift: ((i * 23) % 60) - 30,
}));

type GameState = 'idle' | 'playing' | 'won' | 'lost';

interface Dims {
  tw: number; th: number; gap: number; lo: number;
  fontSize: number; suitSize: number;
  boardW: number; boardH: number; pad: number;
}

interface FlyingTileInfo {
  id: number;
  type: TileType;
  startX: number; startY: number;
  targetX: number; targetY: number;
  width: number; height: number;
  targetSlotIdx: number;
}

interface ScorePopup {
  id: number; value: number; x: number; y: number;
}

function calcDims(vw: number, vh: number): Dims {
  const maxW = Math.min(vw, Math.round(vh * (9 / 16)));
  const availW = maxW - 6;
  const headerH = 34;
  const slotBarH = 56;
  const controlsH = 52;
  const availH = vh - headerH - slotBarH - controlsH - 6;
  const pad = 3;
  const loRatio = 0.25;
  const tileRatio = 1.35;
  const gapRatio = 0.02;
  const topLayer = MAX_LAYERS - 1;

  const colF = BOARD_COLS + (BOARD_COLS - 1) * gapRatio;
  let tw = Math.floor((availW - pad * 2) / (colF + loRatio * topLayer));
  let th = Math.round(tw * tileRatio);

  const rowF = BOARD_ROWS + (BOARD_ROWS - 1) * gapRatio;
  const maxLoH = Math.round(tw * loRatio) * topLayer * 1.1;
  const maxTh = Math.floor((availH - pad * 2 - maxLoH) / rowF);
  if (th > maxTh) { th = maxTh; tw = Math.round(th / tileRatio); }

  tw = Math.max(32, Math.min(120, tw));
  th = Math.round(tw * tileRatio);

  const gap = Math.max(3, Math.round(tw * gapRatio));
  const lo = Math.max(5, Math.round(tw * loRatio));
  const fontSize = Math.max(14, Math.round(tw * 0.5));
  const suitSize = Math.max(7, Math.round(tw * 0.2));
  const maxLayerOffset = lo * topLayer;
  const boardW = (BOARD_COLS - 1) * (tw + gap) + tw + pad * 2 + maxLayerOffset;
  const boardH = (BOARD_ROWS - 1) * (th + gap) + th + pad * 2 + Math.round(maxLayerOffset * 1.1);

  return { tw, th, gap, lo, fontSize, suitSize, boardW, boardH, pad };
}

interface Snapshot { tiles: GameTile[]; slots: (SlotItem | null)[]; score: number }

interface MahjongGameProps {
  onBack?: () => void;
  onSettings?: () => void;
}

export default function MahjongGame({ onBack, onSettings }: MahjongGameProps) {
  const { selectedAvatar, addStars, bgStyle, getSkillLevel, vibrate } = useGameStore();
  const { startBgm, stopBgm, playSfx } = useAudio();
  const { showTutorial, completeTutorial } = useTutorial();
  const [tiles, setTiles] = useState<GameTile[]>([]);
  const [slots, setSlots] = useState<(SlotItem | null)[]>(Array(SLOT_COUNT).fill(null));
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [matchingSlots, setMatchingSlots] = useState<number[]>([]);
  const [flyingTiles, setFlyingTiles] = useState<FlyingTileInfo[]>([]);
  const [hiddenSlots, setHiddenSlots] = useState<Set<number>>(new Set());
  const [hintId, setHintId] = useState<number | null>(null);
  const [isDealing, setIsDealing] = useState(false);
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  const [shakeBoard, setShakeBoard] = useState(false);
  const [boardSeed, setBoardSeed] = useState(0);
  const [dims, setDims] = useState<Dims>(() =>
    typeof window !== 'undefined' ? calcDims(window.innerWidth, window.innerHeight) : calcDims(400, 800),
  );
  const dealRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>(new Array(SLOT_COUNT).fill(null));
  const popupIdRef = useRef(0);

  // Refs for latest state in async callbacks
  const slotsRef = useRef(slots);
  const hiddenSlotsRef = useRef(new Set<number>());
  const matchActiveRef = useRef(false);
  const scoreMultiplierRef = useRef(1);
  const shuffleFreeRef = useRef(false);
  useEffect(() => { slotsRef.current = slots; }, [slots]);

  // ── Responsive ────────────────────────────
  useEffect(() => {
    const r = () => setDims(calcDims(window.innerWidth, window.innerHeight));
    r(); window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);

  const SLOT_RATIO = 0.8;
  const slotTw = Math.round(dims.tw * SLOT_RATIO);
  const slotTh = Math.round(dims.th * SLOT_RATIO);
  const slotW = dims.tw + dims.gap;
  const slotH = dims.th + dims.gap;

  // ── Score popups ──────────────────────────
  const addScorePopup = useCallback((value: number, x: number, y: number) => {
    const id = ++popupIdRef.current;
    setScorePopups(prev => [...prev, { id, value, x, y }]);
    setTimeout(() => setScorePopups(prev => prev.filter(p => p.id !== id)), 1000);
  }, []);

  // ── New Game ──────────────────────────────
  const startNewGame = useCallback(() => {
    const game = generateGame();
    setTiles(game.tiles);
    setBoardSeed(game.seed);
    setSlots(Array(SLOT_COUNT).fill(null));
    slotsRef.current = Array(SLOT_COUNT).fill(null);
    setScore(0);
    setGameState('playing');
    setMatchingSlots([]);
    setFlyingTiles([]);
    setHiddenSlots(new Set());
    hiddenSlotsRef.current = new Set();
    matchActiveRef.current = false;
    setHintId(null);
    setHistory([]);
    setShakeBoard(false);
    setScorePopups([]);
    setIsDealing(true);
    startBgm();
    if (dealRef.current) clearTimeout(dealRef.current);
    dealRef.current = setTimeout(() => setIsDealing(false), 1500);
  }, [startBgm]);

  useEffect(() => { startNewGame(); return () => { if (dealRef.current) clearTimeout(dealRef.current); }; }, [startNewGame]);

  // ── Tile states ───────────────────────────
  const tileStates = useMemo(() => {
    const states = new Map<number, TileState>();
    for (const tile of tiles) {
      if (tile.removed) continue;
      states.set(tile.id, getTileState(tile, tiles));
    }
    return states;
  }, [tiles]);

  const freeTileIds = useMemo(
    () => new Set([...tileStates.entries()].filter(([, s]) => s === 'free').map(([id]) => id)),
    [tileStates],
  );

  // ── Win check ─────────────────────────────
  useEffect(() => {
    if (gameState !== 'playing' || isDealing) return;
    if (getRemainingCount(tiles) === 0 && slots.every(s => s === null)) {
      setGameState('won');
      playSfx('win');
      stopBgm();
      vibrate([30, 50, 30, 50, 30, 80, 60]);
      // Award stars: 1 base + bonus for high score
      const bonus = score >= 1000 ? 2 : score >= 500 ? 1 : 0;
      addStars(1 + bonus);
    }
  }, [tiles, slots, gameState, isDealing, playSfx, stopBgm]);

  // ── Fly complete → reveal slot tile, check match ──
  const handleFlyComplete = useCallback((flyId: number, slotIdx: number) => {
    setFlyingTiles(prev => prev.filter(f => f.id !== flyId));

    // Reveal the slot tile
    hiddenSlotsRef.current.delete(slotIdx);
    setHiddenSlots(new Set(hiddenSlotsRef.current));

    // Skip if a match is already being cleared
    if (matchActiveRef.current) return;

    const curSlots = slotsRef.current;
    const match = findSlotMatch(curSlots);
    if (match && !hiddenSlotsRef.current.has(match[0]) && !hiddenSlotsRef.current.has(match[1])) {
      matchActiveRef.current = true;
      setMatchingSlots(match);
      playSfx('match');
      vibrate([15, 40, 15]);

      setTimeout(() => {
        matchActiveRef.current = false;
        setSlots(prev => {
          const cleared = [...prev];
          cleared[match[0]] = null;
          cleared[match[1]] = null;
          slotsRef.current = cleared;
          return cleared;
        });
        setMatchingSlots([]);
        const pts = Math.round(100 * scoreMultiplierRef.current);
        setScore(s => s + pts);
        addScorePopup(pts, window.innerWidth / 2, 80);
      }, 500);
      return;
    }

    // Game over check
    if (!match && curSlots.every(s => s !== null) && hiddenSlotsRef.current.size === 0) {
      setShakeBoard(true);
      vibrate([50, 30, 50, 30, 100]);
      playSfx('gameover');
      stopBgm();
      setTimeout(() => {
        setShakeBoard(false);
        setGameState('lost');
      }, 600);
    }
  }, [addScorePopup, playSfx, stopBgm]);

  // ── Tile Click — non-blocking, concurrent ──
  const handleTileClick = useCallback((id: number, e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== 'playing' || isDealing) return;
    const tile = tiles.find(t => t.id === id);
    if (!tile || tile.removed || !freeTileIds.has(id)) return;

    const emptyIdx = slots.findIndex(s => s === null);
    if (emptyIdx === -1) return;

    setHintId(null);
    playSfx('tap');
    vibrate(10);
    setHistory(h => [...h, { tiles, slots, score }]);

    // Remove tile from board
    const newTiles = tiles.map(t => t.id === id ? { ...t, removed: true } : t);
    setTiles(newTiles);

    // Fill slot immediately (hidden until fly lands)
    const newSlots = [...slots] as (SlotItem | null)[];
    newSlots[emptyIdx] = { tileId: id, type: tile.type };
    slotsRef.current = newSlots;
    setSlots(newSlots);

    // Mark slot as hidden
    hiddenSlotsRef.current.add(emptyIdx);
    setHiddenSlots(new Set(hiddenSlotsRef.current));

    // Start fly animation
    const tileRect = e.currentTarget.getBoundingClientRect();
    const slotEl = slotRefs.current[emptyIdx];
    const slotRect = slotEl?.getBoundingClientRect();

    if (slotRect) {
      setFlyingTiles(prev => [...prev, {
        id: Date.now() * 100 + id,
        type: tile.type,
        startX: tileRect.left,
        startY: tileRect.top,
        targetX: slotRect.left + (slotRect.width - tileRect.width) / 2,
        targetY: slotRect.top + (slotRect.height - tileRect.height) / 2,
        width: tileRect.width,
        height: tileRect.height,
        targetSlotIdx: emptyIdx,
      }]);
    } else {
      // No slot rect — reveal immediately
      hiddenSlotsRef.current.delete(emptyIdx);
      setHiddenSlots(new Set(hiddenSlotsRef.current));
    }
  }, [tiles, slots, score, gameState, isDealing, freeTileIds, playSfx]);

  // ── Actions ───────────────────────────────
  const hintAction = useCallback(() => {
    if (gameState !== 'playing') return;
    const h = findHint(tiles, slots);
    if (h !== null) setHintId(h);
  }, [tiles, slots, gameState]);

  const shuffleAction = useCallback(() => {
    setTiles(shuffleRemaining(tiles));
    setHintId(null);
    if (!shuffleFreeRef.current) {
      setScore(s => Math.max(0, s - 100));
    }
  }, [tiles]);

  const undoAction = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setTiles(last.tiles);
    setSlots(last.slots);
    slotsRef.current = last.slots;
    setScore(last.score);
    setHistory(h => h.slice(0, -1));
    setHintId(null);
    setMatchingSlots([]);
    setFlyingTiles([]);
    setHiddenSlots(new Set());
    hiddenSlotsRef.current = new Set();
    matchActiveRef.current = false;
    if (gameState === 'lost') setGameState('playing');
  }, [history, gameState]);

  // ── Keyboard ──────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'n' || e.key === 'N') startNewGame();
      if (e.key === 'h' || e.key === 'H') hintAction();
      if (e.key === 's' || e.key === 'S') shuffleAction();
      if ((e.key === 'z' && (e.ctrlKey || e.metaKey)) || e.key === 'u') undoAction();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [startNewGame, hintAction, shuffleAction, undoAction]);

  const filledSlots = slots.filter(s => s !== null).length;

  const renderIcon = (type: TileType, tileWidth: number) => {
    const src = TILE_IMAGES[type.matchGroup];
    const imgSize = Math.round(tileWidth * 0.82);
    return src ? <img src={src} alt={type.matchGroup} width={imgSize} height={imgSize} style={{ objectFit: 'contain', pointerEvents: 'none', borderRadius: '4px' }} /> : null;
  };

  // ── Skill effects ────────────────────────
  const skillLevel = getSkillLevel(selectedAvatar.id);
  const scoreMultiplier = selectedAvatar.skillId === 'fortune'
    ? [1, 1.25, 1.5, 2][skillLevel] || 1
    : 1;
  const shuffleFree = selectedAvatar.skillId === 'wisdom';
  scoreMultiplierRef.current = scoreMultiplier;
  shuffleFreeRef.current = shuffleFree;

  // ── Render ────────────────────────────────
  return (
    <div className="game-container" style={{ background: bgStyle }}>
      {/* Game Header */}
      <div className="game-header">
        <div className="game-header-left">
          {onBack && (
            <button className="game-home-btn" onClick={onBack}>
              <Home size={18} color="rgba(255,255,255,0.5)" strokeWidth={2} />
            </button>
          )}
          <div className="game-avatar" onClick={onSettings} role="button" tabIndex={0}>
            <img src={selectedAvatar.image} alt={selectedAvatar.name} />
          </div>
        </div>
        <div className="game-header-right">
          <span className="score-value" key={score}>{score.toLocaleString()}</span>
          <span className="board-seed">#{boardSeed}</span>
        </div>
      </div>

      {/* Slot Bar — at the top */}
      <div className="slot-bar">
        {slots.map((slot, idx) => (
          <div
            key={idx}
            ref={(el) => { slotRefs.current[idx] = el; }}
            className={`slot ${slot ? 'filled' : 'empty'} ${filledSlots >= 3 && !slot ? 'danger' : ''}`}
            style={{ width: slotTw + 2, height: slotTh + 2, borderRadius: Math.max(4, slotTw * 0.1) }}
          >
            {slot && !hiddenSlots.has(idx) && (
              <div
                key={slot.tileId}
                className={`slot-tile ${matchingSlots.includes(idx) ? 'match-out' : ''}`}
                style={{ width: slotTw, height: slotTh, borderRadius: Math.max(3, slotTw * 0.08) }}
              >
                <div className="tile-icon">
                  {renderIcon(slot.type, slotTw)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Board */}
      <div className={`board-wrapper ${shakeBoard ? 'shake' : ''}`}>
        <div className="board" style={{ width: dims.boardW, height: dims.boardH, position: 'relative', left: -Math.round(dims.lo * (MAX_LAYERS - 1) / 2) }}>
          {tiles
            .filter(t => !t.removed)
            .sort((a, b) => a.position.layer - b.position.layer || a.position.row - b.position.row || a.position.col - b.position.col)
            .map(tile => {
              const state = tileStates.get(tile.id) || 'top-blocked';
              const isFree = state === 'free';
              const isHint = hintId === tile.id;

              const maxLo = dims.lo * (MAX_LAYERS - 1);
              const left = tile.position.col * slotW + dims.pad + maxLo - tile.position.layer * dims.lo;
              const top = tile.position.row * slotH + dims.pad + maxLo - tile.position.layer * dims.lo * 1.1;
              const zIndex = tile.position.layer * 1000 + tile.position.row * 20 + tile.position.col;
              const dealDelay = tile.position.layer * 300 + tile.position.row * 40 + tile.position.col * 15;

              const cls = [
                'tile',
                state === 'free' ? 'free' : state === 'side-blocked' ? 'side-blocked' : 'blocked',
                isHint && 'hint',
                isDealing && 'dealing',
                `layer-${tile.position.layer}`,
              ].filter(Boolean).join(' ');

              return (
                <div
                  key={tile.id}
                  className={cls}
                  style={{
                    left, top, zIndex,
                    width: dims.tw, height: dims.th,
                    borderRadius: Math.max(4, dims.tw * 0.1),
                    animationDelay: isDealing ? `${dealDelay}ms` : undefined,
                  }}
                  onClick={isFree ? (e) => handleTileClick(tile.id, e) : undefined}
                  title={tile.type.label}
                >
                  <div className="tile-icon">
                    {renderIcon(tile.type, dims.tw)}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Flying Tiles — concurrent spring animations */}
      <AnimatePresence>
        {flyingTiles.map(fly => (
          <motion.div
            key={fly.id}
            className="flying-tile"
            style={{
              position: 'fixed',
              left: fly.startX,
              top: fly.startY,
              width: fly.width,
              height: fly.height,
              borderRadius: Math.max(4, dims.tw * 0.1),
              zIndex: 10000,
            }}
            initial={{ x: 0, y: 0, scale: 1 }}
            animate={{
              x: fly.targetX - fly.startX,
              y: fly.targetY - fly.startY,
              scale: SLOT_RATIO,
            }}
            transition={{
              x: { type: 'spring', stiffness: 280, damping: 26, mass: 0.5 },
              y: { type: 'spring', stiffness: 280, damping: 26, mass: 0.5 },
              scale: { duration: 0.3, ease: 'easeOut' },
            }}
            onAnimationComplete={() => handleFlyComplete(fly.id, fly.targetSlotIdx)}
          >
            <div className="tile-icon">
              {renderIcon(fly.type, dims.tw)}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Score Popups */}
      {scorePopups.map(popup => (
        <div
          key={popup.id}
          className={`score-popup ${popup.value >= 100 ? 'big' : ''}`}
          style={{ left: popup.x, top: popup.y }}
        >
          +{popup.value}
        </div>
      ))}

      {/* Controls */}
      <div className="controls-bar">
        <button className="ctrl-circle" onClick={shuffleAction} disabled={isDealing} title="Shuffle">
          <Shuffle size={16} color="rgba(255,255,255,0.55)" strokeWidth={2} />
        </button>
        <button className="ctrl-circle" onClick={hintAction} disabled={isDealing || gameState !== 'playing'} title="Hint">
          <Lightbulb size={16} color="rgba(255,255,255,0.55)" strokeWidth={2} />
        </button>
        <button className="ctrl-circle" onClick={undoAction} disabled={isDealing || history.length === 0} title="Undo">
          <Undo2 size={16} color="rgba(255,255,255,0.55)" strokeWidth={2} />
        </button>
        <button className="ctrl-circle new-game" onClick={startNewGame} title="New Game">
          <RotateCcw size={16} color="rgba(255,255,255,0.55)" strokeWidth={2} />
        </button>
      </div>

      {/* Win */}
      {gameState === 'won' && (
        <div className="overlay">
          <div className="confetti-container">
            {CONFETTI.map((c, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${c.left}%`,
                  width: c.size,
                  height: c.size,
                  backgroundColor: c.color,
                  animationDelay: `${c.delay}s`,
                  animationDuration: `${c.duration}s`,
                  '--drift': `${c.drift}px`,
                } as React.CSSProperties}
              />
            ))}
          </div>
          <div className="overlay-card win-card">
            <div className="win-trophy">
              <Trophy size={52} color="#fcd34d" strokeWidth={1.5} />
            </div>
            <h2>You Win!</h2>
            <p>Score: <strong>{score.toLocaleString()}</strong></p>
            <button className="overlay-btn primary" onClick={startNewGame}>Play Again</button>
          </div>
        </div>
      )}

      {/* Lost */}
      {gameState === 'lost' && (
        <div className="overlay">
          <div className="overlay-card">
            <img src="/game-over-cat.png" alt="Game Over" className="overlay-img" />
            <h2>Slots Full!</h2>
            <p>No matching pair — game over.</p>
            <div className="overlay-actions">
              <button className="overlay-btn secondary" onClick={undoAction}>Undo</button>
              <button className="overlay-btn primary" onClick={startNewGame}>New Game</button>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial */}
      {showTutorial && gameState === 'playing' && !isDealing && (
        <TutorialOverlay onComplete={completeTutorial} />
      )}
    </div>
  );
}
