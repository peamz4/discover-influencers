import prisma from '../../src/lib/prisma';
import { hashPassword } from '../../src/lib/auth';

/**
 * Create a test user in the database
 */
export async function createTestUser(data?: {
  email?: string;
  password?: string;
  name?: string;
  role?: 'ADMIN' | 'EDITOR' | 'VIEWER';
}) {
  const hashedPassword = await hashPassword(data?.password || 'password123');
  
  return prisma.user.create({
    data: {
      email: data?.email || `test-${Date.now()}@example.com`,
      password: hashedPassword,
      name: data?.name || 'Test User',
      role: data?.role || 'VIEWER',
    },
  });
}

/**
 * Create a test category in the database
 */
export async function createTestCategory(data?: {
  name?: string;
  description?: string;
}) {
  return prisma.category.create({
    data: {
      name: data?.name || `Test Category ${Date.now()}`,
      description: data?.description || 'Test description',
    },
  });
}

/**
 * Create a test influencer in the database
 */
export async function createTestInfluencer(createdById: string, data?: {
  fullName?: string;
  email?: string;
  influencerCategory?: string;
  followersCount?: number;
  engagementRate?: number;
}) {
  const timestamp = Date.now();
  
  // Create category if it doesn't exist
  const categoryName = data?.influencerCategory || 'Fashion';
  const existingCategory = await prisma.category.findUnique({
    where: { name: categoryName }
  });
  
  if (!existingCategory) {
    await prisma.category.create({
      data: {
        name: categoryName,
        description: `${categoryName} category`
      }
    });
  }
  
  return prisma.person.create({
    data: {
      recordId: `INF-${timestamp}`,
      fullName: data?.fullName || `Test Influencer ${timestamp}`,
      email: data?.email || `influencer-${timestamp}@example.com`,
      recordType: 'INFLUENCER',
      influencerCategory: categoryName,
      followersCount: data?.followersCount || 10000,
      engagementRate: data?.engagementRate || 0.05,
      engagementRateTier: 'MEDIUM',
      primaryPlatform: 'Instagram',
      collaborationStatus: 'PROSPECT',
      status: 'ACTIVE',
      createdById,
    },
  });
}

/**
 * Login a user and return cookies for authenticated requests
 */
export async function loginUser(app: any, email: string, password: string) {
  const response = await app
    .post('/api/auth/login')
    .send({ email, password });
  
  return response.headers['set-cookie'];
}
