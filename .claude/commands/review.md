---
name: review
description: Run a comprehensive security review on specified files or the entire codebase
context: fork
agent: security
allowed-tools: Read, Glob, Grep, Bash
---

# Security Review

## Target
Review the following for security vulnerabilities: $ARGUMENTS

If no specific target provided, review the entire codebase.

## Review Process

1. **Identify Attack Surface**
2. **Check OWASP Top 10**
3. **Flag Dangerous Patterns**
4. **Run Dependency Check**

## Output Format

```markdown
# Security Review Report

## Summary
- Critical: X
- High: X
- Medium: X  
- Low: X

## Findings

### [SEVERITY] Finding Title
**Location:** `file/path.ts:line`
**Description:** What the vulnerability is
**Recommendation:** How to fix it

## Passed Checks
- [✓] List of secure items
```
