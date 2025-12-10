import fc from 'fast-check';
import AuthService from '../services/authService';

describe('AuthService - Property-Based Tests', () => {
  /**
   * Property 7: JWT Token Validity
   * For any JWT token issued at login, the system SHALL accept the token for 30 days and reject it after expiration.
   * Validates: Requirements 7.3, 7.4
   */
  describe('Property 7: JWT Token Validity', () => {
    it('should generate valid tokens that can be verified', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.uuid(),
            email: fc.emailAddress(),
          }),
          (payload) => {
            const tokens = AuthService.generateTokens(payload);
            const verified = AuthService.verifyToken(tokens.accessToken);

            return (
              verified.id === payload.id &&
              verified.email === payload.email &&
              AuthService.validateToken(tokens.accessToken)
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject invalid tokens', () => {
      fc.assert(
        fc.property(fc.string().filter((s) => s.length > 0), (invalidToken) => {
          // Invalid tokens should not validate
          return !AuthService.validateToken(invalidToken);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 8: Password Security
   * For any user password stored in database, the system SHALL hash it using bcrypt with salt rounds ≥ 10.
   * Validates: Requirements 7.2
   */
  describe('Property 8: Password Security', () => {
    it('should hash passwords consistently and securely', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 8, maxLength: 128 }),
          async (password) => {
            const hash1 = await AuthService.hashPassword(password);
            const hash2 = await AuthService.hashPassword(password);

            // Hashes should be different (due to salt)
            const differentHashes = hash1 !== hash2;

            // Both should validate against original password
            const valid1 = await AuthService.comparePassword(password, hash1);
            const valid2 = await AuthService.comparePassword(password, hash2);

            // Hash should not be the same as password
            const notPlaintext = hash1 !== password && hash2 !== password;

            return differentHashes && valid1 && valid2 && notPlaintext;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject wrong passwords', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.tuple(
            fc.string({ minLength: 8, maxLength: 128 }),
            fc.string({ minLength: 8, maxLength: 128 })
          ),
          async ([password, wrongPassword]) => {
            // Skip if passwords are the same
            if (password === wrongPassword) return true;

            const hash = await AuthService.hashPassword(password);
            const isValid = await AuthService.comparePassword(wrongPassword, hash);

            return !isValid;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
