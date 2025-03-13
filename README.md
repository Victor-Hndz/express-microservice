# Geospatial Data Request System

A full-stack web application built with Express.js and React, focused on managing geospatial and meteorological data requests efficiently and securely.

## Table of Contents
- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Development](#development)
- [Contributing](#contributing)

## Overview

The Geospatial Data Request System is a modern web application that enables users to submit, track, and manage geospatial and meteorological data requests. Built with a focus on type safety and clean architecture, it provides a robust platform for handling complex data requirements.

### Key Features
- User authentication and authorization
- Geospatial data request submission and tracking
- Request history with duplicate detection
- API documentation with Swagger
- Type-safe development with TypeScript
- Comprehensive error handling

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: shadcn/ui + Tailwind CSS
- **Routing**: wouter

### Backend
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with session-based auth
- **API Documentation**: Express JSDoc Swagger
- **Session Store**: PostgreSQL session store

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

The application implements secure session-based authentication:

- Session data stored in PostgreSQL
- Password hashing with scrypt
- Protected routes with authentication middleware
- CSRF protection
- Secure session configuration

## Development

### Code Style and Quality
- ESLint for code linting
- Prettier for code formatting
- TypeScript strict mode enabled
- Comprehensive error handling

### Database Management
```bash
# Push schema changes
npm run db:push
```

### Type Safety
- Shared types between frontend and backend
- Zod schemas for runtime validation
- Drizzle ORM for type-safe database queries

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Development Guidelines
- Write clean, maintainable code
- Follow existing patterns and conventions
- Add tests for new features
- Update documentation as needed
- Use provided tools and components

## License

MIT License - see LICENSE file for details