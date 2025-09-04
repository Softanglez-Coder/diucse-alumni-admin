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
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import {
  BannerService,
  Banner as BannerModel,
  CreateBannerDto,
} from './banner.service';

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
    InputNumberModule,
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
            [formGroup]="bannerForm"
            (ngSubmit)="onSubmit()"
            class="space-y-6"
          >
            <div class="form-group">
              <label
                for="title"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Title *
              </label>
              <input
                pInputText
                id="title"
                formControlName="title"
                placeholder="Enter banner title"
                class="w-full"
                [class.ng-invalid]="
                  bannerForm.get('title')?.invalid &&
                  bannerForm.get('title')?.touched
                "
              />
              <div
                *ngIf="
                  bannerForm.get('title')?.invalid &&
                  bannerForm.get('title')?.touched
                "
                class="text-red-600 text-sm mt-1"
              >
                <div *ngIf="bannerForm.get('title')?.errors?.['required']">
                  Title is required
                </div>
                <div *ngIf="bannerForm.get('title')?.errors?.['minlength']">
                  Title must be at least 3 characters
                </div>
              </div>
            </div>

            <div class="form-group">
              <label
                for="description"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                pInputText
                id="description"
                formControlName="description"
                placeholder="Enter banner description"
                class="w-full"
                rows="3"
              >
              </textarea>
            </div>

            <div class="form-group">
              <label
                for="image"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Image
              </label>
              <div class="space-y-2">
                <input
                  pInputText
                  id="image"
                  formControlName="image"
                  placeholder="Enter image URL"
                  class="w-full"
                  [class.ng-invalid]="
                    bannerForm.get('image')?.invalid &&
                    bannerForm.get('image')?.touched
                  "
                />

                <div *ngIf="bannerId">
                  <p-fileUpload
                    mode="basic"
                    name="file"
                    [auto]="false"
                    chooseLabel="Choose Image"
                    accept="image/*"
                    (onSelect)="onFileSelect($event)"
                    class="w-full"
                  >
                  </p-fileUpload>

                  <small class="text-gray-500">
                    Upload a new image file or enter an image URL above
                  </small>
                </div>

                <div *ngIf="!bannerId">
                  <small class="text-gray-500">
                    Save banner first to upload image file
                  </small>
                </div>
              </div>
              <div
                *ngIf="
                  bannerForm.get('image')?.invalid &&
                  bannerForm.get('image')?.touched
                "
                class="text-red-600 text-sm mt-1"
              >
                <div *ngIf="bannerForm.get('image')?.errors?.['pattern']">
                  Please enter a valid URL
                </div>
              </div>
            </div>

            <div class="form-group">
              <label
                for="link"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Link
              </label>
              <input
                pInputText
                id="link"
                formControlName="link"
                placeholder="Enter link URL"
                class="w-full"
                [class.ng-invalid]="
                  bannerForm.get('link')?.invalid &&
                  bannerForm.get('link')?.touched
                "
              />
              <div
                *ngIf="
                  bannerForm.get('link')?.invalid &&
                  bannerForm.get('link')?.touched
                "
                class="text-red-600 text-sm mt-1"
              >
                <div *ngIf="bannerForm.get('link')?.errors?.['required']">
                  Link is required
                </div>
              </div>
            </div>

            <div class="form-group">
              <label
                for="order"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Order
              </label>
              <p-inputNumber
                id="order"
                formControlName="order"
                placeholder="Enter display order"
                [min]="1"
                [max]="100"
                class="w-full"
              >
              </p-inputNumber>
              <div
                *ngIf="
                  bannerForm.get('order')?.invalid &&
                  bannerForm.get('order')?.touched
                "
                class="text-red-600 text-sm mt-1"
              >
                <div *ngIf="bannerForm.get('order')?.errors?.['min']">
                  Order must be at least 1
                </div>
              </div>
            </div>

            <div class="form-actions flex justify-end space-x-4 pt-6">
              <button
                pButton
                type="button"
                label="Cancel"
                class="p-button-outlined"
                [routerLink]="['/apps/banners']"
              ></button>
              <button
                pButton
                type="submit"
                [label]="isEditMode ? 'Update' : 'Create'"
                [disabled]="bannerForm.invalid || loading"
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

      :host ::ng-deep .p-inputtext.ng-invalid.ng-touched {
        border-color: #ef4444;
      }

      :host ::ng-deep .p-inputnumber.ng-invalid.ng-touched input {
        border-color: #ef4444;
      }
    `,
  ],
})
export class BannerFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private bannerService = inject(BannerService);

  bannerForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    image: ['', [Validators.pattern(/^https?:\/\/.+/)]],
    link: [''],
    order: [null, [Validators.min(1)]],
  });

  isEditMode = false;
  bannerId: string | null = null;
  loading = false;
  successMessage = '';
  errorMessage = '';
  selectedFile: File | null = null;

  ngOnInit() {
    this.bannerId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.bannerId;

    if (this.isEditMode) {
      this.loadBanner();
    }
  }

  loadBanner() {
    this.loading = true;
    this.bannerService.getById(this.bannerId!).subscribe({
      next: (banner: BannerModel) => {
        this.bannerForm.patchValue({
          title: banner.title,
          description: banner.description || '',
          image: banner.image || '',
          link: banner.link || '',
          order: banner.order,
        });
        this.loading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to load banner';
        this.loading = false;
        console.error('Error loading banner:', error);
      },
    });
  }

  onFileSelect(event: any) {
    this.selectedFile = event.files[0];
    // Upload immediately when file is selected
    if (this.selectedFile && this.bannerId) {
      this.uploadImage();
    }
  }

  uploadImage() {
    if (!this.selectedFile || !this.bannerId) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.bannerService.uploadImage(this.bannerId, this.selectedFile).subscribe({
      next: (response: BannerModel) => {
        this.bannerForm.patchValue({ image: response.image });
        this.successMessage = 'Image uploaded successfully';
        this.loading = false;
        this.selectedFile = null;

        // Clear the success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to upload image';
        this.loading = false;
        console.error('Error uploading image:', error);
      },
    });
  }

  onSubmit() {
    if (this.bannerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      const formData: CreateBannerDto = this.bannerForm.value;

      // Remove empty optional fields
      Object.keys(formData).forEach((key) => {
        if ((formData as any)[key] === '' || (formData as any)[key] === null) {
          delete (formData as any)[key];
        }
      });

      const request = this.isEditMode
        ? this.bannerService.update(this.bannerId!, formData)
        : this.bannerService.create(formData);

      request.subscribe({
        next: (banner: BannerModel) => {
          if (!this.isEditMode) {
            this.bannerId = banner._id!;
            this.isEditMode = true;
          }

          this.successMessage = `Banner ${this.isEditMode ? 'updated' : 'created'} successfully`;
          this.loading = false;

          // Navigate back to list after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/apps/banners']);
          }, 2000);
        },
        error: (error: any) => {
          this.errorMessage = 'Failed to save banner';
          this.loading = false;
          console.error('Error saving banner:', error);
        },
      });
    } else {
      this.errorMessage = 'Please fill all required fields correctly';
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.bannerForm.controls).forEach((key) => {
      const control = this.bannerForm.get(key);
      control?.markAsTouched();
    });
  }
}
