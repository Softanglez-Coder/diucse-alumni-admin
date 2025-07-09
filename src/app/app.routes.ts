import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        children: [
            { 
                path: 'login', 
                loadComponent: () => import('./features/auth/login.component').then(c => c.LoginComponent)
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'apps',
        // canActivate: [AuthGuard],
        loadComponent: () => import('./shared/components/layout.component').then(c => c.LayoutComponent),
        children: [
            { 
                path: 'dashboard', 
                loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent)
            },
            {
                path: 'users',
                children: [
                    { 
                        path: '', 
                        pathMatch: 'full', 
                        loadComponent: () => import('./features/users/users.component').then(c => c.UsersComponent)
                    },
                    { 
                        path: 'new', 
                        loadComponent: () => import('./features/users/user-form.component').then(c => c.UserFormComponent)
                    },
                    { 
                        path: ':id/edit', 
                        loadComponent: () => import('./features/users/user-form.component').then(c => c.UserFormComponent)
                    },
                    { 
                        path: ':id', 
                        loadComponent: () => import('./features/users/user-form.component').then(c => c.UserFormComponent)
                    },
                ]
            },
            {
                path: 'banners',
                children: [
                    { 
                        path: '', 
                        pathMatch: 'full', 
                        loadComponent: () => import('./features/banners/banners.component').then(c => c.BannersComponent)
                    },
                    { 
                        path: 'new', 
                        loadComponent: () => import('./features/banners/banner-form.component').then(c => c.BannerFormComponent)
                    },
                    { 
                        path: ':id/edit', 
                        loadComponent: () => import('./features/banners/banner-form.component').then(c => c.BannerFormComponent)
                    },
                    { 
                        path: ':id', 
                        loadComponent: () => import('./features/banners/banner-form.component').then(c => c.BannerFormComponent)
                    },
                ]
            },
            {
                path: 'batches',
                children: [
                    { 
                        path: '', 
                        pathMatch: 'full', 
                        loadComponent: () => import('./features/batches/batches.component').then(c => c.BatchesComponent)
                    },
                    { 
                        path: 'new', 
                        loadComponent: () => import('./features/batches/batch-form.component').then(c => c.BatchFormComponent)
                    },
                    { 
                        path: ':id/edit', 
                        loadComponent: () => import('./features/batches/batch-form.component').then(c => c.BatchFormComponent)
                    },
                    { 
                        path: ':id', 
                        loadComponent: () => import('./features/batches/batch-form.component').then(c => c.BatchFormComponent)
                    },
                ]
            },
            {
                path: 'blogs',
                children: [
                    { 
                        path: '', 
                        pathMatch: 'full', 
                        loadComponent: () => import('./features/blogs/blogs.component').then(c => c.BlogsComponent)
                    },
                    { 
                        path: 'new', 
                        loadComponent: () => import('./features/blogs/blog-form.component').then(c => c.BlogFormComponent)
                    },
                    { 
                        path: ':id/edit', 
                        loadComponent: () => import('./features/blogs/blog-form.component').then(c => c.BlogFormComponent)
                    },
                    { 
                        path: ':id', 
                        loadComponent: () => import('./features/blogs/blog-form.component').then(c => c.BlogFormComponent)
                    },
                ]
            },
            {
                path: 'events',
                children: [
                    { 
                        path: '', 
                        pathMatch: 'full', 
                        loadComponent: () => import('./features/events/events.component').then(c => c.EventsComponent)
                    },
                    { 
                        path: 'new', 
                        loadComponent: () => import('./features/events/event-form.component').then(c => c.EventFormComponent)
                    },
                    { 
                        path: ':id/edit', 
                        loadComponent: () => import('./features/events/event-form.component').then(c => c.EventFormComponent)
                    },
                    { 
                        path: ':id', 
                        loadComponent: () => import('./features/events/event-form.component').then(c => c.EventFormComponent)
                    },
                ]
            },
            {
                path: 'news',
                children: [
                    { 
                        path: '', 
                        pathMatch: 'full', 
                        loadComponent: () => import('./features/news/news.component').then(c => c.NewsComponent)
                    },
                    { 
                        path: 'new', 
                        loadComponent: () => import('./features/news/news-form.component').then(c => c.NewsFormComponent)
                    },
                    { 
                        path: ':id/edit', 
                        loadComponent: () => import('./features/news/news-form.component').then(c => c.NewsFormComponent)
                    },
                    { 
                        path: ':id', 
                        loadComponent: () => import('./features/news/news-form.component').then(c => c.NewsFormComponent)
                    },
                ]
            },
            {
                path: 'jobs',
                children: [
                    { 
                        path: '', 
                        pathMatch: 'full', 
                        loadComponent: () => import('./features/jobs/jobs.component').then(c => c.JobsComponent)
                    },
                    { 
                        path: 'new', 
                        loadComponent: () => import('./features/jobs/job-form.component').then(c => c.JobFormComponent)
                    },
                    { 
                        path: ':id/edit', 
                        loadComponent: () => import('./features/jobs/job-form.component').then(c => c.JobFormComponent)
                    },
                    { 
                        path: ':id', 
                        loadComponent: () => import('./features/jobs/job-form.component').then(c => c.JobFormComponent)
                    },
                ]
            },
            {
                path: 'donations',
                children: [
                    { 
                        path: '', 
                        pathMatch: 'full', 
                        loadComponent: () => import('./features/donations/donations.component').then(c => c.DonationsComponent)
                    },
                    { 
                        path: 'new', 
                        loadComponent: () => import('./features/donations/donation-form.component').then(c => c.DonationFormComponent)
                    },
                    { 
                        path: ':id/edit', 
                        loadComponent: () => import('./features/donations/donation-form.component').then(c => c.DonationFormComponent)
                    },
                    { 
                        path: ':id', 
                        loadComponent: () => import('./features/donations/donation-form.component').then(c => c.DonationFormComponent)
                    },
                ]
            },
            {
                path: 'scholarship',
                children: [
                    { 
                        path: '', 
                        pathMatch: 'full', 
                        loadComponent: () => import('./features/scholarship/scholarship.component').then(c => c.ScholarshipComponent)
                    },
                    { 
                        path: 'new', 
                        loadComponent: () => import('./features/scholarship/scholarship-form.component').then(c => c.ScholarshipFormComponent)
                    },
                    { 
                        path: ':id/edit', 
                        loadComponent: () => import('./features/scholarship/scholarship-form.component').then(c => c.ScholarshipFormComponent)
                    },
                    { 
                        path: ':id', 
                        loadComponent: () => import('./features/scholarship/scholarship-form.component').then(c => c.ScholarshipFormComponent)
                    },
                ]
            },
            {
                path: 'settings',
                children: [
                    { 
                        path: '', 
                        pathMatch: 'full', 
                        loadComponent: () => import('./features/settings/settings.component').then(c => c.SettingsComponent)
                    },
                    { 
                        path: 'general', 
                        loadComponent: () => import('./features/settings/general-settings.component').then(c => c.GeneralSettingsComponent)
                    },
                    { 
                        path: 'profile', 
                        loadComponent: () => import('./features/settings/profile-settings.component').then(c => c.ProfileSettingsComponent)
                    },
                ]
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: 'apps',
        pathMatch: 'full'
    }
];