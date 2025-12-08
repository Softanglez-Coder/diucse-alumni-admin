import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, RippleModule],
  template: `
    <div class="access-denied-container">
      <div class="access-denied-card">
        <div class="access-denied-header">
          <i class="pi pi-lock text-6xl text-red-500 mb-4"></i>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p class="text-gray-600 mb-4">
            You don't have permission to access the admin panel.
          </p>
          <p class="text-sm text-gray-500 mb-2">
            Only users with admin roles can access this area. Your current
            roles: <strong>{{ userRoles }}</strong>
          </p>
          <p class="text-sm text-gray-500">
            If you believe this is an error, please contact the administrator.
          </p>
        </div>

        <div class="access-denied-actions">
          <button
            type="button"
            pButton
            label="Sign Out"
            icon="pi pi-sign-out"
            class="w-full mb-3"
            (click)="onLogout()"
            pRipple
          ></button>
          <button
            type="button"
            pButton
            label="Go to Main Site"
            icon="pi pi-home"
            class="w-full p-button-outlined"
            (click)="goToMainSite()"
            pRipple
          ></button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .access-denied-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1rem;
      }

      .access-denied-card {
        width: 100%;
        max-width: 500px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        padding: 3rem;
        animation: slideUp 0.5s ease-out;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .access-denied-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .access-denied-actions {
        margin-top: 2rem;
      }

      :host ::ng-deep .p-button {
        padding: 0.75rem 1rem;
      }

      @media (max-width: 640px) {
        .access-denied-card {
          padding: 2rem;
        }
      }
    `,
  ],
})
export class AccessDeniedComponent {
  userRoles = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    const user = this.authService.getCurrentUser();
    this.userRoles = user?.roles?.join(', ') || 'None';
  }

  onLogout() {
    this.authService.logout();
  }

  goToMainSite() {
    // Redirect to the main alumni website
    window.location.href = 'https://csediualumni.com';
  }
}
