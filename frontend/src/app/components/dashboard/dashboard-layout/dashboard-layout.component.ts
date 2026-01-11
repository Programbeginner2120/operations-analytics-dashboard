import { Component, computed, inject, Signal, signal, WritableSignal } from "@angular/core";
import { DashboardCard } from "../../../interfaces/dashboard.interface";
import { DashboardService } from "../../../services/dashboard.service";

@Component({
    selector: 'app-dashboard-layout',
    templateUrl: './dashboard-layout.component.html',
    styleUrls: ['./dashboard-layout.component.scss']
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