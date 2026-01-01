package com.killeen.dashboard.components.plaid.model;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.killeen.dashboard.components.datapoint.model.DataPoint;
import com.killeen.dashboard.components.dataquery.model.DataQuery;
import com.killeen.dashboard.components.datasource.constants.SourceTypes;
import com.killeen.dashboard.components.datasource.enums.ConnectionStatus;
import com.killeen.dashboard.components.datasource.exception.DataSourceException;
import com.killeen.dashboard.components.datasource.model.DataSourceConfig;
import com.killeen.dashboard.components.datasource.model.DataSourceConnection;
import com.killeen.dashboard.components.datasource.model.Metric;
import com.killeen.dashboard.components.plaid.enums.PlaidMetric;
import com.plaid.client.model.AccountBase;
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
    public List<DataPoint<?>> fetchData(DataQuery query) {
        if (!isConnected()) {
            throw new DataSourceException("Not connected to Plaid");
        }

        List<DataPoint<?>> results = new ArrayList<>();

        for (Metric metric : query.getMetrics()) {
            if (metric instanceof PlaidMetric) {
                try {
                    List<DataPoint<?>> metricResults = fetchMetric((PlaidMetric) metric, query);
                    results.addAll(metricResults);
                } catch (Exception e) {
                    log.error("Failed to fetch metric {}: {}", metric, e.getMessage(), e);
                }
            } else {
                log.warn("Skipping non-Plaid metric: {}", metric);
            }
        }

        return results;
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

    /**
     * Routes a specific PlaidMetric to its handler method
     */
    private List<DataPoint<?>> fetchMetric(PlaidMetric metric, DataQuery query) {
        switch (metric) {
            case ACCOUNT_BALANCE:
                return new ArrayList<>(fetchAccountBalances(query));
            default:
                throw new UnsupportedOperationException(
                    "Metric not yet implemented: " + metric
                );
        }
    }

    /**
     * Fetches account balances from Plaid API
     * Returns DataPoints containing full Plaid Account objects
     */
    private List<DataPoint<AccountBase>> fetchAccountBalances(DataQuery query) {
        String accessToken = config.getCredentials().get("accessToken");

        AccountsBalanceGetRequest request = new AccountsBalanceGetRequest()
            .accessToken(accessToken);

        try {
            Response<AccountsGetResponse> response = plaidClient
                .accountsBalanceGet(request)
                .execute();

            if (!response.isSuccessful()) {
                throw new DataSourceException("Failed to fetch account balances: " + response.code());
            }

            return mapAccountsToDataPoints(response.body(), query);
        } catch (IOException e) {
            throw new DataSourceException("Error fetching account balances", e);
        }
    }

    private List<DataPoint<AccountBase>> mapAccountsToDataPoints(AccountsGetResponse response, DataQuery query) {
        List<DataPoint<AccountBase>> dataPoints = new ArrayList<>();
        LocalDateTime timestamp = LocalDateTime.now();

        for (AccountBase account : response.getAccounts()) {
            DataPoint<AccountBase> point = new DataPoint<>();

            point.setMetric(PlaidMetric.ACCOUNT_BALANCE);
            point.setValue(account);
            point.setTimestamp(timestamp);

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("queryStartDate", query.getStartDate());
            metadata.put("queryEndDate", query.getEndDate());
            metadata.put("fetchTimestamp", timestamp);
            metadata.put("institutionId", response.getItem().getInstitutionId());
            point.setMetadata(metadata);

            dataPoints.add(point);
        }

        return dataPoints;
    }
    
}
