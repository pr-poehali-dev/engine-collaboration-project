import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Scene } from '@/components/game/GameScene';
import { VirtualJoystick, MiniMap, type JoystickState } from '@/components/game/GameControls';

export default function Index() {
  const [joystick, setJoystick] = useState<JoystickState>({ x: 0, z: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [playerPos, setPlayerPos] = useState<[number, number, number]>([0, 1.5, 50]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full h-screen relative">
      <Canvas
        shadows
        camera={{ position: [0, 15, 70], fov: 75 }}
        gl={{ 
          antialias: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <Scene joystick={joystick} onPlayerMove={setPlayerPos} />
        </Suspense>
      </Canvas>
      
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