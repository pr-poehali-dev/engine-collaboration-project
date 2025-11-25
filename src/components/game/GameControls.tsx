import { useState, useRef, useEffect } from 'react';

export interface JoystickState {
  x: number;
  z: number;
}

export function VirtualJoystick({ onMove }: { onMove: (x: number, z: number) => void }) {
  const [active, setActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const joystickRef = useRef<HTMLDivElement>(null);

  const handleStart = (clientX: number, clientY: number) => {
    setActive(true);
    startPos.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!active) return;
    
    const deltaX = clientX - startPos.current.x;
    const deltaY = clientY - startPos.current.y;
    
    const maxDistance = 50;
    const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    setPosition({ x, y });
    
    onMove(x / maxDistance, y / maxDistance);
  };

  const handleEnd = () => {
    setActive(false);
    setPosition({ x: 0, y: 0 });
    onMove(0, 0);
  };

  return (
    <div
      ref={joystickRef}
      className="absolute bottom-8 left-8 w-32 h-32 bg-white/20 rounded-full backdrop-blur-sm border-4 border-white/30 touch-none"
      onTouchStart={(e) => {
        e.preventDefault();
        handleStart(e.touches[0].clientX, e.touches[0].clientY);
      }}
      onTouchMove={(e) => {
        e.preventDefault();
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }}
      onTouchEnd={handleEnd}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => active && handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
    >
      <div
        className="absolute w-12 h-12 bg-white/60 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform shadow-lg"
        style={{
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`
        }}
      />
    </div>
  );
}

export function MiniMap({ playerPos }: { playerPos: [number, number, number] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, 150, 150);
    
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(0, 0, 150, 150);
    
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(55, 0, 40, 150);
    
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 45);
    ctx.lineTo(150, 45);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, 105);
    ctx.lineTo(150, 105);
    ctx.stroke();
    
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(90, 45, 4, 0, Math.PI * 2);
    ctx.fill();
    
    const mapX = 75 + (playerPos[0] / 200) * 150;
    const mapY = 75 + (playerPos[2] / 200) * 150;
    
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(mapX, mapY, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
  }, [playerPos]);
  
  return (
    <div className="absolute top-20 right-4 bg-black/70 p-2 rounded-lg backdrop-blur-sm">
      <canvas 
        ref={canvasRef}
        width={150}
        height={150}
        className="border-2 border-white/30 rounded"
      />
      <p className="text-white text-xs mt-1 text-center">Карта</p>
    </div>
  );
}
