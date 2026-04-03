package com.killeen.dashboard.components.plaid.exception;

public class PlaidOperationException extends RuntimeException {

    public PlaidOperationException(String message) {
        super(message);
    }

    public PlaidOperationException(String message, Throwable cause) {
        super(message, cause);
    }
}
