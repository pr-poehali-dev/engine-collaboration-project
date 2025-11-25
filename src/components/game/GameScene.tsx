import { Sky, OrbitControls, Environment, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Clouds, 
  Birds, 
  Bridge, 
  CarsOnBridge, 
  Church, 
  Building, 
  Player,
  AmbientSound,
  StreetLamps,
  RoadNetwork
} from './GameObjects';
import { 
  ProceduralTerrain, 
  RiverValley, 
  ProceduralVegetation, 
  Rocks 
} from './TerrainGenerator';
import type { JoystickState } from './GameControls';
import { useMemo, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

function TexturePreloader() {
  useTexture.preload('https://cdn.poehali.dev/files/5e3ce736-91c3-4bc0-a772-218476e56221.jpeg');
  useTexture.preload('https://cdn.poehali.dev/projects/1dd9ac1a-e0e4-4079-ba92-59a736b6e43e/files/a8e864b1-3b4d-4e6e-bdd1-afc0a264ecea.jpg');
  useTexture.preload('https://cdn.poehali.dev/projects/1dd9ac1a-e0e4-4079-ba92-59a736b6e43e/files/f45b2452-b0df-4f50-968d-b706a34933c0.jpg');
  useTexture.preload('https://cdn.poehali.dev/files/f13c35c5-5656-433c-9c5e-0c50f6dd4b72.jpeg');
  useTexture.preload('https://cdn.poehali.dev/files/b4af7ac0-96e9-4ae1-9fc2-0e3f8b4f10f8.jpeg');
  return null;
}

function RenderPipeline() {
  const { gl, scene, camera } = useThree();
  const frameCount = useRef(0);
  
  useEffect(() => {
    console.log('[Pipeline] Initializing render pipeline...');
    
    gl.autoClear = true;
    gl.autoClearColor = true;
    gl.autoClearDepth = true;
    gl.autoClearStencil = true;
    
    console.log('[Pipeline] Buffers configured:', {
      autoClear: gl.autoClear,
      sortObjects: gl.sortObjects
    });
  }, [gl]);
  
  useFrame(() => {
    frameCount.current++;
    
    if (frameCount.current % 60 === 0) {
      console.log('[Pipeline] Frame checkpoint:', {
        frame: frameCount.current,
        drawCalls: gl.info.render.calls,
        triangles: gl.info.render.triangles,
        textures: gl.info.memory.textures,
        geometries: gl.info.memory.geometries
      });
    }
    
    gl.clearColor();
    gl.clearDepth();
  });
  
  return null;
}

export function Scene({ joystick, onPlayerMove }: { joystick: JoystickState, onPlayerMove: (pos: [number, number, number]) => void }) {
  const frameSkip = useMemo(() => ({ count: 0 }), []);
  const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window);
  const { gl, camera } = useThree();
  
  useEffect(() => {
    console.log('[Scene] Scene mounted with camera:', {
      position: camera.position,
      fov: (camera as THREE.PerspectiveCamera).fov,
      near: camera.near,
      far: camera.far
    });
    
    if (gl.getContext()) {
      const glContext = gl.getContext() as WebGLRenderingContext;
      console.log('[Scene] WebGL capabilities:', {
        vendor: glContext.getParameter(glContext.VENDOR),
        renderer: glContext.getParameter(glContext.RENDERER),
        version: glContext.getParameter(glContext.VERSION),
        maxTextureSize: glContext.getParameter(glContext.MAX_TEXTURE_SIZE),
        maxVertexAttribs: glContext.getParameter(glContext.MAX_VERTEX_ATTRIBS)
      });
    }
  }, [gl, camera]);
  
  useFrame(() => {
    frameSkip.count++;
  });
  
  return (
    <>
      <TexturePreloader />
      <RenderPipeline />
      <color attach="background" args={['#87ceeb']} />
      
      <ambientLight intensity={1} />
      <directionalLight 
        position={[50, 50, 50]} 
        intensity={0.8} 
        castShadow={!isMobile}
        shadow-mapSize-width={isMobile ? 128 : 256}
        shadow-mapSize-height={isMobile ? 128 : 256}
        shadow-camera-far={80}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
      />
      
      <fog attach="fog" args={['#87ceeb', 30, 150]} />
      
      <ProceduralTerrain />
      <RiverValley />
      {!isMobile && <Clouds />}
      {!isMobile && <Birds />}
      
      <RoadNetwork />
      
      <Bridge position={[0, 0, -40]} rotation={[0, 0, 0]} height={5} length={60} />
      <Bridge position={[0, 0, 35]} rotation={[0, Math.PI / 6, 0]} height={6.5} length={70} />
      
      <CarsOnBridge />
      
      <Church position={[30, 4, -55]} />
      
      <Building 
        position={[20, 5, -70]} 
        size={[12, 18, 15]} 
        color="#e5e7eb"
        textureUrl="https://cdn.poehali.dev/files/f13c35c5-5656-433c-9c5e-0c50f6dd4b72.jpeg"
      />
      <Building 
        position={[-25, 4, -65]} 
        size={[15, 16, 12]} 
        color="#f9fafb"
        textureUrl="https://cdn.poehali.dev/files/b4af7ac0-96e9-4ae1-9fc2-0e3f8b4f10f8.jpeg"
      />
      <Building position={[45, 5, -50]} size={[10, 20, 10]} color="#e5e7eb" />
      <Building position={[-40, 4, -45]} size={[8, 14, 8]} color="#f3f4f6" />
      
      <Building 
        position={[35, 5, 60]} 
        size={[14, 22, 18]} 
        color="#d1d5db"
        textureUrl="https://cdn.poehali.dev/files/b4af7ac0-96e9-4ae1-9fc2-0e3f8b4f10f8.jpeg"
      />
      <Building position={[55, 5, 50]} size={[10, 18, 10]} color="#e5e7eb" />
      <Building position={[20, 4, 70]} size={[8, 15, 8]} color="#f3f4f6" />
      <Building position={[-30, 5, 65]} size={[12, 20, 12]} color="#e5e7eb" />
      <Building position={[-50, 4, 55]} size={[9, 16, 9]} color="#f9fafb" />
      
      <Building position={[-50, 4, -15]} size={[10, 14, 10]} color="#e5e7eb" />
      <Building position={[-60, 5, 5]} size={[8, 18, 8]} color="#f3f4f6" />
      <Building position={[50, 4, -10]} size={[12, 16, 12]} color="#e5e7eb" />
      <Building position={[65, 5, 10]} size={[9, 20, 9]} color="#d1d5db" />
      
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
    </>
  );
}