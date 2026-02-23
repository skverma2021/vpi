# Seed Strategy

## Purpose
Provide initial data for development and testing.

## Tools
- Prisma Seed
- Faker.js for generating Individuals

## Seed Data

### Blocks
- Create 3 blocks: A, B, C

### Units
- Each block has 10 units
- Unit naming: A-101, A-102, ..., C-110

### Individuals
- Generate 20 fake individuals using faker.js

### Ownership
- Assign each unit a random owner

### Contributions
- Generate contributions for the last 3 months

## Command
`npx prisma db seed`
