import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface JoystickState {
  x: number;
  z: number;
}

function Player({ position, joystick, onPositionChange }: { 
  position: [number, number, number], 
  joystick: JoystickState,
  onPositionChange: (pos: [number, number, number]) => void 
}) {
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
    
    onPositionChange([
      playerRef.current.position.x,
      playerRef.current.position.y,
      playerRef.current.position.z
    ]);
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
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 2, 0]} receiveShadow>
        <planeGeometry args={[200, 200, 50, 50]} />
        <meshStandardMaterial 
          color="#4ade80" 
          side={THREE.DoubleSide}
        />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <planeGeometry args={[40, 200]} />
        <meshStandardMaterial 
          color="#8b7355" 
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

function AnimatedRiver() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const geometry = meshRef.current.geometry as THREE.PlaneGeometry;
    const positionAttribute = geometry.getAttribute('position');
    
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      
      const wave1 = Math.sin(x * 0.5 + time * 2) * 0.15;
      const wave2 = Math.sin(y * 0.3 + time * 1.5) * 0.1;
      const wave3 = Math.cos(x * 0.3 + y * 0.3 + time) * 0.08;
      
      positionAttribute.setZ(i, wave1 + wave2 + wave3);
    }
    
    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();
  });
  
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[40, 200, 100, 100]} />
      <meshStandardMaterial 
        ref={materialRef}
        color="#2563eb" 
        transparent 
        opacity={0.7}
        roughness={0.05}
        metalness={0.9}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Clouds() {
  const cloudsRef = useRef<THREE.Group>(null);
  const cloudPositions: [number, number, number][] = [
    [30, 40, -50],
    [-40, 45, -30],
    [50, 42, 20],
    [-30, 38, 50],
    [20, 44, -70]
  ];
  
  useFrame((state) => {
    if (!cloudsRef.current) return;
    
    cloudsRef.current.children.forEach((cloud, i) => {
      cloud.position.x += 0.02;
      
      if (cloud.position.x > 100) {
        cloud.position.x = -100;
      }
    });
  });
  
  return (
    <group ref={cloudsRef}>
      {cloudPositions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[4, 16, 16]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.8} />
          </mesh>
          <mesh position={[3, 0, 1]}>
            <sphereGeometry args={[3, 16, 16]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.8} />
          </mesh>
          <mesh position={[-3, 0, 0]}>
            <sphereGeometry args={[3.5, 16, 16]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Birds() {
  const birdsRef = useRef<THREE.Group>(null);
  const birdData = useRef<Array<{ angle: number, radius: number, speed: number, height: number }>>([]);
  
  useEffect(() => {
    birdData.current = Array.from({ length: 8 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 20 + Math.random() * 30,
      speed: 0.3 + Math.random() * 0.4,
      height: 15 + Math.random() * 10
    }));
  }, []);
  
  useFrame((state) => {
    if (!birdsRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    birdsRef.current.children.forEach((bird, i) => {
      const data = birdData.current[i];
      if (!data) return;
      
      data.angle += 0.01 * data.speed;
      
      bird.position.x = Math.cos(data.angle) * data.radius;
      bird.position.z = Math.sin(data.angle) * data.radius;
      bird.position.y = data.height + Math.sin(time * 2 + i) * 0.5;
      
      bird.rotation.y = data.angle + Math.PI / 2;
    });
  });
  
  return (
    <group ref={birdsRef}>
      {Array.from({ length: 8 }).map((_, i) => (
        <group key={i}>
          <mesh>
            <boxGeometry args={[0.3, 0.2, 0.8]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
          <mesh position={[-0.4, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
            <boxGeometry args={[0.8, 0.05, 0.4]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
          <mesh position={[0.4, 0, 0]} rotation={[0, 0, -Math.PI / 6]}>
            <boxGeometry args={[0.8, 0.05, 0.4]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Car({ position, rotation, color }: { 
  position: [number, number, number], 
  rotation: [number, number, number],
  color: string 
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.8, 0.8, 4]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.2, 0.5]} castShadow>
        <boxGeometry args={[1.6, 0.8, 1.8]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      
      <mesh position={[0, 1.2, 1.8]} castShadow>
        <boxGeometry args={[1.5, 0.7, 0.1]} />
        <meshStandardMaterial color="#60a5fa" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 1.2, -0.7]} castShadow>
        <boxGeometry args={[1.5, 0.7, 0.1]} />
        <meshStandardMaterial color="#60a5fa" transparent opacity={0.6} />
      </mesh>
      
      {[
        [-0.8, 0.3, 1.3],
        [0.8, 0.3, 1.3],
        [-0.8, 0.3, -1.3],
        [0.8, 0.3, -1.3]
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      ))}
    </group>
  );
}

function CarsOnBridge() {
  const carsRef = useRef<THREE.Group>(null);
  
  const cars = [
    { id: 1, startZ: -40, color: '#ef4444', speed: 0.15, bridge: 1 },
    { id: 2, startZ: -25, color: '#3b82f6', speed: 0.12, bridge: 1 },
    { id: 3, startZ: 40, color: '#22c55e', speed: -0.13, reverse: true, bridge: 2 },
    { id: 4, startZ: 25, color: '#fbbf24', speed: -0.14, reverse: true, bridge: 2 }
  ];
  
  useFrame(() => {
    if (!carsRef.current) return;
    
    carsRef.current.children.forEach((car, i) => {
      const carData = cars[i];
      car.position.z += carData.speed;
      
      if (carData.bridge === 1) {
        if (carData.speed > 0 && car.position.z > -5) {
          car.position.z = -55;
        } else if (carData.speed < 0 && car.position.z < -55) {
          car.position.z = -5;
        }
      } else {
        if (carData.speed > 0 && car.position.z > 55) {
          car.position.z = 5;
        } else if (carData.speed < 0 && car.position.z < 5) {
          car.position.z = 55;
        }
      }
    });
  });
  
  return (
    <group ref={carsRef}>
      {cars.map((car, i) => (
        <Car 
          key={car.id}
          position={[-3, 4.8, car.startZ]} 
          rotation={car.reverse ? [0, Math.PI, 0] : [0, 0, 0]}
          color={car.color}
        />
      ))}
    </group>
  );
}

function Bridge({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 4, 0]} castShadow receiveShadow>
        <boxGeometry args={[50, 0.5, 8]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {[-20, -10, 0, 10, 20].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, 0, -3]} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 8, 8]} />
            <meshStandardMaterial color="#6b7280" metalness={0.7} />
          </mesh>
          <mesh position={[0, 0, 3]} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 8, 8]} />
            <meshStandardMaterial color="#6b7280" metalness={0.7} />
          </mesh>
          
          <mesh position={[0, 5.5, -3]}>
            <boxGeometry args={[1, 3, 0.2]} />
            <meshStandardMaterial color="#d1d5db" />
          </mesh>
          <mesh position={[0, 5.5, 3]}>
            <boxGeometry args={[1, 3, 0.2]} />
            <meshStandardMaterial color="#d1d5db" />
          </mesh>
        </group>
      ))}
      
      {[-3, 3].map((z, i) => (
        <mesh key={i} position={[0, 4.2, z]} castShadow>
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
        <meshStandardMaterial 
          color={color} 
          roughness={0.7} 
          metalness={0.3} 
        />
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
  const positions: [number, number, number][] = [
    [50, 2, 80], [55, 2, 85], [45, 2, 90], [60, 2, 75],
    [-50, 2, 80], [-55, 2, 85], [-45, 2, 90], [-60, 2, 75],
    [50, 2, -80], [55, 2, -85], [45, 2, -90], [60, 2, -75],
    [-50, 2, -80], [-55, 2, -85], [-45, 2, -90], [-60, 2, -75],
    [70, 2, 60], [75, 2, 65], [65, 2, 55], [80, 2, 70],
    [-70, 2, 60], [-75, 2, 65], [-65, 2, 55], [-80, 2, 70],
    [70, 2, -60], [75, 2, -65], [65, 2, -55], [80, 2, -70],
    [-70, 2, -60], [-75, 2, -65], [-65, 2, -55], [-80, 2, -70],
    [40, 2, 95], [42, 2, 92], [38, 2, 88], [35, 2, 85],
    [-40, 2, 95], [-42, 2, 92], [-38, 2, 88], [-35, 2, 85],
    [40, 2, -95], [42, 2, -92], [38, 2, -88], [35, 2, -85],
    [-40, 2, -95], [-42, 2, -92], [-38, 2, -88], [-35, 2, -85]
  ];
  
  for (let i = 0; i < 50; i++) {
    let x, z;
    let valid = false;
    
    while (!valid) {
      x = (Math.random() - 0.5) * 160;
      z = (Math.random() - 0.5) * 160;
      
      if (Math.abs(x) > 25) {
        valid = true;
        for (const pos of positions) {
          const dx = pos[0] - x;
          const dz = pos[2] - z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < 5) {
            valid = false;
            break;
          }
        }
      }
    }
    
    if (valid) {
      positions.push([x, 2, z]);
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

function AmbientSound() {
  useEffect(() => {
    const audio = new Audio();
    audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w==';
    audio.loop = true;
    audio.volume = 0.3;
    audio.play().catch(() => {});
    
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);
  
  return null;
}

function Scene({ joystick, onPlayerMove }: { joystick: JoystickState, onPlayerMove: (pos: [number, number, number]) => void }) {
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
      <AnimatedRiver />
      <Clouds />
      <Birds />
      
      <Bridge position={[0, 0, -30]} rotation={[0, 0, 0]} />
      <Bridge position={[0, 0, 30]} rotation={[0, Math.PI / 6, 0]} />
      
      <CarsOnBridge />
      
      <Church position={[25, 2, -40]} />
      
      <Building 
        position={[-30, 2, -50]} 
        size={[8, 15, 8]} 
        color="#e5e7eb"
      />
      <Building position={[-45, 2, -45]} size={[6, 12, 6]} color="#f3f4f6" />
      <Building 
        position={[40, 2, 50]} 
        size={[10, 20, 10]} 
        color="#d1d5db"
      />
      <Building position={[50, 2, 35]} size={[7, 18, 7]} color="#e5e7eb" />
      <Building position={[-50, 2, 40]} size={[9, 16, 9]} color="#f3f4f6" />
      
      <Trees />
      
      <Player position={[0, 3.5, 50]} joystick={joystick} onPositionChange={onPlayerMove} />
      
      <AmbientSound />
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

function MiniMap({ playerPos }: { playerPos: [number, number, number] }) {
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
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <Suspense fallback={null}>
          <Scene joystick={joystick} onPlayerMove={setPlayerPos} />
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

      <MiniMap playerPos={playerPos} />

      {isMobile && (
        <VirtualJoystick 
          onMove={(x, z) => setJoystick({ x, z })} 
        />
      )}
    </div>
  );
}