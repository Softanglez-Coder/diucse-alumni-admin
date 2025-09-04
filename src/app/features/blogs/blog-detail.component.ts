import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { DividerModule } from 'primeng/divider';
import { QuillViewComponent } from 'ngx-quill';
import { Blog, BlogService, BlogStatus } from './blog.service';
import { AuthService, User } from '../../core/services/auth.service';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
    SkeletonModule,
    DividerModule,
    QuillViewComponent
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="blog-detail-container">
      <div class="mb-4 flex justify-content-between align-items-center">
        <p-button
          icon="pi pi-arrow-left"
          label="Back to Blogs"
          severity="secondary"
          [text]="true"
          (onClick)="goBack()">
        </p-button>

        <div class="flex gap-2" *ngIf="blog && canPublish">
          <p-button
            *ngIf="blog.status !== BlogStatus.PUBLISHED"
            icon="pi pi-check-circle"
            label="Publish"
            severity="success"
            (onClick)="publishBlog()"
            [loading]="publishing">
          </p-button>

          <p-button
            *ngIf="blog.status === BlogStatus.PUBLISHED"
            icon="pi pi-times-circle"
            label="Unpublish"
            severity="warn"
            (onClick)="unpublishBlog()"
            [loading]="unpublishing">
          </p-button>
        </div>
      </div>

      <p-card *ngIf="!loading && blog" class="blog-card">
        <ng-template pTemplate="header">
          <div class="blog-header">
            <div class="flex justify-content-between align-items-start mb-3">
              <h1 class="blog-title m-0">{{ blog.title }}</h1>
              <p-tag
                [value]="getStatusDisplayText(blog.status)"
                [severity]="getStatusSeverity(blog.status)">
              </p-tag>
            </div>

            <div class="blog-meta">
              <div class="flex align-items-center gap-3 mb-2">
                <span class="author">
                  <i class="pi pi-user mr-1"></i>
                  <strong>{{ blog.author.name }}</strong>
                </span>
                <span class="email text-500">{{ blog.author.email }}</span>
              </div>

              <div class="flex align-items-center gap-4 text-sm text-500">
                <span>
                  <i class="pi pi-calendar mr-1"></i>
                  Created: {{ blog.createdAt | date:'medium' }}
                </span>
                <span>
                  <i class="pi pi-clock mr-1"></i>
                  Updated: {{ blog.updatedAt | date:'medium' }}
                </span>
              </div>
            </div>
          </div>
        </ng-template>

        <div class="blog-content">
          <div class="blog-body">
            <h3 class="text-lg font-semibold mb-3">Content</h3>
            <div class="content-wrapper">
              <quill-view [content]="blog.content" theme="bubble"></quill-view>
            </div>
          </div>
        </div>
      </p-card>

      <!-- Loading State -->
      <p-card *ngIf="loading">
        <ng-template pTemplate="header">
          <div class="blog-header">
            <p-skeleton height="2rem" width="70%" class="mb-3"></p-skeleton>
            <div class="flex align-items-center gap-3 mb-2">
              <p-skeleton height="1rem" width="150px"></p-skeleton>
              <p-skeleton height="1rem" width="200px"></p-skeleton>
            </div>
            <div class="flex align-items-center gap-4">
              <p-skeleton height="0.875rem" width="180px"></p-skeleton>
              <p-skeleton height="0.875rem" width="180px"></p-skeleton>
            </div>
          </div>
        </ng-template>

        <div class="blog-content">
          <p-skeleton height="1rem" width="100%" class="mb-2"></p-skeleton>
          <p-skeleton height="1rem" width="100%" class="mb-2"></p-skeleton>
          <p-skeleton height="1rem" width="80%" class="mb-4"></p-skeleton>
          <p-skeleton height="8rem" width="100%"></p-skeleton>
        </div>
      </p-card>

      <!-- Error State -->
      <p-card *ngIf="!loading && !blog" class="text-center">
        <div class="flex flex-column align-items-center gap-3 p-4">
          <i class="pi pi-exclamation-triangle text-4xl text-orange-500"></i>
          <h3 class="m-0">Blog Not Found</h3>
          <p class="text-600 m-0">The requested blog could not be found.</p>
          <p-button
            label="Back to Blogs"
            icon="pi pi-arrow-left"
            (onClick)="goBack()">
          </p-button>
        </div>
      </p-card>
    </div>

    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>
  `,
  styles: [`
    .blog-detail-container {
      padding: 1rem;
      max-width: 1200px;
      margin: 0 auto;
      overflow-x: hidden; /* Prevent horizontal overflow */
    }

    .blog-card {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden; /* Contain all content */
    }

    .blog-header {
      padding: 1.5rem;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      border-bottom: 1px solid #e2e8f0;
    }

    .blog-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1a202c;
      line-height: 1.2;
      word-wrap: break-word; /* Break long words */
      overflow-wrap: break-word; /* Modern browsers */
      word-break: break-word; /* Fallback for older browsers */
    }

    .blog-meta {
      color: #4a5568;
    }

    .author {
      font-weight: 500;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    .blog-content {
      padding: 1.5rem;
      overflow-x: auto; /* Allow horizontal scroll if needed */
    }

    .blog-excerpt {
      background: #f7fafc;
      padding: 1rem;
      border-radius: 0.5rem;
      border-left: 4px solid #4299e1;
    }

    .content-wrapper {
      line-height: 1.8;
      color: #2d3748;
      word-wrap: break-word;
      overflow-wrap: break-word;
      max-width: 100%;
    }

    /* Quill viewer specific styles */
    .content-wrapper :deep(.ql-editor) {
      padding: 0;
      font-size: 1rem;
      line-height: 1.8;
      color: #2d3748;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    .content-wrapper :deep(.ql-editor.ql-blank::before) {
      content: 'No content available';
      color: #9ca3af;
      font-style: italic;
    }

    /* Override quill's default styles for better integration */
    .content-wrapper :deep(.ql-container) {
      border: none;
      font-family: inherit;
    }

    .content-wrapper :deep(.ql-editor p) {
      margin-bottom: 1rem;
    }

    .content-wrapper :deep(.ql-editor h1),
    .content-wrapper :deep(.ql-editor h2),
    .content-wrapper :deep(.ql-editor h3),
    .content-wrapper :deep(.ql-editor h4),
    .content-wrapper :deep(.ql-editor h5),
    .content-wrapper :deep(.ql-editor h6) {
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      font-weight: 600;
    }

    .content-wrapper :deep(.ql-editor ul),
    .content-wrapper :deep(.ql-editor ol) {
      margin-bottom: 1rem;
      padding-left: 1.5rem;
    }

    .content-wrapper :deep(.ql-editor blockquote) {
      border-left: 4px solid #e2e8f0;
      padding-left: 1rem;
      margin: 1rem 0;
      font-style: italic;
      color: #4a5568;
    }

    .content-wrapper :deep(.ql-editor img) {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 1rem 0;
    }

    .content-wrapper :deep(.ql-editor pre) {
      background: #2d3748;
      color: #e2e8f0;
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
      margin: 1rem 0;
      max-width: 100%;
      white-space: pre-wrap;
    }

    .content-wrapper :deep(.ql-editor code) {
      background: #f7fafc;
      padding: 0.125rem 0.25rem;
      border-radius: 0.25rem;
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 0.875rem;
    }

    .blog-tags {
      border-top: 1px solid #e2e8f0;
      padding-top: 1rem;
    }

    :host ::ng-deep .p-card .p-card-body {
      padding: 0;
    }

    :host ::ng-deep .p-divider {
      margin: 1rem 0;
    }

    @media (max-width: 768px) {
      .blog-detail-container {
        padding: 0.5rem;
      }

      .blog-title {
        font-size: 1.5rem;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }

      .blog-header,
      .blog-content {
        padding: 1rem;
      }

      .content-wrapper :deep(pre) {
        font-size: 0.75rem;
        padding: 0.5rem;
      }

      .content-wrapper :deep(code) {
        font-size: 0.75rem;
      }
    }
  `]
})
export class BlogDetailComponent implements OnInit {
  blog: Blog | null = null;
  loading = false;
  publishing = false;
  unpublishing = false;
  currentUser: User | null = null;
  canPublish = false;

  // Make BlogStatus available in template
  BlogStatus = BlogStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.canPublish = user?.role === 'Publisher' || user?.role === 'publisher';
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBlog(id);
    }
  }

  loadBlog(id: string) {
    this.loading = true;
    this.cdr.detectChanges(); // Force change detection for loading state
    this.blogService.getBlogById(id).subscribe({
      next: (blog) => {
        this.blog = blog;
        this.loading = false;
        this.cdr.detectChanges(); // Force change detection after data load
      },
      error: (error) => {
        console.error('Error loading blog:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load blog details'
        });
        this.loading = false;
        this.cdr.detectChanges(); // Force change detection on error
      }
    });
  }

  publishBlog() {
    if (!this.blog) return;

    this.confirmationService.confirm({
      message: `Are you sure you want to publish "${this.blog.title}"?`,
      header: 'Confirm Publication',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Yes, Publish',
      rejectLabel: 'Cancel',
      accept: () => {
        this.publishing = true;
        this.cdr.detectChanges(); // Update UI immediately
        this.blogService.publishBlog(this.blog!._id).subscribe({
          next: (updatedBlog) => {
            this.blog = updatedBlog;
            this.publishing = false;
            this.cdr.detectChanges(); // Force change detection
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Blog published successfully'
            });
          },
          error: (error) => {
            console.error('Error publishing blog:', error);
            this.publishing = false;
            this.cdr.detectChanges(); // Force change detection on error
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to publish blog'
            });
          }
        });
      }
    });
  }

  unpublishBlog() {
    if (!this.blog) return;

    this.confirmationService.confirm({
      message: `Are you sure you want to unpublish "${this.blog.title}"?`,
      header: 'Confirm Unpublication',
      icon: 'pi pi-times-circle',
      acceptLabel: 'Yes, Unpublish',
      rejectLabel: 'Cancel',
      accept: () => {
        this.unpublishing = true;
        this.cdr.detectChanges(); // Update UI immediately
        this.blogService.unpublishBlog(this.blog!._id).subscribe({
          next: (updatedBlog) => {
            this.blog = updatedBlog;
            this.unpublishing = false;
            this.cdr.detectChanges(); // Force change detection
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Blog unpublished successfully'
            });
          },
          error: (error) => {
            console.error('Error unpublishing blog:', error);
            this.unpublishing = false;
            this.cdr.detectChanges(); // Force change detection on error
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to unpublish blog'
            });
          }
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/apps/blogs']);
  }

  getStatusDisplayText(status: BlogStatus): string {
    switch (status) {
      case BlogStatus.PUBLISHED:
        return 'Published';
      case BlogStatus.IN_REVIEW:
        return 'In Review';
      case BlogStatus.DRAFT:
        return 'Draft';
      default:
        return 'Draft';
    }
  }

  getStatusSeverity(status: BlogStatus): 'success' | 'info' | 'warning' | 'danger' {
    switch (status) {
      case BlogStatus.PUBLISHED:
        return 'success';
      case BlogStatus.IN_REVIEW:
        return 'info';
      case BlogStatus.DRAFT:
        return 'warning';
      default:
        return 'info';
    }
  }
}
