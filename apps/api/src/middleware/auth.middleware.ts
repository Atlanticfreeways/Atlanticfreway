import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { MockDatabase } from '../services/database.service';

export interface AuthRequest extends Request {
  partnerId?: string;
  tier?: string;
  email?: string;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;
  const email = req.headers['x-email'] as string;

  if (!apiKey || !email) {
    return res.status(401).json({ error: 'API key and email required' });
  }

  try {
    // Verify API key belongs to the email
    const partner = MockDatabase.getPartnerByApiKey(apiKey);
    
    if (!partner) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    if (partner.email !== email) {
      return res.status(401).json({ error: 'Email does not match API key account' });
    }

    req.partnerId = partner.id;
    req.tier = partner.tier;
    req.email = partner.email;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

export const requireTier = (minTier: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const tierOrder = ['AFFILIATE', 'RESELLER', 'WHITE_LABEL', 'ENTERPRISE'];
    const userTierIndex = tierOrder.indexOf(req.tier || '');
    const requiredTierIndex = tierOrder.indexOf(minTier);

    if (userTierIndex < requiredTierIndex) {
      return res.status(403).json({ error: 'Insufficient tier level' });
    }
    next();
  };
};
