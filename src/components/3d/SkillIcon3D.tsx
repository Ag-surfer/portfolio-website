'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SkillIcon3DProps {
  icon: string;
  logoPath?: string;
  isHovered?: boolean;
}

function useLogoTexture(logoPath?: string) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!logoPath) return;

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    // Set explicit dimensions so SVGs rasterize at a good resolution
    img.width = 256;
    img.height = 256;

    img.onload = () => {
      // Render to canvas for reliable texture creation
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, 256, 256);

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      setTexture(tex);
    };

    img.src = logoPath;

    return () => {
      if (texture) texture.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoPath]);

  return texture;
}

export function SkillIcon3D({ icon, logoPath, isHovered }: SkillIcon3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const scaleRef = useRef(1);
  const texture = useLogoTexture(logoPath);

  useFrame(() => {
    if (!meshRef.current) return;

    const speed = isHovered ? 0.04 : 0.008;
    meshRef.current.rotation.y += speed;
    meshRef.current.rotation.x += speed * 0.5;

    const targetScale = isHovered ? 1.3 : 1.0;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, 0.1);
    meshRef.current.scale.setScalar(scaleRef.current);
  });

  if (!texture) {
    return (
      <mesh ref={meshRef} scale={0.8}>
        <sphereGeometry args={[0.6, 12, 12]} />
        <meshStandardMaterial color="#888" wireframe transparent opacity={0.6} />
      </mesh>
    );
  }

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1.2, 1.2]} />
      <meshBasicMaterial
        map={texture}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
