import { Component, computed, inject, output, signal, WritableSignal } from "@angular/core";
import { InputComponent } from "../../../shared/components/input/input.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { AuthService } from "../../../services/auth.service";
import { TicketSlash } from "lucide-angular";

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss', '../common/common-styles.scss'],
    imports: [InputComponent, ButtonComponent]
})
export class ForgotPasswordComponent {

    private readonly authService = inject(AuthService);

    navigateToSignIn = output<void>();
    navigateToRegister = output<void>();

    readonly status = signal<'entering-email' | 'email-entered'>('entering-email');

    readonly isLoading = signal<boolean>(false);
    readonly successMessage = signal<string | undefined>(undefined);
    readonly errorMessage = signal<string | undefined>(undefined);

    readonly email = signal<string>('');

    readonly formTitle = computed(() => this.status() === 'entering-email' ?
        'Forogt Password' :
        'Forgot Password Email Sent'
    );
    readonly formSubtitle = computed(() => this.status() === 'entering-email' ? 
        'Enter your email to receive a reset password link.' :
        `A password reset email has been sent to ${this.email()}.`
    );

    readonly submitLabel = computed(() => this.status() === 'entering-email' ?
        'Submit' : 
        'Resend Email'
    );

    readonly signInNavigationLabel = computed(() => "Back to sign in");
    readonly registerNavigationLabel = computed(() => "Back to sign up");

    handleForgotPassword(): void {
        this.clearMessages();
        this.isLoading.set(true);
        this.authService.forgotPassword(this.email()).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.status.set('email-entered');
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(err.status === 404 ?
                    `User with email ${this.email()} not found.` :
                    'Forgot password process failure. Please try again.'
                );
            }
        });
    }

    clearMessages() {
        this.successMessage.set(undefined);
        this.errorMessage.set(undefined);
    }

    resendForgotPassword() {
        this.clearMessages();
        this.isLoading.set(true);
        this.authService.forgotPassword(this.email()).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.successMessage.set(`Forgot password email successfully resent to ${this.email()}`);
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(err.status === 404 ?
                    `User with email ${this.email()} not found.` :
                    'Forgot password process failure. Please try again.'
                );
            }
        });
    }

}