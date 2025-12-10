import { Injectable, inject, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, map, switchMap, takeUntil, tap, filter, take } from 'rxjs/operators';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../index';

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
  private http = inject(HttpClient);
  private apiBaseUrl = inject(API_BASE_URL);
  private destroy$ = new Subject<void>();
  private userInitialized$ = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) {
    // Initialize user from Auth0 and backend API
    this.initializeUser();
  }

  private initializeUser(): void {
    this.auth0.user$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((auth0User) => {
          if (!auth0User) {
            console.log('🔐 No Auth0 user, setting user to null');
            return of(null);
          }

          console.log('🔐 Auth0 User authenticated:', auth0User.email);

          // Fetch user data from backend API to get roles from database
          return this.fetchUserFromBackend().pipe(
            map((backendUser) => {
              if (!backendUser) {
                console.warn('🔐 No user data from backend API');
                return null;
              }

              console.log('🔐 Backend user data:', backendUser);

              const user: User = {
                id: backendUser.id || backendUser._id || auth0User.sub || '',
                email: backendUser.email || auth0User.email || '',
                name: backendUser.name || auth0User.name || auth0User.email || '',
                roles: backendUser.roles || [],
                avatar: auth0User.picture || backendUser.photo,
              };

              console.log('🔐 Final user object with roles from DB:', user);

              return user;
            }),
            catchError((error) => {
              console.error('🔐 Error fetching user from backend:', error);
              // Fallback to Auth0 user data (though it won't have roles)
              const fallbackUser: User = {
                id: auth0User.sub || '',
                email: auth0User.email || '',
                name: auth0User.name || auth0User.email || '',
                roles: [],
                avatar: auth0User.picture,
              };
              console.warn('🔐 Using fallback user (no roles):', fallbackUser);
              return of(fallbackUser);
            }),
          );
        }),
      )
      .subscribe((user) => {
        console.log('🔐 Setting current user:', user);
        this.currentUserSubject.next(user);
        this.userInitialized$.next(true);
      });
  }

  /**
   * Fetch user data from backend API (includes roles from database)
   */
  private fetchUserFromBackend(): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/auth/me`).pipe(
      tap((response) => {
        console.log('🔐 Backend API response:', response);
      }),
    );
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
    console.log('🔐 checkAuthenticationStatus called');
    
    return this.auth0.isAuthenticated$.pipe(
      take(1),
      switchMap((isAuth) => {
        console.log('🔐 Auth0 isAuthenticated:', isAuth);
        
        if (!isAuth) {
          console.log('🔐 User not authenticated by Auth0');
          return of(false);
        }

        // Wait for user initialization flag
        console.log('🔐 Waiting for user initialization flag...');
        return this.userInitialized$.pipe(
          filter((initialized) => {
            console.log('🔐 User initialized flag:', initialized);
            return initialized === true;
          }),
          take(1),
          switchMap(() => {
            console.log('🔐 User initialization complete, checking admin access');
            return this.hasAdminAccess$().pipe(take(1));
          }),
        );
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
    console.log('🔐 hasAdminAccess - Current user:', user);
    
    if (!user || !user.roles || user.roles.length === 0) {
      console.log('🔐 hasAdminAccess - No user or roles, returning false');
      return false;
    }

    console.log('🔐 hasAdminAccess - User roles:', user.roles);

    // User must have at least one role that is NOT 'member' or 'guest'
    const hasNonMemberGuestRole = user.roles.some(
      (role) =>
        role.toLowerCase() !== 'member' && role.toLowerCase() !== 'guest',
    );

    console.log('🔐 hasAdminAccess - Has non-member/guest role:', hasNonMemberGuestRole);

    return hasNonMemberGuestRole;
  }

  /**
   * Observable version of hasAdminAccess
   */
  hasAdminAccess$(): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user) => {
        console.log('🔐 hasAdminAccess$ - Current user:', user);
        
        if (!user || !user.roles || user.roles.length === 0) {
          console.log('🔐 hasAdminAccess$ - No user or roles, returning false');
          return false;
        }

        console.log('🔐 hasAdminAccess$ - User roles:', user.roles);

        // User must have at least one role that is NOT 'member' or 'guest'
        const hasNonMemberGuestRole = user.roles.some(
          (role) =>
            role.toLowerCase() !== 'member' && role.toLowerCase() !== 'guest',
        );

        console.log('🔐 hasAdminAccess$ - Has non-member/guest role:', hasNonMemberGuestRole);

        return hasNonMemberGuestRole;
      }),
    );
  }
}

