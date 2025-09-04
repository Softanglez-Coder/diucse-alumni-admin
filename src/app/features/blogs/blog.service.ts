import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

export enum BlogStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  PUBLISHED = 'published',
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  status: BlogStatus;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly endpoint = '/blogs';

  constructor(private apiService: ApiService) {}

  getAllBlogs(): Observable<Blog[]> {
    return this.apiService.get<Blog[]>(this.endpoint);
  }

  getBlogById(id: string): Observable<Blog> {
    return this.apiService.get<Blog>(`${this.endpoint}/${id}`);
  }

  publishBlog(id: string): Observable<Blog> {
    return this.apiService.patch<Blog>(`${this.endpoint}/${id}/publish`, {});
  }

  unpublishBlog(id: string): Observable<Blog> {
    return this.apiService.patch<Blog>(`${this.endpoint}/${id}/unpublish`, {});
  }

  // New methods based on the updated controller
  getPublishedBlogs(): Observable<Blog[]> {
    return this.apiService.get<Blog[]>(`${this.endpoint}/published`);
  }

  getBlogsInReview(): Observable<Blog[]> {
    return this.apiService.get<Blog[]>(`${this.endpoint}/in-review`);
  }

  getMyBlogs(): Observable<Blog[]> {
    return this.apiService.get<Blog[]>(`${this.endpoint}/me`);
  }

  getMyBlogsByStatus(status: BlogStatus): Observable<Blog[]> {
    return this.apiService.get<Blog[]>(`${this.endpoint}/me/status/${status}`);
  }

  setDraft(id: string): Observable<Blog> {
    return this.apiService.patch<Blog>(`${this.endpoint}/${id}/draft`, {});
  }

  setReview(id: string): Observable<Blog> {
    return this.apiService.patch<Blog>(`${this.endpoint}/${id}/review`, {});
  }
}
