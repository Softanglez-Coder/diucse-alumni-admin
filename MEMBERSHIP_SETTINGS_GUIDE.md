# Membership Settings Implementation

This document explains how to use the membership settings feature that allows administrators to configure membership-related settings such as fees and requirements.

## Overview

The membership settings feature provides a complete CRUD interface for managing settings with the following structure:

```typescript
interface Setting {
  _id: string;
  group: string; // e.g., "membership"
  key: string; // e.g., "membership_fee"
  description: string; // Human-readable description
  value: any; // The actual setting value
  createdAt: string;
  updatedAt: string;
  __v: number;
}
```

## Components

### 1. SettingsService

**Location:** `src/app/features/settings/settings.service.ts`

A service that handles all API interactions for settings management:

```typescript
import { SettingsService, Setting, SettingsGroup, SettingsKey } from "./settings.service";

// Create a new setting
settingsService.createSetting({
  group: SettingsGroup.Membership,
  key: SettingsKey.MembershipFee,
  description: "How many fees needed to avail membership",
  value: 1000,
});

// Get all settings by group
settingsService.getSettingsByGroup(SettingsGroup.Membership);

// Update a setting
settingsService.updateSetting(settingId, updatedData);

// Delete a setting
settingsService.deleteSetting(settingId);
```

### 2. MembershipSettingsComponent

**Location:** `src/app/features/settings/membership-settings.component.ts`

A complete UI component for managing membership settings with:

- Data table showing all membership settings
- Add/Edit dialog form
- Delete confirmation
- Form validation
- Toast notifications

**Features:**

- ✅ Create new membership settings
- ✅ Edit existing settings
- ✅ Delete settings with confirmation
- ✅ Real-time data refresh
- ✅ Form validation
- ✅ Error handling

### 3. Settings Main Component

**Location:** `src/app/features/settings/settings.component.ts`

Updated to include a link to the membership settings page.

## API Integration

The service connects to the following API endpoints:

```
POST   /settings          - Create a new setting
GET    /settings          - Get all settings
GET    /settings/:id      - Get setting by ID
PATCH  /settings/:id      - Update a setting
DELETE /settings/:id      - Delete a setting
GET    /settings/:group   - Get settings by group
GET    /settings/:key     - Get setting by key
```

### Example API Request/Response

**Create Setting Request:**

```json
POST /settings
{
  "group": "membership",
  "key": "membership_fee",
  "description": "How many fees needed to avail membership",
  "value": 1000
}
```

**Response:**

```json
{
  "group": "membership",
  "key": "membership_fee",
  "description": "How many fees needed to avail membership",
  "value": 1000,
  "_id": "6897595884eb9cc2f62739eb",
  "createdAt": "2025-08-09T14:21:12.678Z",
  "updatedAt": "2025-08-09T14:21:12.678Z",
  "__v": 0
}
```

## Routes

The following route has been added to `app.routes.ts`:

```typescript
{
  path: 'settings',
  children: [
    // ... existing routes
    {
      path: 'membership',
      loadComponent: () => import('./features/settings/membership-settings.component')
        .then(c => c.MembershipSettingsComponent)
    }
  ]
}
```

**Access URL:** `/apps/settings/membership`

## Enums

### SettingsGroup

```typescript
export enum SettingsGroup {
  Membership = "membership",
  // Add more groups as needed
}
```

### SettingsKey

```typescript
export enum SettingsKey {
  MembershipFee = "membership_fee",
  // Add more keys as needed
}
```

## Usage Example

Here's how to use the settings in your components:

```typescript
import { Component, OnInit } from "@angular/core";
import { SettingsService, SettingsGroup, SettingsKey } from "../settings/settings.service";

@Component({
  selector: "app-my-component",
  template: `
    <div>
      <p>Membership Fee: {{ membershipFee | currency }}</p>
    </div>
  `,
})
export class MyComponent implements OnInit {
  membershipFee = 0;

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    // Get membership fee setting
    this.settingsService.getSettingByKey(SettingsKey.MembershipFee).subscribe((setting) => {
      this.membershipFee = setting.value;
    });
  }
}
```

## Navigation

1. Go to the main Settings page: `/apps/settings`
2. Click on "Membership Settings" card
3. You'll be redirected to: `/apps/settings/membership`

## Dependencies

The component uses the following PrimeNG modules:

- CardModule
- ButtonModule
- InputTextModule
- InputNumberModule
- TableModule
- ToastModule
- ConfirmDialogModule
- DialogModule

## Security

- All endpoints require proper authentication
- Admin role required for create, update, and delete operations
- Public access for read operations (GET by group/key)

## Future Enhancements

You can extend this system by:

1. **Adding more setting types:**

   ```typescript
   export enum SettingsKey {
     MembershipFee = "membership_fee",
     MembershipDuration = "membership_duration",
     MaxMembersPerBatch = "max_members_per_batch",
   }
   ```

2. **Adding validation rules:**

   ```typescript
   // In the component
   this.settingForm = this.fb.group({
     key: ["", Validators.required],
     description: ["", Validators.required],
     value: [null, [Validators.required, Validators.min(0), Validators.max(10000)]],
   });
   ```

3. **Adding setting categories for better organization**

4. **Implementing setting history/audit trail**

5. **Adding bulk operations (import/export settings)**

## Testing

To test the functionality:

1. Navigate to `/apps/settings/membership`
2. Click "Add Setting" to create a new membership setting
3. Fill in the form and save
4. Verify the setting appears in the table
5. Test edit and delete operations

The system is now ready for managing membership settings with a complete UI and API integration!
