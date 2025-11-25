import { RigidBody } from '@react-three/rapier';

export default function Ground() {
  return (
    <>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[200, 1, 200]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow position={[20, 3, 0]}>
          <boxGeometry args={[8, 6, 8]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow position={[-20, 2, 10]}>
          <boxGeometry args={[6, 4, 6]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow position={[0, 1.5, -15]}>
          <boxGeometry args={[10, 3, 10]} />
          <meshStandardMaterial color="#eab308" />
        </mesh>
      </RigidBody>
    </>
  );
}
