# Event Management System

## Overview

This comprehensive event management system provides complete CRUD functionality for managing events in the DIU CSE Alumni Admin application. The system is built with Angular and follows the provided API structure.

## Features Implemented

### 1. Event Service (`event.service.ts`)
- **Complete API Integration**: All endpoints from the provided API structure
- **Type Safety**: Full TypeScript interfaces matching the API DTOs
- **CRUD Operations**: Create, Read, Update, Delete events
- **Status Management**: Publish/unpublish events
- **Registration Control**: Open/close event registration
- **Filtering**: Support for different event views (all, published, upcoming, past)

### 2. Events List Component (`events.component.ts`)
- **Advanced Data Table**: Sortable, filterable, paginated table using PrimeNG
- **Multi-View Support**: Filter by all events, published, upcoming, and past events
- **Status Indicators**: Visual tags for publication and registration status
- **Bulk Actions**: Quick actions for publish/unpublish and registration control
- **Search Functionality**: Global search across event fields
- **Action Buttons**: Edit, view, delete, and status toggle buttons
- **Justification Dialogs**: Proper justification collection for unpublishing and closing registration

### 3. Event Form Component (`event-form.component.ts`)
- **Comprehensive Form**: All fields from the CreateEventDto
- **Validation**: Client-side validation matching API requirements
- **Create/Edit/Duplicate**: Support for creating new events, editing existing ones, and duplicating events
- **Dynamic UI**: Conditional fields based on registration status
- **Date/Time Handling**: Proper datetime-local input handling
- **URL Validation**: Custom validator for map location URLs
- **Fee Management**: Numeric input for event fees
- **Status Toggles**: Checkboxes for published, registration open, and member-only status

### 4. Event Detail Component (`event-detail.component.ts`)
- **Comprehensive View**: Full event details in a well-organized layout
- **Status Management**: Quick actions for publish/unpublish and registration control
- **Metadata Display**: Creation and update timestamps, event ID
- **Image Support**: Banner image display
- **Location Integration**: Map link support
- **Action Panel**: Edit, delete, duplicate, and status management buttons
- **Responsive Design**: Mobile-friendly layout

### 5. API Structure Compliance
All components fully comply with the provided API structure:

#### DTOs Implemented:
- `CreateEventDto` - Complete event creation with validation
- `UpdateEventDto` - Partial updates using mapped types
- `CloseRegistrationDto` - Justification for closing registration
- `UnpublishEventDto` - Optional justification for unpublishing

#### Endpoints Implemented:
- `POST /events` - Create new event
- `GET /events` - Get all events (admin view)
- `GET /events/published` - Get published events
- `GET /events/upcoming` - Get upcoming events  
- `GET /events/past` - Get past events
- `GET /events/:id` - Get event by ID
- `PATCH /events/:id` - Update event
- `PATCH /events/:id/publish` - Publish event
- `PATCH /events/:id/unpublish` - Unpublish event with justification
- `PATCH /events/:id/registration/open` - Open registration
- `PATCH /events/:id/registration/close` - Close registration with justification
- `DELETE /events/:id` - Delete event

## Key Features

### Event Management
- ✅ **Create Events**: Full form with all required and optional fields
- ✅ **Edit Events**: Update existing events with pre-filled data
- ✅ **Delete Events**: With confirmation dialog
- ✅ **Duplicate Events**: Create new events based on existing ones
- ✅ **View Events**: Detailed view with all information

### Publication Control
- ✅ **Publish Events**: Make events visible to public
- ✅ **Unpublish Events**: Hide events with justification requirement
- ✅ **Draft Mode**: Events can be created as drafts

### Registration Management
- ✅ **Open Registration**: Allow users to register for events
- ✅ **Close Registration**: Prevent new registrations with justification
- ✅ **Capacity Management**: Set maximum participant limits
- ✅ **Member-Only Events**: Restrict to members only

### Data Filtering & Search
- ✅ **Filter Views**: All, Published, Upcoming, Past events
- ✅ **Global Search**: Search across title, location, and description
- ✅ **Table Sorting**: Sort by any column
- ✅ **Pagination**: Handle large datasets efficiently

### Validation & Error Handling
- ✅ **Form Validation**: Client-side validation for all fields
- ✅ **API Error Handling**: Proper error messages and user feedback
- ✅ **Loading States**: Loading indicators during operations
- ✅ **Success Feedback**: Toast notifications for successful operations

### User Experience
- ✅ **Responsive Design**: Works on all device sizes
- ✅ **Intuitive Navigation**: Clear routing and navigation
- ✅ **Status Indicators**: Visual cues for event status
- ✅ **Confirmation Dialogs**: Prevent accidental deletions
- ✅ **Toast Notifications**: Real-time feedback

## File Structure
```
src/app/features/events/
├── event.service.ts           # API service with all endpoints
├── events.component.ts        # Main events list with filtering
├── event-form.component.ts    # Create/Edit/Duplicate form
└── event-detail.component.ts  # Detailed event view
```

## Dependencies
- **PrimeNG Components**: Table, Card, Button, InputText, Checkbox, Toast, ConfirmDialog
- **Angular Forms**: Reactive forms with validation
- **Angular Router**: Navigation and route parameters
- **RxJS**: Observables for API calls

## Usage

### Accessing Events
Navigate to `/apps/events` to view the events list.

### Creating Events
1. Click "New Event" button
2. Fill in all required fields (title, fee, start date, end date)
3. Optionally add description, location, map URL, banner, capacity
4. Set publication and registration status
5. Submit to create

### Managing Events
- **Edit**: Click edit icon or navigate to event detail and click Edit
- **View**: Click view icon or click on event title
- **Delete**: Click delete icon with confirmation
- **Publish/Unpublish**: Use toggle buttons (unpublish requires justification)
- **Registration Control**: Use toggle buttons (close requires justification)

### Event Duplication
1. View event details
2. Click "Duplicate Event" button
3. Form opens pre-filled with event data
4. Modify dates and other fields as needed
5. Submit to create duplicate

## Integration Notes

### Environment Configuration
Ensure your `environment.ts` files have the correct `apiUrl` pointing to your backend API.

### Authentication
The service uses the existing `ApiService` which handles authentication tokens automatically.

### Error Handling
All API calls include proper error handling with user-friendly messages displayed via toast notifications.

## Future Enhancements

- **File Upload**: Banner image upload functionality
- **Rich Text Editor**: Enhanced description editing
- **Calendar Integration**: Visual calendar view of events
- **Export Features**: Export event lists to CSV/PDF
- **Email Notifications**: Automated notifications for event status changes
- **Registration Management**: View and manage event registrations
- **Event Analytics**: Statistics and reporting features

This event management system provides a complete, production-ready solution for managing events in the alumni admin application.
