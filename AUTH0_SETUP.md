# Auth0 Authentication Configuration

This application uses Auth0 for authentication with role-based access control.

## Setup Instructions

### 1. Create an Auth0 Account

1. Go to [Auth0](https://auth0.com/) and create a free account
2. Create a new Single Page Application in Auth0 Dashboard

### 2. Configure Auth0 Application

In your Auth0 application settings:

1. **Allowed Callback URLs**: Add your application callback URLs
   - Development: `http://localhost:4300/auth/callback`
   - Production: `https://admin.csediualumni.com/auth/callback`

2. **Allowed Logout URLs**: Add your logout URLs
   - Development: `http://localhost:4300/auth/login`
   - Production: `https://admin.csediualumni.com/auth/login`

3. **Allowed Web Origins**: Add your application origins
   - Development: `http://localhost:4300`
   - Production: `https://admin.csediualumni.com`

### 3. Configure User Roles in Auth0

You need to set up roles in Auth0:

1. Go to **User Management** > **Roles** in Auth0 Dashboard
2. Create the following roles:
   - `Admin` - Full administrative access
   - `Publisher` - Can publish content
   - `Editor` - Can edit content
   - `Member` - Regular member (NO admin access)
   - `Guest` - Guest user (NO admin access)

### 4. Add Roles to ID Token

To include roles in the ID token, create an Auth0 Action:

1. Go to **Actions** > **Flows** > **Login**
2. Create a custom action with this code:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://alumni.com';
  
  if (event.authorization) {
    // Add roles to ID token
    api.idToken.setCustomClaim(`${namespace}/roles`, event.authorization.roles);
    api.accessToken.setCustomClaim(`${namespace}/roles`, event.authorization.roles);
  }
};
```

3. Add this action to your Login flow

### 5. Configure Environment Variables

Update the environment files with your Auth0 credentials:

#### `src/environments/environment.ts` (Development)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  frontendUrl: 'http://localhost:4300',
  auth0: {
    domain: 'your-tenant.auth0.com',
    clientId: 'your-client-id',
    authorizationParams: {
      redirect_uri: 'http://localhost:4300/auth/callback',
      audience: 'your-api-identifier',
    },
    httpInterceptor: {
      allowedList: [
        {
          uri: 'http://localhost:3000/*',
          tokenOptions: {
            authorizationParams: {
              audience: 'your-api-identifier',
            },
          },
        },
      ],
    },
  },
};
```

#### `src/environments/environment.production.ts` (Production)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.csediualumni.com',
  frontendUrl: 'https://admin.csediualumni.com',
  auth0: {
    domain: 'your-tenant.auth0.com',
    clientId: 'your-production-client-id',
    authorizationParams: {
      redirect_uri: 'https://admin.csediualumni.com/auth/callback',
      audience: 'your-api-identifier',
    },
    httpInterceptor: {
      allowedList: [
        {
          uri: 'https://api.csediualumni.com/*',
          tokenOptions: {
            authorizationParams: {
              audience: 'your-api-identifier',
            },
          },
        },
      ],
    },
  },
};
```

### 6. Assign Roles to Users

1. Go to **User Management** > **Users** in Auth0 Dashboard
2. Select a user
3. Go to the **Roles** tab
4. Assign appropriate roles

**Important**: Users with ONLY `Member` or `Guest` roles will NOT be able to access the admin panel.

## Role-Based Access Control

### Access Rules

- **Admin Panel Access**: Users must have at least one role OTHER than `Member` or `Guest`
- **Valid Admin Roles**: `Admin`, `Publisher`, `Editor`, or any custom role
- **Blocked Roles**: Users with only `Member` and/or `Guest` roles will see an "Access Denied" page

### User Scenarios

1. **User with `Admin` role**: ✅ Can access admin panel
2. **User with `Publisher` role**: ✅ Can access admin panel
3. **User with `Editor` role**: ✅ Can access admin panel
4. **User with `Member` role only**: ❌ Cannot access admin panel
5. **User with `Guest` role only**: ❌ Cannot access admin panel
6. **User with `Member` + `Admin` roles**: ✅ Can access admin panel (has admin role)
7. **User with `Member` + `Guest` roles**: ❌ Cannot access admin panel (no admin role)

## Authentication Flow

1. User clicks "Sign In with Auth0" on login page
2. Redirected to Auth0 Universal Login
3. User authenticates with Auth0
4. Auth0 redirects back to `/auth/callback`
5. Application extracts user info and roles
6. If user has admin role → Redirect to dashboard
7. If user has only member/guest roles → Show access denied page

## API Integration

The Auth0 access token is automatically included in all API requests via the HTTP interceptor.

### Backend Requirements

Your API should:
1. Validate the JWT token from Auth0
2. Extract user roles from the token
3. Implement role-based authorization

Example token validation (Node.js with Express):

```javascript
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksUri: `https://your-tenant.auth0.com/.well-known/jwks.json`
  }),
  audience: 'your-api-identifier',
  issuer: `https://your-tenant.auth0.com/`,
  algorithms: ['RS256']
});

app.use('/api', checkJwt);
```

## Testing

### Test User Setup

Create test users in Auth0 with different role combinations:

1. **Admin User**: Assign `Admin` role
2. **Publisher User**: Assign `Publisher` role
3. **Member User**: Assign only `Member` role
4. **Guest User**: Assign only `Guest` role

### Test Scenarios

1. Login with admin user → Should access dashboard
2. Login with publisher user → Should access dashboard
3. Login with member-only user → Should see "Access Denied"
4. Login with guest-only user → Should see "Access Denied"
5. Logout → Should redirect to login page

## Troubleshooting

### Roles Not Appearing

- Check that the Auth0 Action is added to the Login flow
- Verify the custom claim namespace matches: `https://alumni.com/roles`
- Check browser console for user object to see if roles are present

### Redirect Issues

- Ensure callback URLs match exactly in Auth0 settings
- Check that environment configuration is correct
- Look for errors in browser console

### Token Issues

- Verify the audience is correctly configured
- Check that the API identifier matches in both Auth0 and environment
- Ensure the interceptor is properly configured

## Security Considerations

1. **Never expose Auth0 credentials in public repositories**
2. Use environment variables for sensitive configuration
3. Implement proper CORS on your API
4. Regularly review and audit user roles
5. Enable MFA for admin users in Auth0
6. Monitor Auth0 logs for suspicious activity

## References

- [Auth0 Angular SDK Documentation](https://auth0.com/docs/quickstart/spa/angular)
- [Auth0 Role-Based Access Control](https://auth0.com/docs/manage-users/access-control/rbac)
- [Auth0 Actions](https://auth0.com/docs/customize/actions)
