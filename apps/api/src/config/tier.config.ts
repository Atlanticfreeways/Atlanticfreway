export const TIER_CONFIG = {
  AFFILIATE: {
    name: "Tier 1 Affiliate",
    commissionRate: 0.10,
    minMonthlyVolume: 0,
    features: ["referral_links", "basic_analytics", "email_support"],
    apiAccess: false,
    whiteLabel: false
  },
  RESELLER: {
    name: "Tier 2 Reseller",
    commissionRate: 0.20,
    minMonthlyVolume: 10000,
    features: ["api_access", "inventory_management", "priority_support"],
    apiAccess: true,
    whiteLabel: false
  },
  WHITE_LABEL: {
    name: "Tier 3 White-Label",
    commissionRate: 0.35,
    minMonthlyVolume: 50000,
    features: ["full_api", "custom_branding", "dedicated_support"],
    apiAccess: true,
    whiteLabel: true
  },
  ENTERPRISE: {
    name: "Tier 4 Enterprise",
    commissionRate: 0.50,
    minMonthlyVolume: 100000,
    features: ["full_integration", "volume_bonuses", "sla_support"],
    apiAccess: true,
    whiteLabel: true
  }
} as const;

export const VOLUME_BONUSES = {
  10000: 0.001,
  50000: 0.002,
  100000: 0.005
} as const;
