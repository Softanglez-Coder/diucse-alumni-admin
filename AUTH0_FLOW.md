# Auth0 Authentication Flow Diagram

## Overview
This document explains the authentication flow in the DIU CSE Alumni Admin application.

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Authentication Flow                             │
└─────────────────────────────────────────────────────────────────────────┘

1. User Access Attempt
   ↓
   User navigates to /apps/dashboard (or any protected route)
   ↓
   
2. Auth Guard Check
   ↓
   AuthGuard.canActivate() is triggered
   ↓
   Checks: Is user authenticated?
   ├─ NO → Go to Step 3
   └─ YES → Go to Step 5

3. Redirect to Auth0
   ↓
   AuthService.login() is called
   ↓
   Store returnUrl in localStorage
   ↓
   Redirect to Auth0 Universal Login
   ↓
   
4. Auth0 Authentication
   ↓
   User enters credentials on Auth0 hosted page
   ↓
   Auth0 validates credentials
   ├─ FAIL → Show error, stay on Auth0 login
   └─ SUCCESS → Continue
   ↓
   Auth0 executes Login Action (adds roles to token)
   ↓
   Auth0 redirects to /auth/callback with token
   ↓
   
5. Callback Processing
   ↓
   CallbackComponent receives redirect
   ↓
   Auth0 SDK processes token automatically
   ↓
   User data extracted from token (including roles)
   ↓
   CurrentUser$ BehaviorSubject updated
   ↓
   Retrieve returnUrl from localStorage
   ↓
   Navigate to returnUrl or /apps/dashboard
   ↓
   
6. Role Verification
   ↓
   AuthGuard checks: hasAdminAccess()
   ↓
   Check: Does user have role OTHER than "member" or "guest"?
   ├─ NO → Go to Step 7
   └─ YES → Go to Step 8

7. Access Denied
   ↓
   Navigate to /auth/access-denied
   ↓
   Show "Access Denied" page with user's roles
   ↓
   User can:
   - Sign out
   - Go to main site
   [END]

8. Access Granted
   ↓
   User accesses the protected route
   ↓
   HTTP requests automatically include JWT token (via interceptor)
   ↓
   User can navigate the admin panel
   [END]
```

## Role-Based Access Examples

### Scenario 1: Admin User
```
User Roles: ["Admin"]
Result: ✅ ACCESS GRANTED
Reason: Has "Admin" role (not member/guest)
```

### Scenario 2: Publisher User
```
User Roles: ["Publisher"]
Result: ✅ ACCESS GRANTED
Reason: Has "Publisher" role (not member/guest)
```

### Scenario 3: Member-only User
```
User Roles: ["Member"]
Result: ❌ ACCESS DENIED
Reason: Only has "Member" role
```

### Scenario 4: Guest-only User
```
User Roles: ["Guest"]
Result: ❌ ACCESS DENIED
Reason: Only has "Guest" role
```

### Scenario 5: Member + Guest User
```
User Roles: ["Member", "Guest"]
Result: ❌ ACCESS DENIED
Reason: Only has "Member" and "Guest" roles
```

### Scenario 6: Member + Admin User
```
User Roles: ["Member", "Admin"]
Result: ✅ ACCESS GRANTED
Reason: Has "Admin" role (member role is ignored)
```

### Scenario 7: User with No Roles
```
User Roles: []
Result: ❌ ACCESS DENIED
Reason: No roles assigned
```

## Token Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            Token Management                              │
└─────────────────────────────────────────────────────────────────────────┘

Auth0 Issues Token
   ↓
   ID Token: { sub, email, name, "https://alumni.com/roles": ["Admin"] }
   Access Token: JWT with roles claim
   ↓
   
Auth0 SDK stores token in memory/browser storage
   ↓
   
HTTP Interceptor intercepts API requests
   ↓
   Check: Is this an Auth0 URL?
   ├─ YES → Skip (don't add token)
   └─ NO → Continue
   ↓
   Get token from Auth0 SDK (with caching)
   ↓
   Add "Authorization: Bearer {token}" header
   ↓
   Send request to API
   ↓
   
API validates JWT
   ├─ Invalid → Return 401 Unauthorized
   └─ Valid → Process request
```

## Component Interactions

```
┌──────────────────┐
│ LoginComponent   │  User clicks "Sign In with Auth0"
└────────┬─────────┘
         │
         ↓ authService.login(returnUrl)
┌──────────────────┐
│  AuthService     │  Redirects to Auth0
└────────┬─────────┘
         │
         ↓ User authenticates
┌──────────────────┐
│     Auth0        │  Validates credentials, adds roles
└────────┬─────────┘
         │
         ↓ Redirect to callback
┌──────────────────┐
│CallbackComponent │  Processes Auth0 response
└────────┬─────────┘
         │
         ↓ User data loaded
┌──────────────────┐
│   AuthGuard      │  Checks roles
└────────┬─────────┘
         │
    ┌────┴────┐
    ↓         ↓
┌─────────┐ ┌──────────────┐
│Dashboard│ │Access Denied │
└─────────┘ └──────────────┘
```

## Key Security Points

1. **No credentials stored locally** - All handled by Auth0
2. **Token caching** - Reduces Auth0 API calls
3. **Automatic token refresh** - Auth0 SDK handles renewal
4. **Memory leak prevention** - Proper subscription cleanup
5. **Secure URL validation** - Prevents host injection
6. **Role-based guard** - Enforces access control

## Environment-Specific Behavior

### Development (localhost:4300)
- Callback URL: `http://localhost:4300/auth/callback`
- API: `http://localhost:3000`
- Allows test credentials

### Production (admin.csediualumni.com)
- Callback URL: `https://admin.csediualumni.com/auth/callback`
- API: `https://api.csediualumni.com`
- Requires real Auth0 configuration

## Debugging Tips

### Check Authentication State
```typescript
// In browser console
localStorage.getItem('auth_return_url')  // Check stored return URL
```

### Check User Object
```typescript
// Add to any component
constructor(private authService: AuthService) {
  this.authService.currentUser$.subscribe(user => {
    console.log('Current User:', user);
    console.log('User Roles:', user?.roles);
    console.log('Has Admin Access:', this.authService.hasAdminAccess());
  });
}
```

### Check Token
- Open browser DevTools
- Go to Application/Storage tab
- Check for Auth0 tokens

### Check API Requests
- Open Network tab in DevTools
- Look for "Authorization" header in API requests
- Should see: `Authorization: Bearer eyJ...`

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Infinite redirect loop | Callback URL mismatch | Check Auth0 settings match environment |
| No roles in token | Action not configured | Set up Auth0 Login Action |
| Access denied for admin | Role name mismatch | Check role names (case-insensitive) |
| Token not in requests | Interceptor issue | Check interceptor is registered |
| Memory leak warning | Missing unsubscribe | Check for takeUntil usage |

## References

- [Auth0 Angular Quickstart](https://auth0.com/docs/quickstart/spa/angular)
- [Auth0 RBAC](https://auth0.com/docs/manage-users/access-control/rbac)
- [Auth0 Actions](https://auth0.com/docs/customize/actions)
