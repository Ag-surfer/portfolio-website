'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { about } from '@/data/about';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { GradientMesh } from '@/components/GradientMesh';
import { MagneticButton } from '@/components/MagneticButton';
import { ParallaxLayer } from '@/components/ParallaxLayer';

const SceneWrapper = dynamic(
  () => import('@/components/3d/SceneWrapper').then((m) => m.SceneWrapper),
  { ssr: false }
);
const HeroScene = dynamic(
  () => import('@/components/3d/HeroScene').then((m) => m.HeroScene),
  { ssr: false }
);

const headingWords = `Hi, I'm ${about.name.split(' ')[0]}`.split(' ');

const wordVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, damping: 14, stiffness: 100 },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

export function HeroSection() {
  const [headingDone, setHeadingDone] = useState(false);
  const { scrollY } = useScroll();
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 200], [1, 0]);
  const isMobile = useIsMobile();
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const timeout = setTimeout(
      () => setHeadingDone(true),
      300 + headingWords.length * 150 + 400
    );
    return () => clearTimeout(timeout);
  }, []);

  const handleScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4"
    >
      {/* Gradient mesh background */}
      <GradientMesh variant="hero" />

      {/* 3D scene background */}
      {!prefersReduced && (
        <div className="absolute inset-0" aria-hidden="true">
          <SceneWrapper className="h-full w-full">
            <HeroScene isMobile={isMobile} />
          </SceneWrapper>
        </div>
      )}

      {/* Parallax decorative elements */}
      <ParallaxLayer speed={0.2} className="pointer-events-none absolute inset-0">
        <div
          aria-hidden="true"
          className="absolute top-1/4 left-[10%] h-64 w-64 rounded-full bg-primary/5 blur-3xl"
        />
      </ParallaxLayer>
      <ParallaxLayer speed={0.4} className="pointer-events-none absolute inset-0">
        <div
          aria-hidden="true"
          className="absolute bottom-1/4 right-[15%] h-48 w-48 rounded-full bg-accent/5 blur-3xl"
        />
      </ParallaxLayer>

      <div className="relative mx-auto max-w-3xl text-center">
        {/* Heading with staggered word animation */}
        <motion.h1
          className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {headingWords.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.25em]"
              variants={wordVariants}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mt-6 text-lg text-muted-foreground text-balance sm:text-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={headingDone ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          {about.bio}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={headingDone ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <MagneticButton>
            <button
              onClick={() => handleScroll('projects')}
              className={cn(
                'inline-flex h-11 items-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground',
                'transition-colors hover:bg-primary/90',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
              )}
            >
              View Projects
            </button>
          </MagneticButton>
          <MagneticButton>
            <button
              onClick={() => handleScroll('contact')}
              className={cn(
                'inline-flex h-11 items-center rounded-lg border border-input bg-background px-8 text-sm font-medium',
                'transition-colors hover:bg-accent hover:text-accent-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
              )}
            >
              Get in Touch
            </button>
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{ opacity: scrollIndicatorOpacity }}
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-6 w-6 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
}
