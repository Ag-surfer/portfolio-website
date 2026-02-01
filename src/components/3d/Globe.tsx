'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Globe() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main sphere wireframe */}
      <mesh>
        <sphereGeometry args={[1.5, 24, 24]} />
        <meshBasicMaterial wireframe transparent opacity={0.1} color="#888" />
      </mesh>

      {/* Latitude lines */}
      {[-60, -30, 0, 30, 60].map((lat) => {
        const r = 1.5 * Math.cos((lat * Math.PI) / 180);
        const y = 1.5 * Math.sin((lat * Math.PI) / 180);
        return (
          <mesh key={`lat-${lat}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[r - 0.005, r + 0.005, 64]} />
            <meshBasicMaterial transparent opacity={0.15} color="#888" side={THREE.DoubleSide} />
          </mesh>
        );
      })}

      {/* Longitude lines */}
      {[0, 30, 60, 90, 120, 150].map((lon) => (
        <mesh key={`lon-${lon}`} rotation={[0, (lon * Math.PI) / 180, 0]}>
          <torusGeometry args={[1.5, 0.005, 4, 64]} />
          <meshBasicMaterial transparent opacity={0.15} color="#888" />
        </mesh>
      ))}
    </group>
  );
}
