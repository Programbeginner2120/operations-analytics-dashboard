---
name: review-angular-practices
description: 'Review Angular TypeScript components, services, and templates for Angular 20+ signals-based API compliance. Use when auditing inject(), input(), output(), model(), signal(), computed(), effect(), viewChild(), built-in control flow (@if/@for/@switch), standalone component imports, or legacy decorator patterns (@Input, @Output, @ViewChild, *ngIf, *ngFor, CommonModule).'
---

# Review: Angular Good Practices (Angular 20+ / Signals)

## When to Use
Apply this skill to every `.ts` component, service, guard, interceptor file and every `.html` template in the Angular frontend.

## Procedure

1. **Load the checklist** from [./references/checklist.md](./references/checklist.md).
2. Also read `.github/copilot-instructions.md` — it is the authoritative rules document for this project.
3. For each file, work through the checklist categories: DI, Inputs, Outputs, State, Effects, Lifecycle, Queries, Templates, Imports.
4. Record each failure as a row: `| Severity | file/path | description of issue | concrete suggestion |`

## Severity Guide

| Severity | Meaning |
|----------|---------|
| High | Legacy API that will break with future Angular upgrades or disables reactivity |
| Medium | Permitted but non-idiomatic pattern for Angular 20+ |
| Low | Minor style deviation |

## Key Signals to Look For

- `constructor(private svc: SomeService)` — constructor DI
- `@Input()` or `@Output()` decorators
- `*ngIf`, `*ngFor`, `[ngSwitch]` in templates
- `ngOnChanges` used for reactive state
- `ngAfterViewInit` used for DOM setup
- `@ViewChild` / `@ContentChild` decorators
- `standalone: true` in `@Component` (redundant, should be omitted)
- `CommonModule`, `NgIf`, `NgFor`, `NgSwitch`, `AsyncPipe` in `imports` array
- Plain class property used as reactive state (`isOpen = false` instead of `isOpen = signal(false)`)
- Signal read without call (`this.items` instead of `this.items()`)
