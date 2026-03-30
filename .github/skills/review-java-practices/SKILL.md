---
name: review-java-practices
description: 'Review Java source code for good practices. Use when auditing SOLID principles, Spring Boot annotations, generic type safety, exception handling, immutability, null safety with Optional, raw types, unused imports, dead code, or DataQuery/DataPoint abstraction compliance.'
---

# Review: Java Good Practices

## When to Use
Apply this skill when examining any `.java` file in the backend for adherence to idiomatic Java and Spring Boot conventions used in this project.

## Procedure

1. **Load the checklist** from [./references/checklist.md](./references/checklist.md).
2. For each `.java` file, work through every checklist category.
3. Pay special attention to whether the **DataQuery/DataPoint abstraction** is respected — see `product-information/architectural-patterns/data-abstraction-patterns.md`.
4. Record each failure as a row: `| Severity | file/path | description of issue | concrete suggestion |`

## Severity Guide

| Severity | Meaning |
|----------|---------|
| High | Correctness risk, security issue, or abstraction boundary violation |
| Medium | Violates convention in a way that degrades maintainability |
| Low | Minor style or idiom deviation |

## Key Signals to Look For

- Constructor injection instead of field-level `@Autowired` (or missing DI entirely)
- `catch (Exception e) {}` — swallowed exceptions with no logging
- Returning `null` from a service method instead of `Optional<T>`
- Mutable `public` fields on entities or DTOs
- `@SuppressWarnings("unchecked")` without justification
- `System.out.println` instead of SLF4J logger
- Source-specific Plaid logic appearing in generic DataSource layer
