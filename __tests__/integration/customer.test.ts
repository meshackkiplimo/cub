import request from 'supertest';
import { app } from '../../src/index';
import { testUtils } from './utils';
import { client } from '../../src/drizzle/db';

describe('Customer Integration Tests', () => {
  let authToken: string;
  let userId: number;

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/user/register')
      .send({
        email: `test${Date.now()}@example.com`,
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User'
      });

    authToken = response.body.token;
  });

  afterAll(async () => {
    await testUtils.cleanup();
    await client.end();
  });

  describe('POST /api/customers', () => {
    it('should create a new customer profile', async () => {
      const customerData = {
        phoneNumber: '+254712345678',
        address: '123 Test Street'
      };

      const response = await request(app)
        .post('/api/customer')
        .set('Authorization', `Bearer ${authToken}`)
        .send(customerData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('customer_id');
    });

    it('should not create customer profile with invalid data', async () => {
      const invalidData = {
        phoneNumber: '', // Empty phone number
        address: '123 Test Street'
      };

      const response = await request(app)
        .post('/api/customer')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/customers', () => {
    it('should get customer profile', async () => {
      const response = await request(app)
        .get('/api/customer')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('phone_number');
      expect(response.body).toHaveProperty('address');
    });
  });

  describe('PUT /api/customers', () => {
    it('should update customer profile', async () => {
      const updateData = {
        phoneNumber: '+254787654321',
        address: '456 Updated Street'
      };

      const response = await request(app)
        .put('/api/customer')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.phone_number).toBe(updateData.phoneNumber);
      expect(response.body.address).toBe(updateData.address);
    });
  });

  describe('DELETE /api/customers', () => {
    it('should delete customer profile', async () => {
      const response = await request(app)
        .delete('/api/customer')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);

      // Verify customer is deleted
      const getResponse = await request(app)
        .get('/api/customer')
        .set('Authorization', `Bearer ${authToken}`);
      expect(getResponse.status).toBe(404);
    });
  });
});