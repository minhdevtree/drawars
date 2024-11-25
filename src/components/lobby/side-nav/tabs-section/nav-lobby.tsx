import React from 'react';
import { useGlobalState } from '@/components/provider/global-state-provider';
import { useSocket } from '@/components/provider/socket-provider';
import {
  CircleMinus,
  MessageCircle,
  MessageCircleOff,
  PencilOff,
  SquarePen,
} from 'lucide-react';
import NavLobbyAvatar from './nav-lobby-avatar';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NavLobbyProps {
  roomId: string;
}

const NavLobby = (props: NavLobbyProps) => {
  const { socket } = useSocket();
  const { lobby, presenterDetails, isAdmin } = useGlobalState();

  const handleRemoveUser = (removedUserId: string) => {
    if (isAdmin === false) return;
    const removeUserData = {
      roomId: props.roomId,
      removedUserSocketId: removedUserId,
    };
    socket.emit('removeUser', removeUserData);
  };

  const handleChatBlockUser = (chatBlockUserId: string, isBlock: boolean) => {
    if (isAdmin === false) return;
    const chatBlockUserData = {
      roomId: props.roomId,
      chatBlockUserId: chatBlockUserId,
      isBlock: !isBlock,
    };
    socket.emit('chatBlockUser', chatBlockUserData);
  };

  // useEffect(() => {
  //   socket.on("lobby", (lobbyUsers) => {
  //     setLobby(lobbyUsers);
  //   });
  // }, []);

  const socketId = socket.id;
  return (
    <ScrollArea className="rounded-base h-[56vh] w-full text-text border-2 bg-main p-4 shadow-light dark:shadow-dark">
      <div className="w-full h-full bg-main">
        {lobby.map(user => {
          return (
            <Card
              key={user.socketId}
              className={`shadow-sm my-2 rounded ${
                user.thisRoundScore !== undefined &&
                user.thisRoundScore !== null &&
                user.thisRoundScore > 0 &&
                user.socketId !== presenterDetails
                  ? 'bg-[#bcff78]'
                  : 'bg-gray-200'
              } flex flex-row `}
            >
              <div className="flex gap-4 items-center p-2">
                <NavLobbyAvatar userName={user.userName} />
                <div className="flex flex-col justify-center">
                  <div className="flex items-center">
                    <p className="font-bold text-lg">{user.userName}</p>
                    {socketId === user.socketId && (
                      <span className="text-sm text-gray-500 ml-2">(you)</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-700">
                    Points: <span className="font-semibold">{user.score}</span>
                    {user.thisRoundScore !== undefined &&
                      user.thisRoundScore > 0 && (
                        <span className="font-semibold text-green-600 ml-1">
                          (+{user.thisRoundScore})
                        </span>
                      )}
                  </div>
                </div>
              </div>

              <div className="text-3xl text-red-400 flex-grow flex items-center justify-end p-2">
                {user.socketId === presenterDetails && (
                  <SquarePen className="text-main h-4 w-4 mr-2" />
                )}
                {isAdmin && !user.isAdmin && (
                  <div
                    className="cursor-pointer mr-1"
                    onClick={() =>
                      handleChatBlockUser(user.socketId, user.chatBlock)
                    }
                  >
                    {user.chatBlock ? (
                      <MessageCircleOff className="h4 w-4" />
                    ) : (
                      <MessageCircle className="h4 w-4" />
                    )}
                  </div>
                )}
                {isAdmin && !user.isAdmin && (
                  <div
                    className="cursor-pointer mx-1 hover:text-red-500 transition-all"
                    onClick={() => handleRemoveUser(user.socketId)}
                  >
                    <CircleMinus className="h4 w-4" />
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
};
export default NavLobby;
