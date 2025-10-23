/**
 * Vitest setup file
 * Runs before all tests
 */

import { vi } from 'vitest';

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_BASE_URL: 'https://api.neds.com.au/rest/v1/racing/',
    VITE_GREYHOUND_CATEGORY_ID: '9daef0d7-bf3c-4f50-921d-8e818c60fe61',
    VITE_HARNESS_CATEGORY_ID: '161d9be2-e909-4326-8c2c-35ed71fb460b',
    VITE_HORSE_CATEGORY_ID: '4a2788f8-e825-4d36-9894-efd4baf1cfae'
  },
  writable: true
});

// Mock global fetch
global.fetch = vi.fn();

