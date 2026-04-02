package com.killeen.dashboard.components.email.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.email.from-address}")
    private String fromAddress;

    @Value("${app.email.base-url}")
    private String baseUrl;

    @Retryable(
        retryFor = MailException.class,
        maxAttempts = 3,
        backoff = @Backoff(delay = 2000, multiplier = 2.0)
    )
    public void sendVerificationEmail(String toEmail, String rawToken) {
        String link = String.format("%s/verify-email?token=%s", baseUrl, rawToken);
        String body = """
                Welcome from Operations Analytics Dashboard! Please verify your email address by clicking the link below.
                This link will expire in 24 hours.

                %s

                If you did not create an account, you can ignore this email.
                """.formatted(link);

        send(toEmail, "Verify your email address", body);
        log.info("Sent verification email to {}", toEmail);
    }

    @Retryable(
        retryFor = MailException.class,
        maxAttempts = 3,
        backoff = @Backoff(delay = 2000, multiplier = 2.0)
    )
    public void sendPasswordResetEmail(String toEmail, String rawToken) {
        String link = String.format("%s/reset-password?token=%s", baseUrl, rawToken);
        String body = """
                Hello from Operations Analytics Dashboard! We received a request to reset your password.
                Click the link below to set a new password. This link expires in 1 hour.

                %s

                If you did not request a password reset, you can ignore this email.
                """.formatted(link);

        send(toEmail, "Reset your password", body);
        log.info("Sent password reset email to {}", toEmail);
    }

    // TODO: I want to template out a nice HTML message with branding, come back and figure out how to do that later
    private void send(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
    
}
