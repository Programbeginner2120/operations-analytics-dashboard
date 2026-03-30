package com.killeen.dashboard.components.plaid.converter;

import java.util.List;

import org.springframework.stereotype.Component;

import com.killeen.dashboard.components.plaid.model.PlaidItem;
import com.killeen.dashboard.components.plaid.service.PlaidTokenEncryptionService;
import com.killeen.dashboard.db.model.generated.PlaidItemDb;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PlaidItemEncryptingConverter {
    
    private final PlaidItemConverter delegate;
    private final PlaidTokenEncryptionService plaidTokenEncryptionService;

    /**
     * Decorator around PlaidConverter toDto that decrypts access token
     * @param db - the PlaidItemDb to convert and decrypt
     * @return plaidItem - the PlaidItem converted and decrypted
     */
    public PlaidItem toDto(PlaidItemDb db) {
        PlaidItem plaidItem = delegate.toDto(db);
        plaidItem.setAccessToken(plaidTokenEncryptionService.decrypt(plaidItem.getAccessToken()));
        return plaidItem;
    }

    /**
     * Decorator around PlaidConverter toDb that encrypts access token
     * @param dto - the PlaidItem to convert and encrypt
     * @return plaidItemDb - the PlaidItemDb converted and encrypted
     */
    public PlaidItemDb toDb(PlaidItem dto) {
        PlaidItemDb plaidItemDb = delegate.toDb(dto);
        plaidItemDb.setAccessToken(plaidTokenEncryptionService.encrypt(plaidItemDb.getAccessToken()));
        return plaidItemDb;
    }

    /**
     * Decorator around PlaidConverter toDtoList that decrypts access token
     * @param dbs - the PlaidItemDb objects to convert and decrypt
     * @return plaidItems - the PlaidItems converted and decrypted
     */
    public List<PlaidItem> toDtoList(List<PlaidItemDb> dbs) {
        List<PlaidItem> plaidItems = delegate.toDtoList(dbs);
        plaidItems.forEach(plaidItem -> plaidItem.setAccessToken(plaidTokenEncryptionService.decrypt(plaidItem.getAccessToken())));
        return plaidItems;
    }
}
