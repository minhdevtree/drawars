import React, { useContext } from 'react';
import { useGlobalState } from '../provider/global-state-provider';
import UserProfileView from '../lobby/user-profile-view';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';

const Result = () => {
  const { lobby } = useGlobalState();

  return (
    <ScrollArea className="h-screen w-full bg-gray-200/20 backdrop-blur-md relative">
      <div className="flex flex-wrap gap-5 p-2">
        {lobby.map((element, index) => (
          <UserProfileView
            key={element.socketId}
            {...element}
            index={index}
            result={true}
          />
        ))}
        <Button
          variant="default"
          size="lg"
          className="z-[200] absolute bottom-5 right-5"
          onClick={() => (window.location.href = '/')}
        >
          Return to Home
        </Button>
      </div>
    </ScrollArea>
  );
};

export default Result;
