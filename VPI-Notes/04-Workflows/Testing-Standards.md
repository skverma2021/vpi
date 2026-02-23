# Testing Standards

## Tools
- Vitest for unit tests
- Playwright for end-to-end tests

## Unit Tests
- Test Zod schemas
- Test utility functions
- Test server actions (mock Prisma)

## Integration Tests
- Test server actions with test database

## E2E Tests
- Login flow
- CRUD flows for Individuals, Units, Contributions
- Monthly report generation

## Naming Convention
- *.test.ts for unit tests
- *.spec.ts for E2E tests

## Test Data
- Use seed data from seed-Strategy.md
