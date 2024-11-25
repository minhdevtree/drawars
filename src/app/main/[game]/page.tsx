'use client';
import GameArea from '@/components/game/game-area';
import { GameStateProvider } from '@/components/provider/game-state-provider';
import React from 'react';

const MainGamePage = ({ params }: { params: { game: string } }) => {
  return (
    <>
      <GameStateProvider>
        <GameArea roomId={params.game} />
      </GameStateProvider>
    </>
  );
};

export default MainGamePage;
