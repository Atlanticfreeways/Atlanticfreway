import { TIER_CONFIG, VOLUME_BONUSES } from '../config/tier.config';

export class CommissionService {
  static calculateCommission(
    bookingAmount: number,
    tier: keyof typeof TIER_CONFIG,
    monthlyVolume: number = 0
  ) {
    const baseRate = TIER_CONFIG[tier].commissionRate;
    let volumeBonus = 0;

    for (const [threshold, bonus] of Object.entries(VOLUME_BONUSES)) {
      if (monthlyVolume >= Number(threshold)) {
        volumeBonus = bonus;
      }
    }

    const totalRate = baseRate + volumeBonus;
    const commission = bookingAmount * totalRate;

    return {
      baseCommission: bookingAmount * baseRate,
      volumeBonus: bookingAmount * volumeBonus,
      totalCommission: commission,
      effectiveRate: totalRate
    };
  }
}
