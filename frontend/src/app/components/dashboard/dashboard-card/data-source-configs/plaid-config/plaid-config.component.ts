import { Component, computed, effect, input, linkedSignal, OnInit, output, signal } from "@angular/core";
import { ConnectedDataSource, DashboardVisualizationType } from "../../../../../interfaces/dashboard.interface";
import { PlaidDataQueryConfig, PlaidDataSourceConfigSelections, PlaidDataTransformConfig, PlaidTransformMethod } from "../../../../../interfaces/plaid.interface";
import { DataSourceConfigComponent, DataSourceConfigSelections } from "../../../../../interfaces/data-source.interface";
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

    configChange = output<DataSourceConfigSelections>();

    editableInstitutionId = signal<string>('All');
    editableMetric = linkedSignal<string | number | null>(() => {
        const visualizationType = this.visualizationType();
        if (visualizationType === DashboardVisualizationType.BAR_CHART) {
            return this.barChartMetricOptions[0].value;
        } else if (visualizationType === DashboardVisualizationType.PIE_CHART) {
            return this.pieChartMetricOptions[0].value;
        } else if (visualizationType === DashboardVisualizationType.STACKED_BAR_CHART) {
            return this.stackedBarChartMetricOptions[0].value;
        }
        return null;
    });

    readonly institutionIdOptions = computed<SelectOption[]>(() => {
        const sources = this.connectedSources();
        if (sources.length === 0) return [{ value: 'All', label: 'All' }];
        return sources[0].filterOptions;
    });

    readonly barChartMetricOptions: SelectOption[] = [
        { value: 'transactionsByDate', label: 'Transactions by Date' },
        { value: 'topMerchantsBySpend', label: 'Top Merchants by Spend' }
    ];

    readonly pieChartMetricOptions: SelectOption[] = [
        { value: 'accountsByBalance', label: 'Accounts By Balance' }
    ];

    readonly stackedBarChartMetricOptions: SelectOption[] = [
        { value: 'yearlySpendByMonthAndCategory', label: 'Yearly Spend by Month and Category' }
    ];

    constructor() {
        effect(() => {
            const institutionId = this.editableInstitutionId();
            const metric = this.editableMetric();

            this.configChange.emit({ metric, institutionId } as PlaidDataSourceConfigSelections);
        });
    }

    ngOnInit(): void {
        this.editableInstitutionId.set(this.queryConfig().institutionId ?? 'All');
        this.editableMetric.set(this.transformConfig().method as PlaidTransformMethod);
    }
}
