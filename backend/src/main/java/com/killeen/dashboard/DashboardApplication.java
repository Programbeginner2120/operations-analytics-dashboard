package com.killeen.dashboard;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.killeen.dashboard.components.datapoint.model.DataPoint;
import com.killeen.dashboard.components.dataquery.model.DataQuery;
import com.killeen.dashboard.components.datasource.enums.ConnectionStatus;
import com.killeen.dashboard.components.datasource.model.DataSourceConfig;
import com.killeen.dashboard.components.plaid.enums.PlaidMetric;
import com.killeen.dashboard.components.plaid.model.PlaidDataSourceConnection;
import com.killeen.dashboard.components.plaid.model.PlaidDataSourceConnector;
import com.plaid.client.model.AccountBase;
import com.plaid.client.model.ItemPublicTokenExchangeRequest;
import com.plaid.client.model.ItemPublicTokenExchangeResponse;
import com.plaid.client.model.Products;
import com.plaid.client.model.SandboxPublicTokenCreateRequest;
import com.plaid.client.model.SandboxPublicTokenCreateResponse;
import com.plaid.client.model.Transaction;
import com.plaid.client.request.PlaidApi;

import lombok.extern.slf4j.Slf4j;
import retrofit2.Response;

@Slf4j
@SpringBootApplication
public class DashboardApplication /* implements CommandLineRunner */ {

	// @Autowired
	// private PlaidDataSourceConnector plaidConnector;

	public static void main(String[] args) {
		log.info("Starting Operations Analytics Dashboard application");
		SpringApplication.run(DashboardApplication.class, args);
		log.info("Operations Analytics Dashboard application started successfully");
	}

	// @Override
	// public void run(String... args) throws Exception {
	// 	DataSourceConfig config = plaidConnector.createDataSourceConfig();

	// 	PlaidDataSourceConnection connection = (PlaidDataSourceConnection) plaidConnector.createConnection(config);

	// 	String accessToken = createSandboxAccessToken(connection.getPlaidClient());

	// 	config.getCredentials().put("accessToken", accessToken);

	// 	ConnectionStatus status = connection.healthCheck();
	// 	log.info("Health check with access token: {}", status);

	// 	// Build multi-metric query
	// 	DataQuery query = DataQuery.builder()
	// 		.metrics(Arrays.asList(PlaidMetric.ACCOUNT_BALANCE, PlaidMetric.TRANSACTIONS))
	// 		.startDate(LocalDateTime.now().minusDays(30))
	// 		.endDate(LocalDateTime.now())
	// 		.build();

	// 	// Fetch data
	// 	log.info("Executing query with {} metrics", query.getMetrics().size());
	// 	List<DataPoint<?>> results = connection.fetchData(query);
	// 	log.info("Received {} data points", results.size());

	// 	// Process results
	// 	for (DataPoint<?> point : results) {
	// 		if (point.getMetric().equals(PlaidMetric.ACCOUNT_BALANCE)) {
	// 			log.info("Metric: {}, Timestamp: {}", 
	// 				point.getMetric().getName(), 
	// 				point.getTimestamp()
	// 			);
	// 			AccountBase account = (AccountBase) point.getValue();
	// 			log.info("Account: {} | Balance: {} | Type: {}", 
	// 				account.getName(), 
	// 				account.getBalances().getCurrent(), 
	// 				account.getType().getValue()
	// 			);
	// 		}
	// 		else if (point.getMetric().equals(PlaidMetric.TRANSACTIONS)) {
	// 			log.info("Metric: {}, Timestamp: {}", 
	// 				point.getMetric().getName(), 
	// 				point.getTimestamp()
	// 			);
	// 			Transaction transaction = (Transaction) point.getValue();
	// 			log.info("Transaction: {} | Amount: {} | Name: {}", 
	// 				transaction.getTransactionId(), 
	// 				transaction.getAmount(), 
	// 				transaction.getName()
	// 			);
	// 		}
	// 	}
	// }

	// private String createSandboxAccessToken(PlaidApi plaidClient) throws IOException {
	// 	SandboxPublicTokenCreateRequest publicTokenRequest = 
	// 		new SandboxPublicTokenCreateRequest()
	// 			.institutionId("ins_109508")
	// 			.initialProducts(Arrays.asList(Products.TRANSACTIONS));

	// 	Response<SandboxPublicTokenCreateResponse> publicTokenResponse = 
	// 		plaidClient.sandboxPublicTokenCreate(publicTokenRequest).execute();

	// 	String publicToken = publicTokenResponse.body().getPublicToken();

	// 	ItemPublicTokenExchangeRequest exchangeRequest =
	// 		new ItemPublicTokenExchangeRequest().publicToken(publicToken);

	// 	Response<ItemPublicTokenExchangeResponse> exchangeResponse =
	// 		plaidClient.itemPublicTokenExchange(exchangeRequest).execute();

	// 	return exchangeResponse.body().getAccessToken();
	// }

}
