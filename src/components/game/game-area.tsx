import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSocket } from '../provider/socket-provider';
import { useGameState } from '../provider/game-state-provider';
import { useGlobalState } from '../provider/global-state-provider';
import SideNav from '../lobby/side-nav/side-nav';
import WhiteBoard from './white-board';
import ChooseWord from './choose-word';
import Score from './score';
import Result from './result';
import Waiting from './wating';
import Palette from './palete';

const GameArea = ({ roomId }: { roomId: string }) => {
  const router = useRouter();
  const { socket } = useSocket();
  const [isShiftPressed, setShiftPressed] = useState(false);
  const [hideWaitingSection, setHideWaitingSection] = useState(false);
  const [wordWindow, setWordWindow] = useState(false);
  const [scoreWindow, setScoreWindow] = useState(false);
  const { setStrokeWidth } = useGameState();
  const {
    setPresenter,
    presenter,
    setChatBlock,
    setPresenterDetails,
    setPresenterName,
    gameStarted,
    showResult,
    setShowResult,
  } = useGlobalState();

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === '+') {
      setStrokeWidth(prev => (prev === 50 ? prev : prev + 1));
    }
    if (e.key === '-') {
      setStrokeWidth(prev => (prev === 1 ? prev : prev - 1));
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Shift') {
      setShiftPressed(true);
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Shift') {
      setShiftPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    if (!socket.connected) {
      socket.disconnect();
      socket.removeAllListeners();
      router.push('/');
    }

    socket.on('setPresenter', ({ presenter }) => {
      setPresenter(presenter);
      if (!presenter) setChatBlock(false);
    });
    socket.on('waitingSection', ({ hideWaiting }) => {
      setHideWaitingSection(hideWaiting);
    });
    socket.on('chooseWord', ({ chooseWordWindow }) => {
      setWordWindow(chooseWordWindow);
      setChatBlock(true);
    });
    socket.on('showScore', ({ showScoreWindow }) => {
      setScoreWindow(showScoreWindow);
    });
    socket.on('presenterDetails', ({ presenterSocketId, presenterName }) => {
      setPresenterDetails(presenterSocketId);
      setPresenterName(presenterName);
    });
    socket.on('chatBlock', ({ chatBlock }) => {
      setChatBlock(chatBlock);
    });
    socket.on('showResult', ({ result }) => {
      setShowResult(result);
    });

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    router,
    socket,
    setPresenter,
    setChatBlock,
    setPresenterDetails,
    setPresenterName,
    setShowResult,
  ]);

  return (
    <div className="relative">
      <div className="h-screen w-screen">
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-5 xl:grid-cols-12">
          <div className="col-span-1 md:col-span-3 xl:col-span-9 relative">
            <WhiteBoard isShiftPressed={isShiftPressed} roomId={roomId} />
            <div
              className={`z-[50] h-full w-full absolute  ${
                hideWaitingSection ? 'top-[-1200px]' : 'top-0'
              } left-0 transition-all duration-500`}
            >
              <Waiting />
            </div>
            <div
              className={`z-[50] h-full w-full absolute ${
                wordWindow ? 'top-0' : 'top-[-1200px]'
              } left-0 transition-all duration-500`}
            >
              <ChooseWord roomId={roomId} />
            </div>
            <div
              className={`z-[50] h-full w-full absolute ${
                scoreWindow ? 'top-0' : 'top-[-1200px]'
              }  left-0 transition-all duration-500`}
            >
              <Score roomId={roomId} />
            </div>
          </div>
          <div className="col-span-1 md:col-span-2 xl:col-span-3 h-screen">
            <SideNav roomId={roomId} isLobby={false} />
          </div>
        </div>

        <div
          className={`z-[20] absolute top-2 left-2 ${
            presenter ? 'block' : 'hidden'
          }`}
        >
          <Palette />
        </div>
      </div>
      <div
        className={`z-[150] h-full w-full absolute ${
          showResult ? 'top-0' : 'top-[-1200px]'
        } left-0 transition-all duration-500`}
      >
        <Result />
      </div>
    </div>
  );
};

export default GameArea;
