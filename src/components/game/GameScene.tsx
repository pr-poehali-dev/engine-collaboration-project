import { Sky, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Clouds, 
  Birds, 
  Bridge, 
  CarsOnBridge, 
  Church, 
  Building, 
  Player,
  AmbientSound
} from './GameObjects';
import { 
  ProceduralTerrain, 
  RiverValley, 
  ProceduralVegetation, 
  Rocks 
} from './TerrainGenerator';
import type { JoystickState } from './GameControls';

export function Scene({ joystick, onPlayerMove }: { joystick: JoystickState, onPlayerMove: (pos: [number, number, number]) => void }) {
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
      
      <fog attach="fog" args={['#87ceeb', 50, 250]} />
      
      <ProceduralTerrain />
      <RiverValley />
      <Clouds />
      <Birds />
      
      <Bridge position={[0, 0, -30]} rotation={[0, 0, 0]} />
      <Bridge position={[0, 0, 30]} rotation={[0, Math.PI / 6, 0]} />
      
      <CarsOnBridge />
      
      <Church position={[25, 4, -40]} />
      
      <Building 
        position={[-30, 5, -50]} 
        size={[8, 15, 8]} 
        color="#e5e7eb"
        textureUrl="https://cdn.poehali.dev/files/f13c35c5-5656-433c-9c5e-0c50f6dd4b72.jpeg"
      />
      <Building position={[-45, 4, -45]} size={[6, 12, 6]} color="#f3f4f6" />
      <Building 
        position={[40, 6, 50]} 
        size={[10, 20, 10]} 
        color="#d1d5db"
        textureUrl="https://cdn.poehali.dev/files/b4af7ac0-96e9-4ae1-9fc2-0e3f8b4f10f8.jpeg"
      />
      <Building position={[50, 5, 35]} size={[7, 18, 7]} color="#e5e7eb" />
      <Building position={[-50, 5, 40]} size={[9, 16, 9]} color="#f3f4f6" />
      
      <ProceduralVegetation />
      <Rocks />
      
      <Player position={[0, 8, 50]} joystick={joystick} onPositionChange={onPlayerMove} />
      
      <AmbientSound />
      
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
    </>
  );
}