// ============================================================
// Avatar definitions — cat characters for Vita Mahjong
// AI-generated character illustrations in public/avatars/
// ============================================================

export interface SkillLevel {
  level: number;
  description: string;
  upgradeCost: number; // 0 for level 1 (base)
}

export interface Avatar {
  id: string;
  name: string;
  image: string;
  background: string; // per-avatar game background image
  skill: string;
  skillId: string; // programmatic identifier
  skillLevels: SkillLevel[];
  unlockCost: number; // stars
}

export const AVATARS: Avatar[] = [
  {
    id: 'mochi',
    name: 'Mochi',
    image: '/avatars/mochi.jpg',
    background: '/backgrounds/mochi.jpg',
    skill: 'Zen Focus',
    skillId: 'zen-focus',
    skillLevels: [
      { level: 1, description: 'Start with 1 free hint', upgradeCost: 0 },
      { level: 2, description: 'Start with 2 free hints', upgradeCost: 25 },
      { level: 3, description: 'Start with 3 free hints', upgradeCost: 50 },
    ],
    unlockCost: 0,
  },
  {
    id: 'kuro',
    name: 'Kuro',
    image: '/avatars/kuro.jpg',
    background: '/backgrounds/kuro.jpg',
    skill: 'Shadow Sight',
    skillId: 'shadow-sight',
    skillLevels: [
      { level: 1, description: 'Briefly reveals a matching pair at start', upgradeCost: 0 },
      { level: 2, description: 'Reveals 2 matching pairs at start', upgradeCost: 30 },
      { level: 3, description: 'Reveals 3 matching pairs at start', upgradeCost: 60 },
    ],
    unlockCost: 50,
  },
  {
    id: 'sakura',
    name: 'Sakura',
    image: '/avatars/sakura.jpg',
    background: '/backgrounds/sakura.jpg',
    skill: 'Lucky Paw',
    skillId: 'lucky-paw',
    skillLevels: [
      { level: 1, description: 'Undo available once after game over', upgradeCost: 0 },
      { level: 2, description: 'Undo available twice after game over', upgradeCost: 30 },
      { level: 3, description: 'Undo available three times after game over', upgradeCost: 60 },
    ],
    unlockCost: 75,
  },
  {
    id: 'taro',
    name: 'Taro',
    image: '/avatars/taro.jpg',
    background: '/backgrounds/taro.jpg',
    skill: 'Iron Will',
    skillId: 'iron-will',
    skillLevels: [
      { level: 1, description: 'Matched pairs clear faster', upgradeCost: 0 },
      { level: 2, description: 'Matched pairs clear instantly', upgradeCost: 35 },
      { level: 3, description: 'Instant clear + bonus 25 points per match', upgradeCost: 70 },
    ],
    unlockCost: 100,
  },
  {
    id: 'yuki',
    name: 'Yuki',
    image: '/avatars/yuki.jpg',
    background: '/backgrounds/yuki.jpg',
    skill: 'Wisdom',
    skillId: 'wisdom',
    skillLevels: [
      { level: 1, description: 'Shuffle costs no points', upgradeCost: 0 },
      { level: 2, description: 'Shuffle costs no points + shows a hint', upgradeCost: 30 },
      { level: 3, description: 'Shuffle costs no points + 2 hints revealed', upgradeCost: 60 },
    ],
    unlockCost: 125,
  },
  {
    id: 'hana',
    name: 'Hana',
    image: '/avatars/hana.jpg',
    background: '/backgrounds/hana.jpg',
    skill: 'Fortune',
    skillId: 'fortune',
    skillLevels: [
      { level: 1, description: '1.25x score multiplier', upgradeCost: 0 },
      { level: 2, description: '1.5x score multiplier', upgradeCost: 35 },
      { level: 3, description: '2x score multiplier', upgradeCost: 70 },
    ],
    unlockCost: 150,
  },
];

export function getAvatar(id: string): Avatar {
  return AVATARS.find(a => a.id === id) || AVATARS[0];
}

// Get the active skill level description for an avatar
export function getSkillDescription(avatar: Avatar, level: number): string {
  const sl = avatar.skillLevels.find(s => s.level === level);
  return sl?.description || avatar.skillLevels[0].description;
}
