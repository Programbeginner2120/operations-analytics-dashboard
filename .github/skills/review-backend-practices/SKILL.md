---
name: review-backend-practices
description: 'Review Spring Boot backend architecture for good practices. Use when auditing layered architecture compliance (Controller/Service/Repository), thin controllers, stateless services, DTO usage at API boundaries, Bean Validation, HTTP status codes, externalized configuration, SLF4J logging, or circular dependencies.'
---

# Review: Backend Good Practices (Spring Boot)

## When to Use
Apply this skill to all Spring Boot controllers, services, configuration classes, and DTOs.

## Procedure

1. **Load the checklist** from [./references/checklist.md](./references/checklist.md).
2. Start with controllers — check they delegate all logic to services.
3. Then services — check they are stateless and use `Optional` for nullable results.
4. Then configuration — check for hardcoded secrets or credentials.
5. Record each failure as a row: `| Severity | file/path | description of issue | concrete suggestion |`

## Severity Guide

| Severity | Meaning |
|----------|---------|
| High | Security risk (hardcoded secret, missing validation) or architectural violation that couples layers |
| Medium | Missing error handling, improper HTTP status code, or entity leaked to HTTP layer |
| Low | Logging style, minor naming deviation |

## Key Signals to Look For

- Business logic (calculations, branching, data transformation) inside a `@RestController`
- Entity/model objects returned directly from controller endpoints (should be DTOs)
- Missing `@Valid` / `@Validated` on request body parameters
- `ResponseEntity.ok(null)` or generic 200 for all responses including errors
- Hardcoded API keys, passwords, or URLs in Java source
- `System.out.println(...)` instead of `log.info(...)` / `log.error(...)`
- `@Autowired` field injection (should use constructor or `inject()` equivalent)
- Services with instance fields that accumulate state across requests
