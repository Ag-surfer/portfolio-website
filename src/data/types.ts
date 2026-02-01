export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  category: 'fullstack' | 'frontend' | 'backend' | 'ai-ml' | 'design';
  tags: string[];
  techStack: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  completedAt: string; // ISO date
}

export interface RoadmapTopic {
  title: string;
  description: string;
}

export interface RoadmapStage {
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  label: string;
  topics: RoadmapTopic[];
}

export interface Skill {
  id: string;
  slug: string;
  name: string;
  category: 'frontend' | 'backend' | 'design' | 'ai-ml' | 'database' | 'systems' | 'networking';
  proficiency: number; // 0-100
  icon: string; // emoji or icon name
  logoPath?: string; // path to logo SVG/PNG in /public
  modelPath?: string; // path to 3D GLB model in /public
  description: string;
  longDescription: string;
  highlights: string[];
  relatedProjectSlugs: string[];
  yearsOfExperience: number;
  roadmap: RoadmapStage[];
}

export interface AboutData {
  name: string;
  title: string;
  bio: string;
  extendedBio: string;
  location: string;
  email: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter?: string;
  };
  timeline: TimelineItem[];
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
  type: 'education' | 'work' | 'project' | 'achievement';
}

export interface SiteMetadata {
  title: string;
  description: string;
  siteUrl: string;
  author: string;
  ogImage: string;
  twitterHandle?: string;
}
