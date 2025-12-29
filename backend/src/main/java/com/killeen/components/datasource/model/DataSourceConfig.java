package com.killeen.components.datasource.model;

import java.util.Map;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DataSourceConfig {
    private Long id;
    private String sourceType;
    private String displayName;
    private Map<String, String> credentials;
    private Map<String, Object> settings;
    private boolean enabled;
}
