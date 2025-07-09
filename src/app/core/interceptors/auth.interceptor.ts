import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  
  console.log('Interceptor - Request URL:', request.url);
  console.log('Interceptor - Using cookie-based auth, no header needed');
  
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn('Authentication failed, logging out user');
        authService.logout();
        return throwError(() => error);
      }
      return throwError(() => error);
    })
  );
};
