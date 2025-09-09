import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse } from '../../core/services/api.service';

export interface Committee {
  _id?: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCommitteeDto {
  name: string;
  startDate: Date;
  endDate: Date;
}

export interface UpdateCommitteeDto {
  name?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface PublishCommitteeDto {
  isPublished: boolean;
}

export interface CommitteeDesignation {
  _id?: string;
  name: string;
  description?: string;
  priority?: number;
  isActive: boolean;
  committee?: string | Committee; // Committee ID or populated committee object
  roles?: string[]; // Array of role strings
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCommitteeDesignationDto {
  name: string;
  description?: string;
  priority?: number;
  committeeId: string; // Committee ID is required when creating
  roles: string[]; // Array of role strings is required
}

export interface UpdateCommitteeDesignationDto {
  name?: string;
  description?: string;
  priority?: number;
  committeeId?: string; // Committee ID can be updated
  roles?: string[]; // Array of role strings can be updated
  isActive?: boolean;
}

export interface CommitteeMember {
  _id?: string;
  committeeId: string;
  designationId: string;
  userId: string;
  assignedDate: Date;
  unassignedDate?: Date;
  isActive: boolean;
  notes?: string;
  // Populated fields
  committee?: Committee;
  designation?: CommitteeDesignation;
  user?: any; // User interface from your user model
}

export interface AssignCommitteeMemberDto {
  committeeId: string;
  designationId: string;
  userId: string;
  notes?: string;
}

export interface UnassignCommitteeMemberDto {
  committeeId: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommitteeService {
  private readonly baseUrl = 'committees';
  private readonly designationUrl = 'committee-designations';

  constructor(private apiService: ApiService) {}

  // Committee Methods
  getCommittees(): Observable<ApiResponse<Committee[]>> {
    return this.apiService.get<ApiResponse<Committee[]>>(this.baseUrl);
  }

  getCommittee(id: string): Observable<ApiResponse<Committee>> {
    return this.apiService.get<ApiResponse<Committee>>(`${this.baseUrl}/${id}`);
  }

  createCommittee(data: CreateCommitteeDto): Observable<ApiResponse<Committee>> {
    return this.apiService.post<ApiResponse<Committee>>(this.baseUrl, data);
  }

  updateCommittee(id: string, data: UpdateCommitteeDto): Observable<ApiResponse<Committee>> {
    return this.apiService.patch<ApiResponse<Committee>>(`${this.baseUrl}/${id}`, data);
  }

  publishCommittee(id: string, data: PublishCommitteeDto): Observable<ApiResponse<Committee>> {
    return this.apiService.patch<ApiResponse<Committee>>(`${this.baseUrl}/${id}/publish`, data);
  }

  deleteCommittee(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  getPublishedCommittees(): Observable<ApiResponse<Committee[]>> {
    return this.apiService.get<ApiResponse<Committee[]>>(`${this.baseUrl}/published`);
  }

  getCurrentCommittee(): Observable<ApiResponse<Committee>> {
    return this.apiService.get<ApiResponse<Committee>>(`${this.baseUrl}/current`);
  }

  getPreviousCommittees(): Observable<ApiResponse<Committee[]>> {
    return this.apiService.get<ApiResponse<Committee[]>>(`${this.baseUrl}/previous`);
  }

  getUpcomingCommittees(): Observable<ApiResponse<Committee[]>> {
    return this.apiService.get<ApiResponse<Committee[]>>(`${this.baseUrl}/upcoming`);
  }

  // Committee Designation Methods
  getDesignations(): Observable<ApiResponse<CommitteeDesignation[]>> {
    return this.apiService.get<ApiResponse<CommitteeDesignation[]>>(this.designationUrl);
  }

  getDesignation(id: string): Observable<ApiResponse<CommitteeDesignation>> {
    return this.apiService.get<ApiResponse<CommitteeDesignation>>(`${this.designationUrl}/${id}`);
  }

  createDesignation(data: CreateCommitteeDesignationDto): Observable<ApiResponse<CommitteeDesignation>> {
    return this.apiService.post<ApiResponse<CommitteeDesignation>>(this.designationUrl, data);
  }

  updateDesignation(id: string, data: UpdateCommitteeDesignationDto): Observable<ApiResponse<CommitteeDesignation>> {
    return this.apiService.patch<ApiResponse<CommitteeDesignation>>(`${this.designationUrl}/${id}`, data);
  }

  deleteDesignation(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<ApiResponse<void>>(`${this.designationUrl}/${id}`);
  }

  getDesignationsByCommittee(committeeId: string): Observable<ApiResponse<CommitteeDesignation[]>> {
    return this.apiService.get<ApiResponse<CommitteeDesignation[]>>(`${this.designationUrl}/committee/${committeeId}`);
  }

  // Committee Member Methods
  assignMember(data: AssignCommitteeMemberDto): Observable<ApiResponse<CommitteeMember>> {
    return this.apiService.post<ApiResponse<CommitteeMember>>(`${this.designationUrl}/members/assign`, data);
  }

  unassignMember(memberId: string, data: UnassignCommitteeMemberDto): Observable<ApiResponse<CommitteeMember>> {
    return this.apiService.patch<ApiResponse<CommitteeMember>>(`${this.designationUrl}/members/${memberId}/unassign`, data);
  }

  getCommitteeMembers(committeeId: string, includeInactive: boolean = false): Observable<ApiResponse<CommitteeMember[]>> {
    const params = includeInactive ? '?includeInactive=true' : '';
    return this.apiService.get<ApiResponse<CommitteeMember[]>>(`${this.designationUrl}/committee/${committeeId}/members${params}`);
  }

  getCommitteeStructure(committeeId: string): Observable<ApiResponse<any>> {
    return this.apiService.get<ApiResponse<any>>(`${this.designationUrl}/committee/${committeeId}/structure`);
  }

  getCommitteeWithMembers(committeeId: string, includeInactive: boolean = false): Observable<ApiResponse<any>> {
    const params = includeInactive ? '?includeInactive=true' : '';
    return this.apiService.get<ApiResponse<any>>(`${this.designationUrl}/committee/${committeeId}/full${params}`);
  }

  getUserCommitteeHistory(userId: string, includeInactive: boolean = false): Observable<ApiResponse<CommitteeMember[]>> {
    const params = includeInactive ? '?includeInactive=true' : '';
    return this.apiService.get<ApiResponse<CommitteeMember[]>>(`${this.designationUrl}/user/${userId}/history${params}`);
  }

  getUserActiveRoles(userId: string): Observable<ApiResponse<CommitteeMember[]>> {
    return this.apiService.get<ApiResponse<CommitteeMember[]>>(`${this.designationUrl}/user/${userId}/roles`);
  }
}
