import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return authService.refreshToken().pipe(
          switchMap((success) => {
            if (success) {
              const newToken = authService.getToken();
              const newRequest = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next(newRequest);
            } else {
              authService.logout();
              return throwError(() => error);
            }
          })
        );
      }
      return throwError(() => error);
    })
  );
};
