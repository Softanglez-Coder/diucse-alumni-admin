import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { EventService, Event } from './event.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="p-6 max-w-4xl mx-auto" *ngIf="event">
      <div class="mb-6">
        <button pButton
                icon="pi pi-arrow-left"
                label="Back to Events"
                class="p-button-outlined"
                [routerLink]="['/apps/events']">
        </button>
      </div>

      <p-card>
        <ng-template pTemplate="header">
          <div class="flex justify-between items-start p-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ event.title }}</h1>
              <div class="flex gap-2 mb-4">
                <p-tag
                  [value]="getPublishStatus()"
                  [severity]="getPublishSeverity()">
                </p-tag>
                <p-tag
                  [value]="getRegistrationStatus()"
                  [severity]="getRegistrationSeverity()">
                </p-tag>
                <p-tag
                  *ngIf="event.memberOnly"
                  value="Members Only"
                  severity="info">
                </p-tag>
              </div>
            </div>
            <div class="flex gap-2">
              <button pButton
                      icon="pi pi-pencil"
                      label="Edit"
                      [routerLink]="['/apps/events', event._id, 'edit']">
              </button>
              <button pButton
                      icon="pi pi-trash"
                      label="Delete"
                      class="p-button-danger"
                      (click)="deleteEvent()">
              </button>
            </div>
          </div>
        </ng-template>

        <ng-template pTemplate="content">
          <!-- Banner Image -->
          <div *ngIf="event.banner" class="mb-6">
            <img [src]="event.banner"
                 [alt]="event.title"
                 class="w-full h-64 object-cover rounded-lg">
          </div>

          <!-- Event Details Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- Basic Information -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Event Information</h3>

              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Start Date & Time</label>
                  <p class="text-gray-900">{{ event.start | date:'full' }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">End Date & Time</label>
                  <p class="text-gray-900">{{ event.end | date:'full' }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Registration Fee</label>
                  <p class="text-gray-900 text-xl font-semibold">
                    {{ event.fee | currency:'BDT':'symbol':'1.0-0' }}
                  </p>
                </div>

                <div *ngIf="event.capacity">
                  <label class="block text-sm font-medium text-gray-700">Capacity</label>
                  <p class="text-gray-900">{{ event.capacity }} participants</p>
                </div>
              </div>
            </div>

            <!-- Location Information -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Location</h3>

              <div class="space-y-3">
                <div *ngIf="event.location">
                  <label class="block text-sm font-medium text-gray-700">Venue</label>
                  <p class="text-gray-900">{{ event.location }}</p>
                </div>

                <div *ngIf="event.mapLocation">
                  <label class="block text-sm font-medium text-gray-700">Map</label>
                  <a [href]="event.mapLocation"
                     target="_blank"
                     class="text-blue-600 hover:text-blue-800 underline">
                    View on Map <i class="pi pi-external-link ml-1"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div *ngIf="event.description" class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Description</h3>
            <div class="prose max-w-none">
              <p class="text-gray-700 leading-relaxed">{{ event.description }}</p>
            </div>
          </div>

          <!-- Registration Status -->
          <div *ngIf="!event.open && event.justificationOfClosing" class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Registration Closed</h3>
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p class="text-yellow-800">
                <i class="pi pi-info-circle mr-2"></i>
                {{ event.justificationOfClosing }}
              </p>
            </div>
          </div>

          <!-- Metadata -->
          <div class="border-t pt-6 mt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Event Metadata</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span class="font-medium">Created:</span> {{ event.createdAt | date:'medium' }}
              </div>
              <div>
                <span class="font-medium">Last Updated:</span> {{ event.updatedAt | date:'medium' }}
              </div>
              <div>
                <span class="font-medium">Event ID:</span> {{ event._id }}
              </div>
              <div>
                <span class="font-medium">Published:</span>
                <span [class]="event.published ? 'text-green-600' : 'text-red-600'">
                  {{ event.published ? 'Yes' : 'No' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="border-t pt-6 mt-6">
            <div class="flex flex-wrap gap-2">
              <button pButton
                      [label]="event.published ? 'Unpublish Event' : 'Publish Event'"
                      [icon]="event.published ? 'pi pi-eye-slash' : 'pi pi-eye'"
                      [class]="event.published ? 'p-button-warning' : 'p-button-success'"
                      (click)="togglePublishStatus()">
              </button>

              <button pButton
                      [label]="event.open ? 'Close Registration' : 'Open Registration'"
                      [icon]="event.open ? 'pi pi-lock' : 'pi pi-unlock'"
                      [class]="event.open ? 'p-button-warning' : 'p-button-success'"
                      (click)="toggleRegistrationStatus()">
              </button>

              <button pButton
                      label="Duplicate Event"
                      icon="pi pi-copy"
                      class="p-button-outlined"
                      (click)="duplicateEvent()">
              </button>
            </div>
          </div>
        </ng-template>
      </p-card>

      <!-- Toast Messages -->
      <p-toast></p-toast>

      <!-- Confirmation Dialog -->
      <p-confirmDialog></p-confirmDialog>
    </div>

    <!-- Loading State -->
    <div *ngIf="!event && loading" class="p-6 text-center">
      <i class="pi pi-spinner pi-spin text-2xl"></i>
      <p class="mt-2 text-gray-600">Loading event details...</p>
    </div>

    <!-- Not Found State -->
    <div *ngIf="!event && !loading" class="p-6 text-center">
      <i class="pi pi-exclamation-triangle text-4xl text-gray-400 mb-4"></i>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">Event Not Found</h2>
      <p class="text-gray-600 mb-4">The event you're looking for doesn't exist or has been removed.</p>
      <button pButton
              label="Back to Events"
              icon="pi pi-arrow-left"
              [routerLink]="['/apps/events']">
      </button>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-card-content {
      padding: 2rem;
    }

    .prose p {
      margin-bottom: 1rem;
      line-height: 1.7;
    }
  `]
})
export class EventDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventService = inject(EventService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  event: Event | null = null;
  loading = true;
  eventId: string | null = null;

  ngOnInit() {
    this.eventId = this.route.snapshot.params['id'];
    if (this.eventId) {
      this.loadEvent();
    }
  }

  loadEvent() {
    if (!this.eventId) return;

    this.loading = true;
    this.eventService.getEventById(this.eventId).subscribe({
      next: (event) => {
        this.event = event;
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

  getPublishStatus(): string {
    return this.event?.published ? 'Published' : 'Draft';
  }

  getPublishSeverity(): string {
    return this.event?.published ? 'success' : 'warning';
  }

  getRegistrationStatus(): string {
    if (this.event?.open === undefined || this.event?.open === null) return 'N/A';
    return this.event.open ? 'Registration Open' : 'Registration Closed';
  }

  getRegistrationSeverity(): string {
    if (this.event?.open === undefined || this.event?.open === null) return 'secondary';
    return this.event.open ? 'success' : 'danger';
  }

  togglePublishStatus() {
    if (!this.event) return;

    if (this.event.published) {
      // Ask for justification before unpublishing
      this.confirmationService.confirm({
        message: 'Are you sure you want to unpublish this event? Please provide a reason.',
        header: 'Unpublish Event',
        icon: 'pi pi-question-circle',
        accept: () => {
          // In a real implementation, you'd show a dialog to get justification
          const justification = prompt('Please provide a reason for unpublishing:');
          if (justification) {
            this.unpublishEvent(justification);
          }
        }
      });
    } else {
      this.publishEvent();
    }
  }

  toggleRegistrationStatus() {
    if (!this.event) return;

    if (this.event.open) {
      // Ask for justification before closing registration
      this.confirmationService.confirm({
        message: 'Are you sure you want to close registration for this event? Please provide a reason.',
        header: 'Close Registration',
        icon: 'pi pi-question-circle',
        accept: () => {
          // In a real implementation, you'd show a dialog to get justification
          const justification = prompt('Please provide a reason for closing registration:');
          if (justification) {
            this.closeRegistration(justification);
          }
        }
      });
    } else {
      this.openRegistration();
    }
  }

  private publishEvent() {
    if (!this.event) return;

    this.eventService.publishEvent(this.event._id).subscribe({
      next: (event) => {
        this.event = event;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Event published successfully'
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to publish event'
        });
      }
    });
  }

  private unpublishEvent(justification: string) {
    if (!this.event) return;

    this.eventService.unpublishEvent(this.event._id, justification).subscribe({
      next: (event) => {
        this.event = event;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Event unpublished successfully'
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to unpublish event'
        });
      }
    });
  }

  private openRegistration() {
    if (!this.event) return;

    this.eventService.openEventRegistration(this.event._id).subscribe({
      next: (event) => {
        this.event = event;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Registration opened successfully'
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to open registration'
        });
      }
    });
  }

  private closeRegistration(justification: string) {
    if (!this.event) return;

    this.eventService.closeEventRegistration(this.event._id, justification).subscribe({
      next: (event) => {
        this.event = event;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Registration closed successfully'
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to close registration'
        });
      }
    });
  }

  deleteEvent() {
    if (!this.event) return;

    this.confirmationService.confirm({
      message: `Are you sure you want to delete the event "${this.event.title}"? This action cannot be undone.`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.eventService.deleteEvent(this.event!._id).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Event deleted successfully'
            });
            setTimeout(() => {
              this.router.navigate(['/apps/events']);
            }, 2000);
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete event'
            });
          }
        });
      }
    });
  }

  duplicateEvent() {
    if (!this.event) return;

    // Navigate to create form with pre-filled data
    this.router.navigate(['/apps/events/new'], {
      queryParams: { duplicate: this.event._id }
    });
  }
}
