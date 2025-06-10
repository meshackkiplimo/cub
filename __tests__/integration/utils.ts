import request from 'supertest';
import { app } from '../../src/index';
import { client } from '../../src/drizzle/db';

export const testUtils = {
  // Helper to create a test user and get auth token
  async getAuthToken(role: 'customer' | 'admin' = 'customer') {
    const userData = {
      first_name: 'Test',
      last_name: 'User',
      email: 'wamahiucharles123@gmail.com',
      password: 'Test123!',
      role: role
    };

    const response = await request(app)
      .post('/auth/register')
      .send(userData);

    return response.body.token;
  },

  // Helper to clean up test data
  async cleanup() {
    try {
      // Clean up test data in correct order to avoid foreign key constraints
      await client.query('DELETE FROM customer WHERE user_id IN (SELECT user_id FROM "user" WHERE email LIKE \'test%\')');
      await client.query('DELETE FROM car WHERE car_id IN (SELECT car_id FROM car WHERE rental_rate = 100.00)');
      await client.query('DELETE FROM "user" WHERE email LIKE \'test%\' OR email LIKE \'admin%\'');
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  },

  // Helper to create authenticated request object
  createAuthenticatedRequest(token: string) {
    return {
      post: (url: string) => 
        request(app)
          .post(url)
          .set('Authorization', `Bearer ${token}`),
          
      get: (url: string) => 
        request(app)
          .get(url)
          .set('Authorization', `Bearer ${token}`),
          
      put: (url: string) => 
        request(app)
          .put(url)
          .set('Authorization', `Bearer ${token}`),
          
      delete: (url: string) => 
        request(app)
          .delete(url)
          .set('Authorization', `Bearer ${token}`)
    };
  },

  // Helper to create a test user
  async createTestUser(role: 'customer' | 'admin' = 'customer') {
    const userData = {
      first_name: 'Test',
      last_name: 'User',
      email: `test${Date.now()}@example.com`,
      password: 'Test123!',
      role
    };

    const response = await request(app)
      .post('/auth/register')
      .send(userData);

    return {
      token: response.body.user.token,
      userId: response.body.user.id,
      user: response.body.user
    };
  }
};