export class WhiteLabelService {
  private configurations: Map<string, any> = new Map();

  createWhiteLabel(partnerId: string, config: any) {
    const whiteLabelId = `WL-${partnerId}`;
    const configuration = {
      whiteLabelId,
      partnerId,
      brandName: config.brandName,
      domain: config.domain,
      logoUrl: config.logoUrl,
      primaryColor: config.primaryColor || '#0066cc',
      secondaryColor: config.secondaryColor || '#ffffff',
      customCss: config.customCss || '',
      apiEndpoint: `https://api.atlanticgateway.com/wl/${partnerId}`
    };
    this.configurations.set(whiteLabelId, configuration);
    return configuration;
  }

  getConfiguration(partnerId: string) {
    const whiteLabelId = `WL-${partnerId}`;
    return this.configurations.get(whiteLabelId);
  }
}
