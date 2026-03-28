import { Component, computed, inject, input, signal } from "@angular/core";
import { DashboardCard, DashboardVisualizationType, DashboardDataSourceType } from "../../../interfaces/dashboard.interface";
import { LucideAngularModule, Save, X, Type, Ellipsis } from "lucide-angular";
import { BarChartComponent } from "../../charts/bar-chart/bar-chart.component";
import { DashboardService } from "../../../services/dashboard.service";
import { PieChartComponent } from "../../charts/pie-chart/pie-chart.component";
import { ModalComponent } from "../../../shared/components/modal/modal.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { InputComponent } from "../../../shared/components/input/input.component";
import { SelectComponent } from "../../../shared/components/select/select.component";
import { SelectOption } from "../../../shared/interfaces/select.interface";
import { PlaidAccount, PlaidDataTransformConfig, PlaidTransaction, PlaidTransformMethod } from "../../../interfaces/plaid.interface";
import { BarChartData, DataPoint, PieChartData } from "../../../interfaces/data.interface";

@Component({
    selector: 'app-dashboard-card',
    templateUrl: './dashboard-card.component.html',
    styleUrls: ['./dashboard-card.component.scss'],
    imports: [LucideAngularModule, BarChartComponent, PieChartComponent, ModalComponent, ButtonComponent, InputComponent, SelectComponent]
})
export class DashboardCardComponent {
    readonly saveIcon = Save;
    readonly cancelIcon = X;
    readonly typeIcon = Type;
    readonly ellipsisIcon = Ellipsis;

    readonly DashboardVisualizationType = DashboardVisualizationType;

    card = input.required<DashboardCard>();
    readonly dashboardService = inject(DashboardService);

    // Local editable state - writable signals for form fields
    readonly editableTitle = signal<string>('');
    readonly editableDataSourceType = signal<DashboardDataSourceType | null>(null);
    readonly editableVisualizationType = signal<DashboardVisualizationType | null>(null);
    readonly editableBarChartMetric = signal<PlaidTransformMethod>('transactionsByDate');
    
    // Local modal state specific to this card instance
    readonly isModalOpen = signal<boolean>(false);

    // Select options
    readonly dataSourceOptions: SelectOption[] = [
        { value: DashboardDataSourceType.PLAID, label: 'Plaid API' }
    ];

    readonly visualizationOptions: SelectOption[] = [
        { value: DashboardVisualizationType.BAR_CHART, label: 'Bar Chart' },
        { value: DashboardVisualizationType.PIE_CHART, label: 'Pie Chart' }
    ];

    readonly barChartMetricOptions: SelectOption[] = [
        { value: 'transactionsByDate', label: 'Transactions by Date' },
        { value: 'topMerchantsBySpend', label: 'Top Merchants by Spend' }
    ];

    /**
     * Bar chart data - only returns data when visualization type is BAR_CHART
     */
    readonly barChartData = computed(() => {
        if (this.card().visualizationType === DashboardVisualizationType.BAR_CHART) {
            return this.card().transformedData as BarChartData | undefined;
        }
        return undefined;
    });

    /**
     * Pie chart data - only returns data when visualization type is PIE_CHART
     */
    readonly pieChartData = computed(() => {
        if (this.card().visualizationType === DashboardVisualizationType.PIE_CHART) {
            return this.card().transformedData as PieChartData | undefined;
        }
        return undefined;
    });

    /**
     * Opens the configuration modal and initializes editable fields
     */
    openConfigModal(): void {
        // Initialize editable fields with current card values
        this.editableTitle.set(this.card().title);
        this.editableDataSourceType.set(this.card().dataSourceType);
        this.editableVisualizationType.set(this.card().visualizationType);

        if (this.card().visualizationType === DashboardVisualizationType.BAR_CHART) {
            const config = this.card().transformConfig as PlaidDataTransformConfig;
            this.editableBarChartMetric.set(config?.method as PlaidTransformMethod ?? 'transactionsByDate');
        }
        
        // Open this specific card's modal
        this.isModalOpen.set(true);
    }

    /**
     * Saves the card configuration
     */
    saveConfig(): void {
        const updates: Partial<DashboardCard> = {
            title: this.editableTitle(),
            dataSourceType: this.editableDataSourceType() ?? undefined,
            visualizationType: this.editableVisualizationType() ?? undefined
        };
        
        // Always persist the transform method based on viz type + metric selection
        const newVizType = this.editableVisualizationType();
        if (newVizType === DashboardVisualizationType.BAR_CHART) {
            const metric = this.editableBarChartMetric();
            updates.transformConfig = { method: metric } as PlaidDataTransformConfig;
            if (metric === 'topMerchantsBySpend') {
                const endDate = new Date();
                updates.queryConfig = { startDate: new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000), endDate };
            }
        } else if (newVizType === DashboardVisualizationType.PIE_CHART) {
            updates.transformConfig = { method: 'accountsByBalance' } as PlaidDataTransformConfig;
        }
        
        // Update card with edited values
        console.log('Saving card configuration...', updates);
        
        // Call service to update card with edited values
        this.dashboardService.updateCard(this.card().id, updates as DashboardCard);
        
        this.closeModal();
    }

    /**
     * Closes the modal without saving changes
     */
    closeModal(): void {
        this.isModalOpen.set(false);
    }

    /**
     * Removes the card from the dashboard
     */
    removeCard(): void {
        this.dashboardService.removeCard(this.card().id);
        this.closeModal();
    }
}