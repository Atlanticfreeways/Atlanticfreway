import { Router } from 'express';
import AuthController from '../controllers/authController';
import validateRequest from '../middleware/validation';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from '../utils/validation';

const router = Router();

// POST /api/auth/register
router.post('/register', validateRequest(registerSchema), AuthController.register);

// POST /api/auth/login
router.post('/login', validateRequest(loginSchema), AuthController.login);

// POST /api/auth/refresh
router.post('/refresh', validateRequest(refreshTokenSchema), AuthController.refreshToken);

// POST /api/auth/logout
router.post('/logout', AuthController.logout);

export default router;
