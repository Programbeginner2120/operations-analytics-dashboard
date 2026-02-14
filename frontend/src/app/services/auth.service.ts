import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, tap, catchError, of } from "rxjs";
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

    readonly currentUser = this._currentUser.asReadonly();

    readonly isAuthenticated = computed(() => {
        const token = this.getToken();
        if (!token) return false;
        return !this.isTokenExpired(token);
    });

    register(request: RegisterRequest): Observable<UserResponse> {
        return this.http.post<UserResponse>(`${this.API_URL}/register`, request);
    }

    login(request: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.API_URL}/login`, request).pipe(
            tap(response => {
                this.setToken(response.token);
            })
        );
    }

    logout(): void {
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
        return localStorage.getItem(this.TOKEN_KEY);
    }

    private setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    private clearToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
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
