'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = '/models/robot-expressive.glb';

// Preload the model
useGLTF.preload(MODEL_PATH);

/**
 * RobotExpressive animations:
 * Dance, Death, Idle, Jump, No, Punch, Running,
 * Sitting, Standing, ThumbsUp, Walking, WalkJump, Wave, Yes
 */

export function AnimatedCharacter() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_PATH);
  const { actions, mixer } = useAnimations(animations, groupRef);
  const [currentAction, setCurrentAction] = useState('Idle');
  const bobOffset = useRef(0);

  // Start with Idle
  useEffect(() => {
    const idle = actions['Idle'];
    if (idle) {
      idle.reset().fadeIn(0.5).play();
    }
  }, [actions]);

  const playAction = useCallback(
    (name: string) => {
      if (!actions[name] || name === currentAction) return;

      const prev = actions[currentAction];
      const next = actions[name];

      if (prev) prev.fadeOut(0.4);
      if (next) {
        next.reset().fadeIn(0.4).play();

        // For one-shot animations, return to Idle when done
        if (name !== 'Idle' && name !== 'Dancing') {
          next.clampWhenFinished = true;
          next.loop = THREE.LoopOnce;

          const onFinished = () => {
            mixer.removeEventListener('finished', onFinished);
            next.fadeOut(0.4);
            const idle = actions['Idle'];
            if (idle) idle.reset().fadeIn(0.4).play();
            setCurrentAction('Idle');
          };
          mixer.addEventListener('finished', onFinished);
        }
      }
      setCurrentAction(name);
    },
    [actions, currentAction, mixer]
  );

  // Cycle through fun animations periodically
  useEffect(() => {
    const animations = ['Wave', 'ThumbsUp', 'Dance', 'Yes'];
    let idx = 0;

    const interval = setInterval(() => {
      if (currentAction === 'Idle') {
        playAction(animations[idx]);
        idx = (idx + 1) % animations.length;
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentAction, playAction]);

  // Gentle floating bob
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    bobOffset.current = Math.sin(t * 0.8) * 0.05;
    groupRef.current.position.y = -1.2 + bobOffset.current;
  });

  return (
    <group ref={groupRef} position={[0, -1.2, 0]} scale={0.9}>
      <primitive object={scene} />
    </group>
  );
}
