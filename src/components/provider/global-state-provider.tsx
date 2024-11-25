import { createContext, useState, ReactNode, useContext } from 'react';

interface GlobalStateContextType {
  isAdmin: boolean;
  setAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  chat: any[];
  setChat: React.Dispatch<React.SetStateAction<any[]>>;
  gameSettings: Record<string, any>;
  setGameSettings: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  presenter: boolean;
  setPresenter: React.Dispatch<React.SetStateAction<boolean>>;
  chatBlock: boolean;
  setChatBlock: React.Dispatch<React.SetStateAction<boolean>>;
  lobby: any[];
  setLobby: React.Dispatch<React.SetStateAction<any[]>>;
  presenterDetails: any | null;
  setPresenterDetails: React.Dispatch<React.SetStateAction<any | null>>;
  presenterName: string;
  setPresenterName: React.Dispatch<React.SetStateAction<string>>;
  gameStarted: boolean;
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  guessWord: string;
  setGuessWord: React.Dispatch<React.SetStateAction<string>>;
  remainingHints: string;
  setRemainingHints: React.Dispatch<React.SetStateAction<string>>;
  displayHint: boolean;
  setDisplayHint: React.Dispatch<React.SetStateAction<boolean>>;
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  round: string;
  setRound: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  showResult: boolean;
  setShowResult: React.Dispatch<React.SetStateAction<boolean>>;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(
  undefined
);

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setAdmin] = useState<boolean>(false);
  const [chat, setChat] = useState<any[]>([]);
  const [gameSettings, setGameSettings] = useState<Record<string, any>>({});
  const [presenter, setPresenter] = useState<boolean>(false);
  const [chatBlock, setChatBlock] = useState<boolean>(false);
  const [lobby, setLobby] = useState<any[]>([]);
  const [presenterDetails, setPresenterDetails] = useState<any | null>(null);
  const [presenterName, setPresenterName] = useState<string>('');
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [guessWord, setGuessWord] = useState<string>('');
  const [remainingHints, setRemainingHints] = useState<string>('');
  const [displayHint, setDisplayHint] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [round, setRound] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);

  return (
    <GlobalStateContext.Provider
      value={{
        isAdmin,
        setAdmin,
        chat,
        setChat,
        gameSettings,
        setGameSettings,
        presenter,
        setPresenter,
        chatBlock,
        setChatBlock,
        lobby,
        setLobby,
        presenterDetails,
        setPresenterDetails,
        gameStarted,
        setGameStarted,
        guessWord,
        setGuessWord,
        displayHint,
        setDisplayHint,
        remainingHints,
        setRemainingHints,
        userName,
        setUserName,
        round,
        setRound,
        presenterName,
        setPresenterName,
        loading,
        setLoading,
        showResult,
        setShowResult,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
