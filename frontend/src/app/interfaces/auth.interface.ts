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
}

export type AuthMode = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD';
