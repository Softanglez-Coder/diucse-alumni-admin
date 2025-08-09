import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../../core/services/data.service';
import { ApiService } from '../../core/services/api.service';

export interface Banner {
  _id?: string;
  title: string;
  description?: string;
  order?: number;
  image?: string;
  link?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateBannerDto {
  title: string;
  description?: string;
  order?: number;
  image?: string;
  link?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private endpoint = '/banners';

  constructor(
    private dataService: DataService,
    private apiService: ApiService
  ) {}

  /**
   * Get all banners
   */
  getAll(): Observable<Banner[]> {
    return this.dataService.getAll<Banner>(this.endpoint);
  }

  /**
   * Get banner by ID
   */
  getById(id: string): Observable<Banner> {
    return this.dataService.getById<Banner>(this.endpoint, id);
  }

  /**
   * Create new banner
   */
  create(data: CreateBannerDto): Observable<Banner> {
    return this.dataService.create<Banner>(this.endpoint, data);
  }

  /**
   * Update banner
   */
  update(id: string, data: Partial<CreateBannerDto>): Observable<Banner> {
    return this.dataService.update<Banner>(this.endpoint, id, data);
  }

  /**
   * Delete banner
   */
  delete(id: string): Observable<void> {
    return this.dataService.delete(this.endpoint, id);
  }

  /**
   * Upload banner image
   */
  uploadImage(id: string, file: File): Observable<Banner> {
    return this.apiService.upload<Banner>(`${this.endpoint}/${id}/image`, file);
  }

  /**
   * Search banners
   */
  search(query: string): Observable<Banner[]> {
    return this.dataService.search<Banner>(this.endpoint, query);
  }
}
