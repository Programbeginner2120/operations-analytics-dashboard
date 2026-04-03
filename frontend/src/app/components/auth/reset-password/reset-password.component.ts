import { Component, computed, inject, signal, WritableSignal } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { ActivatedRoute } from "@angular/router";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { InputComponent } from "../../../shared/components/input/input.component";

@Component({
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    imports: [ButtonComponent, InputComponent]
})
export class ResetPasswordComponent {
    private readonly authService = inject(AuthService);
    private readonly route = inject(ActivatedRoute);

    protected readonly status = signal<'token-error' | 'verifying-token' | 'enter-password' | 'enter-password-success' | 'enter-password-failure'>('verifying-token');

    readonly newPassword = signal<string>('');

    token: WritableSignal<string> = signal('');

    submitLabel = computed(() => 'Reset Password');
    
    constructor() {
        const token = this.route.snapshot.queryParamMap.get('token') ?? '';

        if (!token) {
            this.status.set('token-error');
            return;
        }

        this.status.set('enter-password');
    }

    onResetPassword() {
        this.authService.resetPassword(this.token(), this.newPassword()).subscribe({
            next: () => this.status.set('enter-password-success'),
            error: () => this.status.set('enter-password-failure')
        });
    }
}