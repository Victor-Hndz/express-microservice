# Geospatial Data Request System

A sophisticated NestJS microservice implementing Domain-Driven Design (DDD) with hexagonal architecture, focused on creating a robust geospatial and meteorological data request management system.

## Architecture Overview

The application follows Clean Architecture and Domain-Driven Design principles, organized into the following layers:

### Domain Layer (`client/src/domain/`)
- Contains core business logic and domain models
- Implements value objects and entities
- Defines domain events and business rules

Key components:
- `types.ts`: Core domain types and interfaces
- `FormDomainService.ts`: Business logic and validation rules

### Application Layer (`client/src/hooks/`)
- Manages application state and business flows
- Implements use cases
- Handles form state management

Key components:
- `use-request-form.ts`: Main form logic and state management
- `use-auth.ts`: Authentication state management

### Infrastructure Layer (`client/src/infrastructure/`)
- Handles external concerns (API calls, data persistence)
- Implements repositories and external services

Key components:
- `requestRepository.ts`: API communication and data transformation

### Presentation Layer (`client/src/components/`)
- UI components following atomic design
- Form components and layouts

Key components:
- `forms/basic-settings.tsx`: Basic form fields
- `forms/multi-select-field.tsx`: Reusable multi-select component

## Domain Model

### RequestFormState
```typescript
interface RequestFormState {
  variable: string;
  pressureLevels: string;
  timeRange: {
    years: number[];
    months: number[];
    days: number[];
    hours: number[];
  };
  area: {
    north: number;
    west: number;
    south: number;
    east: number;
  };
  types: string[];
  ranges: string[];
  // ... other properties
}
```

### Form Events
```typescript
type RequestFormEvent =
  | { type: "AREA_CHANGED"; payload: Area }
  | { type: "TYPES_SELECTED"; payload: string[] }
  | { type: "RANGES_SELECTED"; payload: string[] }
  | { type: "ALL_TOGGLED"; payload: boolean };
```

## Business Rules

1. Area Validation
   - Full area coordinates: 90,-180,-90,180
   - Default coordinates: 0,0,0,0
   - North must be greater than South
   - West must be less than East

2. Time Range Validation
   - Years: Valid numerical years
   - Months: 1-12
   - Days: 1-31
   - Hours: 0-23

3. Processing Options
   - Mutually exclusive options (e.g., noCompile and noExecute)
   - Dependencies (e.g., nThreads requires OMP)

## Component Usage

### Basic Form Setup
```typescript
import { useRequestForm } from "@/hooks/use-request-form";

function RequestForm() {
  const {
    form,
    handleSubmit,
    isSubmitting,
    // ... other props
  } = useRequestForm();

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <BasicSettings form={form} />
        {/* Other form sections */}
      </form>
    </Form>
  );
}
```

### Multi-Select Component
```typescript
<MultiSelectField
  form={form}
  name="types"
  label="Types"
  options={TypesEnum}
  selectedItems={selectedTypes}
  onSelectAll={handleSelectAllTypes}
  onSelectItem={handleSelectItem}
/>
```

## Error Handling

The application implements comprehensive error handling at multiple levels:

1. Domain Layer
   - Validation errors for business rules
   - Domain-specific exceptions

2. Application Layer
   - Form validation errors
   - State management errors

3. Infrastructure Layer
   - API communication errors
   - Data transformation errors

## Extending the Form

To add new fields or functionality:

1. Update Domain Types
   - Add new types in `domain/request/types.ts`
   - Define validation rules in `FormDomainService.ts`

2. Update Repository
   - Add data transformation in `requestRepository.ts`
   - Implement new API endpoints if needed

3. Update Components
   - Create new form components in `components/forms/`
   - Add to existing form sections or create new ones

## Development Guidelines

1. Follow TypeScript best practices
2. Maintain separation of concerns
3. Write unit tests for business logic
4. Document new components and features
5. Follow the existing architectural patterns

## Prerequisites

- Node.js (v16+)
- npm or yarn
- PostgreSQL database

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Access the application at `http://localhost:3000`

## Contributing

1. Follow the existing architecture and patterns
2. Write clean, documented code
3. Test thoroughly before submitting changes
4. Update documentation as needed