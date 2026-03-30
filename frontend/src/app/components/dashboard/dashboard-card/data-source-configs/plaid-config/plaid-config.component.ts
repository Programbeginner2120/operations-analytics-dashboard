import { Component, computed, effect, input, OnInit, output, signal } from "@angular/core";
import { ConnectedDataSource, DashboardVisualizationType } from "../../../../../interfaces/dashboard.interface";
import { PlaidDataQueryConfig, PlaidDataTransformConfig, PlaidTransformMethod } from "../../../../../interfaces/plaid.interface";
import { DataSourceConfigComponent, DataSourceConfigOutput } from "../../../../../interfaces/data-source-config.interface";
import { SelectComponent } from "../../../../../shared/components/select/select.component";
import { SelectOption } from "../../../../../shared/interfaces/select.interface";

@Component({
    selector: 'app-plaid-config',
    templateUrl: './plaid-config.component.html',
    styleUrls: ['./plaid-config.component.scss'],
    imports: [SelectComponent]
})
export class PlaidConfigComponent implements DataSourceConfigComponent, OnInit {
    readonly DashboardVisualizationType = DashboardVisualizationType;

    queryConfig = input.required<PlaidDataQueryConfig>();
    transformConfig = input.required<PlaidDataTransformConfig>();
    connectedSources = input.required<ConnectedDataSource[]>();
    visualizationType = input.required<DashboardVisualizationType>();

    configChange = output<DataSourceConfigOutput>();

    editableInstitutionId = signal<string>('All');
    editableBarChartMetric = signal<PlaidTransformMethod>('transactionsByDate');

    readonly institutionIdOptions = computed<SelectOption[]>(() => {
        const sources = this.connectedSources();
        if (sources.length === 0) return [{ value: 'All', label: 'All' }];
        return sources[0].filterOptions;
    });

    readonly barChartMetricOptions: SelectOption[] = [
        { value: 'transactionsByDate', label: 'Transactions by Date' },
        { value: 'topMerchantsBySpend', label: 'Top Merchants by Spend' }
    ];

    constructor() {
        effect(() => {
            const institutionId = this.editableInstitutionId();
            const metric = this.editableBarChartMetric();
            const vizType = this.visualizationType();
            const baseQC = this.queryConfig();

            const queryConfig: PlaidDataQueryConfig = metric === 'topMerchantsBySpend'
                ? {
                    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    endDate: new Date(),
                    ...(institutionId !== 'All' ? { institutionId } : {})
                }
                : {
                    startDate: baseQC.startDate,
                    endDate: baseQC.endDate,
                    ...(institutionId !== 'All' ? { institutionId } : {})
                };

            const transformConfig: PlaidDataTransformConfig =
                vizType === DashboardVisualizationType.BAR_CHART
                    ? { method: metric }
                    : { method: 'accountsByBalance' };

            this.configChange.emit({ queryConfig, transformConfig });
        });
    }

    ngOnInit(): void {
        this.editableInstitutionId.set(this.queryConfig().institutionId ?? 'All');
        this.editableBarChartMetric.set(this.transformConfig().method as PlaidTransformMethod ?? 'transactionsByDate');
    }
}
