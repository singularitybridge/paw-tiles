'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { GameStoreProvider } from '@/lib/gameStore';
import MainMenu from '@/components/MainMenu';
import type { Screen } from '@/components/MainMenu';
import DesignerHub from '@/components/DesignerHub';
import AvatarGallery from '@/components/AvatarGallery';
import AvatarSkills from '@/components/AvatarSkills';
import TilesGallery from '@/components/TilesGallery';
import BackgroundsGallery from '@/components/BackgroundsGallery';
import MusicScreen from '@/components/MusicScreen';
import SettingsScreen from '@/components/SettingsScreen';

const MahjongGame = dynamic(() => import('@/components/MahjongGame'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#0d3018',
        color: '#fcd34d',
        fontSize: '1.2rem',
        fontFamily: 'system-ui',
      }}
    >
      Loading...
    </div>
  ),
});

function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [skillAvatarId, setSkillAvatarId] = useState<string>('mochi');

  const viewSkills = (avatarId: string) => {
    setSkillAvatarId(avatarId);
    setScreen('avatar-skills' as Screen);
  };

  switch (screen) {
    case 'menu':
      return <MainMenu onNavigate={setScreen} />;

    case 'playing':
      return <MahjongGame onBack={() => setScreen('menu')} />;

    case 'avatar':
      return <AvatarGallery onBack={() => setScreen('menu')} onViewSkills={viewSkills} />;

    case 'avatar-skills' as Screen:
      return <AvatarSkills avatarId={skillAvatarId} onBack={() => setScreen('avatar')} />;

    case 'designer':
      return <DesignerHub onNavigate={setScreen} />;

    case 'designer-tiles':
      return <TilesGallery onBack={() => setScreen('designer')} />;

    case 'designer-backgrounds':
      return <BackgroundsGallery onBack={() => setScreen('designer')} />;

    case 'designer-music':
      return <MusicScreen onBack={() => setScreen('designer')} />;

    case 'settings':
      return <SettingsScreen onBack={() => setScreen('menu')} />;

    default:
      return <MainMenu onNavigate={setScreen} />;
  }
}

export default function Home() {
  return (
    <GameStoreProvider>
      <App />
    </GameStoreProvider>
  );
}
