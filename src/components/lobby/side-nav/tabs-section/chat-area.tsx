import { useGlobalState } from '@/components/provider/global-state-provider';
import { useSocket } from '@/components/provider/socket-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

const ChatArea = ({ roomId }: { roomId: string }) => {
  const { socket } = useSocket();
  const { chat, chatBlock, userName } = useGlobalState();
  const [inputChat, setInputChat] = useState('');
  const endMessageRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleInputChat();
  };

  const handleInputChat = () => {
    if (inputChat === '' || chatBlock === true) {
      console.log('chatBlock', chatBlock);
      return;
    }
    const data = {
      roomId: roomId,
      userName: userName,
      chatMsg: inputChat,
    };
    socket.emit('sendMessage', data);
    setInputChat('');
  };

  useEffect(() => {
    if (endMessageRef.current) {
      endMessageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [chat]);

  return (
    <div className="h-[56vh]">
      <ScrollArea className="rounded-base h-[50vh] w-full text-text border-2 bg-main p-2 shadow-light dark:shadow-dark">
        <div className="w-full h-full bg-main rounded-base">
          <div
            className={`w-full ${
              !chatBlock ? 'h-[90%]' : 'h-full'
            } transition-all py-1 rounded-base`}
          >
            {chat.map((c, index) => {
              return (
                <div
                  key={index}
                  className={cn(
                    'text-xs text-black px-2 py-2 rounded-base my-1',
                    c?.type === 'correct'
                      ? 'bg-green-300'
                      : c?.type === 'nearlyCorrect'
                      ? 'bg-yellow-300'
                      : c?.type === 'blocked'
                      ? 'bg-red-300'
                      : c?.type === 'userJoin'
                      ? 'bg-blue-300'
                      : c?.type === 'userLeave'
                      ? 'bg-red-300'
                      : c?.type === 'adminRemoveUser'
                      ? 'bg-red-300'
                      : c?.type === 'disableUserChat'
                      ? 'bg-orange-300'
                      : c?.type === 'enableUserChat'
                      ? 'bg-lime-300'
                      : c?.type === 'adminChange'
                      ? 'bg-lime-300'
                      : c?.type === 'failToSelectWord'
                      ? 'bg-pink-300'
                      : c?.type === 'setPresenter'
                      ? 'bg-purple-300'
                      : c?.type === 'chooseWord'
                      ? 'bg-indigo-300'
                      : 'bg-bg'
                  )}
                >
                  <span className="font-semibold text-xs text-wrap">
                    {c.userName}:
                  </span>{' '}
                  {c.chatMsg}
                </div>
              );
            })}
            <div ref={endMessageRef} />
          </div>
        </div>
      </ScrollArea>
      {!chatBlock && (
        <div className="w-full flex items-center gap-1 h-[10vh]">
          <Input
            type="text"
            value={inputChat}
            onChange={e => setInputChat(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className="flex-grow"
          />
          <Button
            className="flex items-center justify-center"
            onClick={handleInputChat}
            variant="noShadow"
          >
            <ArrowRight />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
