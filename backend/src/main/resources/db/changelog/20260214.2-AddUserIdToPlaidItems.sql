--liquibase formatted sql 
--changeset mattk:20260214.2-AddUserIdToPlaidItems endDelimiter:go

ALTER TABLE plaid_items
    ADD COLUMN user_id BIGINT;

ALTER TABLE plaid_items
    ADD CONSTRAINT fk_plaid_items_user_id
    FOREIGN KEY (user_id) REFERENCES users(id);