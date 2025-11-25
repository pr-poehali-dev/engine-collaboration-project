import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Clouds() {
  const cloudsRef = useRef<THREE.Group>(null);
  const cloudPositions: [number, number, number][] = [
    [30, 40, -50],
    [-40, 45, -30],
    [50, 42, 20],
    [-30, 38, 50],
    [20, 44, -70]
  ];
  
  const cloudFrameSkip = useRef(0);
  const texturesPreloaded = useRef(false);
  
  if (!texturesPreloaded.current) {
    texturesPreloaded.current = true;
  }
  
  useFrame((state) => {
    if (!cloudsRef.current) return;
    
    cloudFrameSkip.current++;
    if (cloudFrameSkip.current % 3 !== 0) return;
    
    cloudsRef.current.children.forEach((cloud, i) => {
      cloud.position.x += 0.06;
      
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
            <sphereGeometry args={[4, 8, 8]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.8} />
          </mesh>
          <mesh position={[3, 0, 1]}>
            <sphereGeometry args={[3, 8, 8]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.8} />
          </mesh>
          <mesh position={[-3, 0, 0]}>
            <sphereGeometry args={[3.5, 8, 8]} />
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
    birdData.current = Array.from({ length: 5 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 20 + Math.random() * 30,
      speed: 0.3 + Math.random() * 0.4,
      height: 15 + Math.random() * 10
    }));
  }, []);
  
  const birdFrameSkip = useRef(0);
  
  useFrame((state) => {
    if (!birdsRef.current) return;
    
    birdFrameSkip.current++;
    if (birdFrameSkip.current % 4 !== 0) return;
    
    const time = state.clock.getElapsedTime();
    
    birdsRef.current.children.forEach((bird, i) => {
      const data = birdData.current[i];
      if (!data) return;
      
      data.angle += 0.02 * data.speed;
      
      bird.position.x = Math.cos(data.angle) * data.radius;
      bird.position.z = Math.sin(data.angle) * data.radius;
      bird.position.y = data.height + Math.sin(time * 2 + i) * 0.5;
      
      bird.rotation.y = data.angle + Math.PI / 2;
    });
  });
  
  return (
    <group ref={birdsRef}>
      {Array.from({ length: 5 }).map((_, i) => (
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
