import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  
  console.log('Interceptor - Request URL:', request.url);
  console.log('Interceptor - Using cookie-based auth, no header needed');
  
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn('Authentication failed, redirecting to login');
        router.navigate(['/auth/login']);
        return throwError(() => error);
      }
      return throwError(() => error);
    })
  );
};
