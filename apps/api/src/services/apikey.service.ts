import { MockDatabase } from './database.service';

export class ApiKeyService {
  static generateApiKey(partnerId: string, tier: string): any {
    const allowedTiers = ['RESELLER', 'WHITE_LABEL', 'ENTERPRISE'];
    if (!allowedTiers.includes(tier)) {
      throw new Error('API access not available for this tier');
    }

    const key = MockDatabase.createApiKey(partnerId);
    
    return {
      apiKey: key,
      partnerId,
      tier,
      createdAt: new Date()
    };
  }
}
