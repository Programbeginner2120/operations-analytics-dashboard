---
name: review-frontend-practices
description: 'Review Angular frontend architecture for good practices beyond API compliance. Use when auditing service layer usage for HTTP calls, error/loading/empty state handling in UI, memory leaks from observables, route guard protection, hardcoded secrets in components, or environment file usage for API base URLs.'
---

# Review: Frontend Good Practices

## When to Use
Apply this skill to Angular components, services, guards, and interceptors — focusing on architecture and runtime safety rather than Angular API syntax (see `review-angular-practices` for API compliance).

## Procedure

1. **Load the checklist** from [./references/checklist.md](./references/checklist.md).
2. Search for direct `HttpClient` usage inside components.
3. Check every component that displays data for loading, error, and empty state handling.
4. Check route files to confirm protected routes use guards.
5. Search for hardcoded URLs, API keys, or environment strings in component code.
6. Record each failure as a row: `| Severity | file/path | description of issue | concrete suggestion |`

## Severity Guide

| Severity | Meaning |
|----------|---------|
| High | Security issue (hardcoded secret) or missing guard on authenticated route |
| Medium | Missing error/loading state causes blank UI or silent failures |
| Low | Minor architectural inconsistency |

## Key Signals to Look For

- `inject(HttpClient)` or `new HttpClient(...)` directly inside a `@Component` class
- Components with no `@if (error())` or `@if (loading())` block around data-dependent UI
- Observable subscriptions in components without `takeUntilDestroyed()` or completion guarantee
- Routes to authenticated pages without an `authGuard` (or equivalent) in `app.routes.ts`
- Hardcoded strings like `'http://localhost:8080'` in component or service files outside `environment.ts`
- Magic string API paths scattered across multiple service files instead of a single constants file
