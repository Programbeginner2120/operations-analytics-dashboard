package com.killeen.dashboard.components.plaid.repository;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.killeen.dashboard.components.plaid.converter.PlaidItemConverter;
import com.killeen.dashboard.components.plaid.model.PlaidItem;
import com.killeen.dashboard.db.mapper.generated.PlaidItemDbMapper;
import com.killeen.dashboard.db.model.generated.PlaidItemDb;
import com.killeen.dashboard.db.model.generated.PlaidItemDbExample;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class PlaidItemRepository {

    private final PlaidItemDbMapper plaidItemDbMapper;
    private final PlaidItemConverter plaidItemConverter;

    /**
     * Converts the domain model to a DB model, inserts it, and returns
     * the domain model with the generated ID populated.
     *
     * When child entities are added, cascading insert/update/delete
     * logic for children should live here inside a @Transactional boundary.
     */
    @Transactional
    public PlaidItem save(PlaidItem item) {
        PlaidItemDb dbModel = plaidItemConverter.toDb(item);
        plaidItemDbMapper.insert(dbModel);
        item.setId(dbModel.getId());
        return item;
    }

    /**
     * Fetches all PlaidItems and converts them to domain models.
     *
     * When child entities are added, this method can be extended to
     * eagerly load children via nested result maps or additional queries.
     */
    public List<PlaidItem> findAll() {
        List<PlaidItemDb> dbModels = plaidItemDbMapper.selectByExample(new PlaidItemDbExample());
        return plaidItemConverter.toDtoList(dbModels);
    }

    /**
     * Deletes a PlaidItem by its Plaid-assigned item ID.
     *
     * @return the number of rows deleted
     * @throws RuntimeException if no item is found with the given itemId
     */
    @Transactional
    public int deleteByItemId(String itemId) {
        PlaidItemDbExample example = new PlaidItemDbExample();
        example.createCriteria().andItemIdEqualTo(itemId);
        return plaidItemDbMapper.deleteByExample(example);
    }
}
