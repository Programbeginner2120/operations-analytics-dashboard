package com.killeen.dashboard.db.mapper.generated;

import com.killeen.dashboard.db.model.generated.PlaidItemDb;
import com.killeen.dashboard.db.model.generated.PlaidItemDbExample;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PlaidItemDbMapper {
    long countByExample(PlaidItemDbExample example);

    int deleteByExample(PlaidItemDbExample example);

    int deleteByPrimaryKey(Long id);

    int insert(PlaidItemDb row);

    int insertSelective(PlaidItemDb row);

    List<PlaidItemDb> selectByExample(PlaidItemDbExample example);

    PlaidItemDb selectByPrimaryKey(Long id);

    int updateByExampleSelective(@Param("row") PlaidItemDb row, @Param("example") PlaidItemDbExample example);

    int updateByExample(@Param("row") PlaidItemDb row, @Param("example") PlaidItemDbExample example);

    int updateByPrimaryKeySelective(PlaidItemDb row);

    int updateByPrimaryKey(PlaidItemDb row);
}