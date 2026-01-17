import { Component, inject, Signal } from "@angular/core";
import { DashboardCard } from "../../../interfaces/dashboard.interface";
import { DashboardService } from "../../../services/dashboard.service";
import { DashboardHeaderComponent } from "../dashboard-header/dashboard-header.component";
import { DashboardCardComponent } from "../dashboard-card/dashboard-card.component";

@Component({
    selector: 'app-dashboard-layout',
    templateUrl: './dashboard-layout.component.html',
    styleUrls: ['./dashboard-layout.component.scss'],
    imports: [DashboardHeaderComponent, DashboardCardComponent]
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