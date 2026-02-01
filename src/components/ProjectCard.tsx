'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { staggerItem } from '@/lib/animations';
import { useTilt } from '@/hooks/useTilt';
import type { Project } from '@/data/types';

const categoryGradients: Record<Project['category'], string> = {
  fullstack: 'from-violet-500 to-indigo-600',
  frontend: 'from-sky-400 to-blue-600',
  backend: 'from-emerald-400 to-teal-600',
  'ai-ml': 'from-amber-400 to-orange-600',
  design: 'from-pink-400 to-rose-600',
};

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const { ref, onMouseMove, onMouseLeave } = useTilt<HTMLElement>({
    maxTilt: 6,
    scale: 1.02,
  });

  return (
    <motion.article
      ref={ref}
      variants={staggerItem}
      layout
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn('group', className)}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="block rounded-xl border glass glass-hover overflow-hidden transition-shadow duration-300 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div
          className={cn(
            'relative aspect-video bg-gradient-to-br',
            categoryGradients[project.category],
          )}
        >
          <div className="absolute inset-0 flex items-center justify-center text-white/30 text-6xl font-bold select-none">
            {project.title.charAt(0)}
          </div>
          {project.featured && (
            <span className="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-foreground dark:bg-black/70 dark:text-white">
              Featured
            </span>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-xs text-muted-foreground font-mono"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="text-xs text-muted-foreground">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
