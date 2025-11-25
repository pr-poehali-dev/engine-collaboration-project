import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';

interface PlayerProps {
  position: [number, number, number];
  joystick: { x: number; y: number; active: boolean };
  onPositionChange?: (pos: [number, number, number]) => void;
}

export default function Player({ position, joystick, onPositionChange }: PlayerProps) {
  const bodyRef = useRef<RapierRigidBody>(null);
  const moveSpeed = 8;
  const jumpForce = 12;
  const keys = useRef<Set<string>>(new Set());
  const canJump = useRef(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current.add(e.code.toLowerCase());
      if (e.code === 'Space' && canJump.current) {
        if (bodyRef.current) {
          bodyRef.current.applyImpulse({ x: 0, y: jumpForce, z: 0 }, true);
          canJump.current = false;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current.delete(e.code.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (!bodyRef.current) return;

    const velocity = bodyRef.current.linvel();
    const pos = bodyRef.current.translation();

    if (Math.abs(velocity.y) < 0.1) {
      canJump.current = true;
    }

    let moveX = 0;
    let moveZ = 0;

    if (keys.current.has('keyw')) moveZ -= 1;
    if (keys.current.has('keys')) moveZ += 1;
    if (keys.current.has('keya')) moveX -= 1;
    if (keys.current.has('keyd')) moveX += 1;

    if (joystick.active) {
      moveX += joystick.x;
      moveZ += joystick.y;
    }

    if (moveX !== 0 || moveZ !== 0) {
      const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
      moveX = (moveX / length) * moveSpeed;
      moveZ = (moveZ / length) * moveSpeed;
    }

    bodyRef.current.setLinvel({ x: moveX, y: velocity.y, z: moveZ }, true);

    if (onPositionChange) {
      onPositionChange([pos.x, pos.y, pos.z]);
    }
  });

  return (
    <RigidBody
      ref={bodyRef}
      position={position}
      colliders="ball"
      mass={1}
      linearDamping={2}
      angularDamping={1}
      enabledRotations={[false, false, false]}
    >
      <mesh castShadow>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
    </RigidBody>
  );
}
