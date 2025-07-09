import { Component, Input, OnInit } from '@angular/core';
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

export interface CrudConfig {
  title: string;
  apiEndpoint: string;
  columns: ColumnConfig[];
  searchFields: string[];
  createRoute: string;
  editRoute: string;
  viewRoute: string;
}

export interface ColumnConfig {
  field: string;
  header: string;
  type: 'text' | 'date' | 'status' | 'badge' | 'actions';
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
          [rows]="10" 
          [paginator]="true" 
          [loading]="loading"
          [globalFilterFields]="config.searchFields"
          responsiveLayout="scroll"
          [scrollable]="true"
          scrollHeight="600px">
          
          <ng-template pTemplate="header">
            <tr>
              <th *ngFor="let col of config.columns" 
                  [pSortableColumn]="col.sortable ? col.field : undefined"
                  [style.width]="col.width">
                {{col.header}}
                <p-sortIcon 
                  *ngIf="col.sortable" 
                  [field]="col.field">
                </p-sortIcon>
              </th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-item>
            <tr>
              <td *ngFor="let col of config.columns">
                <ng-container [ngSwitch]="col.type">
                  <span *ngSwitchCase="'text'">{{item[col.field]}}</span>
                  <span *ngSwitchCase="'date'">{{item[col.field] | date:'short'}}</span>
                  <p-tag 
                    *ngSwitchCase="'status'" 
                    [value]="item[col.field]" 
                    [severity]="getStatusSeverity(item[col.field])">
                  </p-tag>
                  <p-tag 
                    *ngSwitchCase="'badge'" 
                    [value]="item[col.field]">
                  </p-tag>
                  <div *ngSwitchCase="'actions'" class="action-buttons">
                    <button 
                      pButton 
                      icon="pi pi-eye" 
                      class="p-button-rounded p-button-text p-button-sm"
                      [routerLink]="[config.viewRoute, item.id]"
                      pTooltip="View">
                    </button>
                    <button 
                      pButton 
                      icon="pi pi-pencil" 
                      class="p-button-rounded p-button-text p-button-sm"
                      [routerLink]="[config.editRoute, item.id]"
                      pTooltip="Edit">
                    </button>
                    <button 
                      pButton 
                      icon="pi pi-trash" 
                      class="p-button-rounded p-button-text p-button-sm p-button-danger"
                      (click)="confirmDelete(item)"
                      pTooltip="Delete">
                    </button>
                  </div>
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

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.data = this.generateMockData();
      this.filteredData = [...this.data];
      this.loading = false;
    }, 1000);
  }

  onSearch() {
    if (!this.searchValue) {
      this.filteredData = [...this.data];
      return;
    }

    this.filteredData = this.data.filter(item => 
      this.config.searchFields.some(field => 
        item[field]?.toString().toLowerCase().includes(this.searchValue.toLowerCase())
      )
    );
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
    this.data = this.data.filter(d => d.id !== item.id);
    this.filteredData = this.filteredData.filter(d => d.id !== item.id);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Item deleted successfully'
    });
  }

  exportData() {
    // Implement export functionality
    this.messageService.add({
      severity: 'info',
      summary: 'Export',
      detail: 'Export functionality will be implemented'
    });
  }

  getStatusSeverity(status: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'published':
      case 'approved':
        return 'success';
      case 'pending':
      case 'draft':
        return 'warning';
      case 'inactive':
      case 'rejected':
      case 'cancelled':
        return 'danger';
      default:
        return 'info';
    }
  }

  private generateMockData(): any[] {
    // Generate mock data based on config
    const mockData = [];
    for (let i = 1; i <= 25; i++) {
      const item: any = { id: i };
      
      this.config.columns.forEach(col => {
        switch (col.type) {
          case 'text':
            item[col.field] = `Sample ${col.field} ${i}`;
            break;
          case 'date':
            item[col.field] = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
            break;
          case 'status':
            item[col.field] = ['Active', 'Inactive', 'Pending'][Math.floor(Math.random() * 3)];
            break;
          case 'badge':
            item[col.field] = `Badge ${i}`;
            break;
        }
      });
      
      mockData.push(item);
    }
    
    return mockData;
  }
}
