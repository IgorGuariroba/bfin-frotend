/**
 * Environment configuration
 * Centralized access to environment variables with validation
 */

export const env = {
  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',

  // Application Configuration
  appName: import.meta.env.VITE_APP_NAME || 'BFIN',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',

  // Environment
  environment: import.meta.env.VITE_ENV || 'development',

  // Helper functions
  isDevelopment: () => import.meta.env.VITE_ENV === 'development',
  isProduction: () => import.meta.env.VITE_ENV === 'production',
  isStaging: () => import.meta.env.VITE_ENV === 'staging',
} as const;

// Validate required environment variables
const requiredEnvVars = ['VITE_API_URL'] as const;

requiredEnvVars.forEach((varName) => {
  if (!import.meta.env[varName]) {
    console.warn(`Warning: Environment variable ${varName} is not set. Using default value.`);
  }
});

export default env;
