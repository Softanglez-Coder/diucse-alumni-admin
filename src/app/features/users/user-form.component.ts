import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CardModule,
    ButtonModule,
    InputTextModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="form-container">
      <div class="form-header">
        <h1 class="form-title">{{isEditMode ? 'Edit' : 'Create'}} User</h1>
        <button 
          pButton 
          label="Back to List" 
          icon="pi pi-arrow-left" 
          class="p-button-outlined"
          routerLink="/apps/users">
        </button>
      </div>

      <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
        <div class="form-grid">
          <!-- Personal Information -->
          <p-card header="Personal Information">
            <div class="grid">
              <div class="col-12 md:col-6">
                <label for="firstName" class="form-label">First Name *</label>
                <input 
                  id="firstName"
                  type="text"
                  pInputText
                  formControlName="firstName"
                  placeholder="Enter first name"
                  class="w-full"
                  [class.p-invalid]="isFieldInvalid('firstName')"
                />
                <small *ngIf="isFieldInvalid('firstName')" class="p-error">
                  First name is required
                </small>
              </div>

              <div class="col-12 md:col-6">
                <label for="lastName" class="form-label">Last Name *</label>
                <input 
                  id="lastName"
                  type="text"
                  pInputText
                  formControlName="lastName"
                  placeholder="Enter last name"
                  class="w-full"
                  [class.p-invalid]="isFieldInvalid('lastName')"
                />
                <small *ngIf="isFieldInvalid('lastName')" class="p-error">
                  Last name is required
                </small>
              </div>

              <div class="col-12 md:col-6">
                <label for="email" class="form-label">Email *</label>
                <input 
                  id="email"
                  type="email"
                  pInputText
                  formControlName="email"
                  placeholder="Enter email address"
                  class="w-full"
                  [class.p-invalid]="isFieldInvalid('email')"
                />
                <small *ngIf="isFieldInvalid('email')" class="p-error">
                  Valid email is required
                </small>
              </div>

              <div class="col-12 md:col-6">
                <label for="phone" class="form-label">Phone</label>
                <input 
                  id="phone"
                  type="tel"
                  pInputText
                  formControlName="phone"
                  placeholder="Enter phone number"
                  class="w-full"
                />
              </div>

              <div class="col-12 md:col-6">
                <label for="batch" class="form-label">Batch *</label>
                <select 
                  id="batch"
                  formControlName="batch"
                  class="w-full form-select"
                  [class.p-invalid]="isFieldInvalid('batch')">
                  <option value="">Select batch</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
                <small *ngIf="isFieldInvalid('batch')" class="p-error">
                  Batch is required
                </small>
              </div>

              <div class="col-12 md:col-6">
                <label for="status" class="form-label">Status *</label>
                <select 
                  id="status"
                  formControlName="status"
                  class="w-full form-select"
                  [class.p-invalid]="isFieldInvalid('status')">
                  <option value="">Select status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
                <small *ngIf="isFieldInvalid('status')" class="p-error">
                  Status is required
                </small>
              </div>
            </div>
          </p-card>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button 
            type="button"
            pButton 
            label="Cancel" 
            icon="pi pi-times"
            class="p-button-outlined"
            routerLink="/apps/users">
          </button>
          <button 
            type="submit"
            pButton 
            [label]="isEditMode ? 'Update' : 'Create'"
            [icon]="isEditMode ? 'pi pi-check' : 'pi pi-plus'"
            [loading]="isLoading"
            [disabled]="userForm.invalid || isLoading">
          </button>
        </div>
      </form>
    </div>

    <p-toast></p-toast>
  `,
  styles: [`
    .form-container {
      max-width: 1000px;
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
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
    }

    .form-select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    .form-select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 1px #3b82f6;
    }

    .form-select.p-invalid {
      border-color: #ef4444;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .grid {
      display: grid;
      gap: 1rem;
    }

    .col-12 {
      grid-column: span 12;
    }

    .col-6 {
      grid-column: span 6;
    }

    @media (min-width: 768px) {
      .grid {
        grid-template-columns: repeat(12, 1fr);
      }
      
      .md\\:col-6 {
        grid-column: span 6;
      }
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

      .form-actions {
        flex-direction: column;
      }
    }

    :host ::ng-deep .p-card-header {
      background: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
      padding: 1rem 1.5rem;
      font-weight: 600;
      color: #374151;
    }

    :host ::ng-deep .p-card-content {
      padding: 1.5rem;
    }
  `]
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      batch: ['', [Validators.required]],
      status: ['active', [Validators.required]]
    });
  }

  ngOnInit() {
    this.userId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.userId;
    
    if (this.isEditMode) {
      this.loadUser();
    }
  }

  loadUser() {
    // Simulate API call
    this.isLoading = true;
    setTimeout(() => {
      // Load user data
      this.userForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        batch: '2020',
        status: 'active'
      });
      this.isLoading = false;
    }, 1000);
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isLoading = true;
      
      // Simulate API call
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `User ${this.isEditMode ? 'updated' : 'created'} successfully`
        });
        
        setTimeout(() => {
          this.router.navigate(['/apps/users']);
        }, 1000);
        
        this.isLoading = false;
      }, 1500);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
