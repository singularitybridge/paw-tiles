// ============================================================
// Vita Mahjong — Slot-based tile matching game
// Tap tiles → they go to slots → matching pairs auto-remove
// If all 4 slots fill up with no match → game over!
// ============================================================

export type Suit = 'dots' | 'bamboo' | 'characters';

export interface TileType {
  suit: Suit;
  value: number;
  matchGroup: string;
  symbol: string;
  suitIcon: string;
  color: string;
  label: string;
}

export interface Position {
  layer: number;
  row: number;
  col: number;
}

export interface GameTile {
  id: number;
  type: TileType;
  position: Position;
  removed: boolean;
}

export interface SlotItem {
  tileId: number;
  type: TileType;
}

// Board dimensions
export const BOARD_COLS = 5; // cols 0-4
export const BOARD_ROWS = 6; // rows 0-5
export const TOTAL_TILES = 60;
export const SLOT_COUNT = 4;
export const MAX_LAYERS = 3; // layers 0-2

// ========================
// TILE TYPES — 15 types × 4 = 60
// ========================

const CHAR_NUMERALS = ['一', '二', '三', '四', '五'];

function createTileTypes(): TileType[] {
  const types: TileType[] = [];

  for (let i = 1; i <= 5; i++) {
    types.push({
      suit: 'dots', value: i, matchGroup: `dots-${i}`,
      symbol: String(i), suitIcon: '◉', color: '#dc2626',
      label: `${i} Dots`,
    });
  }

  for (let i = 1; i <= 5; i++) {
    types.push({
      suit: 'bamboo', value: i, matchGroup: `bamboo-${i}`,
      symbol: String(i), suitIcon: '竹', color: '#16a34a',
      label: `${i} Bamboo`,
    });
  }

  for (let i = 1; i <= 5; i++) {
    types.push({
      suit: 'characters', value: i, matchGroup: `characters-${i}`,
      symbol: CHAR_NUMERALS[i - 1], suitIcon: '万', color: '#2563eb',
      label: `${i} Characters`,
    });
  }

  return types;
}

export const TILE_TYPES = createTileTypes();

// ========================
// LAYOUT — 60 tiles, diamond shape, 5 cols × 6 rows × 3 layers
// Reduced from 72 for easier gameplay
// ========================

export function generateLayout(): Position[] {
  const positions: Position[] = [];

  // Layer 0 — 26 tiles (diamond base)
  const l0: [number, number][] = [
    [1, 3], // row 0: 3 tiles
    [0, 4], // row 1: 5 tiles
    [0, 4], // row 2: 5 tiles
    [0, 4], // row 3: 5 tiles
    [0, 4], // row 4: 5 tiles
    [1, 3], // row 5: 3 tiles
  ];
  for (let r = 0; r < l0.length; r++) {
    for (let c = l0[r][0]; c <= l0[r][1]; c++) {
      positions.push({ layer: 0, row: r, col: c });
    }
  }

  // Layer 1 — 22 tiles (diamond over layer 0)
  const l1: [number, number][] = [
    [1, 3], // row 0: 3 tiles
    [1, 3], // row 1: 3 tiles
    [0, 4], // row 2: 5 tiles
    [0, 4], // row 3: 5 tiles
    [1, 3], // row 4: 3 tiles
    [1, 3], // row 5: 3 tiles
  ];
  for (let r = 0; r < l1.length; r++) {
    for (let c = l1[r][0]; c <= l1[r][1]; c++) {
      positions.push({ layer: 1, row: r, col: c });
    }
  }

  // Layer 2 — 12 tiles (center rectangle)
  const l2: [number, number][] = [
    [1, 3], // row 1: 3 tiles
    [1, 3], // row 2: 3 tiles
    [1, 3], // row 3: 3 tiles
    [1, 3], // row 4: 3 tiles
  ];
  for (let r = 0; r < l2.length; r++) {
    for (let c = l2[r][0]; c <= l2[r][1]; c++) {
      positions.push({ layer: 2, row: r + 1, col: c });
    }
  }

  return positions; // 26 + 22 + 12 = 60
}

// ========================
// GAME LOGIC
// ========================

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createTilePool(): TileType[] {
  const pool: TileType[] = [];
  for (const type of TILE_TYPES) {
    for (let i = 0; i < 4; i++) pool.push(type);
  }
  return pool;
}

// Check if a board is solvable via greedy pair removal
function isSolvable(tiles: GameTile[]): boolean {
  const sim = tiles.map(t => ({ ...t }));
  let progress = true;
  while (progress) {
    progress = false;
    const remaining = sim.filter(t => !t.removed);
    if (remaining.length === 0) return true;
    const free = remaining.filter(t => getTileState(t, sim) === 'free');
    // Try to find any matching pair among free tiles
    for (let i = 0; i < free.length; i++) {
      for (let j = i + 1; j < free.length; j++) {
        if (free[i].type.matchGroup === free[j].type.matchGroup) {
          sim.find(t => t.id === free[i].id)!.removed = true;
          sim.find(t => t.id === free[j].id)!.removed = true;
          progress = true;
          break;
        }
      }
      if (progress) break;
    }
  }
  return sim.every(t => t.removed);
}

export interface GeneratedGame {
  tiles: GameTile[];
  seed: number;
  attempts: number;
}

export function generateGame(): GeneratedGame {
  const positions = generateLayout();
  const MAX_ATTEMPTS = 10;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const seed = Math.floor(Math.random() * 10000);
    const pool = shuffle(createTilePool());
    const tiles = positions.map((pos, i) => ({
      id: i, type: pool[i], position: pos, removed: false,
    }));
    if (isSolvable(tiles)) {
      return { tiles, seed, attempts: attempt };
    }
  }
  // Fallback: return last attempt anyway
  const seed = Math.floor(Math.random() * 10000);
  const pool = shuffle(createTilePool());
  const tiles = positions.map((pos, i) => ({
    id: i, type: pool[i], position: pos, removed: false,
  }));
  return { tiles, seed, attempts: MAX_ATTEMPTS + 1 };
}

// Tile state: why is it blocked?
export type TileState = 'free' | 'top-blocked' | 'side-blocked';

export function getTileState(tile: GameTile, tiles: GameTile[]): TileState {
  if (tile.removed) return 'top-blocked';
  const { layer, row, col } = tile.position;

  // Blocked if any tile sits on top
  const hasTop = tiles.some(
    (t) => !t.removed && t.position.layer > layer &&
      t.position.row === row && t.position.col === col,
  );
  if (hasTop) return 'top-blocked';

  // Blocked if tiles on BOTH left and right on same layer
  const hasLeft = tiles.some(
    (t) => !t.removed && t.position.layer === layer &&
      t.position.row === row && t.position.col === col - 1,
  );
  const hasRight = tiles.some(
    (t) => !t.removed && t.position.layer === layer &&
      t.position.row === row && t.position.col === col + 1,
  );
  if (hasLeft && hasRight) return 'side-blocked';

  return 'free';
}

export function isTileFree(tile: GameTile, tiles: GameTile[]): boolean {
  return getTileState(tile, tiles) === 'free';
}

export function tilesMatch(a: TileType, b: TileType): boolean {
  return a.matchGroup === b.matchGroup;
}

// Find a matching pair in the slots — must be same type AND same layer
export function findSlotMatch(slots: (SlotItem | null)[]): [number, number] | null {
  for (let i = 0; i < slots.length; i++) {
    if (!slots[i]) continue;
    for (let j = i + 1; j < slots.length; j++) {
      if (!slots[j]) continue;
      if (tilesMatch(slots[i]!.type, slots[j]!.type)) {
        return [i, j];
      }
    }
  }
  return null;
}

// Compact slots: shift items to the left, empties to the right
export function compactSlots(slots: (SlotItem | null)[]): (SlotItem | null)[] {
  const items = slots.filter((s): s is SlotItem => s !== null);
  const result: (SlotItem | null)[] = [...items];
  while (result.length < SLOT_COUNT) result.push(null);
  return result;
}

export function getRemainingCount(tiles: GameTile[]): number {
  return tiles.filter((t) => !t.removed).length;
}

export function shuffleRemaining(tiles: GameTile[]): GameTile[] {
  const remaining = tiles.filter((t) => !t.removed);
  const types = shuffle(remaining.map((t) => t.type));
  let idx = 0;
  return tiles.map((t) => {
    if (t.removed) return t;
    return { ...t, type: types[idx++] };
  });
}

// Hint: find a free tile that matches something in slots (same layer), or a safe pair
export function findHint(
  tiles: GameTile[],
  slots: (SlotItem | null)[],
): number | null {
  const free = tiles.filter((t) => !t.removed && isTileFree(t, tiles));

  // Priority 1: tile that matches something already in a slot (same type AND same layer)
  for (const ft of free) {
    for (const slot of slots) {
      if (slot && tilesMatch(ft.type, slot.type)) return ft.id;
    }
  }

  // Priority 2: any free tile whose match is also free AND same layer (safe pick)
  for (let i = 0; i < free.length; i++) {
    for (let j = i + 1; j < free.length; j++) {
      if (tilesMatch(free[i].type, free[j].type)) return free[i].id;
    }
  }

  // Priority 3: any free tile
  return free.length > 0 ? free[0].id : null;
}
