import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../../core/services/data.service';

export interface Membership {
  id: number;
  memberName: string;
  membershipType: string;
  startDate: string;
  endDate: string;
  status: string;
  fees: number;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MembershipService extends DataService {
  private readonly endpoint = '/memberships';

  /**
   * Get all memberships
   */
  getAllMemberships(): Observable<Membership[]> {
    return this.getAll<Membership>(this.endpoint);
  }

  /**
   * Get membership by ID
   */
  getMembershipById(id: number): Observable<Membership> {
    return this.getById<Membership>(this.endpoint, id);
  }

  /**
   * Create new membership
   */
  createMembership(membership: Partial<Membership>): Observable<Membership> {
    return this.create<Membership>(this.endpoint, membership);
  }

  /**
   * Update membership
   */
  updateMembership(id: number, membership: Partial<Membership>): Observable<Membership> {
    return this.update<Membership>(this.endpoint, id, membership);
  }

  /**
   * Delete membership
   */
  deleteMembership(id: number): Observable<void> {
    return this.delete<void>(this.endpoint, id);
  }

  /**
   * Search memberships
   */
  searchMemberships(query: string): Observable<Membership[]> {
    return this.search<Membership>(this.endpoint, query);
  }

  /**
   * Get paginated memberships
   */
  getPaginatedMemberships(page: number = 1, limit: number = 10, filters?: any): Observable<{
    data: Membership[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.getPaginated<Membership>(this.endpoint, page, limit, filters);
  }

  /**
   * Get membership statistics
   */
  getMembershipStats(): Observable<{
    total: number;
    active: number;
    inactive: number;
    pending: number;
    expired: number;
  }> {
    return this.apiService.get<any>(`${this.endpoint}/stats`);
  }
}
