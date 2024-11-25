import { useEffect, useState } from 'react';
import React from 'react';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';
import { useGlobalState } from '../provider/global-state-provider';
import { CircleFadingArrowUp, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useSocket } from '../provider/socket-provider';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface UserProfileProps {
  roomId: string;
  socketId: string;
  userName: string;
  isAdmin: boolean;
  result?: boolean;
  index?: number;
}

const UserProfileView = (props: UserProfileProps) => {
  const { socket } = useSocket();
  const socketId = socket.id;
  const [dataUri, setDataUri] = useState('');
  const { isAdmin } = useGlobalState();
  const handleRemoveClick = () => {
    if (isAdmin === false) return;
    const removeUserData = {
      roomId: props.roomId,
      removedUserSocketId: props.socketId,
    };
    socket.emit('removeUser', removeUserData);
  };

  const handleChangeAdminClick = () => {
    if (isAdmin === false) return;
    const newAdminUserData = {
      roomId: props.roomId,
      newAdminSocketId: props.socketId,
    };
    socket.emit('changeAdmin', newAdminUserData);
  };

  useEffect(() => {
    const avatar = createAvatar(avataaars, {
      seed: props.userName,
    });
    const data = avatar.toDataUri();
    setDataUri(data);
  }, []);

  return (
    <div>
      <Card
        className={cn(
          'h-full w-full p-3 min-w-[200px]',
          props.socketId === socketId ? 'bg-button' : 'bg-main'
        )}
      >
        <CardContent className="relative p-2 rounded-md flex flex-col items-center justify-center bg-bg">
          <Avatar className="border-solid border-primary w-[60px] h-[60px] relative">
            <AvatarImage
              src={dataUri}
              alt={props.userName}
              className="bg-avatarBg"
            />
            <AvatarFallback>{props.userName?.charAt(0) || 'A'}</AvatarFallback>

            {!props.result && !props.isAdmin && isAdmin && (
              <div
                className="h-[1.5em] w-[1.5em] text-xs bg-green-600 flex justify-center items-center rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 cursor-pointer hover:shadow-md hover:h-[1.75em] hover:w-[1.75em] transition-all"
                onClick={handleChangeAdminClick}
              >
                <CircleFadingArrowUp />
              </div>
            )}
            {!props.result && !props.isAdmin && isAdmin && (
              <div
                className="h-[1.5em] w-[1.5em] text-xs bg-red-600 flex justify-center items-center rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2 cursor-pointer hover:shadow-md hover:h-[1.75em] hover:w-[1.75em] transition-all"
                onClick={handleRemoveClick}
              >
                <X />
              </div>
            )}
            {/* {props.isAdmin && (
              <div className="h-[1.5em] w-[1.5em] text-xs bg-yellow-600 flex justify-center items-center rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 transition-all">
                A
              </div>
            )} */}
          </Avatar>

          {props.result && (
            <Badge className="absolute top-1 left-1">
              {(props.index ?? 0) + 1}
            </Badge>
          )}

          <div className="text-center mt-2">
            {props.userName}{' '}
            <p className="text-button inline-block">
              ({props.isAdmin ? 'host' : 'player'})
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileView;
