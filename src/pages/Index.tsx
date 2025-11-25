import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface JoystickState {
  x: number;
  z: number;
}

function Player({ position, joystick }: { position: [number, number, number], joystick: JoystickState }) {
  const playerRef = useRef<THREE.Mesh>(null);
  const keysRef = useRef<Record<string, boolean>>({});
  const speed = 0.1;
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  useFrame(() => {
    if (!playerRef.current) return;
    
    let newVelX = 0;
    let newVelZ = 0;
    
    if (keysRef.current['w'] || keysRef.current['ц']) newVelZ -= speed;
    if (keysRef.current['s'] || keysRef.current['ы']) newVelZ += speed;
    if (keysRef.current['a'] || keysRef.current['ф']) newVelX -= speed;
    if (keysRef.current['d'] || keysRef.current['в']) newVelX += speed;
    
    newVelX += joystick.x * speed;
    newVelZ += joystick.z * speed;
    
    playerRef.current.position.x += newVelX;
    playerRef.current.position.z += newVelZ;
  });
  
  return (
    <mesh ref={playerRef} position={position} castShadow>
      <capsuleGeometry args={[0.5, 1, 4, 8]} />
      <meshStandardMaterial color="#3b82f6" />
    </mesh>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[200, 200, 50, 50]} />
      <meshStandardMaterial 
        color="#4ade80" 
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function River() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]} receiveShadow>
      <planeGeometry args={[40, 200]} />
      <meshStandardMaterial 
        color="#3b82f6" 
        transparent 
        opacity={0.6}
        roughness={0.1}
        metalness={0.8}
      />
    </mesh>
  );
}

function Bridge({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[50, 0.5, 8]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {[-20, -10, 0, 10, 20].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, 1, -3]} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 4, 8]} />
            <meshStandardMaterial color="#6b7280" metalness={0.7} />
          </mesh>
          <mesh position={[0, 1, 3]} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 4, 8]} />
            <meshStandardMaterial color="#6b7280" metalness={0.7} />
          </mesh>
          
          <mesh position={[0, 3.5, -3]}>
            <boxGeometry args={[1, 3, 0.2]} />
            <meshStandardMaterial color="#d1d5db" />
          </mesh>
          <mesh position={[0, 3.5, 3]}>
            <boxGeometry args={[1, 3, 0.2]} />
            <meshStandardMaterial color="#d1d5db" />
          </mesh>
        </group>
      ))}
      
      {[-3, 3].map((z, i) => (
        <mesh key={i} position={[0, 2.2, z]} castShadow>
          <boxGeometry args={[50, 0.3, 0.2]} />
          <meshStandardMaterial color="#4b5563" />
        </mesh>
      ))}
    </group>
  );
}

function Building({ position, size, color }: { 
  position: [number, number, number], 
  size: [number, number, number],
  color: string 
}) {
  return (
    <group position={position}>
      <mesh position={[0, size[1] / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.3} />
      </mesh>
      
      <mesh position={[0, size[1] + 1, 0]} castShadow>
        <coneGeometry args={[size[0] * 0.6, 2, 4]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
    </group>
  );
}

function Church({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 5, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 10, 8]} />
        <meshStandardMaterial color="#f3f4f6" />
      </mesh>
      
      <mesh position={[0, 12, 0]} castShadow>
        <coneGeometry args={[5, 4, 8]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.8} roughness={0.2} />
      </mesh>
      
      <mesh position={[0, 16, 0]} castShadow>
        <boxGeometry args={[1, 6, 1]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
      </mesh>
      
      <mesh position={[0, 19.5, 0]} castShadow>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

function Trees() {
  const positions: [number, number, number][] = [];
  
  for (let i = 0; i < 100; i++) {
    const x = (Math.random() - 0.5) * 180;
    const z = (Math.random() - 0.5) * 180;
    
    if (Math.abs(x) > 25 || Math.abs(z) < 80) {
      positions.push([x, 0, z]);
    }
  }
  
  return (
    <>
      {positions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh position={[0, 2, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.4, 4, 8]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0, 5, 0]} castShadow>
            <coneGeometry args={[2, 4, 8]} />
            <meshStandardMaterial color="#15803d" />
          </mesh>
        </group>
      ))}
    </>
  );
}

function Scene({ joystick }: { joystick: JoystickState }) {
  return (
    <>
      <Sky 
        distance={450000}
        sunPosition={[100, 20, 100]}
        inclination={0.6}
        azimuth={0.25}
      />
      
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[50, 50, 50]} 
        intensity={1.5} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />
      
      <fog attach="fog" args={['#87ceeb', 50, 200]} />
      
      <Ground />
      <River />
      
      <Bridge position={[0, 0, -30]} rotation={[0, 0, 0]} />
      <Bridge position={[0, 0, 30]} rotation={[0, Math.PI / 6, 0]} />
      
      <Church position={[25, 0, -40]} />
      
      <Building position={[-30, 0, -50]} size={[8, 15, 8]} color="#e5e7eb" />
      <Building position={[-45, 0, -45]} size={[6, 12, 6]} color="#f3f4f6" />
      <Building position={[40, 0, 50]} size={[10, 20, 10]} color="#d1d5db" />
      <Building position={[50, 0, 35]} size={[7, 18, 7]} color="#e5e7eb" />
      <Building position={[-50, 0, 40]} size={[9, 16, 9]} color="#f3f4f6" />
      
      <Trees />
      
      <Player position={[0, 1.5, 50]} joystick={joystick} />
    </>
  );
}

function VirtualJoystick({ onMove }: { onMove: (x: number, z: number) => void }) {
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

export default function Index() {
  const [joystick, setJoystick] = useState<JoystickState>({ x: 0, z: 0 });
  const [isMobile, setIsMobile] = useState(false);

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
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <Suspense fallback={null}>
          <Scene joystick={joystick} />
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2.1}
            minDistance={5}
            maxDistance={100}
            touches={{
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN
            }}
          />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
      
      <div className="absolute top-4 left-4 bg-black/70 text-white p-4 rounded-lg backdrop-blur-sm z-10">
        <h1 className="text-2xl font-bold mb-2">Сызрань 3D</h1>
        <p className="text-sm">
          {isMobile ? 'Джойстик внизу слева' : 'Управление: WASD'}
        </p>
        <p className="text-sm">Камера: {isMobile ? 'Свайп' : 'Мышь + колесо'}</p>
      </div>

      {isMobile && (
        <VirtualJoystick 
          onMove={(x, z) => setJoystick({ x, z })} 
        />
      )}
    </div>
  );
}
