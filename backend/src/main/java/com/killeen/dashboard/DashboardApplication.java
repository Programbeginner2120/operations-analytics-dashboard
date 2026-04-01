package com.killeen.dashboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootApplication
@PropertySources({
	@PropertySource("classpath:exception.properties")
})
public class DashboardApplication {

	public static void main(String[] args) {
		log.info("Starting Operations Analytics Dashboard application");
		SpringApplication.run(DashboardApplication.class, args);
		log.info("Operations Analytics Dashboard application started successfully");
	}

}
