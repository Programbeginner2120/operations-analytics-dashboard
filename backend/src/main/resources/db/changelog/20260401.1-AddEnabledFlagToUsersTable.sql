--liquibase formatted sql
--changeset mattk:20260401.1-AddEnabledFlagToUsersTable endDelimiter:go

ALTER TABLE users ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT FALSE;