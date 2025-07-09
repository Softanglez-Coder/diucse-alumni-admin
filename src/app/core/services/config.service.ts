import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  
  get apiUrl(): string {
    return environment.apiUrl;
  }

  get frontendUrl(): string {
    return environment.frontendUrl;
  }

  get isProduction(): boolean {
    return environment.production;
  }

  get isDevelopment(): boolean {
    return !environment.production;
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
