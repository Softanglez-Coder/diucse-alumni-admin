import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  console.log('Interceptor - Request URL:', request.url);

  const auth0Service = inject(Auth0Service);

  // Get the access token from Auth0
  return auth0Service.getAccessTokenSilently().pipe(
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
      return next(request);
    }),
  );
};
