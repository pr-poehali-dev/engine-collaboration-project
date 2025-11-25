import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Suspense, useState } from 'react';
import Player from '@/components/game/Player';
import Ground from '@/components/game/Ground';
import { useJoystick } from '@/hooks/useJoystick';

export default function Index() {
  const joystick = useJoystick();
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);

  return (
    <div className="w-full h-screen relative bg-sky-400">
      <Canvas shadows camera={{ position: [0, 10, 20], fov: 60 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[50, 50, 25]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        
        <Suspense fallback={null}>
          <Physics gravity={[0, -30, 0]}>
            <Ground />
            <Player 
              position={[0, 5, 0]} 
              joystick={joystick} 
              onPositionChange={setPosition}
            />
          </Physics>
        </Suspense>
        
        <OrbitControls 
          enablePan={false}
          minDistance={10}
          maxDistance={50}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>

      <div className="absolute top-4 left-4 bg-black/70 text-white p-4 rounded-lg backdrop-blur-sm">
        <h1 className="text-2xl font-bold mb-2">Сызрань 3D</h1>
        <p className="text-sm">WASD - движение</p>
        <p className="text-sm">Пробел - прыжок</p>
        <p className="text-sm opacity-60">X: {position[0].toFixed(1)} Z: {position[2].toFixed(1)}</p>
      </div>

      {joystick.active && (
        <div className="fixed bottom-8 left-8 w-32 h-32 bg-gray-800/50 rounded-full flex items-center justify-center">
          <div 
            className="w-12 h-12 bg-white rounded-full transition-transform"
            style={{
              transform: `translate(${joystick.x * 40}px, ${-joystick.y * 40}px)`
            }}
          />
        </div>
      )}
    </div>
  );
}
