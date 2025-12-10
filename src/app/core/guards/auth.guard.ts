import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, tap, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    console.log('🔐 AuthGuard: canActivate called for URL:', state.url);
    console.log('🔐 AuthGuard: Route data:', route.data);

    return this.authService.checkAuthenticationStatus().pipe(
      tap((hasAccess) => {
        console.log('🔐 AuthGuard: Has admin access:', hasAccess);
      }),
      switchMap((hasAccess) => {
        if (hasAccess) {
          console.log('🔐 AuthGuard: User has admin access, allowing access');
          return of(true);
        }

        // Check if user is authenticated but doesn't have proper role
        return this.authService.isAuthenticated().pipe(
          take(1),
          map((isAuth) => {
            if (isAuth) {
              console.log(
                '🔐 AuthGuard: User authenticated but lacks admin role (only member/guest)',
              );
              // Redirect to access denied page
              this.router.navigate(['/auth/access-denied'], {
                queryParams: { returnUrl: state.url },
                replaceUrl: true,
              });
            } else {
              console.log(
                '🔐 AuthGuard: User not authenticated, redirecting to login',
              );
              // Store the intended URL for redirecting after login
              this.authService.login(state.url);
            }
            return false;
          }),
        );
      }),
      catchError((error) => {
        console.error('🔐 AuthGuard: Error occurred:', error);
        this.authService.login(state.url);
        return of(false);
      }),
    );
  }
}
