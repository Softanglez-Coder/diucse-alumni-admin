import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { EventService, Event } from './event.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    ToolbarModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="p-6">
      <p-card>
        <ng-template pTemplate="header">
          <p-toolbar styleClass="mb-4 gap-2">
            <ng-template pTemplate="left">
              <h1 class="text-2xl font-bold text-gray-900">Events Management</h1>
            </ng-template>
            <ng-template pTemplate="right">
              <div class="flex gap-2">
                <select
                  [(ngModel)]="selectedFilter"
                  (change)="onFilterChange()"
                  class="p-2 border border-gray-300 rounded-md">
                  <option value="all">All Events</option>
                  <option value="published">Published</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
                <button pButton
                        type="button"
                        label="New Event"
                        icon="pi pi-plus"
                        [routerLink]="['/apps/events/new']">
                </button>
              </div>
            </ng-template>
          </p-toolbar>
        </ng-template>

        <ng-template pTemplate="content">
          <!-- Search Bar -->
          <div class="mb-4">
            <span class="p-input-icon-left w-full">
              <i class="pi pi-search"></i>
              <input pInputText
                     type="text"
                     [(ngModel)]="globalFilter"
                     (input)="dt.filterGlobal(globalFilter, 'contains')"
                     placeholder="Search events..."
                     class="w-full">
            </span>
          </div>

          <!-- Events Table -->
          <p-table #dt
                   [value]="events"
                   [loading]="loading"
                   [paginator]="true"
                   [rows]="10"
                   [rowsPerPageOptions]="[10, 25, 50]"
                   [globalFilterFields]="['title', 'location', 'description']"
                   responsiveLayout="scroll"
                   styleClass="p-datatable-striped">

            <ng-template pTemplate="header">
              <tr>
                <th pSortableColumn="title">
                  Title <p-sortIcon field="title"></p-sortIcon>
                </th>
                <th pSortableColumn="location">
                  Location <p-sortIcon field="location"></p-sortIcon>
                </th>
                <th pSortableColumn="start">
                  Start Date <p-sortIcon field="start"></p-sortIcon>
                </th>
                <th pSortableColumn="end">
                  End Date <p-sortIcon field="end"></p-sortIcon>
                </th>
                <th pSortableColumn="fee">
                  Fee <p-sortIcon field="fee"></p-sortIcon>
                </th>
                <th>Status</th>
                <th>Registration</th>
                <th>Actions</th>
              </tr>
            </ng-template>

            <ng-template pTemplate="body" let-event>
              <tr>
                <td>
                  <div class="font-medium">{{ event.title }}</div>
                  <div class="text-sm text-gray-500" *ngIf="event.description">
                    {{ event.description | slice:0:50 }}{{ event.description?.length > 50 ? '...' : '' }}
                  </div>
                </td>
                <td>{{ event.location || 'N/A' }}</td>
                <td>{{ event.start | date:'medium' }}</td>
                <td>{{ event.end | date:'medium' }}</td>
                <td>{{ event.fee | currency:'BDT':'symbol':'1.0-0' }}</td>
                <td>
                  <p-tag
                    [value]="getPublishStatus(event)"
                    [severity]="getPublishSeverity(event)">
                  </p-tag>
                  <p-tag
                    *ngIf="event.memberOnly"
                    value="Members Only"
                    severity="info"
                    class="ml-1">
                  </p-tag>
                </td>
                <td>
                  <p-tag
                    [value]="getRegistrationStatus(event)"
                    [severity]="getRegistrationSeverity(event)">
                  </p-tag>
                  <div *ngIf="event.capacity" class="text-xs text-gray-500 mt-1">
                    Capacity: {{ event.capacity }}
                  </div>
                </td>
                <td>
                  <div class="flex gap-1">
                    <!-- View Event -->
                    <button pButton
                            type="button"
                            icon="pi pi-eye"
                            class="p-button-rounded p-button-text p-button-sm"
                            pTooltip="View Event"
                            [routerLink]="['/apps/events', event._id]">
                    </button>

                    <!-- Edit Event -->
                    <button pButton
                            type="button"
                            icon="pi pi-pencil"
                            class="p-button-rounded p-button-text p-button-sm"
                            pTooltip="Edit Event"
                            [routerLink]="['/apps/events', event._id, 'edit']">
                    </button>

                    <!-- Publish/Unpublish -->
                    <button pButton
                            type="button"
                            [icon]="event.published ? 'pi pi-eye-slash' : 'pi pi-eye'"
                            class="p-button-rounded p-button-text p-button-sm"
                            [pTooltip]="event.published ? 'Unpublish Event' : 'Publish Event'"
                            (click)="togglePublishStatus(event)">
                    </button>

                    <!-- Open/Close Registration -->
                    <button pButton
                            type="button"
                            [icon]="event.open ? 'pi pi-lock' : 'pi pi-unlock'"
                            class="p-button-rounded p-button-text p-button-sm"
                            [pTooltip]="event.open ? 'Close Registration' : 'Open Registration'"
                            (click)="toggleRegistrationStatus(event)">
                    </button>

                    <!-- Delete Event -->
                    <button pButton
                            type="button"
                            icon="pi pi-trash"
                            class="p-button-rounded p-button-text p-button-sm p-button-danger"
                            pTooltip="Delete Event"
                            (click)="deleteEvent(event)">
                    </button>
                  </div>
                </td>
              </tr>
            </ng-template>

            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="8" class="text-center py-8">
                  <div class="text-gray-500">
                    <i class="pi pi-calendar text-4xl mb-4 block"></i>
                    <p>No events found</p>
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </ng-template>
      </p-card>

      <!-- Justification Dialog -->
      <p-dialog
        header="Provide Justification"
        [(visible)]="showJustificationDialog"
        [style]="{width: '450px'}"
        [modal]="true">
        <div class="mb-4">
          <label for="justification" class="block text-sm font-medium text-gray-700 mb-2">
            {{ justificationAction === 'unpublish' ? 'Reason for unpublishing' : 'Reason for closing registration' }}
          </label>
          <textarea
            id="justification"
            [(ngModel)]="justificationText"
            placeholder="Enter justification..."
            rows="4"
            class="w-full p-2 border border-gray-300 rounded-md">
          </textarea>
        </div>
        <ng-template pTemplate="footer">
          <div class="flex gap-2">
            <button pButton
                    type="button"
                    label="Cancel"
                    class="p-button-outlined"
                    (click)="showJustificationDialog = false">
            </button>
            <button pButton
                    type="button"
                    label="Confirm"
                    [disabled]="!justificationText.trim()"
                    [loading]="actionLoading"
                    (click)="confirmJustificationAction()">
            </button>
          </div>
        </ng-template>
      </p-dialog>

      <!-- Toast Messages -->
      <p-toast></p-toast>

      <!-- Confirmation Dialog -->
      <p-confirmDialog></p-confirmDialog>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-toolbar {
      border: none;
      background: transparent;
      padding: 0;
    }
    :host ::ng-deep .p-card-content {
      padding-top: 0;
    }
    :host ::ng-deep .p-tag {
      font-size: 0.75rem;
    }
  `]
})
export class EventsComponent implements OnInit {
  private eventService = inject(EventService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  events: Event[] = [];
  loading = false;
  globalFilter = '';

  selectedFilter = 'all';

  // Justification dialog
  showJustificationDialog = false;
  justificationText = '';
  justificationAction: 'unpublish' | 'closeRegistration' = 'unpublish';
  selectedEvent: Event | null = null;
  actionLoading = false;

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.loading = true;

    const loadMethod = this.getLoadMethod();
    loadMethod.subscribe({
      next: (events) => {
        // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.events = events || [];
          this.loading = false;
        });
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load events'
        });
        setTimeout(() => {
          this.events = [];
          this.loading = false;
        });
      }
    });
  }

  private getLoadMethod() {
    switch (this.selectedFilter) {
      case 'published':
        return this.eventService.getPublishedEvents();
      case 'upcoming':
        return this.eventService.getUpcomingEvents();
      case 'past':
        return this.eventService.getPastEvents();
      default:
        return this.eventService.getAllEvents();
    }
  }

  onFilterChange() {
    this.loadEvents();
  }

  getPublishStatus(event: Event): string {
    return event.published ? 'Published' : 'Draft';
  }

  getPublishSeverity(event: Event): string {
    return event.published ? 'success' : 'warning';
  }

  getRegistrationStatus(event: Event): string {
    if (event.open === undefined || event.open === null) return 'N/A';
    return event.open ? 'Open' : 'Closed';
  }

  getRegistrationSeverity(event: Event): string {
    if (event.open === undefined || event.open === null) return 'secondary';
    return event.open ? 'success' : 'danger';
  }

  togglePublishStatus(event: Event) {
    if (event.published) {
      // Show justification dialog for unpublishing
      this.selectedEvent = event;
      this.justificationAction = 'unpublish';
      this.justificationText = '';
      this.showJustificationDialog = true;
    } else {
      // Publish directly
      this.eventService.publishEvent(event._id).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Event published successfully'
          });
          this.loadEvents();
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
  }

  toggleRegistrationStatus(event: Event) {
    if (event.open) {
      // Show justification dialog for closing registration
      this.selectedEvent = event;
      this.justificationAction = 'closeRegistration';
      this.justificationText = '';
      this.showJustificationDialog = true;
    } else {
      // Open registration directly
      this.eventService.openEventRegistration(event._id).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Registration opened successfully'
          });
          this.loadEvents();
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
  }

  confirmJustificationAction() {
    if (!this.selectedEvent || !this.justificationText.trim()) return;

    this.actionLoading = true;

    const action = this.justificationAction === 'unpublish'
      ? this.eventService.unpublishEvent(this.selectedEvent._id, this.justificationText)
      : this.eventService.closeEventRegistration(this.selectedEvent._id, this.justificationText);

    action.subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Event ${this.justificationAction === 'unpublish' ? 'unpublished' : 'registration closed'} successfully`
        });
        this.showJustificationDialog = false;
        this.actionLoading = false;
        this.loadEvents();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to ${this.justificationAction === 'unpublish' ? 'unpublish event' : 'close registration'}`
        });
        this.actionLoading = false;
      }
    });
  }

  deleteEvent(event: Event) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the event "${event.title}"? This action cannot be undone.`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eventService.deleteEvent(event._id).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Event deleted successfully'
            });
            this.loadEvents();
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
}
