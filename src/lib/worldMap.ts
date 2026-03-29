// ============================================================
// World Map — area definitions and board progression
// Each area is linked to a cat avatar and contains 5 boards.
// Complete 3 boards in an area to unlock the next.
// ============================================================

export interface Board {
  id: number;       // 1-5 within area
  name: string;
  starReward: number;
}

export interface Area {
  id: string;
  name: string;
  avatarId: string;   // linked cat character
  description: string;
  emoji: string;       // visual marker on the map
  boards: Board[];
}

export const AREAS: Area[] = [
  {
    id: 'kyoto-temple',
    name: 'Kyoto Temple',
    avatarId: 'mochi',
    description: 'A serene temple garden where your journey begins',
    emoji: '⛩️',
    boards: [
      { id: 1, name: 'Stone Garden', starReward: 3 },
      { id: 2, name: 'Koi Pond', starReward: 4 },
      { id: 3, name: 'Tea House', starReward: 5 },
      { id: 4, name: 'Bell Tower', starReward: 6 },
      { id: 5, name: 'Inner Sanctum', starReward: 8 },
    ],
  },
  {
    id: 'shadow-dojo',
    name: 'Shadow Dojo',
    avatarId: 'kuro',
    description: 'A moonlit training ground shrouded in mystery',
    emoji: '🌙',
    boards: [
      { id: 1, name: 'Entrance Hall', starReward: 5 },
      { id: 2, name: 'Training Room', starReward: 6 },
      { id: 3, name: 'Armory', starReward: 7 },
      { id: 4, name: 'Rooftop', starReward: 8 },
      { id: 5, name: 'Master Chamber', starReward: 10 },
    ],
  },
  {
    id: 'blossom-garden',
    name: 'Blossom Garden',
    avatarId: 'sakura',
    description: 'Floating petals and wisteria in eternal spring',
    emoji: '🌸',
    boards: [
      { id: 1, name: 'Petal Path', starReward: 6 },
      { id: 2, name: 'Wisteria Bridge', starReward: 7 },
      { id: 3, name: 'Butterfly Meadow', starReward: 8 },
      { id: 4, name: 'Hidden Waterfall', starReward: 9 },
      { id: 5, name: 'Blossom Summit', starReward: 12 },
    ],
  },
  {
    id: 'iron-fortress',
    name: 'Iron Fortress',
    avatarId: 'taro',
    description: 'A mighty stronghold on the mountain pass',
    emoji: '🏯',
    boards: [
      { id: 1, name: 'Outer Wall', starReward: 7 },
      { id: 2, name: 'Barracks', starReward: 8 },
      { id: 3, name: 'Great Hall', starReward: 10 },
      { id: 4, name: 'War Room', starReward: 11 },
      { id: 5, name: 'Throne Room', starReward: 14 },
    ],
  },
  {
    id: 'snow-peak',
    name: 'Snow Peak',
    avatarId: 'yuki',
    description: 'A frozen shrine beneath the northern lights',
    emoji: '❄️',
    boards: [
      { id: 1, name: 'Frozen Lake', starReward: 8 },
      { id: 2, name: 'Ice Cavern', starReward: 10 },
      { id: 3, name: 'Crystal Bridge', starReward: 11 },
      { id: 4, name: 'Aurora Terrace', starReward: 12 },
      { id: 5, name: 'Summit Shrine', starReward: 15 },
    ],
  },
  {
    id: 'fortune-harbor',
    name: 'Fortune Harbor',
    avatarId: 'hana',
    description: 'A festive port of lanterns and fireworks',
    emoji: '🏮',
    boards: [
      { id: 1, name: 'Market Street', starReward: 10 },
      { id: 2, name: 'Lantern Alley', starReward: 11 },
      { id: 3, name: 'Dragon Pier', starReward: 12 },
      { id: 4, name: 'Festival Square', starReward: 14 },
      { id: 5, name: 'Fireworks Tower', starReward: 18 },
    ],
  },
];

export const BOARDS_TO_UNLOCK = 3; // complete 3 boards in an area to unlock the next

export function getArea(id: string): Area {
  return AREAS.find(a => a.id === id) || AREAS[0];
}
