package com.killeen.dashboard.components.datasource.model;

public interface Metric {
    public String getName();
    public String getSourceType();
    public Class<?> getResponseType();
}
