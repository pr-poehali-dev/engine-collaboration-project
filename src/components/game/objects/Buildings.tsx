import { useEffect, useMemo } from 'react';
import { useTexture, Instances, Instance } from '@react-three/drei';

export function Building({ position, size, color, textureUrl }: { 
  position: [number, number, number], 
  size: [number, number, number],
  color: string,
  textureUrl?: string
}) {
  let texture = null;
  let doorTexture = null;
  try {
    texture = textureUrl ? useTexture(textureUrl) : null;
    doorTexture = useTexture('https://cdn.poehali.dev/projects/1dd9ac1a-e0e4-4079-ba92-59a736b6e43e/files/f45b2452-b0df-4f50-968d-b706a34933c0.jpg');
  } catch (e) {
    texture = null;
    doorTexture = null;
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
      
      <mesh position={[0, 1.5, size[2] / 2 + 0.05]} castShadow>
        <boxGeometry args={[1.2, 2.5, 0.2]} />
        <meshStandardMaterial 
          map={doorTexture || undefined}
          color={doorTexture ? '#ffffff' : '#6b4423'} 
        />
      </mesh>
      
      {[-size[0] / 4, size[0] / 4].map((x, i) => (
        <mesh key={`window-${i}`} position={[x, size[1] * 0.6, size[2] / 2 + 0.05]} castShadow>
          <boxGeometry args={[0.8, 1, 0.15]} />
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} />
        </mesh>
      ))}
      
      <mesh position={[size[0] / 2 + 0.6, size[1] * 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.1, size[2] * 0.4]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>
      
      {[size[2] * 0.2, -size[2] * 0.2].map((z, i) => (
        <mesh key={`balcony-rail-${i}`} position={[size[0] / 2 + 0.6, size[1] * 0.7 + 0.5, z]} castShadow>
          <boxGeometry args={[0.1, 1, 0.1]} />
          <meshStandardMaterial color="#4b5563" />
        </mesh>
      ))}
      <mesh position={[size[0] / 2 + 0.6, size[1] * 0.7 + 1, 0]} castShadow>
        <boxGeometry args={[0.12, 0.12, size[2] * 0.4]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>
      
      {Array.from({ length: 5 }).map((_, i) => {
        const stepHeight = 0.3 * i;
        return (
          <mesh key={`step-${i}`} position={[0, stepHeight, size[2] / 2 + 0.8 + i * 0.25]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.15, 0.3]} />
            <meshStandardMaterial color="#6b7280" />
          </mesh>
        );
      })}
    </group>
  );
}

export function Church({ position }: { position: [number, number, number] }) {
  let texture = null;
  let gateTexture = null;
  try {
    texture = useTexture('https://cdn.poehali.dev/files/5e3ce736-91c3-4bc0-a772-218476e56221.jpeg');
    gateTexture = useTexture('https://cdn.poehali.dev/projects/1dd9ac1a-e0e4-4079-ba92-59a736b6e43e/files/a8e864b1-3b4d-4e6e-bdd1-afc0a264ecea.jpg');
  } catch (e) {
    texture = null;
    gateTexture = null;
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
      
      <mesh position={[-1.8, 2.5, 8.1]} castShadow>
        <boxGeometry args={[2, 4.5, 0.3]} />
        <meshStandardMaterial 
          map={gateTexture || undefined}
          color={gateTexture ? '#ffffff' : '#8b4513'} 
        />
      </mesh>
      <mesh position={[1.8, 2.5, 8.1]} castShadow>
        <boxGeometry args={[2, 4.5, 0.3]} />
        <meshStandardMaterial 
          map={gateTexture || undefined}
          color={gateTexture ? '#ffffff' : '#8b4513'} 
        />
      </mesh>
      
      <mesh position={[0, 5.2, 8.1]} castShadow>
        <boxGeometry args={[4.5, 0.8, 0.3]} />
        <meshStandardMaterial 
          map={gateTexture || undefined}
          color={gateTexture ? '#ffffff' : '#8b4513'} 
        />
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
      
      <Instances castShadow>
        <boxGeometry args={[0.15, 3, 0.15]} />
        <meshStandardMaterial color="#1f2937" />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const radius = 10;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          return <Instance key={`fence-post-${i}`} position={[x, 1.5, z]} />;
        })}
      </Instances>
      
      <Instances castShadow>
        <sphereGeometry args={[0.2, 6, 6]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const radius = 10;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          return <Instance key={`fence-top-${i}`} position={[x, 3.2, z]} />;
        })}
      </Instances>
      
      <Instances castShadow>
        <boxGeometry args={[5.3, 0.1, 0.1]} />
        <meshStandardMaterial color="#1f2937" />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle1 = (i / 12) * Math.PI * 2;
          const angle2 = ((i + 1) / 12) * Math.PI * 2;
          const radius = 10;
          const x1 = Math.cos(angle1) * radius;
          const z1 = Math.sin(angle1) * radius;
          const x2 = Math.cos(angle2) * radius;
          const z2 = Math.sin(angle2) * radius;
          const midX = (x1 + x2) / 2;
          const midZ = (z1 + z2) / 2;
          const rotation = Math.atan2(z2 - z1, x2 - x1);
          return <Instance key={`fence-bar-${i}`} position={[midX, 1.5, midZ]} rotation={[0, rotation, 0]} />;
        })}
      </Instances>
      
      {[
        [-8, 0, 10],
        [8, 0, 10],
        [-8, 0, -8],
        [8, 0, -8]
      ].map((pos, i) => (
        <group key={`bench-${i}`} position={pos as [number, number, number]}>
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.5, 0.1, 0.8]} />
            <meshStandardMaterial color="#8b4513" />
          </mesh>
          
          <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.5, 0.1, 0.8]} />
            <meshStandardMaterial color="#8b4513" />
          </mesh>
          
          <mesh position={[0, 0.65, -0.35]} castShadow>
            <boxGeometry args={[2.5, 0.4, 0.1]} />
            <meshStandardMaterial color="#8b4513" />
          </mesh>
          
          {[-1, 1].map((x, j) => (
            <mesh key={j} position={[x, 0.25, 0]} castShadow>
              <boxGeometry args={[0.1, 0.5, 0.8]} />
              <meshStandardMaterial color="#4b5563" />
            </mesh>
          ))}
        </group>
      ))}
      
      <group position={[0, 1, -9]}>
        <mesh position={[0, 0, 0]} receiveShadow>
          <cylinderGeometry args={[1.2, 1.2, 0.3, 16]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.9, 0.9, 1, 16]} />
          <meshStandardMaterial color="#6b7280" />
        </mesh>
        
        <Instances>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
          <meshStandardMaterial color="#228b22" />
          {Array.from({ length: 8 }).map((_, j) => {
            const angle = (j / 8) * Math.PI * 2;
            const radius = 0.5;
            const flowerX = Math.cos(angle) * radius;
            const flowerZ = Math.sin(angle) * radius;
            return <Instance key={`stem-${j}`} position={[flowerX, 0.8, flowerZ]} />;
          })}
        </Instances>
        
        {['#ff1493', '#ff69b4', '#ffd700', '#ff4500', '#9370db'].map((color, colorIdx) => (
          <Instances key={`flower-color-${colorIdx}`}>
            <sphereGeometry args={[0.1, 6, 6]} />
            <meshStandardMaterial color={color} />
            {Array.from({ length: 2 }).map((_, j) => {
              const flowerIdx = colorIdx * 2 + j;
              if (flowerIdx >= 8) return null;
              const angle = (flowerIdx / 8) * Math.PI * 2;
              const radius = 0.5;
              const flowerX = Math.cos(angle) * radius;
              const flowerZ = Math.sin(angle) * radius;
              return <Instance key={`petal-${j}`} position={[flowerX, 1.15, flowerZ]} />;
            })}
          </Instances>
        ))}
      </group>
    </group>
  );
}

export function StreetLamps() {
  const lampPositions: [number, number, number][] = [
    [15, 0, 20], [-15, 0, 20], [15, 0, 40], [-15, 0, 40],
    [15, 0, -20], [-15, 0, -20], [15, 0, -40], [-15, 0, -40]
  ];
  
  return (
    <>
      <Instances castShadow>
        <cylinderGeometry args={[0.15, 0.15, 6, 6]} />
        <meshStandardMaterial color="#2d3748" />
        {lampPositions.map((pos, i) => (
          <Instance key={`pole-${i}`} position={[pos[0], 3, pos[2]]} />
        ))}
      </Instances>
      
      <Instances castShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#1a202c" />
        {lampPositions.map((pos, i) => (
          <Instance key={`box-${i}`} position={[pos[0], 6.5, pos[2]]} />
        ))}
      </Instances>
      
      <Instances>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#fff4d6" emissive="#ffd700" emissiveIntensity={1} />
        {lampPositions.map((pos, i) => (
          <Instance key={`light-${i}`} position={[pos[0], 6.5, pos[2]]} />
        ))}
      </Instances>
      
      {lampPositions.slice(0, 4).map((pos, i) => (
        <pointLight key={`pl-${i}`} position={[pos[0], 6.5, pos[2]]} intensity={80} distance={25} color="#ffd700" />
      ))}
    </>
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
    [-70, 2, -60], [-75, 2, -65], [-65, 2, -55], [-80, 2, -70]
  ] as [number, number, number][], []);
  
  return (
    <>
      <Instances castShadow>
        <cylinderGeometry args={[0.3, 0.4, 4, 6]} />
        <meshStandardMaterial color="#78350f" />
        {positions.map((pos, i) => (
          <Instance key={`trunk-${i}`} position={[pos[0], pos[1] + 2, pos[2]]} />
        ))}
      </Instances>
      
      <Instances castShadow>
        <coneGeometry args={[2, 4, 6]} />
        <meshStandardMaterial color="#15803d" />
        {positions.map((pos, i) => (
          <Instance key={`crown-${i}`} position={[pos[0], pos[1] + 5, pos[2]]} />
        ))}
      </Instances>
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
