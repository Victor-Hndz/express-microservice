# Geospatial Data Request System

A sophisticated NestJS microservice implementing Domain-Driven Design (DDD) with hexagonal architecture, focused on creating a robust geospatial and meteorological data request management system.

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Development](#development)
- [Contributing](#contributing)

## Overview

The Geospatial Data Request System is a full-stack web application designed to manage and process geospatial and meteorological data requests. It provides a robust interface for users to submit, track, and manage their data requests while implementing best practices in software architecture and design.

### Key Features
- User authentication and authorization
- Geospatial data request management
- Request history tracking
- API documentation with Swagger
- Type-safe development with TypeScript
- Clean architecture implementation

## Architecture

The application follows a hexagonal architecture pattern with clear separation of concerns:

### Layers
1. **Domain Layer**
   - Core business logic
   - Domain entities and value objects
   - Domain services and interfaces

2. **Application Layer**
   - Use cases and application services
   - Input/Output ports
   - DTOs and mappers

3. **Infrastructure Layer**
   - Database implementations
   - External service adapters
   - Framework-specific code

### Technology Stack
- **Frontend**: React 18 with TypeScript
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **API Documentation**: Swagger/OpenAPI
- **Authentication**: Passport.js with session-based auth
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: TanStack Query

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Create .env file
cp .env.example .env

# Required variables:
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
SESSION_SECRET="your-session-secret"
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## API Documentation

API documentation is available at `/api-docs` when the server is running. The documentation is generated using OpenAPI/Swagger specifications.

### Core Endpoints

#### Authentication
- `POST /api/register` - Create new user account
- `POST /api/login` - User login
- `POST /api/logout` - User logout

#### User Management
- `GET /api/user` - Get current user profile
- `PATCH /api/user` - Update user profile
- `DELETE /api/user` - Delete user account

#### Request Management
- `POST /api/requests` - Submit new request
- `GET /api/requests` - Get user's request history


## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   ├── pages/         # Page components
│   │   └── types/         # TypeScript types
├── server/
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data access layer
│   ├── auth.ts           # Authentication logic
│   └── db.ts             # Database configuration
└── shared/
    └── schema/           # Shared types and schemas
```

## Authentication

The application uses session-based authentication with Passport.js:

- Sessions are stored in PostgreSQL
- Passwords are hashed using scrypt
- Protected routes require authentication
- Session management includes CSRF protection

## Development

### Code Style
- ESLint for code linting
- Prettier for code formatting
- TypeScript strict mode enabled

### Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Database Migrations
```bash
# Generate migration
npm run db:generate

# Apply migrations
npm run db:push
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

### Development Guidelines
- Write clean, maintainable code
- Follow the existing architecture
- Add tests for new features
- Update documentation as needed
- Follow the commit message convention

## License

MIT License - see LICENSE file for details