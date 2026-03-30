# Test Coverage Checklist

## Backend — Coverage Map

For each file in `backend/src/main/java/`, a corresponding test class should exist in `backend/src/test/java/` mirroring the package and class name (e.g., `FooService` → `FooServiceTest`).

### Controllers
- [ ] Every `@RestController` class has a test using `@WebMvcTest` or `@SpringBootTest`
- [ ] Happy path (valid input → expected response) tested
- [ ] Bad input path (invalid/missing fields → 400) tested
- [ ] Unauthorized path (if applicable → 401/403) tested
- [ ] Not-found path (missing resource → 404) tested

### Services
- [ ] Every `@Service` class has a unit test with `@ExtendWith(MockitoExtension.class)`
- [ ] All public methods tested
- [ ] `Optional.empty()` path tested for nullable lookups
- [ ] Exception paths tested (what happens when the repository throws)
- [ ] `@Transactional` rollback behavior tested where writes are involved

### Repositories / Mappers
- [ ] SQL queries validated against an in-memory or test-container DB
- [ ] Filter/WHERE clause conditions produce correct results
- [ ] Empty result set handled correctly in both query and calling code

### External API (Plaid)
- [ ] All Plaid API calls mocked — no live HTTP in tests
- [ ] Error responses from Plaid mocked and handled correctly in tests

## Frontend — Coverage Map

For each `.ts` file in `frontend/src/app/`, a `.spec.ts` file should exist in the same directory.

### Components
- [ ] Spec file exists for every component
- [ ] Component renders without error in default state
- [ ] Input signal values are set and their effect on the template is asserted
- [ ] Output signals / emitted events are caught and asserted
- [ ] Loading state renders the loading indicator
- [ ] Error state renders the error message
- [ ] Empty state renders the empty state element
- [ ] No spec file contains ONLY `it('should create', () => { expect(component).toBeTruthy(); })`

### Services
- [ ] Every service has a spec file
- [ ] HTTP calls tested with `HttpClientTestingModule` and `HttpTestingController`
- [ ] Error responses from the API tested (non-2xx status codes)
- [ ] Service-layer signal state changes asserted after method calls

### Guards
- [ ] Auth guard spec verifies unauthenticated users are redirected
- [ ] Auth guard spec verifies authenticated users are allowed through

### Interceptors
- [ ] Interceptor spec verifies the header/token is attached to outgoing requests
- [ ] Interceptor spec verifies 401 handling (redirect to login or token refresh)

## Coverage Quality

- [ ] No test that only asserts `toBeTruthy()` on the component/class instance
- [ ] Assertions check actual rendered content or state values, not just existence
- [ ] Edge cases documented: what inputs were deliberately left untested and why
