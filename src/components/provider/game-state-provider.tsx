import {
  createContext,
  useState,
  useRef,
  ReactNode,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
} from 'react';
import { useGlobalState } from './global-state-provider';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface StateContextProps {
  tool: string;
  setTool: Dispatch<SetStateAction<string>>;
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
  elements: any[];
  setElements: Dispatch<SetStateAction<any[]>>;
  strokeWidth: number;
  setStrokeWidth: Dispatch<SetStateAction<number>>;
  history: any[];
  setHistory: Dispatch<SetStateAction<any[]>>;
  fill: boolean;
  setFill: Dispatch<SetStateAction<boolean>>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  ctxRef: React.RefObject<CanvasRenderingContext2D | null>;
}

const GameStateContext = createContext<StateContextProps | undefined>(
  undefined
);

interface StateProviderProps {
  children: ReactNode;
}

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GlobalStateProvider');
  }
  return context;
};

export const GameStateProvider: React.FC<StateProviderProps> = ({
  children,
}) => {
  const { lobby } = useGlobalState();
  const { toast } = useToast();

  useEffect(() => {
    if (!lobby || lobby.length <= 1) {
      let countdown = 5;
      const interval = setInterval(() => {
        toast({
          title: 'Notice',
          description: `Only one player in the game. End in ${countdown} seconds`,
          duration: 1000,
        });
        countdown -= 1;
        if (countdown < 0) {
          clearInterval(interval);
          window.location.href = '/';
        }
      }, 1000);
    }
  }, [lobby]);

  const [tool, setTool] = useState<string>('pencil');
  const [color, setColor] = useState<string>('#000000');
  const [elements, setElements] = useState<any[]>([]);
  const [strokeWidth, setStrokeWidth] = useState<number>(1);
  const [history, setHistory] = useState<any[]>([]);
  const [fill, setFill] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  return (
    <GameStateContext.Provider
      value={{
        tool,
        setTool,
        color,
        setColor,
        elements,
        setElements,
        strokeWidth,
        setStrokeWidth,
        history,
        setHistory,
        fill,
        setFill,
        canvasRef,
        ctxRef,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export default GameStateContext;
