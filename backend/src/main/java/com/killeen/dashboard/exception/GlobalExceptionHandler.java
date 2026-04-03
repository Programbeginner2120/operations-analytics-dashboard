package com.killeen.dashboard.exception;

import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.killeen.dashboard.components.datasource.exception.DataSourceException;
import com.killeen.dashboard.components.email.exception.EmailNotVerifiedException;
import com.killeen.dashboard.components.email.exception.InvalidTokenException;
import com.killeen.dashboard.components.plaid.exception.PlaidItemNotFoundException;
import com.killeen.dashboard.components.plaid.exception.PlaidOperationException;
import com.killeen.dashboard.components.user.exception.InvalidCredentialsException;
import com.killeen.dashboard.components.user.exception.UserAlreadyExistsException;
import com.killeen.dashboard.components.user.exception.UserNotFoundException;

import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleUserAlreadyExists(UserAlreadyExistsException ex) {
        log.warn("User already exists: {}", ex.getMessage());
        return response(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentials(InvalidCredentialsException ex) {
        log.warn("Invalid credentials attempt");
        return response(HttpStatus.UNAUTHORIZED, "Invalid email or password");
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException ex) {
        log.warn("User not found: {}", ex.getMessage());
        return response(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(EmailNotVerifiedException.class)
    public ResponseEntity<ErrorResponse> handleEmailNotVerified(EmailNotVerifiedException ex) {
        log.warn("Email not verified: {}", ex.getMessage());
        return response(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ErrorResponse> handleInvalidToken(InvalidTokenException ex) {
        log.warn("Invalid token: {}", ex.getMessage());
        return response(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(PlaidItemNotFoundException.class)
    public ResponseEntity<ErrorResponse> handlePlaidItemNotFound(PlaidItemNotFoundException ex) {
        log.warn("Plaid item not found: {}", ex.getMessage());
        return response(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(PlaidOperationException.class)
    public ResponseEntity<ErrorResponse> handlePlaidOperation(PlaidOperationException ex) {
        log.error("Plaid operation failed: {}", ex.getMessage(), ex);
        return response(HttpStatus.BAD_GATEWAY, ex.getMessage());
    }

    @ExceptionHandler(DataSourceException.class)
    public ResponseEntity<ErrorResponse> handleDataSource(DataSourceException ex) {
        log.error("Data source error: {}", ex.getMessage(), ex);
        return response(HttpStatus.BAD_GATEWAY, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .collect(Collectors.joining(", "));
        log.warn("Validation failed: {}", message);
        return response(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpected(Exception ex) {
        log.error("Unexpected error", ex);
        return response(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
    }

    private ResponseEntity<ErrorResponse> response(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(new ErrorResponse(status.value(), message));
    }
}
