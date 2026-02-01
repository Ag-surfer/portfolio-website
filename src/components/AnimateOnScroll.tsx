'use client';

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

const variants: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
};

interface AnimateOnScrollProps {
  variant?: keyof typeof variants;
  delay?: number;
  duration?: number;
  className?: string;
  children: ReactNode;
}

export function AnimateOnScroll({
  variant = 'fadeInUp',
  delay = 0,
  duration = 0.5,
  className,
  children,
}: AnimateOnScrollProps) {
  const selectedVariant = variants[variant];

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: selectedVariant.hidden,
        visible: {
          ...selectedVariant.visible,
          transition: {
            duration,
            delay,
            ease: [0.4, 0, 0.2, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
