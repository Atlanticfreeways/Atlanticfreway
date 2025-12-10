export const config = {
  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  socketUrl: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',

  // Feature Flags
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  enablePriceAlerts: import.meta.env.VITE_ENABLE_PRICE_ALERTS === 'true',
  enableDarkMode: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',

  // Stripe
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',

  // Derived
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

export default config;
