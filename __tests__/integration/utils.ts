import request from 'supertest';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import db, { pool } from '@/drizzle/db';
import { UserTable } from '@/drizzle/schema';

// Types for test data
interface TestUser {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role?: string;
}

interface TestUserOptions {
  role?: string;
  isVerified?: boolean;
}

// Default test user data
const defaultTestUser: TestUser = {
  first_name: "Test",
  last_name: "User",
  email: "testuser@mail.com",
  password: "testpass123",
  role: "customer"
};

/**
 * Create a test utils instance with custom user data
 */
export const createTestUtils = (customUser?: Partial<TestUser>) => {
  const testUser: TestUser = { ...defaultTestUser, ...customUser };

  return {
    /**
     * Get test user credentials
     */
    getCredentials: () => ({
      email: testUser.email,
      password: testUser.password
    }),

    /**
     * Clean up test user data
     */
    cleanup: async (): Promise<void> => {
      const client = await pool.connect();
      try {
        await db.delete(UserTable)
          .where(eq(UserTable.email, testUser.email));
      } catch (error) {
        console.error('Failed to cleanup test user:', error);
        throw new Error('Test cleanup failed');
      } finally {
        client.release();
      }
    },

    /**
     * Create a test user with optional custom options
     */
    createTestUser: async (options: TestUserOptions = {}): Promise<void> => {
      const client = await pool.connect();
      try {
        const hashedPassword = await bcrypt.hash(testUser.password, 10);
        await db.insert(UserTable).values({
          ...testUser,
          role: options.role || testUser.role,
          password: hashedPassword,
          is_verified: options.isVerified ?? false
        });

        // If isVerified is true, update the user's verification status
        if (options.isVerified) {
          await db
            .update(UserTable)
            .set({ is_verified: true })
            .where(eq(UserTable.email, testUser.email));
        }
      } catch (error) {
        console.error('Failed to create test user:', error);
        throw new Error('Test user creation failed');
      } finally {
        client.release();
      }
    },

    /**
     * Get test user from database
     */
    getTestUser: async () => {
      const client = await pool.connect();
      try {
        const user = await db.query.UserTable.findFirst({
          where: eq(UserTable.email, testUser.email)
        });
        return user;
      } catch (error) {
        console.error('Failed to get test user:', error);
        throw new Error('Failed to retrieve test user');
      } finally {
        client.release();
      }
    },

    /**
     * Get authentication token for test user
     */
    getAuthToken: async (app: any): Promise<string> => {
      try {
        // Verify user exists and is verified
        const user = await db.query.UserTable.findFirst({
          where: eq(UserTable.email, testUser.email)
        });

        if (!user) {
          throw new Error(`Test user ${testUser.email} not found`);
        }

        if (!user.is_verified) {
          throw new Error(`Test user ${testUser.email} is not verified`);
        }

        const response = await request(app)
          .post('/auth/login')
          .send({
            email: testUser.email,
            password: testUser.password
          });

        if (!response.body.token) {
          console.error('Login response:', response.body);
          throw new Error('No token returned from login');
        }

        return response.body.token;
      } catch (error) {
        console.error('Failed to get auth token:', error);
        throw new Error('Auth token retrieval failed');
      }
    }
  };
};

// Export default instance with default test user
export const testUtils = createTestUtils();
