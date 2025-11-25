import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
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
  
  const frameSkipRef = useRef(0);
  
  useFrame(() => {
    if (!playerRef.current) return;
    
    frameSkipRef.current++;
    if (frameSkipRef.current % 3 !== 0) return;
    
    let newVelX = 0;
    let newVelZ = 0;
    
    if (keysRef.current['w'] || keysRef.current['ц']) newVelZ -= speed;
    if (keysRef.current['s'] || keysRef.current['ы']) newVelZ += speed;
    if (keysRef.current['a'] || keysRef.current['ф']) newVelX -= speed;
    if (keysRef.current['d'] || keysRef.current['в']) newVelX += speed;
    
    newVelX += joystick.x * speed;
    newVelZ += joystick.z * speed;
    
    playerRef.current.position.x += newVelX * 2;
    playerRef.current.position.z += newVelZ * 2;
    
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
