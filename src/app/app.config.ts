import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { API_BASE_URL } from './core';
import { AuthService } from './core/services/auth.service';
import { firstValueFrom } from 'rxjs';
import { provideQuillConfig } from 'ngx-quill';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

function getBaseUrl(): string {
  const isProduction = window.location.hostname.includes('csediualumni.com');
  const isLocalhost = window.location.hostname === 'localhost';

  let baseUrl = '';

  if (isLocalhost) {
    baseUrl = 'http://localhost:3000';
  } else if (isProduction) {
    baseUrl = 'https://api.csediualumni.com';
  } else {
    baseUrl = 'http://localhost:3000'; // Fallback for other environments
  }

  console.log(`Base URL determined: ${baseUrl}`);
  return baseUrl;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    // Combined initializer: Load config first, then check auth
    provideAppInitializer(() => {
      const authService = inject(AuthService);

      return new Promise<void>((resolve) => {
        // Phase 1: Load API configuration
        const api_base_url = getBaseUrl();

        // Phase 2: Now check authentication with correct API URL
        console.log('Starting auth check with API URL:', api_base_url);

        firstValueFrom(authService.checkAuthenticationStatus())
          .then(() => {
            console.log('Auth check completed successfully');
            resolve();
          })
          .catch(() => {
            console.log(
              'Auth check failed during bootstrap - user not authenticated',
            );
            resolve();
          });
      });
    }),
    // Provide API_BASE_URL token
    {
      provide: API_BASE_URL,
      useFactory: () => {
        const api_base_url = getBaseUrl();
        const url = api_base_url || 'http://localhost:3000';
        console.log(`API_BASE_URL factory returning: ${url}`);
        return url;
      },
    },
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark',
          cssLayer: false,
        },
      },
    }),
    provideQuillConfig({
      modules: {
        syntax: false,
        toolbar: false,
      },
    }),
  ],
};
