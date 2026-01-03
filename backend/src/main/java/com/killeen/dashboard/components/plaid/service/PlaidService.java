package com.killeen.dashboard.components.plaid.service;

import java.io.IOException;
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
import com.plaid.client.model.ItemPublicTokenExchangeRequest;
import com.plaid.client.model.ItemPublicTokenExchangeResponse;
import com.plaid.client.model.Products;
import com.plaid.client.model.SandboxPublicTokenCreateRequest;
import com.plaid.client.model.SandboxPublicTokenCreateResponse;
import com.plaid.client.request.PlaidApi;

import lombok.extern.slf4j.Slf4j;
import retrofit2.Response;

@Service
@Slf4j
public class PlaidService {

    private final PlaidDataSourceConnector plaidConnector;
    private final String accessToken;

    public PlaidService(PlaidDataSourceConnector plaidConnector, PlaidProperties plaidProperties, PlaidApi plaidClient) {
        this.plaidConnector = plaidConnector;
        this.accessToken = initializeAccessToken(plaidProperties, plaidClient);
    }

    public List<DataPoint<?>> fetchData(DataQuery query) {
        DataSourceConfig config = this.plaidConnector.createDataSourceConfig();
        config.getCredentials().put("accessToken", this.accessToken);
        try (PlaidDataSourceConnection connection = (PlaidDataSourceConnection) this.plaidConnector.createConnection(config)) {
            return connection.fetchData(query);
        } catch (DataSourceException e) {
            log.error("Failed to fetch data from Plaid: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch data from Plaid", e);
        }
    }

    /**
     * Initializes the access token based on the configured environment.
     * For sandbox: auto generates a test token
     * For production: throws exception (tokens must come from the Plaid link)
     * @param plaidProperties
     * @param plaidClient
     * @return
     */
    private String initializeAccessToken(PlaidProperties properties, PlaidApi plaidClient) {
        String environment = properties.getEnvironment();
        log.info("Initializing access token for {} environment", environment);

        return switch (environment) {
            case "sandbox" -> {
                try {
                    String token = createSandboxAccessToken(plaidClient);
                    log.info("Successfully created sandbox access token");
                    yield token;
                } catch (IOException e) {
                    throw new RuntimeException("Failed to initialize sandbox access token", e);
                }
            }
            case "production" -> {
                throw new IllegalArgumentException("Production access tokens must be provided through the Plaid link");
            }
            default -> {
                throw new IllegalArgumentException("Invalid Plaid environment: " + environment);
            }
        };
    }

    /**
     * Creates a test access token for sandbox environments.
     * Uses Plaid's sandbox API to generate a public token and exchange it for an access token.
     * @param plaidClient
     * @return
     * @throws IOException
     */
    private String createSandboxAccessToken(PlaidApi plaidClient) throws IOException {
		SandboxPublicTokenCreateRequest publicTokenRequest = 
			new SandboxPublicTokenCreateRequest()
				.institutionId("ins_109508")
				.initialProducts(Arrays.asList(Products.TRANSACTIONS));

		Response<SandboxPublicTokenCreateResponse> publicTokenResponse = 
			plaidClient.sandboxPublicTokenCreate(publicTokenRequest).execute();

        if (!publicTokenResponse.isSuccessful()) {
            throw new IOException("Failed to create sandbox public token: " + publicTokenResponse.code() + " " + publicTokenResponse.message());
        }

		String publicToken = publicTokenResponse.body().getPublicToken();
        log.debug("Sandbox public token created");

		ItemPublicTokenExchangeRequest exchangeRequest =
			new ItemPublicTokenExchangeRequest().publicToken(publicToken);

		Response<ItemPublicTokenExchangeResponse> exchangeResponse =
			plaidClient.itemPublicTokenExchange(exchangeRequest).execute();

        if (!exchangeResponse.isSuccessful()) {
            throw new IOException("Failed to exchange sandbox public token: " + exchangeResponse.code() + " " + exchangeResponse.message());
        }

        String accessToken = exchangeResponse.body().getAccessToken();
        log.debug("Sandbox access token created");

		return accessToken;
	}
    
}
