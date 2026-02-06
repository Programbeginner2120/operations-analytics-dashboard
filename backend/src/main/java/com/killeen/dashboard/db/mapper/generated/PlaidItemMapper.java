package com.killeen.dashboard.db.mapper.generated;

import com.killeen.dashboard.db.model.generated.PlaidItem;
import com.killeen.dashboard.db.model.generated.PlaidItemExample;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PlaidItemMapper {
    long countByExample(PlaidItemExample example);

    int deleteByExample(PlaidItemExample example);

    int deleteByPrimaryKey(Long id);

    int insert(PlaidItem row);

    int insertSelective(PlaidItem row);

    List<PlaidItem> selectByExample(PlaidItemExample example);

    PlaidItem selectByPrimaryKey(Long id);

    int updateByExampleSelective(@Param("row") PlaidItem row, @Param("example") PlaidItemExample example);

    int updateByExample(@Param("row") PlaidItem row, @Param("example") PlaidItemExample example);

    int updateByPrimaryKeySelective(PlaidItem row);

    int updateByPrimaryKey(PlaidItem row);
}