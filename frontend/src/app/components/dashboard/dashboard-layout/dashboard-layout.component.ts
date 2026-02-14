import { Component, computed, inject, OnInit, Signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { DashboardCard } from "../../../interfaces/dashboard.interface";
import { DashboardService } from "../../../services/dashboard.service";
import { HeaderComponent } from "../../header/header.component";
import { DashboardCardComponent } from "../dashboard-card/dashboard-card.component";

@Component({
    selector: 'app-dashboard-layout',
    templateUrl: './dashboard-layout.component.html',
    styleUrls: ['./dashboard-layout.component.scss'],
    imports: [HeaderComponent, DashboardCardComponent, RouterLink]
})
export class DashboardLayoutComponent implements OnInit {
    
    readonly dashboardService = inject(DashboardService);

    readonly hasConnectedDataSources = computed(() => this.dashboardService.hasConnectedDataSources());

    ngOnInit(): void {
        this.dashboardService.refreshDataSourceStatus();
    }

    get cards(): Signal<DashboardCard[]> {
        return this.dashboardService.cards;
    }

    addCard(): void {
        this.dashboardService.addCard();
    }

}