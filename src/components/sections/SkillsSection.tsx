'use client';

import { motion } from 'framer-motion';
import { skills } from '@/data/skills';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import { SkillCard } from '@/components/SkillCard';

export function SkillsSection() {
  return (
    <section
      id="skills"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24"
      aria-labelledby="skills-heading"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={fadeInUp}
      >
        <h2
          id="skills-heading"
          className="text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Skills &amp; Expertise
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Technologies and disciplines I work with to build reliable, polished products.
        </p>
      </motion.div>

      <motion.div
        className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={staggerContainer}
      >
        {skills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </motion.div>
    </section>
  );
}
