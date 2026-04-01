package com.killeen.dashboard.components.plaid.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.killeen.dashboard.components.datapoint.model.DataPoint;
import com.killeen.dashboard.components.dataquery.model.DataQuery;
import com.killeen.dashboard.components.datasource.exception.DataSourceException;
import com.killeen.dashboard.components.datasource.model.DataSourceConfig;
import com.killeen.dashboard.components.plaid.config.PlaidProperties;
import com.killeen.dashboard.components.plaid.model.PlaidDataSourceConnection;
import com.killeen.dashboard.components.plaid.model.PlaidDataSourceConnector;
import com.killeen.dashboard.components.plaid.model.PlaidItem;
import com.killeen.dashboard.components.plaid.repository.PlaidItemRepository;
import com.plaid.client.model.CountryCode;
import com.plaid.client.model.ItemGetRequest;
import com.plaid.client.model.ItemGetResponse;
import com.plaid.client.model.ItemPublicTokenExchangeRequest;
import com.plaid.client.model.ItemPublicTokenExchangeResponse;
import com.plaid.client.model.LinkTokenCreateRequest;
import com.plaid.client.model.LinkTokenCreateRequestUser;
import com.plaid.client.model.LinkTokenCreateResponse;
import com.plaid.client.model.Products;
import com.plaid.client.model.SandboxPublicTokenCreateRequest;
import com.plaid.client.model.SandboxPublicTokenCreateResponse;
import com.plaid.client.request.PlaidApi;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import retrofit2.Response;

import java.util.Locale;
import org.springframework.context.MessageSource;

@Service
@Slf4j
@RequiredArgsConstructor
public class PlaidService {

    private final PlaidDataSourceConnector plaidConnector;
    private final PlaidApi plaidClient;
    private final PlaidItemRepository plaidItemRepository;
    private final MessageSource messageSource;

    public String createLinkToken(Long userId) {
        try {
            log.info("Creating link token for user: {}", userId);
            
            LinkTokenCreateRequestUser user = new LinkTokenCreateRequestUser()
                .clientUserId(String.valueOf(userId));
            
            LinkTokenCreateRequest request = new LinkTokenCreateRequest()
                .user(user)
                .clientName("Operations Analytics Dashboard")
                .products(Arrays.asList(Products.TRANSACTIONS))
                .countryCodes(Arrays.asList(CountryCode.US))
                .language("en");
            
            Response<LinkTokenCreateResponse> response = plaidClient
                .linkTokenCreate(request)
                .execute();
            
            if (!response.isSuccessful()) {
                log.error("Failed to create link token: {} {}", response.code(), response.message());
                throw new RuntimeException(messageSource.getMessage("plaid.link.token.create.failed", new Object[]{response.code()}, Locale.getDefault()));
            }
            
            String linkToken = response.body().getLinkToken();
            log.info("Successfully created link token");
            return linkToken;
            
        } catch (IOException e) {
            log.error("Error creating link token", e);
            throw new RuntimeException(messageSource.getMessage("plaid.link.token.create.error", null, Locale.getDefault()), e);
        }
    }

    public PlaidItem exchangePublicToken(String publicToken, Long userId) {
        try {
            log.info("Exchanging public token for user: {}", userId);
            
            ItemPublicTokenExchangeRequest exchangeRequest = 
                new ItemPublicTokenExchangeRequest()
                    .publicToken(publicToken);
            
            Response<ItemPublicTokenExchangeResponse> exchangeResponse = 
                plaidClient.itemPublicTokenExchange(exchangeRequest).execute();
            
            if (!exchangeResponse.isSuccessful()) {
                log.error("Failed to exchange public token: {}", exchangeResponse.code());
                throw new RuntimeException(messageSource.getMessage("plaid.public.token.exchange.failed", new Object[]{exchangeResponse.code()}, Locale.getDefault()));
            }
            
            String accessToken = exchangeResponse.body().getAccessToken();
            String itemId = exchangeResponse.body().getItemId();
            log.info("Successfully exchanged token for item: {}", itemId);
            
            ItemGetRequest itemRequest = new ItemGetRequest().accessToken(accessToken);
            Response<ItemGetResponse> itemResponse = plaidClient.itemGet(itemRequest).execute();
            
            String institutionId = null;
            if (itemResponse.isSuccessful() && itemResponse.body().getItem().getInstitutionId() != null) {
                institutionId = itemResponse.body().getItem().getInstitutionId();
            }
            
            LocalDateTime now = LocalDateTime.now();
            PlaidItem plaidItem = PlaidItem.builder()
                .userId(userId)
                .itemId(itemId)
                .accessToken(accessToken)
                .institutionId(institutionId)
                .institutionName(institutionId)
                .createdAt(now)
                .updatedAt(now)
                .build();
            
            PlaidItem savedItem = plaidItemRepository.save(plaidItem);
            log.info("Saved PlaidItem with id: {}", savedItem.getId());
            
            return savedItem;
            
        } catch (IOException e) {
            log.error("Error exchanging public token", e);
            throw new RuntimeException(messageSource.getMessage("plaid.public.token.exchange.error", null, Locale.getDefault()), e);
        }
    }

    public List<PlaidItem> getAllItems(Long userId) {
        log.debug("Fetching connected Plaid items for user: {}", userId);
        return plaidItemRepository.findByUserId(userId);
    }

    public void deleteItem(String itemId, Long userId) {
        log.info("Deleting Plaid item: {} for user: {}", itemId, userId);
        int deleted = plaidItemRepository.deleteByItemIdAndUserId(itemId, userId);
        if (deleted == 0) {
            log.warn("No item found with itemId: {} for user: {}", itemId, userId);
            throw new RuntimeException(messageSource.getMessage("plaid.item.not.found", new Object[]{itemId}, Locale.getDefault()));
        }
        log.info("Successfully deleted item: {}", itemId);
    }

    public List<DataPoint<?>> fetchData(DataQuery query, Long userId) {
        log.info("Retrieving institution id from filters...");
        String institutionId = Optional.ofNullable(query.getFilters())
            .map(f -> f.get("institution_id"))
            .orElse("All");

        List<PlaidItem> items = plaidItemRepository.findByUserId(userId)
            .stream()
            .filter(item -> "All".equals(institutionId) || institutionId.equals(item.getInstitutionId()))
            .collect(Collectors.toList());
        
        List<DataPoint<?>> allData = new ArrayList<>();
        for (PlaidItem item : items) {
            try {
                List<DataPoint<?>> itemData = fetchDataForItem(query, item.getAccessToken());
                allData.addAll(itemData);
            } catch (Exception e) {
                log.error("Failed to fetch data for item {}: {}", item.getItemId(), e.getMessage());
            }
        }
        
        return allData;
    }

    private List<DataPoint<?>> fetchDataForItem(DataQuery query, String accessToken) {
        DataSourceConfig config = this.plaidConnector.createDataSourceConfig();
        config.getCredentials().put("accessToken", accessToken);
        
        try (PlaidDataSourceConnection connection = 
                (PlaidDataSourceConnection) this.plaidConnector.createConnection(config)) {
            return connection.fetchData(query);
        } catch (DataSourceException e) {
            log.error("Failed to fetch data from Plaid: {}", e.getMessage(), e);
            throw new RuntimeException(messageSource.getMessage("plaid.data.fetch.failed", null, Locale.getDefault()), e);
        }
    }

    private List<DataPoint<?>> fetchDataWithSandboxToken(DataQuery query, Long userId) {
        try {
            String sandboxToken = createSandboxAccessToken();

            LocalDateTime now = LocalDateTime.now();
            PlaidItem sandboxItem = PlaidItem.builder()
                .userId(userId)
                .itemId("sandbox-item")
                .accessToken(sandboxToken)
                .institutionId("ins_109508")
                .institutionName("Sandbox Institution")
                .createdAt(now)
                .updatedAt(now)
                .build();
            plaidItemRepository.save(sandboxItem);
            log.info("Persisted sandbox PlaidItem with id: {}", sandboxItem.getId());

            return fetchDataForItem(query, sandboxToken);
        } catch (IOException e) {
            throw new RuntimeException(messageSource.getMessage("plaid.sandbox.data.fetch.failed", null, Locale.getDefault()), e);
        }
    }

    private String createSandboxAccessToken() throws IOException {
        SandboxPublicTokenCreateRequest publicTokenRequest = 
            new SandboxPublicTokenCreateRequest()
                .institutionId("ins_109508")
                .initialProducts(Arrays.asList(Products.TRANSACTIONS));

        Response<SandboxPublicTokenCreateResponse> publicTokenResponse = 
            plaidClient.sandboxPublicTokenCreate(publicTokenRequest).execute();

        if (!publicTokenResponse.isSuccessful()) {
            throw new IOException(messageSource.getMessage("plaid.sandbox.public.token.create.failed", new Object[]{publicTokenResponse.code(), publicTokenResponse.message()}, Locale.getDefault()));
        }

        String publicToken = publicTokenResponse.body().getPublicToken();

        ItemPublicTokenExchangeRequest exchangeRequest =
            new ItemPublicTokenExchangeRequest().publicToken(publicToken);

        Response<ItemPublicTokenExchangeResponse> exchangeResponse =
            plaidClient.itemPublicTokenExchange(exchangeRequest).execute();

        if (!exchangeResponse.isSuccessful()) {
            throw new IOException(messageSource.getMessage("plaid.sandbox.public.token.exchange.failed", new Object[]{exchangeResponse.code(), exchangeResponse.message()}, Locale.getDefault()));
        }

        return exchangeResponse.body().getAccessToken();
    }
    
}
