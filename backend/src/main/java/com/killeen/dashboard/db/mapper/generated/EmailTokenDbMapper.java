package com.killeen.dashboard.db.mapper.generated;

import com.killeen.dashboard.db.model.generated.EmailTokenDb;
import com.killeen.dashboard.db.model.generated.EmailTokenDbExample;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface EmailTokenDbMapper {
    long countByExample(EmailTokenDbExample example);

    int deleteByExample(EmailTokenDbExample example);

    int deleteByPrimaryKey(Long id);

    int insert(EmailTokenDb row);

    int insertSelective(EmailTokenDb row);

    List<EmailTokenDb> selectByExample(EmailTokenDbExample example);

    EmailTokenDb selectByPrimaryKey(Long id);

    int updateByExampleSelective(@Param("row") EmailTokenDb row, @Param("example") EmailTokenDbExample example);

    int updateByExample(@Param("row") EmailTokenDb row, @Param("example") EmailTokenDbExample example);

    int updateByPrimaryKeySelective(EmailTokenDb row);

    int updateByPrimaryKey(EmailTokenDb row);
}