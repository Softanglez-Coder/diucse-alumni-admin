import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ButtonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <p-card header="General Settings">
          <ng-template pTemplate="content">
            <p class="text-gray-600 mb-4">Manage general application settings, system preferences, and configurations.</p>
            <button pButton label="Manage" icon="pi pi-cog" [routerLink]="['general']"></button>
          </ng-template>
        </p-card>

        <p-card header="Profile Settings">
          <ng-template pTemplate="content">
            <p class="text-gray-600 mb-4">Update your profile information, password, and account preferences.</p>
            <button pButton label="Edit Profile" icon="pi pi-user" [routerLink]="['profile']"></button>
          </ng-template>
        </p-card>

        <p-card header="Security">
          <ng-template pTemplate="content">
            <p class="text-gray-600 mb-4">Manage security settings, two-factor authentication, and access logs.</p>
            <button pButton label="Security Settings" icon="pi pi-shield" class="p-button-outlined" disabled></button>
          </ng-template>
        </p-card>

        <p-card header="Notifications">
          <ng-template pTemplate="content">
            <p class="text-gray-600 mb-4">Configure email notifications, alerts, and communication preferences.</p>
            <button pButton label="Notifications" icon="pi pi-bell" class="p-button-outlined" disabled></button>
          </ng-template>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-card-content {
      padding: 1.5rem;
    }
    
    :host ::ng-deep .p-card-header {
      background: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
    }
  `]
})
export class SettingsComponent {}
