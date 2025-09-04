import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';

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
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {
    // Don't check auth status in constructor to avoid circular dependency
    // Auth status will be checked when needed by the guard
  }

  login(credentials: LoginCredentials): Observable<boolean> {
    return this.apiService.post<any>('/auth/login', credentials).pipe(
      map((response) => {
        console.log('Login response:', response);
        console.log('Login successful - cookie set by backend');

        // Login successful, but no user data in response
        // We'll fetch user data from /auth/me after login
        return true;
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        return of(false);
      }),
    );
  }

  logout(): void {
    // Clear client-side user data
    this.currentUserSubject.next(null);

    // Call logout endpoint to clear server-side cookie
    this.apiService.post('/auth/logout', {}).subscribe({
      next: () => {
        console.log('Logout successful - server cookie cleared');
      },
      error: (error) => {
        console.warn('Logout endpoint failed:', error);
      },
    });

    // Redirect to login without any return URL
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    // For cookie-based auth, we only check if user is loaded
    // The actual authentication is handled by the cookie sent with requests
    return this.currentUserSubject.value !== null;
  }

  checkAuthenticationStatus(): Observable<boolean> {
    console.log('Checking cookie-based authentication status');

    // If user is already loaded, return true immediately
    if (this.currentUserSubject.value) {
      console.log('User already loaded:', this.currentUserSubject.value);
      return of(true);
    }

    // For cookie-based auth, just call /auth/me - the cookie will be sent automatically
    console.log(
      'Making request to /auth/me (cookie will be sent automatically)',
    );
    return this.apiService.get<{ user: User }>('/auth/me').pipe(
      map((response: any) => {
        console.log('Auth/me response:', response);
        if (response && (response.user || response.data || response)) {
          // Handle different response structures
          const user = response.user || response.data || response;
          this.currentUserSubject.next(user);
          console.log('User loaded from API:', user);
          return true;
        }
        return false;
      }),
      catchError((error) => {
        console.warn('Auth verification failed:', error);

        // For cookie-based auth, if /auth/me fails, user is not authenticated
        console.log('Cookie-based auth failed, user not authenticated');
        this.currentUserSubject.next(null);

        // Don't redirect here - let the guard handle redirections
        // The guard will properly capture the intended URL

        return of(false);
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
}
