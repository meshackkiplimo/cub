import request from 'supertest';
import { app } from '../../src/index';
import { testUtils } from './utils';
import { client } from '../../src/drizzle/db';

describe('Auth Integration Tests', () => {
  afterAll(async () => {
    await testUtils.cleanup();
    await client.end();
  });

  describe('POST /auth/register', () => {
    const validUser = {
      first_name: 'Test',
      last_name: 'User',
      email: "wamahiucharles123@gmail.com",
      password: 'Test123!',
      role: 'customer'
    };

    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send(validUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Registration successful');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('first_name', validUser.first_name);
      expect(response.body.user).toHaveProperty('last_name', validUser.last_name);
      expect(response.body.user).toHaveProperty('email', validUser.email);
    });

    it('should not register user with missing required fields', async () => {
      const invalidUser = {
        email: 'test2@example.com',
        password: 'Test123!'
        // Missing first_name and last_name
      };

      const response = await request(app)
        .post('/auth/register')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User creation failed');
    });

    it('should not register user with existing email', async () => {
      // First registration
      const firstResponse = await request(app)
        .post('/auth/register')
        .send({
          ...validUser,
          email: `test.existing${Date.now()}@example.com`
        });

      expect(firstResponse.status).toBe(201);

      // Attempt to register with same email
      const response = await request(app)
        .post('/auth/register')
        .send({
          ...validUser,
          email: firstResponse.body.user.email
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User creation failed');
    });
  });

  describe('POST /auth/login', () => {
    let testUser: any;

    beforeAll(async () => {
      testUser = {
        first_name: 'Test',
        last_name: 'Login',
        email: `testlogin${Date.now()}@example.com`,
        password: 'Test123!',
        role: 'customer'
      };

      // Create a test user first
      await request(app)
        .post('/auth/register')
        .send(testUser);
    });

    it('should not login with unverified account', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should not login with incorrect password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
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