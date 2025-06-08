// Jest setup file
import db from '../src/drizzle/db';
import { client } from '../src/drizzle/db';

// Clear any mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Close database connection after all tests
afterAll(async () => {
  await client.end();
});

// Global test timeout
jest.setTimeout(10000);

// Mock environment variables
process.env.JWT_SECRET = 'test-secret';
process.env.DATABASE_URL = 'test-database-url';