package com.killeen.dashboard.components.user.converter;

import org.mapstruct.Mapper;

import com.killeen.dashboard.components.user.model.User;
import com.killeen.dashboard.db.model.generated.UserDb;

@Mapper(componentModel = "spring")
public interface UserConverter {
    User toDto(UserDb db);
    UserDb toDb(User dto);
}
