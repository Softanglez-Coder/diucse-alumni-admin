import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CardModule, InputTextModule, ButtonModule],
  template: `
    <div class="p-6 max-w-2xl mx-auto">
      <p-card>
        <ng-template pTemplate="header">
          <div class="flex justify-between items-center p-4">
            <h1 class="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <button pButton icon="pi pi-arrow-left" class="p-button-text" [routerLink]="['/apps/settings']" label="Back"></button>
          </div>
        </ng-template>
        <ng-template pTemplate="content">
          <div *ngIf="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{{ successMessage }}</div>
          
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Full Name *</label><input pInputText formControlName="fullName" class="w-full"></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Email *</label><input pInputText formControlName="email" type="email" class="w-full"></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label><input pInputText formControlName="phone" class="w-full"></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Position</label><input pInputText formControlName="position" class="w-full"></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Bio</label><textarea formControlName="bio" rows="4" class="w-full p-2 border border-gray-300 rounded-md"></textarea></div>
            <div class="form-actions flex justify-end space-x-4 pt-6"><button pButton type="button" label="Cancel" class="p-button-outlined" [routerLink]="['/apps/settings']"></button><button pButton type="submit" label="Update Profile" [disabled]="profileForm.invalid || loading" [loading]="loading"></button></div>
          </form>

          <div class="mt-8 pt-6 border-t border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
            <form [formGroup]="passwordForm" (ngSubmit)="onPasswordSubmit()" class="space-y-6">
              <div><label class="block text-sm font-medium text-gray-700 mb-2">Current Password *</label><input pInputText formControlName="currentPassword" type="password" class="w-full"></div>
              <div><label class="block text-sm font-medium text-gray-700 mb-2">New Password *</label><input pInputText formControlName="newPassword" type="password" class="w-full"></div>
              <div><label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password *</label><input pInputText formControlName="confirmPassword" type="password" class="w-full"></div>
              <div class="form-actions flex justify-end"><button pButton type="submit" label="Change Password" class="p-button-outlined" [disabled]="passwordForm.invalid || passwordLoading" [loading]="passwordLoading"></button></div>
            </form>
          </div>
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
export class ProfileSettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  profileForm: FormGroup = this.fb.group({
    fullName: ['Admin User', [Validators.required]],
    email: ['admin@diucse-alumni.org', [Validators.required, Validators.email]],
    phone: ['+1-555-0123'],
    position: ['System Administrator'],
    bio: ['System administrator for the Alumni Admin Dashboard']
  });

  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  });

  loading = false;
  passwordLoading = false;
  successMessage = '';

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    // Load current profile - in real app, this would come from API
    setTimeout(() => {
      // Profile data is already set in form initialization
    }, 100);
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.loading = true;
      setTimeout(() => {
        this.successMessage = 'Profile updated successfully';
        this.loading = false;
        setTimeout(() => this.successMessage = '', 3000);
      }, 1000);
    }
  }

  onPasswordSubmit() {
    if (this.passwordForm.valid) {
      const newPassword = this.passwordForm.get('newPassword')?.value;
      const confirmPassword = this.passwordForm.get('confirmPassword')?.value;
      
      if (newPassword !== confirmPassword) {
        this.successMessage = 'Passwords do not match';
        return;
      }

      this.passwordLoading = true;
      setTimeout(() => {
        this.successMessage = 'Password changed successfully';
        this.passwordLoading = false;
        this.passwordForm.reset();
        setTimeout(() => this.successMessage = '', 3000);
      }, 1000);
    }
  }
}
