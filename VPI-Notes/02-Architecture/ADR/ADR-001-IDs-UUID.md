# ADR-001: Use UUIDs for All IDs

- **Status:** Accepted  
- **Date:** 2026-02-20  
- **Owner:** s  
- **Related Docs:** [[VPI-ERD]], [[Prisma-Schema]]

---

## 1. Context

The VPI Society Management System will manage data for Blocks, Units, Individuals, Contributions, Ownership, and Residency. The system must be horizontally scalable, support future modules (maintenance, security, events), and remain robust under multi-user, multi-device access.

The initial ERD used numeric IDs, but numeric sequences introduce constraints:

- They are not globally unique  
- They create coupling to a single database instance  
- They leak information (predictable IDs)  
- They complicate sharding or multi-region scaling  
- They are harder to merge across environments (dev/staging/prod)

To support long-term scalability and security, we need a more robust identifier strategy.

---

## 2. Decision

**We will use UUIDv4 as the primary key type for all tables in the system.**

This applies to:

- Blocks  
- Units  
- Individuals  
- Contributions  
- unitOwners  
- unitResidents  

All Prisma models will use:
id String @id @default(uuid())

## 3. Rationale

Why UUIDs?
Globally unique — safe across distributed systems

No central sequence generator — ideal for serverless and Vercel

Non‑guessable — improves security

Easy environment merging — no ID collisions

Future‑proof — supports multi-region Postgres or even future DB migrations

Industry standard for horizontally scalable systems

Alternatives considered
Option A — Auto-increment integers
Pros: simple, readable

Cons: predictable, not globally unique, not scalable

Option B — CUIDs
Pros: URL-safe, sortable

Cons: Less standard, not needed for this domain

UUIDv4 is the best balance of simplicity, security, and scalability.

## 4. Consequences
Positive
Safe for distributed writes

No ID collisions across environments

Better security (IDs cannot be guessed)

Works well with Prisma + Vercel + Postgres

Future modules can be added without schema redesign

Negative / Risks
Slightly larger storage footprint

Less human-readable

Requires consistent handling in UI and logs

## 5. Implementation Notes
Update Prisma schema to use String @id @default(uuid())

Update ERD to reflect UUIDs

Ensure all foreign keys use String

Update seed scripts

Update tests to use UUIDs

Confirm API routes accept UUID parameters

Follow-ups:

[x] Update ERD

[ ] Update Prisma schema

[ ] Update CRUD templates

[ ] Update sequence diagrams