# Database Good Practices Checklist

## Referential Integrity

- [ ] Every FK column has an explicit `FOREIGN KEY` constraint in the migration
- [ ] `ON DELETE` behavior is intentional and defined (CASCADE, SET NULL, or RESTRICT — not left to default)
- [ ] No tables that reference another table's ID without a constraint
- [ ] All junction/association tables have FK constraints to both sides

## Data Security

- [ ] Columns storing access tokens, refresh tokens, or API keys are noted as encrypted or use a secrets manager reference — not plain `TEXT`
- [ ] Password columns never exist (passwords hashed by application layer before storage)
- [ ] PII columns (email, name, phone) documented and understood — no surprise PII columns
- [ ] Audit columns (`created_at`, `updated_at`) present on all user-owned entity tables

## Migration Hygiene

- [ ] Running all migrations from scratch produces the current schema reproducibly
- [ ] No migration references a table or column before it is created
- [ ] Migrations applied in strict chronological/sequential order
- [ ] No `changeSet` has been modified after being applied (immutable history)
- [ ] All migrations have been tested: forward apply and (where possible) rollback

## Schema Documentation

- [ ] Table purpose is clear from the name alone, or a comment is added
- [ ] Non-obvious columns have a comment explaining their business meaning
- [ ] Columns with special encoding, units, or value constraints are documented
- [ ] Enum-like columns (status, type) have their allowed values documented in a comment or constraint

## User Data Isolation

- [ ] All user-owned tables have a `user_id` FK column
- [ ] No tables that mix data from multiple users without a tenant discriminator
- [ ] Delete cascade or application-level cleanup defined for dependent records when a user is deleted
