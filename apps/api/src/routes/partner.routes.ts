import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { ReferralLinkService } from '../services/referral-link.service';
import { ApiKeyService } from '../services/apikey.service';
import { TierUpgradeService } from '../services/tier-upgrade.service';
import { PayoutService } from '../services/payout.service';
import { MockDatabase } from '../services/database.service';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  let partner = MockDatabase.getUserByEmail(email);
  if (!partner) {
    partner = MockDatabase.createPartner({
      email,
      name: email.split('@')[0],
      tier: 'AFFILIATE',
      commissionRate: 0.10,
      monthlyVolume: 0
    });
  }

  const token = jwt.sign(
    { partnerId: partner.id, tier: partner.tier },
    process.env.JWT_SECRET!,
    { expiresIn: '30d' }
  );

  res.json({ token, partner });
});

router.get('/analytics/earnings', authenticateToken, async (req, res) => {
  const partnerId = (req as any).partnerId;
  const payout = PayoutService.calculatePayout(partnerId);
  const stats = ReferralLinkService.getReferralStats(partnerId);
  
  res.json({ ...payout, referralStats: stats });
});

router.get('/referrals/list', authenticateToken, async (req, res) => {
  const partnerId = (req as any).partnerId;
  const stats = ReferralLinkService.getReferralStats(partnerId);
  res.json(stats);
});

router.post('/referrals/create', authenticateToken, async (req, res) => {
  const partnerId = (req as any).partnerId;
  const link = ReferralLinkService.createReferralLink(partnerId);
  res.json(link);
});

router.post('/apikey/generate', authenticateToken, async (req, res) => {
  const partnerId = (req as any).partnerId;
  const tier = (req as any).tier;
  
  try {
    const apiKey = ApiKeyService.generateApiKey(partnerId, tier);
    res.json(apiKey);
  } catch (error: any) {
    res.status(403).json({ error: error.message });
  }
});

router.get('/tier/check-upgrade', authenticateToken, async (req, res) => {
  const partnerId = (req as any).partnerId;
  const result = TierUpgradeService.checkAndUpgrade(partnerId);
  res.json(result);
});

router.post('/payout/request', authenticateToken, async (req, res) => {
  const partnerId = (req as any).partnerId;
  const result = PayoutService.requestPayout(partnerId);
  res.json(result);
});

export default router;
