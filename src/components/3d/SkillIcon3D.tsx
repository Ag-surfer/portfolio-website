'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface SkillIcon3DProps {
  icon: string;
  logoPath?: string;
  modelPath?: string;
  isHovered?: boolean;
}

function SkillModel({ modelPath, isHovered }: { modelPath: string; isHovered?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const scaleRef = useRef(1);
  const { scene } = useGLTF(modelPath);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useFrame(() => {
    if (!groupRef.current) return;

    // Single Y-axis rotation
    const speed = isHovered ? 0.03 : 0.01;
    groupRef.current.rotation.y += speed;

    // Smooth scale pop on hover
    const targetScale = isHovered ? 1.25 : 1.0;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, 0.1);
    groupRef.current.scale.setScalar(scaleRef.current);
  });

  return (
    <group ref={groupRef} scale={1}>
      <primitive object={clonedScene} />
    </group>
  );
}

export function SkillIcon3D({ icon, logoPath, modelPath, isHovered }: SkillIcon3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += isHovered ? 0.03 : 0.01;
  });

  if (modelPath) {
    return <SkillModel modelPath={modelPath} isHovered={isHovered} />;
  }

  // Fallback: wireframe sphere
  return (
    <mesh ref={meshRef} scale={0.8}>
      <sphereGeometry args={[0.6, 12, 12]} />
      <meshStandardMaterial color="#888" wireframe transparent opacity={0.6} />
    </mesh>
  );
}
