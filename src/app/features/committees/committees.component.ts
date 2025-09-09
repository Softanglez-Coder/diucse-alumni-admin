import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CrudListComponent, CrudConfig } from '../../shared/components/crud-list.component';
import { CommitteeService } from './committee.service';

@Component({
  selector: 'app-committees',
  standalone: true,
  imports: [CommonModule, CrudListComponent],
  template: `
    <app-crud-list 
      [config]="crudConfig">
    </app-crud-list>
  `
})
export class CommitteesComponent implements OnInit {
  crudConfig: CrudConfig = {
    title: 'Committees',
    apiEndpoint: 'committees',
    columns: [
      { field: 'name', header: 'Committee Name', type: 'text', sortable: true, filterable: true },
      { field: 'startDate', header: 'Start Date', type: 'date', sortable: true },
      { field: 'endDate', header: 'End Date', type: 'date', sortable: true },
      { field: 'isPublished', header: 'Status', type: 'status', sortable: true },
      { field: 'createdAt', header: 'Created', type: 'date', sortable: true },
      { field: 'actions', header: 'Actions', type: 'actions', width: '200px' }
    ],
    searchFields: ['name'],
    createRoute: '/apps/committees/new',
    editRoute: '/apps/committees/:id/edit',
    viewRoute: '/apps/committees/:id'
  };

  customActions = [
    {
      label: 'Manage Members',
      icon: 'pi pi-users',
      action: (item: any) => this.manageMembers(item),
      condition: (item: any) => true
    },
    {
      label: 'Publish',
      icon: 'pi pi-check',
      action: (item: any) => this.togglePublish(item),
      condition: (item: any) => !item.isPublished,
      severity: 'success'
    },
    {
      label: 'Unpublish',
      icon: 'pi pi-times',
      action: (item: any) => this.togglePublish(item),
      condition: (item: any) => item.isPublished,
      severity: 'warning'
    }
  ];

  constructor(
    private router: Router,
    private committeeService: CommitteeService
  ) {}

  ngOnInit(): void {}

  manageMembers(committee: any): void {
    this.router.navigate(['/apps/committees', committee._id, 'members']);
  }

  togglePublish(committee: any): void {
    const publishData = { isPublished: !committee.isPublished };
    this.committeeService.publishCommittee(committee._id, publishData).subscribe({
      next: (response) => {
        // The crud list component will automatically refresh
        console.log('Committee publish status updated');
      },
      error: (error) => {
        console.error('Error updating publish status:', error);
      }
    });
  }
}
