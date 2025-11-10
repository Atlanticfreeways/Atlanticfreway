// Mock in-memory database
export class MockDatabase {
  private static partners = new Map();
  private static referrals = new Map();
  private static commissions = new Map();
  private static whiteLabelConfigs = new Map();
  private static apiKeys = new Map();
  private static users = new Map();

  static createPartner(data: any) {
    const id = `partner_${Date.now()}`;
    this.partners.set(id, { ...data, id, createdAt: new Date() });
    return this.partners.get(id);
  }

  static getPartner(id: string) {
    return this.partners.get(id);
  }

  static updatePartner(id: string, data: any) {
    const partner = this.partners.get(id);
    if (partner) {
      this.partners.set(id, { ...partner, ...data, updatedAt: new Date() });
    }
    return this.partners.get(id);
  }

  static createReferral(data: any) {
    const id = `ref_${Date.now()}`;
    this.referrals.set(id, { ...data, id, createdAt: new Date() });
    return this.referrals.get(id);
  }

  static getReferralsByPartner(partnerId: string) {
    return Array.from(this.referrals.values()).filter(r => r.partnerId === partnerId);
  }

  static getReferralByCode(code: string) {
    return Array.from(this.referrals.values()).find(r => r.code === code);
  }

  static createCommission(data: any) {
    const id = `comm_${Date.now()}`;
    this.commissions.set(id, { ...data, id, createdAt: new Date() });
    return this.commissions.get(id);
  }

  static getCommissionsByPartner(partnerId: string) {
    return Array.from(this.commissions.values()).filter(c => c.partnerId === partnerId);
  }

  static createWhiteLabel(data: any) {
    const id = `wl_${data.partnerId}`;
    this.whiteLabelConfigs.set(id, { ...data, id, createdAt: new Date() });
    return this.whiteLabelConfigs.get(id);
  }

  static getWhiteLabel(partnerId: string) {
    return this.whiteLabelConfigs.get(`wl_${partnerId}`);
  }

  static createApiKey(partnerId: string) {
    const key = `af_live_${Math.random().toString(36).substr(2, 32)}`;
    this.apiKeys.set(key, { partnerId, createdAt: new Date() });
    return key;
  }

  static getPartnerByApiKey(key: string) {
    const apiKey = this.apiKeys.get(key);
    return apiKey ? this.partners.get(apiKey.partnerId) : null;
  }

  static createUser(data: any) {
    const id = `user_${Date.now()}`;
    this.users.set(id, { ...data, id, createdAt: new Date() });
    return this.users.get(id);
  }

  static getUserByEmail(email: string) {
    return Array.from(this.users.values()).find(u => u.email === email);
  }
}
