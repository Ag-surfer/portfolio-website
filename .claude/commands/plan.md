---
name: plan
description: Create a comprehensive implementation plan using the orchestrator agent
context: fork
agent: orchestrator
allowed-tools: Task, Read, Glob, Grep
---

# Create Implementation Plan

## Task
Create a detailed implementation plan for: $ARGUMENTS

## Instructions

1. **Understand the Request**
   - Analyze what is being asked
   - Identify all components needed

2. **Break Down the Work**
   - List all subtasks required
   - Identify which specialist agent handles each
   - Note dependencies between tasks

3. **Create Execution Order**
   - Sequence tasks logically
   - Identify what can be parallelized

## Output Format

```markdown
# Implementation Plan: [Feature Name]

## Overview
[Brief description]

## Tasks

### Phase 1: Foundation
- [ ] Task 1 (@agent-name): Description

### Phase 2: Implementation  
- [ ] Task 2 (@agent-name): Description

### Phase 3: Polish & Review
- [ ] Security review (@security)
- [ ] Testing (@qa-tester)
- [ ] SEO optimization (@seo-analyst)

## Dependencies
- Task X depends on Task Y

## Ready to Execute?
Confirm to begin implementation.
```
