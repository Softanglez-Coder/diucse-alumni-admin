import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    CardModule,
    MessageModule,
    RippleModule
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
              styleClass="w-full text-sm">
            </p-message>
          </div>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input 
              id="email"
              type="email"
              pInputText
              formControlName="email"
              placeholder="Enter your email"
              class="w-full"
              [class.p-invalid]="isFieldInvalid('email')"
            />
            <small 
              *ngIf="isFieldInvalid('email')" 
              class="p-error">
              Email is required and must be valid
            </small>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <p-password
              id="password"
              formControlName="password"
              placeholder="Enter your password"
              [toggleMask]="true"
              [feedback]="false"
              inputStyleClass="w-full"
              styleClass="w-full"
              [class.p-invalid]="isFieldInvalid('password')">
            </p-password>
            <small 
              *ngIf="isFieldInvalid('password')" 
              class="p-error">
              Password is required
            </small>
          </div>

          <div class="form-group">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <p-checkbox 
                  formControlName="rememberMe" 
                  inputId="rememberMe"
                  [binary]="true">
                </p-checkbox>
                <label for="rememberMe" class="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <a href="#" class="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>
          </div>

          <div class="form-group" *ngIf="errorMessage">
            <p-message 
              severity="error" 
              [text]="errorMessage"
              styleClass="w-full">
            </p-message>
          </div>

          <button 
            type="submit"
            pButton
            label="Sign In"
            icon="pi pi-sign-in"
            class="w-full"
            [loading]="isLoading"
            [disabled]="loginForm.invalid || isLoading"
            pRipple>
          </button>
        </form>

        <div class="login-footer">
          <p class="text-center text-sm text-gray-600">
            Don't have an account? 
            <a href="#" class="text-primary hover:underline">Contact Administrator</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
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

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
    }

    .login-footer {
      border-top: 1px solid #e5e7eb;
      padding-top: 1.5rem;
    }

    :host ::ng-deep .p-password {
      width: 100%;
    }

    :host ::ng-deep .p-password .p-inputtext {
      width: 100%;
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
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  returnUrl = '/apps/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit() {
    // Get return URL from query params or default to dashboard
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/apps/dashboard';
    console.log('LoginComponent: returnUrl from query params:', this.returnUrl);
    console.log('LoginComponent: All query params:', this.route.snapshot.queryParams);
    
    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;
      
      this.authService.login({ email, password }).subscribe({
        next: (success) => {
          if (success) {
            // Login successful, now fetch user data
            this.authService.checkAuthenticationStatus().subscribe({
              next: (isAuthenticated) => {
                this.isLoading = false;
                if (isAuthenticated) {
                  this.router.navigate([this.returnUrl]);
                } else {
                  this.errorMessage = 'Failed to load user data';
                }
              },
              error: (error) => {
                this.isLoading = false;
                this.errorMessage = 'Failed to load user data';
                console.error('User data fetch error:', error);
              }
            });
          } else {
            this.isLoading = false;
            this.errorMessage = 'Invalid email or password';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'An error occurred. Please try again.';
          console.error('Login error:', error);
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
