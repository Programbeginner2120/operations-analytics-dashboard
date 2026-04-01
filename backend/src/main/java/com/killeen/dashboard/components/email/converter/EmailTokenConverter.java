package com.killeen.dashboard.components.email.converter;

import java.util.List;

import org.mapstruct.Mapper;

import com.killeen.dashboard.components.email.model.EmailToken;
import com.killeen.dashboard.db.model.generated.EmailTokenDb;

@Mapper(componentModel = "spring")
public interface EmailTokenConverter {
    EmailToken toDto(EmailTokenDb db);
    EmailTokenDb toDb(EmailToken dto);
    List<EmailToken> toDtoList(List<EmailTokenDb> dbList);
}
