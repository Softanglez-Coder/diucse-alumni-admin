import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { AuthService, User } from '../../core/services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MenubarModule,
    ButtonModule,
    AvatarModule,
    MenuModule,
    BadgeModule,
    InputTextModule,
    RippleModule,
  ],
  template: `
    <div class="layout-wrapper">
      <!-- Top Navigation -->
      <div class="layout-topbar">
        <div class="layout-topbar-left">
          <button
            class="layout-menu-button p-button-text"
            (click)="toggleMenu()"
            pButton
            icon="pi pi-bars"
            pRipple
          ></button>
          <span class="layout-topbar-logo">
            <i class="pi pi-graduation-cap text-2xl"></i>
            <span class="ml-2 text-xl font-bold">Alumni Admin</span>
          </span>
        </div>

        <div class="layout-topbar-right">
          <div class="layout-topbar-search">
            <span class="p-input-icon-left">
              <i class="pi pi-search"></i>
              <input
                type="text"
                pInputText
                placeholder="Search..."
                class="p-inputtext-sm"
              />
            </span>
          </div>

          <button
            class="p-button-rounded p-button-text"
            pButton
            icon="pi pi-bell"
            pBadge
            badge="3"
            badgeClass="p-badge-danger"
          ></button>

          <p-menu #userMenu [model]="userMenuItems" [popup]="true"> </p-menu>

          <button
            class="layout-topbar-profile p-button-text"
            pButton
            (click)="userMenu.toggle($event)"
            pRipple
          >
            <p-avatar
              [image]="currentUser?.avatar || undefined"
              [label]="currentUser?.name?.charAt(0) || 'U'"
              shape="circle"
              size="normal"
            >
            </p-avatar>
            <span class="ml-2 hidden md:inline">{{ currentUser?.name }}</span>
            <i class="pi pi-chevron-down ml-2"></i>
          </button>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="layout-sidebar" [class.active]="sidebarVisible">
        <div class="layout-menu">
          <div class="layout-menu-item" *ngFor="let item of menuItems">
            <a
              [routerLink]="item.routerLink"
              class="layout-menu-button"
              routerLinkActive="active"
            >
              <i [class]="item.icon"></i>
              <span>{{ item.label }}</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="layout-main" [class.expanded]="!sidebarVisible">
        <div class="layout-content">
          <router-outlet></router-outlet>
        </div>
      </div>

      <!-- Mobile Sidebar Overlay -->
      <div
        class="layout-sidebar-overlay"
        [class.active]="sidebarVisible"
        (click)="hideSidebar()"
      ></div>
    </div>
  `,
  styles: [
    `
      .layout-wrapper {
        display: flex;
        flex-direction: column;
        height: 100vh;
      }

      .layout-topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;
        height: 60px;
        background: white;
        border-bottom: 1px solid #e5e7eb;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
      }

      .layout-topbar-left {
        display: flex;
        align-items: center;
      }

      .layout-topbar-logo {
        display: flex;
        align-items: center;
        color: #3b82f6;
        font-weight: 600;
        margin-left: 1rem;
      }

      .layout-topbar-right {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .layout-topbar-search {
        margin-right: 1rem;
      }

      .layout-topbar-profile {
        display: flex;
        align-items: center;
      }

      .layout-sidebar {
        position: fixed;
        top: 60px;
        left: 0;
        bottom: 0;
        width: 250px;
        background: white;
        border-right: 1px solid #e5e7eb;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        z-index: 999;
        overflow-y: auto;
      }

      .layout-sidebar.active {
        transform: translateX(0);
      }

      .layout-menu {
        padding: 1rem 0;
      }

      .layout-menu-item {
        margin-bottom: 0.25rem;
      }

      .layout-menu-button {
        display: flex;
        align-items: center;
        padding: 0.75rem 1rem;
        color: #6b7280;
        text-decoration: none;
        transition: all 0.2s ease;
        border-radius: 0.375rem;
        margin: 0 0.5rem;
      }

      .layout-menu-button:hover {
        background: #f3f4f6;
        color: #3b82f6;
      }

      .layout-menu-button.active {
        background: #dbeafe;
        color: #3b82f6;
        border-left: 3px solid #3b82f6;
      }

      .layout-menu-button i {
        margin-right: 0.75rem;
        font-size: 1.1rem;
      }

      .layout-main {
        flex: 1;
        margin-top: 60px;
        margin-left: 0;
        transition: margin-left 0.3s ease;
      }

      .layout-content {
        padding: 1.5rem;
        min-height: calc(100vh - 60px);
        background: #f9fafb;
      }

      .layout-sidebar-overlay {
        position: fixed;
        top: 60px;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 998;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .layout-sidebar-overlay.active {
        opacity: 1;
        visibility: visible;
      }

      @media (min-width: 768px) {
        .layout-sidebar {
          position: fixed;
          transform: translateX(0);
        }

        .layout-main {
          margin-left: 250px;
        }

        .layout-main.expanded {
          margin-left: 0;
        }

        .layout-sidebar-overlay {
          display: none;
        }
      }

      @media (max-width: 640px) {
        .layout-topbar-search {
          display: none;
        }
      }
    `,
  ],
})
export class LayoutComponent implements OnInit, OnDestroy {
  sidebarVisible = false;
  currentUser: User | null = null;
  private destroy$ = new Subject<void>();

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: ['/apps/dashboard'],
    },
    {
      label: 'Users',
      icon: 'pi pi-users',
      routerLink: ['/apps/users'],
    },
    {
      label: 'Committees',
      icon: 'pi pi-sitemap',
      routerLink: ['/apps/committees'],
    },
    {
          label: 'Designations',
          icon: 'pi pi-tags',
          routerLink: ['/apps/committee-designations'],
        },
    {
      label: 'Banners',
      icon: 'pi pi-image',
      routerLink: ['/apps/banners'],
    },
    {
      label: 'Batches',
      icon: 'pi pi-graduation-cap',
      routerLink: ['/apps/batches'],
    },
    {
      label: 'Blogs',
      icon: 'pi pi-file-edit',
      routerLink: ['/apps/blogs'],
    },
    {
      label: 'Membership',
      icon: 'pi pi-id-card',
      routerLink: ['/apps/membership'],
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      routerLink: ['/apps/settings'],
    },
  ];

  userMenuItems: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => {
        // Navigate to profile
      },
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      routerLink: ['/apps/settings'],
    },
    {
      separator: true,
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        this.authService.logout();
      },
    },
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser = user;
      });

    // Check if sidebar should be visible on desktop
    if (window.innerWidth >= 768) {
      this.sidebarVisible = true;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleMenu() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  hideSidebar() {
    if (window.innerWidth < 768) {
      this.sidebarVisible = false;
    }
  }
}
