import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MembershipService } from './membership.service';
import { MembershipStatus } from '../../shared/enums';
import { finalize } from 'rxjs/operators';

interface MembershipDetails {
  _id: string;
  user: {
    _id: string;
    email: string;
    roles: string[];
    name: string;
    active: boolean;
    emailVerified: boolean;
    batch: {
      _id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
    phone: string;
    photo?: string;
    currentPosition?: string;
    company?: string;
    membershipId?: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  status: MembershipStatus;
  justification: string | null;
  paymentInfo?: {
    paymentMethod: string;
    transactionId: string;
    paymentDate: string;
    amount: number;
    status: string;
  };
  invoice?: {
    _id: string;
    user: any;
    amount: number;
    status: string;
    remarks: string;
    paymentUrl: string;
    validationId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface StatusOption {
  label: string;
  value: MembershipStatus;
  severity: 'success' | 'warn' | 'danger' | 'info';
}

@Component({
  selector: 'app-membership-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    TagModule,
    DividerModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="membership-detail-container">
      <div class="detail-header">
        <h1 class="detail-title">Membership Details</h1>
        <button
          pButton
          label="Back to List"
          icon="pi pi-arrow-left"
          class="p-button-outlined"
          routerLink="/apps/membership"
        ></button>
      </div>

      <div *ngIf="loading" class="loading-container">
        <div class="loading-spinner">
          <i class="pi pi-spinner pi-spin" style="font-size: 2rem"></i>
          <p>Loading membership details...</p>
          <p style="font-size: 0.8rem; color: #666; margin-top: 1rem;">
            Debug: Loading state = {{ loading }}, Membership ID =
            {{ membershipId }}
          </p>
        </div>
      </div>

      <div *ngIf="!loading && !membership" class="no-data-container">
        <div class="no-data-message">
          <i
            class="pi pi-exclamation-triangle"
            style="font-size: 2rem; color: #f59e0b; margin-bottom: 1rem;"
          ></i>
          <p>No membership data available</p>
          <p style="font-size: 0.8rem; color: #666;">
            Debug: Loading = {{ loading }}, Membership = {{ membership }}, ID =
            {{ membershipId }}
          </p>
        </div>
      </div>

      <div *ngIf="!loading && membership" class="details-grid">
        <!-- User Information Card -->
        <p-card header="Member Information" class="info-card">
          <div class="user-profile">
            <div class="profile-avatar">
              <img
                *ngIf="membership.user.photo"
                [src]="membership.user.photo"
                [alt]="membership.user.name"
                class="avatar-image"
              />
              <div *ngIf="!membership.user.photo" class="avatar-placeholder">
                <i class="pi pi-user"></i>
              </div>
            </div>
            <div class="profile-info">
              <h3 class="user-name">{{ membership.user.name }}</h3>
              <p class="user-email">{{ membership.user.email }}</p>
              <div class="user-tags">
                <p-tag
                  [value]="
                    membership.user.emailVerified ? 'Verified' : 'Not Verified'
                  "
                  [severity]="
                    membership.user.emailVerified ? 'success' : 'warn'
                  "
                >
                </p-tag>
                <p-tag
                  [value]="membership.user.active ? 'Active' : 'Inactive'"
                  [severity]="membership.user.active ? 'success' : 'danger'"
                >
                </p-tag>
              </div>
            </div>
          </div>

          <p-divider></p-divider>

          <div class="info-grid">
            <div class="info-item" *ngIf="membership.user.membershipId">
              <label>Membership ID:</label>
              <span class="membership-id-badge">{{ membership.user.membershipId }}</span>
            </div>
            <div class="info-item">
              <label>Phone:</label>
              <span>{{ membership.user.phone || 'Not provided' }}</span>
            </div>
            <div class="info-item">
              <label>Batch:</label>
              <span>{{ membership.user.batch.name }}</span>
            </div>
            <div class="info-item">
              <label>Current Position:</label>
              <span>{{
                membership.user.currentPosition || 'Not provided'
              }}</span>
            </div>
            <div class="info-item">
              <label>Company:</label>
              <span>{{ membership.user.company || 'Not provided' }}</span>
            </div>
            <div class="info-item">
              <label>User Roles:</label>
              <span>
                <p-tag
                  *ngFor="let role of membership.user.roles"
                  [value]="role"
                  class="role-tag"
                >
                </p-tag>
              </span>
            </div>
            <div class="info-item">
              <label>Member Since:</label>
              <span>{{ membership.user.createdAt | date: 'mediumDate' }}</span>
            </div>
          </div>
        </p-card>

        <!-- Membership Status Card -->
        <p-card header="Membership Status" class="status-card">
          <div class="status-section">
            <div class="current-status">
              <label>Current Status:</label>
              <p-tag
                [value]="getStatusLabel(membership.status)"
                [severity]="getStatusSeverity(membership.status)"
                class="status-tag"
              >
              </p-tag>
            </div>

            <div class="status-actions">
              <button
                pButton
                label="Change Status"
                icon="pi pi-edit"
                class="p-button-outlined"
                (click)="showStatusDialog = true"
              ></button>
            </div>
          </div>

          <div *ngIf="membership.justification" class="justification-section">
            <p-divider></p-divider>
            <div class="info-item">
              <label>Justification:</label>
              <p class="justification-text">{{ membership.justification }}</p>
            </div>
          </div>

          <p-divider></p-divider>

          <div class="info-grid">
            <div class="info-item">
              <label>Application Date:</label>
              <span>{{ membership.createdAt | date: 'mediumDate' }}</span>
            </div>
            <div class="info-item">
              <label>Last Updated:</label>
              <span>{{ membership.updatedAt | date: 'mediumDate' }}</span>
            </div>
          </div>
        </p-card>

        <!-- Payment Information Card -->
        <p-card header="Payment Information" class="payment-card">
          <!-- Display Invoice Information when invoice exists (regardless of membership status) -->
          <div *ngIf="membership.invoice; else checkLegacyPayment">
            <div class="invoice-section">
              <h4 class="section-title">Invoice Details</h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>Invoice ID:</label>
                  <span class="invoice-id">{{ membership.invoice._id }}</span>
                </div>
                <div class="info-item">
                  <label>Amount:</label>
                  <span class="amount-due"
                    >৳{{ membership.invoice.amount }}</span
                  >
                </div>
                <div class="info-item">
                  <label>Invoice Status:</label>
                  <p-tag
                    [value]="membership.invoice.status"
                    [severity]="
                      getInvoiceStatusSeverity(membership.invoice.status)
                    "
                  >
                  </p-tag>
                </div>
                <div class="info-item">
                  <label>Remarks:</label>
                  <span>{{ membership.invoice.remarks }}</span>
                </div>
                <div class="info-item">
                  <label>Validation ID:</label>
                  <span class="validation-id">{{
                    membership.invoice.validationId
                  }}</span>
                </div>
                <div class="info-item">
                  <label>Invoice Date:</label>
                  <span>{{
                    membership.invoice.createdAt | date: 'mediumDate'
                  }}</span>
                </div>
              </div>

              <div
                class="payment-actions"
                *ngIf="
                  membership.invoice.paymentUrl &&
                  membership.invoice.status !== 'paid'
                "
              >
                <p-divider></p-divider>
                <button
                  pButton
                  label="Open Payment Link"
                  icon="pi pi-external-link"
                  class="p-button-success"
                  (click)="openPaymentUrl(membership.invoice.paymentUrl)"
                ></button>
                <p class="payment-note">
                  Click to open the payment portal in a new window
                </p>
              </div>

              <!-- Show payment completion message for paid invoices -->
              <div
                *ngIf="membership.invoice.status === 'paid'"
                class="payment-completed"
              >
                <p-divider></p-divider>
                <div class="success-message">
                  <i
                    class="pi pi-check-circle"
                    style="color: #10b981; font-size: 1.2rem; margin-right: 0.5rem;"
                  ></i>
                  <span style="color: #10b981; font-weight: 600;"
                    >Payment completed successfully</span
                  >
                </div>
                <p class="payment-note">
                  This invoice has been paid and processed.
                </p>
              </div>
            </div>
          </div>

          <ng-template #checkLegacyPayment>
            <div *ngIf="membership.paymentInfo; else noPaymentInfo">
              <div class="payment-details">
                <h4 class="section-title">Payment Details</h4>
                <div class="info-grid">
                  <div class="info-item">
                    <label>Payment Method:</label>
                    <span>{{ membership.paymentInfo.paymentMethod }}</span>
                  </div>
                  <div class="info-item">
                    <label>Transaction ID:</label>
                    <span class="transaction-id">{{
                      membership.paymentInfo.transactionId
                    }}</span>
                  </div>
                  <div class="info-item">
                    <label>Payment Date:</label>
                    <span>{{
                      membership.paymentInfo.paymentDate | date: 'mediumDate'
                    }}</span>
                  </div>
                  <div class="info-item">
                    <label>Amount Paid:</label>
                    <span class="amount-paid"
                      >৳{{ membership.paymentInfo.amount }}</span
                    >
                  </div>
                  <div class="info-item">
                    <label>Payment Status:</label>
                    <p-tag
                      [value]="membership.paymentInfo.status"
                      [severity]="
                        getPaymentStatusSeverity(membership.paymentInfo.status)
                      "
                    >
                    </p-tag>
                  </div>
                </div>
              </div>
            </div>
          </ng-template>

          <ng-template #noPaymentInfo>
            <div class="no-payment-info">
              <i
                class="pi pi-exclamation-triangle"
                style="font-size: 2rem; color: #f59e0b;"
              ></i>
              <p>No payment information available</p>
              <p class="payment-note">
                Payment information will appear after status changes to require
                payment.
              </p>
            </div>
          </ng-template>
        </p-card>

        <!-- Activity Timeline Card -->
        <p-card header="Activity Timeline" class="timeline-card">
          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-marker created"></div>
              <div class="timeline-content">
                <h4>Membership Application Submitted</h4>
                <p>{{ membership.createdAt | date: 'medium' }}</p>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-marker updated"></div>
              <div class="timeline-content">
                <h4>Last Updated</h4>
                <p>{{ membership.updatedAt | date: 'medium' }}</p>
              </div>
            </div>
          </div>
        </p-card>
      </div>

      <!-- Status Change Dialog -->
      <p-dialog
        header="Change Membership Status"
        [(visible)]="showStatusDialog"
        [modal]="true"
        [style]="{ width: '450px' }"
        [closable]="true"
      >
        <form [formGroup]="statusForm" (ngSubmit)="updateStatus()">
          <div class="status-form">
            <label for="newStatus">Select New Status:</label>
            <select
              id="newStatus"
              formControlName="newStatus"
              class="status-dropdown"
            >
              <option value="">Select status</option>
              <option
                *ngFor="let status of getAvailableStatusOptions()"
                [value]="status.value"
              >
                {{ status.label }}
              </option>
            </select>

            <div *ngIf="statusForm.get('newStatus')?.value === 'rejected'">
              <label for="justification"
                >Justification (Required for rejection):</label
              >
              <textarea
                id="justification"
                formControlName="justification"
                rows="3"
                placeholder="Enter justification for rejection..."
                class="reason-textarea"
              >
              </textarea>
            </div>

            <div
              *ngIf="
                statusForm.get('newStatus')?.value &&
                statusForm.get('newStatus')?.value !== 'rejected'
              "
            >
              <label for="reason">Reason for Change (Optional):</label>
              <textarea
                id="reason"
                formControlName="reason"
                rows="3"
                placeholder="Enter reason for status change..."
                class="reason-textarea"
              >
              </textarea>
            </div>
          </div>

          <div class="dialog-actions">
            <button
              pButton
              label="Cancel"
              icon="pi pi-times"
              class="p-button-text"
              type="button"
              (click)="showStatusDialog = false"
            ></button>
            <button
              pButton
              label="Update Status"
              icon="pi pi-check"
              class="p-button-success"
              type="submit"
              [disabled]="statusForm.invalid || updatingStatus"
            ></button>
          </div>
        </form>
      </p-dialog>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>
    </div>
  `,
  styles: [
    `
      .membership-detail-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem;
      }

      .detail-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .detail-title {
        font-size: 2rem;
        font-weight: 700;
        color: #1f2937;
        margin: 0;
      }

      .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 400px;
      }

      .loading-spinner {
        text-align: center;
      }

      .loading-spinner i {
        color: #3b82f6;
        margin-bottom: 1rem;
      }

      .no-data-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 400px;
      }

      .no-data-message {
        text-align: center;
      }

      .details-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
        gap: 1.5rem;
      }

      .info-card,
      .status-card,
      .payment-card,
      .timeline-card {
        height: fit-content;
      }

      .user-profile {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .profile-avatar {
        flex-shrink: 0;
      }

      .avatar-image {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid #e5e7eb;
      }

      .avatar-placeholder {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: #f3f4f6;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid #e5e7eb;
      }

      .avatar-placeholder i {
        font-size: 2rem;
        color: #9ca3af;
      }

      .profile-info {
        flex: 1;
      }

      .user-name {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        color: #1f2937;
      }

      .user-email {
        color: #6b7280;
        margin: 0 0 0.5rem 0;
        font-size: 0.95rem;
      }

      .user-tags {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .role-tag {
        margin-right: 0.25rem;
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
      }

      .info-item {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .info-item label {
        font-weight: 600;
        color: #374151;
        font-size: 0.875rem;
      }

      .info-item span {
        color: #1f2937;
      }

      .membership-id-badge {
        display: inline-block;
        font-family: 'Courier New', monospace;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 1rem;
        font-weight: 700;
        letter-spacing: 1px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .transaction-id {
        font-family: 'Courier New', monospace;
        background: #f3f4f6;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.875rem;
      }

      .amount-paid {
        font-weight: 600;
        color: #059669;
      }

      .section-title {
        margin: 0 0 1rem 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: #374151;
      }

      .invoice-section {
        margin-bottom: 1rem;
      }

      .invoice-id,
      .validation-id {
        font-family: 'Courier New', monospace;
        background: #f3f4f6;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.875rem;
      }

      .amount-due {
        font-weight: 600;
        color: #dc2626;
        font-size: 1.1rem;
      }

      .payment-actions {
        margin-top: 1rem;
        text-align: center;
      }

      .payment-actions .payment-note {
        margin-top: 0.5rem;
        font-size: 0.875rem;
        color: #6b7280;
      }

      .status-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .current-status {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .current-status label {
        font-weight: 600;
        color: #374151;
      }

      .status-tag {
        font-size: 0.875rem;
      }

      .justification-section {
        margin-bottom: 1rem;
      }

      .justification-text {
        background: #f9fafb;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #3b82f6;
        margin: 0;
        font-style: italic;
        color: #374151;
      }

      .payment-details {
        margin-bottom: 1rem;
      }

      .no-payment-info {
        text-align: center;
        padding: 2rem;
        color: #6b7280;
      }

      .no-payment-info i {
        margin-bottom: 1rem;
      }

      .no-payment-info p {
        margin-bottom: 1rem;
        font-size: 1rem;
      }

      .payment-note {
        font-size: 0.875rem;
        color: #9ca3af;
      }

      .payment-completed {
        text-align: center;
      }

      .success-message {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.5rem;
      }

      .timeline {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .timeline-item {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
      }

      .timeline-marker {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-top: 0.25rem;
        flex-shrink: 0;
      }

      .timeline-marker.created {
        background: #10b981;
      }

      .timeline-marker.updated {
        background: #3b82f6;
      }

      .timeline-content h4 {
        margin: 0 0 0.25rem 0;
        font-size: 0.95rem;
        font-weight: 600;
        color: #1f2937;
      }

      .timeline-content p {
        margin: 0;
        color: #6b7280;
        font-size: 0.875rem;
      }

      .status-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .status-form label {
        font-weight: 600;
        color: #374151;
        font-size: 0.875rem;
      }

      .status-dropdown,
      .reason-textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        line-height: 1.5;
        transition:
          border-color 0.15s ease-in-out,
          box-shadow 0.15s ease-in-out;
      }

      .status-dropdown:focus,
      .reason-textarea:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .reason-textarea {
        resize: vertical;
        min-height: 80px;
      }

      .dialog-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
      }

      :host ::ng-deep .p-card-header {
        background: #f8fafc;
        border-bottom: 1px solid #e5e7eb;
        padding: 1rem 1.5rem;
        font-weight: 600;
        color: #1f2937;
      }

      :host ::ng-deep .p-card-content {
        padding: 1.5rem;
      }

      :host ::ng-deep .p-divider {
        margin: 1.5rem 0;
      }

      @media (max-width: 768px) {
        .detail-header {
          flex-direction: column;
          gap: 1rem;
          align-items: stretch;
        }

        .detail-title {
          text-align: center;
        }

        .details-grid {
          grid-template-columns: 1fr;
        }

        .status-section {
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }

        .info-grid {
          grid-template-columns: 1fr;
        }

        .user-profile {
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .user-tags {
          justify-content: center;
        }
      }
    `,
  ],
})
export class MembershipDetailComponent implements OnInit {
  membership: MembershipDetails | null = null;
  membershipId: string | null = null;
  loading = false;
  updatingStatus = false;
  showStatusDialog = false;
  statusForm: FormGroup;

  statusOptions: StatusOption[] = [
    { label: 'Draft', value: MembershipStatus.Draft, severity: 'info' },
    {
      label: 'Requested',
      value: MembershipStatus.Requested,
      severity: 'warn',
    },
    {
      label: 'In Progress',
      value: MembershipStatus.InProgress,
      severity: 'warn',
    },
    {
      label: 'Payment Required',
      value: MembershipStatus.PaymentRequired,
      severity: 'warn',
    },
    {
      label: 'Approved',
      value: MembershipStatus.Approved,
      severity: 'success',
    },
    { label: 'Rejected', value: MembershipStatus.Rejected, severity: 'danger' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private membershipService: MembershipService,
    private cdr: ChangeDetectorRef,
  ) {
    this.statusForm = this.fb.group({
      newStatus: ['', [Validators.required]],
      reason: [''],
      justification: [''],
    });

    // Add dynamic validator for justification when rejection is selected
    this.statusForm.get('newStatus')?.valueChanges.subscribe((status) => {
      const justificationControl = this.statusForm.get('justification');
      if (status === MembershipStatus.Rejected) {
        justificationControl?.setValidators([Validators.required]);
      } else {
        justificationControl?.clearValidators();
      }
      justificationControl?.updateValueAndValidity();
    });
  }

  ngOnInit() {
    console.log('MembershipDetailComponent ngOnInit called');
    this.membershipId = this.route.snapshot.paramMap.get('id');
    console.log('Membership ID from route:', this.membershipId);

    if (this.membershipId) {
      this.loadMembershipDetails(this.membershipId);
    } else {
      console.error('No membership ID found in route, redirecting');
      this.router.navigate(['/apps/membership']);
    }
  }

  loadMembershipDetails(id: string) {
    this.loading = true;

    this.membershipService
      .getMembershipById(id)
      .pipe(
        finalize(() => {
          this.loading = false;
          console.log('Finalize: Loading state set to false');
          this.cdr.detectChanges(); // Force change detection
        }),
      )
      .subscribe({
        next: (response: any) => {
          console.log('Raw API response:', response);

          // Check if response has a data property (common API response pattern)
          if (response && typeof response === 'object') {
            // If response has a data property, use that, otherwise use the response directly
            this.membership = response.data || response;
            console.log('Processed membership data:', this.membership);
          } else {
            console.error('Invalid response format:', response);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Invalid response format from server',
            });
          }

          console.log(
            'Success: Loading state will be set to false in finalize',
          );
        },
        error: (error) => {
          console.error('Error loading membership details:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load membership details',
          });
          console.log('Error: Loading state will be set to false in finalize');
        },
      });
  }

  getStatusLabel(status: MembershipStatus | string): string {
    const statusOption = this.statusOptions.find(
      (option) => option.value === status,
    );
    return (
      statusOption?.label || status.charAt(0).toUpperCase() + status.slice(1)
    );
  }

  getStatusSeverity(
    status: MembershipStatus | string,
  ): 'success' | 'warn' | 'danger' | 'info' {
    const statusOption = this.statusOptions.find(
      (option) => option.value === status,
    );
    return statusOption?.severity || 'info';
  }

  getPaymentStatusSeverity(
    status: string,
  ): 'success' | 'warn' | 'danger' | 'info' {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'paid':
      case 'success':
        return 'success';
      case 'pending':
      case 'processing':
        return 'warn';
      case 'failed':
      case 'cancelled':
      case 'rejected':
        return 'danger';
      default:
        return 'info';
    }
  }

  getInvoiceStatusSeverity(
    status: string,
  ): 'success' | 'warn' | 'danger' | 'info' {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'completed':
      case 'success':
        return 'success';
      case 'unpaid':
      case 'pending':
      case 'processing':
        return 'warn';
      case 'failed':
      case 'cancelled':
      case 'rejected':
      case 'expired':
        return 'danger';
      default:
        return 'info';
    }
  }

  openPaymentUrl(paymentUrl: string): void {
    if (paymentUrl) {
      window.open(paymentUrl, '_blank', 'noopener,noreferrer');
    }
  }

  getAvailableStatusOptions(): StatusOption[] {
    if (!this.membership) return this.statusOptions;

    const currentStatus = this.membership.status;

    // Define allowed transitions based on current status
    switch (currentStatus) {
      case MembershipStatus.Requested:
        return this.statusOptions.filter((option) =>
          [MembershipStatus.InProgress, MembershipStatus.Rejected].includes(
            option.value as MembershipStatus,
          ),
        );
      case MembershipStatus.InProgress:
        return this.statusOptions.filter((option) =>
          [
            MembershipStatus.PaymentRequired,
            MembershipStatus.Approved,
            MembershipStatus.Rejected,
          ].includes(option.value as MembershipStatus),
        );
      case MembershipStatus.PaymentRequired:
        return this.statusOptions.filter((option) =>
          [MembershipStatus.Approved, MembershipStatus.Rejected].includes(
            option.value as MembershipStatus,
          ),
        );
      default:
        // For other statuses, allow all transitions except the current one
        return this.statusOptions.filter(
          (option) => option.value !== currentStatus,
        );
    }
  }

  updateStatus() {
    if (this.statusForm.valid && this.membership) {
      this.confirmationService.confirm({
        message: `Are you sure you want to change the membership status to "${this.getStatusLabel(this.statusForm.value.newStatus)}"?`,
        header: 'Confirm Status Change',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.performStatusUpdate();
        },
      });
    }
  }

  private performStatusUpdate() {
    if (!this.membership) return;

    this.updatingStatus = true;
    const newStatus = this.statusForm.value.newStatus;
    const justification = this.statusForm.value.justification;

    let updateObservable;

    // Use specific API endpoints based on the status
    switch (newStatus) {
      case MembershipStatus.InProgress:
        updateObservable = this.membershipService.setInProgress(
          this.membershipId!,
        );
        break;
      case MembershipStatus.PaymentRequired:
        updateObservable = this.membershipService.setPaymentRequired(
          this.membershipId!,
        );
        break;
      case MembershipStatus.Approved:
        updateObservable = this.membershipService.approveMembership(
          this.membershipId!,
        );
        break;
      case MembershipStatus.Rejected:
        if (!justification) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Justification is required for rejection',
          });
          this.updatingStatus = false;
          return;
        }
        updateObservable = this.membershipService.rejectMembership(
          this.membershipId!,
          justification,
        );
        break;
      default:
        // Fallback to generic update for other statuses
        const updateData = {
          status: newStatus,
          statusChangeReason: this.statusForm.value.reason,
          statusChangedAt: new Date().toISOString(),
        };
        updateObservable = this.membershipService.updateMembership(
          this.membershipId!,
          updateData,
        );
    }

    updateObservable.subscribe({
      next: (response: any) => {
        // Update local membership data
        if (response && typeof response === 'object') {
          // Check if response has a data property (common API response pattern)
          this.membership = response.data || response;
        } else {
          // If the API doesn't return the updated object, update manually
          this.membership!.status = newStatus;
          this.membership!.updatedAt = new Date().toISOString();
          if (newStatus === MembershipStatus.Rejected && justification) {
            this.membership!.justification = justification;
          }
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Membership status updated successfully',
        });

        this.showStatusDialog = false;
        this.statusForm.reset();
        this.updatingStatus = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error updating membership status:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Failed to update membership status',
        });
        this.updatingStatus = false;
      },
    });
  }
}
