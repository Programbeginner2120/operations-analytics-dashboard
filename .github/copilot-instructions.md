# GitHub Copilot Instructions — Operations Analytics Dashboard

This project uses **Angular 20+**. All generated Angular code must use the modern, signals-based APIs and built-in control flow syntax. Never produce legacy decorator-based patterns. The rules below are hard requirements — treat every "BAD" example as a pattern that must never appear in generated code.

---

## 1. Dependency Injection

Use `inject()` at the field level. Never use constructor parameter injection.

```typescript
// BAD
constructor(private router: Router, private authService: AuthService) {}

// GOOD
private readonly router = inject(Router);
private readonly authService = inject(AuthService);
```

---

## 2. Component Inputs

Use `input()` and `input.required()`. Never use the `@Input()` decorator.

```typescript
// BAD
@Input() label: string = '';
@Input({ required: true }) items: Item[] = [];

// GOOD
label = input<string>('');
items = input.required<Item[]>();
```

Reading an input in the class body always requires a function call because inputs are signals:

```typescript
// BAD — reading like a plain property
const label = this.label;

// GOOD — calling the signal
const label = this.label();
```

---

## 3. Component Outputs

Use `output()`. Never use `@Output()` with `EventEmitter`.

```typescript
// BAD
@Output() closed = new EventEmitter<void>();
@Output() valueChange = new EventEmitter<string>();

// GOOD
closed = output<void>();
valueChange = output<string>();
```

Emit by calling `.emit()` on the output — identical to `EventEmitter`:

```typescript
this.closed.emit();
this.valueChange.emit(newValue);
```

---

## 4. Two-Way Binding

Use `model()` instead of an `@Input()` / `@Output()` pair with the `Change` naming convention.

```typescript
// BAD
@Input() value: string = '';
@Output() valueChange = new EventEmitter<string>();

// GOOD
value = model<string>('');
```

`model()` returns a writable signal. Read it with `this.value()` and write it with `this.value.set(newValue)`. It automatically supports `[(value)]` two-way binding in templates.

---

## 5. Local Reactive State

Use `signal()` for local mutable state. Use `computed()` for values derived from signals. Never write plain class properties or getters to represent reactive state.

```typescript
// BAD — plain property, not reactive
isOpen = false;

// BAD — getter that re-evaluates on every change-detection cycle and is not memoized
get displayText(): string {
  return this.selectedOption()?.label ?? this.placeholder();
}

// GOOD — writable signal
isOpen = signal<boolean>(false);

// GOOD — memoized derived signal
readonly displayText = computed(() => this.selectedOption()?.label ?? this.placeholder());
```

Mutate signals with `.set()` for replacement or `.update()` for a function of the previous value:

```typescript
this.isOpen.set(true);
this.count.update(n => n + 1);
```

---

## 6. Side Effects

Use `effect()` inside the constructor for reactive side effects. Never manually subscribe to signal changes with `ngOnChanges` or polling.

```typescript
constructor() {
  effect(() => {
    document.body.style.overflow = this.isOpen() ? 'hidden' : '';
  });
}
```

---

## 7. Lifecycle Hooks

Prefer `afterNextRender` (runs once after the first render) or `afterRender` (runs after every render) over `ngAfterViewInit` for DOM-related setup. Call them inside the constructor.

```typescript
// BAD
ngAfterViewInit() {
  this.initChart();
}

// GOOD
constructor() {
  afterNextRender(() => {
    this.initChart();
  });
}
```

`OnInit`, `OnDestroy`, and other non-DOM lifecycle hooks are still acceptable where appropriate.

---

## 8. ViewChild / ContentChild Queries

Use the signal-based query functions. Never use the `@ViewChild` / `@ContentChild` decorators.

```typescript
// BAD
@ViewChild('chartRef') chartRef!: ElementRef;
@ViewChild(ChildComponent) child!: ChildComponent;

// GOOD
chartRef = viewChild<ElementRef>('chartRef');
chartRefRequired = viewChild.required<ElementRef>('chartRef');
children = viewChildren(ChildComponent);
slot = contentChild<ElementRef>('slot');
```

Signal queries return `Signal<T | undefined>` (or `Signal<T>` for `.required()`). Read them with `this.chartRef()`.

---

## 9. Standalone Components

All components are standalone — this is the Angular 20 default. Do **not** add `standalone: true` to the `@Component` decorator; it is redundant. Import every dependency directly in the component's `imports` array.

```typescript
// BAD — explicitly marking standalone (redundant in Angular 17+)
@Component({ standalone: true, imports: [...] })

// GOOD — omit standalone, list imports
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  imports: [ButtonComponent, LucideAngularModule],
})
```

Never declare components in an `NgModule`, and never use `CommonModule` only to get structural directives — use the built-in control flow blocks instead (see Section 11).

---

## 10. Class & Style Bindings

Use `[class.name]` for a single conditional class. Reserve `[ngClass]` only when binding a dynamic class-map object. Never import `NgClass` just for a single boolean toggle.

```html
<!-- BAD — NgClass for a single condition -->
<div [ngClass]="{'is-active': isActive()}">...</div>

<!-- GOOD — direct class binding -->
<div [class.is-active]="isActive()">...</div>

<!-- OK — NgClass for a computed map of many classes -->
<div [ngClass]="buttonClasses()">...</div>
```

---

## 11. Template Control Flow (Built-In Blocks)

### 11a. Conditionals — `@if`

Use `@if` / `@else if` / `@else`. Never use `*ngIf` or `[hidden]` for conditional rendering.

```html
<!-- BAD -->
<div *ngIf="isLoggedIn()">Welcome</div>
<div *ngIf="count() > 0; else empty">Has items</div>
<ng-template #empty><p>None</p></ng-template>

<!-- GOOD -->
@if (isLoggedIn()) {
  <div>Welcome</div>
}

@if (count() > 0) {
  <div>Has items</div>
} @else {
  <p>None</p>
}

@if (status() === 'loading') {
  <app-spinner />
} @else if (status() === 'error') {
  <app-error-message />
} @else {
  <app-content />
}
```

### 11b. Loops — `@for`

Use `@for` with a mandatory `track` expression. Never use `*ngFor`.

```html
<!-- BAD -->
<li *ngFor="let item of items(); trackBy: trackById">{{ item.name }}</li>

<!-- GOOD -->
@for (item of items(); track item.id) {
  <li>{{ item.name }}</li>
} @empty {
  <li>No items found.</li>
}
```

The `track` expression must be unique and stable (prefer `item.id`). Include an `@empty` block whenever an empty list is a meaningful state.

### 11c. Switch Statements — `@switch`

Use `@switch` / `@case` / `@default`. Never use `[ngSwitch]`.

```html
<!-- BAD -->
<span [ngSwitch]="role()">
  <ng-container *ngSwitchCase="'admin'">Admin</ng-container>
  <ng-container *ngSwitchDefault>User</ng-container>
</span>

<!-- GOOD -->
@switch (role()) {
  @case ('admin') { <span>Admin</span> }
  @case ('editor') { <span>Editor</span> }
  @default { <span>User</span> }
}
```

### 11d. Deferred Loading — `@defer`

Use `@defer` to lazy-load heavy or below-the-fold components. Provide a `@placeholder` and optionally a `@loading` block.

```html
@defer (on viewport) {
  <app-heavy-chart [data]="chartData()" />
} @placeholder {
  <div class="skeleton"></div>
} @loading (minimum 200ms) {
  <app-spinner />
}
```

---

## 12. Imports to Avoid

The following are replaced entirely by built-in Angular features. Do not import them into any component:

| Legacy Import | Modern Replacement |
|---|---|
| `NgIf` / `*ngIf` | `@if` block |
| `NgFor` / `*ngFor` | `@for` block |
| `NgSwitch` / `*ngSwitch` | `@switch` block |
| `NgClass` (single toggle) | `[class.name]` binding |
| `AsyncPipe` (for signals) | Read signal directly: `value()` |

If `CommonModule` was imported solely for the above directives, remove the `CommonModule` import entirely.

---

## 13. TypeScript Conventions

- Mark all injected services and computed signals `readonly` to prevent accidental reassignment.
- Use explicit generic type parameters on `signal<T>()`, `input<T>()`, `computed<T>()`, and `output<T>()` for clarity.
- Avoid `any`. When the type is truly unknown, prefer `unknown` and narrow it explicitly.
- Use `const` for values that do not change; use `let` only inside function bodies.
