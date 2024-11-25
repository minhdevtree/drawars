import { Button } from '@/components/ui/button';
import React from 'react';

const navigations = ['chats', 'lobby', 'settings'];

interface SideNavNavigationProps {
  selectedSideNav: string;
  setSelectedSideNav: (navItem: string) => void;
}

const SideNavNavigation: React.FC<SideNavNavigationProps> = ({
  selectedSideNav,
  setSelectedSideNav,
}) => {
  const handleNavigationClick = (navItem: string) => {
    setSelectedSideNav(navItem);
  };

  return (
    <div className="w-full h-full flex flex-row justify-center items-center gap-2">
      {navigations.map(navItem => (
        <Button
          key={navItem}
          onClick={() => handleNavigationClick(navItem)}
          variant={selectedSideNav === navItem ? 'noShadow' : 'default'}
        >
          {navItem}
        </Button>
      ))}
    </div>
  );
};

export default SideNavNavigation;
