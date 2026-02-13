package com.killeen.dashboard.components.plaid.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;

import com.killeen.dashboard.components.datapoint.model.DataPoint;
import com.killeen.dashboard.components.dataquery.model.DataQuery;
import com.killeen.dashboard.components.datasource.exception.DataSourceException;
import com.killeen.dashboard.components.datasource.model.DataSourceConfig;
import com.killeen.dashboard.components.plaid.config.PlaidProperties;
import com.killeen.dashboard.components.plaid.model.PlaidDataSourceConnection;
import com.killeen.dashboard.components.plaid.model.PlaidDataSourceConnector;
import com.killeen.dashboard.components.plaid.model.PlaidItem;
import com.killeen.dashboard.db.mapper.generated.PlaidItemMapper;
import com.killeen.dashboard.db.model.generated.PlaidItemExample;
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

@Service
@Slf4j
@RequiredArgsConstructor
public class PlaidService {

    private final PlaidDataSourceConnector plaidConnector;
    private final PlaidProperties plaidProperties;
    private final PlaidApi plaidClient;
    private final PlaidItemMapper plaidItemMapper;

    public String createLinkToken(String userId) {
        try {
            log.info("Creating link token for user: {}", userId);
            
            LinkTokenCreateRequestUser user = new LinkTokenCreateRequestUser()
                .clientUserId(userId != null ? userId : "default-user");
            
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
                throw new RuntimeException("Failed to create link token: " + response.code());
            }
            
            String linkToken = response.body().getLinkToken();
            log.info("Successfully created link token");
            return linkToken;
            
        } catch (IOException e) {
            log.error("Error creating link token", e);
            throw new RuntimeException("Error creating link token", e);
        }
    }

    public PlaidItem exchangePublicToken(String publicToken) {
        try {
            log.info("Exchanging public token");
            
            ItemPublicTokenExchangeRequest exchangeRequest = 
                new ItemPublicTokenExchangeRequest()
                    .publicToken(publicToken);
            
            Response<ItemPublicTokenExchangeResponse> exchangeResponse = 
                plaidClient.itemPublicTokenExchange(exchangeRequest).execute();
            
            if (!exchangeResponse.isSuccessful()) {
                log.error("Failed to exchange public token: {}", exchangeResponse.code());
                throw new RuntimeException("Failed to exchange public token: " + exchangeResponse.code());
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
            
            PlaidItem plaidItem = PlaidItem.builder()
                .itemId(itemId)
                .accessToken(accessToken)
                .institutionId(institutionId)
                .institutionName(institutionId)
                .build();
            
            plaidItemMapper.insert(plaidItem);
            log.info("Saved PlaidItem with id: {}", plaidItem.getId());
            
            return plaidItem;
            
        } catch (IOException e) {
            log.error("Error exchanging public token", e);
            throw new RuntimeException("Error exchanging public token", e);
        }
    }

    public List<PlaidItem> getAllItems() {
        log.debug("Fetching all connected Plaid items");
        return plaidItemMapper.selectByExample(new PlaidItemExample());
    }

    public void deleteItem(String itemId) {
        log.info("Deleting Plaid item: {}", itemId);
        PlaidItemExample example = new PlaidItemExample();
        example.createCriteria().andItemIdEqualTo(itemId);
        int deleted = plaidItemMapper.deleteByExample(example);
        if (deleted == 0) {
            log.warn("No item found with itemId: {}", itemId);
            throw new RuntimeException("Item not found: " + itemId);
        }
        log.info("Successfully deleted item: {}", itemId);
    }

    public List<DataPoint<?>> fetchData(DataQuery query) {
        List<PlaidItem> items = plaidItemMapper.selectByExample(new PlaidItemExample());
        
        if (items.isEmpty() && "sandbox".equals(plaidProperties.getEnvironment())) {
            log.info("No items connected, using sandbox auto-generated token");
            return fetchDataWithSandboxToken(query);
        }
        
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
            throw new RuntimeException("Failed to fetch data from Plaid", e);
        }
    }

    private List<DataPoint<?>> fetchDataWithSandboxToken(DataQuery query) {
        try {
            String sandboxToken = createSandboxAccessToken();
            return fetchDataForItem(query, sandboxToken);
        } catch (IOException e) {
            throw new RuntimeException("Failed to fetch sandbox data", e);
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
            throw new IOException("Failed to create sandbox public token: " + 
                publicTokenResponse.code() + " " + publicTokenResponse.message());
        }

        String publicToken = publicTokenResponse.body().getPublicToken();

        ItemPublicTokenExchangeRequest exchangeRequest =
            new ItemPublicTokenExchangeRequest().publicToken(publicToken);

        Response<ItemPublicTokenExchangeResponse> exchangeResponse =
            plaidClient.itemPublicTokenExchange(exchangeRequest).execute();

        if (!exchangeResponse.isSuccessful()) {
            throw new IOException("Failed to exchange sandbox public token: " + 
                exchangeResponse.code() + " " + exchangeResponse.message());
        }

        return exchangeResponse.body().getAccessToken();
    }
    
}
