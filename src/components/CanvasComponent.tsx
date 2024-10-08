"use client";
import { useDraw } from "@/hooks/useDraw";
import ColorPicker from "./ColorPicker";
import { useEffect, useState } from "react";
import StrokeSelector from "./StrokeSelector";
import { io } from "socket.io-client";
import { drawLine } from "@/utils/drawline";


type DrawLineProps = {
  prevPoint: Point | null
  currentPoint: Point
  color: string,
  strokeWidth: number,
  currentColor: string
}

const socket = io("http://localhost:4000");
function CanvasComponent() {
  const { canvasRef, onMouseDown, clear, isCampusEmpty } = useDraw(createLine);
  const [currentColor, setcurrentColor] = useState<string>("#000");
  const [strokeWidth, setcurrentStroke] = useState<number>(5);

  useEffect(()=>{
    const ctx = canvasRef?.current?.getContext("2d");

    // emitting the ready state
    socket.emit("client-ready");


    socket.on("get-canvas-state", ()=>{
      if(!canvasRef.current?.toDataURL()) return ;
      socket.emit("canvas-state", canvasRef.current?.toDataURL())
    })

    socket.on("draw-line", ({prevPoint, currentPoint, strokeWidth, currentColor}:DrawLineProps)=>{
      if(!ctx) return ;
      drawLine({prevPoint, currentPoint, currentColor, ctx, strokeWidth})
    })

    socket.on("canvas-state-from-server", (state: string)=>{
      const image = new Image();
      image.src = state;
      image.onload = ()=>{
        ctx?.drawImage(image, 0, 0)
      }
    })

    // prevPoint, currentPoint, strokeWidth, color
    // clearing the canvas
    socket.on("clear", clear);

    // clean up functions
    return ()=>{
      socket.off("get-canvas-state");
      socket.off("canvas-state");
      socket.off("draw-line");
      socket.off("canvas-state-from-server");
      socket.off("clear");
    }
  }, [canvasRef, strokeWidth, currentColor])

  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    console.log('strokeWidth', strokeWidth)
    socket.emit("draw-line", ({prevPoint, currentPoint, strokeWidth, currentColor}));
    // prevPoint, currentPoint, currentColor, ctx, strokeWidth
    drawLine({prevPoint, currentPoint,currentColor, ctx, strokeWidth})
  }

  const handleDownloadAsImage = () => {
    if (canvasRef?.current) {
      const base64Image = canvasRef.current.toDataURL();

      const element = document.createElement("a");
      element.href = base64Image;
      element.download = `siganture-${Date.now() * 10000}`;

      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      console.error("Canvas reference is null or base64 image not available.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col gap-3">
        <canvas
          ref={canvasRef}
          width={750}
          height={550}
          className="border border-black"
          onMouseDown={onMouseDown}
          onTouchStart={onMouseDown}
        />
        <div className="flex flex-row gap-5 items-center justify-center">
          <button
            className="text-violet-700 hover:text-white border border-purple-300 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            onClick={()=>{
              socket.emit("clear")
            }}
          >
            Clear
          </button>

          {!isCampusEmpty && (
            <button
              className="text-violet-700 hover:text-white border border-purple-300 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              onClick={handleDownloadAsImage}
            >
              Download Image
            </button>
          )}
        </div>
        <ColorPicker setcurrentColor={setcurrentColor} />
        <StrokeSelector setcurrentStroke={setcurrentStroke} />
      </div>
    </div>
  );
}

export default CanvasComponent;
