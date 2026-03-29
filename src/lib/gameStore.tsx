'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AVATARS, Avatar, getAvatar } from './avatars';
import { BACKGROUNDS, getBackground, Background, getBgStyle } from './backgrounds';
import { MUSIC_TRACKS, getMusicTrack, MusicTrack } from './music';
import { AREAS, BOARDS_TO_UNLOCK } from './worldMap';

interface GameStoreState {
  selectedAvatarId: string;
  unlockedAvatarIds: string[];
  skillLevels: Record<string, number>; // avatarId -> level (1-3)
  selectedBackgroundId: string;
  unlockedBackgroundIds: string[];
  selectedMusicId: string;
  unlockedMusicIds: string[];
  stars: number;
  hapticsEnabled: boolean;
  // World map progression
  unlockedAreaIds: string[];
  completedBoards: Record<string, number[]>; // areaId -> [boardIds completed]
  currentAreaId: string;
}

interface GameStoreCtx extends GameStoreState {
  selectedAvatar: Avatar;
  selectedBackground: Background;
  selectedMusic: MusicTrack;
  bgStyle: string;
  getSkillLevel: (avatarId: string) => number;
  selectAvatar: (id: string) => void;
  unlockAvatar: (id: string) => boolean;
  upgradeSkill: (avatarId: string) => boolean;
  selectBackground: (id: string) => void;
  unlockBackground: (id: string) => boolean;
  selectMusic: (id: string) => void;
  unlockMusic: (id: string) => boolean;
  addStars: (amount: number) => void;
  toggleHaptics: () => void;
  vibrate: (pattern: number | number[]) => void;
  resetProgress: () => void;
  // World map
  completeBoard: (areaId: string, boardId: number) => void;
  isBoardCompleted: (areaId: string, boardId: number) => boolean;
  isAreaUnlocked: (areaId: string) => boolean;
  getAreaCompletedCount: (areaId: string) => number;
  setCurrentArea: (areaId: string) => void;
}

const STORAGE_KEY = 'vita-mahjong-store';

const DEFAULT_STATE: GameStoreState = {
  selectedAvatarId: 'taro',
  unlockedAvatarIds: ['taro'],
  skillLevels: { taro: 1 },
  selectedBackgroundId: 'bamboo',
  unlockedBackgroundIds: ['bamboo'],
  selectedMusicId: 'silent',
  unlockedMusicIds: ['silent', 'peaceful'],
  stars: 0,
  hapticsEnabled: true,
  unlockedAreaIds: ['kyoto-temple'],
  completedBoards: {},
  currentAreaId: 'kyoto-temple',
};

function loadState(): GameStoreState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULT_STATE;
}

function saveState(state: GameStoreState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

const Ctx = createContext<GameStoreCtx | null>(null);

export function GameStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameStoreState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setState(loadState()); setLoaded(true); }, []);
  useEffect(() => { if (loaded) saveState(state); }, [state, loaded]);

  const selectedAvatar = getAvatar(state.selectedAvatarId);
  const selectedBackground = getBackground(state.selectedBackgroundId);
  const selectedMusic = getMusicTrack(state.selectedMusicId);
  // Use the avatar's own background if available, otherwise fall back to selected background
  const bgStyle = selectedAvatar.background
    ? `#0a2010 url('${selectedAvatar.background}') center / cover no-repeat`
    : getBgStyle(selectedBackground);

  const getSkillLevel = useCallback((avatarId: string) => {
    return state.skillLevels[avatarId] || 1;
  }, [state.skillLevels]);

  const selectAvatar = useCallback((id: string) => {
    setState(s => {
      if (!s.unlockedAvatarIds.includes(id)) return s;
      return { ...s, selectedAvatarId: id };
    });
  }, []);

  const unlockAvatar = useCallback((id: string): boolean => {
    const avatar = AVATARS.find(a => a.id === id);
    if (!avatar) return false;
    let success = false;
    setState(s => {
      if (s.unlockedAvatarIds.includes(id)) return s;
      if (s.stars < avatar.unlockCost) return s;
      success = true;
      return {
        ...s,
        stars: s.stars - avatar.unlockCost,
        unlockedAvatarIds: [...s.unlockedAvatarIds, id],
        skillLevels: { ...s.skillLevels, [id]: 1 },
      };
    });
    return success;
  }, []);

  const upgradeSkill = useCallback((avatarId: string): boolean => {
    const avatar = AVATARS.find(a => a.id === avatarId);
    if (!avatar) return false;
    let success = false;
    setState(s => {
      const currentLevel = s.skillLevels[avatarId] || 1;
      const nextLevel = avatar.skillLevels.find(sl => sl.level === currentLevel + 1);
      if (!nextLevel) return s; // already max
      if (s.stars < nextLevel.upgradeCost) return s;
      success = true;
      return {
        ...s,
        stars: s.stars - nextLevel.upgradeCost,
        skillLevels: { ...s.skillLevels, [avatarId]: nextLevel.level },
      };
    });
    return success;
  }, []);

  const selectBackground = useCallback((id: string) => {
    setState(s => {
      if (!s.unlockedBackgroundIds.includes(id)) return s;
      return { ...s, selectedBackgroundId: id };
    });
  }, []);

  const unlockBackground = useCallback((id: string): boolean => {
    const bg = BACKGROUNDS.find(b => b.id === id);
    if (!bg) return false;
    let success = false;
    setState(s => {
      if (s.unlockedBackgroundIds.includes(id)) return s;
      if (s.stars < bg.unlockCost) return s;
      success = true;
      return {
        ...s,
        stars: s.stars - bg.unlockCost,
        unlockedBackgroundIds: [...s.unlockedBackgroundIds, id],
      };
    });
    return success;
  }, []);

  const selectMusic = useCallback((id: string) => {
    setState(s => {
      if (!s.unlockedMusicIds.includes(id)) return s;
      return { ...s, selectedMusicId: id };
    });
  }, []);

  const unlockMusic = useCallback((id: string): boolean => {
    const track = MUSIC_TRACKS.find(t => t.id === id);
    if (!track) return false;
    let success = false;
    setState(s => {
      if (s.unlockedMusicIds.includes(id)) return s;
      if (s.stars < track.unlockCost) return s;
      success = true;
      return {
        ...s,
        stars: s.stars - track.unlockCost,
        unlockedMusicIds: [...s.unlockedMusicIds, id],
      };
    });
    return success;
  }, []);

  const addStars = useCallback((amount: number) => {
    setState(s => ({ ...s, stars: s.stars + amount }));
  }, []);

  const toggleHaptics = useCallback(() => {
    setState(s => ({ ...s, hapticsEnabled: !s.hapticsEnabled }));
  }, []);

  const vibrate = useCallback((pattern: number | number[]) => {
    if (state.hapticsEnabled && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, [state.hapticsEnabled]);

  const resetProgress = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  const completeBoard = useCallback((areaId: string, boardId: number) => {
    setState(s => {
      const prev = s.completedBoards[areaId] || [];
      if (prev.includes(boardId)) return s; // already completed
      const area = AREAS.find(a => a.id === areaId);
      const board = area?.boards.find(b => b.id === boardId);
      const updated = [...prev, boardId];
      const newCompleted = { ...s.completedBoards, [areaId]: updated };

      // Check if this unlock the next area
      let newUnlocked = s.unlockedAreaIds;
      if (updated.length >= BOARDS_TO_UNLOCK) {
        const areaIndex = AREAS.findIndex(a => a.id === areaId);
        const nextArea = AREAS[areaIndex + 1];
        if (nextArea && !s.unlockedAreaIds.includes(nextArea.id)) {
          newUnlocked = [...s.unlockedAreaIds, nextArea.id];
        }
      }

      return {
        ...s,
        completedBoards: newCompleted,
        unlockedAreaIds: newUnlocked,
        stars: s.stars + (board?.starReward || 0),
      };
    });
  }, []);

  const isBoardCompleted = useCallback((areaId: string, boardId: number) => {
    return (state.completedBoards[areaId] || []).includes(boardId);
  }, [state.completedBoards]);

  const isAreaUnlocked = useCallback((areaId: string) => {
    return state.unlockedAreaIds.includes(areaId);
  }, [state.unlockedAreaIds]);

  const getAreaCompletedCount = useCallback((areaId: string) => {
    return (state.completedBoards[areaId] || []).length;
  }, [state.completedBoards]);

  const setCurrentArea = useCallback((areaId: string) => {
    setState(s => ({ ...s, currentAreaId: areaId }));
  }, []);

  return (
    <Ctx.Provider value={{
      ...state, selectedAvatar, selectedBackground, selectedMusic, bgStyle,
      getSkillLevel, selectAvatar, unlockAvatar, upgradeSkill,
      selectBackground, unlockBackground, selectMusic, unlockMusic, addStars,
      toggleHaptics, vibrate, resetProgress,
      completeBoard, isBoardCompleted, isAreaUnlocked, getAreaCompletedCount, setCurrentArea,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useGameStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useGameStore must be used within GameStoreProvider');
  return ctx;
}
