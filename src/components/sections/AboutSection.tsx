'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';
import { about } from '@/data/about';
import { Timeline } from '@/components/Timeline';

export function AboutSection() {
  return (
    <section
      id="about"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24"
      aria-labelledby="about-heading"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={staggerContainer}
      >
        <motion.h2
          id="about-heading"
          className="text-3xl font-semibold tracking-tight sm:text-4xl"
          variants={staggerItem}
        >
          About
        </motion.h2>

        <motion.p
          className="mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed"
          variants={staggerItem}
        >
          {about.bio}
        </motion.p>
      </motion.div>

      <div className="mt-12">
        <Timeline items={about.timeline} />
      </div>

      <motion.div
        className="mt-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <Link
          href="/about"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          Read more about me
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </motion.div>
    </section>
  );
}
