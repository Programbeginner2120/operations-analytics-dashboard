package com.killeen.dashboard.components.plaid.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

/**
 * Configuration properties for Plaid API integration.
 * Binds properties from application.yaml with prefix "plaid"
 */
@Data
@Component
@ConfigurationProperties(prefix = "plaid")
public class PlaidProperties {
    
    /**
     * Plaid client ID for API authentication
     */
    private String clientId;
    
    /**
     * Plaid secret key for API authentication
     */
    private String secret;
    
    /**
     * Plaid environment (sandbox, development, or production)
     */
    private String environment = "sandbox";

    /**
     * Password used to derive the AES-256-GCM key for encrypting Plaid access tokens at rest.
     * Must be provided via the PLAID_TOKEN_ENCRYPTION_KEY environment variable.
     */
    private String tokenEncryptionKey;

    /**
     * Hex-encoded salt used alongside tokenEncryptionKey for key derivation.
     * Not secret, but must be unique to this application and stable across restarts.
     * Must be provided via the PLAID_TOKEN_ENCRYPTION_SALT environment variable.
     */
    private String tokenEncryptionSalt;
}

