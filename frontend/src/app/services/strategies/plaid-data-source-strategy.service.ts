import { inject, Injectable } from "@angular/core";
import { DataSourceStrategy } from "../../interfaces/data-source-strategy.interface";
import { PlaidService } from "../plaid.service";
import { DataService } from "../data.service";
import { PlaidTransactionTransformerService } from "../transformers/plaid-transaction-transformer.service";
import { PlaidAccountTransformerService } from "../transformers/plaid-account-transformer.service";
import { DashboardCard, DashboardDataSourceType, DataQueryConfig } from "../../interfaces/dashboard.interface";
import { catchError, map, Observable, throwError } from "rxjs";
import { BarChartData, PieChartData } from "../../interfaces/data.interface";
import { PlaidAccount, PlaidDataTransformConfig, PlaidTransaction } from "../../interfaces/plaid.interface";

@Injectable({
    providedIn: 'root'
})
export class PlaidDataSourceStrategyService implements DataSourceStrategy {
    private readonly plaidService = inject(PlaidService);
    private readonly dataService = inject(DataService);
    private readonly transactionTransformer = inject(PlaidTransactionTransformerService);
    private readonly accountTransformer = inject(PlaidAccountTransformerService);

    getSourceType(): string {
        return DashboardDataSourceType.PLAID;
    }

    fetchAndTransform(card: DashboardCard): Observable<BarChartData | PieChartData> {
        const transformConfig = card.transformConfig as PlaidDataTransformConfig;
        const { startDate, endDate } = card.queryConfig as DataQueryConfig;

        // Route to appropriate fetch + transform pipeline based on method
        switch (transformConfig.method) {
            case 'transactionsByDate':
                return this.plaidService.loadTransactions(startDate, endDate).pipe(
                    map(datapoints => {
                        const transactions = datapoints.map(dp => this.dataService.unwrapDataPoint<PlaidTransaction>(dp));
                        return this.transactionTransformer.transactionsByDate(transactions);
                    }),
                    catchError(error => {
                        console.error('Error fetching transactions:', error);
                        return throwError(() => new Error('Failed to fetch transactions: ' + error.message));
                    })
                );
            case 'accountsByBalance':
                return this.plaidService.loadAccountBalances(startDate, endDate).pipe(
                    map(datapoints => {
                        const accounts = datapoints.map(dp => this.dataService.unwrapDataPoint<PlaidAccount>(dp));
                        return this.accountTransformer.accountsByBalance(accounts);
                    }),
                    catchError(error => {
                        console.error('Error fetching accounts:', error);
                        return throwError(() => new Error('Failed to fetch accounts: ' + error.message));
                    })
                );
            case 'topMerchantsBySpend':
                return this.plaidService.loadTransactions(startDate, endDate).pipe(
                    map(datapoints => {
                        const transactions = datapoints.map(dp => this.dataService.unwrapDataPoint<PlaidTransaction>(dp));
                        return this.transactionTransformer.topMerchantsBySpend(transactions);
                    }),
                    catchError(error => {
                        console.error('Error fetching transactions:', error);
                        return throwError(() => new Error('Failed to fetch transactions: ' + error.message));
                    })
                );
            default:
                return throwError(() => new Error(`Unsupported transform method: ${transformConfig.method}`));
            }
    }
}