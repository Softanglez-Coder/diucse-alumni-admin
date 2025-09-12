import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommitteeService } from './committee.service';

@Component({
  selector: 'app-committee-designations',
  standalone: true,
  imports: [
    CommonModule, 
    ToastModule, 
    ButtonModule, 
    CardModule, 
    TableModule, 
    TagModule, 
    ToolbarModule, 
    TooltipModule, 
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>
    
    <div class="designation-container">
      <!-- Header with back button -->
      <div class="designation-header">
        <button
          pButton
          label="Back to Committee"
          icon="pi pi-arrow-left"
          class="p-button-outlined"
          (click)="goBackToCommittee()"
        ></button>
        
        <div class="committee-info" *ngIf="committee">
          <h2>Designations for {{ committee.name }}</h2>
        </div>
      </div>

      <!-- Designations Table -->
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
          [loading]="loading"
          responsiveLayout="scroll"
          [paginator]="true"
          [rows]="10"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        >
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="name">Designation Name <p-sortIcon field="name"></p-sortIcon></th>
              <th>Description</th>
              <th pSortableColumn="displayOrder">Display Order <p-sortIcon field="displayOrder"></p-sortIcon></th>
              <th>Roles</th>
              <th pSortableColumn="isActive">Status <p-sortIcon field="isActive"></p-sortIcon></th>
              <th pSortableColumn="createdAt">Created <p-sortIcon field="createdAt"></p-sortIcon></th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-designation>
            <tr>
              <td>{{ designation.name }}</td>
              <td>{{ designation.description || '-' }}</td>
              <td>{{ designation.displayOrder }}</td>
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
              <td>{{ designation.createdAt | date:'medium' }}</td>
              <td>
                <div class="action-buttons">
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
                  ></button>
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="7" class="text-center">
                No designations found for this committee
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
  `,
  styles: [`
    .designation-container {
      padding: 1rem;
    }

    .designation-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .committee-info h2 {
      margin: 0;
      color: var(--primary-color);
    }

    @media (max-width: 768px) {
      .designation-header {
        flex-direction: column;
        align-items: flex-start;
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

    .action-buttons {
      display: flex;
      gap: 0.25rem;
    }

    .text-center {
      text-align: center;
      padding: 2rem;
      color: var(--text-color-secondary);
    }

    .mt-2 {
      margin-top: 0.5rem;
    }
  `]
})
export class CommitteeDesignationsComponent implements OnInit {
  committeeId: string | null = null;
  committee: any = null;
  designations: any[] = [];
  loading = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private committeeService = inject(CommitteeService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  ngOnInit(): void {
    this.committeeId = this.route.snapshot.paramMap.get('committeeId');
    
    if (this.committeeId) {
      // Load committee details and designations
      this.loadCommittee();
      this.loadDesignations();
    }
  }

  loadCommittee(): void {
    if (!this.committeeId) return;
    
    this.committeeService.getCommittee(this.committeeId).subscribe({
      next: (response) => {
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

  loadDesignations(): void {
    if (!this.committeeId) return;
    
    this.loading = true;
    this.committeeService.getDesignationsByCommittee(this.committeeId).subscribe({
      next: (response) => {
        this.loading = false;
        // Handle both wrapped and direct responses
        const designations = response?.data || response || [];
        this.designations = Array.isArray(designations) ? designations : [];
        console.log('Loaded designations:', this.designations);
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load designations'
        });
        console.error('Error loading designations:', error);
      }
    });
  }

  addDesignation(): void {
    if (this.committeeId) {
      this.router.navigate(['/apps/committees', this.committeeId, 'designations', 'new']);
    }
  }

  editDesignation(designation: any): void {
    if (this.committeeId && designation._id) {
      this.router.navigate(['/apps/committees', this.committeeId, 'designations', designation._id, 'edit']);
    }
  }

  deleteDesignation(designation: any): void {
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
              this.loadDesignations(); // Reload the list
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

  goBackToCommittee(): void {
    if (this.committeeId) {
      this.router.navigate(['/apps/committees', this.committeeId]);
    }
  }
}
