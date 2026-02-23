# Middleware

## Purpose
Protect authenticated routes using Next.js middleware.

## File
`middleware.ts` at project root.

## Behavior
- Allow public routes:
  - /login
  - /api/auth/*
- Protect all other routes

## Example Logic
1. Check session using `auth()`
2. If no session → redirect to /login
3. If session exists → allow request
