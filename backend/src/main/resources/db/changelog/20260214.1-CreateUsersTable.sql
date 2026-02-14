--liquibase formatted sql 
--changeset mattk:20260214.1-CreateUsersTable endDelimiter:go

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email character varying(255) NOT NULL UNIQUE,
    password_hash character varying(255) NOT NULL,
    display_name character varying(255),
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);