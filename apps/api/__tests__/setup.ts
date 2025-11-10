import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-testing-only';
process.env.LOG_TO_FILES = 'false';

// Use test database
process.env.DATABASE_URL = 'postgresql://postgres:postgres@127.0.0.1:5432/prime_influencer_test?schema=public';

// Increase timeout for database operations
jest.setTimeout(30000);

// Create a single Prisma Client instance for all tests
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Global setup - run migrations before all tests
beforeAll(async () => {
  // Push schema to test database (creates tables if they don't exist)
  try {
    execSync('npx prisma db push --skip-generate --accept-data-loss', {
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
      stdio: 'ignore',
    });
  } catch (error) {
    console.error('Failed to setup test database:', error);
  }
});

// Clean database after each test
afterEach(async () => {
  // Delete all records in reverse order of dependencies
  await prisma.refreshToken.deleteMany({});
  await prisma.person.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});
});

// Global teardown
afterAll(async () => {
  await prisma.$disconnect();
});
