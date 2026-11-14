/**
 * Centralized API configuration for DataPollex LMS.
 * In production/deployment, connects to the deployed Vercel backend.
 * In local development, falls back to NEXT_PUBLIC_API_URL or http://localhost:5000/api if configured.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://datapollex-lms-backend.vercel.app/api';

export default API_BASE_URL;

