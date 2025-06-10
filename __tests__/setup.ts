// Jest setup file
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { sql } from 'drizzle-orm';
import db, { pool } from '../src/drizzle/db';
import { testUtils } from './integration/utils';

// Mock environment variables
process.env.PORT = '5000';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-integration-tests';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/car_rental_test';

// Clear any mocks and test data after each test
afterEach(async () => {
  jest.clearAllMocks();
  await testUtils.cleanup();
});

// Close database connection after all tests
afterAll(async () => {
  try {
    await pool.end();
  } catch (error) {
    console.error('Error closing pool:', error);
  }
});

// Increase test timeout for integration tests
jest.setTimeout(30000);

// Global test configuration
beforeAll(async () => {
  try {
    // Run migrations before tests
    await migrate(db, {
      migrationsFolder: './src/drizzle/migrations'
    });
    console.log('Migrations completed');

    // Test the connection
    await db.execute(sql`SELECT 1`);
    console.log("Connected to the database");
  } catch (error) {
    console.error('Test setup failed:', error);
    throw error;
  }

  // Clear any existing test data
  await testUtils.cleanup();
});

// Ensure cleanup on process termination
const cleanup = async () => {
  try {
    await pool.end();
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
  process.exit(0);
};

process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);