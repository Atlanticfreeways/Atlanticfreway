import AuthService from '../services/authService';

describe('AuthService', () => {
  describe('Password hashing', () => {
    it('should hash password correctly', async () => {
      const password = 'TestPassword123';
      const hash = await AuthService.hashPassword(password);

      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should compare password correctly', async () => {
      const password = 'TestPassword123';
      const hash = await AuthService.hashPassword(password);
      const isValid = await AuthService.comparePassword(password, hash);

      expect(isValid).toBe(true);
    });

    it('should reject invalid password', async () => {
      const password = 'TestPassword123';
      const wrongPassword = 'WrongPassword123';
      const hash = await AuthService.hashPassword(password);
      const isValid = await AuthService.comparePassword(wrongPassword, hash);

      expect(isValid).toBe(false);
    });
  });

  describe('Token generation', () => {
    it('should generate valid tokens', () => {
      const payload = { id: '123', email: 'test@example.com' };
      const tokens = AuthService.generateTokens(payload);

      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      expect(tokens.accessToken.length).toBeGreaterThan(0);
      expect(tokens.refreshToken.length).toBeGreaterThan(0);
    });

    it('should verify valid token', () => {
      const payload = { id: '123', email: 'test@example.com' };
      const tokens = AuthService.generateTokens(payload);
      const verified = AuthService.verifyToken(tokens.accessToken);

      expect(verified.id).toBe(payload.id);
      expect(verified.email).toBe(payload.email);
    });

    it('should validate token correctly', () => {
      const payload = { id: '123', email: 'test@example.com' };
      const tokens = AuthService.generateTokens(payload);
      const isValid = AuthService.validateToken(tokens.accessToken);

      expect(isValid).toBe(true);
    });

    it('should reject invalid token', () => {
      const isValid = AuthService.validateToken('invalid.token.here');
      expect(isValid).toBe(false);
    });
  });
});
