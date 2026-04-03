package com.killeen.dashboard.components.email.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import com.killeen.dashboard.components.email.exception.InvalidTokenException;
import com.killeen.dashboard.components.email.model.EmailToken;
import com.killeen.dashboard.components.email.model.EmailTokenType;
import com.killeen.dashboard.components.email.repository.EmailTokenRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailTokenService {

    private final EmailTokenRepository emailTokenRepository;
    private final Environment env;

    @Value("${app.email.verification-token-ttl-hours}")
    private int verificationTtlHours;

    @Value("${app.email.reset-token-ttl-hours}")
    private int resetTtlHours;

    /**
     * Creates a new token for the given user and type.
     * Returns the raw (unhashed) UUID to be placed in the email link.
     */
    public String createToken(Long userId, EmailTokenType type) {
        String rawToken = UUID.randomUUID().toString();
        String hashedToken = sha256(rawToken);
        int ttlHours = type == EmailTokenType.VERIFY_EMAIL ? verificationTtlHours : resetTtlHours;

        LocalDateTime now = LocalDateTime.now();
        EmailToken token = EmailToken.builder()
                .userId(userId)
                .token(hashedToken)
                .tokenType(type)
                .createdAt(now)
                .expiresAt(now.plusHours(ttlHours))
                .build();

        emailTokenRepository.save(token);
        log.debug("Created {} token for userId={}", userId);
        return rawToken;
    }

    /**
     * Validates a raw token. Returns the stored EmailToken if valid.
     * Throws IllegalArgumentException if the token is unknown, expired or already in use.
     */
    public EmailToken validateAndConsume(String rawToken, EmailTokenType expectedType) {
        String hashedToken = sha256(rawToken);

        // TODO: If we had millions of users, this would likely melt our servers. I wonder if there's a better way...
        EmailToken token = emailTokenRepository.findByToken(hashedToken)
            .orElseThrow(() -> new InvalidTokenException(env.getProperty("email.token.invalid.or.unknown")));

        if (token.getTokenType() != expectedType) {
            throw new InvalidTokenException(env.getProperty("email.token.invalid.token.type"));
        }

        if (token.getUsedAt() != null) {
            throw new InvalidTokenException(env.getProperty("email.token.already.been.used"));
        }

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new InvalidTokenException(env.getProperty("email.token.has.expired"));
        }

        emailTokenRepository.markUsed(token.getId());
        return token;
    }

    private String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            // SHA-256 is guaranteed by the JVM spec
            throw new IllegalArgumentException(env.getProperty("security.sha.256.not.available"), e);
        }
    }


    
}
