package com.killeen.dashboard.components.plaid.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/* 
    Entity representing a connected Plaid institution.
*/
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaidItem {
    private Long id;
    private String itemId;
    private String accessToken;
    private String institutionId;
    private String institutionName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
