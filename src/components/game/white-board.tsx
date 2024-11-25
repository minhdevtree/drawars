'use client';
import {
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
  useContext,
} from 'react';
import rough from 'roughjs';
import { useGameState } from '../provider/game-state-provider';
import { useGlobalState } from '../provider/global-state-provider';
import { useSocket } from '../provider/socket-provider';

const roughGen = rough.generator();

const userJoined = (data: any) => {
  if (data.success) {
    console.log('userJoined');
  } else {
    console.log('userJoined error');
  }
};

const WhiteBoard = ({
  isShiftPressed,
  roomId,
}: {
  isShiftPressed: boolean;
  roomId: string;
}) => {
  const { socket } = useSocket();
  const {
    canvasRef,
    strokeWidth,
    color,
    tool,
    elements,
    setElements,
    setHistory,
    fill,
  } = useGameState();
  const ctxRef = useRef<any>(null);
  const { presenter } = useGlobalState();
  const [hold, setHold] = useState(false);
  const divRef = useRef<any>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (presenter === false) return;
    const { offsetX, offsetY } = e.nativeEvent;
    setHold(true);

    //pencil and eraser -free draw
    if (tool === 'pencil' || tool === 'eraser') {
      setElements(prevElements => [
        ...prevElements,
        {
          type: 'pencil',
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          color: tool === 'pencil' ? color : '#ffffff',
          strokeWidth: strokeWidth,
        },
      ]);
    }

    //line
    else if (tool === 'line') {
      setElements(prevElements => [
        ...prevElements,
        {
          type: 'line',
          startx: offsetX,
          starty: offsetY,
          endx: offsetX,
          endy: offsetY,
          color: color,
          strokeWidth: strokeWidth,
        },
      ]);
    }

    //rectangle
    else if (tool === 'rectangle') {
      setElements(prevElements => [
        ...prevElements,
        {
          type: 'rect',
          offsetX,
          offsetY,
          width: 0,
          height: 0,
          color: color,
          strokeWidth: strokeWidth,
          fill: fill === true ? color : '',
        },
      ]);
    }

    //square
    else if (tool === 'square') {
      setElements(prevElements => [
        ...prevElements,
        {
          type: 'square',
          offsetX,
          offsetY,
          width: 0,
          height: 0,
          color: color,
          strokeWidth: strokeWidth,
          fill: fill === true ? color : '',
        },
      ]);
    }

    //circle and ellipse
    else if (tool === 'circle') {
      setElements(prevElements => [
        ...prevElements,
        {
          type: isShiftPressed ? 'circle' : 'ellipse',
          offsetX,
          offsetY,
          width: offsetX,
          height: offsetY,
          color: color,
          strokeWidth: strokeWidth,
          fill: fill === true ? color : '',
        },
      ]);
    } else if (tool === 'triangle') {
      setElements(prevElements => [
        ...prevElements,
        {
          type: 'triangle',
          offsetX,
          offsetY,
          width: 0,
          height: 0,
          color: color,
          strokeWidth: strokeWidth,
          fill: fill === true ? color : '',
        },
      ]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (presenter === false) return;
    const { offsetX, offsetY } = e.nativeEvent;
    if (hold) {
      setHistory([]);
      // pencil
      if (tool === 'pencil' || tool === 'eraser') {
        const { path } = elements[elements.length - 1];
        const newpath = [...path, [offsetX, offsetY]];
        setElements(prevElements =>
          prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                path: newpath,
              };
            } else {
              return ele;
            }
          })
        );
      }

      // line
      else if (tool === 'line') {
        setElements(prevElements =>
          prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                endx: offsetX,
                endy: offsetY,
              };
            } else {
              return ele;
            }
          })
        );
      }

      //reactangle
      else if (tool === 'rectangle') {
        setElements(prevElements => {
          return prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                width: offsetX - ele.offsetX,
                height: offsetY - ele.offsetY,
              };
            } else {
              return ele;
            }
          });
        });
      }

      //square
      else if (tool === 'square') {
        setElements(prevElements => {
          return prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                width: offsetY - ele.offsetY,
                height: offsetY - ele.offsetY,
              };
            } else {
              return ele;
            }
          });
        });
      }

      //circle and ellipse
      else if (tool === 'circle') {
        setElements(prevElements => {
          return prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                type: isShiftPressed ? 'circle' : 'ellipse',
                width: offsetX,
                height: offsetY,
              };
            } else {
              return ele;
            }
          });
        });
      } else if (tool === 'triangle') {
        setElements(prevElements => {
          return prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                width: offsetX,
                height: offsetY,
              };
            } else {
              return ele;
            }
          });
        });
      }
    }
  };

  const handleMouseUp = (e: any) => {
    if (presenter === false) return;
    setHold(false);
  };

  // const handleKeyDown = (e) => {
  //   console.log(e);
  // };

  useEffect(() => {
    socket.on('userIsJoined', userJoined);
    socket.on('whiteBoardDrawingResponse', data => {
      if (!presenter) setElements(data);
    });
    if (presenter && canvasRef.current) {
      //sending width,height of the canvas to all recipients
      const width = canvasRef.current.offsetWidth;
      const height = canvasRef.current.offsetHeight;
      socket.emit('canvasWidthHeight', { width, height, roomId });

      const canvas = canvasRef.current;
      canvas.height = canvas.offsetHeight;
      canvas.width = canvas.offsetWidth;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
      }

      ctxRef.current = ctx;
    }
  }, [presenter]);

  useEffect(() => {
    if (elements.length === 0) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        if (canvasRef.current) {
          ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    }
  }, [elements]);

  useEffect(() => {
    socket.on('getCanvasWidthHeight', data => {
      const { width, height } = data;
      const canvas = canvasRef.current;
      if (canvas) {
        const newHeight = (canvas.offsetHeight * width) / canvas.offsetWidth;
        canvas.height = newHeight;
        canvas.width = width;
      }
      // canvas.height = canvas.offsetHeight;
      // canvas.width = canvas.offsetWidth;
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        ctxRef.current = ctx;
      }
    });

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.height = canvas.offsetHeight;
      canvas.width = canvas.offsetWidth;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        ctxRef.current = ctx;
      }
    }
  }, []);

  useEffect(() => {
    ctxRef.current.strokeStyle = color;
  }, [color]);

  const handleTouch = (e: any) => {
    // const { clientX, clientY } = e.targetTouches[0];
    // console.log(clientX, clientY);
    console.log(e);
  };

  // useEffect(() => {
  //   console.log(divRef);
  // }, [divRef]);

  useLayoutEffect(() => {
    // console.log(elements);
    const data = {
      roomId: roomId,
      elements: elements,
    };
    if (presenter === true) socket.emit('whiteBoardDrawing', data);
    if (!canvasRef.current) return;
    const roughCanvas = rough.canvas(canvasRef.current);

    if (elements.length > 0) {
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }

    elements.forEach(element => {
      if (element.type === 'pencil') {
        roughCanvas.linearPath(element.path, {
          stroke: element.color,
          strokeWidth: element.strokeWidth,
          roughness: 0,
        });
      } else if (element.type === 'line') {
        console.log(element.startx, element.starty, element.endx, element.endy);
        roughCanvas.draw(
          roughGen.line(
            element.startx,
            element.starty,
            element.endx,
            element.endy,
            {
              stroke: element.color,
              strokeWidth: element.strokeWidth,
              roughness: 0,
            }
          )
        );
      } else if (element.type === 'rect') {
        roughCanvas.draw(
          roughGen.rectangle(
            element.offsetX,
            element.offsetY,
            element.width,
            element.height,
            {
              stroke: element.color,
              strokeWidth: element.strokeWidth,
              roughness: 0,
              fill: element.fill,
              fillStyle: 'solid',
            }
          )
        );
      } else if (element.type === 'square') {
        roughCanvas.draw(
          roughGen.rectangle(
            element.offsetX,
            element.offsetY,
            element.width,
            element.height,
            {
              stroke: element.color,
              strokeWidth: element.strokeWidth,
              roughness: 0,
              fill: element.fill,
              fillStyle: 'solid',
            }
          )
        );
      } else if (element.type === 'circle') {
        roughCanvas.draw(
          roughGen.circle(
            (element.width + element.offsetX) / 2,
            (element.height + element.offsetY) / 2,
            element.width - element.offsetX,
            {
              stroke: element.color,
              strokeWidth: element.strokeWidth,
              roughness: 0,
              fill: element.fill,
              fillStyle: 'solid',
            }
          )
        );
      } else if (element.type === 'ellipse') {
        roughCanvas.draw(
          roughGen.ellipse(
            (element.width + element.offsetX) / 2,
            (element.height + element.offsetY) / 2,
            element.width - element.offsetX,
            element.height - element.offsetY,
            {
              stroke: element.color,
              strokeWidth: element.strokeWidth,
              roughness: 0,
              fill: element.fill,
              fillStyle: 'solid',
            }
          )
        );
      } else if (element.type === 'triangle') {
        roughCanvas.draw(
          roughGen.polygon(
            [
              [element.offsetX, element.offsetY],
              [element.width, element.height],
              [element.width, element.offsetY],
            ],
            {
              stroke: element.color,
              strokeWidth: element.strokeWidth,
              roughness: 0,
              fill: element.fill,
              fillStyle: 'solid',
            }
          )
        );
      }
    });
  }, [elements]);

  return (
    <>
      <div className="h-full w-full">
        <div
          onMouseDown={e => handleMouseDown(e)}
          onMouseMove={e => handleMouseMove(e)}
          onMouseUp={e => handleMouseUp(e)}
          onMouseOut={e => handleMouseUp(e)}
          // onTouchStart={(e) => handleMouseDown(e)}
          onTouchMove={e => handleTouch(e)}
          // onTouchEnd={(e) => handleMouseUp(e)}
          className="w-full h-full"
          ref={divRef}
        >
          <canvas ref={canvasRef} className="w-full h-full bg-white" />
        </div>
      </div>
    </>
  );
};

export default WhiteBoard;
