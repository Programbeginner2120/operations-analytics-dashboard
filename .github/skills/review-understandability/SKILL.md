---
name: review-understandability
description: 'Review code for understandability and simplicity. Use when analyzing naming clarity, method complexity, cognitive load, magic numbers, overly nested logic, or whether a new developer could understand the code without documentation.'
---

# Review: Understandability & Simplicity

## When to Use
Apply this skill when evaluating any source file (TypeScript, Java, SQL, YAML) for how easy it is to understand, maintain, and extend.

## Procedure

1. **Load the checklist** from [./references/checklist.md](./references/checklist.md).
2. For each source file under review, work through every checklist item.
3. Record each failure as a row: `| Severity | file/path | description of issue | concrete suggestion |`
4. If all items pass, record `> **No issues found**`.

## Severity Guide

| Severity | Meaning |
|----------|---------|
| High | A new developer would likely misunderstand the intent, leading to bugs |
| Medium | The code is technically clear but unnecessarily complex or verbose |
| Low | Minor naming or style clarity issue that doesn't affect correctness |

## Key Signals to Look For

- Abbreviations or single-letter names outside loop indices
- Methods/functions longer than ~30 lines
- Deeply nested `if`/`try` blocks (more than 3 levels)
- Boolean parameters that aren't named at call sites
- Comments that describe *what* instead of *why*
- Magic numbers or string literals with no named constant
- Classes or components doing more than one conceptual job
