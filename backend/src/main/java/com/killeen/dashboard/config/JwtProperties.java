package com.killeen.dashboard.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

/**
 * Configuration properties for JWT authentication.
 * Binds properties from application.yaml with prefix "jwt"
 */
@Data
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    /**
     * Secret key used to sign JWT tokens (minimum 256-bit / 32 bytes for HS256)
     */
    private String secret;

    /**
     * Token expiration time in milliseconds (default: 24 hours)
     */
    private long expiration = 86400000;
}
