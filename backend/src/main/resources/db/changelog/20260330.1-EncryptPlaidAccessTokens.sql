--liquibase formatted sql
--changeset mattk:20260330.1-EncryptPlaidAccessTokens endDelimiter:go

-- Remove all existing rows so that no plaintext access tokens remain in the
-- database after this migration. Plaid items must be re-linked by users after
-- applying this changeset.
DELETE FROM plaid_items;

-- Widen the column from VARCHAR(255) to TEXT so that Spring Security Crypto
-- ciphertext can be stored without truncation.
ALTER TABLE plaid_items ALTER COLUMN access_token TYPE TEXT;

--rollback ALTER TABLE plaid_items ALTER COLUMN access_token TYPE character varying(255);
