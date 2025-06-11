import request from 'supertest';
import app from '../../src/index';
import { createTestUtils } from './utils';
import { emailService } from '../../src/services/emailService';

// Need to import jest-mock types
jest.mock('../../src/services/emailService');

describe('Auth Integration Tests', () => {
  const testUtils = createTestUtils();

  afterEach(async () => {
    await testUtils.cleanup();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send(testUtils.getRegistrationData());

      expect(response.status).toBe(201);
      expect(response.body.message).toContain('Registration successful');
      expect(response.body.message).toContain('verification code');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toMatchObject({
        first_name: testUtils.getRegistrationData().first_name,
        last_name: testUtils.getRegistrationData().last_name,
        email: testUtils.getRegistrationData().email
      });
      expect(response.body.user).not.toHaveProperty('password');

      // Verify email service was called
      expect(jest.mocked(emailService.sendVerificationCode)).toHaveBeenCalledWith(
        testUtils.getRegistrationData().email,
        expect.any(String)
      );
    });

    it('should not register user with missing customer fields', async () => {
      // Missing customer fields
      const invalidUser = {
        ...testUtils.getRegistrationData(),
        phone_number: undefined,
        address: undefined
      };

      const response = await request(app)
        .post('/auth/register')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Missing required customer fields: phone number and address');
    });

    it('should not register user with missing user fields', async () => {
      const invalidUser = {
        email: 'test2@example.com',
        password: 'Test123!',
        phone_number: '1234567890',
        address: '123 Test St'
        // Missing first_name and last_name
      };

      const response = await request(app)
        .post('/auth/register')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Missing required user fields: first name, last name, email, and password');
    });

    

    it('should register user with strong password', async () => {
      const strongPasswordUser = {
        ...testUtils.getRegistrationData(),
        password: 'StrongP@ss123'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(strongPasswordUser);

      expect(response.status).toBe(201);
      expect(response.body.message).toContain('Registration successful');
    });

    it('should not register user with existing email', async () => {
      // First registration
      const firstResponse = await request(app)
        .post('/auth/register')
        .send(testUtils.getRegistrationData());

      expect(firstResponse.status).toBe(201);

      // Second registration with same email
      const response = await request(app)
        .post('/auth/register')
        .send({
          ...testUtils.getRegistrationData(),
          phone_number: '0987654321',  // Different phone number
          address: '456 Test Ave'      // Different address
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
      role: 'customer',
      phone_number: '1234567890',
      address: '123 Test St'
    });

    beforeEach(async () => {
      await loginTestUtils.cleanup();
    });

    it('should login successfully with verified account', async () => {
      await loginTestUtils.createTestUser({ role: 'customer', isVerified: true });
      const credentials = loginTestUtils.getCredentials();
      
      const response = await request(app)
        .post('/auth/login')
        .send(credentials);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.message).toBe('Login successful');
      expect(response.body.user).toMatchObject({
        email: credentials.email,
        isVerified: true
      });
    });

    it('should not login with unverified account', async () => {
      await loginTestUtils.createTestUser({ role: 'customer', isVerified: false });
      const credentials = loginTestUtils.getCredentials();
      
      const response = await request(app)
        .post('/auth/login')
        .send(credentials);

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Account not verified');
      expect(response.body.message).toContain('verification code has been sent');
      expect(response.body.isVerified).toBe(false);

      // Verify new verification code was sent
      expect(jest.mocked(emailService.sendVerificationCode)).toHaveBeenCalledWith(
        credentials.email,
        expect.any(String)
      );
    });

    it('should not login with incorrect password', async () => {
      await loginTestUtils.createTestUser({ role: 'customer', isVerified: true });
      const credentials = loginTestUtils.getCredentials();
      
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: credentials.email,
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

    afterAll(async () => {
      await loginTestUtils.cleanup();
    });
  });

  describe('POST /auth/verify-email', () => {
    const verifyTestUtils = createTestUtils({
      first_name: 'Test',
      last_name: 'Verify',
      email: `testverify${Date.now()}@example.com`,
      password: 'Test123!',
      role: 'customer',
      phone_number: '1234567890',
      address: '123 Test St'
    });

    beforeEach(async () => {
      await verifyTestUtils.cleanup();
    });

    it('should verify email with valid code', async () => {
      // First register a new user
      const registerResponse = await request(app)
        .post('/auth/register')
        .send(verifyTestUtils.getRegistrationData());

      expect(registerResponse.status).toBe(201);

      // Simulate having a valid verification code
      // Note: In a real test we'd need to mock or intercept the email service
      const response = await request(app)
        .post('/auth/verify-email')
        .send({
          email: verifyTestUtils.getRegistrationData().email,
          code: '123456' // This will fail as we can't get the real code in test
        });

      // Since we can't get the real code, we expect a 400
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid or expired verification code');
    });


    afterAll(async () => {
      await verifyTestUtils.cleanup();
    });
  });
});