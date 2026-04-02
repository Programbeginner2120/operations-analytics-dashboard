import { Component, computed, inject, output, signal } from "@angular/core";
import { InputComponent } from "../../../shared/components/input/input.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [InputComponent, ButtonComponent]
})
export class LoginComponent {

    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    navigateToRegister = output<void>();

    readonly isLoading = signal<boolean>(false);
    readonly errorMessage = signal<string | undefined>(undefined);

    readonly email = signal<string>('');
    readonly password = signal<string>('');

    readonly formTitle = computed(() => 'Sign In');
    readonly formSubtitle = computed(() =>'Sign in to access your analytics dashboard.');

    readonly submitLabel = computed(() => 'Sign In');

    readonly toggleLabel = computed(() => "Don't have an account? Sign up");

    handleLogin(): void {
        this.authService.login({ email: this.email(), password: this.password() }).subscribe({
            next: () => {
                this.authService.loadCurrentUser().subscribe({
                    next: () => {
                        this.isLoading.set(false);
                        this.router.navigate(['/landing-page']);
                    }
                });
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(
                    err.status === 401
                        ? 'Invalid email or password.'
                        : 'An error occurred. Please try again.'
                );
            }
        });
    }

}