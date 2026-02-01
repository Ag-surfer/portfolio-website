'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';

export function CustomCursor() {
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const isHovering = useRef(false);
  const outerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const springX = useSpring(cursorX, { damping: 25, stiffness: 200 });
  const springY = useSpring(cursorY, { damping: 25, stiffness: 200 });

  useEffect(() => {
    if (isMobile || prefersReduced) return;

    document.documentElement.classList.add('custom-cursor-active');

    function moveCursor(e: MouseEvent) {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    }

    function handleOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (
        target.closest('a, button, [role="button"], input, textarea, select, label')
      ) {
        isHovering.current = true;
        outerRef.current?.classList.add('cursor-hover');
        dotRef.current?.classList.add('cursor-hover');
      }
    }

    function handleOut(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (
        target.closest('a, button, [role="button"], input, textarea, select, label')
      ) {
        isHovering.current = false;
        outerRef.current?.classList.remove('cursor-hover');
        dotRef.current?.classList.remove('cursor-hover');
      }
    }

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
    };
  }, [isMobile, prefersReduced, cursorX, cursorY]);

  if (isMobile || prefersReduced) return null;

  return (
    <>
      {/* Glow spotlight */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9998] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"
        style={{ x: springX, y: springY }}
      />
      {/* Outer ring */}
      <motion.div
        ref={outerRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/30 transition-[width,height,border-color] duration-200 [&.cursor-hover]:h-12 [&.cursor-hover]:w-12 [&.cursor-hover]:border-primary/60"
        style={{ x: springX, y: springY }}
      />
      {/* Inner dot */}
      <motion.div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground transition-[width,height,opacity] duration-200 [&.cursor-hover]:h-0 [&.cursor-hover]:w-0 [&.cursor-hover]:opacity-0"
        style={{ x: cursorX, y: cursorY }}
      />
    </>
  );
}
