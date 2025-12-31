package com.killeen.dashboard;

import java.io.IOException;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.killeen.dashboard.components.datasource.enums.ConnectionStatus;
import com.killeen.dashboard.components.datasource.model.DataSourceConfig;
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

@Slf4j
@SpringBootApplication
public class DashboardApplication implements CommandLineRunner {

	@Autowired
	private PlaidDataSourceConnector plaidConnector;

	public static void main(String[] args) {
		log.info("Starting Operations Analytics Dashboard application");
		SpringApplication.run(DashboardApplication.class, args);
		log.info("Operations Analytics Dashboard application started successfully");
	}

	@Override
	public void run(String... args) throws Exception {
		DataSourceConfig config = plaidConnector.createDataSourceConfig();

		PlaidDataSourceConnection connection = (PlaidDataSourceConnection) plaidConnector.createConnection(config);

		String accessToken = createSandboxAccessToken(connection.getPlaidClient());

		config.getCredentials().put("accessToken", accessToken);

		ConnectionStatus status = connection.healthCheck();
		log.info("Health check with access token: {}", status);
	}

	private String createSandboxAccessToken(PlaidApi plaidClient) throws IOException {
		SandboxPublicTokenCreateRequest publicTokenRequest = 
			new SandboxPublicTokenCreateRequest()
				.institutionId("ins_109508")
				.initialProducts(Arrays.asList(Products.TRANSACTIONS));

		Response<SandboxPublicTokenCreateResponse> publicTokenResponse = 
			plaidClient.sandboxPublicTokenCreate(publicTokenRequest).execute();

		String publicToken = publicTokenResponse.body().getPublicToken();

		ItemPublicTokenExchangeRequest exchangeRequest =
			new ItemPublicTokenExchangeRequest().publicToken(publicToken);

		Response<ItemPublicTokenExchangeResponse> exchangeResponse =
			plaidClient.itemPublicTokenExchange(exchangeRequest).execute();

		return exchangeResponse.body().getAccessToken();
	}

}
