package com.killeen.components.datasource.model;

import com.killeen.components.datasource.enums.ConnectionStatus;

public interface DataSourceConnector {
    String getSourceType();
    ConnectionStatus testConnection(DataSourceConfig config);
    ConnectionStatus connect(DataSourceConfig config);
    ConnectionStatus disconnect(DataSourceConfig config);
}
