---
name: review-postgresql-practices
description: 'Review PostgreSQL schema, migrations, and SQL queries for good practices. Use when auditing data types, primary/foreign keys, indexes, SELECT * usage, parameterized queries, Liquibase migration patterns, or snake_case naming conventions.'
---

# Review: PostgreSQL Good Practices

## When to Use
Apply this skill to Liquibase changelogs, SQL migration files, and MyBatis mapper XML/annotation query files.

## File Locations in This Project

- Migrations: `backend/src/main/resources/db/`
- Mapper XML: `backend/src/main/resources/db/mapper/` (or `bin/main/db/mapper/`)
- Java mapper interfaces: `backend/src/main/java/**/db/`

## Procedure

1. **Load the checklist** from [./references/checklist.md](./references/checklist.md).
2. Read every Liquibase changelog and migration file.
3. Read every mapper XML / annotated query method.
4. Record each failure as a row: `| Severity | file/path | description of issue | concrete suggestion |`

## Severity Guide

| Severity | Meaning |
|----------|---------|
| High | Missing constraint, unsafe SQL, or data type that causes silent data loss |
| Medium | Missing index on filtered/joined column, or VARCHAR without length |
| Low | Naming convention deviation or minor schema style issue |

## Key Signals to Look For

- `SELECT *` — always list columns explicitly
- `VARCHAR` without a length — prefer `TEXT`
- `TIMESTAMP` without time zone — prefer `TIMESTAMPTZ`
- Missing `NOT NULL` where null values are nonsensical
- Foreign keys without a corresponding index on the child column
- String concatenation in SQL instead of parameterized values
- Destructive migration operations (DROP COLUMN, rename without backwards compatibility)
- Table or column names using camelCase instead of snake_case
