import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CrudListComponent, CrudConfig } from '../../shared/components/crud-list.component';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, RouterModule, CrudListComponent],
  template: `<div class="p-6"><app-crud-list [config]="crudConfig"></app-crud-list></div>`
})
export class NewsComponent implements OnInit {
  crudConfig: CrudConfig = {
    title: 'News',
    apiEndpoint: '/api/news',
    createRoute: '/apps/news/new',
    editRoute: '/apps/news',
    viewRoute: '/apps/news',
    searchFields: ['title', 'category'],
    columns: [
      { field: 'title', header: 'Title', type: 'text', sortable: true, filterable: true },
      { field: 'category', header: 'Category', type: 'badge', sortable: true },
      { field: 'status', header: 'Status', type: 'status', width: '100px' },
      { field: 'publishedAt', header: 'Published', type: 'date', sortable: true, width: '150px' },
      { field: 'actions', header: 'Actions', type: 'actions', width: '150px' }
    ]
  };
  ngOnInit() {}
}
