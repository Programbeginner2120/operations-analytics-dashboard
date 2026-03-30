package com.killeen.dashboard.components.plaid.config;

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

        PlaidCredentials credentials = new PlaidCredentials(
                plaidProperties.getClientId(),
                plaidProperties.getSecret());

        ApiClient apiClient = new ApiClient(credentials.toApiClientMap());

        switch (plaidProperties.getEnvironment()) {
            case "sandbox":
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
