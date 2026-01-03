package com.killeen.dashboard.components.dataquery.model;

import java.time.LocalDateTime;
import java.util.Map;

import com.killeen.dashboard.components.datasource.model.Metric;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DataQuery {
    private Metric metric;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Map<String, String> filters;
}
