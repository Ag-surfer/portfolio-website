'use client';

import { cn } from '@/lib/utils';

type Variant = 'hero' | 'projects' | 'skills' | 'contact';

const meshStyles: Record<Variant, string> = {
  hero: 'bg-[radial-gradient(at_20%_20%,hsl(var(--primary)/0.08)_0%,transparent_50%),radial-gradient(at_80%_80%,hsl(var(--accent)/0.06)_0%,transparent_50%),radial-gradient(at_50%_50%,hsl(var(--secondary)/0.04)_0%,transparent_70%)]',
  projects:
    'bg-[radial-gradient(at_0%_100%,hsl(var(--primary)/0.05)_0%,transparent_50%),radial-gradient(at_100%_0%,hsl(var(--accent)/0.04)_0%,transparent_50%)]',
  skills:
    'bg-[radial-gradient(at_80%_20%,hsl(var(--primary)/0.06)_0%,transparent_50%),radial-gradient(at_20%_80%,hsl(var(--secondary)/0.04)_0%,transparent_50%)]',
  contact:
    'bg-[radial-gradient(at_30%_70%,hsl(var(--primary)/0.05)_0%,transparent_50%),radial-gradient(at_70%_30%,hsl(var(--accent)/0.04)_0%,transparent_50%)]',
};

interface GradientMeshProps {
  variant: Variant;
  className?: string;
}

export function GradientMesh({ variant, className }: GradientMeshProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0',
        meshStyles[variant],
        className
      )}
    />
  );
}
