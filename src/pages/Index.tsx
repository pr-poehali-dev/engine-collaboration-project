import { Suspense, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Scene } from '@/components/game/GameScene';
import { VirtualJoystick, MiniMap, type JoystickState } from '@/components/game/GameControls';

export default function Index() {
  const [joystick, setJoystick] = useState<JoystickState>({ x: 0, z: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [playerPos, setPlayerPos] = useState<[number, number, number]>([0, 1.5, 50]);
  const [glError, setGlError] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCreated = useCallback(({ gl }: any) => {
    gl.domElement.addEventListener('webglcontextlost', (e: Event) => {
      e.preventDefault();
      console.log('WebGL context lost, attempting restore...');
      setGlError(true);
      setTimeout(() => setGlError(false), 100);
    });
    
    gl.domElement.addEventListener('webglcontextrestored', () => {
      console.log('WebGL context restored');
      setGlError(false);
    });
  }, []);

  return (
    <div className="w-full h-screen relative">
      {!glError && (
        <Canvas
          shadows={!isMobile}
          camera={{ position: [0, 15, 70], fov: 75 }}
          gl={{ 
            antialias: false,
            alpha: false,
            powerPreference: isMobile ? 'low-power' : 'high-performance',
            preserveDrawingBuffer: false,
            failIfMajorPerformanceCaveat: false,
            toneMapping: THREE.ACESFilmicToneMapping
          }}
          dpr={isMobile ? [0.5, 1] : [1, 1.5]}
          onCreated={handleCreated}
        >
        <Suspense fallback={null}>
          <Scene joystick={joystick} onPlayerMove={setPlayerPos} />
        </Suspense>
      </Canvas>
      )}
      
      <div className="absolute top-4 left-4 bg-black/70 text-white p-4 rounded-lg backdrop-blur-sm z-10">
        <h1 className="text-2xl font-bold mb-2">Сызрань 3D</h1>
        <p className="text-sm">
          {isMobile ? 'Джойстик внизу слева' : 'Управление: WASD'}
        </p>
        <p className="text-sm">Камера: {isMobile ? 'Свайп' : 'Мышь + колесо'}</p>
      </div>

      <MiniMap playerPos={playerPos} />

      {isMobile && (
        <VirtualJoystick 
          onMove={(x, z) => setJoystick({ x, z })} 
        />
      )}
    </div>
  );
}