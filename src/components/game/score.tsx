import React from 'react';
import { useGlobalState } from '../provider/global-state-provider';
import { ScrollArea } from '../ui/scroll-area';
import { Profile } from './profile';

const Score = ({ roomId }: { roomId: string }) => {
  const { lobby } = useGlobalState();

  return (
    <ScrollArea className="w-full h-screen bg-gray-200/20 backdrop-blur-md">
      <div className="flex flex-wrap gap-5 p-2">
        {lobby.map(element => (
          <Profile {...element} roomId={roomId} key={element.socketId} />
        ))}
      </div>
    </ScrollArea>
  );
};

export default Score;
