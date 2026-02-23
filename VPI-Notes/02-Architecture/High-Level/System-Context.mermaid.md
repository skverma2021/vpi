```mermaid
flowchart LR

User -->|Browser| VPIApp

VPIApp -->|Reads/Writes| Database[(PostgreSQL)]
VPIApp -->|Authentication| AuthProvider[(Future Auth Service)]

subgraph VPIApp [VPI System]
    UI[Next.js UI]
    SA[Server Actions]
    ORM[Prisma ORM]
end

UI --> SA
SA --> ORM
ORM --> Database
```
