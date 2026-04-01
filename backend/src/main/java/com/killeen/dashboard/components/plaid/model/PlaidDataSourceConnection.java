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
import com.killeen.dashboard.components.plaid.enums.PlaidMetric;
import com.plaid.client.model.AccountBase;
import com.plaid.client.model.AccountsBalanceGetRequest;
import com.plaid.client.model.AccountsGetResponse;
import com.plaid.client.model.Transaction;
import com.plaid.client.model.TransactionsGetRequest;
import com.plaid.client.model.TransactionsGetResponse;
import com.plaid.client.request.PlaidApi;

import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import retrofit2.Response;

import java.util.Locale;
import org.springframework.context.MessageSource;

@Slf4j
@Data
@Builder
public class PlaidDataSourceConnection implements DataSourceConnection {

    private PlaidApi plaidClient;
    private DataSourceConfig config;
    private MessageSource messageSource;
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
            throw new DataSourceException(messageSource.getMessage("plaid.connection.not.connected", null, Locale.getDefault()));
        }

        List<DataPoint<?>> results = new ArrayList<>();

        try {
            List<DataPoint<?>> metricResults = fetchMetric((PlaidMetric)query.getMetric(), query);
            results.addAll(metricResults);
        } catch (Exception e) {
            log.error("Failed to fetch metric {}: {}", query.getMetric(), e.getMessage(), e);
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

            Response<AccountsGetResponse> response = executeHealthCheckRequest(accessToken);

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

    private Response<AccountsGetResponse> executeHealthCheckRequest(String accessToken) {
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
            case TRANSACTIONS:
                return new ArrayList<>(fetchTransactions(query));
            default:
                throw new UnsupportedOperationException(
                    messageSource.getMessage("plaid.metric.not.implemented", new Object[]{metric}, Locale.getDefault())
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
                log.error("Failed to fetch account balances: {}", response.code());
                throw new DataSourceException(messageSource.getMessage("plaid.account.balances.fetch.failed", new Object[]{response.code()}, Locale.getDefault()));
            }

            return mapAccountsToDataPoints(response.body(), query);
        } catch (IOException e) {
            log.error("Error fetching account balances", e);
            throw new DataSourceException(messageSource.getMessage("plaid.account.balances.fetch.error", null, Locale.getDefault()), e);
        }
    }

    /**
     * Fetches transactions from Plaid API
     * Return DataPoints containing full Plaid Transaction objects
     */
    private List<DataPoint<Transaction>> fetchTransactions(DataQuery query) {
        String accessToken = config.getCredentials().get("accessToken");

        TransactionsGetRequest request = new TransactionsGetRequest()
            .accessToken(accessToken)
            .startDate(query.getStartDate().toLocalDate())
            .endDate(query.getEndDate().toLocalDate());

        try {
            Response<TransactionsGetResponse> response = plaidClient
                .transactionsGet(request)
                .execute();

            if (!response.isSuccessful()) {
                log.error("Failed to fetch transactions: {}", response.code());
                throw new DataSourceException(messageSource.getMessage("plaid.transactions.fetch.failed", new Object[]{response.code()}, Locale.getDefault()));
            }

            return mapTransactionsToDataPoints(response.body(), query);
        } catch (IOException e) {
            log.error("Error fetching transactions", e);
            throw new DataSourceException(messageSource.getMessage("plaid.transactions.fetch.error", null, Locale.getDefault()), e);
        }
    }

    private List<DataPoint<AccountBase>> mapAccountsToDataPoints(AccountsGetResponse response, DataQuery query) {
        List<DataPoint<AccountBase>> dataPoints = new ArrayList<>();
        LocalDateTime timestamp = LocalDateTime.now();

        for (AccountBase account : response.getAccounts()) {
            DataPoint<AccountBase> point = new DataPoint<>();

            point.setMetric(PlaidMetric.ACCOUNT_BALANCE);
            point.setSourceType(SourceTypes.PLAID);
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

    private List<DataPoint<Transaction>> mapTransactionsToDataPoints(TransactionsGetResponse response, DataQuery query) {
        List<DataPoint<Transaction>> dataPoints = new ArrayList<>();
        LocalDateTime timestamp = LocalDateTime.now();

        for (Transaction transaction : response.getTransactions()) {
            DataPoint<Transaction> point = new DataPoint<>();

            point.setMetric(PlaidMetric.TRANSACTIONS);
            point.setSourceType(SourceTypes.PLAID);
            point.setValue(transaction);
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
