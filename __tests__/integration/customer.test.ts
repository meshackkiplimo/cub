import request from 'supertest';
import { app } from '../../src/index';
import { testUtils } from './utils';
import { client } from '../../src/drizzle/db';

describe('Customer Integration Tests', () => {
  let userAuth: any;
  let customerId: number;
  let adminAuth: any;

  beforeAll(async () => {
    // Create a regular user
    userAuth = await testUtils.createTestUser('customer');

    // Create an admin user
    adminAuth = await testUtils.createTestUser('admin');
  });

  afterAll(async () => {
    await testUtils.cleanup();
    await client.end();
  });

  describe('POST /customers', () => {
    it('should create a new customer profile', async () => {
      const customerData = {
        phone_number: '+254712345678',
        address: '123 Test Street',
        user_id: userAuth.userId
      };

      const response = await request(app)
        .post('/customers')
        .set('Authorization', `Bearer ${userAuth.token}`)
        .send(customerData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Customer created successfully');
      expect(response.body).toHaveProperty('customer');
      expect(response.body.customer).toHaveProperty('customer_id');
      customerId = response.body.customer.customer_id;
    });

    it('should not create customer profile with invalid data', async () => {
      const invalidData = {
        // Missing required phone_number
        address: '123 Test Street',
        user_id: userAuth.userId
      };

      const response = await request(app)
        .post('/customers')
        .set('Authorization', `Bearer ${userAuth.token}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Customer creation failed');
    });

    it('should not create duplicate customer profile', async () => {
      const customerData = {
        phone_number: '+254712345678',
        address: '123 Test Street',
        user_id: userAuth.userId
      };

      const response = await request(app)
        .post('/customers')
        .set('Authorization', `Bearer ${userAuth.token}`)
        .send(customerData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Customer creation failed');
    });
  });

  describe('GET /customers/:id', () => {
    it('should get customer profile by ID', async () => {
      const response = await request(app)
        .get(`/customers/${customerId}`)
        .set('Authorization', `Bearer ${userAuth.token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('customer');
      expect(response.body.customer).toHaveProperty('phone_number');
      expect(response.body.customer).toHaveProperty('address');
    });

    it('should return 404 for non-existent customer', async () => {
      const response = await request(app)
        .get('/customers/99999')
        .set('Authorization', `Bearer ${userAuth.token}`);

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

      const response = await request(app)
        .put(`/customers/${customerId}`)
        .set('Authorization', `Bearer ${userAuth.token}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Customer updated successfully');
      expect(response.body.customer.phone_number).toBe(updateData.phone_number);
      expect(response.body.customer.address).toBe(updateData.address);
    });

    it('should return 404 for updating non-existent customer', async () => {
      const response = await request(app)
        .put('/customers/99999')
        .set('Authorization', `Bearer ${userAuth.token}`)
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
      const response = await request(app)
        .get('/customers')
        .set('Authorization', `Bearer ${adminAuth.token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('customers');
      expect(Array.isArray(response.body.customers)).toBe(true);
    });

    it('should not allow regular users to get all customers', async () => {
      const response = await request(app)
        .get('/customers')
        .set('Authorization', `Bearer ${userAuth.token}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Unauthorized');
    });
  });
});