# Atlanticfreway

Travel & Staycation Platform with Multi-Tier Partner Ecosystem

## Quick Start

```bash
# Install dependencies
npm install

# Start API server
cd apps/api && npm run dev

# Start consumer website
cd apps/web && npm run dev

# Start partner portal
cd apps/partner-portal && npm run dev
```

## Architecture

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: Next.js + React + Tailwind CSS
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + Email/API Key

## Features

- Multi-tier affiliate program (4 tiers: 10-50% commission)
- Consumer booking platform (flights & hotels)
- Partner dashboard and analytics
- Commission calculation engine
- Wakanow API integration
- White-label offerings

## Status

MVP foundation - requires database setup and API integration.

## License

MIT