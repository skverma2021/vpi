# Deployment View

## Overview
The VPI system is deployed as a cloud-hosted web application using the following components:

## Components
- **Next.js App Router** deployed on Vercel
- **PostgreSQL database** hosted on Supabase
- **Prisma ORM** running inside server actions
- **Static assets** (images, diagrams) served via Vercel CDN

## Deployment Diagram (Conceptual)
User → Browser → Vercel Edge → Next.js Server Actions → Supabase PostgreSQL
