import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-news-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CardModule, InputTextModule, ButtonModule],
  template: `
    <div class="p-6 max-w-2xl mx-auto">
      <p-card>
        <ng-template pTemplate="header">
          <div class="flex justify-between items-center p-4">
            <h1 class="text-2xl font-bold text-gray-900">{{ isEditMode ? 'Edit News' : 'Create News' }}</h1>
            <button pButton icon="pi pi-arrow-left" class="p-button-text" [routerLink]="['/apps/news']" label="Back"></button>
          </div>
        </ng-template>
        <ng-template pTemplate="content">
          <div *ngIf="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{{ successMessage }}</div>
          <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{{ errorMessage }}</div>
          <form [formGroup]="newsForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Title *</label><input pInputText formControlName="title" placeholder="Enter news title" class="w-full"></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Category *</label><select formControlName="category" class="w-full p-2 border border-gray-300 rounded-md"><option value="">Select category</option><option value="General">General</option><option value="Academic">Academic</option><option value="Events">Events</option><option value="Alumni">Alumni</option></select></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-2">Content *</label><textarea formControlName="content" placeholder="Enter news content" rows="8" class="w-full p-2 border border-gray-300 rounded-md"></textarea></div>
            <div class="form-actions flex justify-end space-x-4 pt-6"><button pButton type="button" label="Cancel" class="p-button-outlined" [routerLink]="['/apps/news']"></button><button pButton type="submit" [label]="isEditMode ? 'Update' : 'Create'" [disabled]="newsForm.invalid || loading" [loading]="loading"></button></div>
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
export class NewsFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  newsForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    category: ['', [Validators.required]],
    content: ['', [Validators.required]]
  });

  isEditMode = false;
  newsId: number | null = null;
  loading = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit() {
    this.newsId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.newsId;
    if (this.isEditMode) this.loadNews();
  }

  loadNews() {
    this.loading = true;
    setTimeout(() => {
      this.newsForm.patchValue({
        title: 'Sample News',
        category: 'General',
        content: 'Sample news content'
      });
      this.loading = false;
    }, 500);
  }

  onSubmit() {
    if (this.newsForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      setTimeout(() => {
        this.successMessage = `News ${this.isEditMode ? 'updated' : 'created'} successfully`;
        this.loading = false;
        setTimeout(() => this.router.navigate(['/apps/news']), 2000);
      }, 1000);
    } else {
      this.errorMessage = 'Please fill all required fields correctly';
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.newsForm.controls).forEach(key => {
      this.newsForm.get(key)?.markAsTouched();
    });
  }
}
