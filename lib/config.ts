// Configuration for AI services and external APIs

export const config = {
  // OpenRouter API Configuration
  openRouter: {
    apiKey: process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || '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',
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'deepseek/deepseek-chat',
    maxTokens: 4000,
    temperature: 0.7,
  },
  
  // App Configuration
  app: {
    name: 'My Baguio Trip App',
    url: process.env.EXPO_PUBLIC_APP_URL || 'https://mybaguiotrip.app',
  },
  
  // Default values
  defaults: {
    destination: 'Baguio City, Philippines',
    currency: 'PHP',
    travelers: 2,
  },
};

// Helper function to check if API key is configured
export const isAPIConfigured = (): boolean => {
  return !!config.openRouter.apiKey;
};

// Helper function to get API status
export const getAPIStatus = (): { configured: boolean; message: string } => {
  if (!config.openRouter.apiKey) {
    return {
      configured: false,
      message: 'OpenRouter API key not configured. Please add EXPO_PUBLIC_OPENROUTER_API_KEY to your environment variables.',
    };
  }
  
  return {
    configured: true,
    message: 'API key configured successfully.',
  };
};

