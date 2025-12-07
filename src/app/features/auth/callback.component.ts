import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      <div class="callback-content">
        <i class="pi pi-spin pi-spinner text-5xl text-primary mb-4"></i>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Authenticating...</h2>
        <p class="text-gray-600">Please wait while we complete your login.</p>
      </div>
    </div>
  `,
  styles: [
    `
      .callback-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      .callback-content {
        text-align: center;
        background: white;
        padding: 3rem;
        border-radius: 12px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      }
    `,
  ],
})
export class CallbackComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    // Auth0 SDK will handle the callback automatically
    // Once authenticated, we redirect to the dashboard or returnUrl
    this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        // Get the returnUrl from localStorage if it exists
        const returnUrl = localStorage.getItem('auth_return_url') || '/apps/dashboard';
        localStorage.removeItem('auth_return_url');
        this.router.navigate([returnUrl]);
      }
    });
  }
}
