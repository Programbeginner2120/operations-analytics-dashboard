import { Component, computed, inject, signal, WritableSignal } from "@angular/core";
import { Router } from "@angular/router";
import { InputComponent } from "../../../shared/components/input/input.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { AuthService } from "../../../services/auth.service";
import { ThemeService } from "../../../services/theme.service";
import { Theme } from "../../../interfaces/theme.interface";
import { LucideAngularModule, LayoutGrid, Moon, Sun } from "lucide-angular";
import { AuthMode } from "../../../interfaces/auth.interface";
import { LoginComponent } from "../login/login.component";
import { RegisterComponent } from "../register/register.component";

@Component({
    selector: 'app-auth-layout',
    templateUrl: './auth-layout.component.html',
    styleUrls: ['./auth-layout.component.scss'],
    imports: [InputComponent, ButtonComponent, LucideAngularModule, LoginComponent, RegisterComponent]
})
export class AuthLayoutComponent {

    readonly layoutGrid = LayoutGrid;
    readonly moon = Moon;
    readonly sun = Sun;

    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    readonly themeService = inject(ThemeService);

    readonly theme = computed<Theme>(() => this.themeService.theme());

    currentMode: WritableSignal<AuthMode> = signal('LOGIN');

    // readonly isLoginMode = signal<boolean>(true);
    // readonly isLoading = signal<boolean>(false);
    // readonly errorMessage = signal<string | undefined>(undefined);

    // readonly email = signal<string>('');
    // readonly password = signal<string>('');
    // readonly displayName = signal<string>('');

    // readonly formTitle = computed(() => this.isLoginMode() ? 'Sign In' : 'Create Account');
    // readonly formSubtitle = computed(() =>
    //     this.isLoginMode()
    //         ? 'Sign in to access your analytics dashboard.'
    //         : 'Create an account to get started.'
    // );
    // readonly submitLabel = computed(() => this.isLoginMode() ? 'Sign In' : 'Create Account');
    // readonly toggleLabel = computed(() =>
    //     this.isLoginMode()
    //         ? "Don't have an account? Sign up"
    //         : "Already have an account? Sign in"
    // );

    // toggleMode(): void {
    //     this.isLoginMode.update(v => !v);
    //     this.errorMessage.set(undefined);
    // }

    // onSubmit(): void {
    //     this.errorMessage.set(undefined);

    //     if (!this.email() || !this.password()) {
    //         this.errorMessage.set('Please fill in all required fields.');
    //         return;
    //     }

    //     if (!this.isLoginMode() && this.password().length < 8) {
    //         this.errorMessage.set('Password must be at least 8 characters.');
    //         return;
    //     }

    //     this.isLoading.set(true);

    //     if (this.isLoginMode()) {
    //         this.handleLogin();
    //     } else {
    //         this.handleRegister();
    //     }
    // }

    // private handleLogin(): void {
    //     this.authService.login({ email: this.email(), password: this.password() }).subscribe({
    //         next: () => {
    //             this.authService.loadCurrentUser().subscribe({
    //                 next: () => {
    //                     this.isLoading.set(false);
    //                     this.router.navigate(['/landing-page']);
    //                 }
    //             });
    //         },
    //         error: (err) => {
    //             this.isLoading.set(false);
    //             this.errorMessage.set(
    //                 err.status === 401
    //                     ? 'Invalid email or password.'
    //                     : 'An error occurred. Please try again.'
    //             );
    //         }
    //     });
    // }

    // private handleRegister(): void {
    //     this.authService.register({
    //         email: this.email(),
    //         password: this.password(),
    //         displayName: this.displayName() || undefined
    //     }).subscribe({
    //         next: () => {
    //             this.isLoading.set(false);
    //             this.isLoginMode.set(true);
    //             this.errorMessage.set(undefined);
    //             this.password.set('');
    //         },
    //         error: (err) => {
    //             this.isLoading.set(false);
    //             this.errorMessage.set(
    //                 err.status === 409
    //                     ? 'An account with this email already exists.'
    //                     : 'Registration failed. Please try again.'
    //             );
    //         }
    //     });
    // }
}
