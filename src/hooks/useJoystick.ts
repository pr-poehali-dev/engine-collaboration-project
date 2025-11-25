import { useState, useEffect, useRef } from 'react';

interface JoystickState {
  x: number;
  y: number;
  active: boolean;
}

export function useJoystick() {
  const [state, setState] = useState<JoystickState>({ x: 0, y: 0, active: false });
  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const isMobile = 'ontouchstart' in window;
    if (!isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch.clientX > window.innerWidth / 2) return;
      
      startPos.current = { x: touch.clientX, y: touch.clientY };
      setState({ x: 0, y: 0, active: true });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!state.active) return;
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - startPos.current.x;
      const deltaY = touch.clientY - startPos.current.y;
      
      const maxDistance = 50;
      const x = Math.max(-1, Math.min(1, deltaX / maxDistance));
      const y = Math.max(-1, Math.min(1, deltaY / maxDistance));
      
      setState({ x, y, active: true });
    };

    const handleTouchEnd = () => {
      setState({ x: 0, y: 0, active: false });
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [state.active]);

  return state;
}
