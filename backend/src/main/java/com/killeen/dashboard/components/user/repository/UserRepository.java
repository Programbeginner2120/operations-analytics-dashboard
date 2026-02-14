package com.killeen.dashboard.components.user.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.killeen.dashboard.components.user.model.User;

/**
 * Stub repository — replace with real implementation backed by
 * generated UserDbMapper + UserConverter after running mybatisGenerator.
 */
@Repository
public class UserRepository {

    // TODO: inject UserDbMapper and UserConverter once generated

    public User save(User user) {
        // TODO: implement with UserDbMapper.insert()
        throw new UnsupportedOperationException("UserRepository.save() not yet implemented — run mybatisGenerator first");
    }

    public Optional<User> findByEmail(String email) {
        // TODO: implement with UserDbMapper.selectByEmail()
        throw new UnsupportedOperationException("UserRepository.findByEmail() not yet implemented — run mybatisGenerator first");
    }

    public Optional<User> findById(Long id) {
        // TODO: implement with UserDbMapper.selectByPrimaryKey()
        throw new UnsupportedOperationException("UserRepository.findById() not yet implemented — run mybatisGenerator first");
    }
}
