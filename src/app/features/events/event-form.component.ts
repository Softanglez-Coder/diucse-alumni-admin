import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { EventService, CreateEventDto, UpdateEventDto, Event } from './event.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <p-card>
        <ng-template pTemplate="header">
          <div class="flex justify-between items-center p-4">
            <h1 class="text-2xl font-bold text-gray-900">
              {{ isEditMode ? 'Edit Event' : (isDuplicating ? 'Duplicate Event' : 'Create Event') }}
            </h1>
            <button pButton icon="pi pi-arrow-left" class="p-button-text" [routerLink]="['/apps/events']" label="Back to List"></button>
          </div>
        </ng-template>
        <ng-template pTemplate="content">
          <form [formGroup]="eventForm" (ngSubmit)="onSubmit()" class="space-y-6">

            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-group">
                <label for="title" class="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input pInputText
                       id="title"
                       formControlName="title"
                       placeholder="Enter event title"
                       class="w-full"
                       [class.ng-invalid]="eventForm.get('title')?.invalid && eventForm.get('title')?.touched">
                <div *ngIf="eventForm.get('title')?.invalid && eventForm.get('title')?.touched" class="text-red-500 text-sm mt-1">
                  Title is required (min 1, max 200 characters)
                </div>
              </div>

              <div class="form-group">
                <label for="fee" class="block text-sm font-medium text-gray-700 mb-2">Fee (BDT) *</label>
                <input type="number"
                       id="fee"
                       formControlName="fee"
                       placeholder="0"
                       min="0"
                       class="w-full p-2 border border-gray-300 rounded-md"
                       [class.border-red-500]="eventForm.get('fee')?.invalid && eventForm.get('fee')?.touched">
                <div *ngIf="eventForm.get('fee')?.invalid && eventForm.get('fee')?.touched" class="text-red-500 text-sm mt-1">
                  Fee is required and must be 0 or greater
                </div>
              </div>
            </div>

            <!-- Date and Time -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-group">
                <label for="start" class="block text-sm font-medium text-gray-700 mb-2">Start Date & Time *</label>
                <input type="datetime-local"
                       id="start"
                       formControlName="start"
                       class="w-full p-2 border border-gray-300 rounded-md"
                       [class.border-red-500]="eventForm.get('start')?.invalid && eventForm.get('start')?.touched">
                <div *ngIf="eventForm.get('start')?.invalid && eventForm.get('start')?.touched" class="text-red-500 text-sm mt-1">
                  Start date is required
                </div>
              </div>

              <div class="form-group">
                <label for="end" class="block text-sm font-medium text-gray-700 mb-2">End Date & Time *</label>
                <input type="datetime-local"
                       id="end"
                       formControlName="end"
                       class="w-full p-2 border border-gray-300 rounded-md"
                       [class.border-red-500]="eventForm.get('end')?.invalid && eventForm.get('end')?.touched">
                <div *ngIf="eventForm.get('end')?.invalid && eventForm.get('end')?.touched" class="text-red-500 text-sm mt-1">
                  End date is required
                </div>
              </div>
            </div>

            <!-- Location Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-group">
                <label for="location" class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input pInputText
                       id="location"
                       formControlName="location"
                       placeholder="Enter event location"
                       class="w-full">
              </div>

              <div class="form-group">
                <label for="mapLocation" class="block text-sm font-medium text-gray-700 mb-2">Map URL</label>
                <input pInputText
                       id="mapLocation"
                       formControlName="mapLocation"
                       placeholder="Google Maps or other map URL"
                       class="w-full"
                       [class.border-red-500]="eventForm.get('mapLocation')?.invalid && eventForm.get('mapLocation')?.touched">
                <div *ngIf="eventForm.get('mapLocation')?.invalid && eventForm.get('mapLocation')?.touched" class="text-red-500 text-sm mt-1">
                  Please enter a valid URL
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="form-group">
              <label for="description" class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea id="description"
                        formControlName="description"
                        placeholder="Enter event description"
                        rows="4"
                        class="w-full p-2 border border-gray-300 rounded-md">
              </textarea>
            </div>

            <!-- Banner and Capacity -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-group">
                <label for="banner" class="block text-sm font-medium text-gray-700 mb-2">Banner Image URL</label>
                <input pInputText
                       id="banner"
                       formControlName="banner"
                       placeholder="Banner image URL"
                       class="w-full">
              </div>

              <div class="form-group">
                <label for="capacity" class="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                <input type="number"
                       id="capacity"
                       formControlName="capacity"
                       placeholder="Maximum participants"
                       min="0"
                       class="w-full p-2 border border-gray-300 rounded-md">
              </div>
            </div>

            <!-- Settings -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="form-group">
                <p-checkbox
                  inputId="published"
                  formControlName="published"
                  binary="true"
                  label="Published">
                </p-checkbox>
              </div>

              <div class="form-group">
                <p-checkbox
                  inputId="open"
                  formControlName="open"
                  binary="true"
                  label="Registration Open">
                </p-checkbox>
              </div>

              <div class="form-group">
                <p-checkbox
                  inputId="memberOnly"
                  formControlName="memberOnly"
                  binary="true"
                  label="Members Only">
                </p-checkbox>
              </div>
            </div>

            <!-- Justification for Closing (if needed) -->
            <div class="form-group" *ngIf="!eventForm.get('open')?.value">
              <label for="justificationOfClosing" class="block text-sm font-medium text-gray-700 mb-2">
                Justification for Closing Registration
              </label>
              <textarea id="justificationOfClosing"
                        formControlName="justificationOfClosing"
                        placeholder="Reason for closing registration"
                        rows="3"
                        class="w-full p-2 border border-gray-300 rounded-md">
              </textarea>
            </div>

            <!-- Form Actions -->
            <div class="form-actions flex justify-end space-x-4 pt-6">
              <button pButton
                      type="button"
                      label="Cancel"
                      class="p-button-outlined"
                      [routerLink]="['/apps/events']">
              </button>
              <button pButton
                      type="submit"
                      [label]="isEditMode ? 'Update Event' : 'Create Event'"
                      [disabled]="eventForm.invalid || loading"
                      [loading]="loading">
              </button>
            </div>
          </form>
        </ng-template>
      </p-card>

      <!-- Toast Messages -->
      <p-toast></p-toast>
    </div>
  `,
  styles: [`
    .form-group { margin-bottom: 1.5rem; }
    .form-actions { border-top: 1px solid #e5e7eb; margin-top: 2rem; padding-top: 1.5rem; }
    :host ::ng-deep .p-card-content { padding: 2rem; }
    :host ::ng-deep .p-inputtext { width: 100%; }
    :host ::ng-deep .p-checkbox { margin-right: 0.5rem; }
  `]
})
export class EventFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);
  private messageService = inject(MessageService);

  eventForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]],
    fee: [0, [Validators.required, Validators.min(0)]],
    start: ['', [Validators.required]],
    end: ['', [Validators.required]],
    description: ['', [Validators.maxLength(1000)]],
    location: ['', [Validators.maxLength(200)]],
    mapLocation: [''],
    banner: [''],
    capacity: [null, [Validators.min(0)]],
    open: [true],
    justificationOfClosing: ['', [Validators.maxLength(500)]],
    published: [false],
    memberOnly: [false]
  });

  isEditMode = false;
  isDuplicating = false;
  eventId: string | null = null;
  loading = false;

  ngOnInit() {
    this.eventId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.eventId;

    // Check for duplicate parameter
    const duplicateId = this.route.snapshot.queryParams['duplicate'];
    this.isDuplicating = !!duplicateId;

    if (this.isEditMode) {
      this.loadEvent();
    } else if (duplicateId) {
      this.loadEventForDuplication(duplicateId);
    }

    // Add URL validator for mapLocation
    this.eventForm.get('mapLocation')?.setValidators([
      this.urlValidator
    ]);
  }  loadEvent() {
    if (!this.eventId) return;

    this.loading = true;
    this.eventService.getEventById(this.eventId).subscribe({
      next: (event) => {
        this.eventForm.patchValue({
          title: event.title,
          fee: event.fee,
          start: this.formatDateForInput(event.start),
          end: this.formatDateForInput(event.end),
          description: event.description || '',
          location: event.location || '',
          mapLocation: event.mapLocation || '',
          banner: event.banner || '',
          capacity: event.capacity || null,
          open: event.open ?? true,
          justificationOfClosing: event.justificationOfClosing || '',
          published: event.published ?? false,
          memberOnly: event.memberOnly ?? false
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading event:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load event details'
        });
        this.loading = false;
      }
    });
  }

  loadEventForDuplication(duplicateId: string) {
    this.loading = true;
    this.eventService.getEventById(duplicateId).subscribe({
      next: (event) => {
        // Pre-fill form but reset certain fields for the new event
        this.eventForm.patchValue({
          title: `Copy of ${event.title}`,
          fee: event.fee,
          start: '', // Reset dates for new event
          end: '',
          description: event.description || '',
          location: event.location || '',
          mapLocation: event.mapLocation || '',
          banner: event.banner || '',
          capacity: event.capacity || null,
          open: true, // Reset to open for new event
          justificationOfClosing: '',
          published: false, // Reset to draft for new event
          memberOnly: event.memberOnly ?? false
        });
        this.loading = false;
        this.messageService.add({
          severity: 'info',
          summary: 'Event Duplicated',
          detail: 'Event details have been pre-filled. Please update the dates and other details as needed.'
        });
      },
      error: (error) => {
        console.error('Error loading event for duplication:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load event for duplication'
        });
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.eventForm.valid) {
      this.loading = true;

      const formData = this.eventForm.value;
      const eventData: CreateEventDto | UpdateEventDto = {
        title: formData.title,
        fee: formData.fee,
        start: formData.start,
        end: formData.end,
        description: formData.description || undefined,
        location: formData.location || undefined,
        mapLocation: formData.mapLocation || undefined,
        banner: formData.banner || undefined,
        capacity: formData.capacity || undefined,
        open: formData.open,
        justificationOfClosing: formData.justificationOfClosing || undefined,
        published: formData.published,
        memberOnly: formData.memberOnly
      };

      const operation = this.isEditMode
        ? this.eventService.updateEvent(this.eventId!, eventData)
        : this.eventService.createEvent(eventData as CreateEventDto);

      operation.subscribe({
        next: (event) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Event ${this.isEditMode ? 'updated' : 'created'} successfully`
          });
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/apps/events']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error saving event:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to ${this.isEditMode ? 'update' : 'create'} event`
          });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill all required fields correctly'
      });
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.eventForm.controls).forEach(key => {
      this.eventForm.get(key)?.markAsTouched();
    });
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  }

  private urlValidator(control: any) {
    if (!control.value) return null;
    try {
      new URL(control.value);
      return null;
    } catch {
      return { invalidUrl: true };
    }
  }
}
