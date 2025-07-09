import { Component } from '@angular/core';
import { CrudListComponent, CrudConfig } from '../../shared/components/crud-list.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CrudListComponent],
  template: `
    <app-crud-list [config]="crudConfig"></app-crud-list>
  `
})
export class UsersComponent {
  crudConfig: CrudConfig = {
    title: 'Users',
    apiEndpoint: '/api/users',
    createRoute: '/apps/users/new',
    editRoute: '/apps/users',
    viewRoute: '/apps/users',
    searchFields: ['name', 'email', 'batch', 'designation'],
    columns: [
      { field: 'name', header: 'Name', type: 'text', sortable: true, filterable: true },
      { field: 'email', header: 'Email', type: 'text', sortable: true, filterable: true },
      { field: 'batch', header: 'Batch', type: 'badge', sortable: true },
      { field: 'designation', header: 'Designation', type: 'text', sortable: true },
      { field: 'status', header: 'Status', type: 'status', sortable: true },
      { field: 'createdAt', header: 'Created', type: 'date', sortable: true },
      { field: 'actions', header: 'Actions', type: 'actions', width: '120px' }
    ]
  };
}
