// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock environment variables
process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'test-ga-id'
process.env.NEXT_PUBLIC_FB_PIXEL_ID = 'test-fb-id'
process.env.NEXT_PUBLIC_BUSINESS_PHONE = '1-800-TEST'
process.env.NEXT_PUBLIC_BUSINESS_EMAIL = 'test@example.com'
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return []
  }
} 