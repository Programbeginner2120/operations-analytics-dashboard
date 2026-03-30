---
name: review-database-practices
description: 'Review database design for good practices beyond SQL syntax. Use when auditing referential integrity, foreign key constraints, orphaned records, plain-text storage of sensitive data (tokens, credentials, API keys), Liquibase migration completeness, or missing table/column documentation.'
---

# Review: Database Good Practices

## When to Use
Apply this skill to the full database schema as represented in migration files, focusing on design quality independent of SQL syntax.

## File Locations in This Project

- Migrations: `backend/src/main/resources/db/`
- Liquibase root: `backend/src/main/resources/liquibase.yml`

## Procedure

1. **Load the checklist** from [./references/checklist.md](./references/checklist.md).
2. Read all Liquibase changelogs to reconstruct the full schema.
3. Trace foreign key relationships — confirm every FK has a defined constraint.
4. Identify any column that stores tokens, access credentials, or API keys — flag if stored as plain text.
5. Verify migration files are in chronological order and form a complete reproducible history.
6. Record each failure as a row: `| Severity | file/path | description of issue | concrete suggestion |`

## Severity Guide

| Severity | Meaning |
|----------|---------|
| High | Plain-text credential storage, missing FK constraint, or broken migration chain |
| Medium | Missing index, orphaned data risk, or unclear column purpose |
| Low | Missing column comment or minor documentation gap |

## Key Signals to Look For

- Columns named `access_token`, `token`, `secret`, `api_key`, `password` stored as plain `TEXT` without encryption note
- Many-to-one relationships with no `FOREIGN KEY` constraint defined in migrations
- A migration `changeSet` that alters or drops data without a corresponding rollback
- Tables with no clear join path to a `user_id` (orphan risk if user is deleted)
- Missing `liquibase:rollback` tags on destructive changes
