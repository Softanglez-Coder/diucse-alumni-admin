import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CrudListComponent, CrudConfig } from '../../shared/components/crud-list.component';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, RouterModule, CrudListComponent],
  template: `<div class="p-6"><app-crud-list [config]="crudConfig"></app-crud-list></div>`
})
export class JobsComponent {
  crudConfig: CrudConfig = {
    title: 'Job Postings',
    apiEndpoint: '/api/jobs',
    createRoute: '/apps/jobs/new',
    editRoute: '/apps/jobs',
    viewRoute: '/apps/jobs',
    searchFields: ['title', 'company', 'location'],
    columns: [
      { field: 'title', header: 'Title', type: 'text', sortable: true, filterable: true },
      { field: 'company', header: 'Company', type: 'text', sortable: true },
      { field: 'location', header: 'Location', type: 'text', sortable: true },
      { field: 'status', header: 'Status', type: 'status', width: '100px' },
      { field: 'postedAt', header: 'Posted', type: 'date', sortable: true, width: '150px' },
      { field: 'actions', header: 'Actions', type: 'actions', width: '150px' }
    ]
  };
}
