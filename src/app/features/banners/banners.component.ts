import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CrudListComponent, CrudConfig } from '../../shared/components/crud-list.component';
import { Banner } from './banner.service';

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
    apiEndpoint: '/banners',
    createRoute: '/apps/banners/new',
    editRoute: '/apps/banners',
    viewRoute: '/apps/banners',
    searchFields: ['title', 'description', 'link'],
    columns: [
      {
        field: 'title',
        header: 'Title',
        type: 'text',
        sortable: true,
        filterable: true
      },
      {
        field: 'description',
        header: 'Description',
        type: 'text',
        sortable: true
      },
      {
        field: 'image',
        header: 'Image',
        type: 'image',
        width: '120px'
      },
      {
        field: 'link',
        header: 'Link',
        type: 'text',
        sortable: true
      },
      {
        field: 'order',
        header: 'Order',
        type: 'text',
        width: '100px',
        sortable: true
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
