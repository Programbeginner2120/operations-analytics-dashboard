package com.killeen.dashboard.components.datapoint.model;

import java.time.LocalDateTime;
import java.util.Map;

import com.killeen.dashboard.components.datasource.model.Metric;

import lombok.Data;

@Data
public class DataPoint<E> {
    private Metric metric;
    private E value;
    private LocalDateTime timestamp;
    private Map<String, Object> metadata;
    private String sourceType;
}
