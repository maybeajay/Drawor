import { useEffect, useRef, useState } from 'react'

export const useDraw = (onDraw: ({ ctx, currentPoint, prevPoint }: Draw) => void) => {
  const [mouseDown, setMouseDown] = useState(false)
  const [isCampusEmpty, setIsCampusEmpty] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prevPoint = useRef<null | Point>(null)

  const onMouseDown = () => setMouseDown(true)
  const onTouchStart = (e: TouchEvent) => {
    setMouseDown(true)
  }

  const clear = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setIsCampusEmpty(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseDown) return
      const currentPoint = computePointInCanvas(e)

      const ctx = canvasRef.current?.getContext('2d')
      if (!ctx || !currentPoint) return
      ctx.fillStyle = "orange"

      onDraw({ ctx, currentPoint, prevPoint: prevPoint.current })
      prevPoint.current = currentPoint
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!mouseDown) return
      const touch = e.touches[0]
      const currentPoint = computePointInCanvas(touch)

      const ctx = canvasRef.current?.getContext('2d')
      if (!ctx || !currentPoint) return
      ctx.fillStyle = "orange"

      onDraw({ ctx, currentPoint, prevPoint: prevPoint.current })
      prevPoint.current = currentPoint
      e.preventDefault() // Prevent scrolling while drawing
    }

    const computePointInCanvas = (e: MouseEvent | Touch) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setIsCampusEmpty(false)
      return { x, y }
    }

    const mouseUpHandler = () => {
      setMouseDown(false)
      prevPoint.current = null
    }

    // Add mouse event listeners
    canvasRef.current?.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', mouseUpHandler)

    // Add touch event listeners
    canvasRef.current?.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', mouseUpHandler)
    canvasRef.current?.addEventListener('touchstart', onTouchStart)

    // Cleanup event listeners on unmount
    return () => {
      canvasRef.current?.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', mouseUpHandler)

      canvasRef.current?.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', mouseUpHandler)
      canvasRef.current?.removeEventListener('touchstart', onTouchStart)
    }
  }, [mouseDown, onDraw])

  return { canvasRef, onMouseDown, onTouchStart, clear, isCampusEmpty }
}
