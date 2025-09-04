import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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
      map((isAuthenticated) => {
        console.log('🔐 AuthGuard: Authentication status:', isAuthenticated);

        if (isAuthenticated) {
          console.log('🔐 AuthGuard: User is authenticated, allowing access');
          return true;
        }

        // Store the intended URL for redirecting after login
        console.log(
          '🔐 AuthGuard: User not authenticated, redirecting to login with returnUrl:',
          state.url,
        );
        const navigationPromise = this.router.navigate(['/auth/login'], {
          queryParams: { returnUrl: state.url },
          replaceUrl: true,
        });

        navigationPromise
          .then((success) => {
            console.log(
              '🔐 AuthGuard: Navigation to login successful:',
              success,
            );
          })
          .catch((error) => {
            console.error('🔐 AuthGuard: Navigation to login failed:', error);
          });

        return false;
      }),
      catchError((error) => {
        console.error('🔐 AuthGuard: Error occurred:', error);
        // Store the intended URL for redirecting after login
        console.log(
          '🔐 AuthGuard: Error occurred, redirecting to login with returnUrl:',
          state.url,
        );
        const navigationPromise = this.router.navigate(['/auth/login'], {
          queryParams: { returnUrl: state.url },
          replaceUrl: true,
        });

        navigationPromise
          .then((success) => {
            console.log(
              '🔐 AuthGuard: Navigation to login successful (error case):',
              success,
            );
          })
          .catch((navError) => {
            console.error(
              '🔐 AuthGuard: Navigation to login failed (error case):',
              navError,
            );
          });

        return of(false);
      }),
    );
  }
}
