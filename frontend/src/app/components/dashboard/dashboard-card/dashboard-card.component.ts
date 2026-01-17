import { Component, computed, inject, input, signal } from "@angular/core";
import { DashboardCard, DashboardVisualizationType, DashboardDataSourceType } from "../../../interfaces/dashboard.interface";
import { LucideAngularModule, Save, Settings, X, Type, Database, BarChart3, PieChart } from "lucide-angular";
import { BarChartComponent } from "../../charts/bar-chart/bar-chart.component";
import { DashboardService } from "../../../services/dashboard.service";
import { PieChartComponent } from "../../charts/pie-chart/pie-chart.component";
import { ModalComponent } from "../../../shared/components/modal/modal.component";
import { ModalService } from "../../../shared/services/modal.service";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { InputComponent } from "../../../shared/components/input/input.component";
import { SelectComponent } from "../../../shared/components/select/select.component";
import { SelectOption } from "../../../shared/interfaces/select.interface";

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
    readonly databaseIcon = Database;
    readonly barChartIcon = BarChart3;
    readonly pieChartIcon = PieChart;

    readonly DashboardVisualizationType = DashboardVisualizationType;

    card = input.required<DashboardCard>();

    readonly dashboardService = inject(DashboardService);
    readonly modalService = inject(ModalService);

    readonly settings = Settings;

    // Form signals for config modal
    cardTitle = signal<string>('');
    dataSourceType = signal<string | number | null>(null);
    visualizationType = signal<string | number | null>(null);

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
            return {
                title: 'Transactions',
                xAxisData: this.card().data.map(t => t.value.date).sort((a, b) => new Date(a).getTime() - new Date(b).getTime()) ?? [],
                xAxisLabel: 'Date',
                yAxisData: this.card().data.map(t => t.value.amount).sort((a, b) => a - b) ?? [],
                yAxisLabel: 'Amount',
                formatter: (value: number) => "$" + value.toFixed(2)
            }
        }
        return null;
    })

    readonly pieChartData = computed(() => {
        if (this.card().visualizationType === DashboardVisualizationType.PIE_CHART) {
            return {
                title: 'Account Balances',
                labels: this.card().data.map(a => a.value.name) ?? [],
                values: this.card().data.map(a => a.value.balances.current ?? 0) ?? [],
                formatter: (value: number) => value.toFixed(2)
            }
        }
        return null;
    });

    /**
     * Opens the configuration modal
     */
    openConfigModal(): void {
        // Pre-populate form with current card values
        this.cardTitle.set(this.card().title);
        this.dataSourceType.set(this.card().dataSourceType);
        this.visualizationType.set(this.card().visualizationType);
        this.modalService.open();
    }

    /**
     * Saves the card configuration
     */
    saveConfig(): void {
        // Update card with new values
        console.log('Saving card configuration...', {
            title: this.cardTitle(),
            dataSourceType: this.dataSourceType(),
            visualizationType: this.visualizationType()
        });
        
        // TODO: Call service to update card
        // this.dashboardService.updateCard(this.card().id, {
        //     title: this.cardTitle(),
        //     dataSourceType: this.dataSourceType() as DashboardDataSourceType,
        //     visualizationType: this.visualizationType() as DashboardVisualizationType
        // });
        
        this.modalService.close();
    }
}