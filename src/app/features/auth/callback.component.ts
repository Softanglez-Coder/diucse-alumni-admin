import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Subject, takeUntil } from 'rxjs';

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
export class CallbackComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    console.log('🔄 CallbackComponent: Initializing');
    
    // Auth0 SDK handles the callback automatically through its internal mechanism
    // We need to wait for authentication to complete, then redirect
    
    // Use a timeout to allow Auth0 SDK to process the callback
    setTimeout(() => {
      this.auth.isAuthenticated$
        .pipe(takeUntil(this.destroy$))
        .subscribe((isAuthenticated) => {
          console.log('🔄 CallbackComponent: Auth status:', isAuthenticated);
          if (isAuthenticated) {
            // Get the returnUrl from localStorage if it exists
            const returnUrl =
              localStorage.getItem('auth_return_url') || '/apps/dashboard';
            localStorage.removeItem('auth_return_url');
            console.log('🔄 CallbackComponent: Redirecting to:', returnUrl);
            this.router.navigate([returnUrl], { replaceUrl: true });
          }
        });
    }, 100);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
