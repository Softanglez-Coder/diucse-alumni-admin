import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CardModule, InputTextModule, ButtonModule],
  template: `
    <div class="p-6 max-w-2xl mx-auto">
      <p-card>
        <ng-template pTemplate="header">
          <div class="flex justify-between items-center p-4">
            <h1 class="text-2xl font-bold text-gray-900">
              {{ isEditMode ? 'Edit Event' : 'Create Event' }}
            </h1>
            <button pButton icon="pi pi-arrow-left" class="p-button-text" [routerLink]="['/apps/events']" label="Back to List"></button>
          </div>
        </ng-template>
        <ng-template pTemplate="content">
          <div *ngIf="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{{ successMessage }}</div>
          <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{{ errorMessage }}</div>
          <form [formGroup]="eventForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="form-group">
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input pInputText id="title" formControlName="title" placeholder="Enter event title" class="w-full">
            </div>
            <div class="form-group">
              <label for="location" class="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input pInputText id="location" formControlName="location" placeholder="Enter event location" class="w-full">
            </div>
            <div class="form-group">
              <label for="eventDate" class="block text-sm font-medium text-gray-700 mb-2">Event Date *</label>
              <input type="datetime-local" id="eventDate" formControlName="eventDate" class="w-full p-2 border border-gray-300 rounded-md">
            </div>
            <div class="form-group">
              <label for="organizer" class="block text-sm font-medium text-gray-700 mb-2">Organizer</label>
              <input pInputText id="organizer" formControlName="organizer" placeholder="Enter organizer name" class="w-full">
            </div>
            <div class="form-group">
              <label for="description" class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea id="description" formControlName="description" placeholder="Enter event description" rows="5" class="w-full p-2 border border-gray-300 rounded-md"></textarea>
            </div>
            <div class="form-actions flex justify-end space-x-4 pt-6">
              <button pButton type="button" label="Cancel" class="p-button-outlined" [routerLink]="['/apps/events']"></button>
              <button pButton type="submit" [label]="isEditMode ? 'Update' : 'Create'" [disabled]="eventForm.invalid || loading" [loading]="loading"></button>
            </div>
          </form>
        </ng-template>
      </p-card>
    </div>
  `,
  styles: [`
    .form-group { margin-bottom: 1.5rem; }
    .form-actions { border-top: 1px solid #e5e7eb; margin-top: 2rem; padding-top: 1.5rem; }
    :host ::ng-deep .p-card-content { padding: 2rem; }
    :host ::ng-deep .p-inputtext { width: 100%; }
  `]
})
export class EventFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  eventForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    location: ['', [Validators.required]],
    eventDate: ['', [Validators.required]],
    organizer: [''],
    description: ['']
  });

  isEditMode = false;
  eventId: number | null = null;
  loading = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit() {
    this.eventId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.eventId;
    if (this.isEditMode) this.loadEvent();
  }

  loadEvent() {
    this.loading = true;
    setTimeout(() => {
      this.eventForm.patchValue({
        title: 'Sample Event',
        location: 'Sample Location',
        eventDate: '2024-12-31T18:00',
        organizer: 'Alumni Association',
        description: 'Sample event description'
      });
      this.loading = false;
    }, 500);
  }

  onSubmit() {
    if (this.eventForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      setTimeout(() => {
        this.successMessage = `Event ${this.isEditMode ? 'updated' : 'created'} successfully`;
        this.loading = false;
        setTimeout(() => this.router.navigate(['/apps/events']), 2000);
      }, 1000);
    } else {
      this.errorMessage = 'Please fill all required fields correctly';
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.eventForm.controls).forEach(key => {
      this.eventForm.get(key)?.markAsTouched();
    });
  }
}
