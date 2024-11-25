import React, { useEffect, useState } from 'react';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const NavLobbyAvatar = ({ userName }: { userName: string }) => {
  const [dataUri, setDataUri] = useState('');
  useEffect(() => {
    const avatar = createAvatar(avataaars, {
      seed: userName,
    });
    const data = avatar.toDataUri();
    setDataUri(data);
  }, []);

  return (
    <Avatar>
      <AvatarImage src={dataUri} className="bg-avatarBg" />
      <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
    </Avatar>
  );
};

export default NavLobbyAvatar;
