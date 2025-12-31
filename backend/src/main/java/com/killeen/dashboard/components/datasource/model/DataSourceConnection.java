package com.killeen.dashboard.components.datasource.model;

import java.util.List;

import com.killeen.dashboard.components.datapoint.model.DataPoint;
import com.killeen.dashboard.components.dataquery.model.DataQuery;
import com.killeen.dashboard.components.datasource.enums.ConnectionStatus;
import com.killeen.dashboard.components.datasource.exception.DataSourceException;

public interface DataSourceConnection extends AutoCloseable {

    boolean isConnected();

    <E> List<DataPoint<E>> fetchData(DataQuery query);

    DataSourceConfig getConfig();

    String getSourceType();

    ConnectionStatus healthCheck();

    @Override
    void close() throws DataSourceException;
    
}
