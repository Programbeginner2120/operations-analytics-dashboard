---
name: review-test-coverage
description: 'Review test cases and coverage gaps. Use when analyzing unit tests, integration tests, missing test files, stub-only specs, uncovered edge cases, untested error paths, missing Spring Boot @WebMvcTest or @SpringBootTest controllers, unmocked external API calls, or Angular component specs that only contain the auto-generated should create assertion.'
---

# Review: Test Coverage

## When to Use
Apply this skill to audit how thoroughly the backend and frontend are tested. Focus on gaps, not on writing new tests.

## Procedure

1. **Load the checklist** from [./references/checklist.md](./references/checklist.md).
2. **Backend**: List every class in `backend/src/main/java/` and find its counterpart in `backend/src/test/java/`. Flag missing test classes.
3. **Frontend**: List every `.ts` source file in `frontend/src/app/` and check for a `.spec.ts` counterpart. Flag missing specs.
4. For existing test files: read them and check if assertions go beyond the auto-generated stub.
5. Record each failure as a row: `| Severity | file/path | description of issue | concrete suggestion |`

## Severity Guide

| Severity | Meaning |
|----------|---------|
| High | Critical service, controller, or guard has zero test coverage |
| Medium | Test file exists but contains only auto-generated stub, or error paths not tested |
| Low | Minor coverage gap for non-critical utility or simple DTO |

## Key Signals to Look For

**Backend**:
- A `*Service.java` with no `*ServiceTest.java` counterpart
- A `*Controller.java` with no `@WebMvcTest` or `@SpringBootTest` test
- `@Transactional` methods with no rollback/error path test
- Tests that call live external APIs (Plaid) instead of mocking

**Frontend**:
- A `*.ts` component with no `*.spec.ts` file at all
- A spec file whose only test is `it('should create', () => { expect(component).toBeTruthy(); })`
- Services with HTTP calls not tested with `HttpClientTestingModule`
- Guards with no test verifying they block unauthenticated access
- Computed signals never asserted in a test
