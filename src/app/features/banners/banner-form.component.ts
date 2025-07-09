import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';

export interface Banner {
  id?: number;
  title: string;
  imageUrl: string;
  link: string;
  isActive: boolean;
  position: number;
}

@Component({
  selector: 'app-banner-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule,
    InputNumberModule
  ],
  template: `
    <div class="p-6 max-w-2xl mx-auto">
      <p-card>
        <ng-template pTemplate="header">
          <div class="flex justify-between items-center p-4">
            <h1 class="text-2xl font-bold text-gray-900">
              {{ isEditMode ? 'Edit Banner' : 'Create Banner' }}
            </h1>
            <button 
              pButton 
              icon="pi pi-arrow-left" 
              class="p-button-text"
              [routerLink]="['/apps/banners']"
              label="Back to List">
            </button>
          </div>
        </ng-template>

        <ng-template pTemplate="content">
          <div *ngIf="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {{ successMessage }}
          </div>
          
          <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ errorMessage }}
          </div>

          <form [formGroup]="bannerForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="form-group">
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input 
                pInputText 
                id="title"
                formControlName="title"
                placeholder="Enter banner title"
                class="w-full"
                [class.ng-invalid]="bannerForm.get('title')?.invalid && bannerForm.get('title')?.touched">
              <div *ngIf="bannerForm.get('title')?.invalid && bannerForm.get('title')?.touched" 
                   class="text-red-600 text-sm mt-1">
                <div *ngIf="bannerForm.get('title')?.errors?.['required']">Title is required</div>
                <div *ngIf="bannerForm.get('title')?.errors?.['minlength']">Title must be at least 3 characters</div>
              </div>
            </div>

            <div class="form-group">
              <label for="imageUrl" class="block text-sm font-medium text-gray-700 mb-2">
                Image URL *
              </label>
              <input 
                pInputText 
                id="imageUrl"
                formControlName="imageUrl"
                placeholder="Enter image URL"
                class="w-full"
                [class.ng-invalid]="bannerForm.get('imageUrl')?.invalid && bannerForm.get('imageUrl')?.touched">
              <div *ngIf="bannerForm.get('imageUrl')?.invalid && bannerForm.get('imageUrl')?.touched" 
                   class="text-red-600 text-sm mt-1">
                <div *ngIf="bannerForm.get('imageUrl')?.errors?.['required']">Image URL is required</div>
                <div *ngIf="bannerForm.get('imageUrl')?.errors?.['pattern']">Please enter a valid URL</div>
              </div>
            </div>

            <div class="form-group">
              <label for="link" class="block text-sm font-medium text-gray-700 mb-2">
                Link *
              </label>
              <input 
                pInputText 
                id="link"
                formControlName="link"
                placeholder="Enter link URL"
                class="w-full"
                [class.ng-invalid]="bannerForm.get('link')?.invalid && bannerForm.get('link')?.touched">
              <div *ngIf="bannerForm.get('link')?.invalid && bannerForm.get('link')?.touched" 
                   class="text-red-600 text-sm mt-1">
                <div *ngIf="bannerForm.get('link')?.errors?.['required']">Link is required</div>
              </div>
            </div>

            <div class="form-group">
              <label for="position" class="block text-sm font-medium text-gray-700 mb-2">
                Position *
              </label>
              <p-inputNumber 
                id="position"
                formControlName="position"
                placeholder="Enter position"
                [min]="1"
                [max]="100"
                class="w-full">
              </p-inputNumber>
              <div *ngIf="bannerForm.get('position')?.invalid && bannerForm.get('position')?.touched" 
                   class="text-red-600 text-sm mt-1">
                <div *ngIf="bannerForm.get('position')?.errors?.['required']">Position is required</div>
                <div *ngIf="bannerForm.get('position')?.errors?.['min']">Position must be at least 1</div>
              </div>
            </div>

            <div class="form-group">
              <label for="isActive" class="block text-sm font-medium text-gray-700 mb-2">
                Active Status
              </label>
              <div class="flex items-center">
                <input 
                  type="checkbox"
                  id="isActive"
                  formControlName="isActive"
                  class="mr-2">
                <label for="isActive" class="text-sm text-gray-600">
                  {{ bannerForm.get('isActive')?.value ? 'Active' : 'Inactive' }}
                </label>
              </div>
            </div>

            <div class="form-actions flex justify-end space-x-4 pt-6">
              <button 
                pButton 
                type="button"
                label="Cancel"
                class="p-button-outlined"
                [routerLink]="['/apps/banners']">
              </button>
              <button 
                pButton 
                type="submit"
                [label]="isEditMode ? 'Update' : 'Create'"
                [disabled]="bannerForm.invalid || loading"
                [loading]="loading">
              </button>
            </div>
          </form>
        </ng-template>
      </p-card>
    </div>
  `,
  styles: [`
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

    :host ::ng-deep .p-inputtext.ng-invalid.ng-touched {
      border-color: #ef4444;
    }

    :host ::ng-deep .p-inputnumber.ng-invalid.ng-touched input {
      border-color: #ef4444;
    }
  `]
})
export class BannerFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  bannerForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    imageUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
    link: ['', [Validators.required]],
    position: [1, [Validators.required, Validators.min(1)]],
    isActive: [true]
  });

  isEditMode = false;
  bannerId: number | null = null;
  loading = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit() {
    this.bannerId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.bannerId;

    if (this.isEditMode) {
      this.loadBanner();
    }
  }

  loadBanner() {
    this.loading = true;
    // Mock data - replace with actual API call
    setTimeout(() => {
      const mockBanner: Banner = {
        id: this.bannerId!,
        title: 'Sample Banner',
        imageUrl: 'https://via.placeholder.com/800x300',
        link: '/sample-link',
        position: 1,
        isActive: true
      };

      this.bannerForm.patchValue(mockBanner);
      this.loading = false;
    }, 500);
  }

  onSubmit() {
    if (this.bannerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      const formData = this.bannerForm.value;

      // Mock API call
      setTimeout(() => {
        this.successMessage = `Banner ${this.isEditMode ? 'updated' : 'created'} successfully`;
        this.loading = false;
        
        // Navigate back to list after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/apps/banners']);
        }, 2000);
      }, 1000);
    } else {
      this.errorMessage = 'Please fill all required fields correctly';
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.bannerForm.controls).forEach(key => {
      const control = this.bannerForm.get(key);
      control?.markAsTouched();
    });
  }
}
