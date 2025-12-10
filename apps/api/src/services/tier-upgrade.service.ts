import { MockDatabase } from './database.service';
import { TIER_CONFIG } from '../config/tier.config';

export class TierUpgradeService {
  static checkAndUpgrade(partnerId: string): any {
    const partner = MockDatabase.getPartner(partnerId);
    if (!partner) return null;

    const commissions = MockDatabase.getCommissionsByPartner(partnerId);
    const monthlyVolume = commissions.reduce((sum, c) => sum + c.amount, 0);

    const currentTier = partner.tier;
    const suggestedTier = this.getSuggestedTier(monthlyVolume);

    if (this.shouldUpgrade(currentTier, suggestedTier)) {
      return this.upgradeTier(partnerId, suggestedTier);
    }

    return {
      upgraded: false,
      currentTier,
      monthlyVolume,
      nextTier: this.getNextTier(currentTier)
    };
  }

  static getSuggestedTier(monthlyVolume: number): string {
    if (monthlyVolume >= 100000) return 'ENTERPRISE';
    if (monthlyVolume >= 50000) return 'WHITE_LABEL';
    if (monthlyVolume >= 10000) return 'RESELLER';
    return 'AFFILIATE';
  }

  static shouldUpgrade(currentTier: string, suggestedTier: string): boolean {
    const tierOrder = ['AFFILIATE', 'RESELLER', 'WHITE_LABEL', 'ENTERPRISE'];
    return tierOrder.indexOf(suggestedTier) > tierOrder.indexOf(currentTier);
  }

  static upgradeTier(partnerId: string, newTier: string): any {
    const config = TIER_CONFIG[newTier as keyof typeof TIER_CONFIG];
    
    MockDatabase.updatePartner(partnerId, {
      tier: newTier,
      commissionRate: config.commissionRate
    });

    return {
      upgraded: true,
      newTier,
      newCommissionRate: config.commissionRate
    };
  }

  static getNextTier(currentTier: string): string | null {
    const tierOrder = ['AFFILIATE', 'RESELLER', 'WHITE_LABEL', 'ENTERPRISE'];
    const currentIndex = tierOrder.indexOf(currentTier);
    return currentIndex < tierOrder.length - 1 ? tierOrder[currentIndex + 1] : null;
  }
}
