import React from 'react';
import Time from './time';
import GuessWord from './guess-word';
import { TabsSection } from './tabs-section/tabs-section';
import BottomNavMenu from './bottom-nav-menu';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const SideNav = ({
  roomId,
  isLobby = true,
}: {
  roomId: string;
  isLobby?: boolean;
}) => {
  return (
    <ScrollArea className="rounded-base w-full h-screen shadow-md">
      <Card className="w-full min-h-screen bg-gray-100 pt-4">
        <CardContent className="w-full h-full">
          <TabsSection roomId={roomId} />
          <Separator className="my-4" />
          {!isLobby && (
            <>
              <div className="w-full h-full">
                <Time />
              </div>
              <Separator className="my-2" />
              <div className="w-full h-8">
                <GuessWord />
              </div>
              <Separator className="my-2" />
            </>
          )}

          <BottomNavMenu roomId={roomId} />
        </CardContent>
      </Card>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default SideNav;
