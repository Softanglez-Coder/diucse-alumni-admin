# Blog Management Feature

This document describes the Blog Management feature implemented in the DIU CSE Alumni Admin application.

## Overview

The Blog Management feature allows administrators to view and manage blogs in the system. The feature is designed with role-based access control where only users with "Publisher" role can publish or unpublish blogs.

## Blog Schema

The blog data model includes:

- `_id`: Unique identifier (MongoDB ObjectId)
- `title`: Blog title
- `content`: Blog content (HTML)
- `author`: Author information (populated from User model)
- `status`: Blog status enum (`draft`, `in_review`, `published`)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Status System

Blog status is managed using a single enum field with the following values:

- **Draft** (`BlogStatus.DRAFT`): Blog is in draft state
- **In Review** (`BlogStatus.IN_REVIEW`): Blog is under review
- **Published** (`BlogStatus.PUBLISHED`): Blog is live and visible to public

## Features

### Blog List (`/apps/blogs`)

- **View all blogs**: Display a comprehensive list of all blogs in the system
- **Search functionality**: Search blogs by title, author name, or status
- **Status filtering**: Visual status indicators for draft, in review, and published blogs
- **Pagination**: Table pagination with configurable rows per page
- **Responsive design**: Mobile-friendly table layout

### Blog Details (`/apps/blogs/:id`)

- **Detailed view**: Complete blog information including title, content, author, and metadata
- **Rich content display**: Properly formatted blog content with HTML rendering
- **Author information**: Display author name and email
- **Timestamps**: Show creation and update dates
- **Status indicator**: Clear visual status representation

### Publisher Actions

Users with "Publisher" role can:

- **Publish blogs**: Convert draft/review blogs to published status
- **Unpublish blogs**: Convert published blogs back to draft status
- **Confirmation dialogs**: Safe actions with confirmation prompts

## Role-Based Access

- **All authenticated users**: Can view blog lists and blog details
- **Publishers only**: Can publish/unpublish blogs
- **No editing/creation**: This admin interface is read-only for content management

## Components

### `BlogsComponent`

- Location: `src/app/features/blogs/blogs.component.ts`
- Responsible for displaying the blog list table
- Includes search, pagination, and publisher actions

### `BlogDetailComponent`

- Location: `src/app/features/blogs/blog-detail.component.ts`
- Shows detailed view of a single blog
- Provides publish/unpublish actions for publishers

### `BlogService`

- Location: `src/app/features/blogs/blog.service.ts`
- Handles API communication for blog operations
- Provides methods for fetching blogs and managing publication status
- Includes additional methods for role-based filtering

## API Endpoints Used

### Core Endpoints

- `GET /blogs` - Fetch all blogs
- `GET /blogs/:id` - Fetch specific blog details
- `PATCH /blogs/:id/publish` - Publish a blog
- `PATCH /blogs/:id/unpublish` - Unpublish a blog

### Additional Endpoints

- `GET /blogs/published` - Get published blogs only
- `GET /blogs/in-review` - Get blogs in review (Publisher role)
- `GET /blogs/me` - Get current user's blogs (Member role)
- `GET /blogs/me/status/:status` - Get user's blogs by status
- `PATCH /blogs/:id/draft` - Set blog to draft status
- `PATCH /blogs/:id/review` - Set blog to review status

## Navigation

The Blog Management feature is accessible through:

1. **Main Navigation**: "Blogs" menu item in the sidebar
2. **Direct URL**: `/apps/blogs` for the blog list
3. **Blog Details**: `/apps/blogs/:id` for individual blog pages

## UI Components Used

- PrimeNG Table for blog listing
- PrimeNG Card for content display
- PrimeNG Tag for status indicators
- PrimeNG Button for actions
- PrimeNG Toast for notifications
- PrimeNG ConfirmDialog for action confirmations

## Styling

The components use a combination of:

- PrimeNG component styling
- Custom CSS for blog-specific layouts
- Responsive design principles
- Consistent color scheme with the rest of the application

## Schema Alignment

The frontend has been fully aligned with the updated backend schema:

- **Single Status Field**: Uses `BlogStatus` enum instead of boolean flags
- **MongoDB ObjectId**: Uses `_id` field instead of `id`
- **Simplified Schema**: Removed unused fields (excerpt, tags, publishedAt)
- **Enhanced API**: Supports additional endpoints for role-based filtering
