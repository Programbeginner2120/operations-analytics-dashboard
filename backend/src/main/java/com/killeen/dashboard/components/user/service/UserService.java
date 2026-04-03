package com.killeen.dashboard.components.user.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.killeen.dashboard.components.email.exception.EmailNotVerifiedException;
import com.killeen.dashboard.components.email.model.EmailToken;
import com.killeen.dashboard.components.email.model.EmailTokenType;
import com.killeen.dashboard.components.email.service.EmailService;
import com.killeen.dashboard.components.email.service.EmailTokenService;
import com.killeen.dashboard.components.user.exception.InvalidCredentialsException;
import com.killeen.dashboard.components.user.exception.UserAlreadyExistsException;
import com.killeen.dashboard.components.user.exception.UserNotFoundException;
import com.killeen.dashboard.components.user.model.LoginResponse;
import com.killeen.dashboard.components.user.model.User;
import com.killeen.dashboard.components.user.repository.UserRepository;
import com.killeen.dashboard.config.JwtService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.core.env.Environment;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailTokenService emailTokenService;
    private final EmailService emailService;
    private final Environment env;

    public User register(String email, String password, String displayName) {
        log.info("Registering new user with email: {}", email);

        if (userRepository.findByEmail(email).isPresent()) {
            throw new UserAlreadyExistsException(env.getProperty("user.email.already.exists"));
        }

        LocalDateTime now = LocalDateTime.now();
        User user = User.builder()
                .email(email.toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(password))
                .displayName(displayName)
                .createdAt(now)
                .updatedAt(now)
                .emailVerified(false)
                .build();

        User savedUser = userRepository.save(user);

        String rawToken = emailTokenService.createToken(savedUser.getId(), EmailTokenType.VERIFY_EMAIL);
        emailService.sendVerificationEmail(savedUser.getEmail(), rawToken);

        log.info("Successfully registered user with id: {}", savedUser.getId());
        return savedUser;
    }

    public LoginResponse authenticate(String email, String password) {
        log.info("Authenticating user with email: {}", email);

        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new InvalidCredentialsException(env.getProperty("user.credentials.invalid")));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new InvalidCredentialsException(env.getProperty("user.credentials.invalid"));
        }

        if (!user.isEmailVerified()) {
            throw new EmailNotVerifiedException(env.getProperty("email.not.verified"));
        }

        String token = jwtService.generateToken(user);
        log.info("Successfully authenticated user: {}", user.getId());

        return LoginResponse.builder()
                .token(token)
                .expiresIn(jwtService.getExpirationMs())
                .build();
    }

    public void verifyEmail(String rawToken) {
        EmailToken token = emailTokenService.validateAndConsume(rawToken, EmailTokenType.VERIFY_EMAIL);
        userRepository.setEmailVerified(token.getUserId(), true);
        log.info("Email verified for userId={}", token.getUserId());
    }

    public void resendVerification(String email) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
            .orElseThrow(() -> new UserNotFoundException(env.getProperty("email.no.account.found.with.email")));

        if (user.isEmailVerified()) {
            return;
        }

        String rawToken = emailTokenService.createToken(user.getId(), EmailTokenType.VERIFY_EMAIL);
        emailService.sendVerificationEmail(user.getEmail(), rawToken);
        log.info("Resent verification email to userId={}", user.getId());
    }

    public void forgotPassword(String email) {
        userRepository.findByEmail(email.toLowerCase().trim()).ifPresent(user -> {
            String rawToken = emailTokenService.createToken(user.getId(), EmailTokenType.RESET_PASSWORD);
            emailService.sendPasswordResetEmail(user.getEmail(), rawToken);
            log.info("Sent password reset email to userId={}", user.getId());
        });
    }

    public void resetPassword(String rawToken, String newPassword) {
        EmailToken token = emailTokenService.validateAndConsume(rawToken, EmailTokenType.RESET_PASSWORD);
        String newHash = passwordEncoder.encode(newPassword);
        userRepository.updatePassword(token.getUserId(), newHash);
        log.info("Password reset for userId={}", token.getUserId());
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(env.getProperty("user.not.found")));
    }
}
