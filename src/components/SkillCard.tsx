'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { staggerItem } from '@/lib/animations';
import { useTilt } from '@/hooks/useTilt';
import type { Skill } from '@/data/types';

const iconMap: Record<string, string> = {
  react: '\u269B\uFE0F',
  typescript: '\uD83D\uDCD8',
  nodejs: '\uD83D\uDFE2',
  database: '\uD83D\uDDC4\uFE0F',
  design: '\uD83C\uDFA8',
  ai: '\uD83E\uDD16',
};

interface SkillCardProps {
  skill: Skill;
  className?: string;
}

export function SkillCard({ skill, className }: SkillCardProps) {
  const emoji = iconMap[skill.icon] ?? skill.icon;
  const [isHovered, setIsHovered] = useState(false);
  const { ref, onMouseMove, onMouseLeave } = useTilt<HTMLDivElement>({
    maxTilt: 8,
    scale: 1.02,
  });

  return (
    <motion.div
      ref={ref}
      variants={staggerItem}
      onMouseMove={onMouseMove}
      onMouseLeave={(e) => {
        onMouseLeave();
        setIsHovered(false);
      }}
      onMouseEnter={() => setIsHovered(true)}
    >
      <Link
        href={`/skills/${skill.slug}`}
        className={cn(
          'group block rounded-2xl border glass glass-hover p-6',
          'transition-shadow duration-300 hover:shadow-lg',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          className,
        )}
      >
        <div className="flex items-center gap-3">
          {skill.logoPath ? (
            <div
              className={cn(
                'h-10 w-10 flex-shrink-0 transition-transform duration-200',
                isHovered && 'scale-110'
              )}
            >
              <Image
                src={skill.logoPath}
                alt={`${skill.name} logo`}
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
            </div>
          ) : (
            <span className="text-3xl" role="img" aria-hidden="true">
              {emoji}
            </span>
          )}
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-card-foreground">
              {skill.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {skill.yearsOfExperience}{' '}
              {skill.yearsOfExperience === 1 ? 'year' : 'years'} of experience
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {skill.description}
        </p>

        {/* Proficiency bar */}
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-muted-foreground">
            <span>Proficiency</span>
            <span>{skill.proficiency}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.proficiency}%` }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.2,
              }}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
