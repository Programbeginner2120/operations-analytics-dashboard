import { Component, computed, inject, output, signal } from "@angular/core";
import { InputComponent } from "../../../shared/components/input/input.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { AuthService } from "../../../services/auth.service";
import { ModalComponent } from "../../../shared/components/modal/modal.component";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    imports: [InputComponent, ButtonComponent, ModalComponent]
})
export class RegisterComponent {

    private readonly authService = inject(AuthService);

    navigateToSignIn = output<void>();
    navigateToForgotPassword = output<void>();

    readonly isLoading = signal<boolean>(false);
    readonly errorMessage = signal<string | undefined>(undefined);

    readonly email = signal<string>('');
    readonly password = signal<string>('');
    readonly displayName = signal<string>('');

    readonly isCheckEmailModalOpen = signal<boolean>(false);

    readonly formTitle = computed(() => 'Create Account');
    readonly formSubtitle = computed(() =>
        'Create an account to get started'
    );
    readonly submitLabel = computed(() => 'Create Account');
    readonly signUpNavigationLabel = computed(() =>
        "Already have an account? Sign in"
    );
    readonly forgotPasswordNavigationLabel = computed(() => 
        "Forgot your password? Click here to reset it"
    );

    handleRegister(): void {
        this.authService.register({
            email: this.email(),
            password: this.password(),
            displayName: this.displayName() || undefined
        }).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.navigateToSignIn.emit();
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

    closeCheckEmailModal() {
        this.isCheckEmailModalOpen.set(false);
        this.navigateToSignIn.emit();
    }

}