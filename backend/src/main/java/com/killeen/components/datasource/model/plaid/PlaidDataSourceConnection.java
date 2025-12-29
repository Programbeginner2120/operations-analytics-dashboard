package com.killeen.components.datasource.model.plaid;

import java.util.List;

import com.killeen.components.datapoint.model.DataPoint;
import com.killeen.components.dataquery.model.DataQuery;
import com.killeen.components.datasource.constants.SourceTypes;
import com.killeen.components.datasource.enums.ConnectionStatus;
import com.killeen.components.datasource.exception.DataSourceException;
import com.killeen.components.datasource.model.DataSourceConfig;
import com.killeen.components.datasource.model.DataSourceConnection;
import com.plaid.client.request.PlaidApi;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PlaidDataSourceConnection implements DataSourceConnection {

    private PlaidApi plaidClient;
    private DataSourceConfig config;

    @Override
    public boolean isConnected() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'isConnected'");
    }

    @Override
    public <E> List<DataPoint<E>> fetchData(DataQuery query) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'fetchData'");
    }

    @Override
    public DataSourceConfig getConfig() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getConfig'");
    }

    @Override
    public String getSourceType() {
        return SourceTypes.PLAID;
    }

    @Override
    public ConnectionStatus healthCheck() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'healthCheck'");
    }

    @Override
    public void close() throws DataSourceException {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'close'");
    }
    
}
