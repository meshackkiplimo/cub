import request from 'supertest';
import { app } from '../../src/index';
import { createTestUtils } from './utils';

describe('Auth Integration Tests', () => {
  describe('POST /auth/register', () => {
    const validUser = {
      first_name: 'Test',
      last_name: 'User',
      email: `testregister${Date.now()}@example.com`,
      password: 'Test123!',
      role: 'customer',
    };

    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send(validUser);

      expect(response.status).toBe(201);
      expect(response.body.message).toContain('Registration successful');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toMatchObject({
        first_name: validUser.first_name,
        last_name: validUser.last_name,
        email: validUser.email,
      });
    });

    it('should not register user with missing required fields', async () => {
      const invalidUser = {
        email: 'test2@example.com',
        password: 'Test123!'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(invalidUser);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal server error');
    });

    it('should not register user with existing email', async () => {
      // First registration
      const firstResponse = await request(app)
        .post('/auth/register')
        .send({
          ...validUser,
          email: `testduplicate${Date.now()}@example.com`
        });

      expect(firstResponse.status).toBe(201);

      // Attempt second registration with same email
      const response = await request(app)
        .post('/auth/register')
        .send({
          ...validUser,
          email: firstResponse.body.user.email
        });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal server error');
    });
  });

  describe('POST /auth/login', () => {
    const loginTestUtils = createTestUtils({
      first_name: 'Test',
      last_name: 'Login',
      email: `testlogin${Date.now()}@example.com`,
      password: 'Test123!',
      role: 'customer'
    });

    beforeAll(async () => {
      // Create test user without verification
      await loginTestUtils.createTestUser({ role: 'customer', isVerified: false });
    });

    it('should not login with unverified account', async () => {
      const credentials = loginTestUtils.getCredentials();
      
      const response = await request(app)
        .post('/auth/login')
        .send(credentials);

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Account not verified');
      expect(response.body.isVerified).toBe(false);
    });

    it('should not login with incorrect password', async () => {
      const testUser = await loginTestUtils.getTestUser();
      
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser!.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should not login with non-existent user', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Test123!'
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });
});