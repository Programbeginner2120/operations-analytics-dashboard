package com.killeen.dashboard.components.plaid.model;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.killeen.dashboard.components.datasource.constants.SourceTypes;
import com.killeen.dashboard.components.datasource.enums.ConnectionStatus;
import com.killeen.dashboard.components.datasource.model.DataSourceConfig;
import com.killeen.dashboard.components.datasource.model.DataSourceConnection;
import com.killeen.dashboard.components.datasource.model.DataSourceConnector;
import com.killeen.dashboard.components.plaid.config.PlaidProperties;
import com.plaid.client.ApiClient;
import com.plaid.client.request.PlaidApi;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class PlaidDataSourceConnector implements DataSourceConnector {

    private final PlaidProperties plaidProperties;

    @Override
    public String getSourceType() {
        return SourceTypes.PLAID;
    }

    @Override
    public ConnectionStatus testConnection(DataSourceConfig config) {
        log.debug("Testing Plaid connection for config: {}", config.getDisplayName());
        
        try {
            Map<String, String> credentials = config.getCredentials();
            if (credentials == null || !credentials.containsKey("clientId") || !credentials.containsKey("secret")) {
                log.error("Test connection failed: Missing required credentials (clientId or secret)");
                return ConnectionStatus.CONNECTION_FAILURE;
            }

            createPlaidClient(config);
            log.info("Plaid connection test successful for: {}", config.getDisplayName());

            return ConnectionStatus.CONNECTED;
        } catch (Exception e) {
            log.error("Test connection failed with exception for: {}", config.getDisplayName(), e);
            return ConnectionStatus.CONNECTION_FAILURE;
        }
            
    }

    @Override
    public ConnectionStatus connect(DataSourceConfig config) {
        log.info("Connecting to Plaid data source: {}", config.getDisplayName());
        ConnectionStatus status = testConnection(config);
        log.debug("Connection attempt completed with status: {}", status);
        return status;
    }

    @Override
    public ConnectionStatus disconnect(DataSourceConfig config) {
        log.info("Disconnecting from Plaid data source: {}", config.getDisplayName());
        return ConnectionStatus.DISCONNECTED;
    }

    @Override
    public DataSourceConnection createConnection(DataSourceConfig config) {
        log.debug("Creating Plaid data source connection for: {}", config.getDisplayName());
        
        PlaidDataSourceConnection connection = PlaidDataSourceConnection.builder()
            .plaidClient(createPlaidClient(config))
            .config(config)
            .build();
        
        log.info("Plaid data source connection created successfully for: {}", config.getDisplayName());
        return connection;
    }

    /**
     * Creates a DataSourceConfig using injected Plaid properties from application configuration.
     * 
     * @return DataSourceConfig populated with credentials from application-local.yaml
     */
    public DataSourceConfig createDataSourceConfig() {
        log.debug("Creating DataSourceConfig from PlaidProperties");
        
        Map<String, String> credentials = new HashMap<>();
        credentials.put("clientId", plaidProperties.getClientId());
        credentials.put("secret", plaidProperties.getSecret());
        
        return DataSourceConfig.builder()
            .sourceType(SourceTypes.PLAID)
            .displayName("Plaid Data Source Configuration")
            .credentials(credentials)
            .build();
    }

    private PlaidApi createPlaidClient(DataSourceConfig config) {
        log.debug("Creating Plaid API client");
        
        Map<String, String> credentials = config.getCredentials();
        ApiClient apiClient = new ApiClient(credentials);
        apiClient.setPlaidAdapter(ApiClient.Sandbox);
        
        log.debug("Plaid API client created with Sandbox environment");
        return apiClient.createService(PlaidApi.class);
    }
    
}
