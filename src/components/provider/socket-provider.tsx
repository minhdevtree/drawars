import React, { createContext, useContext, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { useGlobalState } from './global-state-provider';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { joinLobbyAudio } from '@/lib/audio';
import { ToastAction } from '../ui/toast';

const server = process.env.NEXT_PUBLIC_SERVER;

const connectionOptions = {
  'force new connection': true,
  reconnectionAttempts: Infinity,
  timeout: 10000,
  transports: ['websocket'],
};

const socket = io(server!, connectionOptions);

interface SocketContextType {
  socket: Socket;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const {
    setAdmin,
    setLobby,
    setRemainingHints,
    setRound,
    setLoading,
    setChat,
    setGameSettings,
  } = useGlobalState();
  useEffect(() => {
    // Handle socket connection and events if needed
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('statusSocketConn', data => {
      const { success, roomId, username } = data;
      if (success) {
        const senddata = {
          roomId: roomId,
          userName: username,
        };
        socket.emit('joinLobby', senddata);
        toast({
          title: 'Loading',
          description: 'Joining lobby ....',
        });
        setLoading(true);
        router.push('/lobby/' + roomId);
      }
    });
    socket.on('setAdmin', data => {
      if (data.setAdmin === true) {
        setAdmin(true);
        toast({
          title: 'Info',
          description: 'You are the Admin',
        });
      } else setAdmin(false);
    });

    socket.on('lobby', lobbyUsers => {
      if (!lobbyUsers) {
        return;
      }
      setLobby(lobbyUsers);
      joinLobbyAudio();
    });

    socket.on('remainingHints', data => {
      if (!data) {
        return;
      }
      // console.log('remainingHints', data);
      setRemainingHints(data);
    });

    socket.on('roundNo', data => {
      setRound(data);
    });

    socket.on('recievedChatData', data => {
      if (!data) {
        return;
      }
      const { userName, chatMsg, type = 'chat' } = data;
      setChat(prevChat => {
        return [...prevChat, { userName, chatMsg, type }];
      });
    });

    socket.on('connect_error', err => {
      toast({
        title: 'Error',
        description: `Can not connect to ${process.env.FRONTEND_SITE_NAME} server`,
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => (window.location.href = '/')}
          >
            Try again
          </ToastAction>
        ),
      });
      console.error('Connection error:', err);
    });

    socket.on('disconnect', () => {
      if (socket.connected === false) {
        toast({
          title: 'Error',
          description: 'Disconnected from the server',
        });
        socket.removeAllListeners();
        router.push('/');
      }
    });

    socket.on('lobbySettings', (lobbySettings: any) => {
      if (!lobbySettings) {
        return;
      }
      setGameSettings(lobbySettings);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('statusSocketConn');
      socket.off('setAdmin');
      socket.off('lobby');
      socket.off('remainingHints');
      socket.off('roundNo');
      socket.off('recievedChatData');
      socket.off('lobbySettings');
    };
  }, [toast, router]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
