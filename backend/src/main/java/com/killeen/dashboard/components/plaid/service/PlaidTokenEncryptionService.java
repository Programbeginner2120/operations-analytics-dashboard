package com.killeen.dashboard.components.plaid.service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.springframework.security.crypto.encrypt.BytesEncryptor;
import org.springframework.security.crypto.encrypt.Encryptors;
import org.springframework.stereotype.Service;

import com.killeen.dashboard.components.plaid.config.PlaidProperties;

/**
 * Encrypts and decrypts Plaid access tokens at rest using AES-256-GCM via
 * Spring Security Crypto. A unique IV is generated per encryption, so identical
 * tokens produce different ciphertexts each time.
 */
@Service
public class PlaidTokenEncryptionService {

    private final BytesEncryptor encryptor;

    public PlaidTokenEncryptionService(PlaidProperties plaidProperties) {
        this.encryptor = Encryptors.stronger(
            plaidProperties.getTokenEncryptionKey(),
            plaidProperties.getTokenEncryptionSalt()
        );
    }

    public String encrypt(String plaintext) {
        byte[] encrypted = encryptor.encrypt(plaintext.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(encrypted);
    }

    public String decrypt(String ciphertext) {
        byte[] decrypted = encryptor.decrypt(Base64.getDecoder().decode(ciphertext));
        return new String(decrypted, StandardCharsets.UTF_8);
    }
}
