import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-scholarship-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CardModule, InputTextModule, ButtonModule, InputNumberModule],
  template: `
    <div class="p-6 max-w-2xl mx-auto">
      <p-card>
        <ng-template pTemplate="header">
          <div class="flex justify-between items-center p-4">
            <h1 class="text-2xl font-bold text-gray-900">{{ isEditMode ? 'Edit Scholarship' : 'Create Scholarship' }}</h1>
            <button pButton icon="pi pi-arrow-left" class="p-button-text" [routerLink]="['/apps/scholarship']" label="Back"></button>
          </div>
        </ng-template>
        <ng-template pTemplate="content">
          <div *ngIf="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{{ successMessage }}</div>
          <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{{ errorMessage }}</div>
          <form [formGroup]="scholarshipForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Name *</label><input pInputText formControlName="name" placeholder="Enter scholarship name" class="w-full"></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Sponsor *</label><input pInputText formControlName="sponsor" placeholder="Enter sponsor name" class="w-full"></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Amount *</label><p-inputNumber formControlName="amount" placeholder="Enter amount" currency="USD" mode="currency" class="w-full"></p-inputNumber></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Deadline</label><input type="date" formControlName="deadline" class="w-full p-2 border border-gray-300 rounded-md"></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Description</label><textarea formControlName="description" placeholder="Enter scholarship description" rows="6" class="w-full p-2 border border-gray-300 rounded-md"></textarea></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Eligibility</label><textarea formControlName="eligibility" placeholder="Enter eligibility criteria" rows="4" class="w-full p-2 border border-gray-300 rounded-md"></textarea></div>
            <div class="form-actions flex justify-end space-x-4 pt-6"><button pButton type="button" label="Cancel" class="p-button-outlined" [routerLink]="['/apps/scholarship']"></button><button pButton type="submit" [label]="isEditMode ? 'Update' : 'Create'" [disabled]="scholarshipForm.invalid || loading" [loading]="loading"></button></div>
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
export class ScholarshipFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  scholarshipForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    sponsor: ['', [Validators.required]],
    amount: [0, [Validators.required, Validators.min(1)]],
    deadline: [''],
    description: [''],
    eligibility: ['']
  });

  isEditMode = false;
  scholarshipId: number | null = null;
  loading = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit() {
    this.scholarshipId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.scholarshipId;
    if (this.isEditMode) this.loadScholarship();
  }

  loadScholarship() {
    this.loading = true;
    setTimeout(() => {
      this.scholarshipForm.patchValue({
        name: 'Merit Scholarship',
        sponsor: 'Alumni Association',
        amount: 5000,
        deadline: '2024-12-31',
        description: 'Scholarship for outstanding students',
        eligibility: 'Minimum GPA 3.5'
      });
      this.loading = false;
    }, 500);
  }

  onSubmit() {
    if (this.scholarshipForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      setTimeout(() => {
        this.successMessage = `Scholarship ${this.isEditMode ? 'updated' : 'created'} successfully`;
        this.loading = false;
        setTimeout(() => this.router.navigate(['/apps/scholarship']), 2000);
      }, 1000);
    } else {
      this.errorMessage = 'Please fill all required fields correctly';
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.scholarshipForm.controls).forEach(key => {
      this.scholarshipForm.get(key)?.markAsTouched();
    });
  }
}
