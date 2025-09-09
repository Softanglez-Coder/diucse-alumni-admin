import { Component, OnInit, inject } from '@angular/core';
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
          <button
            pButton
            label="Manage Designations"
            icon="pi pi-cog"
            class="p-button-outlined"
            (click)="manageDesignations()"
          ></button>
        </div>
      </div>

      <!-- Committee Members -->
      <p-card>
        <p-toolbar>
          <div class="p-toolbar-group-left">
            <h3>Committee Members</h3>
          </div>
          <div class="p-toolbar-group-right">
            <button
              pButton
              label="Add Member"
              icon="pi pi-plus"
              class="p-button-success"
              (click)="showAddMemberDialogMethod()"
              [disabled]="users.length === 0 || designations.length === 0"
              [pTooltip]="getAddMemberTooltip()"
            ></button>
          </div>
        </p-toolbar>

        <p-table 
          [value]="members" 
          [loading]="isLoadingMembers"
          responsiveLayout="scroll"
          [paginator]="true"
          [rows]="10"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Member Name</th>
              <th>Designation</th>
              <th>Status</th>
              <th>Assigned Date</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-member>
            <tr>
              <td>{{ getMemberDisplayName(member) }}</td>
              <td>{{ member.designation?.name || 'Unknown Designation' }}</td>
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
                  pTooltip="Remove Member"
                  (click)="removeMember(member)"
                  [disabled]="!member.isActive"
                ></button>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="5" class="text-center">No members assigned to this committee</td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>

    <!-- Add Member Dialog -->
    <p-dialog 
      header="Add Committee Member" 
      [(visible)]="showAddMemberDialogFlag" 
      [modal]="true" 
      [style]="{width: '500px'}"
      [dismissableMask]="true"
    >
      <form [formGroup]="memberForm" (ngSubmit)="addMember()">
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
          <div class="mt-2" *ngIf="users.length === 0">
            <small class="text-orange-500">
              <i class="pi pi-info-circle mr-1"></i>
              No users available. Please ensure users are created in the system first.
            </small>
          </div>
          <small 
            class="p-error" 
            *ngIf="memberForm.get('userId')?.invalid && memberForm.get('userId')?.touched"
          >
            Please select a user
          </small>
        </div>

        <div class="form-field">
          <label for="designationId">Select Designation *</label>
          <select
            id="designationId"
            formControlName="designationId"
            class="w-full p-inputtext"
          >
            <option value="">Select a designation</option>
            <option *ngFor="let designation of designations" [value]="designation._id">
              {{ designation.name }}
            </option>
          </select>
          <div class="mt-2" *ngIf="designations.length === 0">
            <small class="text-orange-500">
              <i class="pi pi-info-circle mr-1"></i>
              No designations available. 
              <button 
                type="button" 
                class="p-button-link p-0 text-primary-500 underline ml-1" 
                (click)="manageDesignations()"
              >
                Create designations first
              </button>
            </small>
          </div>
          <small 
            class="p-error" 
            *ngIf="memberForm.get('designationId')?.invalid && memberForm.get('designationId')?.touched"
          >
            Please select a designation
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
            (click)="hideAddMemberDialog()"
          ></button>
          <button
            type="submit"
            pButton
            label="Add Member"
            [loading]="isAddingMember"
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
  `]
})
export class CommitteeDetailComponent implements OnInit {
  committee: Committee | null = null;
  members: CommitteeMember[] = [];
  designations: CommitteeDesignation[] = [];
  users: any[] = [];
  
  isLoadingMembers = false;
  isAddingMember = false;
  showAddMemberDialogFlag = false;
  
  memberForm: FormGroup;
  committeeId: string | null = null;
  
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private committeeService = inject(CommitteeService);
  private dataService = inject(DataService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

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
      this.loadCommittee();
      this.loadMembers();
      this.loadDesignations();
      this.loadUsers();
    }
  }

  loadCommittee(): void {
    if (!this.committeeId) return;
    
    this.committeeService.getCommittee(this.committeeId).subscribe({
      next: (response) => {
        if (response.success) {
          this.committee = response.data;
        }
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
        if (response.success) {
          this.members = response.data;
        }
      },
      error: (error) => {
        this.isLoadingMembers = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load committee members'
        });
      }
    });
  }

  loadDesignations(): void {
    this.committeeService.getDesignations().subscribe({
      next: (response) => {
        if (response.success) {
          this.designations = response.data.filter(d => d.isActive);
        }
      },
      error: (error) => {
        console.error('Error loading designations:', error);
      }
    });
  }

  loadUsers(): void {
    this.dataService.getAll<ApiResponse<any[]>>('users').subscribe({
      next: (response: any) => {
        if (response.success) {
          this.users = response.data;
        } else if (Array.isArray(response)) {
          // Handle case where response is directly an array
          this.users = response;
        }
      },
      error: (error) => {
        console.error('Error loading users:', error);
        // Set a fallback empty array
        this.users = [];
      }
    });
  }

  showAddMemberDialogMethod(): void {
    this.showAddMemberDialogFlag = true;
    this.memberForm.reset();
  }

  hideAddMemberDialog(): void {
    this.showAddMemberDialogFlag = false;
  }

  addMember(): void {
    if (this.memberForm.valid && this.committeeId) {
      this.isAddingMember = true;
      const formData = {
        ...this.memberForm.value,
        committeeId: this.committeeId
      };

      this.committeeService.assignMember(formData).subscribe({
        next: (response) => {
          this.isAddingMember = false;
          if (response.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Member added successfully'
            });
            this.hideAddMemberDialog();
            this.loadMembers();
          }
        },
        error: (error) => {
          this.isAddingMember = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add member'
          });
        }
      });
    }
  }

  removeMember(member: CommitteeMember): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this member from the committee?',
      header: 'Confirm Removal',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (member._id && this.committeeId) {
          this.committeeService.unassignMember(member._id, { 
            committeeId: this.committeeId 
          }).subscribe({
            next: (response) => {
              if (response.success) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Member removed successfully'
                });
                this.loadMembers();
              }
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to remove member'
              });
            }
          });
        }
      }
    });
  }

  editCommittee(): void {
    if (this.committeeId) {
      this.router.navigate(['/apps/committees', this.committeeId, 'edit']);
    }
  }

  manageDesignations(): void {
    this.router.navigate(['/apps/committee-designations']);
  }

  goBack(): void {
    this.router.navigate(['/apps/committees']);
  }

  getAddMemberTooltip(): string {
    if (this.users.length === 0 && this.designations.length === 0) {
      return 'No users or designations available';
    } else if (this.users.length === 0) {
      return 'No users available';
    } else if (this.designations.length === 0) {
      return 'No designations available';
    }
    return 'Add a new member to this committee';
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
