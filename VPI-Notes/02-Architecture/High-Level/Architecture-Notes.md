# VPI Architecture Notes

## 1. System Context

- **Core purpose:**
  - Manage society contributions, later maintenance, security, events.
- **Primary modules (current scope):**
  - Blocks & Units
  - Individuals, Owners, Residents
  - Contributions
  - Reporting (payment status)

- **External systems:**
  - Payment gateway (future)
  - Email/SMS notifications (future)
  - OAuth provider

---

## 2. Logical Architecture

- **Frontend:**
  - Next.js App Router
  - shadcn/ui, Tailwind
  - TanStack Query for data fetching

- **Backend:**
  - Next.js server actions
  - Prisma ORM
  - PostgreSQL

- **Auth:**
  - OAuth (NextAuth or similar)
  - Roles (future: ADMIN, MANAGER, RESIDENT)

---

## 3. Key Design Decisions

- IDs as UUIDs (see [[ADR-001-IDs-UUID]])
- Prisma as ORM (see [[ADR-003-Prisma-ORM]])
- Horizontally scalable: stateless app, managed Postgres
- Domain modeled around Units + temporal ownership/residency

---

## 4. Diagrams Index

- **ERD:**
  - [[VPI-ERD]]
- **Flows:**
  - [[Payment-Flow]]
  - [[Monthly-Report-Generation]]
- **Whiteboards (Excalidraw):**
  - [[Architecture-Whiteboard]]
  - [[UI-Sketches]]

---

## 5. Open Questions

- How to model partial payments?
- How to handle ownership disputes?
- How to expose reports to residents vs managers?

---

## 6. Future Extensions

- Maintenance complaints
- Security logs
- Event management
- Notifications (email/SMS)
- Role-based dashboards
