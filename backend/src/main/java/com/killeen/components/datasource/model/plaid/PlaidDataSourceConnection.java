package com.killeen.components.datasource.model.plaid;

import java.util.List;

import com.killeen.components.datapoint.model.DataPoint;
import com.killeen.components.dataquery.model.DataQuery;
import com.killeen.components.datasource.constants.SourceTypes;
import com.killeen.components.datasource.enums.ConnectionStatus;
import com.killeen.components.datasource.exception.DataSourceException;
import com.killeen.components.datasource.model.DataSourceConfig;
import com.killeen.components.datasource.model.DataSourceConnection;
import com.plaid.client.model.AccountsBalanceGetRequest;
import com.plaid.client.model.AccountsGetResponse;
import com.plaid.client.request.PlaidApi;

import lombok.Builder;
import lombok.Data;
import retrofit2.Response;

@Data
@Builder
public class PlaidDataSourceConnection implements DataSourceConnection {

    private PlaidApi plaidClient;
    private DataSourceConfig config;
    @Builder.Default
    private boolean connected = true;

    @Override
    public boolean isConnected() {
        return this.plaidClient != null && connected;
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
        if (!isConnected()) {
            return ConnectionStatus.DISCONNECTED;
        }

        try {
            String accessToken = this.config.getCredentials().get("accessToken");
            if (accessToken == null || accessToken.isEmpty()) {
                return ConnectionStatus.CONNECTION_FAILURE;
            }

            Response<AccountsGetResponse> response = executeHealthCheckRequeest(accessToken);

            if (response.isSuccessful()) {
                return ConnectionStatus.CONNECTED;
            } else {
                return ConnectionStatus.CONNECTION_FAILURE;
            }
        } catch (Exception e) {
            return ConnectionStatus.CONNECTION_FAILURE;
        }
    }

    @Override
    public void close() throws DataSourceException {
        this.connected = false;
    }

    private Response<AccountsGetResponse> executeHealthCheckRequeest(String accessToken) {
        if (accessToken == null) {
            return null;
        }

        try {
            AccountsBalanceGetRequest request = new AccountsBalanceGetRequest().accessToken(accessToken);
            return this.plaidClient.accountsBalanceGet(request).execute();
        } catch (Exception e) {
            return null;
        }
    }
    
}
