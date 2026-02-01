---
name: test
description: Write and run tests for specified functionality
context: fork
agent: qa-tester
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Test Task

## Target
Write and/or run tests for: $ARGUMENTS

If no specific target, run the full test suite.

## Workflow

1. **Analyze the Code**
   - Read the implementation
   - Identify testable units

2. **Write Tests**
   - Unit tests for utilities
   - Component tests for UI
   - Integration tests for APIs
   - E2E tests for user flows

3. **Run and Verify**
   - Execute tests
   - Check coverage

## Output

```markdown
# Test Report

## Summary
- Total Tests: X
- Passed: X
- Failed: X
- Coverage: X%

## New Tests Written
- `tests/unit/example.test.ts`

## Coverage Report
| File | Coverage |
|------|----------|
| ... | ...% |

## Recommendations
- Areas needing more coverage
```
