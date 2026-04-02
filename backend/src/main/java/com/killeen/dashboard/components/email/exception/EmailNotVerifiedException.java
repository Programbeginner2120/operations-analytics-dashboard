package com.killeen.dashboard.components.email.exception;

public class EmailNotVerifiedException extends RuntimeException {

    public EmailNotVerifiedException(String message) {
        super(message);
    }

    public EmailNotVerifiedException(String message, Throwable e) {
        super(message, e);
    }

}
