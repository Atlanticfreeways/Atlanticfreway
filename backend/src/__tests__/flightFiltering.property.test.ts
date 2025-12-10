import fc from 'fast-check';
import {
  filterFlights,
  sortFlights,
  filterAndSortFlights,
  getAvailableAirlines,
  getPriceRange,
  getAvailableStops,
} from '../utils/flightFilters';
import { SkyscannerFlight } from '../services/skyscannerService';

// Helper to generate mock flights
const generateMockFlight = (overrides?: Partial<SkyscannerFlight>): SkyscannerFlight => ({
  id: `flight-${Math.random()}`,
  departure: {
    airport: 'NYC',
    city: 'New York',
    date: '2024-12-25',
    time: '08:00',
  },
  arrival: {
    airport: 'LAX',
    city: 'Los Angeles',
    date: '2024-12-25',
    time: '12:00',
  },
  airline: 'United',
  price: 250,
  currency: 'USD',
  stops: 0,
  duration: 300,
  deeplink: 'https://skyscanner.com',
  ...overrides,
});

/**
 * Property 3: Filter Intersection
 * For any set of applied filters, the system SHALL return only flights matching ALL filter criteria simultaneously.
 * Validates: Requirements 2.3
 * **Feature: flight-scanner, Property 3: Filter Intersection**
 */
describe('Property 3: Filter Intersection', () => {
  it('should return only flights matching all filter criteria', () => {
    fc.assert(
      fc.property(
        fc.record({
          minPrice: fc.integer({ min: 100, max: 300 }),
          maxPrice: fc.integer({ min: 300, max: 500 }),
          maxStops: fc.integer({ min: 0, max: 2 }),
        }),
        ({ minPrice, maxPrice, maxStops }) => {
          // Generate flights with various prices and stops
          const flights = [
            generateMockFlight({ price: 150, stops: 0 }),
            generateMockFlight({ price: 250, stops: 1 }),
            generateMockFlight({ price: 350, stops: 2 }),
            generateMockFlight({ price: 450, stops: 0 }),
          ];

          const filtered = filterFlights(flights, { minPrice, maxPrice, maxStops });

          // All filtered flights should match ALL criteria
          return filtered.every(
            (f) => f.price >= minPrice && f.price <= maxPrice && f.stops <= maxStops
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return empty array when no flights match all criteria', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const flights = [
          generateMockFlight({ price: 100, stops: 0 }),
          generateMockFlight({ price: 150, stops: 1 }),
        ];

        // Filter with impossible criteria
        const filtered = filterFlights(flights, {
          minPrice: 500,
          maxPrice: 600,
          maxStops: 0,
        });

        return filtered.length === 0;
      }),
      { numRuns: 50 }
    );
  });

  it('should filter by airline correctly', () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom('United', 'Delta', 'American'), { minLength: 1, maxLength: 2 }),
        (selectedAirlines) => {
          const flights = [
            generateMockFlight({ airline: 'United' }),
            generateMockFlight({ airline: 'Delta' }),
            generateMockFlight({ airline: 'American' }),
            generateMockFlight({ airline: 'Southwest' }),
          ];

          const filtered = filterFlights(flights, { airlines: selectedAirlines });

          // All filtered flights should be from selected airlines
          return filtered.every((f) => selectedAirlines.includes(f.airline));
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Sorting Tests
 */
describe('Flight Sorting', () => {
  it('should sort flights by price correctly', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const flights = [
          generateMockFlight({ price: 350 }),
          generateMockFlight({ price: 150 }),
          generateMockFlight({ price: 250 }),
        ];

        const sorted = sortFlights(flights, 'price', 'asc');

        // Should be in ascending order
        for (let i = 1; i < sorted.length; i++) {
          if (sorted[i].price < sorted[i - 1].price) {
            return false;
          }
        }
        return true;
      }),
      { numRuns: 50 }
    );
  });

  it('should sort flights by duration correctly', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const flights = [
          generateMockFlight({ duration: 360 }),
          generateMockFlight({ duration: 240 }),
          generateMockFlight({ duration: 300 }),
        ];

        const sorted = sortFlights(flights, 'duration', 'asc');

        // Should be in ascending order
        for (let i = 1; i < sorted.length; i++) {
          if (sorted[i].duration < sorted[i - 1].duration) {
            return false;
          }
        }
        return true;
      }),
      { numRuns: 50 }
    );
  });

  it('should sort flights by stops correctly', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const flights = [
          generateMockFlight({ stops: 2 }),
          generateMockFlight({ stops: 0 }),
          generateMockFlight({ stops: 1 }),
        ];

        const sorted = sortFlights(flights, 'stops', 'asc');

        // Should be in ascending order
        for (let i = 1; i < sorted.length; i++) {
          if (sorted[i].stops < sorted[i - 1].stops) {
            return false;
          }
        }
        return true;
      }),
      { numRuns: 50 }
    );
  });

  it('should support descending sort order', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const flights = [
          generateMockFlight({ price: 150 }),
          generateMockFlight({ price: 350 }),
          generateMockFlight({ price: 250 }),
        ];

        const sorted = sortFlights(flights, 'price', 'desc');

        // Should be in descending order
        for (let i = 1; i < sorted.length; i++) {
          if (sorted[i].price > sorted[i - 1].price) {
            return false;
          }
        }
        return true;
      }),
      { numRuns: 50 }
    );
  });
});

/**
 * Utility Functions Tests
 */
describe('Flight Filter Utilities', () => {
  it('should extract available airlines', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const flights = [
          generateMockFlight({ airline: 'United' }),
          generateMockFlight({ airline: 'Delta' }),
          generateMockFlight({ airline: 'United' }),
        ];

        const airlines = getAvailableAirlines(flights);

        // Should have unique airlines
        return airlines.length === 2 && airlines.includes('United') && airlines.includes('Delta');
      }),
      { numRuns: 50 }
    );
  });

  it('should calculate price range correctly', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const flights = [
          generateMockFlight({ price: 100 }),
          generateMockFlight({ price: 500 }),
          generateMockFlight({ price: 300 }),
        ];

        const range = getPriceRange(flights);

        return range.min === 100 && range.max === 500;
      }),
      { numRuns: 50 }
    );
  });

  it('should extract available stops', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const flights = [
          generateMockFlight({ stops: 0 }),
          generateMockFlight({ stops: 2 }),
          generateMockFlight({ stops: 1 }),
          generateMockFlight({ stops: 0 }),
        ];

        const stops = getAvailableStops(flights);

        // Should have unique stops in order
        return stops.length === 3 && stops[0] === 0 && stops[1] === 1 && stops[2] === 2;
      }),
      { numRuns: 50 }
    );
  });
});
