# Geospatial Data Request System

A full-stack web application built with Express.js and React for managing geospatial and meteorological data requests.

## Technology Stack

- **Frontend**: React with TypeScript, TailwindCSS, shadcn/ui components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Zod validation
- **Authentication**: Passport.js with session-based auth

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions and configurations
│   │   ├── pages/         # Page components
│   │   └── types/         # TypeScript type definitions
├── server/
│   ├── routes.ts          # Express routes
│   ├── storage.ts         # Database operations
│   ├── auth.ts           # Authentication setup
│   └── db.ts             # Database configuration
└── shared/
    └── schema/           # Shared type definitions and schemas
```

## Features

- User authentication (login/register)
- Geospatial data request form with:
  - Variable selection (Geopotential, Temperature)
  - Time range specification
  - Area coordinates
  - Processing options
  - Parallelization settings
- Request history tracking
- Form validation and error handling
- Responsive design

## Setup and Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

This will start both the Express backend and React frontend in development mode.

## Components

### Form Components

- **BasicSettings**: Handles variable selection and basic parameters
- **MultiSelectField**: Reusable dropdown with multi-select functionality
- **Request Form**: Main form component with validation and submission logic

### Authentication

- Login/Register functionality
- Protected routes
- Session management
- User profile management

## API Endpoints

### Authentication
- `POST /api/register` - Create new user account
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user info

### Requests
- `POST /api/requests` - Submit new request
- `GET /api/requests` - Get user's request history

## Environment Variables

The following environment variables are required:

- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for session management

## Contributing

1. Write clean, maintainable code
2. Follow the existing project structure
3. Test thoroughly before submitting changes
4. Keep dependencies up to date

## Development Workflow

1. Make code changes
2. Run tests if applicable
3. Start development server
4. Test changes locally
5. Commit and push changes

## License

MIT License