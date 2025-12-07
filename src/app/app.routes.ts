import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login.component').then(
            (c) => c.LoginComponent,
          ),
      },
      {
        path: 'callback',
        loadComponent: () =>
          import('./features/auth/callback.component').then(
            (c) => c.CallbackComponent,
          ),
      },
      {
        path: 'access-denied',
        loadComponent: () =>
          import('./features/auth/access-denied.component').then(
            (c) => c.AccessDeniedComponent,
          ),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'apps',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./shared/components/layout.component').then(
        (c) => c.LayoutComponent,
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent,
          ),
      },
      {
        path: 'users',
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('./features/users/users.component').then(
                (c) => c.UsersComponent,
              ),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/users/user-form.component').then(
                (c) => c.UserFormComponent,
              ),
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('./features/users/user-form.component').then(
                (c) => c.UserFormComponent,
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/users/user-form.component').then(
                (c) => c.UserFormComponent,
              ),
          },
        ],
      },
      {
        path: 'banners',
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('./features/banners/banners.component').then(
                (c) => c.BannersComponent,
              ),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/banners/banner-form.component').then(
                (c) => c.BannerFormComponent,
              ),
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('./features/banners/banner-form.component').then(
                (c) => c.BannerFormComponent,
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/banners/banner-form.component').then(
                (c) => c.BannerFormComponent,
              ),
          },
        ],
      },
      {
        path: 'batches',
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('./features/batches/batches.component').then(
                (c) => c.BatchesComponent,
              ),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/batches/batch-form.component').then(
                (c) => c.BatchFormComponent,
              ),
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('./features/batches/batch-form.component').then(
                (c) => c.BatchFormComponent,
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/batches/batch-form.component').then(
                (c) => c.BatchFormComponent,
              ),
          },
        ],
      },
      {
        path: 'membership',
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('./features/membership/membership.component').then(
                (c) => c.MembershipComponent,
              ),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/membership/membership-detail.component').then(
                (c) => c.MembershipDetailComponent,
              ),
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('./features/membership/membership-detail.component').then(
                (c) => c.MembershipDetailComponent,
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/membership/membership-detail.component').then(
                (c) => c.MembershipDetailComponent,
              ),
          },
        ],
      },
      {
        path: 'blogs',
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('./features/blogs/blogs.component').then(
                (c) => c.BlogsComponent,
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/blogs/blog-detail.component').then(
                (c) => c.BlogDetailComponent,
              ),
          },
        ],
      },
      {
        path: 'committees',
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('./features/committees/committees.component').then(
                (c) => c.CommitteesComponent,
              ),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/committees/committee-form.component').then(
                (c) => c.CommitteeFormComponent,
              ),
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('./features/committees/committee-form.component').then(
                (c) => c.CommitteeFormComponent,
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/committees/committee-detail.component').then(
                (c) => c.CommitteeDetailComponent,
              ),
          },
        ],
      },
      {
        path: 'committees/:committeeId/designations',
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('./features/committees/committee-designations.component').then(
                (c) => c.CommitteeDesignationsComponent,
              ),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/committees/designation-form.component').then(
                (c) => c.DesignationFormComponent,
              ),
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('./features/committees/designation-form.component').then(
                (c) => c.DesignationFormComponent,
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/committees/designation-form.component').then(
                (c) => c.DesignationFormComponent,
              ),
          },
        ],
      },
      {
        path: 'settings',
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('./features/settings/settings.component').then(
                (c) => c.SettingsComponent,
              ),
          },
        ],
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'apps',
    pathMatch: 'full',
  },
];
