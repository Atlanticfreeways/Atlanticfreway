/**
 * Backend Test Utilities
 * Common helpers for unit and integration tests
 */

import * as fc from 'fast-check';

/**
 * Arbitrary generators for common types used in Flight Scanner
 */
export const arbitraries = {
  /**
   * Generate valid IATA airport codes (3 uppercase letters)
   */
  iataCode: (): fc.Arbitrary<string> =>
    fc.stringOf(fc.integer({ min: 65, max: 90 }), { minLength: 3, maxLength: 3 }).map(s => String.fromCharCode(...s.split('').map(c => c.charCodeAt(0)))),

  /**
   * Generate valid email addresses
   */
  email: (): fc.Arbitrary<string> =>
    fc.emailAddress(),

  /**
   * Generate valid passwords (min 8 chars, uppercase, lowercase, number)
   */
  password: (): fc.Arbitrary<string> =>
    fc.tuple(
      fc.stringOf(fc.char(), { minLength: 5 }),
      fc.integer({ min: 0, max: 9 }),
      fc.constantFrom('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'),
      fc.constantFrom('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z')
    ).map(([str, num, upper, lower]) => `${str}${num}${upper}${lower}`),

  /**
   * Generate valid currency codes (3 uppercase letters)
   */
  currencyCode: (): fc.Arbitrary<string> =>
    fc.constantFrom('USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'MXN'),

  /**
   * Generate valid flight prices (0.01 to 10000)
   */
  price: (): fc.Arbitrary<number> =>
    fc.integer({ min: 1, max: 1000000 }).map(n => n / 100),

  /**
   * Generate valid dates in the future
   */
  futureDate: (): fc.Arbitrary<Date> =>
    fc.integer({ min: 1, max: 365 }).map(days => {
      const date = new Date();
      date.setDate(date.getDate() + days);
      return date;
    }),

  /**
   * Generate valid number of stops (0-3)
   */
  stops: (): fc.Arbitrary<number> =>
    fc.integer({ min: 0, max: 3 }),

  /**
   * Generate valid flight duration in minutes (30-1440)
   */
  duration: (): fc.Arbitrary<number> =>
    fc.integer({ min: 30, max: 1440 }),

  /**
   * Generate valid passenger count (1-9)
   */
  passengerCount: (): fc.Arbitrary<number> =>
    fc.integer({ min: 1, max: 9 }),

  /**
   * Generate valid hotel rating (0-5)
   */
  hotelRating: (): fc.Arbitrary<number> =>
    fc.integer({ min: 0, max: 500 }).map(n => n / 100),

  /**
   * Generate valid number of rooms (1-10)
   */
  roomCount: (): fc.Arbitrary<number> =>
    fc.integer({ min: 1, max: 10 }),
};

/**
 * Helper to run property-based tests with standard configuration
 */
export function runPropertyTest<T>(
  property: (value: T) => boolean | void,
  arbitrary: fc.Arbitrary<T>,
  options?: Partial<fc.Parameters<T>>
): void {
  fc.assert(
    fc.property(arbitrary, property),
    {
      numRuns: 100,
      ...options,
    }
  );
}

/**
 * Helper to create mock request object
 */
export function createMockRequest(overrides = {}) {
  return {
    headers: {},
    params: {},
    query: {},
    body: {},
    ...overrides,
  };
}

/**
 * Helper to create mock response object
 */
export function createMockResponse() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
}

/**
 * Helper to create mock next function
 */
export function createMockNext() {
  return jest.fn();
}
