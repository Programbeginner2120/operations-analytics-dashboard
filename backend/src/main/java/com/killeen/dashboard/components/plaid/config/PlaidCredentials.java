package com.killeen.dashboard.components.plaid.config;

import java.util.HashMap;
import java.util.Map;

/**
 * Typed carrier for Plaid API credentials.
 *
 * <p>Use this record instead of a generic {@code Map<String, String>} so that
 * credentials are not accessible via arbitrary string key lookups and cannot be
 * accidentally logged as a map's {@code toString()} output.
 */
public record PlaidCredentials(String clientId, String secret) {

    /**
     * Converts these credentials to the mutable {@code Map<String, String>} format
     * required by the Plaid {@code ApiClient} constructor. Mutable so that callers
     * can add additional entries such as {@code accessToken}.
     */
    public Map<String, String> toApiClientMap() {
        Map<String, String> map = new HashMap<>();
        map.put("clientId", clientId);
        map.put("secret", secret);
        return map;
    }
}
