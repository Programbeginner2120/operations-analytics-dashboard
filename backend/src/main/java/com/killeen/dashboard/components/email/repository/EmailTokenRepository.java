package com.killeen.dashboard.components.email.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.killeen.dashboard.components.email.converter.EmailTokenConverter;
import com.killeen.dashboard.components.email.model.EmailToken;
import com.killeen.dashboard.db.mapper.generated.EmailTokenDbMapper;
import com.killeen.dashboard.db.model.generated.EmailTokenDb;
import com.killeen.dashboard.db.model.generated.EmailTokenDbExample;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class EmailTokenRepository {

    private final EmailTokenDbMapper mapper;
    private final EmailTokenConverter converter;

    public EmailToken save(EmailToken token) {
        EmailTokenDb db = converter.toDb(token);
        mapper.insertSelective(db);
        token.setId(db.getId());
        return token;
    }

    public Optional<EmailToken> findByToken(String hashedToken) {
        EmailTokenDbExample example = new EmailTokenDbExample();
        example.createCriteria().andTokenEqualTo(hashedToken);
        return mapper.selectByExample(example).stream()
            .findFirst()
            .map(converter::toDto);
    }

    public void markUsed(Long id) {
        EmailTokenDb update = new EmailTokenDb();
        update.setId(id);
        update.setUsedAt(LocalDateTime.now());
        mapper.updateByPrimaryKeySelective(update);
    }
    
}
