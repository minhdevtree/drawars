import { useGlobalState } from '@/components/provider/global-state-provider';
import { useSocket } from '@/components/provider/socket-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Copy, Lightbulb, Play, Siren } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const BottomNavMenu = ({ roomId }: { roomId: string }) => {
  const {
    setGameStarted,
    isAdmin,
    gameStarted,
    guessWord,
    presenter,
    displayHint,
    setDisplayHint,
    remainingHints,
    round,
    lobby,
  } = useGlobalState();

  const router = useRouter();
  const { toast } = useToast();
  const { socket } = useSocket();

  useEffect(() => {
    socket.on('StartGame', gameLink => {
      setGameStarted(true);
      router.push(gameLink);
    });
  }, []);

  const handleStartClick = () => {
    if (isAdmin === false || gameStarted === true) return;
    socket.emit('controlStartGame', roomId);
  };

  const handleUseHintClick = () => {
    if (
      !gameStarted ||
      !displayHint ||
      presenter ||
      typeof remainingHints !== 'number' ||
      remainingHints === 0
    )
      return;
    const data = {
      roomId: roomId,
      userWord: guessWord,
    };
    socket.emit('useHint', data);
  };

  const checkForMissingWord = async () => {
    let count = 0;
    Array.from(guessWord).forEach(elem => {
      console.log(elem);
      if (elem === '*') {
        count++;
      }
    });
    if (count > 0) setDisplayHint(true);
    else setDisplayHint(false);
  };

  const handleCopyRoomIdClick = () => {
    const link = process.env.NEXT_PUBLIC_CLIENT + '?room=' + roomId;
    navigator.clipboard.writeText(link);
    toast({
      title: 'Copied',
      description: 'Room Id copied to clipboard',
    });
  };

  useEffect(() => {
    checkForMissingWord();
  }, [guessWord]);

  return (
    <>
      <div className="flex gap-2 justify-center mb-2 px-2">
        {round && <Badge variant="neutral">Round : {round}</Badge>}
        <Badge
          className={cn(
            gameStarted &&
              !presenter &&
              displayHint &&
              typeof remainingHints === 'number' &&
              remainingHints > 0
              ? 'cursor-pointer'
              : 'cursor-not-allowed'
          )}
          variant={
            gameStarted &&
            !presenter &&
            displayHint &&
            typeof remainingHints === 'number' &&
            remainingHints > 0
              ? 'default'
              : 'neutral'
          }
          onClick={() => {
            if (
              gameStarted &&
              !presenter &&
              displayHint &&
              typeof remainingHints === 'number' &&
              remainingHints > 0
            ) {
              handleUseHintClick();
            }
          }}
        >
          <Lightbulb className="w-4 h-4 mr-1" />
          {remainingHints}
        </Badge>
        <Badge onClick={handleCopyRoomIdClick} className="cursor-pointer">
          Lobby: {roomId}
          <Copy className="w-4 h-4 ml-1" />
        </Badge>
      </div>

      <div className="p-2 flex gap-2 justify-between">
        <Button
          onClick={() => handleStartClick()}
          className="w-full font-bold text-xl"
          disabled={!(isAdmin && !gameStarted && lobby?.length > 1)}
        >
          Start Game
        </Button>
        <Button onClick={() => (window.location.href = '/')} variant="alert">
          Leave Room
        </Button>
      </div>
    </>
  );
};

export default BottomNavMenu;
