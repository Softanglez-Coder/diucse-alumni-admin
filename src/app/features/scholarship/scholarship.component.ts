import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CrudListComponent, CrudConfig } from '../../shared/components/crud-list.component';

@Component({
  selector: 'app-scholarship',
  standalone: true,
  imports: [CommonModule, RouterModule, CrudListComponent],
  template: `<div class="p-6"><app-crud-list [config]="crudConfig"></app-crud-list></div>`
})
export class ScholarshipComponent {
  crudConfig: CrudConfig = {
    title: 'Scholarships',
    apiEndpoint: '/api/scholarships',
    createRoute: '/apps/scholarship/new',
    editRoute: '/apps/scholarship',
    viewRoute: '/apps/scholarship',
    searchFields: ['name', 'sponsor', 'amount'],
    columns: [
      { field: 'name', header: 'Name', type: 'text', sortable: true, filterable: true },
      { field: 'sponsor', header: 'Sponsor', type: 'text', sortable: true },
      { field: 'amount', header: 'Amount', type: 'text', sortable: true },
      { field: 'status', header: 'Status', type: 'status', width: '100px' },
      { field: 'deadline', header: 'Deadline', type: 'date', sortable: true, width: '150px' },
      { field: 'actions', header: 'Actions', type: 'actions', width: '150px' }
    ]
  };
}
