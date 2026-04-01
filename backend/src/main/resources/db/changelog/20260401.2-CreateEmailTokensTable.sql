--liquibase formatted sql
--changeset mattk:20260401.2-CreateEmailTokensTable endDelimiter:go

CREATE TYPE email_token_type AS ENUM ('VERIFY_EMAIL', 'RESET_PASSWORD');

CREATE TABLE email_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    token_type email_token_type NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP
);

ALTER TABLE email_tokens
ADD CONSTRAINT fk_email_tokens_user_id
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE INDEX idx_email_tokens_token ON email_tokens(token);
CREATE INDEX idx_email_tokens_user_type ON email_tokens(user_id, token_type);