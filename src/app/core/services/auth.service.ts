import { Injectable, inject, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private auth0 = inject(Auth0Service);
  private destroy$ = new Subject<void>();

  constructor(private router: Router) {
    // Initialize user from Auth0
    this.initializeUser();
  }

  private initializeUser(): void {
    this.auth0.user$
      .pipe(
        takeUntil(this.destroy$),
        map((auth0User) => {
          if (!auth0User) return null;

          // Extract roles from Auth0 user metadata
          // Roles can be in various places depending on Auth0 configuration
          const roles =
            auth0User['https://alumni.com/roles'] || // Custom claim
            auth0User['roles'] || // Direct property
            auth0User['app_metadata']?.roles || // App metadata
            auth0User['user_metadata']?.roles || // User metadata
            [];

          const user: User = {
            id: auth0User.sub || '',
            email: auth0User.email || '',
            name: auth0User.name || auth0User.email || '',
            roles: Array.isArray(roles) ? roles : [],
            avatar: auth0User.picture,
          };

          return user;
        }),
      )
      .subscribe((user) => {
        this.currentUserSubject.next(user);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login(returnUrl?: string): void {
    // Store returnUrl in localStorage to retrieve after callback
    if (returnUrl) {
      localStorage.setItem('auth_return_url', returnUrl);
    }

    // Redirect to Auth0 login
    this.auth0.loginWithRedirect();
  }

  logout(): void {
    // Clear client-side user data
    this.currentUserSubject.next(null);
    localStorage.removeItem('auth_return_url');

    // Redirect to Auth0 logout which will also redirect back to the app
    // Note: The returnTo URL must be configured in Auth0 Dashboard under "Allowed Logout URLs"
    this.auth0.logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }

  isAuthenticated(): Observable<boolean> {
    return this.auth0.isAuthenticated$;
  }

  checkAuthenticationStatus(): Observable<boolean> {
    return this.auth0.isAuthenticated$.pipe(
      switchMap((isAuth) => {
        if (!isAuth) {
          return of(false);
        }

        // Check if user has proper roles (not just member or guest)
        return this.hasAdminAccess$();
      }),
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(roleToCheck: string | string[]): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.roles) return false;

    const userRoles = user.roles;
    const rolesToCheck = Array.isArray(roleToCheck)
      ? roleToCheck
      : [roleToCheck];

    return rolesToCheck.some((role) =>
      userRoles.some(
        (userRole: string) => userRole?.toLowerCase() === role?.toLowerCase(),
      ),
    );
  }

  hasAnyRole(roles: string[]): boolean {
    return this.hasRole(roles);
  }

  isPublisher(): boolean {
    return this.hasRole('Publisher');
  }

  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  canPublish(): boolean {
    return this.hasAnyRole(['Publisher', 'Admin']);
  }

  /**
   * Check if user has admin access (roles other than member and guest)
   */
  hasAdminAccess(): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.roles || user.roles.length === 0) {
      return false;
    }

    // User must have at least one role that is NOT 'member' or 'guest'
    const hasNonMemberGuestRole = user.roles.some(
      (role) =>
        role.toLowerCase() !== 'member' && role.toLowerCase() !== 'guest',
    );

    return hasNonMemberGuestRole;
  }

  /**
   * Observable version of hasAdminAccess
   */
  hasAdminAccess$(): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user) => {
        if (!user || !user.roles || user.roles.length === 0) {
          return false;
        }

        // User must have at least one role that is NOT 'member' or 'guest'
        const hasNonMemberGuestRole = user.roles.some(
          (role) =>
            role.toLowerCase() !== 'member' && role.toLowerCase() !== 'guest',
        );

        return hasNonMemberGuestRole;
      }),
    );
  }
}

