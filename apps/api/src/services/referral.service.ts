export class ReferralService {
  private referrals: Map<string, any> = new Map();

  createReferral(partnerId: string, userEmail: string, referralCode: string) {
    const referralId = `REF-${Date.now()}`;
    const referral = {
      referralId,
      partnerId,
      userEmail,
      referralCode,
      status: 'pending',
      converted: false,
      totalBookings: 0,
      createdAt: new Date().toISOString()
    };
    this.referrals.set(referralId, referral);
    return referral;
  }

  trackConversion(referralId: string, bookingId: string) {
    const referral = this.referrals.get(referralId);
    if (referral) {
      referral.converted = true;
      referral.status = 'converted';
      referral.totalBookings += 1;
      return true;
    }
    return false;
  }

  getPartnerReferrals(partnerId: string) {
    return Array.from(this.referrals.values()).filter(r => r.partnerId === partnerId);
  }
}
