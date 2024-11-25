import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChatArea from './chat-area';
import NavLobby from './nav-lobby';
import Settings from './settings';

export const TabsSection = ({ roomId }: { roomId: string }) => {
  return (
    <Tabs defaultValue="chats">
      <TabsList className="flex w-full">
        <TabsTrigger value="chats" className="flex-1">
          Chats
        </TabsTrigger>
        <TabsTrigger value="lobby" className="flex-1">
          Lobby
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex-1">
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="chats" className="p-2">
        <ChatArea roomId={roomId} />
      </TabsContent>
      <TabsContent value="lobby" className="p-2">
        <NavLobby roomId={roomId} />
      </TabsContent>
      <TabsContent value="settings" className="p-2">
        <Settings roomId={roomId} />
      </TabsContent>
    </Tabs>
  );
};
