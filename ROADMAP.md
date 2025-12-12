# 🗺️ Flight Scanner & Travel Safety Guardian Roadmap

## 🚀 Phase 1: MVP Core (Flight Search & Basics)
**Goal:** Deliver a functional flight search engine with user authentication and basic booking management.

- [x] **Project Setup**
    - [x] Initialize MERN Stack (Backend & Frontend)
    - [x] Configure Docker & Docker Compose
    - [x] Set up CI/CD pipelines (GitHub Actions)
- [x] **UI & Frontend Infrastructure**
    - [x] Install TailwindCSS & Configure theme (colors, fonts).
    - [x] Set up UI Components (Navbar, Hero, Forms).
    - [x] Install Lucide React (icons) and Framer Motion (animations).
    - [x] Implement Responsive Layout & Routing.
- [x] **Authentication**
    - [x] User Registration & Login (JWT)
    - [x] Secure Password Hashing (Bcrypt)
    - [x] Session Management
- [x] **Flight Search Engine**
    - [x] **Integrate Real-Time Data**: Implemented **Google Flights Scraper** (Playwright) for live pricing.
    - [x] Implement Search Interface (Origin, Destination, Dates)
    - [x] Flight Results Display (List view with sorting)
    - [x] Basic Filters (Price, Duration, Airlines)
- [x] **Booking System**
    - [x] Create Booking Data Model (Real MongoDB Persistence)
    - [x] "Book Now" flow (Connected to Backend API)
    - [x] User Dashboard to view active bookings

## 🛡️ Phase 2: Travel Safety & Advisory Integration (Core Differentiator)
**Goal:** Integrate real-time safety data to inform users about their destination's risk level.

- [x] **Data Integration**
    - [x] **Ingest Government Data**: Implemented **US Dept of State RSS Scraper** for real-time advisories.
    - [x] **Health Alerts**: Integrated **CDC Travel Health Notices (RSS)** for disease outbreaks.
    - [x] **Safety Scoring**: Algorithm normalizes "Level 1-4" advisories into 0-100 safety scores.
    - [x] **Destination Search**: Users can search any country/city for safety data.
- [x] **UI Implementation**
    - [x] **Safety Widget**: Display safety score on Flight Results page with advisory details.
    - [x] **Destination Search Bar**: Search any destination with fly-to map animation.
    - [x] **Interactive Map**: Leaflet.js visualization with color-coded risk zones.
    - [x] **Health Alerts Display**: Real CDC alerts shown in dashboard cards.
- [x] **Alerts System**
    - [x] **Safety Watchdog**: `AlertMonitorService` with 100+ city-to-country mappings.
    - [x] **Notifications**: Email dispatcher for safety status changes.

## 🏨 Phase 3: Accommodation & Enhanced Planning (Deferred)
**Goal:** Expand into a full travel planner with hotels and currency tools.

- [ ] **Hotel Search** (Requires API partnership)
    - [ ] Integrate Booking.com or Expedia Affiliate API
    - [ ] Map View with real hotel locations
    - [ ] "Bundle & Save" logic
- [ ] **Financial Tools**
    - [x] **Multi-currency toggle**: Implemented `CurrencyContext` with Navbar toggle and real-time conversion.
    - [ ] Price History Charts (Chart.js)
    - [ ] Price Drop Alerts (Bull Queue + Email Service)

## 📱 Phase 4: Mobile Native
**Goal:** Scale to mobile platforms.

- [ ] **Mobile Native**
    - [ ] Develop React Native companion app
    - [ ] Sync user state between Web and Mobile

## 🤖 Phase 5: Future AI Expansion (Deferred)
**Goal:** Add AI-driven personalization and assistance.

- [ ] **AI Assistant**
    - [ ] "Travel Guardian" Chatbot: Answer questions like "Is it safe to walk at night in X?"
    - [ ] Personalized Itinerary Recommendations via GenAI

## 🛠️ Technical Debt & Optimization
- [ ] Implement comprehensive Unit & Integration Tests (Vitest/Jest)
- [ ] Optimize Redis Caching strategy for Search Results (1hr TTL)
- [ ] Conduct accessibility audit (WCAG 2.1 AA)
