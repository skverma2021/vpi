# Auth Flow (NextAuth.js)

## Overview
The VPI system uses NextAuth.js for authentication. Users must log in before accessing any protected routes.

## Providers
- Credentials Provider (email + password)
- (Future) OAuth providers such as Google

## Login Flow
1. User visits /login
2. Submits email + password
3. NextAuth validates credentials
4. On success → session cookie created
5. User redirected to /dashboard

## Protected Routes
The following routes require authentication:
- /dashboard
- /individuals/*
- /units/*
- /contributions/*
- /reports/*

## Session Access
Server Actions:
- Use `auth()` to access session

Client Components:
- Use `useSession()` hook

## Logout Flow
1. User clicks Logout
2. NextAuth clears session cookie
3. Redirect to /login
