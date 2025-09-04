import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  CrudListComponent,
  CrudConfig,
} from '../../shared/components/crud-list.component';

@Component({
  selector: 'app-batches',
  standalone: true,
  imports: [CommonModule, RouterModule, CrudListComponent],
  template: `
    <div class="p-6">
      <app-crud-list [config]="crudConfig"></app-crud-list>
    </div>
  `,
})
export class BatchesComponent implements OnInit {
  crudConfig: CrudConfig = {
    title: 'Batches',
    apiEndpoint: '/batches',
    createRoute: '/apps/batches/new',
    editRoute: '/apps/batches',
    viewRoute: '/apps/batches',
    searchFields: ['name'],
    columns: [
      {
        field: 'name',
        header: 'Name',
        type: 'text',
        sortable: true,
        filterable: true,
      },
      {
        field: 'actions',
        header: 'Actions',
        type: 'actions',
        width: '150px',
      },
    ],
  };

  ngOnInit() {
    // Component initialization handled by CrudListComponent
  }
}
