'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useAnimation } from 'framer-motion';

interface UseScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
}

interface UseScrollAnimationReturn {
  ref: (node: HTMLElement | null) => void;
  controls: ReturnType<typeof useAnimation>;
  inView: boolean;
}

export function useScrollAnimation({
  threshold = 0.1,
  triggerOnce = true,
  rootMargin = '0px',
}: UseScrollAnimationOptions = {}): UseScrollAnimationReturn {
  const controls = useAnimation();
  const [inView, setInView] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (node: HTMLElement | null) => {
      // Cleanup previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      elementRef.current = node;

      if (!node) return;

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            controls.start('visible');
            if (triggerOnce) {
              observerRef.current?.disconnect();
            }
          } else if (!triggerOnce) {
            setInView(false);
            controls.start('hidden');
          }
        },
        { threshold, rootMargin }
      );

      observerRef.current.observe(node);
    },
    [controls, threshold, rootMargin, triggerOnce]
  );

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return { ref, controls, inView };
}
