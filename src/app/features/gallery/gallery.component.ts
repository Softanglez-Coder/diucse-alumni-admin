import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Gallery, GalleryService, GalleryCategory, CreateGalleryDto } from './gallery.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
    CardModule,
    ToolbarModule,
    TooltipModule,
    DialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="gallery-container">
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <p-card>
        <ng-template pTemplate="header">
          <p-toolbar>
            <ng-template pTemplate="left">
              <h2 class="m-0">Gallery Management</h2>
            </ng-template>
            <ng-template pTemplate="right">
              <div class="flex align-items-center gap-2">
                <span class="p-input-icon-left">
                  <i class="pi pi-search"></i>
                  <input
                    pInputText
                    type="text"
                    placeholder="Search galleries..."
                    [(ngModel)]="searchQuery"
                    (input)="onSearch()"
                    class="p-inputtext-sm"
                  />
                </span>
                <button
                  pButton
                  label="New Gallery"
                  icon="pi pi-plus"
                  class="p-button-success"
                  (click)="showCreateDialog()"
                ></button>
              </div>
            </ng-template>
          </p-toolbar>
        </ng-template>

        <p-table
          [value]="filteredGalleries"
          [loading]="loading"
          [paginator]="true"
          [rows]="10"
          [rowsPerPageOptions]="[10, 25, 50]"
          [globalFilterFields]="['title', 'description', 'category']"
          responsiveLayout="scroll"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="title">
                Title <p-sortIcon field="title"></p-sortIcon>
              </th>
              <th pSortableColumn="category">
                Category <p-sortIcon field="category"></p-sortIcon>
              </th>
              <th>Images</th>
              <th pSortableColumn="date">
                Date <p-sortIcon field="date"></p-sortIcon>
              </th>
              <th pSortableColumn="isPublished">
                Status <p-sortIcon field="isPublished"></p-sortIcon>
              </th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-gallery>
            <tr>
              <td>
                <div class="font-medium">{{ gallery.title }}</div>
                <div class="text-sm text-gray-500">
                  {{ gallery.description | slice: 0:50
                  }}{{ gallery.description && gallery.description.length > 50 ? '...' : '' }}
                </div>
              </td>
              <td>
                <p-tag
                  [value]="gallery.category"
                  severity="info"
                ></p-tag>
              </td>
              <td>
                <span class="font-medium">{{ gallery.images?.length || 0 }}</span>
                <i class="pi pi-images ml-2"></i>
              </td>
              <td>{{ gallery.date | date: 'MMM d, yyyy' }}</td>
              <td>
                <p-tag
                  [value]="gallery.isPublished ? 'Published' : 'Draft'"
                  [severity]="gallery.isPublished ? 'success' : 'warn'"
                ></p-tag>
              </td>
              <td>
                <div class="flex gap-2">
                  <button
                    pButton
                    icon="pi pi-images"
                    class="p-button-rounded p-button-info p-button-text"
                    pTooltip="Manage Images"
                    (click)="manageImages(gallery)"
                  ></button>
                  <button
                    pButton
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-warning p-button-text"
                    pTooltip="Edit"
                    (click)="editGallery(gallery)"
                  ></button>
                  <button
                    *ngIf="!gallery.isPublished"
                    pButton
                    icon="pi pi-check"
                    class="p-button-rounded p-button-success p-button-text"
                    pTooltip="Publish"
                    (click)="publishGallery(gallery)"
                  ></button>
                  <button
                    *ngIf="gallery.isPublished"
                    pButton
                    icon="pi pi-times"
                    class="p-button-rounded p-button-secondary p-button-text"
                    pTooltip="Unpublish"
                    (click)="unpublishGallery(gallery)"
                  ></button>
                  <button
                    pButton
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-danger p-button-text"
                    pTooltip="Delete"
                    (click)="deleteGallery(gallery)"
                  ></button>
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="6" class="text-center py-4">
                <div class="text-gray-500">
                  <i class="pi pi-images text-4xl mb-2"></i>
                  <p>No galleries found. Create your first gallery!</p>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>

      <!-- Create/Edit Dialog -->
      <p-dialog
        [(visible)]="displayDialog"
        [header]="editMode ? 'Edit Gallery' : 'Create Gallery'"
        [modal]="true"
        [style]="{ width: '600px' }"
        [closable]="true"
        [dismissableMask]="false"
      >
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label for="title">Title *</label>
            <input
              id="title"
              type="text"
              pInputText
              [(ngModel)]="currentGallery.title"
              placeholder="Enter gallery title"
              [class.ng-invalid]="submitted && !currentGallery.title"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="description">Description</label>
            <textarea
              id="description"
              class="p-inputtextarea"
              [(ngModel)]="currentGallery.description"
              placeholder="Enter gallery description"
              rows="3"
            ></textarea>
          </div>

          <div class="flex flex-col gap-2">
            <label for="category">Category *</label>
            <select
              id="category"
              class="p-inputtext"
              [(ngModel)]="currentGallery.category"
              [class.ng-invalid]="submitted && !currentGallery.category"
            >
              <option value="">Select a category</option>
              @for (cat of categoryOptions; track cat.value) {
                <option [value]="cat.value">{{ cat.label }}</option>
              }
            </select>
          </div>

          <div class="flex flex-col gap-2">
            <label for="date">Date *</label>
            <input
              id="date"
              type="date"
              pInputText
              [(ngModel)]="currentGallery.dateString"
              [class.ng-invalid]="submitted && !currentGallery.dateString"
            />
          </div>

          <div class="flex gap-4">
            <div class="flex flex-col gap-2 flex-1">
              <label for="order">Display Order</label>
              <input
                id="order"
                type="number"
                min="0"
                pInputText
                [(ngModel)]="currentGallery.order"
              />
            </div>

            <div class="flex flex-col gap-2 flex-1">
              <label for="published">Published</label>
              <input
                id="published"
                type="checkbox"
                [(ngModel)]="currentGallery.isPublished"
              />
            </div>
          </div>
        </div>

        <ng-template pTemplate="footer">
          <button
            pButton
            label="Cancel"
            icon="pi pi-times"
            class="p-button-text"
            (click)="hideDialog()"
          ></button>
          <button
            pButton
            [label]="editMode ? 'Update' : 'Create'"
            icon="pi pi-check"
            (click)="saveGallery()"
            [loading]="saving"
          ></button>
        </ng-template>
      </p-dialog>

      <!-- Image Management Dialog -->
      <p-dialog
        [(visible)]="displayImageDialog"
        [header]="'Manage Images - ' + selectedGallery?.title"
        [modal]="true"
        [style]="{ width: '900px', maxHeight: '90vh' }"
        [closable]="true"
      >
        <div class="flex flex-col gap-4">
          <!-- Upload Section -->
          <div class="bg-gray-50 p-4 rounded border-2 border-dashed border-gray-300">
            <h3 class="font-semibold mb-3 flex items-center gap-2">
              <i class="pi pi-cloud-upload"></i>
              Upload Images
            </h3>
            
            <div class="flex flex-col gap-3">
              <!-- File Input -->
              <div class="flex gap-2">
                <input
                  #fileInput
                  type="file"
                  accept="image/*"
                  multiple
                  (change)="onFilesSelected($event)"
                  class="hidden"
                />
                <button
                  pButton
                  label="Choose Files"
                  icon="pi pi-folder-open"
                  class="p-button-outlined"
                  (click)="fileInput.click()"
                ></button>
                <button
                  pButton
                  label="Upload Selected"
                  icon="pi pi-upload"
                  class="p-button-success"
                  (click)="uploadSelectedFiles()"
                  [disabled]="selectedFiles.length === 0"
                  [loading]="uploading"
                ></button>
                <span *ngIf="selectedFiles.length > 0" class="flex items-center text-sm text-gray-600">
                  {{ selectedFiles.length }} file(s) selected
                </span>
              </div>

              <!-- File Preview -->
              <div *ngIf="selectedFiles.length > 0" class="grid grid-cols-4 gap-2">
                <div
                  *ngFor="let file of selectedFiles; let i = index; trackBy: trackByIndex"
                  class="relative border rounded p-1 bg-white"
                >
                  <img
                    [src]="getFilePreview(file)"
                    [alt]="file.name"
                    class="w-full h-20 object-cover rounded"
                  />
                  <button
                    pButton
                    icon="pi pi-times"
                    class="p-button-rounded p-button-danger p-button-text p-button-sm absolute -top-2 -right-2"
                    (click)="removeSelectedFile(i)"
                  ></button>
                  <p class="text-xs truncate mt-1">{{ file.name }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- OR Divider -->
          <div class="flex items-center gap-3">
            <div class="flex-1 border-t"></div>
            <span class="text-sm text-gray-500 font-medium">OR</span>
            <div class="flex-1 border-t"></div>
          </div>

          <!-- URL Input Section -->
          <div class="flex gap-2">
            <input
              type="text"
              pInputText
              [(ngModel)]="newImageUrl"
              placeholder="Enter image URL"
              class="flex-1"
            />
            <button
              pButton
              label="Add from URL"
              icon="pi pi-link"
              (click)="addImageToGallery()"
              [disabled]="!newImageUrl"
            ></button>
          </div>

          <!-- Image Grid -->
          <div class="border-t pt-4">
            <h3 class="font-semibold mb-3">Gallery Images ({{ selectedGallery?.images?.length || 0 }})</h3>
            <div class="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              <div
                *ngFor="let image of selectedGallery?.images; trackBy: trackByImageUrl"
                class="relative border rounded p-2 bg-white"
              >
                <img
                  [src]="image.thumbnail || image.url"
                  [alt]="image.caption"
                  class="w-full h-32 object-cover rounded"
                />
                <div class="mt-2">
                  <input
                    type="text"
                    pInputText
                    [(ngModel)]="image.caption"
                    placeholder="Caption"
                    class="w-full text-sm"
                  />
                </div>
                <button
                  pButton
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger p-button-sm absolute top-1 right-1"
                  (click)="removeImageFromGallery(image.url)"
                ></button>
              </div>
            </div>

            <div *ngIf="!selectedGallery?.images?.length" class="text-center py-8 text-gray-500">
              <i class="pi pi-images text-4xl mb-2"></i>
              <p>No images yet. Upload files or add images using URLs above.</p>
            </div>
          </div>
        </div>

        <ng-template pTemplate="footer">
          <button
            pButton
            label="Close"
            icon="pi pi-times"
            class="p-button-text"
            (click)="hideImageDialog()"
          ></button>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [
    `
      .gallery-container {
        padding: 1.5rem;
      }

      :host ::ng-deep {
        .p-datatable .p-datatable-thead > tr > th {
          background-color: #f9fafb;
          font-weight: 600;
        }

        .p-toolbar {
          padding: 1rem;
          border: none;
        }

        .p-card .p-card-body {
          padding: 0;
        }

        .p-card .p-card-content {
          padding: 0;
        }
      }
    `,
  ],
})
export class GalleryComponent implements OnInit {
  galleries: Gallery[] = [];
  filteredGalleries: Gallery[] = [];
  loading = false;
  searchQuery = '';

  displayDialog = false;
  displayImageDialog = false;
  editMode = false;
  submitted = false;
  saving = false;

  currentGallery: any = {};
  selectedGallery: Gallery | null = null;
  newImageUrl = '';

  // File upload properties
  selectedFiles: File[] = [];
  uploading = false;
  filePreviews: Map<File, string> = new Map();

  categoryOptions = [
    { label: 'Events', value: GalleryCategory.EVENTS },
    { label: 'Activities', value: GalleryCategory.ACTIVITIES },
    { label: 'Achievements', value: GalleryCategory.ACHIEVEMENTS },
    { label: 'General', value: GalleryCategory.GENERAL },
  ];

  constructor(
    private galleryService: GalleryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadGalleries();
  }

  loadGalleries() {
    this.loading = true;
    this.galleryService.getAllGalleries().subscribe({
      next: (galleries) => {
        this.galleries = galleries;
        this.filteredGalleries = galleries;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load galleries',
        });
        this.loading = false;
      },
    });
  }

  onSearch() {
    if (!this.searchQuery) {
      this.filteredGalleries = this.galleries;
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredGalleries = this.galleries.filter(
      (gallery) =>
        gallery.title.toLowerCase().includes(query) ||
        gallery.description?.toLowerCase().includes(query) ||
        gallery.category.toLowerCase().includes(query),
    );
  }

  showCreateDialog() {
    this.currentGallery = {
      title: '',
      description: '',
      category: GalleryCategory.GENERAL,
      dateString: new Date().toISOString().split('T')[0],
      isPublished: false,
      order: 0,
    };
    this.editMode = false;
    this.submitted = false;
    this.displayDialog = true;
  }

  editGallery(gallery: Gallery) {
    this.currentGallery = {
      ...gallery,
      dateString: gallery.date.split('T')[0],
    };
    this.editMode = true;
    this.submitted = false;
    this.displayDialog = true;
  }

  saveGallery() {
    this.submitted = true;

    if (!this.currentGallery.title || !this.currentGallery.category) {
      return;
    }

    this.saving = true;

    const galleryData: CreateGalleryDto = {
      title: this.currentGallery.title,
      description: this.currentGallery.description,
      category: this.currentGallery.category,
      date: this.currentGallery.dateString,
      isPublished: this.currentGallery.isPublished,
      order: this.currentGallery.order || 0,
    };

    const operation = this.editMode
      ? this.galleryService.updateGallery(this.currentGallery._id, galleryData)
      : this.galleryService.createGallery(galleryData);

    operation.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Gallery ${this.editMode ? 'updated' : 'created'} successfully`,
        });
        this.hideDialog();
        this.loadGalleries();
        this.saving = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to ${this.editMode ? 'update' : 'create'} gallery`,
        });
        this.saving = false;
      },
    });
  }

  hideDialog() {
    this.displayDialog = false;
    this.currentGallery = {};
    this.submitted = false;
  }

  manageImages(gallery: Gallery) {
    this.selectedGallery = gallery;
    this.newImageUrl = '';
    this.displayImageDialog = true;
  }

  hideImageDialog() {
    this.displayImageDialog = false;
    this.selectedGallery = null;
    this.loadGalleries();
  }

  addImageToGallery() {
    if (!this.selectedGallery || !this.newImageUrl) return;

    this.galleryService
      .addImages(this.selectedGallery._id, [{ url: this.newImageUrl }])
      .subscribe({
        next: (updatedGallery) => {
          this.selectedGallery = updatedGallery;
          this.newImageUrl = '';
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Image added successfully',
          });
          this.loadGalleries();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add image',
          });
        },
      });
  }

  removeImageFromGallery(imageUrl: string) {
    if (!this.selectedGallery) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this image?',
      accept: () => {
        this.galleryService
          .removeImage(this.selectedGallery!._id, imageUrl)
          .subscribe({
            next: (updatedGallery) => {
              this.selectedGallery = updatedGallery;
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Image removed successfully',
              });
              this.loadGalleries();
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to remove image',
              });
            },
          });
      },
    });
  }

  publishGallery(gallery: Gallery) {
    this.galleryService.publishGallery(gallery._id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Gallery published successfully',
        });
        this.loadGalleries();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to publish gallery',
        });
      },
    });
  }

  unpublishGallery(gallery: Gallery) {
    this.galleryService.unpublishGallery(gallery._id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Gallery unpublished successfully',
        });
        this.loadGalleries();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to unpublish gallery',
        });
      },
    });
  }

  deleteGallery(gallery: Gallery) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this gallery?',
      accept: () => {
        this.galleryService.deleteGallery(gallery._id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Gallery deleted successfully',
            });
            this.loadGalleries();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete gallery',
            });
          },
        });
      },
    });
  }

  getCategorySeverity(category: string): string {
    const severityMap: { [key: string]: string } = {
      events: 'info',
      activities: 'success',
      achievements: 'warning',
      general: 'secondary',
    };
    return severityMap[category] || 'secondary';
  }

  // File upload methods
  onFilesSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files) as File[];
      
      // Validate file types
      const validFiles = fileArray.filter(file => file.type.startsWith('image/'));
      
      if (validFiles.length !== fileArray.length) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Only image files are allowed',
        });
      }

      // Add valid files
      this.selectedFiles.push(...validFiles);

      // Generate previews
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.filePreviews.set(file, e.target.result);
        };
        reader.readAsDataURL(file);
      });

      // Reset input
      event.target.value = '';
    }
  }

  removeSelectedFile(index: number) {
    const file = this.selectedFiles[index];
    this.selectedFiles.splice(index, 1);
    this.filePreviews.delete(file);
  }

  getFilePreview(file: File): string {
    return this.filePreviews.get(file) || '';
  }

  // TrackBy functions for change detection optimization
  trackByIndex(index: number): number {
    return index;
  }

  trackByImageUrl(index: number, image: any): string {
    return image.url;
  }

  uploadSelectedFiles() {
    if (!this.selectedGallery || this.selectedFiles.length === 0) {
      return;
    }

    this.uploading = true;
    this.galleryService
      .uploadImages(this.selectedGallery._id, this.selectedFiles)
      .subscribe({
        next: (updatedGallery) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `${this.selectedFiles.length} image(s) uploaded successfully`,
          });
          
          // Update the selected gallery
          this.selectedGallery = updatedGallery;
          
          // Clear selected files
          this.selectedFiles = [];
          this.filePreviews.clear();
          
          // Reload galleries
          this.loadGalleries();
          this.uploading = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to upload images',
          });
          this.uploading = false;
        },
      });
  }
}
