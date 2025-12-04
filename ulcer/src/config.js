// Application Configuration

export const config = {
  // Backend API URL
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8030/api',
  
  // Backend connection settings
  API_TIMEOUT: 5000, // 5 seconds
  
  // Feature flags
  USE_OFFLINE_FALLBACK: false, // Set to true to use demo data when backend is unavailable
  
  // LLM API settings
  LLM_MAX_TOKENS: 200,
  
  // Development settings
  DEV_MODE: process.env.NODE_ENV === 'development',
};

export default config;

