import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommitteeService, CommitteeDesignation, Committee } from './committee.service';

@Component({
  selector: 'app-designation-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    SelectModule,
    MultiSelectModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <div class="form-container">
      <p-card>
        <div class="form-header">
          <h1>{{ isEditMode ? 'Edit Designation' : 'Create Designation' }}</h1>
          <button
            pButton
            label="Back to List"
            icon="pi pi-arrow-left"
            class="p-button-outlined"
            (click)="goBack()"
          ></button>
        </div>

        <form [formGroup]="designationForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <div class="form-field full-width">
              <label for="name">Designation Name *</label>
              <input
                id="name"
                type="text"
                pInputText
                formControlName="name"
                placeholder="Enter designation name"
                class="w-full"
              />
              <small 
                class="p-error" 
                *ngIf="designationForm.get('name')?.invalid && designationForm.get('name')?.touched"
              >
                Designation name is required
              </small>
            </div>

            <div class="form-field full-width">
              <label for="description">Description</label>
              <textarea
                id="description"
                formControlName="description"
                placeholder="Enter description"
                class="w-full p-inputtext"
                rows="3"
              ></textarea>
            </div>

            <div class="form-field full-width">
              <label for="committee">Committee *</label>
              <p-select
                id="committee"
                formControlName="committeeId"
                [options]="committees"
                optionLabel="name"
                optionValue="_id"
                placeholder="Select a committee"
                class="w-full"
              ></p-select>
              <small 
                class="p-error" 
                *ngIf="designationForm.get('committeeId')?.invalid && designationForm.get('committeeId')?.touched"
              >
                Committee selection is required
              </small>
            </div>

            <div class="form-field full-width">
              <label for="roles">Roles *</label>
              <p-multiSelect
                id="roles"
                formControlName="roles"
                [options]="availableRoles"
                optionLabel="label"
                optionValue="value"
                placeholder="Select roles"
                class="w-full"
                [showToggleAll]="true"
              ></p-multiSelect>
              <small 
                class="p-error" 
                *ngIf="designationForm.get('roles')?.invalid && designationForm.get('roles')?.touched"
              >
                At least one role must be selected
              </small>
            </div>

            <div class="form-field">
              <label for="priority">Priority</label>
              <input
                id="priority"
                type="number"
                pInputText
                formControlName="priority"
                placeholder="Enter priority (lower number = higher priority)"
                min="0"
                max="999"
                class="w-full"
              />
              <small class="form-hint">Lower numbers indicate higher priority</small>
            </div>

            <div class="form-field" *ngIf="isEditMode">
              <div class="flex align-items-center">
                <p-checkbox
                  id="isActive"
                  formControlName="isActive"
                  [binary]="true"
                ></p-checkbox>
                <label for="isActive" class="ml-2">Active</label>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button
              type="button"
              pButton
              label="Cancel"
              class="p-button-outlined"
              (click)="goBack()"
            ></button>
            <button
              type="submit"
              pButton
              [label]="isEditMode ? 'Update' : 'Create'"
              [loading]="isLoading"
              [disabled]="designationForm.invalid"
            ></button>
          </div>
        </form>
      </p-card>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .form-header h1 {
      margin: 0;
      color: var(--primary-color);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .form-field {
      display: flex;
      flex-direction: column;
    }

    .form-field.full-width {
      grid-column: 1 / -1;
    }

    .form-field label {
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--text-color);
    }

    .form-hint {
      font-size: 0.875rem;
      color: var(--text-color-secondary);
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--surface-border);
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .form-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
    }
  `]
})
export class DesignationFormComponent implements OnInit {
  designationForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  designationId: string | null = null;
  committees: Committee[] = [];
  
  availableRoles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Accountant', value: 'accountant' },
    { label: 'Marketing Manager', value: 'marketing_manager' },
    { label: 'Sales Manager', value: 'sales_manager' },
    { label: 'Event Manager', value: 'event_manager' },
    { label: 'Customer Support', value: 'customer_support' },
    { label: 'Reviewer', value: 'reviewer' },
    { label: 'Publisher', value: 'publisher' },
    { label: 'Member', value: 'member' },
    { label: 'Guest', value: 'guest' }
  ];
  
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private committeeService = inject(CommitteeService);
  private messageService = inject(MessageService);

  constructor() {
    this.designationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      committeeId: ['', Validators.required],
      roles: [[], [Validators.required, this.atLeastOneRoleValidator]],
      priority: [0],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.designationId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.designationId;

    this.loadCommittees();

    if (this.isEditMode && this.designationId) {
      this.loadDesignation(this.designationId);
    }
  }

  loadDesignation(id: string): void {
    this.isLoading = true;
    this.committeeService.getDesignation(id).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Handle both wrapped and direct responses
        const designation = response?.data || response;
        
        if (designation) {
          this.designationForm.patchValue({
            name: designation.name,
            description: designation.description,
            committeeId: typeof designation.committee === 'string' ? designation.committee : designation.committee?._id,
            roles: designation.roles || [],
            priority: designation.priority,
            isActive: designation.isActive
          });
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load designation details'
        });
        console.error('Error loading designation:', error);
      }
    });
  }

  loadCommittees(): void {
    this.committeeService.getCommittees().subscribe({
      next: (response) => {
        // Handle both wrapped and direct responses
        const committees = response?.data || response || [];
        this.committees = Array.isArray(committees) ? committees : [];
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load committees'
        });
        console.error('Error loading committees:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.designationForm.valid) {
      this.isLoading = true;
      const formData = this.designationForm.value;

      const operation = this.isEditMode && this.designationId
        ? this.committeeService.updateDesignation(this.designationId, formData)
        : this.committeeService.createDesignation(formData);

      operation.subscribe({
        next: (response) => {
          this.isLoading = false;
          // Handle both wrapped and direct responses
          const isSuccess = response?.success !== false; // Consider success if not explicitly false
          
          if (isSuccess) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Designation ${this.isEditMode ? 'updated' : 'created'} successfully`
            });
            setTimeout(() => {
              this.goBack();
            }, 1500);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response?.message || `Failed to ${this.isEditMode ? 'update' : 'create'} designation`
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to ${this.isEditMode ? 'update' : 'create'} designation`
          });
          console.error('Error saving designation:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  goBack(): void {
    this.router.navigate(['/apps/committee-designations']);
  }

  atLeastOneRoleValidator(control: any) {
    const roles = control.value;
    return roles && roles.length > 0 ? null : { atLeastOneRole: true };
  }

  private markFormGroupTouched(): void {
    Object.keys(this.designationForm.controls).forEach(key => {
      const control = this.designationForm.get(key);
      control?.markAsTouched();
    });
  }
}
