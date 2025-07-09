import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-donation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CardModule, InputTextModule, ButtonModule, InputNumberModule],
  template: `
    <div class="p-6 max-w-2xl mx-auto">
      <p-card>
        <ng-template pTemplate="header">
          <div class="flex justify-between items-center p-4">
            <h1 class="text-2xl font-bold text-gray-900">{{ isEditMode ? 'Edit Donation' : 'Create Donation' }}</h1>
            <button pButton icon="pi pi-arrow-left" class="p-button-text" [routerLink]="['/apps/donations']" label="Back"></button>
          </div>
        </ng-template>
        <ng-template pTemplate="content">
          <div *ngIf="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{{ successMessage }}</div>
          <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{{ errorMessage }}</div>
          <form [formGroup]="donationForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Donor Name *</label><input pInputText formControlName="donor" placeholder="Enter donor name" class="w-full"></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Email *</label><input pInputText formControlName="email" type="email" placeholder="Enter email" class="w-full"></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Amount *</label><p-inputNumber formControlName="amount" placeholder="Enter amount" currency="USD" mode="currency" class="w-full"></p-inputNumber></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Purpose *</label><input pInputText formControlName="purpose" placeholder="Enter donation purpose" class="w-full"></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Notes</label><textarea formControlName="notes" placeholder="Enter additional notes" rows="4" class="w-full p-2 border border-gray-300 rounded-md"></textarea></div>
            <div class="form-actions flex justify-end space-x-4 pt-6"><button pButton type="button" label="Cancel" class="p-button-outlined" [routerLink]="['/apps/donations']"></button><button pButton type="submit" [label]="isEditMode ? 'Update' : 'Create'" [disabled]="donationForm.invalid || loading" [loading]="loading"></button></div>
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
export class DonationFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  donationForm: FormGroup = this.fb.group({
    donor: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    amount: [0, [Validators.required, Validators.min(1)]],
    purpose: ['', [Validators.required]],
    notes: ['']
  });

  isEditMode = false;
  donationId: number | null = null;
  loading = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit() {
    this.donationId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.donationId;
    if (this.isEditMode) this.loadDonation();
  }

  loadDonation() {
    this.loading = true;
    setTimeout(() => {
      this.donationForm.patchValue({
        donor: 'John Doe',
        email: 'john@example.com',
        amount: 100,
        purpose: 'General Fund',
        notes: 'Sample notes'
      });
      this.loading = false;
    }, 500);
  }

  onSubmit() {
    if (this.donationForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      setTimeout(() => {
        this.successMessage = `Donation ${this.isEditMode ? 'updated' : 'created'} successfully`;
        this.loading = false;
        setTimeout(() => this.router.navigate(['/apps/donations']), 2000);
      }, 1000);
    } else {
      this.errorMessage = 'Please fill all required fields correctly';
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.donationForm.controls).forEach(key => {
      this.donationForm.get(key)?.markAsTouched();
    });
  }
}
