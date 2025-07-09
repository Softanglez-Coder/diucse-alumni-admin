import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MembershipService, Membership } from './membership.service';

interface MembershipType {
  label: string;
  value: string;
}

interface MembershipStatus {
  label: string;
  value: string;
}

@Component({
  selector: 'app-membership-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="membership-form-container">
      <div class="form-header">
        <h1 class="form-title">{{ isEditMode ? 'Edit Membership' : 'Add New Membership' }}</h1>
        <button 
          pButton 
          label="Back to List" 
          icon="pi pi-arrow-left" 
          class="p-button-outlined"
          routerLink="/apps/membership">
        </button>
      </div>

      <p-card>
        <form [formGroup]="membershipForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <!-- Member Name -->
            <div class="form-field">
              <label for="memberName">Member Name *</label>
              <input 
                id="memberName"
                type="text" 
                pInputText 
                formControlName="memberName"
                [class.ng-invalid]="membershipForm.get('memberName')?.invalid && membershipForm.get('memberName')?.touched"
                placeholder="Enter member name">
              <small 
                *ngIf="membershipForm.get('memberName')?.invalid && membershipForm.get('memberName')?.touched"
                class="p-error">
                Member name is required
              </small>
            </div>

            <!-- Membership Type -->
            <div class="form-field">
              <label for="membershipType">Membership Type *</label>
              <select 
                id="membershipType"
                formControlName="membershipType"
                [class.ng-invalid]="membershipForm.get('membershipType')?.invalid && membershipForm.get('membershipType')?.touched"
                class="form-select">
                <option value="">Select membership type</option>
                <option *ngFor="let type of membershipTypes" [value]="type.value">
                  {{type.label}}
                </option>
              </select>
              <small 
                *ngIf="membershipForm.get('membershipType')?.invalid && membershipForm.get('membershipType')?.touched"
                class="p-error">
                Membership type is required
              </small>
            </div>

            <!-- Start Date -->
            <div class="form-field">
              <label for="startDate">Start Date *</label>
              <input 
                id="startDate"
                type="date"
                formControlName="startDate"
                [class.ng-invalid]="membershipForm.get('startDate')?.invalid && membershipForm.get('startDate')?.touched"
                class="form-input">
              <small 
                *ngIf="membershipForm.get('startDate')?.invalid && membershipForm.get('startDate')?.touched"
                class="p-error">
                Start date is required
              </small>
            </div>

            <!-- End Date -->
            <div class="form-field">
              <label for="endDate">End Date *</label>
              <input 
                id="endDate"
                type="date"
                formControlName="endDate"
                [class.ng-invalid]="membershipForm.get('endDate')?.invalid && membershipForm.get('endDate')?.touched"
                class="form-input">
              <small 
                *ngIf="membershipForm.get('endDate')?.invalid && membershipForm.get('endDate')?.touched"
                class="p-error">
                End date is required
              </small>
            </div>

            <!-- Status -->
            <div class="form-field">
              <label for="status">Status *</label>
              <select 
                id="status"
                formControlName="status"
                [class.ng-invalid]="membershipForm.get('status')?.invalid && membershipForm.get('status')?.touched"
                class="form-select">
                <option value="">Select status</option>
                <option *ngFor="let status of membershipStatuses" [value]="status.value">
                  {{status.label}}
                </option>
              </select>
              <small 
                *ngIf="membershipForm.get('status')?.invalid && membershipForm.get('status')?.touched"
                class="p-error">
                Status is required
              </small>
            </div>

            <!-- Fees -->
            <div class="form-field">
              <label for="fees">Fees *</label>
              <p-inputNumber 
                id="fees"
                formControlName="fees"
                [class.ng-invalid]="membershipForm.get('fees')?.invalid && membershipForm.get('fees')?.touched"
                placeholder="Enter fees amount"
                mode="currency"
                currency="USD"
                [min]="0">
              </p-inputNumber>
              <small 
                *ngIf="membershipForm.get('fees')?.invalid && membershipForm.get('fees')?.touched"
                class="p-error">
                Fees amount is required
              </small>
            </div>
          </div>

          <div class="form-actions">
            <button 
              pButton 
              label="Cancel" 
              icon="pi pi-times" 
              class="p-button-outlined"
              type="button"
              routerLink="/apps/membership">
            </button>
            <button 
              pButton 
              [label]="isEditMode ? 'Update' : 'Save'" 
              icon="pi pi-check" 
              class="p-button-success"
              type="submit"
              [disabled]="membershipForm.invalid || loading">
            </button>
          </div>
        </form>
      </p-card>
    </div>

    <p-toast></p-toast>
  `,
  styles: [`
    .membership-form-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .form-title {
      font-size: 1.875rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-field label {
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    :host ::ng-deep .p-card-content {
      padding: 1.5rem;
    }

    :host ::ng-deep .p-inputtext,
    :host ::ng-deep .p-inputnumber,
    .form-input,
    .form-select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      line-height: 1.5;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }

    .form-input:focus,
    .form-select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-input.ng-invalid.ng-touched,
    .form-select.ng-invalid.ng-touched {
      border-color: #dc2626;
    }

    :host ::ng-deep .p-error {
      font-size: 0.75rem;
      color: #dc2626;
    }

    @media (max-width: 768px) {
      .form-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .form-title {
        text-align: center;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class MembershipFormComponent implements OnInit {
  membershipForm: FormGroup;
  isEditMode = false;
  membershipId: string | null = null;
  loading = false;

  membershipTypes: MembershipType[] = [
    { label: 'Basic', value: 'basic' },
    { label: 'Premium', value: 'premium' },
    { label: 'Gold', value: 'gold' },
    { label: 'Platinum', value: 'platinum' }
  ];

  membershipStatuses: MembershipStatus[] = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Pending', value: 'pending' },
    { label: 'Expired', value: 'expired' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private membershipService: MembershipService
  ) {
    this.membershipForm = this.fb.group({
      memberName: ['', [Validators.required]],
      membershipType: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      status: ['', [Validators.required]],
      fees: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.membershipId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.membershipId;

    if (this.isEditMode) {
      this.loadMembership(this.membershipId!);
    }
  }

  loadMembership(id: string) {
    this.loading = true;
    this.membershipService.getMembershipById(parseInt(id)).subscribe({
      next: (membership) => {
        this.membershipForm.patchValue(membership);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading membership:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load membership data'
        });
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.membershipForm.valid) {
      this.loading = true;
      const formData = this.membershipForm.value;
      
      const operation = this.isEditMode 
        ? this.membershipService.updateMembership(parseInt(this.membershipId!), formData)
        : this.membershipService.createMembership(formData);

      operation.subscribe({
        next: (result) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Membership ${this.isEditMode ? 'updated' : 'created'} successfully`
          });
          
          this.loading = false;
          this.router.navigate(['/apps/membership']);
        },
        error: (error) => {
          console.error('Error saving membership:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to ${this.isEditMode ? 'update' : 'create'} membership`
          });
          this.loading = false;
        }
      });
    }
  }
}
