import request from 'supertest';
import { app } from '../../src/index';
import { client } from '../../src/drizzle/db';

export const testUtils = {
  // Helper to create a test user and get auth token
  async getAuthToken(role: 'customer' | 'admin' = 'customer') {
    const userData = {
      email: `test${Date.now()}@example.com`,
      password: 'Test123!',
      firstName: 'Test',
      lastName: 'User',
      role
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);

    return response.body.token;
  },

  // Helper to clean up test data
  async cleanup() {
    try {
      // Only delete data that exists in our schema
      await client.query('DELETE FROM users WHERE email LIKE \'test%\'');
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  },

  // Helper to make authenticated requests
  createAuthenticatedRequest(token: string) {
    const agent = request(app);
    return {
      post: (url: string) => agent.post(url).set('Authorization', `Bearer ${token}`),
      get: (url: string) => agent.get(url).set('Authorization', `Bearer ${token}`),
      put: (url: string) => agent.put(url).set('Authorization', `Bearer ${token}`),
      delete: (url: string) => agent.delete(url).set('Authorization', `Bearer ${token}`)
    };
  }
};