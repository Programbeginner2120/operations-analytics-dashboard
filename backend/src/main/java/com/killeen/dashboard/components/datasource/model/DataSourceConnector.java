package com.killeen.dashboard.components.datasource.model;

import com.killeen.dashboard.components.datasource.enums.ConnectionStatus;

public interface DataSourceConnector {
    String getSourceType();
    ConnectionStatus testConnection(DataSourceConfig config);
    ConnectionStatus connect(DataSourceConfig config);
    ConnectionStatus disconnect(DataSourceConfig config);
    DataSourceConnection createConnection(DataSourceConfig config);
}
