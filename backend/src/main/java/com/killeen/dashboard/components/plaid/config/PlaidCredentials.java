package com.killeen.dashboard.components.plaid.config;

/**
 * Typed carrier for Plaid API credentials.
 *
 * <p>Use this record instead of a generic {@code Map<String, String>} so that
 * credentials are not accessible via arbitrary string key lookups and cannot be
 * accidentally logged as a map's {@code toString()} output.
 */
public record PlaidCredentials(String clientId, String secret) {

    /**
     * Converts these credentials to the {@code Map<String, String>} format
     * required by the Plaid {@code ApiClient} constructor.
     */
    public java.util.Map<String, String> toApiClientMap() {
        return java.util.Map.of("clientId", clientId, "secret", secret);
    }
}
