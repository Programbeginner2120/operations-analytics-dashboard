# PostgreSQL Good Practices Checklist

## Data Types

- [ ] `TEXT` used instead of `VARCHAR` without a length (or `VARCHAR(n)` where a maximum makes business sense)
- [ ] `TIMESTAMPTZ` used for all timestamp columns — not bare `TIMESTAMP`
- [ ] `BOOLEAN` used for true/false flags — not `CHAR(1)` or `INT`
- [ ] `NUMERIC` or `DECIMAL` used for monetary values — not `FLOAT` or `DOUBLE PRECISION`
- [ ] `UUID` used for external-facing identifiers where applicable
- [ ] `SERIAL` / `BIGSERIAL` or `GENERATED ALWAYS AS IDENTITY` for surrogate PKs

## Constraints

- [ ] All tables have a primary key
- [ ] Foreign key constraints explicitly defined for every FK column
- [ ] `NOT NULL` on columns where null is semantically meaningless
- [ ] `UNIQUE` constraint on columns that must be unique (e.g., `email`, `username`)
- [ ] `CHECK` constraints for domain-restricted columns where appropriate

## Indexes

- [ ] Index exists on every foreign key column (PostgreSQL does not auto-create these)
- [ ] Index on columns frequently used in `WHERE` clauses
- [ ] Index on columns used in `JOIN` conditions
- [ ] No redundant duplicate indexes

## SQL Query Patterns (Mappers)

- [ ] No `SELECT *` — all queries list columns explicitly
- [ ] All values passed as parameters — no string concatenation in SQL
- [ ] `LIMIT` used on queries that could return unbounded rows
- [ ] Queries that filter by user scope always include a `WHERE user_id = #{userId}` predicate

## Migrations (Liquibase)

- [ ] Every migration is in a separate `changeSet` with a unique `id`
- [ ] `changeSet` IDs follow a consistent naming convention (date-based or sequential)
- [ ] Migrations only add or rename — destructive changes (DROP COLUMN) are flagged and justified
- [ ] `rollback` tag provided for every non-trivial `changeSet`
- [ ] Migration history forms a complete, reproducible chain from an empty schema
- [ ] No migration modifies a previously applied `changeSet`'s content

## Naming Conventions

- [ ] All table names in `snake_case`
- [ ] All column names in `snake_case`
- [ ] FK columns follow the pattern `referenced_table_id` (e.g., `user_id`, `institution_id`)
- [ ] Junction/association tables named `table_a_table_b` (alphabetical order)
