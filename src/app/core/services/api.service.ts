import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../index';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: any;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = inject(API_BASE_URL);
  }

  /**
   * GET request
   */
  get<T>(
    endpoint: string,
    params?: HttpParams | { [key: string]: any },
  ): Observable<T> {
    const options = {
      params:
        params instanceof HttpParams
          ? params
          : new HttpParams({ fromObject: params || {} }),
      headers: this.getHeaders(),
      withCredentials: true, // Include cookies in requests
    };

    return this.http.get<T>(`${this.baseUrl}${endpoint}`, options);
  }

  /**
   * POST request
   */
  post<T>(endpoint: string, body?: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, {
      headers: this.getHeaders(),
      withCredentials: true, // Include cookies in requests
    });
  }

  /**
   * PUT request
   */
  put<T>(endpoint: string, body?: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body, {
      headers: this.getHeaders(),
      withCredentials: true, // Include cookies in requests
    });
  }

  /**
   * DELETE request
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(),
      withCredentials: true, // Include cookies in requests
    });
  }

  /**
   * PATCH request
   */
  patch<T>(endpoint: string, body?: any): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, body, {
      headers: this.getHeaders(),
      withCredentials: true, // Include cookies in requests
    });
  }

  /**
   * File upload
   */
  upload<T>(endpoint: string, file: File, additionalData?: any): Observable<T> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.keys(additionalData).forEach((key) => {
        formData.append(key, additionalData[key]);
      });
    }

    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, formData, {
      headers: this.getFileUploadHeaders(),
      withCredentials: true, // Include cookies in requests
    });
  }

  /**
   * Get full URL for an endpoint
   */
  getFullUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  /**
   * Get base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Get common headers
   */
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    // Add authorization token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Get headers for file upload
   */
  private getFileUploadHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      Accept: 'application/json',
    });

    // Add authorization token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }
}
