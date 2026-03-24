export interface MusicTrack {
  id: string;
  name: string;
  description: string;
  duration: string;
  unlockCost: number;
}

export const MUSIC_TRACKS: MusicTrack[] = [
  { id: 'silent', name: 'Silent', description: 'No music', duration: '—', unlockCost: 0 },
  { id: 'peaceful', name: 'Peaceful Garden', description: 'Calm ambient', duration: '3:20', unlockCost: 0 },
  { id: 'bamboo-wind', name: 'Bamboo Wind', description: 'Lo-fi with nature sounds', duration: '4:10', unlockCost: 40 },
  { id: 'temple-bells', name: 'Temple Bells', description: 'Meditative, slow', duration: '3:45', unlockCost: 70 },
  { id: 'festival', name: 'Festival Night', description: 'Upbeat, energetic', duration: '2:55', unlockCost: 100 },
];

export function getMusicTrack(id: string): MusicTrack {
  return MUSIC_TRACKS.find(t => t.id === id) || MUSIC_TRACKS[0];
}
