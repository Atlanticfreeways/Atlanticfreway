# Flight Scanner - Full Stack Flight Booking Platform

A modern, full-stack flight and hotel booking platform built with MERN stack, featuring real-time pricing, multi-currency support, and advanced search capabilities.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- MongoDB (or use Docker)
- Redis (or use Docker)

### Development Setup

#### Option 1: Using Docker (Recommended)
```bash
# Start all services
docker-compose up

# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# MongoDB: localhost:27017
# Redis: localhost:6379
```

#### Option 2: Local Development

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

## 📁 Project Structure

```
flight-scanner/
├── backend/                 # Express API Server
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── models/         # MongoDB schemas
│   │   ├── services/       # Business logic
│   │   ├── config/         # Configuration
│   │   ├── app.ts          # Express app setup
│   │   └── index.ts        # Server entry point
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                # React SPA
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API client
│   │   ├── store/          # Zustand stores
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Helper functions
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml      # Docker services
├── .env                    # Environment variables
└── README.md
```

## 🔧 Configuration

### Backend Environment Variables
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/flight-scanner
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key
SKYSCANNER_API_KEY=your_api_key
STRIPE_SECRET_KEY=your_stripe_key
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
VITE_MAPBOX_TOKEN=your_mapbox_token
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Flights
- `GET /api/flights/search` - Search flights
- `GET /api/flights/:id` - Get flight details
- `GET /api/flights/trending` - Get trending routes
- `GET /api/flights/price-history/:route` - Get price history

### Hotels
- `GET /api/hotels/search` - Search hotels
- `GET /api/hotels/:id` - Get hotel details
- `GET /api/hotels/near-airport/:airport` - Hotels near airport

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `GET /api/bookings` - Get user bookings
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/bookings` - Get user bookings
- `GET /api/user/searches` - Get search history
- `POST /api/user/alerts` - Create price alert

## 🧪 Testing

### Backend
```bash
cd backend
npm test                    # Run tests
npm run test:watch        # Watch mode
```

### Frontend
```bash
cd frontend
npm test                    # Run tests
npm run test:watch        # Watch mode
```

## 📦 Tech Stack

### Frontend
- React 18+ with TypeScript
- Vite (build tool)
- TailwindCSS + Shadcn/ui
- React Query (data fetching)
- Zustand (state management)
- Framer Motion (animations)
- Vitest (testing)

### Backend
- Node.js + Express
- MongoDB with Mongoose
- Redis (caching)
- Bull (job queue)
- JWT (authentication)
- Zod (validation)
- Jest (testing)

### Infrastructure
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Nginx (reverse proxy)

## 🚀 Deployment

### Production Build
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

### Docker Deployment
```bash
docker-compose -f docker-compose.yml up -d
```

## 📖 Documentation

- [API Documentation](./docs/API.md)
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Contributing Guide](./CONTRIBUTING.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@flightscanner.com or open an issue on GitHub.

## 🗺️ Roadmap

### Phase 1 (MVP)
- ✅ Flight search & display
- ✅ Basic filtering
- ✅ User authentication
- ✅ Booking flow

### Phase 2
- Hotel integration
- Price alerts
- Search history
- User dashboard

### Phase 3
- Price trend analytics
- Mobile app (React Native)
- Advanced recommendations
- Multi-language support

### Phase 4
- AI-powered recommendations
- Loyalty program
- Travel insurance integration
- Group booking features
