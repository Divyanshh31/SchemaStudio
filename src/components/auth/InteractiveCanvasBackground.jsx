import React, { useEffect, useRef } from 'react';

export default function InteractiveCanvasBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;

    const render = () => {
      time += 0.01;

      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // Blueprint Precision Grid (Paper background with hairline grid rules)
      const gridSize = 32;
      ctx.strokeStyle = '#DDE0DA';
      ctx.lineWidth = 0.5;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Dynamic CAD Viewfinder Lines extending to Cursor
      ctx.strokeStyle = 'rgba(36, 84, 255, 0.25)';
      ctx.lineWidth = 1;

      // Horizontal cursor crosshair
      ctx.beginPath();
      ctx.moveTo(0, mouse.y);
      ctx.lineTo(width, mouse.y);
      ctx.stroke();

      // Vertical cursor crosshair
      ctx.beginPath();
      ctx.moveTo(mouse.x, 0);
      ctx.lineTo(mouse.x, height);
      ctx.stroke();

      // Small cursor precision reticle
      ctx.strokeStyle = '#2454FF';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 8, 0, Math.PI * 2);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ backgroundColor: '#F5F6F2' }}
    />
  );
}
