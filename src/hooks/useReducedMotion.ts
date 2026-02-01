'use client';

import { useEffect, useState } from 'react';

export function useReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mql.matches);

    function handleChange(e: MediaQueryListEvent) {
      setPrefersReduced(e.matches);
    }

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return prefersReduced;
}
