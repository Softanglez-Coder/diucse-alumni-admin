import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CrudListComponent, CrudConfig } from '../../shared/components/crud-list.component';

export interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  link: string;
  isActive: boolean;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-banners',
  standalone: true,
  imports: [CommonModule, RouterModule, CrudListComponent],
  template: `
    <div class="p-6">
      <app-crud-list [config]="crudConfig"></app-crud-list>
    </div>
  `
})
export class BannersComponent implements OnInit {
  crudConfig: CrudConfig = {
    title: 'Banners',
    apiEndpoint: '/api/banners',
    createRoute: '/apps/banners/new',
    editRoute: '/apps/banners',
    viewRoute: '/apps/banners',
    searchFields: ['title', 'link'],
    columns: [
      { 
        field: 'title', 
        header: 'Title', 
        type: 'text',
        sortable: true,
        filterable: true
      },
      { 
        field: 'link', 
        header: 'Link', 
        type: 'text',
        sortable: true
      },
      { 
        field: 'position', 
        header: 'Position', 
        type: 'text',
        width: '100px',
        sortable: true
      },
      { 
        field: 'isActive', 
        header: 'Status', 
        type: 'status',
        width: '100px'
      },
      { 
        field: 'createdAt', 
        header: 'Created', 
        type: 'date',
        width: '150px',
        sortable: true
      },
      { 
        field: 'actions', 
        header: 'Actions', 
        type: 'actions',
        width: '150px'
      }
    ]
  };

  ngOnInit() {
    // Component initialization handled by CrudListComponent
  }
}
