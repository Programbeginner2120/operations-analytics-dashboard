package com.killeen.dashboard.components.plaid.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LinkTokenResponse {
    private String linkToken;
    private String expiration;
}
