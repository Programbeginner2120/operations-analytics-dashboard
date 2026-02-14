package com.killeen.dashboard.db.mapper.generated;

import com.killeen.dashboard.db.model.generated.UserDb;
import com.killeen.dashboard.db.model.generated.UserDbExample;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserDbMapper {
    long countByExample(UserDbExample example);

    int deleteByExample(UserDbExample example);

    int deleteByPrimaryKey(Long id);

    int insert(UserDb row);

    int insertSelective(UserDb row);

    List<UserDb> selectByExample(UserDbExample example);

    UserDb selectByPrimaryKey(Long id);

    int updateByExampleSelective(@Param("row") UserDb row, @Param("example") UserDbExample example);

    int updateByExample(@Param("row") UserDb row, @Param("example") UserDbExample example);

    int updateByPrimaryKeySelective(UserDb row);

    int updateByPrimaryKey(UserDb row);
}