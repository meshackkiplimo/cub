import request from 'supertest';
import { app } from '../../src/index';
import { createTestUtils } from './utils';

describe('Customer Integration Tests', () => {
  let customerId: number;

  const userTestUtils = createTestUtils({
    first_name: 'Test',
    last_name: 'Customer',
    email: `testcustomer${Date.now()}@test.com`,
    password: 'Test123!',
    role: 'customer'
  });

  const adminTestUtils = createTestUtils({
    first_name: 'Admin',
    last_name: 'User',
    email: `admin${Date.now()}@test.com`,
    password: 'Admin123!',
    role: 'admin'
  });

  beforeAll(async () => {
    // Create and verify test users
    await userTestUtils.createTestUser({ role: 'customer', isVerified: true });
    await adminTestUtils.createTestUser({ role: 'admin', isVerified: true });
  });

  describe('POST /customers', () => {
    it('should create a new customer profile', async () => {
      const customerData = {
        phone_number: '+254712345678',
        address: '123 Test Street'
      };

      const token = await userTestUtils.getAuthToken(app);
      const testUser = await userTestUtils.getTestUser();

      const response = await request(app)
        .post('/customers')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...customerData,
          user_id: testUser!.user_id
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Customer created successfully');
      expect(response.body).toHaveProperty('customer');
      expect(response.body.customer).toHaveProperty('customer_id');
      customerId = response.body.customer.customer_id;
    });

    it('should not create customer profile with invalid data', async () => {
      const invalidData = {
        // Missing required phone_number
        address: '123 Test Street'
      };

      const token = await userTestUtils.getAuthToken(app);
      const testUser = await userTestUtils.getTestUser();

      const response = await request(app)
        .post('/customers')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...invalidData,
          user_id: testUser!.user_id
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Customer creation failed');
    });

    it('should not create duplicate customer profile', async () => {
      const customerData = {
        phone_number: '+254712345678',
        address: '123 Test Street'
      };

      const token = await userTestUtils.getAuthToken(app);
      const testUser = await userTestUtils.getTestUser();

      const response = await request(app)
        .post('/customers')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...customerData,
          user_id: testUser!.user_id
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Customer creation failed');
    });
  });

  describe('GET /customers/:id', () => {
    it('should get customer profile by ID', async () => {
      const token = await userTestUtils.getAuthToken(app);

      const response = await request(app)
        .get(`/customers/${customerId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('customer');
      expect(response.body.customer).toHaveProperty('phone_number');
      expect(response.body.customer).toHaveProperty('address');
    });

    it('should return 404 for non-existent customer', async () => {
      const token = await userTestUtils.getAuthToken(app);

      const response = await request(app)
        .get('/customers/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Customer not found');
    });
  });

  describe('PUT /customers/:id', () => {
    it('should update customer profile', async () => {
      const updateData = {
        phone_number: '+254787654321',
        address: '456 Updated Street'
      };

      const token = await userTestUtils.getAuthToken(app);

      const response = await request(app)
        .put(`/customers/${customerId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Customer updated successfully');
      expect(response.body.customer.phone_number).toBe(updateData.phone_number);
      expect(response.body.customer.address).toBe(updateData.address);
    });

    it('should return 404 for updating non-existent customer', async () => {
      const token = await userTestUtils.getAuthToken(app);

      const response = await request(app)
        .put('/customers/99999')
        .set('Authorization', `Bearer ${token}`)
        .send({
          phone_number: '+254787654321',
          address: '456 Updated Street'
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Customer not found');
    });
  });

  describe('GET /customers', () => {
    it('should allow admin to get all customers', async () => {
      const token = await adminTestUtils.getAuthToken(app);

      const response = await request(app)
        .get('/customers')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('customers');
      expect(Array.isArray(response.body.customers)).toBe(true);
    });

    it('should not allow regular users to get all customers', async () => {
      const token = await userTestUtils.getAuthToken(app);

      const response = await request(app)
        .get('/customers')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Unauthorized');
    });
  });
});