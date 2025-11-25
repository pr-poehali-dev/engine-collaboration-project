import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface JoystickState {
  x: number;
  z: number;
}

export function Player({ position, joystick, onPositionChange }: { 
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

export function Ground() {
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

export function AnimatedRiver() {
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

export function Clouds() {
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

export function Birds() {
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

export function CarsOnBridge() {
  const bridge1Lane1 = useRef<THREE.Group>(null);
  const bridge1Lane2 = useRef<THREE.Group>(null);
  const bridge2Lane1 = useRef<THREE.Group>(null);
  const bridge2Lane2 = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (bridge1Lane1.current) {
      bridge1Lane1.current.children.forEach((car) => {
        car.position.z += 0.15;
        if (car.position.z > -5) {
          car.position.z = -55;
          car.position.x = -2;
        }
      });
    }
    
    if (bridge1Lane2.current) {
      bridge1Lane2.current.children.forEach((car) => {
        car.position.z -= 0.12;
        if (car.position.z < -55) {
          car.position.z = -5;
          car.position.x = 2;
        }
      });
    }
    
    if (bridge2Lane1.current) {
      bridge2Lane1.current.children.forEach((car) => {
        const angle = Math.PI / 6;
        const speed = 0.15;
        car.position.x += Math.sin(angle) * speed;
        car.position.z += Math.cos(angle) * speed;
        
        if (car.position.z > 55) {
          car.position.z = 5;
          car.position.x = -10;
        }
      });
    }
    
    if (bridge2Lane2.current) {
      bridge2Lane2.current.children.forEach((car) => {
        const angle = Math.PI / 6;
        const speed = 0.13;
        car.position.x -= Math.sin(angle) * speed;
        car.position.z -= Math.cos(angle) * speed;
        
        if (car.position.z < 5) {
          car.position.z = 55;
          car.position.x = 10;
        }
      });
    }
  });
  
  return (
    <>
      <group ref={bridge1Lane1}>
        <Car position={[-2, 4.8, -40]} rotation={[0, 0, 0]} color="#ef4444" />
        <Car position={[-2, 4.8, -20]} rotation={[0, 0, 0]} color="#8b5cf6" />
      </group>
      
      <group ref={bridge1Lane2}>
        <Car position={[2, 4.8, -15]} rotation={[0, Math.PI, 0]} color="#3b82f6" />
        <Car position={[2, 4.8, -35]} rotation={[0, Math.PI, 0]} color="#ec4899" />
      </group>
      
      <group ref={bridge2Lane1}>
        <Car position={[-10, 4.8, 10]} rotation={[0, Math.PI / 6, 0]} color="#22c55e" />
        <Car position={[-5, 4.8, 30]} rotation={[0, Math.PI / 6, 0]} color="#f59e0b" />
      </group>
      
      <group ref={bridge2Lane2}>
        <Car position={[10, 4.8, 50]} rotation={[0, Math.PI + Math.PI / 6, 0]} color="#fbbf24" />
        <Car position={[5, 4.8, 30]} rotation={[0, Math.PI + Math.PI / 6, 0]} color="#06b6d4" />
      </group>
    </>
  );
}

export function Bridge({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
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

export function Building({ position, size, color, textureUrl }: { 
  position: [number, number, number], 
  size: [number, number, number],
  color: string,
  textureUrl?: string
}) {
  let texture = null;
  try {
    texture = textureUrl ? useTexture(textureUrl) : null;
  } catch (e) {
    texture = null;
  }
  
  return (
    <group position={position}>
      <mesh position={[0, size[1] / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial 
          map={texture || undefined}
          color={texture ? '#ffffff' : color} 
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

export function Church({ position }: { position: [number, number, number] }) {
  let texture = null;
  try {
    texture = useTexture('https://cdn.poehali.dev/files/5e3ce736-91c3-4bc0-a772-218476e56221.jpeg');
  } catch (e) {
    texture = null;
  }
  
  return (
    <group position={position}>
      <mesh position={[0, 4, 0]} castShadow receiveShadow>
        <boxGeometry args={[12, 8, 16]} />
        <meshStandardMaterial map={texture || undefined} color={texture ? '#ffffff' : '#f9fafb'} />
      </mesh>
      
      <mesh position={[-5, 5, 6]} castShadow receiveShadow>
        <boxGeometry args={[2, 10, 4]} />
        <meshStandardMaterial map={texture || undefined} color={texture ? '#ffffff' : '#f9fafb'} />
      </mesh>
      
      <mesh position={[-5, 11, 6]} castShadow>
        <coneGeometry args={[1.5, 3, 8]} />
        <meshStandardMaterial color="#60a5fa" metalness={0.6} roughness={0.3} />
      </mesh>
      
      <mesh position={[0, 9, 0]} castShadow>
        <boxGeometry args={[4, 3, 4]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      
      <mesh position={[0, 12, 0]} castShadow>
        <cylinderGeometry args={[2, 2.5, 4, 8]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      
      <mesh position={[0, 15.5, 0]} castShadow>
        <sphereGeometry args={[2.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#60a5fa" metalness={0.6} roughness={0.3} />
      </mesh>
      
      <mesh position={[0, 17, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 3, 8]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
      </mesh>
      
      <mesh position={[0, 19, 0]} castShadow>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
      </mesh>
      
      <mesh position={[0, 20.2, 0]} castShadow>
        <boxGeometry args={[1.2, 0.1, 0.1]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 20.2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[1.2, 0.1, 0.1]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
      </mesh>
      
      <mesh position={[0, 2, 7.5]} castShadow>
        <boxGeometry args={[3, 4, 0.5]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>
      
      {[-4, -2, 2, 4].map((x, i) => (
        <mesh key={i} position={[x, 5, 7.5]} castShadow>
          <boxGeometry args={[1.2, 2.5, 0.3]} />
          <meshStandardMaterial color="#93c5fd" transparent opacity={0.7} />
        </mesh>
      ))}
      
      <mesh position={[0, 0.3, 0]} receiveShadow>
        <boxGeometry args={[14, 0.5, 18]} />
        <meshStandardMaterial color="#d1d5db" />
      </mesh>
    </group>
  );
}

export function Trees() {
  const positions = useMemo(() => [
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
    [-40, 2, -95], [-42, 2, -92], [-38, 2, -88], [-35, 2, -85],
    [30, 2, 70], [32, 2, 75], [28, 2, 68], [35, 2, 72],
    [-30, 2, 70], [-32, 2, 75], [-28, 2, 68], [-35, 2, 72],
    [30, 2, -70], [32, 2, -75], [28, 2, -68], [35, 2, -72],
    [-30, 2, -70], [-32, 2, -75], [-28, 2, -68], [-35, 2, -72]
  ] as [number, number, number][], []);
  
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

export function AmbientSound() {
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