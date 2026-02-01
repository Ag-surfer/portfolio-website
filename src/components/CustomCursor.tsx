'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';

export function CustomCursor() {
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springX = useSpring(cursorX, { damping: 30, stiffness: 250 });
  const springY = useSpring(cursorY, { damping: 30, stiffness: 250 });

  useEffect(() => {
    if (isMobile || prefersReduced) return;

    function moveCursor(e: MouseEvent) {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    }

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [isMobile, prefersReduced, cursorX, cursorY]);

  if (isMobile || prefersReduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/50"
      style={{ x: springX, y: springY }}
    />
  );
}
