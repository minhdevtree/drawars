import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Music } from 'lucide-react';

export default function ButtonPlayMusic({ className }: { className?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/audio/background-music.mp3');
    }
    const audio = audioRef.current;
    audio.loop = true; // Loop the audio

    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }

    return () => {
      audio.pause(); // Clean up by pausing when component unmounts
    };
  }, [isPlaying]);
  return (
    <div className={cn(className)}>
      <Button onClick={togglePlay}>
        <Music className="h-5 w-5 mr-1" />
        {isPlaying ? 'Pause Music' : 'Play Music'}
      </Button>
    </div>
  );
}
