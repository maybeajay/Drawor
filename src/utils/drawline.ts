type DrawLineProps = Draw & {
    currentColor: string,
    strokeWidth: number
}
export  const drawLine = ({prevPoint, currentPoint, currentColor, ctx, strokeWidth}:DrawLineProps)=>{

    const { x: curX, y: currY } = currentPoint;
    const linecurrentColor = currentColor;
    const startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = linecurrentColor;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(curX, currY);
    ctx.stroke();
    ctx.fillStyle = linecurrentColor;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();
}