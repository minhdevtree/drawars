import { useSocket } from '@/components/provider/socket-provider';
import React, { useState, useEffect } from 'react';

const Time: React.FC = () => {
  const { socket } = useSocket();
  const [time, setTime] = useState<number | null>(null);
  const [dangerText, setDangerText] = useState<boolean>(false);

  const reduceTime = () => {
    setTime(prevTime => {
      if (prevTime === null) return null;
      else if (prevTime === 0) return prevTime;
      else return prevTime - 1;
    });
  };

  useEffect(() => {
    socket.on('setTime', (time: number) => {
      setTime(time);
    });

    return () => {
      socket.off('setTime');
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      reduceTime();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (time !== null) {
      if (time <= 10 && time % 2 !== 0) setDangerText(true);
      if (time <= 10 && time % 2 === 0) setDangerText(false);
      if (time > 10) setDangerText(false);
    }
  }, [time]);

  if (time === null) {
    return <></>;
  }

  return (
    <div
      className={`h-full w-full text-5xl flex justify-center items-center ${
        dangerText ? 'text-red-700' : 'text-main'
      } font-semibold`}
    >
      {time}
    </div>
  );
};

export default Time;
