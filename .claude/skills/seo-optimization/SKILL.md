---
name: seo-optimization
description: SEO best practices for Next.js, metadata configuration, structured data, Core Web Vitals optimization, sitemap generation, and analytics integration. Use when optimizing pages for search engines or implementing analytics.
---

# SEO Optimization for Next.js Portfolio

## Complete Metadata Configuration

### Root Layout Metadata
```typescript
// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';

const siteConfig = {
  name: 'Your Name',
  title: 'Your Name | Creative Developer',
  description: 'Creative developer specializing in building exceptional digital experiences with React, Next.js, and TypeScript.',
  url: 'https://yourportfolio.com',
  ogImage: '/og-image.jpg',
  links: {
    github: 'https://github.com/yourhandle',
    linkedin: 'https://linkedin.com/in/yourhandle',
    twitter: 'https://twitter.com/yourhandle',
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'developer',
    'portfolio',
    'web development',
    'react',
    'next.js',
    'typescript',
    'frontend',
    'full stack',
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@yourhandle',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'yandex-verification-code',
    // bing: 'bing-verification-code',
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
};
```

### Dynamic Page Metadata
```typescript
// src/app/projects/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getAllProjectSlugs } from '@/db/queries/projects';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: 'Project Not Found' };
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: 'article',
      publishedTime: project.publishedAt?.toISOString(),
      modifiedTime: project.updatedAt.toISOString(),
      images: project.imageUrl ? [{ url: project.imageUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: project.imageUrl ? [project.imageUrl] : [],
    },
  };
}
```

## Structured Data (JSON-LD)

### Person Schema
```typescript
// src/components/seo/PersonJsonLd.tsx
export function PersonJsonLd() {
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Your Name',
    url: 'https://yourportfolio.com',
    image: 'https://yourportfolio.com/profile.jpg',
    jobTitle: 'Creative Developer',
    description: 'Creative developer specializing in...',
    email: 'hello@yourportfolio.com',
    sameAs: [
      'https://github.com/yourhandle',
      'https://linkedin.com/in/yourhandle',
      'https://twitter.com/yourhandle',
    ],
    knowsAbout: [
      'Web Development',
      'React',
      'TypeScript',
      'Next.js',
      'UI/UX Design',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
    />
  );
}
```

### Website Schema
```typescript
// src/components/seo/WebsiteJsonLd.tsx
export function WebsiteJsonLd() {
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Your Name Portfolio',
    url: 'https://yourportfolio.com',
    description: 'Portfolio of Your Name...',
    author: {
      '@type': 'Person',
      name: 'Your Name',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
    />
  );
}
```

### Project/Creative Work Schema
```typescript
// src/components/seo/ProjectJsonLd.tsx
import type { Project } from '@prisma/client';

export function ProjectJsonLd({ project }: { project: Project }) {
  const creativeWork = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    url: `https://yourportfolio.com/projects/${project.slug}`,
    image: project.imageUrl,
    dateCreated: project.createdAt,
    datePublished: project.publishedAt,
    author: {
      '@type': 'Person',
      name: 'Your Name',
      url: 'https://yourportfolio.com',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWork) }}
    />
  );
}
```

## Sitemap Generation

```typescript
// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { getPublishedProjects } from '@/db/queries/projects';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yourportfolio.com';
  const projects = await getPublishedProjects();

  const projectUrls = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    ...projectUrls,
  ];
}
```

## Robots.txt

```typescript
// src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: 'https://yourportfolio.com/sitemap.xml',
  };
}
```

## Image Optimization

```typescript
// Always use Next.js Image component
import Image from 'next/image';

// Good practices
<Image
  src="/project.jpg"
  alt="Descriptive alt text that explains the image"
  width={800}
  height={600}
  priority={true} // For above-the-fold images
  placeholder="blur"
  blurDataURL={blurDataUrl}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

## Google Analytics 4

```typescript
// src/components/Analytics.tsx
import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}

// Track events
export function trackEvent(action: string, category: string, label?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }
}
```

## Core Web Vitals Optimization

### Font Optimization
```typescript
// src/app/layout.tsx
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

### Preload Critical Resources
```typescript
// In layout.tsx head
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link rel="dns-prefetch" href="https://www.google-analytics.com" />
```

## SEO Checklist

- [ ] Unique title tags (50-60 chars)
- [ ] Meta descriptions (150-160 chars)
- [ ] Open Graph tags configured
- [ ] Twitter Card tags configured
- [ ] Canonical URLs set
- [ ] XML sitemap generated
- [ ] robots.txt configured
- [ ] Structured data (JSON-LD) added
- [ ] Images have alt text
- [ ] Images optimized with next/image
- [ ] Fonts optimized with next/font
- [ ] Core Web Vitals passing
- [ ] Mobile-friendly design
- [ ] HTTPS enabled
- [ ] Analytics integrated
