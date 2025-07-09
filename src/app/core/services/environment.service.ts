import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  
  /**
   * Get current environment information
   */
  getEnvironmentInfo() {
    return {
      production: environment.production,
      apiUrl: environment.apiUrl,
      frontendUrl: environment.frontendUrl,
      environment: environment.production ? 'production' : 'development'
    };
  }

  /**
   * Check if running in production
   */
  isProduction(): boolean {
    return environment.production;
  }

  /**
   * Check if running in development
   */
  isDevelopment(): boolean {
    return !environment.production;
  }

  /**
   * Get API base URL
   */
  getApiUrl(): string {
    return environment.apiUrl;
  }

  /**
   * Get frontend base URL
   */
  getFrontendUrl(): string {
    return environment.frontendUrl;
  }

  /**
   * Build full API endpoint URL
   */
  buildApiUrl(endpoint: string): string {
    const baseUrl = environment.apiUrl;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  }

  /**
   * Build full frontend URL
   */
  buildFrontendUrl(path: string): string {
    const baseUrl = environment.frontendUrl;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  }

  /**
   * Log environment information (for debugging)
   */
  logEnvironmentInfo(): void {
    console.log('Environment Configuration:', this.getEnvironmentInfo());
  }
}
