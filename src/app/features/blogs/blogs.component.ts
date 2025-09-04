import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { Blog, BlogService, BlogStatus } from './blog.service';
import { AuthService, User } from '../../core/services/auth.service';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
    CardModule,
    ToolbarModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="blogs-container">
      <p-card>
        <ng-template pTemplate="header">
          <p-toolbar>
            <ng-template pTemplate="left">
              <h2 class="m-0">Blog Management</h2>
            </ng-template>
            <ng-template pTemplate="right">
              <div class="flex align-items-center gap-2">
                <span class="p-input-icon-left">
                  <i class="pi pi-search"></i>
                  <input
                    pInputText
                    type="text"
                    placeholder="Search blogs..."
                    [(ngModel)]="searchValue"
                    (input)="onGlobalFilter($event)"
                    class="w-full sm:w-auto"
                  />
                </span>
              </div>
            </ng-template>
          </p-toolbar>
        </ng-template>

        <p-table
          #dt
          [value]="blogs"
          [loading]="loading"
          [paginator]="true"
          [rows]="10"
          [rowsPerPageOptions]="[5, 10, 20]"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          [globalFilterFields]="['title', 'author.name', 'status']"
          responsiveLayout="scroll"
          styleClass="p-datatable-striped">

          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="title">
                Title <p-sortIcon field="title"></p-sortIcon>
              </th>
              <th pSortableColumn="author.name">
                Author <p-sortIcon field="author.name"></p-sortIcon>
              </th>
              <th pSortableColumn="status">
                Status <p-sortIcon field="status"></p-sortIcon>
              </th>
              <th pSortableColumn="createdAt">
                Created <p-sortIcon field="createdAt"></p-sortIcon>
              </th>
              <th>Actions</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-blog>
            <tr>
              <td>
                <div class="flex flex-column">
                  <span class="font-semibold">{{ blog.title }}</span>
                  <span class="text-sm text-500" *ngIf="blog.excerpt">
                    {{ blog.excerpt | slice:0:80 }}{{ blog.excerpt.length > 80 ? '...' : '' }}
                  </span>
                </div>
              </td>
              <td>
                <div class="flex flex-column">
                  <span class="font-medium">{{ blog.author.name }}</span>
                  <span class="text-sm text-500">{{ blog.author.email }}</span>
                </div>
              </td>
              <td>
                <p-tag
                  [value]="getStatusDisplayText(blog.status)"
                  [severity]="getStatusSeverity(blog.status)">
                </p-tag>
              </td>
              <td>
                {{ blog.createdAt | date:'short' }}
              </td>
              <td>
                <div class="flex align-items-center gap-2">
                  <p-button
                    icon="pi pi-eye"
                    severity="info"
                    size="small"
                    [text]="true"
                    (onClick)="viewBlog(blog)"
                    pTooltip="View Details">
                  </p-button>

                  <p-button
                    *ngIf="canPublish && blog.status !== BlogStatus.PUBLISHED"
                    icon="pi pi-check-circle"
                    severity="success"
                    size="small"
                    [text]="true"
                    (onClick)="publishBlog(blog)"
                    pTooltip="Publish Blog"
                    [loading]="publishingIds.has(blog._id)">
                  </p-button>

                  <p-button
                    *ngIf="canPublish && blog.status === BlogStatus.PUBLISHED"
                    icon="pi pi-times-circle"
                    severity="warn"
                    size="small"
                    [text]="true"
                    (onClick)="unpublishBlog(blog)"
                    pTooltip="Unpublish Blog"
                    [loading]="unpublishingIds.has(blog._id)">
                  </p-button>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="5" class="text-center p-4">
                <div class="flex flex-column align-items-center gap-3">
                  <i class="pi pi-inbox text-4xl text-400"></i>
                  <span class="text-lg">No blogs found</span>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>

    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>
  `,
  styles: [`
    .blogs-container {
      padding: 1rem;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
      padding: 1rem 0.75rem;
    }

    :host ::ng-deep .p-card .p-card-body {
      padding: 0;
    }

    :host ::ng-deep .p-card .p-card-header {
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    :host ::ng-deep .p-datatable {
      border-radius: 0;
    }

    :host ::ng-deep .p-toolbar {
      background: transparent;
      border: none;
      padding: 0;
    }

    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .status-draft {
      background: #f3f4f6;
      color: #6b7280;
    }

    .status-review {
      background: #fef3c7;
      color: #d97706;
    }

    .status-published {
      background: #d1fae5;
      color: #059669;
    }

    .status-unpublished {
      background: #fee2e2;
      color: #dc2626;
    }
  `]
})
export class BlogsComponent implements OnInit {
  blogs: Blog[] = [];
  loading = false;
  searchValue = '';
  currentUser: User | null = null;
  canPublish = false;
  publishingIds = new Set<string>();
  unpublishingIds = new Set<string>();

  // Make BlogStatus available in template
  BlogStatus = BlogStatus;

  constructor(
    private blogService: BlogService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.canPublish = user?.role === 'Publisher' || user?.role === 'publisher';
    });

    this.loadBlogs();
  }

  loadBlogs() {
    this.loading = true;
    this.cdr.detectChanges(); // Force change detection for loading state

    this.blogService.getAllBlogs().subscribe({
      next: (blogs) => {
        this.blogs = blogs;
        this.loading = false;
        this.cdr.detectChanges(); // Force change detection after data load
      },
      error: (error) => {
        console.error('Error loading blogs:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load blogs'
        });
        this.loading = false;
        this.cdr.detectChanges(); // Force change detection on error
      }
    });
  }

  viewBlog(blog: Blog) {
    this.router.navigate(['/apps/blogs', blog._id]);
  }

  publishBlog(blog: Blog) {
    this.confirmationService.confirm({
      message: `Are you sure you want to publish "${blog.title}"?`,
      header: 'Confirm Publication',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Yes, Publish',
      rejectLabel: 'Cancel',
      accept: () => {
        this.publishingIds.add(blog._id);
        this.cdr.detectChanges(); // Update UI immediately

        this.blogService.publishBlog(blog._id).subscribe({
          next: (updatedBlog) => {
            const index = this.blogs.findIndex(b => b._id === blog._id);
            if (index !== -1) {
              this.blogs[index] = updatedBlog;
            }
            this.publishingIds.delete(blog._id);
            this.cdr.detectChanges(); // Force change detection
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Blog published successfully'
            });
          },
          error: (error) => {
            console.error('Error publishing blog:', error);
            this.publishingIds.delete(blog._id);
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

  unpublishBlog(blog: Blog) {
    this.confirmationService.confirm({
      message: `Are you sure you want to unpublish "${blog.title}"?`,
      header: 'Confirm Unpublication',
      icon: 'pi pi-times-circle',
      acceptLabel: 'Yes, Unpublish',
      rejectLabel: 'Cancel',
      accept: () => {
        this.unpublishingIds.add(blog._id);
        this.cdr.detectChanges(); // Update UI immediately

        this.blogService.unpublishBlog(blog._id).subscribe({
          next: (updatedBlog) => {
            const index = this.blogs.findIndex(b => b._id === blog._id);
            if (index !== -1) {
              this.blogs[index] = updatedBlog;
            }
            this.unpublishingIds.delete(blog._id);
            this.cdr.detectChanges(); // Force change detection
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Blog unpublished successfully'
            });
          },
          error: (error) => {
            console.error('Error unpublishing blog:', error);
            this.unpublishingIds.delete(blog._id);
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

  onGlobalFilter(event: any) {
    const value = (event.target as HTMLInputElement).value;
    // This will be handled by the table's global filter
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
