// Jest setup file
import db from '../src/drizzle/db';
import { client } from '../src/drizzle/db';
import { testUtils } from './integration/utils';

// Clear any mocks and test data after each test
afterEach(async () => {
  jest.clearAllMocks();
  await testUtils.cleanup();
});

// Close database connection after all tests
afterAll(async () => {
  await client.end();
});

// Increase test timeout for integration tests
jest.setTimeout(30000);

// Mock environment variables
process.env.JWT_SECRET = 'test-secret';
process.env.DATABASE_URL = 'test-database-url';