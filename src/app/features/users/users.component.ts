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
    apiEndpoint: '/users',
    createRoute: '/apps/users/new',
    editRoute: '/apps/users',
    viewRoute: '/apps/users',
    searchFields: ['name', 'email', 'batch.name', 'phone', 'roles'],
    disableDelete: true,
    disableEdit: true,
    columns: [
      { field: 'name', header: 'Name', type: 'text', sortable: true, filterable: true },
      { field: 'email', header: 'Email', type: 'text', sortable: true, filterable: true },
      { field: 'batch.name', header: 'Batch', type: 'badge', sortable: true },
      { field: 'phone', header: 'Phone', type: 'text', sortable: true },
      { field: 'roles', header: 'Roles', type: 'badge', sortable: true },
      { field: 'emailVerified', header: 'Email Verified', type: 'status', sortable: true },
      { field: 'active', header: 'Status', type: 'status', sortable: true },
      { field: 'createdAt', header: 'Created', type: 'date', sortable: true },
      { field: 'actions', header: 'Actions', type: 'actions', width: '120px' }
    ]
  };
}
