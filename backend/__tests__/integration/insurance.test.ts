import request from 'supertest';
import app from '../../src/index';
import { createTestUtils } from './utils';
import db from '../../src/drizzle/db';
import { CarTable, LocationTable } from '../../src/drizzle/schema';

describe('Insurance Integration Tests', () => {
  let insuranceId: number;
  let carId: number;
  let locationId: number;
  let adminToken: string;
  let userToken: string;

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
      // Clean up any existing test data
      await adminTestUtils.cleanup();
      await userTestUtils.cleanup();

      // Create and verify test users
      await adminTestUtils.createTestUser({ role: 'admin', isVerified: true });
      await userTestUtils.createTestUser({ role: 'customer', isVerified: true });

      // Get auth tokens
      adminToken = await adminTestUtils.getAuthToken(app);
      userToken = await userTestUtils.getAuthToken(app);

      // Create test location
      const [location] = await db.insert(LocationTable).values({
        location_name: 'Test Location',
        address: 'Test Address',
        contact_number: '1234567890'
      }).returning();
      locationId = location.location_id;

      // Create test car
      const [car] = await db.insert(CarTable).values({
        make: 'Toyota',
        model: 'Camry',
        year: '2023',
        color: 'Black',
        rental_rate: "100.00",
        location_id: locationId,
        availability: true
      }).returning();
      carId = car.car_id;
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

  describe('POST /insurance', () => {
    it('should create a new insurance policy', async () => {
      const insuranceData = {
        car_id: carId,
        provider: 'Test Insurance Co',
        policy_number: 'POL123456',
        start_date: '2025-06-15',
        end_date: '2026-06-14'
      };

      const response = await request(app)
        .post('/insurance')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(insuranceData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Insurance created successfully');
      expect(response.body).toHaveProperty('insurance');
      expect(response.body.insurance.car_id).toBe(insuranceData.car_id);
      expect(response.body.insurance.policy_number).toBe(insuranceData.policy_number);
      insuranceId = response.body.insurance.insurance_id;
    });

    it('should not create insurance with invalid data', async () => {
      const invalidData = {
        car_id: carId
        // Missing required fields
      };

      const response = await request(app)
        .post('/insurance')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid insurance data');
      expect(response.body.details).toBe('Missing required fields');
    });

    it('should not allow non-admin to create insurance', async () => {
      const insuranceData = {
        car_id: carId,
        provider: 'Test Insurance Co',
        policy_number: 'POL123457',
        start_date: '2025-06-15',
        end_date: '2026-06-14'
      };

      const response = await request(app)
        .post('/insurance')
        .set('Authorization', `Bearer ${userToken}`)
        .send(insuranceData);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied. Admin role required.');
    });
  });

  describe('GET /insurance/:id', () => {
    it('should retrieve an insurance policy by ID', async () => {
      const response = await request(app)
        .get(`/insurance/${insuranceId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('insurance');
      expect(response.body.insurance.insurance_id).toBe(insuranceId);
      expect(response.body.insurance.car_id).toBe(carId);
    });

    it('should return 404 for non-existent insurance', async () => {
      const response = await request(app)
        .get('/insurance/9999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Insurance not found');
    });
  });

  describe('GET /insurance', () => {
    it('should allow admin to get all insurance policies', async () => {
      const response = await request(app)
        .get('/insurance')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.insurances)).toBe(true);
      expect(response.body.insurances.length).toBeGreaterThan(0);
    });

    it('should not allow regular users to get all insurance policies', async () => {
      const response = await request(app)
        .get('/insurance')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied. Admin role required.');
    });
  });

  describe('PUT /insurance/:id', () => {
    it('should update an insurance policy', async () => {
      const updatedData = {
        provider: 'Updated Insurance Co',
        end_date: '2026-12-31'
      };

      const response = await request(app)
        .put(`/insurance/${insuranceId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Insurance updated successfully');
      expect(response.body.insurance.provider).toBe(updatedData.provider);
      expect(response.body.insurance.end_date).toBe(updatedData.end_date);
    });

    it('should validate update data', async () => {
      const response = await request(app)
        .put(`/insurance/${insuranceId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid insurance data');
      expect(response.body.details).toBe('No update data provided');
    });

    it('should not allow non-admin to update insurance', async () => {
      const response = await request(app)
        .put(`/insurance/${insuranceId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ end_date: '2027-01-01' });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied. Admin role required.');
    });
  });

  describe('DELETE /insurance/:id', () => {
    it('should not allow non-admin to delete insurance', async () => {
      const response = await request(app)
        .delete(`/insurance/${insuranceId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied. Admin role required.');
    });

    it('should allow admin to delete insurance', async () => {
      const response = await request(app)
        .delete(`/insurance/${insuranceId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Insurance deleted successfully');
    });
  });
});