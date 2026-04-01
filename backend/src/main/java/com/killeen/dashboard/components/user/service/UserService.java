package com.killeen.dashboard.components.user.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
    private final Environment env;

    public User register(String email, String password, String displayName) {
        log.info("Registering new user with email: {}", email);

        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException(env.getProperty("user.email.already.exists"));
        }

        LocalDateTime now = LocalDateTime.now();
        User user = User.builder()
                .email(email.toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(password))
                .displayName(displayName)
                .createdAt(now)
                .updatedAt(now)
                .build();

        User savedUser = userRepository.save(user);
        log.info("Successfully registered user with id: {}", savedUser.getId());
        return savedUser;
    }

    public LoginResponse authenticate(String email, String password) {
        log.info("Authenticating user with email: {}", email);

        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException(env.getProperty("user.credentials.invalid")));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException(env.getProperty("user.credentials.invalid"));
        }

        String token = jwtService.generateToken(user);
        log.info("Successfully authenticated user: {}", user.getId());

        return LoginResponse.builder()
                .token(token)
                .expiresIn(jwtService.getExpirationMs())
                .build();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(env.getProperty("user.not.found")));
    }
}
