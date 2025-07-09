import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CardModule, InputTextModule, ButtonModule],
  template: `
    <div class="p-6 max-w-2xl mx-auto">
      <p-card>
        <ng-template pTemplate="header">
          <div class="flex justify-between items-center p-4">
            <h1 class="text-2xl font-bold text-gray-900">{{ isEditMode ? 'Edit Job' : 'Create Job' }}</h1>
            <button pButton icon="pi pi-arrow-left" class="p-button-text" [routerLink]="['/apps/jobs']" label="Back"></button>
          </div>
        </ng-template>
        <ng-template pTemplate="content">
          <div *ngIf="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{{ successMessage }}</div>
          <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{{ errorMessage }}</div>
          <form [formGroup]="jobForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Title *</label><input pInputText formControlName="title" placeholder="Enter job title" class="w-full"></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Company *</label><input pInputText formControlName="company" placeholder="Enter company name" class="w-full"></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Location *</label><input pInputText formControlName="location" placeholder="Enter job location" class="w-full"></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Description *</label><textarea formControlName="description" placeholder="Enter job description" rows="6" class="w-full p-2 border border-gray-300 rounded-md"></textarea></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Requirements</label><textarea formControlName="requirements" placeholder="Enter job requirements" rows="4" class="w-full p-2 border border-gray-300 rounded-md"></textarea></div>
            <div class="form-actions flex justify-end space-x-4 pt-6"><button pButton type="button" label="Cancel" class="p-button-outlined" [routerLink]="['/apps/jobs']"></button><button pButton type="submit" [label]="isEditMode ? 'Update' : 'Create'" [disabled]="jobForm.invalid || loading" [loading]="loading"></button></div>
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
export class JobFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  jobForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    company: ['', [Validators.required]],
    location: ['', [Validators.required]],
    description: ['', [Validators.required]],
    requirements: ['']
  });

  isEditMode = false;
  jobId: number | null = null;
  loading = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit() {
    this.jobId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.jobId;
    if (this.isEditMode) this.loadJob();
  }

  loadJob() {
    this.loading = true;
    setTimeout(() => {
      this.jobForm.patchValue({
        title: 'Sample Job',
        company: 'Sample Company',
        location: 'Remote',
        description: 'Sample job description',
        requirements: 'Sample requirements'
      });
      this.loading = false;
    }, 500);
  }

  onSubmit() {
    if (this.jobForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      setTimeout(() => {
        this.successMessage = `Job ${this.isEditMode ? 'updated' : 'created'} successfully`;
        this.loading = false;
        setTimeout(() => this.router.navigate(['/apps/jobs']), 2000);
      }, 1000);
    } else {
      this.errorMessage = 'Please fill all required fields correctly';
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.jobForm.controls).forEach(key => {
      this.jobForm.get(key)?.markAsTouched();
    });
  }
}
