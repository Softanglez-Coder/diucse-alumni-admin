import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService, ApiResponse } from '../../core/services/api.service';

export interface CrudConfig {
  title: string;
  apiEndpoint: string;
  columns: ColumnConfig[];
  searchFields: string[];
  createRoute: string;
  editRoute: string;
  viewRoute: string;
  disableEdit?: boolean;
  disableDelete?: boolean;
  disableCreate?: boolean;
}

export interface ColumnConfig {
  field: string;
  header: string;
  type: 'text' | 'date' | 'status' | 'badge' | 'image' | 'actions';
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
}

@Component({
  selector: 'app-crud-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
    ToolbarModule,
    TooltipModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="crud-container">
      <div class="crud-header">
        <h1 class="crud-title">{{config.title}}</h1>
        <button
          *ngIf="!config.disableCreate"
          pButton
          label="Add New"
          icon="pi pi-plus"
          class="p-button-success"
          [routerLink]="config.createRoute">
        </button>
      </div>

      <p-card>
        <p-toolbar>
          <div class="p-toolbar-group-left">
            <span class="p-input-icon-left">
              <i class="pi pi-search"></i>
              <input
                type="text"
                pInputText
                placeholder="Search..."
                [(ngModel)]="searchValue"
                (input)="onSearch()"
                class="p-inputtext-sm">
            </span>
          </div>
          <div class="p-toolbar-group-right">
            <button
              pButton
              label="Export"
              icon="pi pi-download"
              class="p-button-outlined p-button-sm mr-2"
              (click)="exportData()">
            </button>
            <button
              pButton
              label="Refresh"
              icon="pi pi-refresh"
              class="p-button-outlined p-button-sm"
              (click)="loadData()">
            </button>
          </div>
        </p-toolbar>

        <p-table
          [value]="filteredData"
          [rows]="rows"
          [paginator]="true"
          [loading]="loading"
          responsiveLayout="scroll"
          [first]="first"
          [totalRecords]="totalRecords"
          (onPage)="onPageChange($event)">

          <ng-template pTemplate="header">
            <tr>
              <th *ngFor="let col of config.columns"
                  [style.width]="col.width">
                {{col.header}}
              </th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-item let-i="rowIndex">
            <tr>
              <td *ngFor="let col of config.columns">
                <ng-container [ngSwitch]="col.type">
                  <span *ngSwitchCase="'text'">{{getNestedValue(item, col.field)}}</span>
                  <span *ngSwitchCase="'date'">{{getNestedValue(item, col.field) | date:'short'}}</span>
                  <div *ngSwitchCase="'image'" class="image-cell">
                    <img
                      *ngIf="getNestedValue(item, col.field)"
                      [src]="getNestedValue(item, col.field)"
                      [alt]="item.title || 'Image'"
                      class="table-image"
                      (error)="onImageError($event)">
                    <span *ngIf="!getNestedValue(item, col.field)" class="text-gray-400 text-sm">No image</span>
                  </div>
                  <p-tag
                    *ngSwitchCase="'status'"
                    [value]="formatStatusValue(getNestedValue(item, col.field))"
                    [severity]="getStatusSeverity(getNestedValue(item, col.field))">
                  </p-tag>
                  <p-tag
                    *ngSwitchCase="'badge'"
                    [value]="formatBadgeValue(getNestedValue(item, col.field))">
                  </p-tag>
                  <div *ngSwitchCase="'actions'" class="action-buttons">
                    <button
                      pButton
                      icon="pi pi-eye"
                      class="p-button-rounded p-button-text p-button-sm"
                      [routerLink]="[config.viewRoute, item._id]"
                      pTooltip="View">
                    </button>
                    <button
                      *ngIf="!config.disableEdit"
                      pButton
                      icon="pi pi-pencil"
                      class="p-button-rounded p-button-text p-button-sm"
                      [routerLink]="[config.editRoute, item._id]"
                      pTooltip="Edit">
                    </button>
                    <button
                      *ngIf="!config.disableDelete"
                      pButton
                      icon="pi pi-trash"
                      class="p-button-rounded p-button-text p-button-sm p-button-danger"
                      (click)="confirmDelete(item)"
                      pTooltip="Delete">
                    </button>
                  </div>
                  <span *ngSwitchDefault>{{getNestedValue(item, col.field)}}</span>
                </ng-container>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td [attr.colspan]="config.columns.length" class="text-center">
                <div class="empty-state">
                  <i class="pi pi-info-circle text-4xl text-gray-400 mb-4"></i>
                  <h3 class="text-lg font-semibold text-gray-600 mb-2">No data found</h3>
                  <p class="text-gray-500 mb-4">Get started by adding your first item</p>
                  <button
                    *ngIf="!config.disableCreate"
                    pButton
                    label="Add New"
                    icon="pi pi-plus"
                    [routerLink]="config.createRoute">
                  </button>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>

    <p-confirmDialog></p-confirmDialog>
    <p-toast></p-toast>
  `,
  styles: [`
    .crud-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .crud-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .crud-title {
      font-size: 1.875rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .image-cell {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .table-image {
      width: 60px;
      height: 40px;
      object-fit: cover;
      border-radius: 4px;
      border: 1px solid #e5e7eb;
    }

    .empty-state {
      padding: 3rem;
      text-align: center;
    }

    :host ::ng-deep .p-toolbar {
      border: none;
      background: transparent;
      padding: 0 0 1rem 0;
    }

    :host ::ng-deep .p-card-content {
      padding: 1.5rem;
    }

    :host ::ng-deep .p-table .p-datatable-thead > tr > th {
      background: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
      color: #374151;
      font-weight: 600;
      padding: 1rem;
    }

    :host ::ng-deep .p-table .p-datatable-tbody > tr > td {
      padding: 1rem;
      border-bottom: 1px solid #f3f4f6;
    }

    :host ::ng-deep .p-table .p-datatable-tbody > tr:hover {
      background: #f9fafb;
    }

    @media (max-width: 768px) {
      .crud-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .crud-title {
        text-align: center;
      }
    }
  `]
})
export class CrudListComponent implements OnInit {
  @Input() config!: CrudConfig;

  data: any[] = [];
  filteredData: any[] = [];
  loading = false;
  searchValue = '';
  totalRecords = 0;
  first = 0;
  rows = 10;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    this.apiService.get<any>(this.config.apiEndpoint).subscribe({
      next: (response) => {
        // Handle different response formats
        let dataArray: any[] = [];
        if (Array.isArray(response)) {
          dataArray = response;
        } else if (response && typeof response === 'object') {
          // Check if it's wrapped in a data property
          if ('data' in response && Array.isArray((response as any).data)) {
            dataArray = (response as any).data;
          } else if ('items' in response && Array.isArray((response as any).items)) {
            dataArray = (response as any).items;
          } else {
            console.warn('Unexpected response format:', response);
            dataArray = [];
          }
        }

        // Update data in next tick to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.data = dataArray;
          this.filteredData = [...this.data];
          this.totalRecords = this.data.length;
          this.loading = false;
          this.cdr.detectChanges(); // Manually trigger change detection
        }, 0);
      },
      error: (error) => {
        console.error('Error loading data:', error);

        let errorMessage = 'Failed to load data from server';
        if (error.status === 0) {
          errorMessage = 'Unable to connect to server. Please check if the server is running.';
        } else if (error.status === 404) {
          errorMessage = 'API endpoint not found. Please check the endpoint URL.';
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage
        });

        setTimeout(() => {
          this.data = [];
          this.filteredData = [];
          this.totalRecords = 0;
          this.loading = false;
          this.cdr.detectChanges(); // Manually trigger change detection
        }, 0);
      }
    });
  }

  onSearch() {
    if (!this.searchValue) {
      setTimeout(() => {
        this.filteredData = [...this.data];
        this.totalRecords = this.data.length;
        this.first = 0;
        this.cdr.detectChanges(); // Manually trigger change detection
      }, 0);
      return;
    }

    const filtered = this.data.filter(item =>
      this.config.searchFields.some(field => {
        const value = this.getNestedValue(item, field);
        return value?.toString().toLowerCase().includes(this.searchValue.toLowerCase());
      })
    );

    setTimeout(() => {
      this.filteredData = filtered;
      this.totalRecords = this.filteredData.length;
      this.first = 0; // Reset to first page when searching
      this.cdr.detectChanges(); // Manually trigger change detection
    }, 0);
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  formatStatusValue(value: any): string {
    if (typeof value === 'boolean') {
      return value ? 'Active' : 'Inactive';
    }
    return value?.toString() || 'Unknown';
  }

  formatBadgeValue(value: any): string {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return value?.toString() || '';
  }

  confirmDelete(item: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this item?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteItem(item);
      }
    });
  }

  deleteItem(item: any) {
    this.loading = true;

    this.apiService.delete<any>(`${this.config.apiEndpoint}/${item._id}`).subscribe({
      next: (response) => {
        setTimeout(() => {
          this.data = this.data.filter(d => d._id !== item._id);
          this.filteredData = this.filteredData.filter(d => d._id !== item._id);
          this.totalRecords = this.filteredData.length;
          this.loading = false;
          this.cdr.detectChanges(); // Manually trigger change detection
        }, 0);

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Item deleted successfully'
        });
      },
      error: (error) => {
        console.error('Error deleting item:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete item from server'
        });
        this.loading = false;
      }
    });
  }

  exportData() {
    // Try to export data, fallback to client-side export if server doesn't support it
    this.apiService.get<any[]>(`${this.config.apiEndpoint}/export`).subscribe({
      next: (response) => {
        this.exportToCSV(response);
      },
      error: (error) => {
        console.log('Server export not available, using client-side export');
        this.exportToCSV(this.data);
      }
    });
  }

  private exportToCSV(data: any[]) {
    if (!data || data.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Export',
        detail: 'No data to export'
      });
      return;
    }

    const headers = this.config.columns
      .filter(col => col.type !== 'actions')
      .map(col => col.header);

    const csvContent = [
      headers.join(','),
      ...data.map(item =>
        this.config.columns
          .filter(col => col.type !== 'actions')
          .map(col => {
            const value = this.getNestedValue(item, col.field);
            let formattedValue = value;

            if (Array.isArray(value)) {
              formattedValue = value.join('; ');
            } else if (typeof value === 'boolean') {
              formattedValue = value ? 'Yes' : 'No';
            } else if (value == null) {
              formattedValue = '';
            }

            return typeof formattedValue === 'string' ? `"${formattedValue}"` : formattedValue;
          })
          .join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.config.title.toLowerCase().replace(/\s+/g, '-')}-export.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Data exported successfully'
    });
  }

  getStatusSeverity(status: string | boolean): 'success' | 'warning' | 'danger' | 'info' {
    // Handle boolean values
    if (typeof status === 'boolean') {
      return status ? 'success' : 'danger';
    }

    // Handle string values
    switch (status?.toLowerCase()) {
      case 'active':
      case 'published':
      case 'approved':
      case 'true':
        return 'success';
      case 'pending':
      case 'draft':
        return 'warning';
      case 'inactive':
      case 'rejected':
      case 'cancelled':
      case 'false':
        return 'danger';
      default:
        return 'info';
    }
  }

  onImageError(event: any) {
    // Hide broken images and show a placeholder
    event.target.style.display = 'none';
    const parent = event.target.parentElement;
    if (parent && !parent.querySelector('.image-error')) {
      const errorSpan = document.createElement('span');
      errorSpan.className = 'image-error text-gray-400 text-xs';
      errorSpan.textContent = 'Image unavailable';
      parent.appendChild(errorSpan);
    }
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    // For client-side pagination, we don't need to reload data
    // For server-side pagination, you would call loadData() with pagination parameters
  }

}
