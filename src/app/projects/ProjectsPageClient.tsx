'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '@/data/projects';
import { staggerContainer } from '@/lib/animations';
import { ProjectCard } from '@/components/ProjectCard';
import { cn } from '@/lib/utils';
import type { Project } from '@/data/types';

const categories: { label: string; value: Project['category'] | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Full-Stack', value: 'fullstack' },
  { label: 'Frontend', value: 'frontend' },
  { label: 'Backend', value: 'backend' },
  { label: 'AI/ML', value: 'ai-ml' },
  { label: 'Design', value: 'design' },
];

export function ProjectsPageClient() {
  const [active, setActive] = useState<Project['category'] | 'all'>('all');

  const filtered =
    active === 'all'
      ? projects
      : projects.filter((p) => p.category === active);

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        Projects
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        A collection of things I have built.
      </p>

      <div
        className="mt-8 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter projects by category"
      >
        {categories.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActive(value)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
              active === value
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/30',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div
          key={active}
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={staggerContainer}
        >
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-12">
              No projects in this category yet.
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
