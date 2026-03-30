# Angular 20+ Good Practices Checklist

> **Authority**: `.github/copilot-instructions.md` is the project's canonical rules document. This checklist summarizes and operationalizes those rules.

## Dependency Injection

- [ ] All injected services use `inject()` at the field level
- [ ] No constructor parameter injection (`constructor(private svc: SomeService)`)
- [ ] Injected services and computed signals marked `readonly`

## Component Inputs

- [ ] `input<T>()` or `input.required<T>()` used — never `@Input()` decorator
- [ ] Optional inputs have a sensible default value
- [ ] Inputs read as function calls in the class body: `this.label()` not `this.label`

## Component Outputs

- [ ] `output<T>()` used — never `@Output()` + `EventEmitter`
- [ ] Output names do not use the `Change` suffix unless part of a `model()` pair

## Two-Way Binding

- [ ] `model<T>()` used for two-way bindable properties
- [ ] No `@Input()`/`@Output()` pairs with matching `Change` naming convention

## Local State

- [ ] All mutable local state uses `signal<T>()`
- [ ] No plain class properties used as reactive state (`isOpen = false`)
- [ ] Derived values use `computed(() => ...)` — no getter methods for reactive state
- [ ] Signals mutated via `.set()` or `.update()` only
- [ ] Explicit generic type parameters on all signals: `signal<boolean>(false)`

## Side Effects

- [ ] `effect()` used inside constructor for reactive side effects
- [ ] No `ngOnChanges` used to react to input changes
- [ ] `effect()` does not directly modify other signals (use `computed()` instead)

## Lifecycle Hooks

- [ ] `afterNextRender()` used for one-time DOM setup — no `ngAfterViewInit`
- [ ] `afterRender()` used for every-render DOM work — no `ngAfterViewChecked`
- [ ] `OnInit` / `OnDestroy` still acceptable for non-DOM setup/teardown

## ViewChild / ContentChild

- [ ] `viewChild<T>('ref')` or `viewChild.required<T>('ref')` used
- [ ] `viewChildren<T>(Component)` used for query lists
- [ ] `contentChild<T>('slot')` used for content projection
- [ ] No `@ViewChild` / `@ContentChild` decorators

## Template Control Flow

- [ ] `@if` / `@else if` / `@else` used — no `*ngIf` or `[hidden]`
- [ ] `@for` with mandatory `track item.id` — no `*ngFor`
- [ ] `@for` includes `@empty` block when empty state is meaningful
- [ ] `@switch` / `@case` / `@default` used — no `[ngSwitch]`
- [ ] `@defer` used for heavy or below-the-fold components

## Standalone & Imports

- [ ] No `standalone: true` in `@Component` decorator (redundant in Angular 20)
- [ ] No `NgModule` declarations — components are standalone
- [ ] `CommonModule` not imported (use built-in control flow instead)
- [ ] `NgIf`, `NgFor`, `NgSwitch`, `AsyncPipe` not in `imports` array
- [ ] Every template dependency explicitly listed in component `imports`

## Class Bindings

- [ ] `[class.name]` used for single boolean toggle
- [ ] `[ngClass]` only used when binding a dynamic map object of many classes
- [ ] `NgClass` not imported for single-condition use
