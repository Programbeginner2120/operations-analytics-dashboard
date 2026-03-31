import { Component, computed, effect, input, OnInit, output, signal } from "@angular/core";
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

    configChange = output<DataSourceConfigSelections>();

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

            this.configChange.emit({ metric, institutionId } as PlaidDataSourceConfigSelections);
        });
    }

    ngOnInit(): void {
        this.editableInstitutionId.set(this.queryConfig().institutionId ?? 'All');
        this.editableBarChartMetric.set(this.transformConfig().method as PlaidTransformMethod ?? 'transactionsByDate');
    }
}
