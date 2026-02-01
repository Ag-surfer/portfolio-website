'use client';

import { Suspense, useRef, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { useInView } from 'framer-motion';

interface SceneWrapperProps {
  children: ReactNode;
  className?: string;
  fallback?: ReactNode;
}

export function SceneWrapper({ children, className, fallback }: SceneWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: '100px' });

  return (
    <div ref={ref} className={className}>
      <Suspense fallback={fallback ?? null}>
        <Canvas
          dpr={[1, 1.5]}
          frameloop={isInView ? 'always' : 'never'}
          camera={{ position: [0, 0, 5], fov: 50 }}
          aria-hidden="true"
          style={{ pointerEvents: 'none' }}
        >
          {children}
        </Canvas>
      </Suspense>
    </div>
  );
}
