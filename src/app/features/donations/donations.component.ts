import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CrudListComponent, CrudConfig } from '../../shared/components/crud-list.component';

@Component({
  selector: 'app-donations',
  standalone: true,
  imports: [CommonModule, RouterModule, CrudListComponent],
  template: `<div class="p-6"><app-crud-list [config]="crudConfig"></app-crud-list></div>`
})
export class DonationsComponent {
  crudConfig: CrudConfig = {
    title: 'Donations',
    apiEndpoint: '/api/donations',
    createRoute: '/apps/donations/new',
    editRoute: '/apps/donations',
    viewRoute: '/apps/donations',
    searchFields: ['donor', 'purpose', 'amount'],
    columns: [
      { field: 'donor', header: 'Donor', type: 'text', sortable: true, filterable: true },
      { field: 'amount', header: 'Amount', type: 'text', sortable: true },
      { field: 'purpose', header: 'Purpose', type: 'text', sortable: true },
      { field: 'status', header: 'Status', type: 'status', width: '100px' },
      { field: 'donatedAt', header: 'Date', type: 'date', sortable: true, width: '150px' },
      { field: 'actions', header: 'Actions', type: 'actions', width: '150px' }
    ]
  };
}
