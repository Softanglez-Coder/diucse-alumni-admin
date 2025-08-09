import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CrudListComponent, CrudConfig } from '../../shared/components/crud-list.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, RouterModule, CrudListComponent],
  template: `
    <div class="p-6">
      <app-crud-list [config]="crudConfig"></app-crud-list>
    </div>
  `
})
export class EventsComponent implements OnInit {
  crudConfig: CrudConfig = {
    title: 'Events',
    apiEndpoint: '/events',
    createRoute: '/apps/events/new',
    editRoute: '/apps/events',
    viewRoute: '/apps/events',
    searchFields: ['title', 'location', 'organizer'],
    columns: [
      { field: 'title', header: 'Title', type: 'text', sortable: true, filterable: true },
      { field: 'location', header: 'Location', type: 'text', sortable: true },
      { field: 'eventDate', header: 'Date', type: 'date', sortable: true, width: '150px' },
      { field: 'organizer', header: 'Organizer', type: 'text', sortable: true },
      { field: 'status', header: 'Status', type: 'status', width: '100px' },
      { field: 'actions', header: 'Actions', type: 'actions', width: '150px' }
    ]
  };

  ngOnInit() {}
}
