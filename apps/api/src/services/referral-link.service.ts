import { MockDatabase } from './database.service';

export class ReferralLinkService {
  static generateReferralCode(partnerId: string): string {
    return `${partnerId.slice(-6).toUpperCase()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }

  static createReferralLink(partnerId: string): any {
    const code = this.generateReferralCode(partnerId);
    const baseUrl = 'https://atlanticgateway.com';
    
    const referral = MockDatabase.createReferral({
      partnerId,
      code,
      clicks: 0,
      conversions: 0,
      status: 'active'
    });

    return {
      referralId: referral.id,
      code: referral.code,
      link: `${baseUrl}?ref=${referral.code}`,
      shortLink: `${baseUrl}/r/${referral.code}`,
      createdAt: referral.createdAt
    };
  }

  static getReferralStats(partnerId: string) {
    const referrals = MockDatabase.getReferralsByPartner(partnerId);
    const commissions = MockDatabase.getCommissionsByPartner(partnerId);

    return {
      totalReferrals: referrals.length,
      totalClicks: referrals.reduce((sum, r) => sum + (r.clicks || 0), 0),
      totalConversions: referrals.reduce((sum, r) => sum + (r.conversions || 0), 0),
      totalEarnings: commissions.reduce((sum, c) => sum + c.commissionAmount, 0),
      referrals: referrals.map(r => ({
        code: r.code,
        link: `https://atlanticgateway.com?ref=${r.code}`,
        clicks: r.clicks || 0,
        conversions: r.conversions || 0,
        createdAt: r.createdAt
      }))
    };
  }
}
