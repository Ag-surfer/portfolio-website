'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface HeroSceneProps {
  isMobile?: boolean;
}

function Sculpture({ isMobile }: { isMobile?: boolean }) {
  const { scene } = useGLTF('/models/hero-sculpture.glb', '/draco/');
  const groupRef = useRef<THREE.Group>(null);

  const baseScale = isMobile ? 1.8 : 2.4;

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;

    // Slow rotation
    groupRef.current.rotation.y = t * 0.15;
    groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;

    // Sine-wave float
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.3;

    // Mouse reactivity
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      pointer.x * 0.15,
      0.05
    );
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      pointer.x * 0.3,
      0.05
    );
  });

  return (
    <group ref={groupRef} scale={baseScale}>
      <primitive object={scene} />
    </group>
  );
}

export function HeroScene({ isMobile }: HeroSceneProps) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <directionalLight position={[-3, -2, -4]} intensity={0.2} />
      <Sculpture isMobile={isMobile} />
    </>
  );
}

useGLTF.preload('/models/hero-sculpture.glb', '/draco/');
