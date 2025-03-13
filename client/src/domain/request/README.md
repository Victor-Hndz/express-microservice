# Request Domain Documentation

This directory contains the core domain logic for the geospatial data request system.

## Domain Models

### Value Objects

#### Area
```typescript
interface Area {
  north: number;
  west: number;
  south: number;
  east: number;
}
```

#### TimeRange
```typescript
interface TimeRange {
  years: number[];
  months: number[];
  days: number[];
  hours: number[];
}
```

#### ProcessingOptions
```typescript
interface ProcessingOptions {
  tracking: boolean;
  debug: boolean;
  noCompile: boolean;
  noExecute: boolean;
  noMaps: boolean;
  animation: boolean;
}
```

## Domain Events

Events that represent state changes in the form:

```typescript
type RequestFormEvent =
  | { type: "AREA_CHANGED"; payload: Area }
  | { type: "TYPES_SELECTED"; payload: string[] }
  | { type: "RANGES_SELECTED"; payload: string[] }
  | { type: "ALL_TOGGLED"; payload: boolean };
```

## Business Rules

### Area Validation
- North must be between -90 and 90 degrees
- South must be between -90 and 90 degrees
- West must be between -180 and 180 degrees
- East must be between -180 and 180 degrees
- North must be greater than South
- Full area is defined as [90, -180, -90, 180]

### Time Range Validation
- Years must be valid numbers
- Months must be between 1 and 12
- Days must be between 1 and 31
- Hours must be between 0 and 23
- At least one value required in each category

### Processing Rules
- If `isAll` is true, `instants` must be empty
- If OMP is enabled, `nThreads` must be provided
- If MPI is enabled, `nProces` must be provided
- `noCompile` and `noExecute` cannot both be true

## Usage Examples

### Form Domain Service

```typescript
// Validate area coordinates
const isValidArea = FormDomainService.validateArea({
  north: 90,
  west: -180,
  south: -90,
  east: 180,
});

// Validate time range
const isValidTimeRange = FormDomainService.validateTimeRange({
  years: [2020, 2021],
  months: [1, 2, 3],
  days: [1, 15],
  hours: [0, 6, 12, 18],
});
```

### Event Handling

```typescript
// Handle area change event
handleFormEvent({
  type: "AREA_CHANGED",
  payload: { north: 90, west: -180, south: -90, east: 180 },
});

// Handle types selection event
handleFormEvent({
  type: "TYPES_SELECTED",
  payload: ["cont", "disp"],
});
```

## Error Handling

Domain errors are thrown when business rules are violated:

```typescript
class DomainError extends Error {
  constructor(message: string) {
    super(`Domain Error: ${message}`);
  }
}

// Example usage
if (!FormDomainService.validateArea(area)) {
  throw new DomainError("Invalid area coordinates");
}
```

## Testing

Test files for domain logic are located in `__tests__` directory. Run tests with:

```bash
npm run test:domain
```

## Best Practices

1. Keep domain logic pure and free from external dependencies
2. Use value objects for complex data structures
3. Validate data at domain boundaries
4. Document business rules and their implementation
5. Write comprehensive tests for all business rules
