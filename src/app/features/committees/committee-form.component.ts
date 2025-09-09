import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommitteeService, Committee } from './committee.service';

@Component({
  selector: 'app-committee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <div class="form-container">
      <p-card>
        <div class="form-header">
          <h1>{{ isEditMode ? 'Edit Committee' : 'Create Committee' }}</h1>
          <button
            pButton
            label="Back to List"
            icon="pi pi-arrow-left"
            class="p-button-outlined"
            (click)="goBack()"
          ></button>
        </div>

        <form [formGroup]="committeeForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <div class="form-field">
              <label for="name">Committee Name *</label>
              <input
                id="name"
                type="text"
                pInputText
                formControlName="name"
                placeholder="Enter committee name"
                class="w-full"
              />
              <small 
                class="p-error" 
                *ngIf="committeeForm.get('name')?.invalid && committeeForm.get('name')?.touched"
              >
                Committee name is required
              </small>
            </div>

            <div class="form-field">
              <label for="startDate">Start Date *</label>
              <input
                id="startDate"
                type="date"
                pInputText
                formControlName="startDate"
                placeholder="Select start date"
                class="w-full"
              />
              <small 
                class="p-error" 
                *ngIf="committeeForm.get('startDate')?.invalid && committeeForm.get('startDate')?.touched"
              >
                Start date is required
              </small>
            </div>

            <div class="form-field">
              <label for="endDate">End Date *</label>
              <input
                id="endDate"
                type="date"
                pInputText
                formControlName="endDate"
                placeholder="Select end date"
                class="w-full"
              />
              <small 
                class="p-error" 
                *ngIf="committeeForm.get('endDate')?.invalid && committeeForm.get('endDate')?.touched"
              >
                End date is required
              </small>
            </div>

            <div class="form-field" *ngIf="isEditMode">
              <div class="flex align-items-center">
                <p-checkbox
                  id="isPublished"
                  formControlName="isPublished"
                  [binary]="true"
                ></p-checkbox>
                <label for="isPublished" class="ml-2">Published</label>
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
              [disabled]="committeeForm.invalid"
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
export class CommitteeFormComponent implements OnInit {
  committeeForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  committeeId: string | null = null;
  
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private committeeService = inject(CommitteeService);
  private messageService = inject(MessageService);

  constructor() {
    this.committeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      isPublished: [false]
    });
  }

  ngOnInit(): void {
    this.committeeId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.committeeId;

    if (this.isEditMode && this.committeeId) {
      this.loadCommittee(this.committeeId);
    }
  }

  loadCommittee(id: string): void {
    this.isLoading = true;
    this.committeeService.getCommittee(id).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          const committee = response.data;
          this.committeeForm.patchValue({
            name: committee.name,
            startDate: new Date(committee.startDate),
            endDate: new Date(committee.endDate),
            isPublished: committee.isPublished
          });
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load committee details'
        });
        console.error('Error loading committee:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.committeeForm.valid) {
      this.isLoading = true;
      const formData = this.committeeForm.value;

      const operation = this.isEditMode && this.committeeId
        ? this.committeeService.updateCommittee(this.committeeId, formData)
        : this.committeeService.createCommittee(formData);

      operation.subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Committee ${this.isEditMode ? 'updated' : 'created'} successfully`
            });
            setTimeout(() => {
              this.goBack();
            }, 1500);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to ${this.isEditMode ? 'update' : 'create'} committee`
          });
          console.error('Error saving committee:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  goBack(): void {
    this.router.navigate(['/apps/committees']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.committeeForm.controls).forEach(key => {
      const control = this.committeeForm.get(key);
      control?.markAsTouched();
    });
  }
}
