# Frontend Good Practices Checklist

## Service Layer Usage

- [ ] All HTTP calls are inside Angular services — no `inject(HttpClient)` in components
- [ ] Components only call service methods, never construct HTTP requests directly
- [ ] Services expose signals or observables — not raw `HttpClient` response objects

## Error & Loading States

- [ ] Every component that loads async data has a `loading` signal
- [ ] Every component that can fail has an `error` signal
- [ ] Template shows a loading indicator when `loading()` is true
- [ ] Template shows an error message when `error()` is set
- [ ] Template shows an empty state when data is loaded but empty
- [ ] No component silently displays nothing when data is unavailable

## Memory Leak Prevention

- [ ] Observables in components use `takeUntilDestroyed()` from `@angular/core/rxjs-interop`
- [ ] Subscriptions created in the constructor/init are cleaned up on destroy
- [ ] No `subscribe()` calls without a corresponding cleanup strategy
- [ ] Prefer signals over observables for local state to avoid manual subscription management

## Routing & Guards

- [ ] All routes that require authentication are protected by a guard in `app.routes.ts`
- [ ] Guard redirects to login page on unauthorized access — no silent failures
- [ ] Route structure matches the navigation hierarchy seen in the UI
- [ ] Lazy loading used for feature areas that are not part of the initial viewport

## Environment & Configuration

- [ ] API base URL defined in `environment.ts` / `environment.development.ts` — not hardcoded
- [ ] No API keys, tokens, or secrets in any frontend source file
- [ ] `environments/` files used consistently across all services
- [ ] No `localhost` hardcoded outside environment files

## Template Complexity

- [ ] No complex business logic expressions in templates
- [ ] Complex template conditions extracted into `computed()` signals with descriptive names
- [ ] No multi-level ternary expressions in templates
- [ ] No function calls with side effects in template bindings (they re-run on every change detection)
