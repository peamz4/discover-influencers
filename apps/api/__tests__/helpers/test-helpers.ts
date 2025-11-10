import jwt from 'jsonwebtoken';
import { Response } from 'supertest';

/**
 * Extract cookies from response
 */
export const extractCookies = (response: Response): { [key: string]: string } => {
  const cookies: { [key: string]: string } = {};
  const setCookieHeader = response.headers['set-cookie'];
  
  if (setCookieHeader) {
    setCookieHeader.forEach((cookie: string) => {
      const [nameValue] = cookie.split(';');
      const [name, value] = nameValue.split('=');
      cookies[name.trim()] = value.trim();
    });
  }
  
  return cookies;
};

/**
 * Generate JWT token for testing
 */
export const generateTestToken = (userId: string, role: string = 'VIEWER'): string => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'test-secret-key-for-testing-only',
    { expiresIn: '15m' }
  );
};

/**
 * Generate refresh token for testing
 */
export const generateTestRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'test-refresh-secret-key-for-testing-only',
    { expiresIn: '7d' }
  );
};

/**
 * Create mock user
 */
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'VIEWER',
  password: '$2a$10$hashedpassword', // bcrypt hash
  avatarUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

/**
 * Create mock influencer
 */
export const createMockInfluencer = (overrides = {}) => ({
  id: 'test-influencer-id',
  recordId: 'INF-001',
  recordType: 'INFLUENCER',
  fullName: 'Test Influencer',
  preferredName: 'TestInf',
  gender: 'F',
  birthDate: new Date('1995-01-01'),
  email: 'influencer@example.com',
  phone: '+1-555-0101',
  city: 'Bangkok',
  country: 'Thailand',
  occupation: null,
  influencerCategory: 'Fashion',
  primaryPlatform: 'Instagram',
  followersCount: 100000,
  totalFollowersCount: 100000,
  engagementRate: 0.05,
  engagementRateTier: 'MEDIUM',
  interests: 'Fashion, Style',
  notes: 'Test notes',
  secondaryPlatform: null,
  secondaryFollowersCount: null,
  averageMonthlyReach: null,
  collaborationStatus: 'PROSPECT',
  languages: 'English, Thai',
  portfolioUrl: null,
  lastContactDate: null,
  status: 'ACTIVE',
  createdAt: new Date(),
  updatedAt: new Date(),
  createdById: 'admin-user-id',
  createdBy: {
    id: 'admin-user-id',
    name: 'Admin User',
    email: 'admin@example.com',
  },
  ...overrides,
});

/**
 * Create mock category
 */
export const createMockCategory = (overrides = {}) => ({
  id: 'test-category-id',
  name: 'Fashion',
  description: 'Fashion and style influencers',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

/**
 * Wait for async operations
 */
export const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
