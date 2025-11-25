import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky, Environment, useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';

function Player({ position }: { position: [number, number, number] }) {
  const playerRef = useRef<THREE.Mesh>(null);
  const [velocity, setVelocity] = useState({ x: 0, z: 0 });
  const speed = 0.1;
  
  useFrame(() => {
    if (!playerRef.current) return;
    
    const keys: Record<string, boolean> = {};
    
    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = true;
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    let newVelX = 0;
    let newVelZ = 0;
    
    if (keys['w'] || keys['ц']) newVelZ -= speed;
    if (keys['s'] || keys['ы']) newVelZ += speed;
    if (keys['a'] || keys['ф']) newVelX -= speed;
    if (keys['d'] || keys['в']) newVelX += speed;
    
    playerRef.current.position.x += newVelX;
    playerRef.current.position.z += newVelZ;
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
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
    <>
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
    </>
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

function Scene() {
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
      
      <Player position={[0, 1.5, 50]} />
    </>
  );
}

export default function Index() {
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
          <Scene />
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2.1}
            minDistance={5}
            maxDistance={100}
          />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
      
      <div className="absolute top-4 left-4 bg-black/70 text-white p-4 rounded-lg backdrop-blur-sm">
        <h1 className="text-2xl font-bold mb-2">Сызрань 3D</h1>
        <p className="text-sm">Управление: WASD или стрелки</p>
        <p className="text-sm">Камера: Мышь + колесо</p>
      </div>
    </div>
  );
}
