import { Component, computed, inject, signal, WritableSignal } from "@angular/core";
import { ThemeService } from "../../../services/theme.service";
import { Theme } from "../../../interfaces/theme.interface";
import { LucideAngularModule, LayoutGrid, Moon, Sun } from "lucide-angular";
import { AuthMode } from "../../../interfaces/auth.interface";
import { LoginComponent } from "../login/login.component";
import { RegisterComponent } from "../register/register.component";
import { ForgotPasswordComponent } from "../forgot-password/forgot-password.component";

@Component({
    selector: 'app-auth-layout',
    templateUrl: './auth-layout.component.html',
    styleUrls: ['./auth-layout.component.scss'],
    imports: [LucideAngularModule, LoginComponent, RegisterComponent, ForgotPasswordComponent]
})
export class AuthLayoutComponent {

    readonly layoutGrid = LayoutGrid;
    readonly moon = Moon;
    readonly sun = Sun;

    readonly themeService = inject(ThemeService);

    readonly theme = computed<Theme>(() => this.themeService.theme());

    currentMode: WritableSignal<AuthMode> = signal('LOGIN');

}
