import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    InputTextModule,
    ButtonModule
  ],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <p-card>
        <ng-template pTemplate="header">
          <div class="flex justify-between items-center p-4">
            <h1 class="text-2xl font-bold text-gray-900">
              {{ isEditMode ? 'Edit Blog Post' : 'Create Blog Post' }}
            </h1>
            <button 
              pButton 
              icon="pi pi-arrow-left" 
              class="p-button-text"
              [routerLink]="['/apps/blogs']"
              label="Back to List">
            </button>
          </div>
        </ng-template>

        <ng-template pTemplate="content">
          <div *ngIf="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {{ successMessage }}
          </div>
          
          <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ errorMessage }}
          </div>

          <form [formGroup]="blogForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="form-group">
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input 
                pInputText 
                id="title"
                formControlName="title"
                placeholder="Enter blog title"
                class="w-full">
            </div>

            <div class="form-group">
              <label for="author" class="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input 
                pInputText 
                id="author"
                formControlName="author"
                placeholder="Enter author name"
                class="w-full">
            </div>

            <div class="form-group">
              <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select 
                id="category"
                formControlName="category"
                class="w-full p-2 border border-gray-300 rounded-md">
                <option value="">Select category</option>
                <option value="Alumni News">Alumni News</option>
                <option value="Career">Career</option>
                <option value="Technology">Technology</option>
                <option value="Events">Events</option>
                <option value="Success Stories">Success Stories</option>
              </select>
            </div>

            <div class="form-group">
              <label for="excerpt" class="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea 
                id="excerpt"
                formControlName="excerpt"
                placeholder="Enter blog excerpt"
                rows="3"
                class="w-full p-2 border border-gray-300 rounded-md">
              </textarea>
            </div>

            <div class="form-group">
              <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea 
                id="content"
                formControlName="content"
                placeholder="Enter blog content"
                rows="12"
                class="w-full p-2 border border-gray-300 rounded-md">
              </textarea>
            </div>

            <div class="form-group">
              <label for="featured" class="block text-sm font-medium text-gray-700 mb-2">
                Featured Post
              </label>
              <div class="flex items-center">
                <input 
                  type="checkbox"
                  id="featured"
                  formControlName="featured"
                  class="mr-2">
                <label for="featured" class="text-sm text-gray-600">
                  Mark as featured post
                </label>
              </div>
            </div>

            <div class="form-actions flex justify-end space-x-4 pt-6">
              <button 
                pButton 
                type="button"
                label="Cancel"
                class="p-button-outlined"
                [routerLink]="['/apps/blogs']">
              </button>
              <button 
                pButton 
                type="submit"
                [label]="isEditMode ? 'Update' : 'Create'"
                [disabled]="blogForm.invalid || loading"
                [loading]="loading">
              </button>
            </div>
          </form>
        </ng-template>
      </p-card>
    </div>
  `,
  styles: [`
    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-actions {
      border-top: 1px solid #e5e7eb;
      margin-top: 2rem;
      padding-top: 1.5rem;
    }

    :host ::ng-deep .p-card-content {
      padding: 2rem;
    }

    :host ::ng-deep .p-inputtext {
      width: 100%;
    }
  `]
})
export class BlogFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  blogForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    author: ['', [Validators.required]],
    category: ['', [Validators.required]],
    excerpt: [''],
    content: ['', [Validators.required]],
    featured: [false]
  });

  isEditMode = false;
  blogId: number | null = null;
  loading = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit() {
    this.blogId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.blogId;

    if (this.isEditMode) {
      this.loadBlog();
    }
  }

  loadBlog() {
    this.loading = true;
    setTimeout(() => {
      const mockBlog = {
        id: this.blogId!,
        title: 'Sample Blog Post',
        author: 'John Doe',
        category: 'Technology',
        excerpt: 'This is a sample blog post excerpt.',
        content: 'This is the full content of the blog post.',
        featured: false
      };

      this.blogForm.patchValue(mockBlog);
      this.loading = false;
    }, 500);
  }

  onSubmit() {
    if (this.blogForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      setTimeout(() => {
        this.successMessage = `Blog post ${this.isEditMode ? 'updated' : 'created'} successfully`;
        this.loading = false;
        
        setTimeout(() => {
          this.router.navigate(['/apps/blogs']);
        }, 2000);
      }, 1000);
    } else {
      this.errorMessage = 'Please fill all required fields correctly';
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.blogForm.controls).forEach(key => {
      const control = this.blogForm.get(key);
      control?.markAsTouched();
    });
  }
}
