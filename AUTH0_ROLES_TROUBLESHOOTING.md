# Admin Panel Access Troubleshooting Guide

## Architecture Overview

This application uses:
- **Auth0** for authentication (user login)
- **Backend API Database** for authorization (roles and permissions)

When a user logs in:
1. Auth0 authenticates the user
2. The admin panel fetches user data from `/auth/me` API endpoint
3. Roles are retrieved from the database (not from Auth0)
4. Access is granted based on database roles

## Problem
Users with `roles: ['admin']` in the database cannot access the admin panel.

## Solution

### Step 1: Verify User Has Roles in Database

Check if the user has admin role in your database:

```sql
-- MongoDB example
db.users.findOne({ email: "user@example.com" })

-- Expected result should include:
{
  email: "user@example.com",
  roles: ["admin"] // or ["member", "admin"]
}
```

### Step 2: Verify API Endpoint Works

Test the `/auth/me` endpoint:

```bash
# Get auth token first (from browser DevTools → Application → Cookies/Local Storage)
curl -X GET https://api.csediualumni.com/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Cookie: YOUR_SESSION_COOKIE"
```

Expected response:
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "roles": ["admin"],
  "staticRoles": ["admin"],
  "designationRoles": []
}
```

### Step 3: Check Browser Console Logs

After logging in, check the browser console for these logs:

```
🔐 Auth0 User authenticated: user@example.com
🔐 Backend API response: { id: "...", email: "...", roles: ["admin"] }
🔐 Backend user data: { id: "...", email: "...", roles: ["admin"] }
🔐 Final user object with roles from DB: { id: "...", roles: ["admin"] }
🔐 hasAdminAccess$ - User roles: ["admin"]
🔐 hasAdminAccess$ - Has non-member/guest role: true
🔐 AuthGuard: Has admin access: true
```

If you see:
- `🔐 No user data from backend API` - The API call failed
- `🔐 Error fetching user from backend:` - Check the error message
- `roles: []` - User has no roles in database

### Step 4: Verify Auth0 Configuration

The backend API requires a valid Auth0 access token. Check your Auth0 settings in `environment.ts`:

```typescript
auth0: {
  domain: 'csediualumni.us.auth0.com',
  clientId: '...',
  authorizationParams: {
    redirect_uri: '...',
    audience: 'https://api.csediualumni.com', // Must match backend
  },
}
```

The `audience` must match your backend API identifier.

## Common Issues

### Issue 1: User Not Found in Database
**Symptom**: Error `User not found` or roles are empty

**Cause**: User authenticated with Auth0 but doesn't exist in database

**Fix**: The backend should automatically create users on first login. Check backend logs for user creation issues.

### Issue 2: CORS or Network Errors
**Symptom**: Console shows `CORS error` or network errors when calling `/auth/me`

**Fix**: 
- Ensure backend API is running and accessible
- Check CORS configuration in backend
- Verify API URL in `environment.ts` is correct

### Issue 3: Invalid Access Token
**Symptom**: `401 Unauthorized` error when calling `/auth/me`

**Fix**:
- Check Auth0 `audience` configuration matches backend
- Ensure Auth0 HTTP interceptor is properly configured
- Clear browser cache and login again

### Issue 4: User Has Only Member/Guest Roles
**Symptom**: User is authenticated but redirected to access denied page

**Cause**: User has only `["member"]` or `["guest"]` roles

**Fix**: Update user roles in database:
```javascript
// MongoDB
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { roles: ["admin"] } }
)
```

## Testing Checklist

After making changes:

1. **Clear browser cache** and **logout completely**
2. **Log in again** to get fresh authentication
3. **Open DevTools Console** and check for:
   - ✅ `🔐 Auth0 User authenticated: your-email@example.com`
   - ✅ `🔐 Backend API response:` shows your user with roles
   - ✅ `🔐 Final user object with roles from DB:` shows roles array
   - ✅ `🔐 hasAdminAccess$ - Has non-member/guest role: true`
   - ✅ `🔐 AuthGuard: Has admin access: true`
4. **Verify access** - Should redirect to dashboard, not access denied

## Backend API Setup

The backend must:

1. **Validate Auth0 JWT tokens** with proper audience
2. **Create/update users** on first login from Auth0
3. **Return user with roles** from `/auth/me` endpoint
4. **Include both static and designation roles** (from committee positions)

Example backend response:
```json
{
  "id": "675835e3f14668ef45e86e2d",
  "email": "user@example.com",
  "name": "User Name",
  "roles": ["admin", "publisher"],
  "staticRoles": ["admin"],
  "designationRoles": ["publisher"],
  "batch": { "name": "2020" }
}
```

## Role Requirements

To access admin panel, users must have **at least one role** that is NOT:
- `member`
- `guest`

Valid admin roles include:
- ✅ `admin` - Full system access
- ✅ `publisher` - Can publish content
- ✅ `editor` - Can edit content
- ✅ `accountant` - Financial access
- ✅ Any custom role except member/guest

## Quick Debug Steps

1. **Check user exists in database**:
   ```javascript
   // In your database
   db.users.findOne({ email: "user@example.com" })
   ```

2. **Check API returns roles**:
   ```bash
   # Test the endpoint (use browser to get auth token)
   curl https://api.csediualumni.com/auth/me \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

3. **Check browser console** for any errors or warnings

4. **Verify Auth0 configuration**:
   - Domain is correct
   - Client ID is correct
   - Audience matches backend API

5. **Check network tab** in DevTools:
   - Look for `/auth/me` request
   - Check if it returns 200 OK
   - Verify response contains roles

## Need Help?

If issues persist, gather this information:
1. Browser console logs (all 🔐 prefixed logs)
2. Network tab showing `/auth/me` request/response
3. Database query showing user's roles
4. Backend API logs during login

This will help diagnose the exact issue.
