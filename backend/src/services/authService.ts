import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User, { IUser } from '../models/User';
import logger from '../config/logger';

export interface AuthPayload {
  id: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '30d';
const REFRESH_TOKEN_EXPIRY = '90d';
const SALT_ROUNDS = 10;

export class AuthService {
  /**
   * Hash password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, SALT_ROUNDS);
    } catch (error) {
      logger.error('Error hashing password:', error);
      throw error;
    }
  }

  /**
   * Compare password with hash
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      logger.error('Error comparing password:', error);
      throw error;
    }
  }

  /**
   * Generate JWT tokens
   */
  static generateTokens(payload: AuthPayload): AuthTokens {
    try {
      const accessToken = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRY,
      });

      const refreshToken = jwt.sign(payload, JWT_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY,
      });

      return { accessToken, refreshToken };
    } catch (error) {
      logger.error('Error generating tokens:', error);
      throw error;
    }
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): AuthPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as AuthPayload;
    } catch (error) {
      logger.error('Error verifying token:', error);
      throw error;
    }
  }

  /**
   * Register new user
   */
  static async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<{ user: IUser; tokens: AuthTokens }> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password);

      // Create user
      const user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        preferences: {
          currency: 'USD',
          theme: 'light',
          notifications: true,
          language: 'en',
        },
      });

      await user.save();
      logger.info(`User registered: ${email}`);

      // Generate tokens
      const tokens = this.generateTokens({
        id: user._id.toString(),
        email: user.email,
      });

      return { user, tokens };
    } catch (error) {
      logger.error('Error registering user:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  static async login(
    email: string,
    password: string
  ): Promise<{ user: IUser; tokens: AuthTokens }> {
    try {
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Compare password
      const isPasswordValid = await this.comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      logger.info(`User logged in: ${email}`);

      // Generate tokens
      const tokens = this.generateTokens({
        id: user._id.toString(),
        email: user.email,
      });

      return { user, tokens };
    } catch (error) {
      logger.error('Error logging in user:', error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = this.verifyToken(refreshToken);

      // Find user
      const user = await User.findById(payload.id);
      if (!user) {
        throw new Error('User not found');
      }

      // Generate new tokens
      const tokens = this.generateTokens({
        id: user._id.toString(),
        email: user.email,
      });

      logger.info(`Token refreshed for user: ${user.email}`);

      return tokens;
    } catch (error) {
      logger.error('Error refreshing token:', error);
      throw error;
    }
  }

  /**
   * Validate token
   */
  static validateToken(token: string): boolean {
    try {
      jwt.verify(token, JWT_SECRET);
      return true;
    } catch {
      return false;
    }
  }
}

export default AuthService;
