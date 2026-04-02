package com.killeen.dashboard.components.plaid.exception;

public class PlaidItemNotFoundException extends RuntimeException {

    public PlaidItemNotFoundException(String message) {
        super(message);
    }
}
