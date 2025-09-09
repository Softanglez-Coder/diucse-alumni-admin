import { Component, OnInit, inject, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { CommitteeService, Committee, CommitteeMember, CommitteeDesignation } from './committee.service';
import { DataService } from '../../core/services/data.service';
import { ApiResponse } from '../../core/services/api.service';

@Component({
  selector: 'app-committee-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    InputTextModule,
    DialogModule,
    TooltipModule,
    ToastModule,
    ConfirmDialogModule,
    ToolbarModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>
    
    <div class="committee-detail-container">
      <!-- Committee Header -->
      <div class="committee-header">
        <button
          pButton
          label="Back to Committees"
          icon="pi pi-arrow-left"
          class="p-button-outlined"
          (click)="goBack()"
        ></button>
        
        <div class="committee-info" *ngIf="committee">
          <h1>{{ committee.name }}</h1>
          <div class="committee-meta">
            <span>{{ committee.startDate | date:'mediumDate' }} - {{ committee.endDate | date:'mediumDate' }}</span>
            <p-tag 
              [value]="committee.isPublished ? 'Published' : 'Draft'" 
              [severity]="committee.isPublished ? 'success' : 'warning'"
            ></p-tag>
          </div>
        </div>

        <div class="committee-actions">
          <button
            pButton
            label="Edit Committee"
            icon="pi pi-pencil"
            class="p-button-outlined"
            (click)="editCommittee()"
          ></button>
        </div>
      </div>

      <!-- Committee Designations -->
      <p-card>
        <p-toolbar>
          <div class="p-toolbar-group-left">
            <h3>Committee Designations</h3>
          </div>
          <div class="p-toolbar-group-right">
            <button
              pButton
              label="Add Designation"
              icon="pi pi-plus"
              class="p-button-success"
              (click)="addDesignation()"
            ></button>
          </div>
        </p-toolbar>

        <p-table 
          [value]="designations" 
          [loading]="isLoadingDesignations"
          responsiveLayout="scroll"
          [paginator]="true"
          [rows]="10"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Designation Name</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Roles</th>
              <th>Status</th>
              <th>Current Members</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-designation>
            <tr>
              <td>{{ designation.name }}</td>
              <td>{{ designation.description || '-' }}</td>
              <td>{{ designation.priority || 0 }}</td>
              <td>
                <div class="roles-container">
                  <span 
                    *ngFor="let role of designation.roles" 
                    class="role-tag"
                  >
                    {{ role }}
                  </span>
                </div>
              </td>
              <td>
                <p-tag 
                  [value]="designation.isActive ? 'Active' : 'Inactive'" 
                  [severity]="designation.isActive ? 'success' : 'danger'"
                ></p-tag>
              </td>
              <td>
                <div class="members-in-designation">
                  {{ getMemberCountForDesignation(designation._id) }}
                  <button
                    pButton
                    icon="pi pi-users"
                    class="p-button-rounded p-button-text p-button-sm"
                    pTooltip="View Members"
                    (click)="showDesignationMembers(designation)"
                    *ngIf="getMemberCountForDesignation(designation._id) > 0"
                  ></button>
                </div>
              </td>
              <td>
                <div class="designation-actions">
                  <button
                    pButton
                    icon="pi pi-users"
                    class="p-button-rounded p-button-info p-button-text"
                    pTooltip="View/Manage Users"
                    (click)="showDesignationMembers(designation)"
                  ></button>
                  <button
                    pButton
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-text"
                    pTooltip="Edit Designation"
                    (click)="editDesignation(designation)"
                  ></button>
                  <button
                    pButton
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-danger p-button-text"
                    pTooltip="Delete Designation"
                    (click)="deleteDesignation(designation)"
                    [disabled]="getMemberCountForDesignation(designation._id) > 0"
                  ></button>
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="7" class="text-center">
                No designations created for this committee
                <br>
                <button
                  pButton
                  label="Create First Designation"
                  icon="pi pi-plus"
                  class="p-button-link mt-2"
                  (click)="addDesignation()"
                ></button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>

    <!-- Designation Members Dialog -->
    <p-dialog 
      header="Manage Designation Members" 
      [(visible)]="showDesignationMembersDialogFlag" 
      [modal]="true" 
      [style]="{width: '800px'}"
      [dismissableMask]="true"
    >
      <div class="designation-members-content" *ngIf="selectedDesignation">
        <div class="designation-header">
          <div>
            <h4>{{ selectedDesignation.name }}</h4>
            <p class="designation-description" *ngIf="selectedDesignation.description">
              {{ selectedDesignation.description }}
            </p>
          </div>
          <button
            pButton
            label="Add User"
            icon="pi pi-plus"
            class="p-button-success"
            (click)="showAddUserToDesignationDialog()"
            [disabled]="users.length === 0"
          ></button>
        </div>
        
        <p-table 
          [value]="getMembersInDesignation(selectedDesignation._id)" 
          responsiveLayout="scroll"
          [paginator]="true"
          [rows]="5"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>User Name</th>
              <th>Status</th>
              <th>Assigned Date</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-member>
            <tr>
              <td>{{ getMemberDisplayName(member) }}</td>
              <td>
                <p-tag 
                  [value]="member.isActive ? 'Active' : 'Inactive'" 
                  [severity]="member.isActive ? 'success' : 'danger'"
                ></p-tag>
              </td>
              <td>{{ member.assignedDate | date:'mediumDate' }}</td>
              <td>
                <button
                  pButton
                  icon="pi pi-times"
                  class="p-button-rounded p-button-danger p-button-text"
                  pTooltip="Remove User"
                  (click)="removeUserFromDesignation(member)"
                  [disabled]="!member.isActive"
                ></button>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="4" class="text-center">
                No users assigned to this designation
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </p-dialog>

    <!-- Add User to Designation Dialog -->
    <p-dialog 
      header="Add User to Designation" 
      [(visible)]="showAddUserToDesignationDialogFlag" 
      [modal]="true" 
      [style]="{width: '500px'}"
      [dismissableMask]="true"
    >
      <form [formGroup]="memberForm" (ngSubmit)="addUserToDesignation()" *ngIf="selectedDesignation">
        <div class="form-field">
          <label>Designation: <strong>{{ selectedDesignation.name }}</strong></label>
        </div>
        
        <div class="form-field">
          <label for="userId">Select User *</label>
          <select
            id="userId"
            formControlName="userId"
            class="w-full p-inputtext"
          >
            <option value="">Select a user</option>
            <option *ngFor="let user of users" [value]="user._id">
              {{ user.name || user.firstName + ' ' + user.lastName || user.email }}
            </option>
          </select>
          <small 
            class="p-error" 
            *ngIf="memberForm.get('userId')?.invalid && memberForm.get('userId')?.touched"
          >
            Please select a user
          </small>
        </div>

        <div class="form-field">
          <label for="notes">Notes</label>
          <input
            id="notes"
            type="text"
            pInputText
            formControlName="notes"
            placeholder="Optional notes"
            class="w-full"
          />
        </div>

        <div class="dialog-actions">
          <button
            type="button"
            pButton
            label="Cancel"
            class="p-button-outlined"
            (click)="hideAddUserToDesignationDialog()"
          ></button>
          <button
            type="submit"
            pButton
            label="Add User"
            [loading]="isAddingUser"
            [disabled]="memberForm.invalid"
          ></button>
        </div>
      </form>
    </p-dialog>
  `,
  styles: [`
    .committee-detail-container {
      padding: 2rem;
    }

    .committee-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      gap: 1rem;
    }

    .committee-info h1 {
      margin: 0 0 0.5rem 0;
      color: var(--primary-color);
    }

    .committee-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: var(--text-color-secondary);
    }

    .committee-actions {
      display: flex;
      gap: 1rem;
    }

    .form-field {
      margin-bottom: 1.5rem;
    }

    .form-field label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--text-color);
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--surface-border);
    }

    @media (max-width: 768px) {
      .committee-header {
        flex-direction: column;
        align-items: stretch;
      }

      .committee-actions {
        flex-direction: column;
      }
    }

    .roles-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    .role-tag {
      background: var(--primary-color);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      white-space: nowrap;
    }

    .members-in-designation {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .designation-actions {
      display: flex;
      gap: 0.25rem;
    }

    .designation-actions .p-button {
      width: 2rem;
      height: 2rem;
    }

    .designation-members-content h4 {
      margin: 0 0 0.5rem 0;
      color: var(--primary-color);
    }

    .designation-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .designation-description {
      color: var(--text-color-secondary);
      margin: 0;
    }

    .form-field {
      margin-bottom: 1.5rem;
    }

    .form-field label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--text-color);
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--surface-border);
    }
  `]
})
export class CommitteeDetailComponent implements OnInit, AfterViewInit {
  committee: Committee | null = null;
  members: CommitteeMember[] = [];
  designations: CommitteeDesignation[] = [];
  users: any[] = [];
  
  // Cached computed properties to avoid ExpressionChangedAfterItHasBeenCheckedError
  activeDesignations: CommitteeDesignation[] = [];
  addMemberTooltip: string = '';
  membersByDesignation: { [key: string]: CommitteeMember[] } = {};
  
  isLoadingMembers = false;
  isLoadingDesignations = false;
  showDesignationMembersDialogFlag = false;
  showAddUserToDesignationDialogFlag = false;
  isAddingUser = false;
  selectedDesignation: CommitteeDesignation | null = null;
  
  memberForm: FormGroup;
  committeeId: string | null = null;
  
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private committeeService = inject(CommitteeService);
  private dataService = inject(DataService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.memberForm = this.fb.group({
      userId: ['', Validators.required],
      designationId: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.committeeId = this.route.snapshot.paramMap.get('id');
    if (this.committeeId) {
      // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => {
        this.loadCommittee();
        this.loadMembers();
        this.loadDesignations();
        this.loadUsers();
        this.cdr.detectChanges(); // Ensure view updates
      });
    }
  }

  ngAfterViewInit(): void {
    // Ensure cached properties are initialized
    this.updateCachedProperties();
    this.updateMembersByDesignation();
  }

  loadCommittee(): void {
    if (!this.committeeId) return;
    
    this.committeeService.getCommittee(this.committeeId).subscribe({
      next: (response) => {
        // Handle both wrapped and direct responses
        this.committee = response?.data || response;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load committee details'
        });
      }
    });
  }

  loadMembers(): void {
    if (!this.committeeId) return;
    
    this.isLoadingMembers = true;
    this.committeeService.getCommitteeMembers(this.committeeId, true).subscribe({
      next: (response) => {
        this.isLoadingMembers = false;
        // Handle both wrapped and direct responses
        this.members = response?.data || response || [];
        // Update cached properties
        this.updateMembersByDesignation();
        this.cdr.detectChanges(); // Ensure view updates
      },
      error: (error) => {
        this.isLoadingMembers = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load committee members'
        });
        this.updateMembersByDesignation();
        this.cdr.detectChanges(); // Ensure view updates
      }
    });
  }

  loadDesignations(): void {
    if (!this.committeeId) return;
    
    this.isLoadingDesignations = true;
    this.committeeService.getDesignationsByCommittee(this.committeeId).subscribe({
      next: (response) => {
        this.isLoadingDesignations = false;
        // Handle both wrapped and direct responses
        const designations = response?.data || response || [];
        this.designations = Array.isArray(designations) ? designations : [];
        // Update cached properties
        this.updateCachedProperties();
        this.cdr.detectChanges(); // Ensure view updates
      },
      error: (error) => {
        this.isLoadingDesignations = false;
        console.error('Error loading designations:', error);
        this.updateCachedProperties();
        this.cdr.detectChanges(); // Ensure view updates
      }
    });
  }

  loadUsers(): void {
    this.dataService.getAll<ApiResponse<any[]>>('users').subscribe({
      next: (response: any) => {
        // Handle both wrapped and direct responses
        const users = response?.data || response || [];
        this.users = Array.isArray(users) ? users : [];
        // Update cached properties
        this.updateCachedProperties();
      },
      error: (error) => {
        console.error('Error loading users:', error);
        // Set a fallback empty array
        this.users = [];
        this.updateCachedProperties();
      }
    });
  }

  private updateCachedProperties(): void {
    // Update cached active designations
    this.activeDesignations = this.designations.filter(d => d.isActive);
    
    // Update cached tooltip
    if (this.users.length === 0 && this.activeDesignations.length === 0) {
      this.addMemberTooltip = 'No users or designations available';
    } else if (this.users.length === 0) {
      this.addMemberTooltip = 'No users available';
    } else if (this.activeDesignations.length === 0) {
      this.addMemberTooltip = 'No designations available';
    } else {
      this.addMemberTooltip = 'Add a new member to this committee';
    }
  }

  private updateMembersByDesignation(): void {
    // Cache members by designation to avoid repeated filtering
    this.membersByDesignation = {};
    this.members.forEach(member => {
      if (member.designationId && member.isActive) {
        if (!this.membersByDesignation[member.designationId]) {
          this.membersByDesignation[member.designationId] = [];
        }
        this.membersByDesignation[member.designationId].push(member);
      }
    });
  }

  editCommittee(): void {
    if (this.committeeId) {
      this.router.navigate(['/apps/committees', this.committeeId, 'edit']);
    }
  }

  manageDesignations(): void {
    if (this.committeeId) {
      this.router.navigate(['/apps/committees', this.committeeId, 'designations']);
    }
  }

  addDesignation(): void {
    if (this.committeeId) {
      this.router.navigate(['/apps/committees', this.committeeId, 'designations', 'new']);
    }
  }

  editDesignation(designation: CommitteeDesignation): void {
    if (this.committeeId && designation._id) {
      this.router.navigate(['/apps/committees', this.committeeId, 'designations', designation._id, 'edit']);
    }
  }

  deleteDesignation(designation: CommitteeDesignation): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this designation? This action cannot be undone.',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (designation._id) {
          this.committeeService.deleteDesignation(designation._id).subscribe({
            next: (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Designation deleted successfully'
              });
              this.loadDesignations();
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete designation'
              });
            }
          });
        }
      }
    });
  }

  showDesignationMembers(designation: CommitteeDesignation): void {
    this.selectedDesignation = designation;
    this.showDesignationMembersDialogFlag = true;
  }

  showAddUserToDesignationDialog(): void {
    this.showAddUserToDesignationDialogFlag = true;
    this.memberForm.patchValue({
      designationId: this.selectedDesignation?._id,
      userId: '',
      notes: ''
    });
  }

  hideAddUserToDesignationDialog(): void {
    this.showAddUserToDesignationDialogFlag = false;
    this.memberForm.reset();
  }

  addUserToDesignation(): void {
    if (this.memberForm.valid && this.selectedDesignation?._id && this.committeeId) {
      this.isAddingUser = true;
      const formData = {
        userId: this.memberForm.value.userId,
        designationId: this.selectedDesignation._id,
        committeeId: this.committeeId,
        notes: this.memberForm.value.notes
      };

      this.committeeService.assignMember(formData).subscribe({
        next: (response) => {
          this.isAddingUser = false;
          if (response?.success !== false) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User added to designation successfully'
            });
            this.hideAddUserToDesignationDialog();
            // Refresh the members data by reloading from server
            if (this.committeeId) {
              this.loadMembers();
            }
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response?.message || 'Failed to add user to designation'
            });
          }
        },
        error: (error) => {
          this.isAddingUser = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add user to designation'
          });
        }
      });
    }
  }

  removeUserFromDesignation(member: CommitteeMember): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this user from the designation?',
      header: 'Confirm Removal',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (member._id && this.committeeId) {
          this.committeeService.unassignMember(member._id, { 
            committeeId: this.committeeId 
          }).subscribe({
            next: (response) => {
              // Handle both wrapped and direct responses
              if (response?.success !== false) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'User removed successfully'
                });
                this.loadMembers();
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: response?.message || 'Failed to remove user'
                });
              }
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to remove user'
              });
            }
          });
        }
      }
    });
  }

  getMembersInDesignation(designationId: string | undefined): CommitteeMember[] {
    if (!designationId) return [];
    return this.membersByDesignation[designationId] || [];
  }

  getMemberCountForDesignation(designationId: string | undefined): number {
    if (!designationId) return 0;
    return this.membersByDesignation[designationId]?.length || 0;
  }

  getActiveDesignations(): CommitteeDesignation[] {
    return this.activeDesignations;
  }

  goBack(): void {
    this.router.navigate(['/apps/committees']);
  }

  getMemberDisplayName(member: CommitteeMember): string {
    if (member.user?.name) {
      return member.user.name;
    }
    if (member.user?.firstName && member.user?.lastName) {
      return `${member.user.firstName} ${member.user.lastName}`;
    }
    if (member.user?.email) {
      return member.user.email;
    }
    return 'Unknown User';
  }
}
