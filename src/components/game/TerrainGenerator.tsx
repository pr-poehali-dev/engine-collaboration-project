import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';

function generateHeightMap(width: number, depth: number, riverZ: number): Float32Array {
  const size = width * depth;
  const data = new Float32Array(size);
  
  for (let i = 0; i < depth; i++) {
    for (let j = 0; j < width; j++) {
      const x = (j - width / 2) * 2;
      const z = (i - depth / 2) * 2;
      
      const distanceFromRiver = Math.abs(x);
      
      let height = 0;
      
      if (distanceFromRiver < 18) {
        height = -2.5 + (distanceFromRiver / 18) * 4.5;
      } else {
        const noise1 = Math.sin(x * 0.03) * Math.cos(z * 0.03) * 2;
        const noise2 = Math.sin(x * 0.08 + z * 0.08) * 1.5;
        
        height = 2 + noise1 + noise2;
        
        if (z < -40) {
          height += 1.5;
        }
        
        if (z > 40) {
          height += 2;
        }
        
        if (x < -40 || x > 40) {
          height += 1;
        }
      }
      
      data[i * width + j] = height;
    }
  }
  
  return data;
}

export function ProceduralTerrain() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => {
    const width = 100;
    const depth = 100;
    const heightData = generateHeightMap(width, depth, 0);
    
    const geo = new THREE.PlaneGeometry(200, 200, width - 1, depth - 1);
    const vertices = geo.attributes.position.array;
    
    for (let i = 0; i < vertices.length / 3; i++) {
      vertices[i * 3 + 2] = heightData[i];
    }
    
    geo.computeVertexNormals();
    geo.attributes.position.needsUpdate = true;
    
    return geo;
  }, []);
  
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const noise = Math.random();
        const green = Math.floor(100 + noise * 80);
        const red = Math.floor(40 + noise * 30);
        const blue = Math.floor(20 + noise * 20);
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    
    return tex;
  }, []);
  
  return (
    <mesh 
      ref={meshRef} 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, 0, 0]} 
      receiveShadow
    >
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial 
        map={texture || undefined}
        color="#4ade80"
        roughness={0.9}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function RiverValley() {
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
      
      const wave1 = Math.sin(x * 0.4 + time * 1.5) * 0.15;
      const wave2 = Math.sin(y * 0.25 + time * 1.2) * 0.12;
      const wave3 = Math.cos(x * 0.2 + y * 0.2 + time * 0.8) * 0.08;
      
      positionAttribute.setZ(i, wave1 + wave2 + wave3);
    }
    
    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();
  });
  
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[35, 200, 50, 80]} />
      <meshStandardMaterial 
        ref={materialRef}
        color="#2563eb" 
        transparent 
        opacity={0.75}
        roughness={0.15}
        metalness={0.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function ProceduralVegetation() {
  const trees = useMemo(() => {
    const treePositions: Array<[number, number, number, number]> = [];
    const heightData = generateHeightMap(100, 100, 0);
    
    for (let i = -50; i < 50; i += 6) {
      if (Math.abs(i) < 2) continue;
      treePositions.push([12, 2.8, i, 0.9]);
      treePositions.push([-12, 2.8, i, 0.9]);
    }
    
    for (let i = -25; i < 25; i += 6) {
      if (Math.abs(i) < 2) continue;
      treePositions.push([i, 3, 8, 0.85]);
      treePositions.push([i, 3, -8, 0.85]);
    }
    
    for (let i = 0; i < 60; i++) {
      const x = (Math.random() - 0.5) * 180;
      const z = (Math.random() - 0.5) * 180;
      
      if (Math.abs(x) < 20 || (Math.abs(z) < 12 && Math.abs(x) < 30)) continue;
      
      const gridX = Math.floor((x + 100) / 2);
      const gridZ = Math.floor((z + 100) / 2);
      const index = gridZ * 100 + gridX;
      const height = heightData[index] || 2;
      
      const scale = 0.7 + Math.random() * 0.5;
      
      treePositions.push([x, height, z, scale]);
    }
    
    return treePositions;
  }, []);
  
  return (
    <>
      <Instances limit={150} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 4, 6]} />
        <meshStandardMaterial color="#78350f" />
        {trees.map((pos, i) => (
          <Instance key={`trunk-${i}`} position={[pos[0], pos[1] + 2 * pos[3], pos[2]]} scale={pos[3]} />
        ))}
      </Instances>
      
      <Instances limit={150} castShadow>
        <coneGeometry args={[2, 4, 6]} />
        <meshStandardMaterial color="#15803d" />
        {trees.map((pos, i) => (
          <Instance key={`crown1-${i}`} position={[pos[0], pos[1] + 5 * pos[3], pos[2]]} scale={pos[3]} />
        ))}
      </Instances>
      
      <Instances limit={150} castShadow>
        <coneGeometry args={[1.5, 3, 6]} />
        <meshStandardMaterial color="#166534" />
        {trees.map((pos, i) => (
          <Instance key={`crown2-${i}`} position={[pos[0], pos[1] + 6.5 * pos[3], pos[2]]} scale={pos[3]} />
        ))}
      </Instances>
    </>
  );
}

export function Rocks() {
  const rocks = useMemo(() => {
    const rockPositions: Array<[number, number, number, number, number, number, number]> = [];
    const heightData = generateHeightMap(100, 100, 0);
    
    for (let i = 0; i < 20; i++) {
      const x = (Math.random() - 0.5) * 160;
      const z = (Math.random() - 0.5) * 160;
      
      if (Math.abs(x) < 30) continue;
      
      const gridX = Math.floor((x + 100) / 2);
      const gridZ = Math.floor((z + 100) / 2);
      const index = gridZ * 100 + gridX;
      const height = heightData[index] || 2;
      
      if (height > 4) {
        const scale = 0.5 + Math.random() * 1.5;
        const rx = Math.random() * 0.3;
        const ry = Math.random() * Math.PI * 2;
        const rz = Math.random() * 0.3;
        rockPositions.push([x, height, z, scale, rx, ry, rz]);
      }
    }
    
    return rockPositions;
  }, []);
  
  return (
    <>
      <Instances limit={20} castShadow>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial 
          color="#78716c" 
          roughness={0.9}
          metalness={0.1}
        />
        {rocks.map((pos, i) => (
          <Instance 
            key={i} 
            position={[pos[0], pos[1] + pos[3] * 0.5, pos[2]]} 
            scale={pos[3]}
            rotation={[pos[4], pos[5], pos[6]]}
          />
        ))}
      </Instances>
    </>
  );
}