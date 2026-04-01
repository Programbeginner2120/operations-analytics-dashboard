package com.killeen.dashboard.components.email.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.killeen.dashboard.components.email.repository.EmailTokenRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailTokenService {

    private final EmailTokenRepository emailTokenRepository;

    @Value("${app.email.verification-token-ttl-hours}")
    private int verificationTtlHours;

    @Value("${app.email.reset-token-ttl-hours}")
    private int resetTtlHours;


    
}
