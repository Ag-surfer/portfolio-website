---
name: react-components
description: React 18+ component patterns, hooks, Server/Client components, composition patterns, and accessibility. Use when building UI components, managing state, or implementing interactive features.
---

# React Component Patterns for Portfolio

## Server vs Client Components

### Server Component (Default)
```typescript
// src/components/ProjectList.tsx
// No 'use client' - runs on server
import { getProjects } from '@/db/queries/projects';
import { ProjectCard } from './ProjectCard';

export async function ProjectList() {
  const projects = await getProjects();
  
  return (
    <section aria-labelledby="projects-heading">
      <h2 id="projects-heading" className="sr-only">Projects</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
```

### Client Component (Interactive)
```typescript
// src/components/ProjectCard.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Project } from '@prisma/client';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-card',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link 
        href={`/projects/${project.slug}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="aspect-video relative overflow-hidden">
          {project.imageUrl && (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className={cn(
                'object-cover transition-transform duration-500',
                isHovered && 'scale-105'
              )}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          <div className={cn(
            'absolute inset-0 bg-gradient-to-t from-black/60 to-transparent',
            'opacity-0 transition-opacity duration-300',
            isHovered && 'opacity-100'
          )} />
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold tracking-tight">
            {project.title}
          </h3>
          <p className="mt-2 text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
```

## Custom Hooks

### useMediaQuery
```typescript
// src/hooks/useMediaQuery.ts
'use client';

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// Usage
const isMobile = useMediaQuery('(max-width: 768px)');
```

### useReducedMotion
```typescript
// src/hooks/useReducedMotion.ts
'use client';

import { useMediaQuery } from './useMediaQuery';

export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
```

### useIntersectionObserver
```typescript
// src/hooks/useIntersectionObserver.ts
'use client';

import { useEffect, useRef, useState } from 'react';

interface UseIntersectionOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionObserver<T extends HTMLElement>({
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
}: UseIntersectionOptions = {}) {
  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (triggerOnce) observer.disconnect();
        } else if (!triggerOnce) {
          setIsIntersecting(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isIntersecting };
}
```

## Form Components

### Accessible Form Input
```typescript
// src/components/ui/Input.tsx
'use client';

import { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  description?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, description, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const descriptionId = `${inputId}-description`;
    const errorId = `${inputId}-error`;

    return (
      <div className="space-y-2">
        <label 
          htmlFor={inputId}
          className="text-sm font-medium leading-none"
        >
          {label}
          {props.required && <span className="text-destructive ml-1">*</span>}
        </label>
        
        {description && (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2',
            'text-sm placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          aria-describedby={
            [description && descriptionId, error && errorId]
              .filter(Boolean)
              .join(' ') || undefined
          }
          aria-invalid={error ? 'true' : undefined}
          {...props}
        />
        
        {error && (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

## Compound Component Pattern
```typescript
// src/components/ui/Card.tsx
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn('rounded-xl border bg-card text-card-foreground shadow', className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardProps) {
  return <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('font-semibold leading-none tracking-tight', className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}

export function CardFooter({ className, ...props }: CardProps) {
  return <div className={cn('flex items-center p-6 pt-0', className)} {...props} />;
}
```

## Utility: cn() Function
```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```
