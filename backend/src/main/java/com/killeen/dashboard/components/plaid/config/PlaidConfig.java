package com.killeen.dashboard.components.plaid.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.plaid.client.ApiClient;
import com.plaid.client.request.PlaidApi;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class PlaidConfig {
    
    private final PlaidProperties plaidProperties;

    @Bean
    public PlaidApi plaidApi() {
        log.info("Creating PlaidApi bean for {} environment", plaidProperties.getEnvironment());

        Map<String, String> credentials = new HashMap<>();
        credentials.put("clientId", plaidProperties.getClientId());
        credentials.put("secret", plaidProperties.getSecret());

        ApiClient apiClient = new ApiClient(credentials);

        switch (plaidProperties.getEnvironment()) {
            case "sandbox": a
            case "development":
                // Both sandbox and development use the Plaid Sandbox environment
                apiClient.setPlaidAdapter(ApiClient.Sandbox);
                break;
            case "production":
                apiClient.setPlaidAdapter(ApiClient.Production);
                break;
            default:
                throw new IllegalArgumentException(
                    "Invalid Plaid environment: " + plaidProperties.getEnvironment() + 
                    ". Valid values are: sandbox, development, production"
                );
        }

        log.info("PlaidApi bean created successfully for {} environment", plaidProperties.getEnvironment());
        return apiClient.createService(PlaidApi.class);
    }

}
