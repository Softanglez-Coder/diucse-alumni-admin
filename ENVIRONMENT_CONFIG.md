# DIUCSE Alumni Admin Environment Configuration

This application is configured to work with different environments based on the deployment context.

## Environment Configuration

### Local Development

- **Frontend URL**: `http://localhost:4300`
- **API URL**: `http://localhost:3000`
- **Build Command**: `npm start`

### Development/Staging

- **Frontend URL**: `https://admin-dev.csediualumni.com`
- **API URL**: `https://api-dev.csediualumni.com`
- **Build Command**: `npm run build:dev`

### Production

- **Frontend URL**: `https://admin.csediualumni.com`
- **API URL**: `https://api.csediualumni.com`
- **Build Command**: `npm run build:prod`

## Environment Files

The application uses the following environment files:

- `src/environments/environment.ts` - Default environment (used for local development)
- `src/environments/environment.development.ts` - Development/staging environment
- `src/environments/environment.production.ts` - Production environment

## Available Scripts

- `npm start` - Start development server (uses local environment)
- `npm run build` - Build for production
- `npm run build:dev` - Build for development environment
- `npm run build:prod` - Build for production environment
- `npm test` - Run unit tests

## API Service Usage

The application includes a centralized API service that automatically uses the correct API URL based on the environment. All HTTP requests should use the `ApiService` class:

```typescript
import { ApiService } from './core/services/api.service';

constructor(private apiService: ApiService) {}

// GET request
this.apiService.get('/api/users').subscribe(users => {
  // Handle response
});

// POST request
this.apiService.post('/api/users', userData).subscribe(user => {
  // Handle response
});
```

## Authentication

The application uses JWT tokens for authentication. Tokens are stored in both localStorage and cookies for better security and flexibility.

## Services

### ApiService

- Centralized HTTP client wrapper
- Automatic token injection
- Error handling
- File upload support

### ConfigService

- Environment configuration management
- URL building utilities
- Environment detection

### DataService

- Generic CRUD operations
- Pagination support
- Search functionality

### MembershipService

- Membership-specific operations
- Extends DataService
- Custom membership methods

## Deployment

### Local Development

```bash
npm start
```

### Development/Staging Deployment

```bash
npm run build:dev
```

### Production Deployment

```bash
npm run build:prod
```

The build output will be in the `dist/` directory and can be deployed to any static hosting service.

## CORS Configuration

Make sure your API server is configured to allow requests from the appropriate frontend URLs:

- Local: `http://localhost:4300`
- Development: `https://admin-dev.csediualumni.com`
- Production: `https://admin.csediualumni.com`
