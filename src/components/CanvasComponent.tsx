"use client"
import {useDraw} from "@/hooks/useDraw"
import ColorPicker from "./ColorPicker";
import { useState } from "react";

function CanvasComponent() {
  const { canvasRef, onMouseDown, clear } = useDraw(drawLine);
  const [currentColor, setcurrentColor] = useState<string>("#000")
  function drawLine ({prevPoint, currentPoint, ctx}:Draw) {
    const {x: curX, y: currY} = currentPoint;
    const lineColor = currentColor;
    const lineWidth = 5;

    let startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x, startPoint.y );
    ctx.lineTo(curX, currY);
    ctx.stroke();
    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(startPoint.x , startPoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }



  return (
    <div  className="flex items-center justify-center w-screen h-screen">
   <div className="flex flex-col gap-3">
   <canvas
        ref={canvasRef}
        width={750}
        height={750}
        className="border border-black"
        onMouseDown={onMouseDown}
      />
      <div className="flex flex-row gap-5">
      <button className="btn bg-violet-500 text-white w-20 h-10 rounded-lg" onClick={clear}>Clear</button>
      <ColorPicker currentColor={currentColor} setcurrentColor={setcurrentColor}/>
      </div>
   </div>
    </div>
  )
}

export default CanvasComponent