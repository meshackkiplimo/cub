import request from 'supertest';
import { app } from '../../src/index';
import { testUtils } from './utils';
import { client } from '../../src/drizzle/db';

describe('Auth Integration Tests', () => {
  afterAll(async () => {
    await testUtils.cleanup();
    await client.end();
  });

  describe('POST /api/auth/register', () => {
    const validUser = {
      email: 'test@example.com',
      password: 'Test123!',
      firstName: 'Test',
      lastName: 'User'
    };

    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/user/register')
        .send(validUser);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should not register user with existing email', async () => {
      // First registration
      await request(app)
        .post('/api/user/register')
        .send(validUser);

      // Attempt to register with same email
      const response = await request(app)
        .post('/api/user/register')
        .send(validUser);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    const testUser = {
      email: 'testlogin@example.com',
      password: 'Test123!',
      firstName: 'Test',
      lastName: 'Login'
    };

    beforeAll(async () => {
      await request(app)
        .post('/api/user/register')
        .send(testUser);
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should not login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
    });
  });
});