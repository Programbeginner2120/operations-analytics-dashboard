package com.killeen.components.datapoint.model;

import java.time.LocalDateTime;
import java.util.Map;

import lombok.Data;

@Data
public class DataPoint<E> {
    private String metricName;
    private E value;
    private LocalDateTime timestamp;
    private Map<String, Object> metadata;
    private String sourceType;
}
