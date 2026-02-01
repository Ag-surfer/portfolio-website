'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  Icosahedron,
  Torus,
  Octahedron,
  Sphere,
  TorusKnot,
} from '@react-three/drei';
import * as THREE from 'three';

interface FloatingShapeProps {
  position: [number, number, number];
  geometry: 'icosahedron' | 'torus' | 'octahedron' | 'sphere' | 'torusknot';
  scale?: number;
  speed?: number;
  rotationAxis?: [number, number, number];
}

function FloatingShape({
  position,
  geometry,
  scale = 1,
  speed = 1,
  rotationAxis = [1, 1, 0],
}: FloatingShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock, pointer }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime * speed + offset;
    meshRef.current.rotation.x += rotationAxis[0] * 0.003;
    meshRef.current.rotation.y += rotationAxis[1] * 0.003;
    meshRef.current.rotation.z += rotationAxis[2] * 0.003;
    meshRef.current.position.y =
      position[1] + Math.sin(t * 0.5) * 0.3;
    // Subtle mouse reactivity
    meshRef.current.position.x =
      position[0] + pointer.x * 0.15;
    meshRef.current.position.z =
      position[2] + pointer.y * 0.1;
  });

  const mat = (
    <meshStandardMaterial
      color="#888"
      wireframe
      transparent
      opacity={0.15}
    />
  );

  const props = { ref: meshRef, scale, position };

  switch (geometry) {
    case 'icosahedron':
      return <Icosahedron args={[1, 0]} {...props}>{mat}</Icosahedron>;
    case 'torus':
      return <Torus args={[1, 0.3, 8, 16]} {...props}>{mat}</Torus>;
    case 'octahedron':
      return <Octahedron args={[1, 0]} {...props}>{mat}</Octahedron>;
    case 'sphere':
      return <Sphere args={[1, 12, 12]} {...props}>{mat}</Sphere>;
    case 'torusknot':
      return <TorusKnot args={[0.8, 0.25, 64, 8]} {...props}>{mat}</TorusKnot>;
  }
}

interface HeroSceneProps {
  isMobile?: boolean;
}

export function HeroScene({ isMobile }: HeroSceneProps) {
  const shapes: FloatingShapeProps[] = isMobile
    ? [
        { position: [-2, 1, -2], geometry: 'icosahedron', scale: 0.6, speed: 0.8 },
        { position: [2, -0.5, -1], geometry: 'torus', scale: 0.5, speed: 1.2 },
        { position: [0, -1.5, -3], geometry: 'octahedron', scale: 0.4, speed: 0.6 },
      ]
    : [
        { position: [-3, 1.5, -2], geometry: 'icosahedron', scale: 0.7, speed: 0.8 },
        { position: [3, -1, -1], geometry: 'torus', scale: 0.6, speed: 1.2 },
        { position: [-1.5, -2, -3], geometry: 'octahedron', scale: 0.5, speed: 0.6 },
        { position: [2, 2, -4], geometry: 'sphere', scale: 0.8, speed: 0.4, rotationAxis: [0, 1, 1] },
        { position: [-2.5, -0.5, -2], geometry: 'torusknot', scale: 0.35, speed: 1.0, rotationAxis: [1, 0, 1] },
        { position: [0.5, 1, -5], geometry: 'icosahedron', scale: 1.0, speed: 0.3 },
        { position: [1, -2.5, -2], geometry: 'sphere', scale: 0.4, speed: 0.9, rotationAxis: [0, 0, 1] },
      ];

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} />
      {shapes.map((s, i) => (
        <FloatingShape key={i} {...s} />
      ))}
    </>
  );
}
