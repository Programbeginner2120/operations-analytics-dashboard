package com.killeen.dashboard.components.plaid.model;

import java.util.List;

import com.killeen.dashboard.components.datapoint.model.DataPoint;
import com.killeen.dashboard.components.dataquery.model.DataQuery;
import com.killeen.dashboard.components.datasource.constants.SourceTypes;
import com.killeen.dashboard.components.datasource.enums.ConnectionStatus;
import com.killeen.dashboard.components.datasource.exception.DataSourceException;
import com.killeen.dashboard.components.datasource.model.DataSourceConfig;
import com.killeen.dashboard.components.datasource.model.DataSourceConnection;
import com.plaid.client.model.AccountsBalanceGetRequest;
import com.plaid.client.model.AccountsGetResponse;
import com.plaid.client.request.PlaidApi;

import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import retrofit2.Response;

@Slf4j
@Data
@Builder
public class PlaidDataSourceConnection implements DataSourceConnection {

    private PlaidApi plaidClient;
    private DataSourceConfig config;
    @Builder.Default
    private boolean connected = true;

    @Override
    public boolean isConnected() {
        boolean connectionStatus = this.plaidClient != null && connected;
        log.debug("Checking connection status: {}", connectionStatus);
        return connectionStatus;
    }

    @Override
    public <E> List<DataPoint<E>> fetchData(DataQuery query) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'fetchData'");
    }

    @Override
    public DataSourceConfig getConfig() {
        return this.config;
    }

    @Override
    public String getSourceType() {
        return SourceTypes.PLAID;
    }

    @Override
    public ConnectionStatus healthCheck() {
        log.debug("Starting health check for Plaid data source");
        
        if (!isConnected()) {
            log.warn("Health check failed: Connection is not established");
            return ConnectionStatus.DISCONNECTED;
        }

        try {
            String accessToken = this.config.getCredentials().get("accessToken");
            if (accessToken == null || accessToken.isEmpty()) {
                log.error("Health check failed: Access token is null or empty");
                return ConnectionStatus.CONNECTION_FAILURE;
            }

            Response<AccountsGetResponse> response = executeHealthCheckRequeest(accessToken);

            if (response.isSuccessful()) {
                log.info("Health check successful: Plaid connection is active");
                return ConnectionStatus.CONNECTED;
            } else {
                log.warn("Health check failed: Response unsuccessful with code {}", response.code());
                return ConnectionStatus.CONNECTION_FAILURE;
            }
        } catch (Exception e) {
            log.error("Health check failed with exception", e);
            return ConnectionStatus.CONNECTION_FAILURE;
        }
    }

    @Override
    public void close() throws DataSourceException {
        log.info("Closing Plaid data source connection");
        this.connected = false;
        log.debug("Plaid data source connection closed successfully");
    }

    private Response<AccountsGetResponse> executeHealthCheckRequeest(String accessToken) {
        if (accessToken == null) {
            log.warn("Cannot execute health check request: access token is null");
            return null;
        }

        try {
            log.debug("Executing Plaid accounts balance request for health check");
            AccountsBalanceGetRequest request = new AccountsBalanceGetRequest().accessToken(accessToken);
            Response<AccountsGetResponse> response = this.plaidClient.accountsBalanceGet(request).execute();
            log.debug("Health check request executed, response code: {}", response.code());
            return response;
        } catch (Exception e) {
            log.error("Failed to execute health check request", e);
            return null;
        }
    }
    
}
