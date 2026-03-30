import { inject, Injectable, Type } from "@angular/core";
import { DataSourceStrategy } from "../../interfaces/data-source-strategy.interface";
import { PlaidService } from "../plaid.service";
import { DataService } from "../data.service";
import { PlaidTransactionTransformerService } from "../transformers/plaid-transaction-transformer.service";
import { PlaidAccountTransformerService } from "../transformers/plaid-account-transformer.service";
import { ConnectedDataSource, DashboardCard, DashboardDataSourceType, DashboardVisualizationType } from "../../interfaces/dashboard.interface";
import { catchError, map, Observable, throwError } from "rxjs";
import { BarChartData, PieChartData } from "../../interfaces/data.interface";
import { PlaidAccount, PlaidDataQueryConfig, PlaidDataTransformConfig, PlaidTransaction } from "../../interfaces/plaid.interface";
import { DataSourceConfigComponent } from "../../interfaces/data-source-config.interface";
import { PlaidConfigComponent } from "../../components/dashboard/dashboard-card/data-source-configs/plaid-config/plaid-config.component";

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

    getConnectedSources(): Observable<ConnectedDataSource[]> {
        return this.plaidService.getConnectedItems().pipe(
            map(items => {
                const filterOptions = [
                    { value: 'All', label: 'All' },
                    ...items.map(item => ({
                        value: item.institutionId ?? item.itemId,
                        label: item.institutionName ?? item.itemId
                    }))
                ];
                return items.map(item => ({
                    sourceType: DashboardDataSourceType.PLAID,
                    id: item.itemId,
                    displayName: item.institutionName ?? item.itemId,
                    filterOptions
                } as ConnectedDataSource));
            })
        );
    }

    getDefaultCard(): Partial<DashboardCard> {
        return {
            title: 'New Transactions Bar Chart Card',
            dataSourceType: DashboardDataSourceType.PLAID,
            visualizationType: DashboardVisualizationType.BAR_CHART,
            queryConfig: {
                startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                endDate: new Date(),
                institutionId: 'All'
            } as PlaidDataQueryConfig,
            transformConfig: {
                method: 'transactionsByDate'
            } as PlaidDataTransformConfig
        };
    }

    getConfigComponent(): Type<DataSourceConfigComponent> {
        return PlaidConfigComponent;
    }

    fetchAndTransform(card: DashboardCard): Observable<BarChartData | PieChartData> {
        const transformConfig = card.transformConfig as PlaidDataTransformConfig;
        const { startDate, endDate, institutionId } = card.queryConfig as PlaidDataQueryConfig;
        console.log("Institution ID in query config:", institutionId);

        // Route to appropriate fetch + transform pipeline based on method
        switch (transformConfig.method) {
            case 'transactionsByDate':
                return this.plaidService.loadTransactions(startDate, endDate, institutionId).pipe(
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
                return this.plaidService.loadAccountBalances(startDate, endDate, institutionId).pipe(
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
                return this.plaidService.loadTransactions(startDate, endDate, institutionId).pipe(
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