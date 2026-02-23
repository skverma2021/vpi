# Code Generation Prompt Standards

Use these prompts when generating CRUD, server actions, components, or utilities.

---

## CRUD Generation Prompt
“Generate full CRUD for <Entity> using:
- Next.js App Router
- Prisma
- Zod validation
- Server Actions
- shadcn UI components
- Naming conventions from Naming-Conventions.md
- Routes from API-Route-Map.md
- UI layout from Excalidraw sketches”

## Server Action Prompt
“Generate server actions for <Entity> using Zod validation and Prisma. Follow naming conventions (verb + entity). Include revalidatePath.”

## Form Component Prompt
“Generate a shadcn form for <Entity> using the Zod schema. Use the field order and layout from the Excalidraw form sketch.”

## Table Component Prompt
“Generate a table component for <Entity> using the Excalidraw list sketch. Include search, edit, delete, and pagination.”

## Utility Function Prompt
“Generate a utility function for <purpose>. Follow naming conventions and ensure pure, testable logic.”

## Protected Route Prompt
“Generate a protected page using NextAuth session checks and middleware rules from Middleware.md.”

