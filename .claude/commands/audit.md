---
name: audit
description: Run a comprehensive SEO and accessibility audit
context: fork
agent: seo-analyst
allowed-tools: Read, Glob, Grep, Bash
---

# SEO & Accessibility Audit

## Target
Audit the following: $ARGUMENTS

If no specific target provided, audit the entire site.

## Checklist

### Technical SEO
- [ ] Title tags (50-60 chars)
- [ ] Meta descriptions (150-160 chars)
- [ ] XML sitemap
- [ ] robots.txt
- [ ] Structured data

### Accessibility (WCAG 2.1 AA)
- [ ] Alt text on images
- [ ] Heading hierarchy
- [ ] Color contrast (4.5:1)
- [ ] Keyboard navigation
- [ ] Focus states

### Performance
- [ ] LCP < 2.5s
- [ ] INP < 200ms
- [ ] CLS < 0.1

## Output Format

```markdown
# SEO & Accessibility Audit Report

## Scores
- SEO: X/100
- Accessibility: X/100
- Performance: X/100

## Critical Issues
1. [Issue and location]

## Recommendations
1. [Priority improvements]
```
