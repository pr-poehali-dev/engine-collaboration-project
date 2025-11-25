import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

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
  const mainRoadLane1 = useRef<THREE.Group>(null);
  const mainRoadLane2 = useRef<THREE.Group>(null);
  const crossRoadLane1 = useRef<THREE.Group>(null);
  const crossRoadLane2 = useRef<THREE.Group>(null);
  const bridge1Lane1 = useRef<THREE.Group>(null);
  const bridge2Lane1 = useRef<THREE.Group>(null);
  const carFrameSkip = useRef(0);
  
  useFrame(() => {
    carFrameSkip.current++;
    if (carFrameSkip.current % 3 !== 0) return;
    
    if (mainRoadLane1.current) {
      mainRoadLane1.current.children.forEach((car) => {
        car.position.z += 0.35;
        if (car.position.z > 50) {
          car.position.z = -50;
        }
      });
    }
    
    if (mainRoadLane2.current) {
      mainRoadLane2.current.children.forEach((car) => {
        car.position.z -= 0.3;
        if (car.position.z < -50) {
          car.position.z = 50;
        }
      });
    }
    
    if (crossRoadLane1.current) {
      crossRoadLane1.current.children.forEach((car) => {
        car.position.x += 0.32;
        if (car.position.x > 25) {
          car.position.x = -25;
        }
      });
    }
    
    if (crossRoadLane2.current) {
      crossRoadLane2.current.children.forEach((car) => {
        car.position.x -= 0.28;
        if (car.position.x < -25) {
          car.position.x = 25;
        }
      });
    }
    
    if (bridge1Lane1.current) {
      bridge1Lane1.current.children.forEach((car) => {
        car.position.z += 0.3;
        if (car.position.z > -10) {
          car.position.z = -70;
        }
      });
    }
    
    if (bridge2Lane1.current) {
      bridge2Lane1.current.children.forEach((car) => {
        const angle = Math.PI / 6;
        const speed = 0.32;
        car.position.x += Math.sin(angle) * speed;
        car.position.z += Math.cos(angle) * speed;
        
        if (car.position.z > 65) {
          car.position.z = 5;
          car.position.x = -12;
        }
      });
    }
  });
  
  return (
    <>
      <group ref={mainRoadLane1}>
        <Car position={[-2, 2.8, -25]} rotation={[0, 0, 0]} color="#ef4444" />
        <Car position={[-2, 2.8, 10]} rotation={[0, 0, 0]} color="#8b5cf6" />
      </group>
      
      <group ref={mainRoadLane2}>
        <Car position={[2, 2.8, 20]} rotation={[0, Math.PI, 0]} color="#3b82f6" />
        <Car position={[2, 2.8, -15]} rotation={[0, Math.PI, 0]} color="#ec4899" />
      </group>
      
      <group ref={crossRoadLane1}>
        <Car position={[-10, 3, 2]} rotation={[0, Math.PI / 2, 0]} color="#22c55e" />
      </group>
      
      <group ref={crossRoadLane2}>
        <Car position={[15, 3.3, -2]} rotation={[0, -Math.PI / 2, 0]} color="#f59e0b" />
      </group>
      
      <group ref={bridge1Lane1}>
        <Car position={[-2, 5, -45]} rotation={[0, 0, 0]} color="#ef4444" />
      </group>
      
      <group ref={bridge2Lane1}>
        <Car position={[-10, 6.5, 20]} rotation={[0, Math.PI / 6, 0]} color="#fbbf24" />
      </group>
    </>
  );
}

export function Bridge({ position, rotation, height = 5, length = 50 }: { 
  position: [number, number, number], 
  rotation: [number, number, number],
  height?: number,
  length?: number
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, height, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, 0.5, 8]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {Array.from({ length: Math.floor(length / 20) + 1 }).map((_, i) => {
        const x = -length/2 + i * 20;
        return (
          <group key={i} position={[x, 0, 0]}>
            <mesh position={[0, 0, -3]} castShadow>
              <cylinderGeometry args={[0.5, 0.5, height * 2, 6]} />
              <meshStandardMaterial color="#6b7280" metalness={0.7} />
            </mesh>
            <mesh position={[0, 0, 3]} castShadow>
              <cylinderGeometry args={[0.5, 0.5, height * 2, 6]} />
              <meshStandardMaterial color="#6b7280" metalness={0.7} />
            </mesh>
            
            <mesh position={[0, height + 1.5, -3]}>
              <boxGeometry args={[1, 3, 0.2]} />
              <meshStandardMaterial color="#d1d5db" />
            </mesh>
            <mesh position={[0, height + 1.5, 3]}>
              <boxGeometry args={[1, 3, 0.2]} />
              <meshStandardMaterial color="#d1d5db" />
            </mesh>
          </group>
        );
      })}
      
      {[-3, 3].map((z, i) => (
        <mesh key={i} position={[0, height + 0.2, z]} castShadow>
          <boxGeometry args={[length, 0.3, 0.2]} />
          <meshStandardMaterial color="#4b5563" />
        </mesh>
      ))}
    </group>
  );
}

export function RoadNetwork() {
  const roadTexture = useTexture('https://cdn.poehali.dev/files/5e3ce736-91c3-4bc0-a772-218476e56221.jpeg');
  if (roadTexture) {
    roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping;
    roadTexture.repeat.set(4, 30);
  }

  return (
    <group>
      <mesh position={[0, 2.8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 100]} />
        <meshStandardMaterial 
          map={roadTexture}
          roughness={0.8} 
          metalness={0.1}
        />
      </mesh>

      <mesh position={[0, 3.2, -50]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 20]} />
        <meshStandardMaterial 
          map={roadTexture}
          roughness={0.8} 
          metalness={0.1}
        />
      </mesh>

      <mesh position={[0, 3.5, 50]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 20]} />
        <meshStandardMaterial 
          map={roadTexture}
          roughness={0.8} 
          metalness={0.1}
        />
      </mesh>

      <mesh position={[-25, 3, 0]} rotation={[-Math.PI / 2, 0, Math.PI/2]} receiveShadow>
        <planeGeometry args={[8, 50]} />
        <meshStandardMaterial 
          map={roadTexture}
          roughness={0.8} 
          metalness={0.1}
        />
      </mesh>

      <mesh position={[25, 3.3, 0]} rotation={[-Math.PI / 2, 0, Math.PI/2]} receiveShadow>
        <planeGeometry args={[8, 50]} />
        <meshStandardMaterial 
          map={roadTexture}
          roughness={0.8} 
          metalness={0.1}
        />
      </mesh>

      {Array.from({ length: 25 }).map((_, i) => {
        const z = -48 + i * 4;
        return (
          <mesh key={`line-main-${i}`} position={[0, 2.85, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.15, 2.5]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        );
      })}

      {Array.from({ length: 13 }).map((_, i) => {
        const x = -24 + i * 4;
        return (
          <mesh key={`line-cross-${i}`} position={[x, 3.05, 0]} rotation={[-Math.PI / 2, 0, Math.PI/2]}>
            <planeGeometry args={[0.15, 2.5]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        );
      })}

      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`zebra-main-${i}`} position={[-3 + i * 1.5, 2.82, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1, 6]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}

      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`zebra-cross-${i}`} position={[0, 3.02, -3 + i * 1.5]} rotation={[-Math.PI / 2, 0, Math.PI/2]}>
          <planeGeometry args={[1, 6]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}
