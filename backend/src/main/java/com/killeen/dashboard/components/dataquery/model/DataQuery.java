package com.killeen.dashboard.components.dataquery.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DataQuery {
    private List<String> metrics;
    private LocalDateTime startDate;
    private LocalDateTime endData;
    private Map<String, String> filters;
}
