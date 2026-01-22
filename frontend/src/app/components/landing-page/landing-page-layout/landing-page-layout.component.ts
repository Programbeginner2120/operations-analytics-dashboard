import { Component, computed, inject, Signal } from "@angular/core";
import { ArrowRight, LayoutGrid, LucideAngularModule } from "lucide-angular";
import { HeaderComponent } from "../../header/header.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { ThemeService } from "../../../services/theme.service";
import { Theme } from "../../../interfaces/theme.interface";
import { NgClass } from "@angular/common";

@Component({
    selector: 'app-landing-page-layout',
    templateUrl: './landing-page-layout.component.html',
    styleUrls: ['./landing-page-layout.component.scss'],
    imports: [HeaderComponent, LucideAngularModule, ButtonComponent, NgClass]
})
export class LandingPageLayoutComponent {

    readonly layoutGrid = LayoutGrid;
    readonly rightArrow = ArrowRight;

    readonly themeService = inject(ThemeService);

    readonly theme: Signal<Theme> = computed(() => this.themeService.theme());

}