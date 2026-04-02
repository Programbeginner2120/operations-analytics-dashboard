import { Component, computed, inject, output, signal } from "@angular/core";
import { InputComponent } from "../../../shared/components/input/input.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { AuthService } from "../../../services/auth.service";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    imports: [InputComponent, ButtonComponent]
})
export class RegisterComponent {

    private readonly authService = inject(AuthService);

    navigateToSignIn = output<void>();

    readonly isLoading = signal<boolean>(false);
    readonly errorMessage = signal<string | undefined>(undefined);

    readonly email = signal<string>('');
    readonly password = signal<string>('');
    readonly displayName = signal<string>('');

    readonly formTitle = computed(() => 'Create Account');
    readonly formSubtitle = computed(() =>
        'Create an account to get started.'
    );
    readonly submitLabel = computed(() => 'Create Account');
    readonly toggleLabel = computed(() =>
        "Already have an account? Sign in"
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

}