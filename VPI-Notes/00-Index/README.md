# VPI Society Management System

A comprehensive management system for **Vasundhra Palm Island (VPI)** residential society. This application manages contributions, residents, owners, and units across three blocks: Mist, Breeze, and Dew.

## Features

- **Dashboard**: Overview of contribution status and collection rates
- **Blocks Management**: Manage the 3 blocks (Mist, Breeze, Dew)
- **Units Management**: Track all units (~100 per block) with area and assignments
- **Individuals**: Manage owners and residents information
- **Contributions**: Record and track monthly payments from units
- **Payment Status Reports**: Track paid/unpaid status for each month

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query
- **Validation**: Zod
- **Authentication**: NextAuth.js (OAuth ready)
- **Deployment**: Vercel ready

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or cloud like Vercel Postgres, Neon, etc.)

### Installation

1. **Clone and install dependencies**:
```bash
cd vpi
npm install
```

2. **Configure environment variables**:
```bash
# Copy .env and update with your database URL
cp .env .env.local
# Edit .env.local with your PostgreSQL connection string
```

3. **Generate Prisma client and run migrations**:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. **Seed the database** (creates blocks and sample units):
```bash
npm run db:seed
```

5. **Start the development server**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:push` | Push schema changes to database |
| `npm run db:seed` | Seed the database with initial data |
| `npm run db:studio` | Open Prisma Studio |

## Database Schema

### Tables
- **blocks**: Society blocks (Mist, Breeze, Dew)
- **units**: Individual flats/units in each block
- **individuals**: Owners and residents
- **contributions**: Monthly payment records
- **unit_owners**: Ownership history for units
- **unit_residents**: Residency history for units

## Deployment on Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

For detailed deployment instructions, see [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## License

This project is private and proprietary to Vasundhra Palm Island society.
