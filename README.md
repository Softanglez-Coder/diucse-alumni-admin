# DIU CSE Alumni Admin Dashboard

A modern, responsive Angular 20 admin dashboard for managing DIU CSE Alumni Association with ERP-style layout, authentication, and CRUD operations.

## Features

- **Authentication System**: Cookie-based authentication with JWT tokens
- **Responsive Design**: Mobile-friendly layout with Tailwind CSS and PrimeNG
- **Modular Architecture**: Feature-based structure with lazy loading
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Role-based Access**: Route guards for secure access control
- **Modern UI**: Clean, professional design with consistent styling

## Modules Implemented

### Core Features
- **Dashboard**: Analytics, statistics, and overview
- **Authentication**: Login/logout with form validation
- **Users**: User management with profiles and roles
- **Settings**: General settings and profile management

### Content Management
- **Banners**: Homepage banner management
- **Blogs**: Blog post creation and management
- **News**: News article management
- **Events**: Event scheduling and management

### Academic Management
- **Batches**: Student batch management
- **Scholarships**: Scholarship programs and applications

### Financial Management
- **Donations**: Donation tracking and management
- **Jobs**: Job posting and career opportunities

## Technical Stack

- **Angular 20**: Latest Angular framework
- **TypeScript**: Type-safe development
- **PrimeNG**: Component library for UI elements
- **Tailwind CSS**: Utility-first CSS framework
- **RxJS**: Reactive programming with observables

## Development Server

Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:4300/`

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── guards/           # Route guards
│   │   ├── interceptors/     # HTTP interceptors
│   │   └── services/         # Core services
│   ├── features/
│   │   ├── auth/            # Authentication
│   │   ├── dashboard/       # Dashboard
│   │   ├── users/           # User management
│   │   ├── banners/         # Banner management
│   │   ├── batches/         # Batch management
│   │   ├── blogs/           # Blog management
│   │   ├── events/          # Event management
│   │   ├── news/            # News management
│   │   ├── jobs/            # Job management
│   │   ├── donations/       # Donation management
│   │   ├── scholarship/     # Scholarship management
│   │   └── settings/        # Settings
│   └── shared/
│       └── components/      # Reusable components
└── styles.scss             # Global styles
```

## Authentication

The application uses cookie-based authentication:
- **Login**: `/auth/login`
- **Protected Routes**: All `/apps/*` routes require authentication
- **Auto-redirect**: Unauthenticated users are redirected to login

## Default Credentials

For testing purposes:
- **Username**: `admin@example.com`
- **Password**: `admin123`

## Build

Build the project for production:

```bash
ng build
```

## Status

✅ **Completed Features**:
- Authentication system with route guards
- Responsive layout with navigation
- User management (list, create, edit)
- Dashboard with statistics
- All CRUD modules created and functional
- Form validation and error handling
- Modern UI with PrimeNG and Tailwind

🔄 **In Progress**:
- Real API integration (currently using mock data)
- Advanced form controls and validation
- File upload functionality
- Advanced filtering and search

🚧 **Future Enhancements**:
- Email notifications
- Bulk operations
- Export/import functionality
- Advanced reporting
- Multi-language support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
