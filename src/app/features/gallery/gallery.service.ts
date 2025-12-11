import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

export enum GalleryCategory {
  EVENTS = 'events',
  ACTIVITIES = 'activities',
  ACHIEVEMENTS = 'achievements',
  GENERAL = 'general',
}

export interface GalleryImage {
  url: string;
  thumbnail?: string;
  caption?: string;
  order: number;
}

export interface Gallery {
  _id: string;
  title: string;
  description?: string;
  category: GalleryCategory;
  images: GalleryImage[];
  date: string;
  isPublished: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGalleryDto {
  title: string;
  description?: string;
  category: GalleryCategory;
  images?: GalleryImage[];
  date?: string;
  isPublished?: boolean;
  order?: number;
}

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  private readonly endpoint = '/gallery';

  constructor(private apiService: ApiService) {}

  getAllGalleries(): Observable<Gallery[]> {
    return this.apiService.get<Gallery[]>(`${this.endpoint}/all`);
  }

  getPublishedGalleries(): Observable<Gallery[]> {
    return this.apiService.get<Gallery[]>(`${this.endpoint}/published`);
  }

  getGalleriesByCategory(category: GalleryCategory): Observable<Gallery[]> {
    return this.apiService.get<Gallery[]>(
      `${this.endpoint}/category/${category}`,
    );
  }

  getGalleryById(id: string): Observable<Gallery> {
    return this.apiService.get<Gallery>(`${this.endpoint}/${id}`);
  }

  createGallery(data: CreateGalleryDto): Observable<Gallery> {
    return this.apiService.post<Gallery>(this.endpoint, data);
  }

  updateGallery(id: string, data: Partial<CreateGalleryDto>): Observable<Gallery> {
    return this.apiService.patch<Gallery>(`${this.endpoint}/${id}`, data);
  }

  publishGallery(id: string): Observable<Gallery> {
    return this.apiService.patch<Gallery>(`${this.endpoint}/${id}/publish`, {});
  }

  unpublishGallery(id: string): Observable<Gallery> {
    return this.apiService.patch<Gallery>(
      `${this.endpoint}/${id}/unpublish`,
      {},
    );
  }

  addImages(
    id: string,
    images: Array<{ url: string; thumbnail?: string; caption?: string }>,
  ): Observable<Gallery> {
    return this.apiService.post<Gallery>(`${this.endpoint}/${id}/images`, {
      images,
    });
  }

  uploadImages(id: string, files: File[]): Observable<Gallery> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    return this.apiService.post<Gallery>(
      `${this.endpoint}/${id}/images/upload`,
      formData,
    );
  }

  uploadSingleImage(id: string, file: File): Observable<Gallery> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post<Gallery>(
      `${this.endpoint}/${id}/images/upload-single`,
      formData,
    );
  }

  removeImage(id: string, imageUrl: string): Observable<Gallery> {
    // Using PATCH instead of DELETE since we're updating the gallery
    return this.apiService.patch<Gallery>(`${this.endpoint}/${id}/images/remove`, {
      imageUrl,
    });
  }

  reorderImages(
    id: string,
    imageOrders: Array<{ url: string; order: number }>,
  ): Observable<Gallery> {
    return this.apiService.patch<Gallery>(
      `${this.endpoint}/${id}/images/reorder`,
      { imageOrders },
    );
  }

  deleteGallery(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}
