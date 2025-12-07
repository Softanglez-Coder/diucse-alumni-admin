import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    MessageModule,
    RippleModule,
  ],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <i class="pi pi-graduation-cap text-5xl text-primary mb-4"></i>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">Alumni Admin</h1>
          <p class="text-gray-600 mb-2">Sign in to your account</p>
          <div *ngIf="returnUrl !== '/apps/dashboard'" class="mb-4">
            <p-message
              severity="info"
              text="Please sign in to access the requested page"
              styleClass="w-full text-sm"
            >
            </p-message>
          </div>
        </div>

        <div class="login-form">
          <button
            type="button"
            pButton
            label="Sign In with Auth0"
            icon="pi pi-sign-in"
            class="w-full"
            (click)="onLogin()"
            pRipple
          ></button>

          <div class="mt-4 text-center">
            <p class="text-sm text-gray-600">
              Only users with admin roles can access this panel
            </p>
          </div>
        </div>

        <div class="login-footer">
          <p class="text-center text-sm text-gray-600">
            Don't have an account?
            <a href="#" class="text-primary hover:underline"
              >Contact Administrator</a
            >
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1rem;
      }

      .login-card {
        width: 100%;
        max-width: 400px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        padding: 2rem;
        animation: slideUp 0.5s ease-out;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .login-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .login-form {
        margin-bottom: 2rem;
      }

      .login-footer {
        border-top: 1px solid #e5e7eb;
        padding-top: 1.5rem;
      }

      :host ::ng-deep .p-button {
        padding: 0.75rem 1rem;
      }

      :host ::ng-deep .p-message {
        margin: 0;
      }

      @media (max-width: 640px) {
        .login-card {
          margin: 1rem;
          padding: 1.5rem;
        }
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  returnUrl = '/apps/dashboard';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    // Get return URL from query params or default to dashboard
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/apps/dashboard';
    console.log('LoginComponent: returnUrl from query params:', this.returnUrl);

    // Check if already authenticated
    this.authService.isAuthenticated().subscribe((isAuth) => {
      if (isAuth) {
        // Check if user has admin access
        this.authService.hasAdminAccess$().subscribe((hasAccess) => {
          if (hasAccess) {
            this.router.navigate([this.returnUrl]);
          } else {
            // User is authenticated but doesn't have admin role
            this.router.navigate(['/auth/access-denied']);
          }
        });
      }
    });
  }

  onLogin() {
    this.authService.login(this.returnUrl);
  }
}
