import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  console.log('Interceptor - Request URL:', request.url);
  console.log('Interceptor - Using cookie-based auth, no header needed');
  
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn('Authentication failed - letting guard handle redirect');
        // Don't redirect here - let the AuthGuard handle redirects with proper returnUrl
        return throwError(() => error);
      }
      return throwError(() => error);
    })
  );
};
