# Understandability & Simplicity Checklist

## Naming

- [ ] All classes, methods, and variables have intention-revealing names
- [ ] No single-letter names outside loop indices (`i`, `j`)
- [ ] No abbreviations that require domain knowledge to decode (`txn`, `src`, `cfg` without context)
- [ ] Boolean names read as a yes/no question (`isLoading`, `hasError`, `canEdit`)
- [ ] No generic names like `data`, `result`, `temp`, `info`, `obj` for domain concepts
- [ ] Method names describe what they do, not how (`getUserById` not `queryUserTable`)

## Method & Function Size

- [ ] No method longer than ~30 lines (rough guideline — use judgment)
- [ ] Each method/function does exactly one thing
- [ ] Helper methods extracted when a block of code needs a comment to explain it
- [ ] No deeply nested logic (more than 3 levels of `if`/`for` nesting)

## Constants & Magic Values

- [ ] No magic numbers in logic (`MAX_RETRIES = 3` not `if (count > 3)`)
- [ ] No inline string literals for enum-like values
- [ ] Boolean parameters at call sites are named or wrapped (`createUser(verified: true)` not `createUser(true)`)

## Comments

- [ ] Comments explain *why*, not *what* the code does
- [ ] No commented-out blocks of dead code
- [ ] No misleading or stale comments that contradict the implementation

## Class Responsibility

- [ ] Each class has one clear, describable responsibility (SRP)
- [ ] No "god objects" handling persistence + business logic + HTTP simultaneously
- [ ] Component/service names match their actual responsibility

## Cognitive Load

- [ ] Complex conditions extracted into named booleans or helper methods
- [ ] Nested ternaries avoided (max one level)
- [ ] Return early pattern used to reduce nesting
- [ ] A new developer can understand the file's purpose within 60 seconds
