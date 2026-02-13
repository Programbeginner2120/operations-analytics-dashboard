package com.killeen.dashboard.components.plaid.converter;

import java.util.List;

import org.mapstruct.Mapper;

import com.killeen.dashboard.components.plaid.model.PlaidItem;
import com.killeen.dashboard.db.model.generated.PlaidItemDb;

@Mapper(componentModel = "spring")
public interface PlaidItemConverter {
    PlaidItem toDto(PlaidItemDb db);
    PlaidItemDb toDb(PlaidItem dto);
    List<PlaidItem> toDtoList(List<PlaidItemDb> dbList);
}
