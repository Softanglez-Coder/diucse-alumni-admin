import { Injectable, inject } from '@angular/core';
import { API_BASE_URL } from '../index';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = inject(API_BASE_URL);
  }

  get apiUrl(): string {
    return this.apiBaseUrl;
  }

  get frontendUrl(): string {
    // Determine frontend URL based on current hostname
    const isProduction = window.location.hostname.includes('csediualumni.com');
    const isLocalhost = window.location.hostname === 'localhost';

    if (isLocalhost) {
      return 'http://localhost:4300';
    } else if (isProduction) {
      return 'https://csediualumni.com/admin';
    } else {
      return 'http://localhost:4300';
    }
  }

  get isProduction(): boolean {
    return window.location.hostname.includes('csediualumni.com');
  }

  get isDevelopment(): boolean {
    return !this.isProduction;
  }

  /**
   * Get API endpoint URL
   */
  getApiEndpoint(endpoint: string): string {
    return `${this.apiUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  }

  /**
   * Get frontend URL
   */
  getFrontendUrl(path: string = ''): string {
    return `${this.frontendUrl}${path.startsWith('/') ? path : '/' + path}`;
  }

  /**
   * Get environment-specific configuration
   */
  getEnvironmentConfig() {
    return {
      apiUrl: this.apiUrl,
      frontendUrl: this.frontendUrl,
      production: this.isProduction,
      development: this.isDevelopment
    };
  }
}
