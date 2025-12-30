package com.killeen.components.datasource.model.plaid;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.killeen.components.datasource.constants.SourceTypes;
import com.killeen.components.datasource.enums.ConnectionStatus;
import com.killeen.components.datasource.model.DataSourceConfig;
import com.killeen.components.datasource.model.DataSourceConnection;
import com.killeen.components.datasource.model.DataSourceConnector;
import com.plaid.client.ApiClient;
import com.plaid.client.request.PlaidApi;

@Component
public class PlaidDataSourceConnector implements DataSourceConnector {

    @Override
    public String getSourceType() {
        return SourceTypes.PLAID;
    }

    @Override
    public ConnectionStatus testConnection(DataSourceConfig config) {
        try {
            Map<String, String> credentials = config.getCredentials();
            if (credentials == null || !credentials.containsKey("clientId") || !credentials.containsKey("secret")) {
                return ConnectionStatus.CONNECTION_FAILURE;
            }

            createPlaidClient(config);

            return ConnectionStatus.CONNECTED;
        } catch (Exception e) {
            return ConnectionStatus.CONNECTION_FAILURE;
        }
            
    }

    @Override
    public ConnectionStatus connect(DataSourceConfig config) {
        return testConnection(config);
    }

    @Override
    public ConnectionStatus disconnect(DataSourceConfig config) {
        return ConnectionStatus.DISCONNECTED;
    }

    @Override
    public DataSourceConnection createConnection(DataSourceConfig config) {
        return PlaidDataSourceConnection.builder()
            .plaidClient(createPlaidClient(config))
            .config(config)
            .build();
    }

    private DataSourceConfig createDataSourceConfig() {
        Map<String, String> credentials = new HashMap<>();
        credentials.put("clientId", "placeholder");
        credentials.put("secret", "placeholder");
        

        return DataSourceConfig.builder()
            .sourceType(SourceTypes.PLAID)
            .displayName("Plaid Data Source Configuration")
            .credentials(credentials)
            .build();
    }

    private PlaidApi createPlaidClient(DataSourceConfig config) {
        Map<String, String> credentials = config.getCredentials();
        ApiClient apiClient = new ApiClient(credentials);
        apiClient.setPlaidAdapter(ApiClient.Sandbox);
        return apiClient.createService(PlaidApi.class);
    }
    
}
