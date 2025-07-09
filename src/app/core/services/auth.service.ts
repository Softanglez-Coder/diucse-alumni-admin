import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    this.checkAuthStatus();
  }

  login(credentials: LoginCredentials): Observable<boolean> {
    return this.apiService.post<{user: User, token: string}>('/auth/login', credentials)
      .pipe(
        map(response => {
          // Set cookie with token
          document.cookie = `auth_token=${response.token}; path=/; secure; samesite=strict`;
          localStorage.setItem('auth_token', response.token);
          this.currentUserSubject.next(response.user);
          return true;
        }),
        catchError(error => {
          console.error('Login failed:', error);
          return of(false);
        })
      );
  }

  logout(): void {
    // Remove cookie
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    localStorage.removeItem('auth_token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null && this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    // First try localStorage
    const token = localStorage.getItem('auth_token');
    if (token) {
      return token;
    }

    // Fallback to cookie
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'auth_token') {
        return value;
      }
    }
    return null;
  }

  private checkAuthStatus(): void {
    const token = this.getToken();
    if (token) {
      // Verify token with backend
      this.apiService.get<{user: User}>('/auth/verify')
        .pipe(
          catchError(() => {
            this.logout();
            return of(null);
          })
        )
        .subscribe((response: any) => {
          if (response) {
            this.currentUserSubject.next(response.user);
          }
        });
    }
  }

  refreshToken(): Observable<boolean> {
    return this.apiService.post<{token: string}>('/auth/refresh', {})
      .pipe(
        map((response: any) => {
          document.cookie = `auth_token=${response.token}; path=/; secure; samesite=strict`;
          localStorage.setItem('auth_token', response.token);
          return true;
        }),
        catchError(() => {
          this.logout();
          return of(false);
        })
      );
  }
}
