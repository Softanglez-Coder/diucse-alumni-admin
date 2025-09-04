import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardModule,
    ButtonModule,
    ToastModule,
    TagModule,
    AvatarModule,
    DividerModule,
    SkeletonModule,
  ],
  providers: [MessageService],
  template: `
    <div class="user-details-container">
      <div class="page-header">
        <h1 class="page-title">User Details</h1>
        <button
          pButton
          label="Back to List"
          icon="pi pi-arrow-left"
          class="p-button-outlined"
          routerLink="/apps/users"
        ></button>
      </div>

      <div *ngIf="isLoading" class="loading-container">
        <p-card>
          <div class="profile-section">
            <p-skeleton
              shape="circle"
              size="120px"
              class="profile-avatar-skeleton"
            ></p-skeleton>
            <div class="profile-info">
              <p-skeleton width="200px" height="32px" class="mb-2"></p-skeleton>
              <p-skeleton width="150px" height="20px" class="mb-2"></p-skeleton>
              <p-skeleton width="100px" height="24px"></p-skeleton>
            </div>
          </div>
          <p-divider></p-divider>
          <div class="details-grid">
            <div *ngFor="let i of [1, 2, 3, 4, 5, 6]" class="detail-item">
              <p-skeleton width="80px" height="16px" class="mb-1"></p-skeleton>
              <p-skeleton width="120px" height="20px"></p-skeleton>
            </div>
          </div>
        </p-card>
      </div>

      <div *ngIf="!isLoading && userData" class="content-section">
        <!-- Profile Card -->
        <p-card class="profile-card">
          <div class="profile-section">
            <div class="profile-avatar">
              <p-avatar
                *ngIf="userData.photo"
                [image]="userData.photo"
                size="xlarge"
                shape="circle"
                class="user-avatar"
              >
              </p-avatar>
              <p-avatar
                *ngIf="!userData.photo"
                [label]="getInitials(userData.name)"
                size="xlarge"
                shape="circle"
                styleClass="user-avatar-initials"
              >
              </p-avatar>
            </div>
            <div class="profile-info">
              <h2 class="user-name">{{ userData.name }}</h2>
              <p class="user-email">{{ userData.email }}</p>
              <div class="user-status">
                <p-tag
                  [value]="userData.active ? 'Active' : 'Inactive'"
                  [severity]="userData.active ? 'success' : 'danger'"
                >
                </p-tag>
                <p-tag
                  [value]="
                    userData.emailVerified
                      ? 'Email Verified'
                      : 'Email Not Verified'
                  "
                  [severity]="userData.emailVerified ? 'success' : 'warning'"
                  class="ml-2"
                >
                </p-tag>
              </div>
            </div>
          </div>
        </p-card>

        <!-- Details Cards -->
        <div class="details-section">
          <!-- Personal Information -->
          <p-card header="Personal Information" class="detail-card">
            <div class="details-grid">
              <div class="detail-item">
                <label class="detail-label">Full Name</label>
                <span class="detail-value">{{
                  userData.name || 'Not provided'
                }}</span>
              </div>
              <div class="detail-item">
                <label class="detail-label">Email</label>
                <span class="detail-value">{{ userData.email }}</span>
              </div>
              <div class="detail-item">
                <label class="detail-label">Phone</label>
                <span class="detail-value">{{
                  userData.phone || 'Not provided'
                }}</span>
              </div>
              <div class="detail-item">
                <label class="detail-label">Batch</label>
                <span class="detail-value">{{
                  userData.batch?.name || 'Not assigned'
                }}</span>
              </div>
              <div class="detail-item">
                <label class="detail-label">Roles</label>
                <div class="role-tags">
                  <p-tag
                    *ngFor="let role of userData.roles"
                    [value]="role"
                    severity="info"
                    class="role-tag"
                  >
                  </p-tag>
                </div>
              </div>
              <div class="detail-item">
                <label class="detail-label">Status</label>
                <p-tag
                  [value]="userData.active ? 'Active' : 'Inactive'"
                  [severity]="userData.active ? 'success' : 'danger'"
                >
                </p-tag>
              </div>
            </div>
          </p-card>

          <!-- Professional Information -->
          <p-card header="Professional Information" class="detail-card">
            <div class="details-grid">
              <div class="detail-item">
                <label class="detail-label">Current Position</label>
                <span class="detail-value">{{
                  userData.currentPosition || 'Not provided'
                }}</span>
              </div>
              <div class="detail-item">
                <label class="detail-label">Company</label>
                <span class="detail-value">{{
                  userData.company || 'Not provided'
                }}</span>
              </div>
            </div>
          </p-card>

          <!-- Account Information -->
          <p-card header="Account Information" class="detail-card">
            <div class="details-grid">
              <div class="detail-item">
                <label class="detail-label">Email Verified</label>
                <p-tag
                  [value]="userData.emailVerified ? 'Yes' : 'No'"
                  [severity]="userData.emailVerified ? 'success' : 'warning'"
                >
                </p-tag>
              </div>
              <div class="detail-item">
                <label class="detail-label">Member Since</label>
                <span class="detail-value">{{
                  userData.createdAt | date: 'fullDate'
                }}</span>
              </div>
              <div class="detail-item">
                <label class="detail-label">Last Updated</label>
                <span class="detail-value">{{
                  userData.updatedAt | date: 'medium'
                }}</span>
              </div>
              <div class="detail-item">
                <label class="detail-label">User ID</label>
                <span class="detail-value user-id">{{ userData._id }}</span>
              </div>
            </div>
          </p-card>
        </div>
      </div>

      <div *ngIf="!isLoading && !userData" class="empty-state">
        <p-card>
          <div class="text-center">
            <i class="pi pi-user text-6xl text-gray-400 mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">
              User Not Found
            </h3>
            <p class="text-gray-500 mb-4">
              The requested user could not be found.
            </p>
            <button
              pButton
              label="Back to Users"
              icon="pi pi-arrow-left"
              routerLink="/apps/users"
            ></button>
          </div>
        </p-card>
      </div>
    </div>

    <p-toast></p-toast>
  `,
  styles: [
    `
      .user-details-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }

      .page-title {
        font-size: 1.875rem;
        font-weight: 700;
        color: #1f2937;
        margin: 0;
      }

      .loading-container {
        margin-bottom: 2rem;
      }

      .profile-section {
        display: flex;
        align-items: center;
        gap: 2rem;
        margin-bottom: 1rem;
      }

      .profile-avatar-skeleton {
        flex-shrink: 0;
      }

      .profile-info {
        flex: 1;
      }

      .profile-card {
        margin-bottom: 2rem;
      }

      .profile-avatar {
        flex-shrink: 0;
      }

      .user-name {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 0.5rem 0;
      }

      .user-email {
        color: #6b7280;
        font-size: 1rem;
        margin: 0 0 1rem 0;
      }

      .user-status {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .details-section {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: 1fr;
      }

      .detail-card {
        height: fit-content;
      }

      .details-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
      }

      .detail-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .detail-label {
        font-size: 0.875rem;
        font-weight: 600;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .detail-value {
        font-size: 1rem;
        color: #1f2937;
        font-weight: 500;
        word-break: break-all;
      }

      .user-id {
        font-family: monospace;
        font-size: 0.875rem;
        background: #f3f4f6;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        color: #6b7280;
      }

      .role-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .role-tag {
        text-transform: capitalize;
      }

      .empty-state {
        margin-top: 3rem;
      }

      .content-section {
        animation: fadeIn 0.3s ease-in;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (min-width: 768px) {
        .details-section {
          grid-template-columns: 1fr 1fr;
        }

        .details-grid {
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }
      }

      @media (min-width: 1024px) {
        .details-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 768px) {
        .user-details-container {
          padding: 0.5rem;
        }

        .page-header {
          flex-direction: column;
          gap: 1rem;
          align-items: stretch;
        }

        .page-title {
          text-align: center;
        }

        .profile-section {
          flex-direction: column;
          text-align: center;
          gap: 1rem;
        }

        .details-grid {
          grid-template-columns: 1fr;
        }
      }

      :host ::ng-deep .p-card-header {
        background: #f8fafc;
        border-bottom: 1px solid #e5e7eb;
        padding: 1rem 1.5rem;
        font-weight: 600;
        color: #374151;
      }

      :host ::ng-deep .p-card-content {
        padding: 1.5rem;
      }

      :host ::ng-deep .user-avatar-initials {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-weight: 600;
        font-size: 1.5rem;
      }

      :host ::ng-deep .profile-avatar .p-avatar {
        width: 120px;
        height: 120px;
        font-size: 2rem;
      }

      :host ::ng-deep .p-skeleton {
        background: #f3f4f6;
      }
    `,
  ],
})
export class UserFormComponent implements OnInit {
  userData: any = null;
  isLoading = false;
  userId: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.params['id'];

    if (this.userId) {
      this.loadUser();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No user ID provided',
      });
      this.router.navigate(['/apps/users']);
    }
  }

  loadUser() {
    if (!this.userId) {
      return;
    }

    this.isLoading = true;
    this.userData = null; // Reset userData to ensure clean state
    this.cdr.detectChanges(); // Force change detection for loading state

    this.apiService.get<any>(`/users/${this.userId}`).subscribe({
      next: (response) => {
        console.log('API Response:', response); // Debug log

        // Handle different response formats
        if (response && typeof response === 'object') {
          // Check if it's wrapped in a data property
          this.userData = 'data' in response ? response.data : response;
        } else {
          this.userData = response;
        }

        console.log('Processed userData:', this.userData); // Debug log

        // Use setTimeout to ensure the data is set in the next tick
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges(); // Force change detection after data is loaded
          console.log(
            'Loading state updated, isLoading:',
            this.isLoading,
            'userData exists:',
            !!this.userData,
          ); // Debug log
        }, 0);
      },
      error: (error) => {
        console.error('Error loading user:', error);

        let errorMessage = 'Failed to load user data';
        if (error.status === 404) {
          errorMessage = 'User not found';
        } else if (error.status === 0) {
          errorMessage =
            'Unable to connect to server. Please check if the server is running.';
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
        });

        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges(); // Force change detection on error
        }, 0);
      },
    });
  }

  getInitials(name: string): string {
    if (!name) return 'U';

    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) + words[words.length - 1].charAt(0)
    ).toUpperCase();
  }
}
