'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Torus,
  Box,
  Sphere,
  Cylinder,
  Cone,
  Icosahedron,
} from '@react-three/drei';
import * as THREE from 'three';

const geometryMap: Record<string, string> = {
  react: 'torus',
  typescript: 'box',
  nodejs: 'sphere',
  database: 'cylinder',
  design: 'cone',
  ai: 'icosahedron',
};

interface SkillIcon3DProps {
  icon: string;
  isHovered?: boolean;
}

export function SkillIcon3D({ icon, isHovered }: SkillIcon3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = geometryMap[icon] ?? 'sphere';

  useFrame(() => {
    if (!meshRef.current) return;
    const targetSpeed = isHovered ? 0.04 : 0.008;
    meshRef.current.rotation.y += targetSpeed;
    meshRef.current.rotation.x += targetSpeed * 0.5;
  });

  const mat = (
    <meshStandardMaterial
      color="#888"
      wireframe
      transparent
      opacity={0.6}
    />
  );

  const props = { ref: meshRef, scale: 0.8 };

  switch (geometry) {
    case 'torus':
      return <Torus args={[0.6, 0.2, 8, 16]} {...props}>{mat}</Torus>;
    case 'box':
      return <Box args={[1, 1, 1]} {...props}>{mat}</Box>;
    case 'sphere':
      return <Sphere args={[0.6, 12, 12]} {...props}>{mat}</Sphere>;
    case 'cylinder':
      return <Cylinder args={[0.5, 0.5, 1, 8]} {...props}>{mat}</Cylinder>;
    case 'cone':
      return <Cone args={[0.6, 1, 8]} {...props}>{mat}</Cone>;
    case 'icosahedron':
      return <Icosahedron args={[0.7, 0]} {...props}>{mat}</Icosahedron>;
    default:
      return <Sphere args={[0.6, 12, 12]} {...props}>{mat}</Sphere>;
  }
}
