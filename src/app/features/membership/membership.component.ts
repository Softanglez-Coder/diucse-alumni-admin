import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  CrudListComponent,
  CrudConfig,
} from '../../shared/components/crud-list.component';
import { MembershipService } from './membership.service';

@Component({
  selector: 'app-membership',
  standalone: true,
  imports: [CommonModule, RouterModule, CrudListComponent],
  template: ` <app-crud-list [config]="crudConfig"></app-crud-list> `,
})
export class MembershipComponent implements OnInit {
  crudConfig: CrudConfig = {
    title: 'Membership Management',
    apiEndpoint: '/memberships',
    columns: [
      {
        field: 'user.name',
        header: 'Member Name',
        type: 'text',
        sortable: true,
      },
      { field: 'user.email', header: 'Email', type: 'text', sortable: true },
      {
        field: 'user.batch.name',
        header: 'Batch',
        type: 'text',
        sortable: true,
      },
      { field: 'user.phone', header: 'Phone', type: 'text', sortable: true },
      { field: 'status', header: 'Status', type: 'status', sortable: true },
      {
        field: 'user.emailVerified',
        header: 'Email Verified',
        type: 'badge',
        sortable: true,
      },
      {
        field: 'updatedAt',
        header: 'Updated Date',
        type: 'date',
        sortable: true,
      },
      { field: 'actions', header: 'Actions', type: 'actions', width: '120px' },
    ],
    searchFields: ['user.name', 'user.email', 'status'],
    createRoute: '/apps/membership/new',
    editRoute: '/apps/membership',
    viewRoute: '/apps/membership',
    disableEdit: true,
    disableDelete: true,
  };

  constructor(private membershipService: MembershipService) {}

  ngOnInit() {
    // Component initialization logic can be added here if needed
  }
}
