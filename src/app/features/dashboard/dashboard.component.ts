import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardModule,
    ChartModule,
    ButtonModule,
    TableModule,
    TagModule,
    ProgressBarModule,
    AvatarModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1 class="dashboard-title">Dashboard</h1>
        <p class="dashboard-subtitle">Welcome back! Here's what's happening with your alumni network.</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card" *ngFor="let stat of statsData">
          <div class="stat-icon" [style.background-color]="stat.color">
            <i [class]="stat.icon"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{stat.value}}</h3>
            <p class="stat-label">{{stat.label}}</p>
            <div class="stat-change" [class.positive]="stat.change > 0" [class.negative]="stat.change < 0">
              <i class="pi" [class.pi-arrow-up]="stat.change > 0" [class.pi-arrow-down]="stat.change < 0"></i>
              {{Math.abs(stat.change)}}% from last month
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <div class="chart-card">
          <p-card header="User Registration Trend">
            <p-chart type="line" [data]="lineChartData" [options]="lineChartOptions"></p-chart>
          </p-card>
        </div>
        <div class="chart-card">
          <p-card header="Event Participation">
            <p-chart type="doughnut" [data]="doughnutChartData" [options]="doughnutChartOptions"></p-chart>
          </p-card>
        </div>
      </div>

      <!-- Recent Activities & Quick Actions -->
      <div class="bottom-section">
        <div class="activities-card">
          <p-card header="Recent Activities">
            <div class="activity-item" *ngFor="let activity of recentActivities">
              <p-avatar 
                [image]="activity.avatar || undefined" 
                [label]="activity.initials" 
                shape="circle" 
                size="normal">
              </p-avatar>
              <div class="activity-content">
                <p class="activity-text">{{activity.text}}</p>
                <small class="activity-time">{{activity.time}}</small>
              </div>
              <p-tag 
                [value]="activity.type" 
                [severity]="activity.severity">
              </p-tag>
            </div>
          </p-card>
        </div>

        <div class="quick-actions-card">
          <p-card header="Quick Actions">
            <div class="quick-actions-grid">
              <button 
                *ngFor="let action of quickActions"
                pButton
                [label]="action.label"
                [icon]="action.icon"
                class="p-button-outlined"
                [routerLink]="action.route">
              </button>
            </div>
          </p-card>
        </div>
      </div>

      <!-- Recent Data Tables -->
      <div class="tables-section">
        <div class="table-card">
          <p-card header="Recent Users">
            <p-table [value]="recentUsers" [rows]="5" [paginator]="false">
              <ng-template pTemplate="header">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Batch</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-user>
                <tr>
                  <td>
                    <div class="flex items-center">
                      <p-avatar 
                        [image]="user.avatar" 
                        [label]="user.initials" 
                        shape="circle" 
                        size="normal" 
                        class="mr-2">
                      </p-avatar>
                      {{user.name}}
                    </div>
                  </td>
                  <td>{{user.email}}</td>
                  <td>{{user.batch}}</td>
                  <td>
                    <p-tag 
                      [value]="user.status" 
                      [severity]="user.status === 'Active' ? 'success' : 'warning'">
                    </p-tag>
                  </td>
                  <td>{{user.joined}}</td>
                </tr>
              </ng-template>
            </p-table>
          </p-card>
        </div>

        <div class="table-card">
          <p-card header="Recent Events">
            <p-table [value]="recentEvents" [rows]="5" [paginator]="false">
              <ng-template pTemplate="header">
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Registrations</th>
                  <th>Status</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-event>
                <tr>
                  <td>{{event.name}}</td>
                  <td>{{event.date}}</td>
                  <td>
                    <div class="flex items-center">
                      <span class="mr-2">{{event.registrations}}/{{event.capacity}}</span>
                      <p-progressBar 
                        [value]="(event.registrations / event.capacity) * 100" 
                        [style]="{'width': '100px'}">
                      </p-progressBar>
                    </div>
                  </td>
                  <td>
                    <p-tag 
                      [value]="event.status" 
                      [severity]="getEventSeverity(event.status)">
                    </p-tag>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </p-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .dashboard-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .dashboard-subtitle {
      color: #6b7280;
      font-size: 1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .stat-label {
      color: #6b7280;
      margin: 0.25rem 0;
    }

    .stat-change {
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .stat-change.positive {
      color: #059669;
    }

    .stat-change.negative {
      color: #dc2626;
    }

    .charts-section {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .chart-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .bottom-section {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .activities-card, .quick-actions-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-content {
      flex: 1;
    }

    .activity-text {
      margin: 0;
      color: #374151;
    }

    .activity-time {
      color: #6b7280;
    }

    .quick-actions-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .tables-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .table-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 1024px) {
      .charts-section,
      .bottom-section,
      .tables-section {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .quick-actions-grid {
        grid-template-columns: 1fr;
      }
    }

    :host ::ng-deep .p-card-header {
      background: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
      padding: 1rem 1.5rem;
      font-weight: 600;
      color: #374151;
    }

    :host ::ng-deep .p-card-content {
      padding: 1.5rem;
    }

    :host ::ng-deep .p-table .p-datatable-thead > tr > th {
      background: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
      color: #374151;
      font-weight: 600;
    }
  `]
})
export class DashboardComponent implements OnInit {
  Math = Math;

  statsData = [
    {
      label: 'Total Users',
      value: '2,456',
      change: 12.5,
      icon: 'pi pi-users',
      color: '#3b82f6'
    },
    {
      label: 'Active Events',
      value: '24',
      change: 8.2,
      icon: 'pi pi-calendar',
      color: '#10b981'
    },
    {
      label: 'This Month Registrations',
      value: '186',
      change: -3.1,
      icon: 'pi pi-user-plus',
      color: '#f59e0b'
    },
    {
      label: 'Total Revenue',
      value: '$12,450',
      change: 15.3,
      icon: 'pi pi-dollar',
      color: '#8b5cf6'
    }
  ];

  lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Users',
        data: [65, 59, 80, 81, 56, 89],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }
    ]
  };

  lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  doughnutChartData = {
    labels: ['Alumni', 'Students', 'Faculty'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
        borderWidth: 0
      }
    ]
  };

  doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  recentActivities = [
    {
      text: 'John Doe registered for Alumni Meetup 2024',
      time: '2 hours ago',
      type: 'Registration',
      severity: 'success',
      avatar: null,
      initials: 'JD'
    },
    {
      text: 'New blog post published by Admin',
      time: '4 hours ago',
      type: 'Content',
      severity: 'info',
      avatar: null,
      initials: 'A'
    },
    {
      text: 'Payment received for membership',
      time: '6 hours ago',
      type: 'Payment',
      severity: 'success',
      avatar: null,
      initials: 'SM'
    },
    {
      text: 'Event capacity reached for Tech Talk',
      time: '1 day ago',
      type: 'Event',
      severity: 'warning',
      avatar: null,
      initials: 'TT'
    }
  ];

  quickActions = [
    {
      label: 'Add User',
      icon: 'pi pi-user-plus',
      route: '/apps/users/new'
    },
    {
      label: 'Create Event',
      icon: 'pi pi-calendar-plus',
      route: '/apps/events/new'
    },
    {
      label: 'New Blog',
      icon: 'pi pi-pencil',
      route: '/apps/blogs/new'
    },
    {
      label: 'Send Notice',
      icon: 'pi pi-send',
      route: '/apps/notices/new'
    }
  ];

  recentUsers = [
    {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      batch: '2020',
      status: 'Active',
      joined: '2024-01-15',
      avatar: null,
      initials: 'AJ'
    },
    {
      name: 'Bob Smith',
      email: 'bob@example.com',
      batch: '2019',
      status: 'Pending',
      joined: '2024-01-14',
      avatar: null,
      initials: 'BS'
    },
    {
      name: 'Carol Davis',
      email: 'carol@example.com',
      batch: '2021',
      status: 'Active',
      joined: '2024-01-13',
      avatar: null,
      initials: 'CD'
    }
  ];

  recentEvents = [
    {
      name: 'Alumni Reunion 2024',
      date: '2024-03-15',
      registrations: 85,
      capacity: 100,
      status: 'Active'
    },
    {
      name: 'Tech Career Fair',
      date: '2024-03-20',
      registrations: 120,
      capacity: 150,
      status: 'Active'
    },
    {
      name: 'Annual Gala',
      date: '2024-04-01',
      registrations: 45,
      capacity: 200,
      status: 'Planning'
    }
  ];

  constructor() {}

  ngOnInit() {}

  getEventSeverity(status: string): 'success' | 'warning' | 'info' | 'danger' {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Planning':
        return 'warning';
      case 'Completed':
        return 'info';
      default:
        return 'info';
    }
  }
}
