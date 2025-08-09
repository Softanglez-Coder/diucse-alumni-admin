import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse } from '../../core/services/api.service';

export interface Event {
  _id: string;
  title: string;
  fee: number;
  start: string;
  end: string;
  description?: string;
  location?: string;
  mapLocation?: string;
  banner?: string;
  capacity?: number;
  open?: boolean;
  justificationOfClosing?: string;
  published?: boolean;
  memberOnly?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventDto {
  title: string;
  fee: number;
  start: string;
  end: string;
  description?: string;
  location?: string;
  mapLocation?: string;
  banner?: string;
  capacity?: number;
  open?: boolean;
  justificationOfClosing?: string;
  published?: boolean;
  memberOnly?: boolean;
}

export interface UpdateEventDto extends Partial<CreateEventDto> {}

export interface CloseRegistrationDto {
  justification: string;
}

export interface UnpublishEventDto {
  justification?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly endpoint = '/events';

  constructor(private apiService: ApiService) {}

  /**
   * Create a new event
   */
  createEvent(eventData: CreateEventDto): Observable<ApiResponse<Event>> {
    return this.apiService.post<ApiResponse<Event>>(this.endpoint, eventData);
  }

  /**
   * Get all events (admin view)
   */
  getAllEvents(params?: any): Observable<ApiResponse<Event[]>> {
    return this.apiService.get<ApiResponse<Event[]>>(this.endpoint, params);
  }

  /**
   * Get published events
   */
  getPublishedEvents(params?: any): Observable<ApiResponse<Event[]>> {
    return this.apiService.get<ApiResponse<Event[]>>(`${this.endpoint}/published`, params);
  }

  /**
   * Get upcoming events
   */
  getUpcomingEvents(params?: any): Observable<ApiResponse<Event[]>> {
    return this.apiService.get<ApiResponse<Event[]>>(`${this.endpoint}/upcoming`, params);
  }

  /**
   * Get past events
   */
  getPastEvents(params?: any): Observable<ApiResponse<Event[]>> {
    return this.apiService.get<ApiResponse<Event[]>>(`${this.endpoint}/past`, params);
  }

  /**
   * Get event by ID
   */
  getEventById(id: string): Observable<ApiResponse<Event>> {
    return this.apiService.get<ApiResponse<Event>>(`${this.endpoint}/${id}`);
  }

  /**
   * Update event
   */
  updateEvent(id: string, eventData: UpdateEventDto): Observable<ApiResponse<Event>> {
    return this.apiService.patch<ApiResponse<Event>>(`${this.endpoint}/${id}`, eventData);
  }

  /**
   * Delete event
   */
  deleteEvent(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
  }

  /**
   * Publish event
   */
  publishEvent(id: string): Observable<ApiResponse<Event>> {
    return this.apiService.patch<ApiResponse<Event>>(`${this.endpoint}/${id}/publish`, {});
  }

  /**
   * Unpublish event
   */
  unpublishEvent(id: string, justification?: string): Observable<ApiResponse<Event>> {
    const body: UnpublishEventDto = justification ? { justification } : {};
    return this.apiService.patch<ApiResponse<Event>>(`${this.endpoint}/${id}/unpublish`, body);
  }

  /**
   * Open event registration
   */
  openEventRegistration(id: string): Observable<ApiResponse<Event>> {
    return this.apiService.patch<ApiResponse<Event>>(`${this.endpoint}/${id}/registration/open`, {});
  }

  /**
   * Close event registration
   */
  closeEventRegistration(id: string, justification: string): Observable<ApiResponse<Event>> {
    const body: CloseRegistrationDto = { justification };
    return this.apiService.patch<ApiResponse<Event>>(`${this.endpoint}/${id}/registration/close`, body);
  }
}
