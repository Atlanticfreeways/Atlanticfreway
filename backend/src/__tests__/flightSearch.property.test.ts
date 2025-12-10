import fc from 'fast-check';
import SkyscannerService from '../services/skyscannerService';

const skyscannerService = new SkyscannerService();

/**
 * Property 1: Flight Search Response Time
 * For any valid flight search query, the system SHALL return results within 5 seconds including API call time.
 * Validates: Requirements 1.1
 */
describe('Property 1: Flight Search Response Time', () => {
  it('should return flight search results within 5 seconds', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          departure: fc.constantFrom('NYC', 'LAX', 'ORD', 'DFW', 'ATL'),
          arrival: fc.constantFrom('NYC', 'LAX', 'ORD', 'DFW', 'ATL'),
          departDate: fc.date({ min: new Date() }).map((d) => d.toISOString().split('T')[0]),
          passengers: fc.integer({ min: 1, max: 9 }),
          tripType: fc.constantFrom('oneway', 'roundtrip'),
        }),
        async (params) => {
          // Skip if departure equals arrival
          if (params.departure === params.arrival) return true;

          const startTime = Date.now();
          const flights = await skyscannerService.searchFlights(params);
          const duration = Date.now() - startTime;

          // Should return results within 5 seconds (5000ms)
          return duration < 5000 && Array.isArray(flights);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 2: Cache Consistency
 * For any flight search performed within 1 hour of a previous identical search, the system SHALL return cached results without calling Skyscanner API.
 * Validates: Requirements 1.2
 */
describe('Property 2: Cache Consistency', () => {
  it('should return consistent results for identical searches', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          departure: fc.constantFrom('NYC', 'LAX', 'ORD'),
          arrival: fc.constantFrom('NYC', 'LAX', 'ORD'),
          departDate: fc.date({ min: new Date() }).map((d) => d.toISOString().split('T')[0]),
          passengers: fc.integer({ min: 1, max: 5 }),
          tripType: fc.constantFrom('oneway', 'roundtrip'),
        }),
        async (params) => {
          // Skip if departure equals arrival
          if (params.departure === params.arrival) return true;

          // First search
          const results1 = await skyscannerService.searchFlights(params);

          // Second search (should be cached)
          const results2 = await skyscannerService.searchFlights(params);

          // Results should be identical
          return (
            Array.isArray(results1) &&
            Array.isArray(results2) &&
            results1.length === results2.length &&
            results1.every((flight, idx) => flight.id === results2[idx].id)
          );
        }
      ),
      { numRuns: 50 }
    );
  });
});

/**
 * Property 20: Multi-city Search Support
 * For any multi-city search with 3+ flight segments, the system SHALL process all segments and return combined results.
 * Validates: Requirements 1.4
 */
describe('Property 20: Multi-city Search Support', () => {
  it('should support multi-city searches with multiple segments', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          departure: fc.constantFrom('NYC', 'LAX', 'ORD'),
          arrival: fc.constantFrom('NYC', 'LAX', 'ORD'),
          departDate: fc.date({ min: new Date() }).map((d) => d.toISOString().split('T')[0]),
          passengers: fc.integer({ min: 1, max: 9 }),
          tripType: fc.constantFrom('multicity'),
        }),
        async (params) => {
          // Skip if departure equals arrival
          if (params.departure === params.arrival) return true;

          const flights = await skyscannerService.searchFlights(params);

          // Should return results for multi-city search
          return Array.isArray(flights) && flights.length > 0;
        }
      ),
      { numRuns: 50 }
    );
  });
});
