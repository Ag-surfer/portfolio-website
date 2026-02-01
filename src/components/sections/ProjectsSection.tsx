'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { staggerContainer } from '@/lib/animations';
import { getFeaturedProjects } from '@/data/projects';
import { ProjectCard } from '@/components/ProjectCard';

const featured = getFeaturedProjects();

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24"
    >
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Featured Projects
        </h2>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          View All
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <motion.div
        className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={staggerContainer}
      >
        {featured.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </motion.div>
    </section>
  );
}
