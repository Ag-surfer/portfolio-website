'use client';

import { useRef, useCallback, type RefObject, type MouseEvent } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface TiltOptions {
  maxTilt?: number;
  scale?: number;
  speed?: number;
}

export function useTilt<T extends HTMLElement>(
  options: TiltOptions = {}
): {
  ref: RefObject<T | null>;
  onMouseMove: (e: MouseEvent) => void;
  onMouseLeave: () => void;
} {
  const { maxTilt = 8, scale = 1.02, speed = 400 } = options;
  const ref = useRef<T>(null);
  const prefersReduced = useReducedMotion();

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (prefersReduced || !ref.current) return;
      const el = ref.current;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      el.style.transition = `transform ${speed}ms cubic-bezier(0.03,0.98,0.52,0.99)`;
      el.style.transform = `perspective(1000px) rotateX(${-y * maxTilt}deg) rotateY(${x * maxTilt}deg) scale3d(${scale},${scale},${scale})`;
    },
    [prefersReduced, maxTilt, scale, speed]
  );

  const onMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transition = `transform ${speed}ms cubic-bezier(0.03,0.98,0.52,0.99)`;
    ref.current.style.transform =
      'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
  }, [speed]);

  return { ref, onMouseMove, onMouseLeave };
}
