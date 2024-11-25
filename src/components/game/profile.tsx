import React, { useEffect, useState } from 'react';
import { useSocket } from '../provider/socket-provider';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';
import { cn } from '@/lib/utils';

interface ProfileProps {
  userName: string;
  socketId: string;
  isAdmin: boolean;
  score: number;
  thisRoundScore?: number;
}

export const Profile: React.FC<ProfileProps> = props => {
  const { socket } = useSocket();
  const socketId = socket.id;
  const [dataUri, setDataUri] = useState('');

  useEffect(() => {
    const avatar = createAvatar(avataaars, {
      seed: props.userName,
    });
    const data = avatar.toDataUri();
    setDataUri(data);
  }, [props.userName]);

  return (
    <div>
      <Card
        className={cn(
          'h-full w-full p-3 min-w-[200px]',
          props.socketId === socketId ? 'bg-button' : 'bg-main'
        )}
      >
        <CardContent className="p-2 rounded-md flex flex-col items-center justify-center bg-bg">
          <Avatar className="w-[60px] h-[60px] border border-1 border-solid border-black shadow-xl relative">
            <AvatarImage src={dataUri} alt={props.userName} />
            <AvatarFallback>{props.userName[0]}</AvatarFallback>

            {/* {props.isAdmin && (
              <div className="h-[1.5em] w-[1.5em] text-xs bg-yellow-600 flex justify-center items-center rounded-full absolute top-0 right-1/2">
                A
              </div>
            )} */}
          </Avatar>

          <h4 className="text-black mt-2">{props.userName}</h4>
          <h5 className="text-black font-semibold mt-1">{props.score}</h5>
          <div
            className={cn(
              'text-black text-sm font-semibold mt-1',
              props.thisRoundScore && +props.thisRoundScore !== 0
                ? 'text-green-600'
                : ''
            )}
          >
            (+ {props.thisRoundScore ? props.thisRoundScore : 0})
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
