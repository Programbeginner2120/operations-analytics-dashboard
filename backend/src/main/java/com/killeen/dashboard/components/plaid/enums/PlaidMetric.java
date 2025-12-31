package com.killeen.dashboard.components.plaid.enums;

import com.killeen.dashboard.components.datasource.constants.SourceTypes;
import com.killeen.dashboard.components.datasource.model.Metric;

public enum PlaidMetric implements Metric {
    // TODO: Add Plaid metrics as you encounter them
    ACCOUNT_BALANCE(Double.class);

    private final Class<?> responseType;

    PlaidMetric(Class<?> responseType) {
        this.responseType = responseType;
    }

    @Override
    public String getName() {
        return this.name().toLowerCase();
    }

    @Override
    public String getSourceType() {
        return SourceTypes.PLAID;
    }

    @Override
    public Class<?> getResponseType() {
        return this.responseType;
    }

    public boolean matches(String name) {
        return this.getName().equalsIgnoreCase(name);
    }

    public static PlaidMetric fromName(String name) {
        for (PlaidMetric metric : values()) {
            if (metric.matches(name)) {
                return metric;
            }
        }
        throw new IllegalArgumentException("Unknown Plaid metric: " + name);
    }

}
