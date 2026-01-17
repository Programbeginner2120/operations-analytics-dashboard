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
import { PlaidAccount, PlaidTransaction } from "../../../interfaces/plaid.interface";
import { DataPoint } from "../../../interfaces/data.interface";

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

    readonly DashboardVisualizationType = DashboardVisualizationType;

    card = input.required<DashboardCard>();

    readonly dashboardService = inject(DashboardService);

    readonly ellipsisIcon = Ellipsis;

    // Local editable state - writable signals for form fields
    readonly editableTitle = signal<string>('');
    readonly editableDataSourceType = signal<DashboardDataSourceType | null>(null);
    readonly editableVisualizationType = signal<DashboardVisualizationType | null>(null);
    
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

    readonly barChartData = computed(() => {
        if (this.card().visualizationType === DashboardVisualizationType.BAR_CHART) {
            // TODO: Fix this shitty conversion lol
            const data: DataPoint<PlaidTransaction>[] | undefined = this.card().data as unknown as DataPoint<PlaidTransaction>[] | undefined;
            if (data) {
                console.log('data', data);
                // Get unique dates and sort them chronologically
                const uniqueDates = [...new Set(data.map(t => t.value.date))]
                    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
                
                // Calculate spend for each date in order
                const spendByDate = uniqueDates.map(date => 
                    data
                        .map(t => t.value)
                        .filter((t: PlaidTransaction) => t.date === date)
                        .reduce((acc: number, t: PlaidTransaction) => acc + t.amount, 0)
                );
                
                return {
                    title: 'Transactions',
                    xAxisData: uniqueDates,
                    xAxisLabel: 'Date',
                    yAxisData: spendByDate,
                    yAxisLabel: 'Amount',
                    formatter: (value: number) => "$" + value.toFixed(2)
                }
            }
        }
        return null;
    })

    readonly pieChartData = computed(() => {
        if (this.card().visualizationType === DashboardVisualizationType.PIE_CHART) {
            // TODO: Fix this shitty conversion lol
            const data: DataPoint<PlaidAccount>[] | undefined = this.card().data as unknown as DataPoint<PlaidAccount>[] | undefined;
            if (data) {
                // filtering out zero balance accounts, at least for now
                const filteredData: PlaidAccount[] = data.map(t => t.value).filter((account: PlaidAccount) => account.balances.current != null);
                return {
                    title: 'Account Balances',
                    labels: filteredData.map((account: PlaidAccount) => account.name),
                    values: filteredData.map((account: PlaidAccount) => account.balances.current ?? 0),
                    formatter: (value: number) => value.toFixed(2)
                }
            }
        }
        return null;
    });

    /**
     * Opens the configuration modal and initializes editable fields
     */
    openConfigModal(): void {
        // Initialize editable fields with current card values
        this.editableTitle.set(this.card().title);
        this.editableDataSourceType.set(this.card().dataSourceType);
        this.editableVisualizationType.set(this.card().visualizationType);
        
        // Open this specific card's modal
        this.isModalOpen.set(true);
    }

    /**
     * Saves the card configuration
     */
    saveConfig(): void {
        // Update card with edited values
        console.log('Saving card configuration...', {
            title: this.editableTitle(),
            dataSourceType: this.editableDataSourceType(),
            visualizationType: this.editableVisualizationType()
        });
        
        // Call service to update card with edited values
        this.dashboardService.updateCard(this.card().id, {
            ...this.card(),
            title: this.editableTitle(),
            dataSourceType: this.editableDataSourceType(),
            visualizationType: this.editableVisualizationType()
        } as DashboardCard);
        
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