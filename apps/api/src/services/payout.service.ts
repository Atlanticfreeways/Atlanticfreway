import { MockDatabase } from './database.service';

export class PayoutService {
  static calculatePayout(partnerId: string): any {
    const commissions = MockDatabase.getCommissionsByPartner(partnerId);
    
    const pending = commissions.filter(c => c.status === 'pending');
    const paid = commissions.filter(c => c.status === 'paid');

    return {
      pendingAmount: pending.reduce((sum, c) => sum + c.commissionAmount, 0),
      paidAmount: paid.reduce((sum, c) => sum + c.commissionAmount, 0),
      totalEarnings: commissions.reduce((sum, c) => sum + c.commissionAmount, 0),
      nextPayoutDate: this.getNextPayoutDate()
    };
  }

  static requestPayout(partnerId: string): any {
    return {
      success: true,
      payoutId: `payout_${Date.now()}`,
      status: 'processing'
    };
  }

  static getNextPayoutDate(): string {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth.toISOString().split('T')[0];
  }

  static getPayoutHistory(partnerId: string): any[] {
    return [];
  }
}
