package com.killeen.dashboard.components.plaid.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.killeen.dashboard.components.datapoint.model.DataPoint;
import com.killeen.dashboard.components.dataquery.model.DataQuery;
import com.killeen.dashboard.components.plaid.enums.PlaidMetric;
import com.killeen.dashboard.components.plaid.service.PlaidService;
import com.plaid.client.model.AccountBase;
import com.plaid.client.model.Transaction;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/plaid")
@Slf4j
@RequiredArgsConstructor
public class PlaidController {

    private final PlaidService plaidService;

    @SuppressWarnings("unchecked")
    @GetMapping("/account-balances")
    public List<DataPoint<AccountBase>> getAccountBalances(
        @RequestParam("startDate") LocalDateTime startDate, 
        @RequestParam("endDate") LocalDateTime endDate
    ) {
        DataQuery query = DataQuery.builder()
            .startDate(startDate)
            .endDate(endDate)
            .metrics(List.of(PlaidMetric.ACCOUNT_BALANCE))
            .build();
        return this.plaidService.fetchData(query)
            .stream()
            .map(dp -> (DataPoint<AccountBase>) dp)
            .collect(Collectors.toList());
    }

    @SuppressWarnings("unchecked")
    @GetMapping("/transactions")
    public List<DataPoint<Transaction>> getTransactions(
        @RequestParam("startDate") LocalDateTime startDate, 
        @RequestParam("endDate") LocalDateTime endDate
    ) {
        DataQuery query = DataQuery.builder()
            .startDate(startDate)
            .endDate(endDate)
            .metrics(List.of(PlaidMetric.TRANSACTIONS))
            .build();
        return this.plaidService.fetchData(query)
            .stream()
            .map(dp -> (DataPoint<Transaction>) dp)
            .collect(Collectors.toList());
    }
    
}
