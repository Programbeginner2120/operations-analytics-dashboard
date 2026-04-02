import { Component, computed, inject, output, signal } from "@angular/core";
import { InputComponent } from "../../../shared/components/input/input.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    imports: [InputComponent, ButtonComponent]
})
export class ForgotPasswordComponent {

    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    navigateToSignIn = output<void>();
    navigateToRegister = output<void>();

    readonly isLoading = signal<boolean>(false);

    readonly email = signal<string>('');

    readonly formTitle = computed(() => 'Forogt Password');
    readonly formSubtitle = computed(() =>'Enter your email to receive an reset password link');

    readonly submitLabel = computed(() => 'Submit');

    readonly signInNavigationLabel = computed(() => "Back to sign in");
    readonly registerNavigationLabel = computed(() => "Back to sign up");

    // handleLogin(): void {
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

    handleForgotPassword(): void {

    }

}