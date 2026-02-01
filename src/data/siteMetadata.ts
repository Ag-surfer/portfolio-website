import { SiteMetadata } from './types';

export const siteMetadata: SiteMetadata & {
  name: string;
  role: string;
  email: string;
  keywords: string[];
  social?: { github?: string; linkedin?: string; twitter?: string };
} = {
  title: 'Krishna P | Full-Stack Developer & Creative Technologist',
  description:
    'Portfolio of Krishna P -- a full-stack developer building fast, beautiful web applications with React, Next.js, TypeScript, and Node.js.',
  siteUrl: 'https://krishnap.dev',
  author: 'Krishna P',
  name: 'Krishna P',
  role: 'Full-Stack Developer & Creative Technologist',
  email: 'kr.sparrow@pm.me',
  ogImage: '/images/og-image.jpg',
  twitterHandle: '@krishnap_dev',
  keywords: [
    'Full-Stack Developer',
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'UI/UX Design',
    'AI/ML Integration',
    'Web Development',
  ],
  social: {
    github: 'krishnap',
    linkedin: 'krishnap',
    twitter: 'krishnap_dev',
  },
};
