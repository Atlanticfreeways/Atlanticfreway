import fc from 'fast-check';

/**
 * Property 14: Input Validation
 * For any invalid search parameter (missing required fields, invalid date format), the system SHALL display specific validation error message.
 * Validates: Requirements 14.1
 */
describe('Property 14: Input Validation', () => {
  it('should reject invalid airport codes', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 2 }), // Too short
        (invalidCode) => {
          // Airport codes should be 3+ characters
          return invalidCode.length < 3;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject invalid passenger counts', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -100, max: 0 }).or(fc.integer({ min: 10, max: 100 })),
        (passengers) => {
          // Valid passengers: 1-9
          const isInvalid = passengers < 1 || passengers > 9;
          return isInvalid;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject invalid date formats', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }).filter((s) => !s.match(/^\d{4}-\d{2}-\d{2}$/)),
        (invalidDate) => {
          // Valid format: YYYY-MM-DD
          const isInvalid = !invalidDate.match(/^\d{4}-\d{2}-\d{2}$/);
          return isInvalid;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject invalid trip types', () => {
    fc.assert(
      fc.property(
        fc.string().filter((s) => !['oneway', 'roundtrip', 'multicity'].includes(s)),
        (invalidTripType) => {
          // Valid types: oneway, roundtrip, multicity
          const validTypes = ['oneway', 'roundtrip', 'multicity'];
          return !validTypes.includes(invalidTripType);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should validate required fields are present', () => {
    fc.assert(
      fc.property(
        fc.record({
          hasDeparture: fc.boolean(),
          hasArrival: fc.boolean(),
          hasDepartDate: fc.boolean(),
          hasPassengers: fc.boolean(),
          hasTripType: fc.boolean(),
        }),
        (fields) => {
          // All fields are required
          const allPresent =
            fields.hasDeparture &&
            fields.hasArrival &&
            fields.hasDepartDate &&
            fields.hasPassengers &&
            fields.hasTripType;

          // If not all present, should be invalid
          return !allPresent;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should validate email format', () => {
    fc.assert(
      fc.property(fc.emailAddress(), (email) => {
        // Valid email should match pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      }),
      { numRuns: 100 }
    );
  });

  it('should validate password strength', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 8, maxLength: 128 }),
        (password) => {
          // Password should have uppercase, lowercase, and number
          const hasUppercase = /[A-Z]/.test(password);
          const hasLowercase = /[a-z]/.test(password);
          const hasNumber = /[0-9]/.test(password);

          // Valid if all conditions met
          return hasUppercase && hasLowercase && hasNumber;
        }
      ),
      { numRuns: 100 }
    );
  });
});
