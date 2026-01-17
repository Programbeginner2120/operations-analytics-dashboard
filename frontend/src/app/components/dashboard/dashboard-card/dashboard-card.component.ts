import { Component, computed, inject, input, Signal } from "@angular/core";
import { DashboardCard, DashboardVisualizationType } from "../../../interfaces/dashboard.interface";
import { LucideAngularModule, Settings } from "lucide-angular";
import { BarChartComponent } from "../../charts/bar-chart/bar-chart.component";
import { DashboardService } from "../../../services/dashboard.service";
import { PieChartComponent } from "../../charts/pie-chart/pie-chart.component";
import { ModalComponent } from "../../../shared/components/modal/modal.component";
import { ModalService } from "../../../shared/services/modal.service";

@Component({
    selector: 'app-dashboard-card',
    templateUrl: './dashboard-card.component.html',
    styleUrls: ['./dashboard-card.component.scss'],
    imports: [LucideAngularModule, BarChartComponent, PieChartComponent, ModalComponent]
})
export class DashboardCardComponent {
    readonly DashboardVisualizationType = DashboardVisualizationType;

    card = input.required<DashboardCard>();

    readonly dashboardService = inject(DashboardService);
    readonly modalService = inject(ModalService);

    readonly settings = Settings;

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
        this.modalService.open();
    }

    /**
     * Saves the card configuration
     */
    saveConfig(): void {
        // TODO: Implement card configuration save logic
        console.log('Saving card configuration...');
        this.modalService.close();
    }
}