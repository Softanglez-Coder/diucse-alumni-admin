import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudListComponent, CrudConfig } from '../../shared/components/crud-list.component';

@Component({
  selector: 'app-committee-designations',
  standalone: true,
  imports: [CommonModule, CrudListComponent],
  template: `
    <app-crud-list [config]="crudConfig"></app-crud-list>
  `
})
export class CommitteeDesignationsComponent implements OnInit {
  crudConfig: CrudConfig = {
    title: 'Committee Designations',
    apiEndpoint: 'committee-designations',
    columns: [
      { field: 'name', header: 'Designation Name', type: 'text', sortable: true, filterable: true },
      { field: 'description', header: 'Description', type: 'text', sortable: false },
      { field: 'priority', header: 'Priority', type: 'text', sortable: true },
      { field: 'isActive', header: 'Status', type: 'status', sortable: true },
      { field: 'createdAt', header: 'Created', type: 'date', sortable: true },
      { field: 'actions', header: 'Actions', type: 'actions', width: '150px' }
    ],
    searchFields: ['name', 'description'],
    createRoute: '/apps/committee-designations/new',
    editRoute: '/apps/committee-designations/:id/edit',
    viewRoute: '/apps/committee-designations/:id'
  };

  constructor() {}

  ngOnInit(): void {}
}
