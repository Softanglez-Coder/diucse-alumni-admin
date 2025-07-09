import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CrudListComponent, CrudConfig } from '../../shared/components/crud-list.component';

@Component({
  selector: 'app-batches',
  standalone: true,
  imports: [CommonModule, RouterModule, CrudListComponent],
  template: `
    <div class="p-6">
      <app-crud-list [config]="crudConfig"></app-crud-list>
    </div>
  `
})
export class BatchesComponent implements OnInit {
  crudConfig: CrudConfig = {
    title: 'Batches',
    apiEndpoint: '/api/batches',
    createRoute: '/apps/batches/new',
    editRoute: '/apps/batches',
    viewRoute: '/apps/batches',
    searchFields: ['name', 'year', 'program'],
    columns: [
      { 
        field: 'name', 
        header: 'Name', 
        type: 'text',
        sortable: true,
        filterable: true
      },
      { 
        field: 'year', 
        header: 'Year', 
        type: 'text',
        sortable: true,
        width: '100px'
      },
      { 
        field: 'program', 
        header: 'Program', 
        type: 'text',
        sortable: true
      },
      { 
        field: 'studentCount', 
        header: 'Students', 
        type: 'text',
        width: '100px'
      },
      { 
        field: 'status', 
        header: 'Status', 
        type: 'status',
        width: '100px'
      },
      { 
        field: 'graduationDate', 
        header: 'Graduation', 
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
