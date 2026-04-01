package com.killeen.dashboard.components.email.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailToken {
    private Long id;
    private Long userId;
    private String token;          // SHA-256 hex stored in DB
    private EmailTokenType tokenType;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private LocalDateTime usedAt;
}