import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CrudListComponent, CrudConfig } from '../../shared/components/crud-list.component';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule, RouterModule, CrudListComponent],
  template: `
    <div class="p-6">
      <app-crud-list [config]="crudConfig"></app-crud-list>
    </div>
  `
})
export class BlogsComponent implements OnInit {
  crudConfig: CrudConfig = {
    title: 'Blog Posts',
    apiEndpoint: '/api/blogs',
    createRoute: '/apps/blogs/new',
    editRoute: '/apps/blogs',
    viewRoute: '/apps/blogs',
    searchFields: ['title', 'author', 'category'],
    columns: [
      { 
        field: 'title', 
        header: 'Title', 
        type: 'text',
        sortable: true,
        filterable: true
      },
      { 
        field: 'author', 
        header: 'Author', 
        type: 'text',
        sortable: true
      },
      { 
        field: 'category', 
        header: 'Category', 
        type: 'badge',
        sortable: true
      },
      { 
        field: 'status', 
        header: 'Status', 
        type: 'status',
        width: '100px'
      },
      { 
        field: 'publishedAt', 
        header: 'Published', 
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
