# Flight Scanner Web App - Technical Blueprint

this project can be embeded into a flight booking platform  

## Project Overview
Users can get travel advisory, travel safety for a selected country or region

A full-stack flight and hotel booking platform leveraging Skyscanner API, built with MERN (MongoDB, Express, React, Node.js) and enhanced with modern open-source tools for performance, scalability, and user experience. 
Features a polished landing page with scroll-triggered progressive timeline, smooth animations, and an intuitive search interface.
---

## Architecture Overview

### Tech Stack

**Frontend:**
- React 18+ with TypeScript
- Vite (lightning-fast build tool)
- TailwindCSS + Shadcn/ui (accessible component library)
- React Query (data fetching & caching)
- Zustand (lightweight state management)
- Framer Motion (smooth animations and transitions)
- React Spring (physics-based animations)
- Mapbox GL (flight route visualization)
- Chart.js + React-Chartjs-2 (price trend analytics)
- Socket.io-client (WebSocket for real-time updates)
- React Router v6 (client-side routing)
- Zod (schema validation)
- Axios (HTTP client)
- date-fns (date manipulation)
- clsx (conditional classnames)

**Backend:**
- Node.js + Express
- MongoDB with Mongoose ODM
- Redis (caching layer for API responses)
- Bull (job queue for background tasks)
- JWT + bcrypt (authentication)

**DevOps & Infrastructure:**
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Nginx (reverse proxy)
- Prometheus + Grafana (monitoring)

**Open Source Tools:**
- Sentry (error tracking)
- Plausible Analytics (privacy-first analytics)
- Minio (S3-compatible object storage)

---

## Project Structure

```
flight-scanner/
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/      # Reusable UI components (Button, Card, Modal, etc.)
│   │   │   ├── layout/      # Layout components (Header, Footer, Sidebar)
│   │   │   ├── landing/     # Landing page components (Hero, Timeline, Features)
│   │   │   ├── search/      # Search components (SearchForm, Filters, Results)
│   │   │   ├── booking/     # Booking flow components
│   │   │   └── dashboard/   # User dashboard components
│   │   ├── pages/           # Route pages (Home, Search, Booking, Profile)
│   │   ├── hooks/           # Custom React hooks (useSearch, useBooking, etc.)
│   │   ├── services/        # API client and external services
│   │   ├── store/           # Zustand stores (auth, search, bookings)
│   │   ├── types/           # TypeScript interfaces and types
│   │   ├── utils/           # Helper functions and utilities
│   │   ├── styles/          # Global styles and theme
│   │   ├── animations/      # Reusable animation definitions
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── public/              # Static assets
│   ├── vite.config.ts       # Vite configuration
│   ├── tailwind.config.ts   # TailwindCSS configuration
│   ├── tsconfig.json        # TypeScript configuration
│   └── package.json
│
├── backend/                  # Express API
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── controllers/     # Business logic
│   │   ├── models/          # MongoDB schemas
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── services/        # External API integration
│   │   ├── jobs/            # Background tasks (Bull queues)
│   │   ├── config/          # Configuration and constants
│   │   ├── utils/           # Helper functions
│   │   ├── types/           # TypeScript interfaces
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Server entry point
│   ├── .env.example         # Environment variables template
│   ├── tsconfig.json        # TypeScript configuration
│   └── package.json
│
├── docker-compose.yml       # Local development services
├── .github/
│   └── workflows/           # CI/CD pipelines (test, build, deploy)
├── .gitignore
├── README.md
└── CONTRIBUTING.md
```

### Frontend State Management (Zustand)
```typescript
// Store structure
├── authStore.ts          // User auth, login, logout
├── searchStore.ts        // Search queries, filters, results
├── bookingStore.ts       // Booking state, cart
├── uiStore.ts            // Theme, notifications, modals
└── priceAlertStore.ts    // Price alerts management
```

### Frontend API Services
```typescript
// Service structure
├── flightService.ts      // Flight search, details, trending
├── hotelService.ts       // Hotel search and details
├── bookingService.ts     // Booking operations
├── authService.ts        // Authentication endpoints
├── userService.ts        // User profile and preferences
└── analyticsService.ts   // Analytics and tracking
```

---

## Landing Page & Frontend Polish

### Landing Page Design
The landing page features a modern, scroll-driven experience with progressive timeline animations:

#### Hero Section
- **Full-viewport hero** with animated background (gradient or video)
- **Headline**: "Find Your Perfect Flight, Instantly"
- **Subheadline**: "Search millions of flights and hotels worldwide"
- **CTA Button**: "Start Searching" with hover animations
- **Scroll indicator**: Animated chevron showing more content below

#### Scroll Progress Timeline
A vertical timeline that activates as users scroll, showcasing the platform's key features:

1. **Search** (0-25% scroll)
   - Icon: Magnifying glass with animation
   - Text: "Search flights across 1000+ airlines"
   - Visual: Animated flight paths on map

2. **Compare** (25-50% scroll)
   - Icon: Comparison chart
   - Text: "Compare prices and find the best deals"
   - Visual: Price comparison cards sliding in

3. **Book** (50-75% scroll)
   - Icon: Ticket/booking confirmation
   - Text: "Secure checkout with multiple payment options"
   - Visual: Payment method icons appearing

4. **Track** (75-100% scroll)
   - Icon: Tracking/notification bell
   - Text: "Get price alerts and booking updates"
   - Visual: Notification cards stacking

#### Interactive Elements
- **Smooth scroll animations**: Elements fade/slide in as they enter viewport
- **Parallax effects**: Background layers move at different speeds
- **Counter animations**: Numbers count up when visible (e.g., "2M+ flights searched")
- **Hover states**: Cards lift and glow on hover
- **Micro-interactions**: Buttons have ripple effects, icons animate on hover

### Frontend Polish & UX Enhancements

#### Design System
- **Color Palette**: 
  - Primary: Modern blue (#0066FF)
  - Secondary: Vibrant orange (#FF6B35)
  - Neutral: Grays for text and backgrounds
  - Accent: Green for success states
- **Typography**: 
  - Headlines: Bold, modern sans-serif (Inter, Poppins)
  - Body: Clean, readable sans-serif
  - Monospace: For code/technical content
- **Spacing**: 8px grid system for consistency
- **Shadows**: Subtle elevation shadows for depth
- **Borders**: Rounded corners (8px default) for modern feel

#### Component Refinements
- **Search Form**: 
  - Glassmorphism effect (frosted glass background)
  - Smooth focus states with color transitions
  - Autocomplete suggestions with smooth animations
  - Mobile-optimized with stacked inputs
  
- **Flight Cards**:
  - Gradient backgrounds for airlines
  - Smooth hover lift effect
  - Quick-view modal on click
  - Price highlight with animation
  - Airline logo and rating display
  
- **Navigation**:
  - Sticky header with blur effect
  - Smooth scroll-to-section navigation
  - Mobile hamburger menu with slide animation
  - Active state indicators
  
- **Buttons**:
  - Multiple variants: primary, secondary, outline, ghost
  - Loading states with spinner animation
  - Disabled states with reduced opacity
  - Smooth transitions on all state changes

#### Animation Library
- **Framer Motion**: For complex animations and transitions
- **React Spring**: For physics-based animations
- **Intersection Observer**: For scroll-triggered animations
- **CSS Animations**: For simple, performant transitions

#### Accessibility & Performance
- **WCAG 2.1 AA Compliance**:
  - Keyboard navigation throughout
  - Screen reader support with ARIA labels
  - Color contrast ratios ≥ 4.5:1
  - Focus indicators visible on all interactive elements
  
- **Performance Optimizations**:
  - Lazy loading for images and components
  - Code splitting for faster initial load
  - Image optimization (WebP with fallbacks)
  - Debounced scroll listeners
  - GPU-accelerated animations (transform/opacity only)

#### Dark Mode Support
- System preference detection
- Toggle in header
- Smooth transitions between themes
- Persistent user preference
- Optimized colors for both modes

#### Responsive Design Breakpoints
- **Mobile**: 320px - 640px (single column, stacked)
- **Tablet**: 641px - 1024px (two columns, optimized spacing)
- **Desktop**: 1025px+ (full layout with sidebars)
- **Large Desktop**: 1440px+ (max-width container with padding)

---

## Core Features

### 1. Flight Search & Discovery
- **Multi-city & Round-trip Search**: Support flexible itineraries
- **Real-time Price Updates**: WebSocket integration for live pricing
- **Advanced Filters**: Stops, airlines, departure times, price range
- **Price Alerts**: Notify users when prices drop
- **Search History**: Cached searches for quick access

### 2. Hotel Integration
- **Skyscanner Hotel API**: Integrated hotel search alongside flights
- **Map View**: Visualize hotels near airports
- **Reviews & Ratings**: Aggregated from open sources

### 3. User Experience
- **Dark/Light Mode**: System preference detection
- **Multi-currency Support**: Real-time exchange rates (Open Exchange Rates API)
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliance
- **Progressive Web App**: Offline capability with service workers

### 4. Analytics & Insights
- **Price Trend Charts**: Historical price data visualization
- **Best Time to Book**: ML-powered recommendations
- **Popular Routes**: Trending searches dashboard
- **User Behavior Analytics**: Privacy-respecting tracking

### 5. Booking & Payments
- **Secure Checkout**: Stripe integration
- **Multiple Payment Methods**: Cards, digital wallets
- **Booking Confirmation**: Email + SMS notifications
- **Itinerary Management**: User dashboard for bookings

---

## API Endpoints (Backend)

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
```

### Flights
```
GET    /api/flights/search
GET    /api/flights/:id
GET    /api/flights/trending
GET    /api/flights/price-history/:route
```

### Hotels
```
GET    /api/hotels/search
GET    /api/hotels/:id
GET    /api/hotels/near-airport/:airport
```

### User
```
GET    /api/user/profile
PUT    /api/user/profile
GET    /api/user/bookings
GET    /api/user/saved-searches
POST   /api/user/price-alerts
```

### Admin
```
GET    /api/admin/analytics
GET    /api/admin/system-health
POST   /api/admin/cache-refresh
```

---

## Database Schema (MongoDB)

### Users
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  preferences: {
    currency: String,
    theme: String,
    notifications: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Flights (Cached from Skyscanner)
```javascript
{
  _id: ObjectId,
  skyscannerQuoteId: String,
  departure: {
    airport: String,
    date: Date,
    time: String
  },
  arrival: {
    airport: String,
    date: Date,
    time: String
  },
  price: Number,
  currency: String,
  airline: String,
  stops: Number,
  duration: Number,
  deeplink: String,
  cachedAt: Date,
  expiresAt: Date
}
```

### Bookings
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  flightId: ObjectId,
  hotelId: ObjectId,
  status: String (pending, confirmed, cancelled),
  totalPrice: Number,
  currency: String,
  passengers: Array,
  paymentId: String,
  createdAt: Date
}
```

### Price Alerts
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  route: {
    from: String,
    to: String
  },
  targetPrice: Number,
  currency: String,
  isActive: Boolean,
  createdAt: Date
}
```

---

## Caching Strategy

### Redis Cache Layers
1. **API Response Cache**: 1-hour TTL for flight searches
2. **Exchange Rates**: 24-hour TTL
3. **Airport Data**: 7-day TTL
4. **User Sessions**: 30-day TTL

### Cache Invalidation
- Manual refresh via admin panel
- Automatic expiration based on TTL
- Event-driven updates for price changes

---

## Background Jobs (Bull Queue)

1. **Price Update Job**: Fetch latest prices every 30 minutes
2. **Price Alert Job**: Check and notify users of price drops
3. **Email Notifications**: Send booking confirmations, alerts
4. **Data Cleanup**: Remove expired cache entries
5. **Analytics Aggregation**: Compile daily/weekly reports

---

## Security Measures

- **HTTPS/TLS**: All communications encrypted
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevent API abuse (express-rate-limit)
- **Input Validation**: Joi/Zod schema validation
- **CORS**: Properly configured cross-origin policies
- **Environment Variables**: Sensitive data in .env
- **SQL Injection Prevention**: Mongoose parameterized queries
- **XSS Protection**: Content Security Policy headers
- **CSRF Protection**: Token-based CSRF defense

---

## Performance Optimizations

### Frontend
- **Code Splitting**: React.lazy() for route-based and component-based splitting
- **Image Optimization**: 
  - WebP format with PNG fallbacks
  - Responsive images with srcset
  - Lazy loading with Intersection Observer
  - Image compression and CDN delivery
- **Bundle Optimization**:
  - Tree-shaking unused code
  - Dynamic imports for heavy libraries
  - Minification and compression (gzip/brotli)
- **Runtime Performance**:
  - Memoization with React.memo and useMemo
  - Debounced search and scroll listeners
  - Virtual scrolling for large lists
  - GPU-accelerated animations (transform/opacity)
- **Caching Strategy**:
  - Service workers for offline support
  - HTTP caching headers
  - React Query cache management
  - Local storage for user preferences
- **Metrics & Monitoring**:
  - Core Web Vitals tracking (LCP, FID, CLS)
  - Performance budgets
  - Real User Monitoring (RUM)
  - Error tracking with Sentry

### Backend
- Database indexing on frequently queried fields
- Redis caching for expensive operations
- Connection pooling for MongoDB
- Pagination for large datasets
- Query optimization with lean() in Mongoose

### Infrastructure
- CDN for static assets (Cloudflare free tier)
- Nginx gzip compression
- HTTP/2 support
- Load balancing for horizontal scaling

---

## Deployment Strategy

### Development
```bash
docker-compose up
```

### Staging
- Automated deployment on PR merge to `develop`
- GitHub Actions workflow
- Docker image pushed to registry

### Production
- Blue-green deployment strategy
- Automated health checks
- Rollback capability
- Environment-specific configs

---

## Monitoring & Observability

### Metrics
- API response times
- Database query performance
- Cache hit/miss rates
- Error rates and types
- User session metrics

### Logging
- Structured logging with Winston
- Centralized log aggregation (ELK stack optional)
- Error tracking with Sentry

### Alerting
- Slack notifications for critical errors
- Email alerts for system issues
- Dashboard for real-time monitoring

---

## Landing Page Implementation Details

### Scroll Timeline Component Architecture
```typescript
// Component hierarchy
<LandingPage>
  <Hero />
  <ScrollTimeline>
    <TimelineItem step={1} title="Search">
      <SearchFeature />
    </TimelineItem>
    <TimelineItem step={2} title="Compare">
      <CompareFeature />
    </TimelineItem>
    <TimelineItem step={3} title="Book">
      <BookFeature />
    </TimelineItem>
    <TimelineItem step={4} title="Track">
      <TrackFeature />
    </TimelineItem>
  </ScrollTimeline>
  <CTA />
  <Footer />
</LandingPage>
```

### Animation Triggers
- **Scroll Progress**: Tracks viewport scroll position (0-100%)
- **Element Visibility**: Triggers when element enters viewport
- **Stagger Effects**: Sequential animations for list items
- **Parallax Layers**: Background moves slower than foreground
- **Counter Animations**: Numbers animate from 0 to target value

### Key Animations
1. **Hero Section**:
   - Fade-in on load
   - Subtle background parallax
   - Button hover scale and glow effect

2. **Timeline Items**:
   - Slide in from left/right alternating
   - Icon rotation and scale on visibility
   - Text fade-in with stagger
   - Connecting line animation

3. **Feature Cards**:
   - Lift effect on hover
   - Shadow expansion
   - Icon animation on hover
   - Smooth color transitions

4. **Statistics Section**:
   - Counter animations
   - Progress bars filling
   - Staggered appearance

### Responsive Behavior
- **Mobile**: Single column, simplified animations, touch-optimized
- **Tablet**: Two columns, moderate animations
- **Desktop**: Full animations, parallax effects, multi-column layouts

---

## Development Workflow

### Local Setup
```bash
# Clone repo
git clone <repo>

# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Setup environment
cp backend/.env.example backend/.env
# Edit .env with your Skyscanner API key

# Start services
docker-compose up
```

### Git Workflow
- Feature branches: `feature/flight-search`
- Pull requests with code review
- Automated tests on PR
- Merge to `develop` for staging
- Tag releases on `main`

---

## Testing Strategy

### Frontend
- **Unit Tests**: Vitest
  - Test utility functions and hooks
  - Test store logic (Zustand)
  - Test service functions
  - Coverage target: 80%+
  
- **Component Tests**: React Testing Library
  - Test component rendering
  - Test user interactions
  - Test state changes
  - Test accessibility (ARIA labels, keyboard nav)
  
- **Visual Regression**: Percy or Chromatic
  - Catch unintended UI changes
  - Compare across browsers
  - Responsive design validation
  
- **E2E Tests**: Playwright
  - Test critical user flows (search → book)
  - Test authentication flows
  - Test payment processing
  - Test responsive behavior
  
- **Performance Tests**: Lighthouse CI
  - Monitor Core Web Vitals
  - Track bundle size
  - Enforce performance budgets
  
- **Accessibility Tests**: axe-core
  - Automated accessibility scanning
  - WCAG 2.1 AA compliance
  - Keyboard navigation testing

### Backend
- Unit tests: Jest
- Integration tests: Supertest
- API tests: Postman/Insomnia
- Coverage target: 85%+

---

## Scalability Considerations

1. **Horizontal Scaling**: Stateless backend services
2. **Database Sharding**: By user ID or region if needed
3. **Microservices**: Separate services for flights, hotels, payments
4. **Message Queue**: Kafka for event streaming (future)
5. **GraphQL**: Consider for complex data queries (future)

---

## Cost Optimization

- **Free Tier Services**: Skyscanner free tier, Stripe free tier
- **Open Source**: No licensing costs
- **Self-hosted**: Docker on affordable VPS (DigitalOcean, Linode)
- **CDN**: Cloudflare free tier
- **Monitoring**: Prometheus + Grafana (self-hosted)

---

## Roadmap

### Phase 1 (MVP)
- Flight search & display
- Basic filtering
- User authentication
- Booking flow

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

---

## Getting Started

1. Clone the repository
2. Set up environment variables
3. Run `docker-compose up`
4. Access frontend at `http://localhost:3000`
5. API available at `http://localhost:5000`

---

## Contributing

- Fork the repository
- Create feature branch
- Submit pull request
- Follow code style guidelines
- Ensure tests pass

---

## License

MIT License - Open source and free to use



---

## Frontend Best Practices & Code Quality

### Code Organization
- **Component Structure**: One component per file, co-locate styles
- **Naming Conventions**: PascalCase for components, camelCase for functions
- **File Organization**: Group by feature, not by type
- **Barrel Exports**: Use index.ts for clean imports

### TypeScript Standards
- **Strict Mode**: Enable all strict checks
- **Type Safety**: Avoid `any`, use proper types
- **Interfaces**: Define clear contracts for props and state
- **Generics**: Use for reusable components and hooks

### React Best Practices
- **Functional Components**: Use hooks, avoid class components
- **Custom Hooks**: Extract reusable logic
- **Memoization**: Use React.memo for expensive components
- **Key Props**: Always provide stable keys in lists
- **Error Boundaries**: Catch and handle component errors

### Performance Best Practices
- **Lazy Loading**: Code split routes and heavy components
- **Memoization**: Prevent unnecessary re-renders
- **Debouncing**: Optimize frequent events (scroll, resize, input)
- **Virtual Scrolling**: For large lists
- **Image Optimization**: Use appropriate formats and sizes

### Styling Standards
- **TailwindCSS**: Utility-first approach
- **CSS Modules**: For component-scoped styles when needed
- **Design Tokens**: Consistent colors, spacing, typography
- **Dark Mode**: Support both light and dark themes
- **Responsive**: Mobile-first approach

### State Management
- **Zustand Stores**: Separate concerns (auth, search, UI)
- **React Query**: Server state management
- **Local State**: Use useState for component-level state
- **Context**: Avoid prop drilling with context API

### Error Handling
- **Error Boundaries**: Catch React errors
- **Try-Catch**: Handle async operations
- **User Feedback**: Show meaningful error messages
- **Logging**: Track errors with Sentry
- **Fallbacks**: Graceful degradation

### Accessibility
- **Semantic HTML**: Use proper HTML elements
- **ARIA Labels**: Add for screen readers
- **Keyboard Navigation**: Support Tab, Enter, Escape
- **Color Contrast**: Meet WCAG AA standards
- **Focus Management**: Visible focus indicators

### Git Workflow
- **Branches**: `feature/`, `bugfix/`, `hotfix/` prefixes
- **Commits**: Descriptive, atomic commits
- **PRs**: Require code review before merge
- **Linting**: ESLint + Prettier on pre-commit
- **Testing**: All tests must pass before merge

### Development Tools
- **ESLint**: Code quality and style enforcement
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **Commitlint**: Enforce commit message standards
- **VS Code Extensions**: ESLint, Prettier, TypeScript Vue Plugin

### Documentation
- **Component Stories**: Storybook for component documentation
- **README**: Clear setup and usage instructions
- **API Documentation**: Document custom hooks and utilities
- **Comments**: Explain complex logic, not obvious code
- **Type Definitions**: Self-documenting with TypeScript

---

## Deployment & Hosting

### Frontend Deployment
- **Build**: `npm run build` generates optimized bundle
- **Hosting**: Vercel, Netlify, or AWS S3 + CloudFront
- **CDN**: Cloudflare for global distribution
- **SSL/TLS**: Automatic HTTPS with Let's Encrypt
- **Caching**: Aggressive caching for static assets

### Environment Configuration
- **Development**: Local development with hot reload
- **Staging**: Pre-production environment for testing
- **Production**: Optimized, monitored production build

### Monitoring & Analytics
- **Error Tracking**: Sentry for frontend errors
- **Performance**: Datadog or New Relic
- **Analytics**: Plausible for privacy-first tracking
- **Uptime**: Monitoring service for availability
- **Logs**: Centralized logging with ELK or similar

---

## Future Enhancements

### Phase 2 Features
- **Mobile App**: React Native for iOS/Android
- **Advanced Filters**: ML-powered recommendations
- **Social Features**: Share trips, group bookings
- **Loyalty Program**: Points and rewards system

### Phase 3 Features
- **AI Chatbot**: Natural language search
- **Voice Search**: Voice-to-text flight search
- **AR Features**: Visualize flights on map
- **Blockchain**: Decentralized booking verification

### Technology Upgrades
- **GraphQL**: Consider for complex queries
- **Micro-frontends**: Scale with multiple teams
- **Web Components**: Reusable across frameworks
- **WebAssembly**: Performance-critical calculations

