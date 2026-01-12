import { Component, input } from "@angular/core";
import { DashboardCard } from "../../../interfaces/dashboard.interface";
import { LucideAngularModule, Settings } from "lucide-angular";
import { BarChartComponent } from "../../charts/bar-chart/bar-chart.component";

@Component({
    selector: 'app-dashboard-card',
    templateUrl: './dashboard-card.component.html',
    styleUrls: ['./dashboard-card.component.scss'],
    imports: [LucideAngularModule, BarChartComponent]
})
export class DashboardCardComponent {
    card = input.required<DashboardCard>();

    readonly settings = Settings;
}