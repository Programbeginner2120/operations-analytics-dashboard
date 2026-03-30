# Backend Good Practices Checklist (Spring Boot)

## Layered Architecture

- [ ] No service code in `@RestController` classes (orchestration only)
- [ ] No repository/mapper calls in `@RestController` classes — must go through service
- [ ] No business logic in mapper/repository layer
- [ ] Controllers only: receive request, call service, return response

## Controllers

- [ ] `@RestController` with `@RequestMapping` base path
- [ ] Each endpoint method is <10 lines: validate → delegate → return
- [ ] `@Valid` / `@Validated` present on `@RequestBody` parameters
- [ ] Appropriate HTTP method annotations (`@GetMapping`, `@PostMapping`, `@DeleteMapping`, etc.)
- [ ] Meaningful HTTP status codes: `201 Created` for POST, `204 No Content` for DELETE, `404` for not found
- [ ] Error responses use a consistent error DTO — not raw exception messages

## Services

- [ ] `@Service` annotation present
- [ ] No instance fields that accumulate state across requests
- [ ] Return `Optional<T>` for nullable lookups rather than `null`
- [ ] `@Transactional` on multi-step write operations
- [ ] `@Transactional(readOnly = true)` on read-only operations

## DTOs

- [ ] Separate Request DTO (input) and Response DTO (output) classes
- [ ] Entity/model classes never returned directly from controllers
- [ ] DTOs are simple data carriers — no business logic
- [ ] Bean Validation annotations on request DTOs where applicable (`@NotNull`, `@NotBlank`, `@Size`)

## Configuration & Security

- [ ] No API keys, passwords, or secrets hardcoded in Java source
- [ ] All sensitive values read from `application.yaml` / environment variables
- [ ] `application-local.yaml` used for local overrides and excluded from source control
- [ ] CORS configuration explicit — no `allowedOrigins("*")` in production profile

## Logging

- [ ] SLF4J `Logger` declared as `private static final Logger log = LoggerFactory.getLogger(Foo.class)`
- [ ] No `System.out.println` or `System.err.println`
- [ ] `log.debug(...)` for diagnostic detail, `log.info(...)` for operational events, `log.error(...)` for failures
- [ ] Sensitive data (tokens, passwords) never logged

## Dependency Injection

- [ ] Constructor injection used (with Lombok `@RequiredArgsConstructor` or explicit constructor)
- [ ] No `@Autowired` field injection
- [ ] No circular dependencies between beans
