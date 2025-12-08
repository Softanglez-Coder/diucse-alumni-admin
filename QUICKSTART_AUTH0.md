# Quick Start Guide: Auth0 Configuration

This guide will help you quickly set up Auth0 for this admin panel.

## Prerequisites

Before you start, you need:
- An Auth0 account (create one at [auth0.com](https://auth0.com))
- Basic understanding of Auth0 concepts (optional but helpful)

## Step 1: Create Auth0 Application

1. Log in to your Auth0 Dashboard
2. Navigate to **Applications** → **Applications**
3. Click **Create Application**
4. Choose:
   - Name: `DIU CSE Alumni Admin`
   - Type: **Single Page Web Applications**
5. Click **Create**

## Step 2: Configure Application Settings

In your application settings, set the following:

### Allowed Callback URLs
```
http://localhost:4300/auth/callback,https://admin.csediualumni.com/auth/callback
```

### Allowed Logout URLs
```
http://localhost:4300/auth/login,https://admin.csediualumni.com/auth/login
```

### Allowed Web Origins
```
http://localhost:4300,https://admin.csediualumni.com
```

### Allowed Origins (CORS)
```
http://localhost:4300,https://admin.csediualumni.com
```

Click **Save Changes**.

## Step 3: Note Your Credentials

From the application settings page, copy:
- **Domain** (e.g., `your-tenant.auth0.com`)
- **Client ID** (e.g., `abc123xyz456...`)

## Step 4: Create API (Optional but Recommended)

1. Go to **Applications** → **APIs**
2. Click **Create API**
3. Set:
   - Name: `DIU CSE Alumni API`
   - Identifier: `https://api.csediualumni.com` (your API URL)
   - Signing Algorithm: `RS256`
4. Click **Create**
5. Note the **API Identifier** (this is your audience)

## Step 5: Create Roles

1. Go to **User Management** → **Roles**
2. Create the following roles:

| Role Name | Description |
|-----------|-------------|
| Admin | Full administrative access |
| Publisher | Can publish content |
| Editor | Can edit content |
| Member | Regular member (NO admin access) |
| Guest | Guest user (NO admin access) |

For each role:
1. Click **Create Role**
2. Enter the name and description
3. Click **Create**

## Step 6: Create Auth0 Action

This is crucial for roles to work!

1. Go to **Actions** → **Flows** → **Login**
2. Click the **+** button to add an action
3. Choose **Build Custom**
4. Set:
   - Name: `Add Roles to Token`
   - Runtime: `Node 18` (or latest)

5. Paste this code:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://alumni.com';
  
  if (event.authorization) {
    // Add roles to ID token and Access token
    api.idToken.setCustomClaim(`${namespace}/roles`, event.authorization.roles);
    api.accessToken.setCustomClaim(`${namespace}/roles`, event.authorization.roles);
  }
};
```

6. Click **Deploy**
7. Drag the action into the Login flow
8. Click **Apply**

## Step 7: Update Environment Files

### For Development (`src/environments/environment.ts`):

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  frontendUrl: 'http://localhost:4300',
  auth0: {
    domain: 'YOUR-TENANT.auth0.com',           // Replace with your domain
    clientId: 'YOUR-CLIENT-ID',                 // Replace with your client ID
    authorizationParams: {
      redirect_uri: 'http://localhost:4300/auth/callback',
      audience: 'https://api.csediualumni.com', // Replace with your API identifier
    },
    httpInterceptor: {
      allowedList: [
        {
          uri: 'http://localhost:3000/*',
          tokenOptions: {
            authorizationParams: {
              audience: 'https://api.csediualumni.com', // Replace with your API identifier
            },
          },
        },
      ],
    },
  },
};
```

### For Production (`src/environments/environment.production.ts`):

Replace:
- `YOUR-TENANT.auth0.com` with your Auth0 domain
- `YOUR-CLIENT-ID` with your Client ID
- `https://api.csediualumni.com` with your API identifier
- Update the redirect_uri and API URLs to match your production domain

## Step 8: Create Test Users

1. Go to **User Management** → **Users**
2. Click **Create User**
3. Create test users with different role combinations:

### Admin User
- Email: `admin@test.com`
- Password: (set a password)
- Roles: `Admin`

### Member-only User
- Email: `member@test.com`
- Password: (set a password)
- Roles: `Member`

After creating users:
1. Click on the user
2. Go to **Roles** tab
3. Click **Assign Roles**
4. Select the appropriate role(s)
5. Click **Assign**

## Step 9: Test Authentication

1. Start your application: `npm start`
2. Navigate to `http://localhost:4300`
3. Click "Sign In with Auth0"
4. Test with different users:
   - Admin user → Should access dashboard ✅
   - Member-only user → Should see "Access Denied" ❌

## Troubleshooting

### Roles not appearing?
- Check that the Auth0 Action is deployed and added to the Login flow
- Verify the custom claim namespace is `https://alumni.com/roles`
- Check browser console for user object

### Redirect not working?
- Verify callback URLs match exactly in Auth0 settings
- Check that environment configuration is correct
- Look for errors in browser console

### Cannot access admin panel?
- Ensure user has roles other than just "Member" or "Guest"
- Check that roles are properly assigned in Auth0
- Verify the Auth0 Action is working

## Next Steps

- Review the detailed [AUTH0_SETUP.md](./AUTH0_SETUP.md) for advanced configuration
- Configure your backend API to validate Auth0 tokens
- Set up MFA for admin users
- Review Auth0 logs for security monitoring

## Support

For more information:
- [Auth0 Documentation](https://auth0.com/docs)
- [Auth0 Angular SDK](https://auth0.com/docs/quickstart/spa/angular)
- [Auth0 Actions](https://auth0.com/docs/customize/actions)

## Security Checklist

Before deploying to production:
- [ ] Enable MFA for all admin users
- [ ] Set up proper password policies
- [ ] Configure brute force protection
- [ ] Review and test all role assignments
- [ ] Set up Auth0 monitoring and alerts
- [ ] Never commit Auth0 credentials to version control
- [ ] Use environment variables for sensitive configuration
