import { Component, computed, inject, input, Signal } from "@angular/core";
import { ThemeService } from "../../services/theme.service";
import { DashboardService } from "../../services/dashboard.service";
import { AuthService } from "../../services/auth.service";
import { ArrowLeft, LogOut, LucideAngularModule, Minus } from "lucide-angular";
import { LayoutGrid, Moon, Plus, Sun } from "lucide-angular";
import { Theme } from "../../interfaces/theme.interface";
import { ButtonComponent } from "../../shared/components/button/button.component";
import { Router } from "@angular/router";
import { PlatformService } from "../../services/platform.service";
import { HamburgerMenuComponent } from "../../shared/components/hamburger/hamburger.component";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [LucideAngularModule, ButtonComponent, HamburgerMenuComponent],
    host: {
        '[class.is-mobile]': 'platformService.isMobile()'
    }
})
export class HeaderComponent {

    readonly showDashboardSpecificContent = input<boolean>(false);
    readonly onLandingPage = input<boolean>(false);

    readonly layoutGrid = LayoutGrid;
    readonly moon = Moon;
    readonly sun = Sun;
    readonly plus = Plus;
    readonly minus = Minus;
    readonly arrowLeft = ArrowLeft;
    readonly logOut = LogOut;

    readonly themeService = inject(ThemeService);
    readonly dashboardService = inject(DashboardService);
    readonly authService = inject(AuthService);
    readonly platformService = inject(PlatformService);
    readonly router = inject(Router);

    readonly theme: Signal<Theme> = computed(() => this.themeService.theme());

    readonly currentUser = computed(() => this.authService.currentUser());

    readonly numCards = computed(() => this.dashboardService.numCards());

    readonly hasConnectedDataSources = computed(() => this.dashboardService.hasConnectedDataSources());

    navigateToLandingPage(): void {
        this.router.navigate(['/landing-page']);
    }

    logout(): void {
        this.authService.logout();
    }
}
