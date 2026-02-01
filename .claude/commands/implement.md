---
name: implement
description: Implement a feature using the appropriate specialist agents
context: fork
agent: orchestrator
allowed-tools: Task, Read, Write, Edit, Bash, Glob, Grep
---

# Implement Feature

## Task
Implement the following feature: $ARGUMENTS

## Workflow

1. **Analyze Requirements**
   - Understand what needs to be built
   - Review existing code for context

2. **Delegate to Specialists**
   - Spawn appropriate agents for each task
   - Provide clear, specific instructions

3. **Integrate Results**
   - Combine work from all agents
   - Verify components work together

4. **Quality Assurance**
   - Run @security review
   - Have @qa-tester write tests
   - Check @seo-analyst recommendations

## Agent Selection Guide

- Database changes → @database-admin
- API endpoints → @backend-dev  
- UI components → @frontend-dev
- Copy/content → @content-writer
- Security review → @security
- Testing → @qa-tester
- SEO/meta → @seo-analyst

## Output

- Summary of changes made
- Files created/modified
- Any manual steps required
