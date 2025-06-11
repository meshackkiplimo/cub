import request from 'supertest';
import  app  from '../../src/index';
import { createTestUtils } from './utils';
import db from '@/drizzle/db';
import { UserTable } from '@/drizzle/schema';

describe('Customer Integration Tests', () => {
  let customerId: number;
  let adminToken: string;
  let userToken: string;
  let userId: number;

  const adminTestUtils = createTestUtils({
    first_name: 'Admin',
    last_name: 'User',
    email: `admin${Date.now()}@test.com`,
    password: 'Admin123!',
    role: 'admin'
  });

  const userTestUtils = createTestUtils({
    first_name: 'Regular',
    last_name: 'User',
    email: `user${Date.now()}@test.com`,
    password: 'User123!',
    role: 'customer'
  });

  beforeAll(async () => {
    try {
      // Create and verify test users
      await adminTestUtils.createTestUser({ role: 'admin', isVerified: true });
      
      // Create regular user and store ID
      const regularUser = await userTestUtils.createTestUser({ role: 'customer', isVerified: true });
      userId = regularUser.user_id;

      // Get auth tokens
      adminToken = await adminTestUtils.getAuthToken(app);
      userToken = await userTestUtils.getAuthToken(app);
    } catch (error) {
      console.error('Test setup failed:', error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      await adminTestUtils.cleanup();
      await userTestUtils.cleanup();
    } catch (error) {
      console.error('Test cleanup failed:', error);
    }
  });

  describe('POST /customers', () => {
    it('should create a new customer profile', async () => {
      const customerData = {
        user_id: userId,
        phone_number: '1234567890',
        address: '123 Test St'
      };

      const response = await request(app)
        .post('/customers')
        .set('Authorization', `Bearer ${userToken}`)
        .send(customerData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Customer created successfully');
      expect(response.body).toHaveProperty('customer');
      expect(response.body.customer.phone_number).toBe(customerData.phone_number);
      expect(response.body.customer.address).toBe(customerData.address);
      customerId = response.body.customer.customer_id;
    });

    it('should not create customer profile with invalid data', async () => {
      const invalidData = {
        user_id: userId
        // Missing required fields
      };

      const response = await request(app)
        .post('/customers')
        .set('Authorization', `Bearer ${userToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Customer creation failed');
    });

    it('should not create duplicate customer profile', async () => {
      const customerData = {
        user_id: userId,
        phone_number: '1234567890',
        address: '123 Test St'
      };

      const response = await request(app)
        .post('/customers')
        .set('Authorization', `Bearer ${userToken}`)
        .send(customerData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Customer creation failed');
    });
  });

  describe('GET /customers/:id', () => {
    it('should get customer profile by ID', async () => {
      const response = await request(app)
        .get(`/customers/${customerId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('customer');
      expect(response.body.customer.customer_id).toBe(customerId);
      expect(response.body.customer.user_id).toBe(userId);
    });

    it('should return 404 for non-existent customer', async () => {
      const response = await request(app)
        .get('/customers/9999')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Customer not found');
    });
  });

  describe('PUT /customers/:id', () => {
    it('should update customer profile', async () => {
      const updatedData = {
        phone_number: '9876543210',
        address: '456 Update St'
      };

      const response = await request(app)
        .put(`/customers/${customerId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Customer updated successfully');
      expect(response.body.customer.phone_number).toBe(updatedData.phone_number);
      expect(response.body.customer.address).toBe(updatedData.address);
    });

    it('should return 404 for updating non-existent customer', async () => {
      const response = await request(app)
        .put('/customers/9999')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ phone_number: '1111111111' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Customer not found');
    });
  });

  describe('GET /customers', () => {
    it('should allow admin to get all customers', async () => {
      const response = await request(app)
        .get('/customers')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.customers)).toBe(true);
      expect(response.body.customers.length).toBeGreaterThan(0);
    });

    it('should not allow regular users to get all customers', async () => {
      const response = await request(app)
        .get('/customers')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Access denied');
    });
  });
});