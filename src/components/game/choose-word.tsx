import React, { useEffect, useState } from 'react';
import { useSocket } from '../provider/socket-provider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const ChooseWord = ({ roomId }: { roomId: string }) => {
  const { socket } = useSocket();
  const [words, setWords] = useState([]);

  const handleWordClick = (word: string) => {
    socket.emit('wordChoosed', { word: word, roomId: roomId });
    setWords([]);
  };

  useEffect(() => {
    socket.on('selectFromFourWords', ({ words }) => {
      setWords(words);
    });
  }, []);

  return (
    <ScrollArea className="w-full h-full bg-gray-200/20 backdrop-blur-md p-2">
      <Card className="w-full h-full flex flex-col items-center justify-center">
        <CardContent className="text-center">
          <h2 className="mb-4 text-gray-600 font-semibold">
            Choose a word ...
          </h2>
          <div className="flex justify-center gap-4">
            {words.map((word, index) => (
              <Button
                key={index}
                variant="default"
                size="lg"
                onClick={() => handleWordClick(word)}
              >
                {word}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default ChooseWord;
