import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useContext,
} from 'react';

interface LobbyStateContextType {
  lobby: any[];
  setLobby: Dispatch<SetStateAction<any[]>>;
}

const LobbyStateContext = createContext<LobbyStateContextType | undefined>(
  undefined
);

interface LobbyStateProviderProps {
  children: ReactNode;
}

export const useLobbyState = () => {
  const context = useContext(LobbyStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};

export const LobbyStateProvider: React.FC<LobbyStateProviderProps> = ({
  children,
}) => {
  const [lobby, setLobby] = useState<any[]>([]);

  return (
    <LobbyStateContext.Provider value={{ lobby, setLobby }}>
      {children}
    </LobbyStateContext.Provider>
  );
};

export default LobbyStateContext;
