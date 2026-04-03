import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, tap, catchError, of, Subject, throwError } from "rxjs";
import { LoginRequest, LoginResponse, RegisterRequest, UserResponse } from "../interfaces/auth.interface";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);

    private readonly API_URL = '/auth';
    private readonly TOKEN_KEY = 'auth_token';

    private readonly _currentUser = signal<UserResponse | null>(null);
    private readonly _token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));

    readonly currentUser = this._currentUser.asReadonly();

    readonly isAuthenticated = computed(() => {
        const token = this._token();
        if (!token) return false;
        return !this.isTokenExpired(token);
    });

    private logoutSubject = new Subject<void>();
    logout$ = this.logoutSubject.asObservable();

    register(request: RegisterRequest): Observable<UserResponse> {
        return this.http.post<UserResponse>(`${this.API_URL}/register`, request);
    }

    login(request: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.API_URL}/login`, request).pipe(
            tap(response => {
                this.setToken(response.token);
            }),
            catchError(err => {
                if (err.status === 403 && err.error === 'EMAIL_NOT_VERIFIED') {
                    return throwError(() => new Error('EMAIL_NOT_VERIFIED'));
                }
                return throwError(() => err);
            })
        );
    }

    verifyEmail(token: string): Observable<void> {
        return this.http.post<void>(`${this.API_URL}/verify-email?token=${token}`, null);
    }

    resendVerification(email: string): Observable<void> {
        return this.http.post<void>(`${this.API_URL}/resend-verification`, { email });
    }

    forgotPassword(email: string): Observable<void> {
        return this.http.post<void>(`${this.API_URL}/forgot-password`, { email });
    }

    resetPassword(token: string, newPassword: string): Observable<void> {
        return this.http.post<void>(`${this.API_URL}/reset-password`, { token, newPassword });
    }

    logout(): void {
        this.logoutSubject.next();
        this.clearToken();
        this._currentUser.set(null);
        this.router.navigate(['/login']);
    }

    loadCurrentUser(): Observable<UserResponse | null> {
        if (!this.getToken()) {
            return of(null);
        }
        return this.http.get<UserResponse>(`${this.API_URL}/me`).pipe(
            tap(user => this._currentUser.set(user)),
            catchError(() => {
                this.clearToken();
                this._currentUser.set(null);
                return of(null);
            })
        );
    }

    getToken(): string | null {
        return this._token();
    }

    private setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
        this._token.set(token);
    }

    private clearToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        this._token.set(null);
    }

    private isTokenExpired(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expirationMs = payload.exp * 1000;
            return Date.now() >= expirationMs;
        } catch {
            return true;
        }
    }
}
