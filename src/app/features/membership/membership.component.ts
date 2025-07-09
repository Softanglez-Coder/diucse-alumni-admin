import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CrudListComponent, CrudConfig } from '../../shared/components/crud-list.component';
import { MembershipService } from './membership.service';

@Component({
  selector: 'app-membership',
  standalone: true,
  imports: [CommonModule, RouterModule, CrudListComponent],
  template: `
    <app-crud-list [config]="crudConfig"></app-crud-list>
  `
})
export class MembershipComponent implements OnInit {
  crudConfig: CrudConfig = {
    title: 'Membership Management',
    apiEndpoint: '/memberships',
    columns: [
      { field: 'id', header: 'ID', type: 'text', sortable: true },
      { field: 'memberName', header: 'Member Name', type: 'text', sortable: true },
      { field: 'membershipType', header: 'Membership Type', type: 'text', sortable: true },
      { field: 'startDate', header: 'Start Date', type: 'date', sortable: true },
      { field: 'endDate', header: 'End Date', type: 'date', sortable: true },
      { field: 'status', header: 'Status', type: 'status', sortable: true },
      { field: 'fees', header: 'Fees', type: 'text', sortable: true },
      { field: 'actions', header: 'Actions', type: 'actions', width: '120px' }
    ],
    searchFields: ['memberName', 'membershipType', 'status'],
    createRoute: '/apps/membership/new',
    editRoute: '/apps/membership',
    viewRoute: '/apps/membership'
  };

  constructor(private membershipService: MembershipService) {}

  ngOnInit() {
    // Component initialization logic can be added here if needed
  }
}
