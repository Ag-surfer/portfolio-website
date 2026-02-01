---
name: framer-motion
description: Framer Motion animation patterns, scroll-triggered animations, page transitions, gesture interactions, and accessible motion. Use when implementing animations, transitions, or interactive motion effects.
---

# Framer Motion Animation Patterns

## Animation Variants System

### Reusable Animation Tokens
```typescript
// src/lib/animations.ts
import { Variants } from 'framer-motion';

// Fade animations
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

// Scale animations
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
};

// Slide animations
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
};

// Stagger container
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Stagger item
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  },
};
```

## Scroll-Triggered Animations

### Basic Scroll Animation
```typescript
'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';

export function ScrollReveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={fadeInUp}
    >
      {children}
    </motion.div>
  );
}
```

### Staggered Grid Animation
```typescript
'use client';

import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations';

interface AnimatedGridProps {
  children: React.ReactNode;
}

export function AnimatedGrid({ children }: AnimatedGridProps) {
  return (
    <motion.div
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedGridItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={staggerItem}>
      {children}
    </motion.div>
  );
}
```

## Text Animations

### Character-by-Character Reveal
```typescript
'use client';

import { motion } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function AnimatedText({ text, className, delay = 0 }: AnimatedTextProps) {
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 12, stiffness: 100 },
    },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-[0.25em]"
          variants={child}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}
```

### Typewriter Effect
```typescript
'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TypewriterProps {
  text: string;
  delay?: number;
  className?: string;
}

export function Typewriter({ text, delay = 0, className }: TypewriterProps) {
  const [displayText, setDisplayText] = useState('');
  const count = useMotionValue(0);

  useEffect(() => {
    const controls = animate(count, text.length, {
      type: 'tween',
      duration: text.length * 0.05,
      delay,
      ease: 'linear',
      onUpdate: (latest) => {
        setDisplayText(text.slice(0, Math.round(latest)));
      },
    });

    return controls.stop;
  }, [text, delay, count]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        |
      </motion.span>
    </span>
  );
}
```

## Interactive Hover Effects

### Magnetic Button
```typescript
'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function MagneticButton({ children, className }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}
```

### Card Hover Effect
```typescript
'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

export function GlowCard({ children }: { children: React.ReactNode }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      className="relative rounded-xl bg-card p-px overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(var(--primary-rgb), 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative rounded-xl bg-card p-6">
        {children}
      </div>
    </motion.div>
  );
}
```

## Page Transitions

### Layout Animation Wrapper
```typescript
// src/components/PageTransition.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const variants = {
  hidden: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

## Accessibility: Reduced Motion

### Motion-Safe Wrapper
```typescript
'use client';

import { motion, MotionProps } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type MotionDivProps = MotionProps & React.HTMLAttributes<HTMLDivElement>;

export function SafeMotionDiv({ children, ...props }: MotionDivProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div>{children}</div>;
  }

  return <motion.div {...props}>{children}</motion.div>;
}
```

### Reduced Motion Variants
```typescript
export const safeVariants = (variants: Variants): Variants => {
  if (typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };
  }
  return variants;
};
```
