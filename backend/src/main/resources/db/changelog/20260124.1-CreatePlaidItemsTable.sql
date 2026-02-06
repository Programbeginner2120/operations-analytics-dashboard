--liquibase formatted sql 
--changeset mattk:20260124.1-CreatePlaidItemsTable endDelimiter:go

CREATE TABLE plaid_items (
    id BIGSERIAL PRIMARY KEY,
    item_id character varying(255) NOT NULL,
    access_token character varying(255) NOT NULL,
    institution_id character varying(255) NOT NULL,
    institution_name character varying(255) NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);