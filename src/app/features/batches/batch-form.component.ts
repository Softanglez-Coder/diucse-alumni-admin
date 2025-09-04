import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DataService } from '../../core/services/data.service';

interface Batch {
  id?: number;
  name: string;
}

@Component({
  selector: 'app-batch-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    InputTextModule,
    ButtonModule,
  ],
  template: `
    <div class="p-6 max-w-2xl mx-auto">
      <p-card>
        <ng-template pTemplate="header">
          <div class="flex justify-between items-center p-4">
            <h1 class="text-2xl font-bold text-gray-900">
              {{ isEditMode ? 'Edit Batch' : 'Create Batch' }}
            </h1>
            <button
              pButton
              icon="pi pi-arrow-left"
              class="p-button-text"
              [routerLink]="['/apps/batches']"
              label="Back to List"
            ></button>
          </div>
        </ng-template>

        <ng-template pTemplate="content">
          <div
            *ngIf="successMessage"
            class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
          >
            {{ successMessage }}
          </div>

          <div
            *ngIf="errorMessage"
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          >
            {{ errorMessage }}
          </div>

          <form
            [formGroup]="batchForm"
            (ngSubmit)="onSubmit()"
            class="space-y-6"
          >
            <div class="form-group">
              <label
                for="name"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Batch Name *
              </label>
              <input
                pInputText
                id="name"
                formControlName="name"
                placeholder="Enter batch name"
                class="w-full"
              />
            </div>

            <div class="form-actions flex justify-end space-x-4 pt-6">
              <button
                pButton
                type="button"
                label="Cancel"
                class="p-button-outlined"
                [routerLink]="['/apps/batches']"
              ></button>
              <button
                pButton
                type="submit"
                [label]="isEditMode ? 'Update' : 'Create'"
                [disabled]="batchForm.invalid || loading"
                [loading]="loading"
              ></button>
            </div>
          </form>
        </ng-template>
      </p-card>
    </div>
  `,
  styles: [
    `
      .form-group {
        margin-bottom: 1.5rem;
      }

      .form-actions {
        border-top: 1px solid #e5e7eb;
        margin-top: 2rem;
        padding-top: 1.5rem;
      }

      :host ::ng-deep .p-card-content {
        padding: 2rem;
      }

      :host ::ng-deep .p-inputtext,
      :host ::ng-deep .p-inputnumber {
        width: 100%;
      }
    `,
  ],
})
export class BatchFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);

  batchForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
  });

  isEditMode = false;
  batchId: number | null = null;
  loading = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit() {
    this.batchId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.batchId;

    if (this.isEditMode) {
      this.loadBatch();
    }
  }

  loadBatch() {
    this.loading = true;
    this.dataService.getById<Batch>('/batches', this.batchId!).subscribe({
      next: (batch) => {
        this.batchForm.patchValue(batch);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading batch:', error);
        this.errorMessage = 'Failed to load batch details';
        this.loading = false;
      },
    });
  }

  onSubmit() {
    if (this.batchForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const batchData: Partial<Batch> = this.batchForm.value;

      const apiCall = this.isEditMode
        ? this.dataService.update<Batch>('/batches', this.batchId!, batchData)
        : this.dataService.create<Batch>('/batches', batchData);

      apiCall.subscribe({
        next: (response) => {
          this.successMessage = `Batch ${this.isEditMode ? 'updated' : 'created'} successfully`;
          this.loading = false;

          setTimeout(() => {
            this.router.navigate(['/apps/batches']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error saving batch:', error);
          this.errorMessage =
            error.error?.message ||
            `Failed to ${this.isEditMode ? 'update' : 'create'} batch`;
          this.loading = false;
        },
      });
    } else {
      this.errorMessage = 'Please fill all required fields correctly';
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.batchForm.controls).forEach((key) => {
      const control = this.batchForm.get(key);
      control?.markAsTouched();
    });
  }
}
