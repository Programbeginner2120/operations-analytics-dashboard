import { Component, computed, inject, Signal } from "@angular/core";
import { ThemeService } from "../../../services/theme.service";
import { DashboardService } from "../../../services/dashboard.service";
import { LucideAngularModule } from "lucide-angular";
import { LayoutGrid, Moon, Plus, Sun } from "lucide-angular";
import { Theme } from "../../../interfaces/theme.interface";

@Component({
    selector: 'app-dashboard-header',
    templateUrl: './dashboard-header.component.html',
    styleUrls: ['./dashboard-header.component.scss'],
    imports: [LucideAngularModule]
})
export class DashboardHeaderComponent {

    readonly layoutGrid = LayoutGrid;
    readonly moon = Moon;
    readonly sun = Sun;
    readonly plus = Plus;

    readonly themeService = inject(ThemeService);
    readonly dashboardService = inject(DashboardService);

    readonly theme: Signal<Theme> = computed(() => this.themeService.theme());

    get numCards(): number {
        return this.dashboardService.numCards();
    }
}