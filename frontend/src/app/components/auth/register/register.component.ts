import { Component, computed, inject, output, signal } from "@angular/core";
import { InputComponent } from "../../../shared/components/input/input.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { AuthService } from "../../../services/auth.service";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss', '../common/common-styles.scss'],
    imports: [InputComponent, ButtonComponent]
})
export class RegisterComponent {

    private readonly authService = inject(AuthService);

    navigateToSignIn = output<void>();
    navigateToForgotPassword = output<void>();

    readonly isLoading = signal<boolean>(false);
    readonly successMessage = signal<string | undefined>(undefined);
    readonly errorMessage = signal<string | undefined>(undefined);

    readonly email = signal<string>('');
    readonly password = signal<string>('');
    readonly displayName = signal<string>('');

    readonly status = signal<'entering-email' | 'email-entered'>('entering-email');

    readonly formTitle = computed(() => this.status() === 'entering-email' ?
        'Create Account' :
        'Verification Email Sent');
    readonly formSubtitle = computed(() =>
        this.status() === 'entering-email' ? 
        'Create an account to get started' : 
        `An email has been to the address ${this.email()} for verification purposes`
    );
    readonly submitLabel = computed(() => this.status() === 'entering-email' ? 
        'Create Account' : 
        'Resend Verification Email'
    );
    readonly signUpNavigationLabel = computed(() =>
        this.status() === 'entering-email' ?
        "Already have an account? Sign in" :
        "Back to sign in"
    );
    readonly forgotPasswordNavigationLabel = computed(() => 
        "Forgot your password? Click here to reset it"
    );

    clearMessages() {
        this.successMessage.set(undefined);
        this.errorMessage.set(undefined);
    }

    handleRegister(): void {
        this.clearMessages();
        this.isLoading.set(true);
        this.authService.register({
            email: this.email(),
            password: this.password(),
            displayName: this.displayName() || undefined
        }).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.status.set('email-entered');
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(
                    err.status === 409
                        ? 'An account with this email already exists.'
                        : 'Registration failed. Please try again.'
                );
            }
        });
    }

    resendVerification(): void {
        this.clearMessages();
        this.isLoading.set(true);
        this.authService.resendVerification(this.email()).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.successMessage.set(`Resent verification email to address ${this.email()}.`);
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(
                    err.status === 404
                        ? 'User with this email not found.'
                        : 'Email resend failed. Please try again.'
                );
            }
        })
    }

}