import { Injectable, inject } from '@angular/core';
import { API_BASE_URL } from '../index';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private readonly apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = inject(API_BASE_URL);
  }

  /**
   * Get current environment information
   */
  getEnvironmentInfo() {
    const isProduction = this.isProduction();
    return {
      production: isProduction,
      apiUrl: this.apiBaseUrl,
      frontendUrl: this.getFrontendUrl(),
      environment: isProduction ? 'production' : 'development'
    };
  }

  /**
   * Check if running in production
   */
  isProduction(): boolean {
    return window.location.hostname.includes('csediualumni.com');
  }

  /**
   * Check if running in development
   */
  isDevelopment(): boolean {
    return !this.isProduction();
  }

  /**
   * Get API base URL
   */
  getApiUrl(): string {
    return this.apiBaseUrl;
  }

  /**
   * Get frontend base URL
   */
  getFrontendUrl(): string {
    const isProduction = this.isProduction();
    const isLocalhost = window.location.hostname === 'localhost';

    if (isLocalhost) {
      return 'http://localhost:4300';
    } else if (isProduction) {
      return 'https://csediualumni.com/admin';
    } else {
      return 'http://localhost:4300';
    }
  }

  /**
   * Build full API endpoint URL
   */
  buildApiUrl(endpoint: string): string {
    const baseUrl = this.apiBaseUrl;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  }

  /**
   * Build full frontend URL
   */
  buildFrontendUrl(path: string): string {
    const baseUrl = this.getFrontendUrl();
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
