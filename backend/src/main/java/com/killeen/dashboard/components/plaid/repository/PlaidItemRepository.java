package com.killeen.dashboard.components.plaid.repository;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.killeen.dashboard.components.plaid.converter.PlaidItemEncryptingConverter;
import com.killeen.dashboard.components.plaid.model.PlaidItem;
import com.killeen.dashboard.db.mapper.generated.PlaidItemDbMapper;
import com.killeen.dashboard.db.model.generated.PlaidItemDb;
import com.killeen.dashboard.db.model.generated.PlaidItemDbExample;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class PlaidItemRepository {

    private final PlaidItemDbMapper plaidItemDbMapper;
    private final PlaidItemEncryptingConverter plaidItemEncryptingConverter;

    @Transactional
    public PlaidItem save(PlaidItem item) {
        PlaidItemDb dbModel = plaidItemEncryptingConverter.toDb(item);
        plaidItemDbMapper.insert(dbModel);
        item.setId(dbModel.getId());
        return item;
    }

    public List<PlaidItem> findAll() {
        List<PlaidItemDb> dbModels = plaidItemDbMapper.selectByExample(new PlaidItemDbExample());
        List<PlaidItem> items = plaidItemEncryptingConverter.toDtoList(dbModels);
        return items;
    }

    public List<PlaidItem> findByUserId(Long userId) {
        PlaidItemDbExample example = new PlaidItemDbExample();
        example.createCriteria().andUserIdEqualTo(userId);
        List<PlaidItemDb> dbModels = plaidItemDbMapper.selectByExample(example);
        List<PlaidItem> items = plaidItemEncryptingConverter.toDtoList(dbModels);
        return items;
    }

    @Transactional
    public int deleteByItemIdAndUserId(String itemId, Long userId) {
        PlaidItemDbExample example = new PlaidItemDbExample();
        example.createCriteria()
                .andItemIdEqualTo(itemId)
                .andUserIdEqualTo(userId);
        return plaidItemDbMapper.deleteByExample(example);
    }

    @Transactional
    public int deleteByItemId(String itemId) {
        PlaidItemDbExample example = new PlaidItemDbExample();
        example.createCriteria().andItemIdEqualTo(itemId);
        return plaidItemDbMapper.deleteByExample(example);
    }
}
