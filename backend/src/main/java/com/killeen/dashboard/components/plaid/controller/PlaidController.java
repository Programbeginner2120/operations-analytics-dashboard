package com.killeen.dashboard.components.plaid.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.killeen.dashboard.components.datapoint.model.DataPoint;
import com.killeen.dashboard.components.dataquery.model.DataQuery;
import com.killeen.dashboard.components.plaid.enums.PlaidMetric;
import com.killeen.dashboard.components.plaid.model.ExchangeTokenRequest;
import com.killeen.dashboard.components.plaid.model.LinkTokenResponse;
import com.killeen.dashboard.components.plaid.model.PlaidItem;
import com.killeen.dashboard.components.plaid.service.PlaidService;
import com.plaid.client.model.AccountBase;
import com.plaid.client.model.Transaction;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/plaid")
@Slf4j
@RequiredArgsConstructor
public class PlaidController {

    private final PlaidService plaidService;

    @PostMapping("/link-token")
    public ResponseEntity<LinkTokenResponse> createLinkToken() {
        log.info("Received request to create link token");
        String linkToken = plaidService.createLinkToken("default-user");
        LinkTokenResponse response = LinkTokenResponse.builder()
            .linkToken(linkToken)
            .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/exchange-token")
    public ResponseEntity<PlaidItem> exchangePublicToken(@RequestBody ExchangeTokenRequest request) {
        log.info("Received request to exchange public token");
        PlaidItem item = plaidService.exchangePublicToken(request.getPublicToken());
        return ResponseEntity.ok(item);
    }

    @GetMapping("/items")
    public ResponseEntity<List<PlaidItem>> getConnectedItems() {
        log.info("Fetching all connected items");
        List<PlaidItem> items = plaidService.getAllItems();
        return ResponseEntity.ok(items);
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> deleteItem(@PathVariable String itemId) {
        log.info("Received request to delete item: {}", itemId);
        plaidService.deleteItem(itemId);
        return ResponseEntity.noContent().build();
    }

    @SuppressWarnings("unchecked")
    @GetMapping("/account-balances")
    public List<DataPoint<AccountBase>> getAccountBalances(
        @RequestParam("startDate") LocalDateTime startDate, 
        @RequestParam("endDate") LocalDateTime endDate
    ) {
        DataQuery query = DataQuery.builder()
            .startDate(startDate)
            .endDate(endDate)
            .metric(PlaidMetric.ACCOUNT_BALANCE)
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
            .metric(PlaidMetric.TRANSACTIONS)
            .build();
        return this.plaidService.fetchData(query)
            .stream()
            .map(dp -> (DataPoint<Transaction>) dp)
            .collect(Collectors.toList());
    }
    
}
