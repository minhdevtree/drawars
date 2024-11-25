import React, { useEffect, useState } from 'react';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';
import {
  Avatar as RadixAvatar,
  AvatarImage,
  AvatarFallback,
  Avatar,
} from '@/components/ui/avatar';
import { useGlobalState } from '../provider/global-state-provider';
import { cn } from '@/lib/utils';

type AvatarPictureProps = {
  className?: string;
};

export default function AvatarPicture({ className }: AvatarPictureProps) {
  const { userName, isAdmin } = useGlobalState();
  const [dataUri, setDataUri] = useState<string>('');

  useEffect(() => {
    if (userName) {
      const avatar = createAvatar(avataaars, {
        seed: userName,
      });
      const data = avatar.toDataUri();
      setDataUri(data);
    }
  }, [userName]);

  return (
    <>
      <Avatar
        className={cn(
          'border-solid border-primary w-[100px] h-[100px]',
          className
        )}
      >
        <AvatarImage src={dataUri} alt={userName} className="bg-avatarBg" />
        <AvatarFallback>{userName?.charAt(0) || 'A'}</AvatarFallback>
      </Avatar>
    </>
  );
}
