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
}

