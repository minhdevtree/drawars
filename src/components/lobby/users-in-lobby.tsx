import React, { useEffect } from 'react';
import { useGlobalState } from '../provider/global-state-provider';
import UserProfileView from './user-profile-view';
import { useRouter } from 'next/navigation';
import { useSocket } from '../provider/socket-provider';

const UsersInLobby = ({ roomId }: { roomId: string }) => {
  const router = useRouter();
  const { socket } = useSocket();
  const { lobby } = useGlobalState();
  useEffect(() => {
    //checking for socket connection established or not
    if (!socket.connected) {
      socket.disconnect();
      socket.removeAllListeners();
      // Redirecting user to home page
      router.push('/');
    }
  }, []);

  return (
    <>
      <div className="flex flex-wrap gap-5 p-2">
        {lobby.map(element => {
          return (
            <UserProfileView
              {...element}
              roomId={roomId}
              result={false}
              key={element.socketId}
            />
          );
        })}
      </div>
    </>
  );
};

export default UsersInLobby;
