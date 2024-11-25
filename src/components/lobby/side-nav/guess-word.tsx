import { useGlobalState } from '@/components/provider/global-state-provider';
import { useSocket } from '@/components/provider/socket-provider';
import React, { useEffect } from 'react';

const GuessWord: React.FC = () => {
  const { socket } = useSocket();
  const { guessWord, setGuessWord } = useGlobalState();

  useEffect(() => {
    const handleGuessWord = (data: string | null) => {
      if (data === null || data === undefined) setGuessWord('');
      else setGuessWord(data);
    };

    socket.on('guessWord', handleGuessWord);

    return () => {
      socket.off('guessWord', handleGuessWord);
    };
  }, [setGuessWord]);

  return (
    <div className="w-full h-full flex justify-center items-center overflow-y-auto">
      {Array.from(guessWord).map((letter: string, index: number) => (
        <div
          key={index}
          className={`h-[30%] w-[5%] mr-1 box-border ${
            letter === '*' ? 'border-b-2 border-black' : ''
          } ${letter !== '*' && letter !== ' ' ? 'text-black' : ''}`}
        >
          {letter !== '*' && letter !== ' ' && (
            <div className="w-full h-full flex justify-center items-center font-semibold">
              {letter}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GuessWord;
