import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/landing-page',
        pathMatch: 'full'
    },
    {
        path: 'landing-page',
        loadComponent: () => import('./components/landing-page/landing-page-layout/landing-page-layout.component').then(m => m.LandingPageLayoutComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent)
    },
    {
        path: 'manage-sources',
        loadComponent: () => import('./components/manage-sources/manage-sources-layout/manage-sources-layout.component').then(m => m.ManageSourcesLayoutComponent)
    },
    {
        path: 'manage-sources/plaid',
        loadComponent: () => import('./components/manage-sources/plaid/plaid-layout/plaid-layout.component').then(m => m.PlaidLayoutComponent)
    }
];
