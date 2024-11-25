'use client';
import SideNav from '@/components/lobby/side-nav/side-nav';
import UsersInLobby from '@/components/lobby/users-in-lobby';
import ButtonPlayMusic from '@/components/shared/button-play-music';
import React from 'react';

export default function Lobby({ params }: { params: { lobbyId: string } }) {
  return (
    <div className="h-screen w-screen overflow-x-hidden relative">
      <ButtonPlayMusic className="absolute bottom-4 left-4 z-20" />
      <div className="w-full md:h-screen grid grid-cols-1 md:grid-cols-5 xl:grid-cols-12 gap-2">
        <div className="col-span-1 md:col-span-3 xl:col-span-9">
          <UsersInLobby roomId={params.lobbyId} />
        </div>
        <div className="col-span-1 md:col-span-2 xl:col-span-3">
          <SideNav roomId={params.lobbyId} />
        </div>
      </div>
    </div>
  );
}
