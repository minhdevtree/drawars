import { useEffect, useRef, useState } from 'react';
import { useGameState } from '../provider/game-state-provider';
import { useToast } from '@/hooks/use-toast';
import {
  Circle,
  CircleDot,
  Eraser,
  Minus,
  PaintBucket,
  Pencil,
  Redo,
  Save,
  Square,
  Trash,
  Triangle,
  Undo,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '../ui/scroll-area';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useGlobalState } from '../provider/global-state-provider';

const Palette = () => {
  const { presenter } = useGlobalState();

  useEffect(() => {
    if (!presenter) {
      setOpen(false);
    }
  }, [presenter]);

  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const {
    canvasRef,
    strokeWidth,
    setStrokeWidth,
    color,
    setColor,
    history,
    tool,
    setTool,
    elements,
    setElements,
    setHistory,
    fill,
    setFill,
  } = useGameState();
  const [isClient, setIsClient] = useState(false);
  const colorRef = useRef<HTMLInputElement>(null);

  const handleColorClick = () => {
    colorRef.current?.click();
  };

  const handleClear = () => {
    setElements([]);
  };

  const handleUndoClick = () => {
    if (elements.length === 0) return;
    setHistory(prevHistory => [...prevHistory, elements[elements.length - 1]]);
    setElements(prevElements => prevElements.slice(0, prevElements.length - 1));
  };

  const handleRedoClick = () => {
    if (history.length === 0) return;
    setElements(prevElements => [...prevElements, history[history.length - 1]]);
    setHistory(prevHistory => prevHistory.slice(0, prevHistory.length - 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        handleUndoClick();
      } else if (e.ctrlKey && e.key === 'y') {
        handleRedoClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [elements, history]);

  const saveDrawingClick = () => {
    if (elements.length === 0 || !canvasRef.current) return;
    canvasRef.current.toBlob(imageBlob => {
      if (imageBlob) {
        navigator.clipboard.write([
          new ClipboardItem({ 'image/png': imageBlob }),
        ]);
        toast({
          title: 'Success',
          description: 'Drawing copied!',
        });
      }
    });
  };

  const handleFillTool = (e: any) => {
    if (tool !== 'fill' || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const imageData = ctx.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    const targetColor = getColorAtPixel(imageData, x, y);
    const fillColor = hexToRgba(color);

    if (colorsMatch(targetColor, fillColor)) return;

    floodFill(ctx, x, y, targetColor, fillColor, imageData);
    ctx.putImageData(imageData, 0, 0);
    setElements(prevElements => [...prevElements, { type: 'fill', color }]);
  };

  const getColorAtPixel = (imageData: ImageData, x: number, y: number) => {
    const index = (y * imageData.width + x) * 4;
    return [
      imageData.data[index],
      imageData.data[index + 1],
      imageData.data[index + 2],
      imageData.data[index + 3],
    ];
  };

  const hexToRgba = (hex: string) => {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 255];
  };

  const colorsMatch = (a: number[], b: number[]) => {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  };

  const floodFill = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    targetColor: number[],
    fillColor: number[],
    imageData: ImageData
  ) => {
    const stack = [[x, y]];
    while (stack.length) {
      const [currentX, currentY] = stack.pop()!;
      const currentColor = getColorAtPixel(imageData, currentX, currentY);
      if (!colorsMatch(currentColor, targetColor)) continue;

      const index = (currentY * imageData.width + currentX) * 4;
      imageData.data[index] = fillColor[0];
      imageData.data[index + 1] = fillColor[1];
      imageData.data[index + 2] = fillColor[2];
      imageData.data[index + 3] = fillColor[3];

      stack.push([currentX + 1, currentY]);
      stack.push([currentX - 1, currentY]);
      stack.push([currentX, currentY + 1]);
      stack.push([currentX, currentY - 1]);
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (tool === 'fill' && canvasRef.current) {
      canvasRef.current.addEventListener('click', handleFillTool);
    }
    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('click', handleFillTool);
      }
    };
  }, [tool, color]);

  if (!isClient) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={() => setOpen(!open)}>
      <SheetTrigger asChild>
        <Button>
          <Pencil className="h-4 w-4 mr-1" />
          Drawing Tools
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-[200px] p-0 bg-transparent border-none"
        side="left"
      >
        <SheetTitle></SheetTitle>
        <SheetDescription></SheetDescription>
        <ScrollArea className="rounded-base w-full h-screen shadow-md">
          <Card className="h-full p-4 min-h-screen bg-gray-100 shadow-md w-[200px]">
            <CardContent>
              <div className="flex flex-wrap gap-2 justify-center">
                {/* Tool Buttons */}
                <Button
                  variant={tool === 'pencil' ? 'default' : 'neutral'}
                  size="icon"
                  onClick={() => setTool('pencil')}
                >
                  <Pencil />
                </Button>
                <Button
                  variant={tool === 'line' ? 'default' : 'neutral'}
                  size="icon"
                  onClick={() => setTool('line')}
                >
                  <Minus />
                </Button>
                <Button
                  variant={tool === 'rectangle' ? 'default' : 'neutral'}
                  size="icon"
                  onClick={() => setTool('rectangle')}
                >
                  <Square />
                </Button>
                <Button
                  variant={tool === 'circle' ? 'default' : 'neutral'}
                  size="icon"
                  onClick={() => setTool('circle')}
                >
                  <Circle />
                </Button>
                <Button
                  variant={tool === 'triangle' ? 'default' : 'neutral'}
                  size="icon"
                  onClick={() => setTool('triangle')}
                >
                  <Triangle />
                </Button>
                <Button
                  variant={tool === 'eraser' ? 'default' : 'neutral'}
                  size="icon"
                  onClick={() => setTool('eraser')}
                >
                  <Eraser />
                </Button>
                <Button
                  variant={tool === 'fill' ? 'default' : 'neutral'}
                  size="icon"
                  // TODO: Implement fill tool
                  disabled={true}
                  onClick={() => setTool('fill')}
                >
                  <PaintBucket />
                </Button>
                <Button variant="neutral" size="icon" onClick={handleClear}>
                  <Trash />
                </Button>
              </div>
              <Separator className="my-4" />
              {/* History Controls */}
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  variant="neutral"
                  size="icon"
                  onClick={handleUndoClick}
                  disabled={elements.length === 0}
                >
                  <Undo />
                </Button>
                <Button
                  variant="neutral"
                  size="icon"
                  onClick={handleRedoClick}
                  disabled={history.length === 0}
                >
                  <Redo />
                </Button>
                <Button
                  variant="neutral"
                  size="icon"
                  onClick={saveDrawingClick}
                  disabled={elements.length === 0}
                >
                  <Save />
                </Button>
              </div>
              <Separator className="my-4" />
              {/* Color Picker */}
              <div className="flex flex-col items-center">
                <input
                  type="color"
                  ref={colorRef}
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="hidden"
                />
                <div
                  className="w-10 h-10 rounded-full border cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={handleColorClick}
                ></div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[
                    '#000000',
                    '#DB2777',
                    '#DC2626',
                    '#16A34A',
                    '#EAB308',
                    '#2563EB',
                    '#EA580C',
                    '#4B5563',
                  ].map(presetColor => (
                    <div
                      key={presetColor}
                      className="w-6 h-6 rounded-full border cursor-pointer"
                      style={{ backgroundColor: presetColor }}
                      onClick={() => setColor(presetColor)}
                    ></div>
                  ))}
                </div>
              </div>
              <Separator className="my-4" />
              {/* Stroke Width Selector */}
              <div className="flex flex-wrap gap-2 justify-center">
                {[2, 4, 6, 8].map(width => (
                  <Button
                    key={width}
                    variant={strokeWidth === width ? 'default' : 'neutral'}
                    size="icon"
                    onClick={() => setStrokeWidth(width)}
                  >
                    <CircleDot className={`w-${width} h-${width}`} />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default Palette;
