"use client";
import { useDraw } from "@/hooks/useDraw";
import ColorPicker from "./ColorPicker";
import { useState } from "react";
import { Draw } from "@/types/types";

function CanvasComponent() {
  const { canvasRef, onMouseDown, clear, isCampusEmpty } = useDraw(drawLine);
  const [currentColor, setcurrentColor] = useState<string>("#000");
  const [imageSource, setimageSource] = useState<string | undefined>("");
  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: curX, y: currY } = currentPoint;
    const lineColor = currentColor;
    const lineWidth = 5;

    let startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(curX, currY);
    ctx.stroke();
    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }
  
  const handleDownloadAsImage = () => {
    setimageSource(canvasRef?.current?.toDataURL());
    if (canvasRef?.current) {
      const base64Image = canvasRef.current.toDataURL();
  
      const element = document.createElement("a");
      element.href = base64Image;
      element.download = `siganture-${Date.now()*10000}`; 
  
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element); 
    } else {
      console.error("Canvas reference is null or base64 image not available.");
    }
  };
  
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="flex flex-col gap-3">
        <canvas
          ref={canvasRef}
          width={750}
          height={750}
          className="border border-black"
          onMouseDown={onMouseDown}
        />
        <div className="flex flex-row gap-5">
          <button
            className="text-violet-700 hover:text-white border border-purple-300 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            onClick={clear}
          >
            Clear
          </button>

         {!isCampusEmpty && <button
            className="text-violet-700 hover:text-white border border-purple-300 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            onClick={handleDownloadAsImage}
            disabled={canvasRef?.current?.toDataURL() != undefined  ? false : true}
          >
            Download Image
          </button>}
        </div>
        <ColorPicker
          currentColor={currentColor}
          setcurrentColor={setcurrentColor}
        />
      </div>
    </div>
  );
}

export default CanvasComponent;
