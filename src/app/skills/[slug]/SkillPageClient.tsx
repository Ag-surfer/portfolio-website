'use client';

import { motion } from 'framer-motion';

interface SkillPageClientProps {
  proficiency: number;
}

export function SkillPageClient({ proficiency }: SkillPageClientProps) {
  return (
    <div className="mt-8">
      <div className="mb-2 flex justify-between text-sm text-muted-foreground">
        <span>Proficiency</span>
        <span>{proficiency}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${proficiency}%` }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
        />
      </div>
    </div>
  );
}
