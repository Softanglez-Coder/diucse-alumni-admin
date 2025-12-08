import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  console.log('Interceptor - Request URL:', request.url);

  // Skip token attachment for Auth0 endpoints
  // Use proper URL parsing to avoid substring sanitization issues
  try {
    const url = new URL(request.url);
    if (url.hostname.endsWith('.auth0.com') || url.hostname === 'auth0.com') {
      return next(request);
    }
  } catch (e) {
    // If URL parsing fails (relative URL), continue with token attachment
    console.log('Interceptor - Could not parse URL, proceeding with token attachment');
  }

  const auth0Service = inject(Auth0Service);

  // Get the access token from Auth0
  return auth0Service.getAccessTokenSilently({ cacheMode: 'on' }).pipe(
    switchMap((token) => {
      console.log('Interceptor - Adding Auth0 token to request');
      // Clone the request and add the authorization header
      const authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next(authReq);
    }),
    catchError((error) => {
      // If getting token fails, continue with the original request
      console.warn('Interceptor - Could not get Auth0 token:', error);
      return next(request).pipe(
        catchError((httpError: HttpErrorResponse) => {
          // Handle HTTP errors
          return throwError(() => httpError);
        }),
      );
    }),
  );
};
