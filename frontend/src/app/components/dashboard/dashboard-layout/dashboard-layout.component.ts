import { Component, computed, inject, Signal, signal, WritableSignal } from "@angular/core";
import { DashboardCard } from "../../../interfaces/dashboard.interface";
import { DashboardService } from "../../../services/dashboard.service";
import { BarChartComponent } from "../../charts/bar-chart/bar-chart.component";

@Component({
    selector: 'app-dashboard-layout',
    templateUrl: './dashboard-layout.component.html',
    styleUrls: ['./dashboard-layout.component.scss'],
    imports: [BarChartComponent]
})
export class DashboardLayoutComponent {
    
    readonly dashboardService = inject(DashboardService);

    get cards(): Signal<DashboardCard[]> {
        return this.dashboardService.cards;
    }

    addCard() {
        this.dashboardService.addCard();
    }

}