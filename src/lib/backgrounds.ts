export interface Background {
  id: string;
  name: string;
  image?: string;
  gradient: string; // fallback or primary if no image
  unlockCost: number;
}

export const BACKGROUNDS: Background[] = [
  { id: 'bamboo', name: 'Dark Bamboo', image: '/bg.jpg', gradient: '#0a2010', unlockCost: 0 },
  { id: 'cherry', name: 'Cherry Blossom', gradient: 'linear-gradient(145deg, #2d1b3d 0%, #4a2040 50%, #1a0f25 100%)', unlockCost: 30 },
  { id: 'temple', name: 'Night Temple', gradient: 'linear-gradient(145deg, #0a1628 0%, #1a2d4d 50%, #0d1a30 100%)', unlockCost: 60 },
  { id: 'autumn', name: 'Golden Autumn', gradient: 'linear-gradient(145deg, #2d1a0a 0%, #4d2810 50%, #1a0f06 100%)', unlockCost: 90 },
  { id: 'ocean', name: 'Ocean Breeze', gradient: 'linear-gradient(145deg, #0a2828 0%, #104040 50%, #061a1a 100%)', unlockCost: 120 },
];

export function getBackground(id: string): Background {
  return BACKGROUNDS.find(b => b.id === id) || BACKGROUNDS[0];
}

export function getBgStyle(bg: Background): string {
  if (bg.image) return `${bg.gradient} url('${bg.image}') center / cover no-repeat`;
  return bg.gradient;
}
