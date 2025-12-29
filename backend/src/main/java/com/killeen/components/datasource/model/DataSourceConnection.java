package com.killeen.components.datasource.model;

import com.killeen.components.datasource.exception.DataSourceException;

import java.util.List;

import com.killeen.components.datapoint.model.DataPoint;
import com.killeen.components.dataquery.DataQuery;
import com.killeen.components.datasource.enums.ConnectionStatus;

public interface DataSourceConnection extends AutoCloseable {

    boolean isConnected();

    <E> List<DataPoint<E>> fetchData(DataQuery query);

    DataSourceConfig getConfig();

    String getSourceType();

    ConnectionStatus healthCheck();

    @Override
    void close() throws DataSourceException;
    
}
