import React from 'react';
import { siteMetadata } from '@/data/siteMetadata';

export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteMetadata.name,
    url: siteMetadata.siteUrl,
    image: `${siteMetadata.siteUrl}${siteMetadata.ogImage}`,
    jobTitle: siteMetadata.role,
    description: siteMetadata.description,
    email: siteMetadata.email,
    sameAs: [
      siteMetadata.social?.github
        ? `https://github.com/${siteMetadata.social.github}`
        : '',
      siteMetadata.social?.linkedin
        ? `https://linkedin.com/in/${siteMetadata.social.linkedin}`
        : '',
      siteMetadata.social?.twitter
        ? `https://twitter.com/${siteMetadata.social.twitter}`
        : '',
    ].filter(Boolean),
    knowsAbout: siteMetadata.keywords,
  };
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteMetadata.title,
    url: siteMetadata.siteUrl,
    description: siteMetadata.description,
    author: {
      '@type': 'Person',
      name: siteMetadata.name,
    },
  };
}

export function generateWebPageSchema(
  title: string,
  description: string,
  url: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: siteMetadata.title,
      url: siteMetadata.siteUrl,
    },
    author: {
      '@type': 'Person',
      name: siteMetadata.name,
    },
  };
}

export function generateProjectSchema(project: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  tags?: string[];
  date?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    url: `${siteMetadata.siteUrl}/projects/${project.slug}`,
    image: project.image
      ? `${siteMetadata.siteUrl}${project.image}`
      : undefined,
    dateCreated: project.date,
    keywords: project.tags,
    author: {
      '@type': 'Person',
      name: siteMetadata.name,
      url: siteMetadata.siteUrl,
    },
  };
}

interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Safely serialize JSON-LD data by escaping sequences that could break
 * out of a <script> tag (e.g. "</script>" or "<!--" in string values).
 */
function safeJsonLdStringify(data: Record<string, unknown>): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

export function JsonLd({ data }: JsonLdProps) {
  return React.createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: safeJsonLdStringify(data) },
  });
}
