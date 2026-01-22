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
    }
];
