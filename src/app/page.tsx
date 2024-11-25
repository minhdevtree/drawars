'use client';
import AvatarPicture from '@/components/shared/avatar-picture';
import ButtonPlayMusic from '@/components/shared/button-play-music';
import UserDetail from '@/components/shared/user-detail';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Music } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const colorsArray = [
  'bg-yellow-500',
  'bg-orange-500',
  'bg-violet-600',
  'bg-gray-500',
  'bg-cyan-500',
  'bg-amber-500',
  'bg-red-500',
  'bg-purple-500',
  'bg-indigo-500',
];

const beforeColorsArray = [
  'before:bg-green-500',
  'before:bg-blue-800',
  'before:bg-pink-400',
  'before:bg-lime-500',
  'before:bg-teal-800',
  'before:bg-rose-600',
  'before:bg-yellow-700',
  'before:bg-orange-700',
  'before:bg-violet-700',
];

const HomePage = () => {
  const [bgColor, setBgColor] = useState(0);
  const [bg2Color, setBg2Color] = useState(0);
  const [slideBar, setSlideBar] = useState(false);

  const changeColor1 = () => {
    setBgColor(prevBgColor => (prevBgColor + 1) % colorsArray.length);
  };

  const changeColor2 = () => {
    setBg2Color(prevBgColor => (prevBgColor + 1) % beforeColorsArray.length);
  };

  const setNextColor = () => {
    setSlideBar(prevSlideBar => {
      if (prevSlideBar === false) {
        setTimeout(changeColor1, 1500);
      } else {
        setTimeout(changeColor2, 1500);
      }
      return !prevSlideBar;
    });
  };

  useEffect(() => {
    const fourSecondTimeInterval = setInterval(setNextColor, 4000);

    return () => {
      clearInterval(fourSecondTimeInterval);
    };
  }, []);
  return (
    <div
      className={`relative h-screen w-screen ${
        colorsArray[bgColor]
      } transition-all before:content-[''] before:h-full ${
        slideBar ? 'before:w-full' : 'before:w-0'
      } before:absolute before:top-0 before:left-0 ${
        beforeColorsArray[bg2Color]
      } before:transition-all before:duration-500 before:z-10`}
    >
      <div className="h-full w-full flex justify-center items-center">
        <Card className="md:w-[700px] w-full z-20">
          <CardHeader className="text-center">
            <h1>
              Welcome to{' '}
              <span className="text-bg">{process.env.FRONTEND_SITE_NAME}</span>
            </h1>
            <h5 className="font-thin">
              A place to draw and have fun with your friends
            </h5>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 justify-center items-center w-full">
              <AvatarPicture />
              <UserDetail />
            </div>
          </CardContent>
        </Card>
      </div>
      <ButtonPlayMusic className="absolute top-4 right-4 z-20" />
    </div>
  );
};

export default HomePage;
