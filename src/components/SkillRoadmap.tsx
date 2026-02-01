'use client';

import { motion } from 'framer-motion';
import type { RoadmapStage } from '@/data/types';

const stageStyles: Record<
  RoadmapStage['level'],
  { pill: string; line: string; dot: string }
> = {
  beginner: {
    pill: 'bg-green-500/15 text-green-400 border-green-500/30',
    line: 'bg-green-500/40',
    dot: 'bg-green-500 shadow-green-500/50',
  },
  intermediate: {
    pill: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    line: 'bg-blue-500/40',
    dot: 'bg-blue-500 shadow-blue-500/50',
  },
  advanced: {
    pill: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    line: 'bg-purple-500/40',
    dot: 'bg-purple-500 shadow-purple-500/50',
  },
  expert: {
    pill: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    line: 'bg-orange-500/40',
    dot: 'bg-orange-500 shadow-orange-500/50',
  },
};

interface SkillRoadmapProps {
  roadmap: RoadmapStage[];
}

export function SkillRoadmap({ roadmap }: SkillRoadmapProps) {
  return (
    <section className="mt-12" aria-labelledby="roadmap-heading">
      <h2
        id="roadmap-heading"
        className="text-xl font-semibold tracking-tight"
      >
        Learning Roadmap
      </h2>

      <div className="relative mt-6">
        {/* Connecting vertical line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border sm:left-[13px]" />

        <div className="space-y-6">
          {roadmap.map((stage, i) => {
            const style = stageStyles[stage.level];
            return (
              <motion.div
                key={stage.level}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative pl-9 sm:pl-10"
              >
                {/* Timeline dot */}
                <div
                  className={`absolute left-1.5 top-3 h-3 w-3 rounded-full shadow-md sm:left-2 ${style.dot}`}
                />

                {/* Card */}
                <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-5">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${style.pill}`}
                    >
                      {stage.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {stage.topics.length} topics
                    </span>
                  </div>

                  <ul className="mt-3 grid gap-2.5">
                    {stage.topics.map((topic) => (
                      <li
                        key={topic.title}
                        className="flex items-start gap-2 text-sm"
                      >
                        <svg
                          className="mt-0.5 h-4 w-4 shrink-0 text-primary/60"
                          viewBox="0 0 16 16"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M13.25 4.75L6 12 2.75 8.75"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div>
                          <span className="font-medium text-foreground">{topic.title}</span>
                          <p className="mt-0.5 text-muted-foreground">{topic.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
