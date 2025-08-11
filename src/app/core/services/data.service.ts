import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(protected apiService: ApiService) {}

  /**
   * Generic method to get all records
   */
  getAll<T>(endpoint: string, params?: any): Observable<T[]> {
    return this.apiService.get<T[]>(endpoint, params);
  }

  /**
   * Generic method to get a single record by ID
   */
  getById<T>(endpoint: string, id: string | number): Observable<T> {
    console.log('DataService: Getting record by ID:', endpoint, id);
    const url = `${endpoint}/${id}`;
    console.log('DataService: Making request to:', url);
    return this.apiService.get<T>(url);
  }

  /**
   * Generic method to create a new record
   */
  create<T>(endpoint: string, data: Partial<T>): Observable<T> {
    return this.apiService.post<T>(endpoint, data);
  }

  /**
   * Generic method to update a record
   */
  update<T>(endpoint: string, id: string | number, data: Partial<T>): Observable<T> {
    return this.apiService.patch<T>(`${endpoint}/${id}`, data);
  }

  /**
   * Generic method to delete a record
   */
  delete<T>(endpoint: string, id: string | number): Observable<void> {
    return this.apiService.delete<void>(`${endpoint}/${id}`);
  }

  /**
   * Generic method to search records
   */
  search<T>(endpoint: string, query: string, params?: any): Observable<T[]> {
    const searchParams = { ...params, q: query };
    return this.apiService.get<T[]>(`${endpoint}/search`, searchParams);
  }

  /**
   * Generic method to get paginated records
   */
  getPaginated<T>(endpoint: string, page: number = 1, limit: number = 10, params?: any): Observable<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const paginationParams = { ...params, page, limit };
    return this.apiService.get(endpoint, paginationParams);
  }
}
