import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-general-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CardModule, InputTextModule, ButtonModule],
  template: `
    <div class="p-6 max-w-2xl mx-auto">
      <p-card>
        <ng-template pTemplate="header">
          <div class="flex justify-between items-center p-4">
            <h1 class="text-2xl font-bold text-gray-900">General Settings</h1>
            <button pButton icon="pi pi-arrow-left" class="p-button-text" [routerLink]="['/apps/settings']" label="Back"></button>
          </div>
        </ng-template>
        <ng-template pTemplate="content">
          <div *ngIf="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{{ successMessage }}</div>
          <form [formGroup]="settingsForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Application Name *</label><input pInputText formControlName="appName" class="w-full"></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Organization Name *</label><input pInputText formControlName="orgName" class="w-full"></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Contact Email *</label><input pInputText formControlName="contactEmail" type="email" class="w-full"></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label><input pInputText formControlName="phoneNumber" class="w-full"></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Address</label><textarea formControlName="address" rows="3" class="w-full p-2 border border-gray-300 rounded-md"></textarea></div>
            <div class="form-actions flex justify-end space-x-4 pt-6"><button pButton type="button" label="Cancel" class="p-button-outlined" [routerLink]="['/apps/settings']"></button><button pButton type="submit" label="Save Settings" [disabled]="settingsForm.invalid || loading" [loading]="loading"></button></div>
          </form>
        </ng-template>
      </p-card>
    </div>
  `,
  styles: [`
    .form-actions { border-top: 1px solid #e5e7eb; margin-top: 2rem; padding-top: 1.5rem; }
    :host ::ng-deep .p-card-content { padding: 2rem; }
    :host ::ng-deep .p-inputtext { width: 100%; }
  `]
})
export class GeneralSettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  settingsForm: FormGroup = this.fb.group({
    appName: ['Alumni Admin Dashboard', [Validators.required]],
    orgName: ['DIU CSE Alumni Association', [Validators.required]],
    contactEmail: ['admin@diucse-alumni.org', [Validators.required, Validators.email]],
    phoneNumber: ['+1-555-0123'],
    address: ['123 University Ave, City, State 12345']
  });

  loading = false;
  successMessage = '';

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    // Load current settings - in real app, this would come from API
    setTimeout(() => {
      // Settings are already set in form initialization
    }, 100);
  }

  onSubmit() {
    if (this.settingsForm.valid) {
      this.loading = true;
      setTimeout(() => {
        this.successMessage = 'Settings updated successfully';
        this.loading = false;
        setTimeout(() => this.successMessage = '', 3000);
      }, 1000);
    }
  }
}
