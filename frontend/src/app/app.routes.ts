import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./components/auth/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent)
    },
    {
        path: 'landing-page',
        loadComponent: () => import('./components/landing-page/landing-page-layout/landing-page-layout.component').then(m => m.LandingPageLayoutComponent),
        canActivate: [authGuard]
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
        canActivate: [authGuard]
    },
    {
        path: 'manage-sources',
        loadComponent: () => import('./components/manage-sources/manage-sources-layout/manage-sources-layout.component').then(m => m.ManageSourcesLayoutComponent),
        canActivate: [authGuard]
    },
    {
        path: 'manage-sources/plaid',
        loadComponent: () => import('./components/manage-sources/plaid/plaid-layout/plaid-layout.component').then(m => m.PlaidLayoutComponent),
        canActivate: [authGuard]
    }
];
