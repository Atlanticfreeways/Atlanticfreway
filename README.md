# AtlanticFreway

**Travel & Staycation Platform with Multi-Tier Partner Ecosystem**

A comprehensive travel booking platform featuring a 4-tier affiliate program, consumer booking system, and partner management portal.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start all services
npm run dev:api     # API server (port 5000)
npm run dev:web     # Consumer website (port 3000)  
npm run dev:portal  # Partner portal (port 3001)
```

## 📁 Project Structure

```
apps/
├── api/              # Backend API (Node.js + Express + TypeScript)
├── web/              # Consumer website (Next.js + React)
└── partner-portal/   # Partner dashboard (Next.js + React)

packages/
├── config/           # Shared configuration
├── types/            # TypeScript definitions
└── utils/            # Shared utilities
```

## 🛠 Tech Stack

- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Frontend**: Next.js, React, Tailwind CSS
- **Database**: PostgreSQL
- **Authentication**: JWT + API Keys
- **Deployment**: Vercel (Full-stack)

## ✨ Features

- **Multi-tier Affiliate Program** (4 tiers: 10-50% commission)
- **Consumer Booking Platform** (flights & hotels)
- **Partner Dashboard** with analytics
- **Commission Calculation Engine**
- **Wakanow API Integration**
- **White-label Solutions**

## 🌐 Live Demo

- **Consumer Site**: [Coming Soon]
- **Partner Portal**: [Coming Soon]
- **API Docs**: [Coming Soon]

## 📋 Development

### Prerequisites
- Node.js 18+
- PostgreSQL
- npm/yarn

### Environment Setup
```bash
# API (.env)
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret"
WAKANOW_API_KEY="your-key"

# Frontend (.env.local)
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

### Database Setup
```bash
cd apps/api
npx prisma migrate dev
npx prisma generate
```

## 🚀 Deployment

Ready for production deployment on Vercel:

```bash
# Deploy API
cd apps/api && vercel --prod

# Deploy Consumer Site  
cd apps/web && vercel --prod

# Deploy Partner Portal
cd apps/partner-portal && vercel --prod
```

## 📊 Commission Tiers

| Tier | Requirements | Commission Rate |
|------|-------------|----------------|
| Bronze | $0+ sales | 10% |
| Silver | $10,000+ sales | 20% |
| Gold | $50,000+ sales | 35% |
| Platinum | $100,000+ sales | 50% |

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Links

- [API Documentation](./apps/api/README.md)
- [Deployment Guide](./VERCEL_SETUP.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

---

**Built with ❤️ for the travel industry**