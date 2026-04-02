export interface RegisterRequest {
    email: string;
    password: string;
    displayName?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    expiresIn: number;
}

export interface UserResponse {
    id: number;
    email: string;
    displayName: string | null;
    emailVerified: boolean;
}

export interface VerifyEmailRequest {
    token: string;
}

export interface ResendVerificationRequest {
    email: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

export type AuthMode = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD';


