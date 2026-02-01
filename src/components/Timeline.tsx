'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Code2, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { staggerContainer, staggerItem } from '@/lib/animations';
import type { TimelineItem } from '@/data/types';

const typeConfig = {
  education: {
    icon: GraduationCap,
    color: 'bg-blue-500',
    border: 'border-blue-500',
    text: 'text-blue-500',
    ring: 'ring-blue-500/20',
  },
  work: {
    icon: Briefcase,
    color: 'bg-green-500',
    border: 'border-green-500',
    text: 'text-green-500',
    ring: 'ring-green-500/20',
  },
  project: {
    icon: Code2,
    color: 'bg-purple-500',
    border: 'border-purple-500',
    text: 'text-purple-500',
    ring: 'ring-purple-500/20',
  },
  achievement: {
    icon: Trophy,
    color: 'bg-amber-500',
    border: 'border-amber-500',
    text: 'text-amber-500',
    ring: 'ring-amber-500/20',
  },
} as const;

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <motion.div
      className={cn('relative', className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={staggerContainer}
    >
      {/* Vertical line */}
      <div
        className="absolute left-4 top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-px"
        aria-hidden="true"
      />

      <div className="space-y-12">
        {items.map((item, index) => {
          const config = typeConfig[item.type];
          const Icon = config.icon;
          const isRight = index % 2 === 1;

          return (
            <motion.div
              key={`${item.year}-${item.title}`}
              variants={staggerItem}
              className="relative grid grid-cols-[32px_1fr] gap-6 md:grid-cols-[1fr_32px_1fr] md:gap-8"
            >
              {/* Left content (desktop only) */}
              <div
                className={cn(
                  'hidden md:block',
                  isRight ? 'md:text-right' : ''
                )}
              >
                {!isRight ? (
                  <TimelineCard item={item} config={config} />
                ) : (
                  <span
                    className={cn(
                      'inline-block mt-2 text-sm font-mono font-semibold',
                      config.text
                    )}
                  >
                    {item.year}
                  </span>
                )}
              </div>

              {/* Dot */}
              <div className="relative flex items-start justify-center">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full ring-4',
                    config.color,
                    config.ring
                  )}
                  aria-hidden="true"
                >
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </div>

              {/* Right content (desktop) / Main content (mobile) */}
              <div className="hidden md:block">
                {isRight ? (
                  <TimelineCard item={item} config={config} />
                ) : (
                  <span
                    className={cn(
                      'inline-block mt-2 text-sm font-mono font-semibold',
                      config.text
                    )}
                  >
                    {item.year}
                  </span>
                )}
              </div>

              {/* Mobile content */}
              <div className="md:hidden">
                <TimelineCard item={item} config={config} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function TimelineCard({
  item,
  config,
}: {
  item: TimelineItem;
  config: (typeof typeConfig)[keyof typeof typeConfig];
}) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <span
        className={cn('text-xs font-mono font-semibold uppercase', config.text)}
      >
        {item.year}
      </span>
      <h3 className="mt-1 text-lg font-semibold tracking-tight text-card-foreground">
        {item.title}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
        {item.description}
      </p>
    </div>
  );
}
