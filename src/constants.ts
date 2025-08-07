// Client-side constants (for browser use)
export const API_KEY = process.env.NEXT_PUBLIC_PARA_API_KEY ?? ''

// Server-side constants (for API routes)
export const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL

// Environment enum for client-side use
export enum Environment {
  BETA = 'beta',
  PRODUCTION = 'production',
}

// Client-side environment setting
export const ENVIRONMENT = (process.env.NEXT_PUBLIC_PARA_ENVIRONMENT as Environment) || Environment.BETA

// Only validate API key on client side
if (typeof window !== 'undefined' && !API_KEY) {
  throw new Error('API key is not defined. Please set NEXT_PUBLIC_PARA_API_KEY in your environment variables.')
}
