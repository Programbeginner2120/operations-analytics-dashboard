import { Component, inject, Signal } from "@angular/core";
import { DashboardCard } from "../../../interfaces/dashboard.interface";
import { DashboardService } from "../../../services/dashboard.service";
import { HeaderComponent } from "../../header/header.component";
import { DashboardCardComponent } from "../dashboard-card/dashboard-card.component";

@Component({
    selector: 'app-dashboard-layout',
    templateUrl: './dashboard-layout.component.html',
    styleUrls: ['./dashboard-layout.component.scss'],
    imports: [HeaderComponent, DashboardCardComponent]
})
export class DashboardLayoutComponent {
    
    readonly dashboardService = inject(DashboardService);

    get cards(): Signal<DashboardCard[]> {
        return this.dashboardService.cards;
    }

    addCard(): void {
        this.dashboardService.addCard();
    }

}