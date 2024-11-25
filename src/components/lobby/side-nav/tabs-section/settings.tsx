import React, { useEffect } from 'react';
import { useGlobalState } from '@/components/provider/global-state-provider';
import { useSocket } from '@/components/provider/socket-provider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const Settings = ({ roomId }: { roomId: string }) => {
  const { socket } = useSocket();
  const { gameSettings, setGameSettings, isAdmin, gameStarted, lobby } =
    useGlobalState();

  useEffect(() => {
    if (!roomId) return;
    socket.emit('requestLobbySettings', roomId);
  }, [roomId]);

  useEffect(() => {
    if (
      isAdmin === true &&
      gameStarted === false &&
      gameSettings?.players &&
      roomId
    ) {
      const data = {
        roomId: roomId,
        gameSettings: gameSettings,
      };
      socket.emit('changeLobbySettings', data);
    }
  }, [gameSettings, isAdmin, gameStarted, roomId]);

  return (
    <ScrollArea className="rounded-lg h-[56vh] w-full text-text border-2 bg-main p-4 shadow-light dark:shadow-dark">
      <div className="space-y-4">
        <SettingItem
          label="Players"
          value={gameSettings.players}
          isAdmin={isAdmin}
          gameStarted={gameStarted}
          onIncrement={() =>
            setGameSettings(prevSettings => {
              if (prevSettings.players === 12) return prevSettings;
              return { ...prevSettings, players: prevSettings.players + 1 };
            })
          }
          onDecrement={() =>
            setGameSettings(prevSettings => {
              if (lobby.length >= prevSettings.players) return prevSettings;
              if (prevSettings.players === 2) return prevSettings;
              return { ...prevSettings, players: prevSettings.players - 1 };
            })
          }
        />
        <Separator />
        <SettingItem
          label="Rounds"
          value={gameSettings.rounds}
          isAdmin={isAdmin}
          gameStarted={gameStarted}
          onIncrement={() =>
            setGameSettings(prevSettings => {
              if (prevSettings.rounds === 10) return prevSettings;
              return { ...prevSettings, rounds: prevSettings.rounds + 1 };
            })
          }
          onDecrement={() =>
            setGameSettings(prevSettings => {
              if (prevSettings.rounds === 1) return prevSettings;
              return { ...prevSettings, rounds: prevSettings.rounds - 1 };
            })
          }
        />
        <Separator />
        <SettingItem
          label="Drawing Duration"
          value={`${gameSettings.duration}s`}
          isAdmin={isAdmin}
          gameStarted={gameStarted}
          onIncrement={() =>
            setGameSettings(prevSettings => {
              if (prevSettings.duration === 180) return prevSettings;
              return {
                ...prevSettings,
                duration: prevSettings.duration + 5,
              };
            })
          }
          onDecrement={() =>
            setGameSettings(prevSettings => {
              if (prevSettings.duration === 30) return prevSettings;
              return {
                ...prevSettings,
                duration: prevSettings.duration - 5,
              };
            })
          }
        />
        <Separator />
        <SettingItem
          label="Hints"
          value={gameSettings.hints}
          isAdmin={isAdmin}
          gameStarted={gameStarted}
          onIncrement={() =>
            setGameSettings(prevSettings => {
              if (prevSettings.hints === 50) return prevSettings;
              return { ...prevSettings, hints: prevSettings.hints + 1 };
            })
          }
          onDecrement={() =>
            setGameSettings(prevSettings => {
              if (prevSettings.hints === 0) return prevSettings;
              return { ...prevSettings, hints: prevSettings.hints - 1 };
            })
          }
        />
        <Separator />
        <div className="flex flex-row justify-between items-center">
          <div className="font-bold">Room Visibility</div>
          <div className="flex items-center pr-1">
            {isAdmin && !gameStarted ? (
              <Select
                onValueChange={value =>
                  setGameSettings(prevSettings => ({
                    ...prevSettings,
                    visibility: value,
                  }))
                }
                value={gameSettings.visibility}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Private">Private</SelectItem>
                  <SelectItem value="Public">Public</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="mx-4 text-sm font-light">
                {gameSettings.visibility}
              </div>
            )}
          </div>
        </div>
      </div>
      <Separator className="my-5" />
      <div className="font-bold mb-2">
        {isAdmin && !gameStarted ? 'Select topics for the game' : 'Topics'}{' '}
      </div>
      <div className="flex flex-wrap gap-2 pb-2">
        {[
          {
            name: 'General (Enghlish)',
            value: 'generalEN',
          },
          {
            name: 'Animal (English)',
            value: 'animalEN',
          },
          {
            name: 'Minecraft (English)',
            value: 'minecraftEN',
          },
          {
            name: 'General (Vietnamese)',
            value: 'generalVI',
          },
          {
            name: 'Animal (Vietnamese)',
            value: 'animalVI',
          },
          {
            name: 'Minecraft (Vietnamese)',
            value: 'minecraftVI',
          },
        ].map(topic => {
          return (
            <Button
              key={topic.value}
              variant={
                gameSettings?.topics &&
                gameSettings.topics.includes(topic.value)
                  ? 'default'
                  : 'neutral'
              }
              onClick={() => {
                setGameSettings(prevSettings => {
                  if (prevSettings.topics.includes(topic.value)) {
                    return {
                      ...prevSettings,
                      topics: prevSettings.topics.filter(
                        (t: string) => t !== topic.value
                      ),
                    };
                  }
                  return {
                    ...prevSettings,
                    topics: [...prevSettings.topics, topic.value],
                  };
                });
              }}
              disabled={!(isAdmin && !gameStarted)}
              className={cn(
                (!isAdmin || gameStarted) &&
                  gameSettings?.topics &&
                  !gameSettings.topics.includes(topic.value) &&
                  'hidden'
              )}
            >
              {topic.name}
            </Button>
          );
        })}
      </div>
    </ScrollArea>
  );
};

const SettingItem = ({
  label,
  value,
  isAdmin,
  gameStarted,
  onIncrement,
  onDecrement,
}: {
  label: string;
  value: string | number;
  isAdmin: boolean;
  gameStarted: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
}) => (
  <div className="flex flex-row justify-between items-center p-3 bg-main rounded-md shadow-sm dark:bg-gray-700">
    <div className="font-bold text-gray-800 dark:text-gray-200">{label}</div>
    <div className="flex items-center space-x-4">
      <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        {value}
      </div>
      {isAdmin && !gameStarted && (
        <div className="flex flex-col space-y-1">
          <Button variant="default" size="icon" onClick={onIncrement}>
            +
          </Button>
          <Button variant="default" size="icon" onClick={onDecrement}>
            -
          </Button>
        </div>
      )}
    </div>
  </div>
);

export default Settings;
