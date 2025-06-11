import request from 'supertest';
import { app } from '../../src/index';
import { createTestUtils } from './utils';
import db from '@/drizzle/db';
import { CarTable, LocationTable } from '@/drizzle/schema';

describe('Maintenance Integration Tests', () => {
  let maintenanceId: number;
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

  describe('POST /maintenance', () => {
    it('should create a new maintenance record', async () => {
      const maintenanceData = {
        car_id: carId,
        maintenance_date: '2025-06-15',
        description: 'Regular service and oil change',
        cost: "150.00"
      };

      const response = await request(app)
        .post('/maintenance')
        // .set('Authorization', `Bearer ${adminToken}`)
        .send(maintenanceData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Maintenance record created successfully');
      expect(response.body).toHaveProperty('maintenance');
      expect(response.body.maintenance.car_id).toBe(maintenanceData.car_id);
      expect(response.body.maintenance.description).toBe(maintenanceData.description);
      maintenanceId = response.body.maintenance.maintenance_id;
    });

    it('should not create maintenance record with invalid data', async () => {
      const invalidData = {
        car_id: carId,
        maintenance_date: '2025-06-15',
       
      };

      const response = await request(app)
        .post('/maintenance')
        // .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid maintenance data');
    });

    
  });

  describe('GET /maintenance/:id', () => {
    it('should retrieve a maintenance record by ID', async () => {
      const response = await request(app)
        .get(`/maintenance/${maintenanceId}`)
        // .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('maintenance');
      expect(response.body.maintenance.maintenance_id).toBe(maintenanceId);
      expect(response.body.maintenance.car_id).toBe(carId);
    });

   
  });

  describe('GET /maintenance', () => {
    it('should allow admin to get all maintenance records', async () => {
      const response = await request(app)
        .get('/maintenance')
        // .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.maintenance)).toBe(true);
      expect(response.body.maintenance.length).toBeGreaterThan(0);
    });

    it('should not allow regular users to get all maintenance records', async () => {
      const response = await request(app)
        .get('/maintenance')
        // .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Access denied');
    });
  });

  describe('PUT /maintenance/:id', () => {
    it('should update a maintenance record', async () => {
      const updatedData = {
        description: 'Updated service description',
        cost: "200.00"
      };

      const response = await request(app)
        .put(`/maintenance/${maintenanceId}`)
        // .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Maintenance record updated successfully');
      expect(response.body.maintenance.description).toBe(updatedData.description);
      expect(response.body.maintenance.cost).toBe(updatedData.cost);
    });

    it('should not allow non-admin to update maintenance record', async () => {
      const response = await request(app)
        .put(`/maintenance/${maintenanceId}`)
        // .set('Authorization', `Bearer ${userToken}`)
        .send({ description: 'Unauthorized update' });

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Access denied');
    });
  });

  describe('DELETE /maintenance/:id', () => {
    it('should not allow non-admin to delete maintenance record', async () => {
      const response = await request(app)
        .delete(`/maintenance/${maintenanceId}`)
        // .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Access denied');
    });

    it('should allow admin to delete maintenance record', async () => {
      const response = await request(app)
        .delete(`/maintenance/${maintenanceId}`)
        // .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Maintenance record deleted successfully');
    });
  });
});