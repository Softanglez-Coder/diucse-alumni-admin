import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';

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

  private apiUrl = 'https://api.example.com'; // Replace with your API URL

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkAuthStatus();
  }

  login(credentials: LoginCredentials): Observable<boolean> {
    return this.http.post<{user: User, token: string}>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        map(response => {
          // Set cookie with token
          document.cookie = `auth_token=${response.token}; path=/; secure; samesite=strict`;
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
      this.http.get<{user: User}>(`${this.apiUrl}/auth/verify`)
        .pipe(
          catchError(() => {
            this.logout();
            return of(null);
          })
        )
        .subscribe(response => {
          if (response) {
            this.currentUserSubject.next(response.user);
          }
        });
    }
  }

  refreshToken(): Observable<boolean> {
    return this.http.post<{token: string}>(`${this.apiUrl}/auth/refresh`, {})
      .pipe(
        map(response => {
          document.cookie = `auth_token=${response.token}; path=/; secure; samesite=strict`;
          return true;
        }),
        catchError(() => {
          this.logout();
          return of(false);
        })
      );
  }
}
