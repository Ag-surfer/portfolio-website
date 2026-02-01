import { AboutData } from './types';

export const about: AboutData = {
  name: 'Krishna P',
  title: 'Full-Stack Developer & Creative Technologist',
  bio: 'I build digital products that are fast, beautiful, and actually solve problems. Four years of turning ideas into shipped software.',
  extendedBio: `I fell in love with building for the web the first time I saw a line of JavaScript change something on screen. That moment of "I made this" has driven everything since.

After studying Computer Science, I dove into full-stack development, working across startups and agencies where shipping fast and shipping well were equally important. I have built everything from real-time collaboration tools to AI-powered content platforms, always obsessing over the details that make software feel alive.

My sweet spot is the intersection of engineering and design. I write clean, type-safe code and care deeply about how it looks and feels to the person using it. I believe great software is invisible -- it just works, and it makes your day a little better.

Right now I am exploring how AI can make developer tools smarter and building this portfolio to share what I have learned along the way.`,
  location: 'San Francisco, CA',
  email: 'hello@krishnap.dev',
  socialLinks: {
    github: 'https://github.com/krishnap',
    linkedin: 'https://linkedin.com/in/krishnap',
    twitter: 'https://twitter.com/krishnap_dev',
  },
  timeline: [
    {
      year: '2020',
      title: 'Started Computer Science Degree',
      description:
        'Enrolled in CS with a focus on systems programming and human-computer interaction. Built my first open-source project that semester.',
      type: 'education',
    },
    {
      year: '2022',
      title: 'First Engineering Internship',
      description:
        'Joined a seed-stage startup as a frontend intern. Shipped a customer dashboard used by 500+ businesses within my first month.',
      type: 'work',
    },
    {
      year: '2023',
      title: 'Launched Open-Source Design System',
      description:
        'Published a React component library with 40+ accessible, animated components. Picked up 2,000 GitHub stars in the first year.',
      type: 'project',
    },
    {
      year: '2024',
      title: 'Graduated & Went Full-Stack',
      description:
        'Completed my degree and transitioned to full-stack roles. Built backend systems handling thousands of concurrent users.',
      type: 'education',
    },
    {
      year: '2025',
      title: 'AI Integration & This Portfolio',
      description:
        'Dove deep into LLM integration, building RAG pipelines and AI-powered tools. Started building this portfolio to showcase four years of work.',
      type: 'achievement',
    },
  ],
};
