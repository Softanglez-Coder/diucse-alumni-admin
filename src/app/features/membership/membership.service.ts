import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../../core/services/data.service';
import { MembershipStatus } from '../../shared/enums';

export interface Membership {
  _id: string;
  user: {
    _id: string;
    email: string;
    roles: string[];
    name: string;
    active: boolean;
    emailVerified: boolean;
    batch: {
      _id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
    phone: string;
    photo?: string;
    currentPosition?: string;
    company?: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  status: MembershipStatus;
  justification: string | null;
  paymentInfo?: {
    paymentMethod: string;
    transactionId: string;
    paymentDate: string;
    amount: number;
    status: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

@Injectable({
  providedIn: 'root',
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
  getMembershipById(id: string): Observable<Membership> {
    console.log('MembershipService: Getting membership by ID:', id);
    const result = this.getById<Membership>(this.endpoint, id);
    console.log('MembershipService: Observable created:', result);
    return result;
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
  updateMembership(
    id: string,
    membership: Partial<Membership>,
  ): Observable<Membership> {
    return this.update<Membership>(this.endpoint, id, membership);
  }

  /**
   * Delete membership
   */
  deleteMembership(id: string): Observable<void> {
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
  getPaginatedMemberships(
    page: number = 1,
    limit: number = 10,
    filters?: any,
  ): Observable<{
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

  /**
   * Change membership status to in-progress
   */
  setInProgress(id: string): Observable<Membership> {
    return this.apiService.patch<Membership>(
      `${this.endpoint}/${id}/in-progress`,
      {},
    );
  }

  /**
   * Change membership status to payment required
   */
  setPaymentRequired(id: string): Observable<Membership> {
    return this.apiService.patch<Membership>(
      `${this.endpoint}/${id}/payment-required`,
      {},
    );
  }

  /**
   * Approve membership
   */
  approveMembership(id: string): Observable<Membership> {
    return this.apiService.patch<Membership>(
      `${this.endpoint}/${id}/approve`,
      {},
    );
  }

  /**
   * Reject membership
   */
  rejectMembership(id: string, justification: string): Observable<Membership> {
    return this.apiService.patch<Membership>(`${this.endpoint}/${id}/reject`, {
      justification,
    });
  }
}
