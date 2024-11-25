import React, { useRef, useEffect, useState } from 'react';
import randomstring from 'randomstring';
import { useGlobalState } from '../provider/global-state-provider';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSocket } from '../provider/socket-provider';
import { useSearchParams } from 'next/navigation';
import { z } from 'zod';

const UserDetail: React.FC = () => {
  const searchParams = useSearchParams();
  const { socket } = useSocket();
  const { toast } = useToast();
  const [roomId, setRoomId] = useState('');
  const [displayRoomId, setDisplayRoomId] = useState(false);
  const [inputUserNameIsDisabled, setInputUserNameIsDisabled] = useState(false);
  const { userName, setUserName, loading } = useGlobalState();

  const userNameBoxRef = useRef<HTMLInputElement>(null);
  const roomIdInputBoxRef = useRef<HTMLInputElement>(null);

  const userNameSchema = z
    .string()
    .min(1, 'Username cannot be empty')
    .max(10, 'Username cannot be more than 10 characters');

  const validateUserName = (name: string) => {
    try {
      userNameSchema.parse(name);
      return true;
    } catch (e) {
      toast({
        title: 'Error',
        description: (e as z.ZodError).errors[0].message,
      });
      return false;
    }
  };

  const handlePlayClick = async () => {
    if (!validateUserName(userName)) {
      userNameBoxRef.current?.focus();
      return;
    }

    try {
      const findGameApiUrl = `${process.env.NEXT_PUBLIC_SERVER}/api/findgame`;
      const response = await fetch(findGameApiUrl);
      const { room, msg } = await response.json();
      if (room) {
        socket.emit('socketConn', {
          roomId: room,
          userName,
        });
        toast({
          title: 'Success',
          description: `Room found successfully: ${room}`,
        });
      } else {
        toast({
          title: 'Error',
          description: msg,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Unable to connect to server',
      });
    }
  };

  const handleCreateRoom = () => {
    if (!validateUserName(userName)) {
      userNameBoxRef.current?.focus();
      return;
    }
    const randomRoomId = randomstring.generate(7);
    socket.emit('socketConn', {
      roomId: randomRoomId,
      userName,
    });
    toast({
      title: 'Success',
      description: `Successfully created room: ${randomRoomId}`,
    });
  };

  const handleJoinLobbyClick = async () => {
    if (!validateUserName(userName)) {
      userNameBoxRef.current?.focus();
      return;
    }
    if (!roomId) {
      setDisplayRoomId(true);
      roomIdInputBoxRef.current?.focus();
      toast({
        title: 'Info',
        description: 'Enter Room Id',
      });
      return;
    }

    try {
      const findSpecificGameApiUrl = `${process.env.NEXT_PUBLIC_SERVER}/api/findgame/${roomId}`;
      const response = await fetch(findSpecificGameApiUrl);
      const { room, msg } = await response.json();
      if (room) {
        socket.emit('socketConn', {
          roomId: room,
          userName,
        });
        toast({
          title: 'Success',
          description: `Room found successfully: ${room}`,
        });
      } else {
        toast({
          title: 'Error',
          description: msg,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Unable to connect to server',
      });
    }
  };

  useEffect(() => {
    const searchRoom = searchParams.get('room');
    setRoomId(searchRoom ?? '');
  }, [searchParams]);

  useEffect(() => {
    if (!loading) {
      setInputUserNameIsDisabled(false);
    }
  }, [loading]);

  return (
    <>
      <div>
        <Input
          type="text"
          placeholder="Username"
          className={displayRoomId ? 'hidden' : 'block'}
          value={userName}
          onChange={e => setUserName(e.target.value)}
          spellCheck="false"
          ref={userNameBoxRef}
          disabled={inputUserNameIsDisabled}
        />
      </div>
      {displayRoomId && (
        <div className="flex flex-row justify-center items-center gap-2">
          <Input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={e => setRoomId(e.target.value)}
            spellCheck="false"
            ref={roomIdInputBoxRef}
          />
          <Button onClick={() => setDisplayRoomId(false)}>
            <ArrowLeft />
          </Button>
        </div>
      )}
      <div className="w-full h-full flex gap-2 justify-between my-5">
        <Button
          onClick={handleCreateRoom}
          disabled={!!searchParams.get('room')}
        >
          Create Room
        </Button>
        <Button onClick={handlePlayClick} disabled={!!searchParams.get('room')}>
          Play As Guest
        </Button>
        <Button onClick={handleJoinLobbyClick}>Join Room</Button>
      </div>
    </>
  );
};

export default UserDetail;
