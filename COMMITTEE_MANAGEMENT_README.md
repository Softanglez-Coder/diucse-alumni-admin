# Committee Management System

This document outlines the committee management functionality implemented in the DIU CSE Alumni Admin panel.

## Features Implemented

### 1. Committee Management
- **List Committees**: View all committees with pagination, search, and filtering
- **Create Committee**: Add new committees with name, start date, end date
- **Edit Committee**: Update committee details
- **Publish/Unpublish**: Control committee visibility
- **Committee Details**: View individual committee information with member management

### 2. Committee Designations
- **List Designations**: View all available committee designations/roles
- **Create Designation**: Add new roles/positions (President, Vice President, Secretary, etc.)
- **Edit Designation**: Update designation details
- **Priority System**: Set priority levels for designations (lower number = higher priority)
- **Active/Inactive Status**: Control which designations are available for assignment

### 3. Committee Members Management
- **Assign Members**: Add users to committees with specific designations
- **Remove Members**: Unassign members from committees
- **Member History**: Track member assignments and changes over time
- **Active/Inactive Status**: Manage member status within committees

## API Endpoints Used

### Committee Endpoints
- `GET /committees` - List all committees
- `POST /committees` - Create new committee
- `GET /committees/:id` - Get committee details
- `PATCH /committees/:id` - Update committee
- `PATCH /committees/:id/publish` - Publish/unpublish committee
- `DELETE /committees/:id` - Delete committee
- `GET /committees/published` - Get published committees
- `GET /committees/current` - Get current active committee
- `GET /committees/previous` - Get previous committees
- `GET /committees/upcoming` - Get upcoming committees

### Committee Designation Endpoints
- `GET /committee-designations` - List all designations
- `POST /committee-designations` - Create new designation
- `GET /committee-designations/:id` - Get designation details
- `PATCH /committee-designations/:id` - Update designation
- `DELETE /committee-designations/:id` - Delete designation
- `GET /committee-designations/committee/:committeeId` - Get designations for a committee

### Committee Member Endpoints
- `POST /committee-designations/members/assign` - Assign member to committee
- `PATCH /committee-designations/members/:memberId/unassign` - Unassign member
- `GET /committee-designations/committee/:committeeId/members` - Get committee members
- `GET /committee-designations/committee/:committeeId/structure` - Get committee structure
- `GET /committee-designations/committee/:committeeId/full` - Get committee with all member details
- `GET /committee-designations/user/:userId/history` - Get user's committee history
- `GET /committee-designations/user/:userId/roles` - Get user's active roles

## Components Created

### 1. Committee Service (`committee.service.ts`)
- Centralized service for all committee-related API calls
- Type definitions for Committee, CommitteeDesignation, and CommitteeMember
- Methods for CRUD operations on committees, designations, and member assignments

### 2. Committees List (`committees.component.ts`)
- Displays paginated list of all committees
- Search and filter functionality
- Quick actions for publishing/unpublishing
- Navigation to committee details and member management

### 3. Committee Form (`committee-form.component.ts`)
- Create/edit committee form
- Form validation
- Date picker for start and end dates
- Publish status toggle for existing committees

### 4. Committee Detail (`committee-detail.component.ts`)
- Detailed view of individual committee
- Member list with designation information
- Add/remove member functionality
- Links to edit committee and manage designations

### 5. Committee Designations (`committee-designations.component.ts`)
- List view of all available designations/roles
- CRUD operations for designations
- Status management (active/inactive)

### 6. Designation Form (`designation-form.component.ts`)
- Create/edit designation form
- Priority setting
- Description field
- Active status toggle

## Navigation

The committee management features are accessible through the main navigation menu:
- **Committees** → **Committees**: Main committee list
- **Committees** → **Designations**: Manage committee roles/designations

## Data Models

### Committee
```typescript
interface Committee {
  _id?: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Committee Designation
```typescript
interface CommitteeDesignation {
  _id?: string;
  name: string;
  description?: string;
  priority?: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Committee Member
```typescript
interface CommitteeMember {
  _id?: string;
  committeeId: string;
  designationId: string;
  userId: string;
  assignedDate: Date;
  unassignedDate?: Date;
  isActive: boolean;
  notes?: string;
  // Populated fields
  committee?: Committee;
  designation?: CommitteeDesignation;
  user?: User;
}
```

## Usage Flow

1. **Setup Designations**: First, create the necessary committee designations (President, Secretary, etc.)
2. **Create Committee**: Create a new committee with basic information
3. **Assign Members**: Navigate to the committee detail page to assign members with their roles
4. **Publish Committee**: Mark the committee as published when ready
5. **Manage Members**: Add/remove members as needed throughout the committee's lifecycle

## Security

- All endpoints require authentication
- Admin role required for creating, editing, and deleting committees and designations
- Member role can view committee information and their own history
- Public endpoints available for viewing published committee information

## Future Enhancements

- **File Uploads**: Add support for committee documents and member photos
- **Notifications**: Notify members when assigned to committees
- **Reports**: Generate committee reports and member statistics
- **Terms**: Add support for committee terms/sessions
- **Permissions**: More granular permission system for committee operations
- **Calendar Integration**: Link committee events and meetings
- **Email Templates**: Automated emails for committee assignments
