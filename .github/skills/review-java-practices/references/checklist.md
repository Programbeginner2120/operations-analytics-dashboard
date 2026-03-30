# Java Good Practices Checklist

## SOLID Principles

- [ ] **SRP**: Each class has one reason to change
- [ ] **OCP**: New features added via new classes/implementations, not modifications to existing ones
- [ ] **LSP**: Subtypes can substitute their base types without breaking callers
- [ ] **ISP**: No interface forces implementors to implement methods they don't need
- [ ] **DIP**: High-level modules depend on abstractions (`DataSourceConnection` interface), not concretions

## DataQuery/DataPoint Abstraction

- [ ] No Plaid-specific types or method calls outside the `plaid` package
- [ ] Generic service/controller layer only references `DataQuery`, `DataPoint`, `Metric` interface
- [ ] Source-specific `Metric` enums are not referenced in shared code
- [ ] `DataSourceConnection` interface used as the dependency type, not the concrete implementation

## Type Safety

- [ ] No raw types (`List` instead of `List<String>`)
- [ ] No unchecked casts without justification comment
- [ ] No `@SuppressWarnings("unchecked")` without an explanation inline
- [ ] Generics used to preserve type information (e.g., `DataPoint<Double>`)

## Null Safety

- [ ] Service methods return `Optional<T>` instead of `null` for nullable lookups
- [ ] `Optional.get()` never called without `isPresent()` check or `orElse`/`orElseThrow`
- [ ] No `NullPointerException` risk from unchecked chained calls on potentially null objects

## Exception Handling

- [ ] Specific exceptions caught — no bare `catch (Exception e)`
- [ ] No swallowed exceptions (`catch (Exception e) {}`)
- [ ] Exceptions logged with context before rethrowing
- [ ] Custom exceptions used for domain errors (not `RuntimeException("something went wrong")`)
- [ ] `finally` or try-with-resources used for resource cleanup

## Immutability

- [ ] Fields that never change declared `final`
- [ ] DTOs and value objects use records or have no setters
- [ ] Collections returned from methods are unmodifiable (`Collections.unmodifiableList(...)`)

## Code Cleanliness

- [ ] No unused imports
- [ ] No commented-out code blocks
- [ ] No `System.out.println` — SLF4J logger used (`log.info(...)`, `log.error(...)`)
- [ ] No dead methods (methods defined but never called)

## Spring Annotations

- [ ] `@Service` on service-layer beans
- [ ] `@Repository` on data-access beans
- [ ] `@Component` only for beans that don't fit @Service/@Repository/@Controller
- [ ] `@Transactional` on methods that perform multiple DB writes
- [ ] `@Transactional(readOnly = true)` on read-only service methods for performance
- [ ] No `@Autowired` field injection — constructor injection or Spring's `@RequiredArgsConstructor`
