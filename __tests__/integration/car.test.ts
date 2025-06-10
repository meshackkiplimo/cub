import request from 'supertest';
import { app } from '../../src/index';
import { createTestUtils } from './utils';
import db from '@/drizzle/db';
import { LocationTable } from '@/drizzle/schema';

describe('Car Integration Tests', () => {
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

      // Create test location for cars
      const [location] = await db.insert(LocationTable).values({
        location_name: 'Test Location',
        address: 'Test Address',
        contact_number: '1234567890'
      }).returning();

      locationId = location.location_id;
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

  describe('POST /cars', () => {
    it('should create a new car', async () => {
      const carData = {
        make: 'Honda',
        model: 'Civic',
        year: '2023',
        color: 'Blue',
        rental_rate: "90.00",
        location_id: locationId,
        availability: true
      };

      const response = await request(app)
        .post('/cars')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(carData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Car created successfully');
      expect(response.body).toHaveProperty('car');
      expect(response.body.car).toMatchObject(carData);
      carId = response.body.car.car_id;
    });

    it('should not create car with invalid data', async () => {
      const invalidData = {
        make: 'Toyota',
        // Missing required fields
      };

      const response = await request(app)
        .post('/cars')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidData);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal server error');
    });

    it('should not allow non-admin to create car', async () => {
      const carData = {
        make: 'Toyota',
        model: 'Camry',
        year: '2023',
        color: 'Silver',
        rental_rate: "100.00",
        location_id: locationId,
        availability: true
      };

      const response = await request(app)
        .post('/cars')
        .set('Authorization', `Bearer ${userToken}`)
        .send(carData);

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Access denied');
    });
  });

  describe('GET /cars/:id', () => {
    it('should retrieve a car by ID', async () => {
      const response = await request(app)
        .get(`/cars/${carId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('car');
      expect(response.body.car.car_id).toBe(carId);
      expect(response.body.car.make).toBe('Honda');
      expect(typeof response.body.car.rental_rate).toBe('string');
    });

    it('should return 404 for non-existent car ID', async () => {
      const response = await request(app)
        .get('/cars/9999');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Car not found');
    });
  });

  describe('GET /cars', () => {
    it('should retrieve all cars', async () => {
      const response = await request(app)
        .get('/cars');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.cars)).toBe(true);
      expect(response.body.cars.length).toBeGreaterThan(0);
      expect(typeof response.body.cars[0].rental_rate).toBe('string');
    });
  });

  describe('PUT /cars/:id', () => {
    it('should update a car by ID', async () => {
      const updatedData = {
        color: 'Blue',
        availability: false,
        rental_rate: "95.00"
      };

      const response = await request(app)
        .put(`/cars/${carId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Car updated successfully');
      expect(response.body.car.color).toBe(updatedData.color);
      expect(response.body.car.availability).toBe(updatedData.availability);
      expect(response.body.car.rental_rate).toBe(updatedData.rental_rate);
    });

    it('should return 404 for non-existent car ID during update', async () => {
      const response = await request(app)
        .put('/cars/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ color: 'Red' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Car not found');
    });

    it('should not allow non-admin to update car', async () => {
      const response = await request(app)
        .put(`/cars/${carId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ color: 'Red' });

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Access denied');
    });
  });

  describe('DELETE /cars/:id', () => {
    let testCarId: number;

    beforeEach(async () => {
      // Create a test car for deletion tests
      const carData = {
        make: 'Delete',
        model: 'Test',
        year: '2023',
        color: 'Red',
        rental_rate: "80.00",
        location_id: locationId,
        availability: true
      };

      const response = await request(app)
        .post('/cars')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(carData);

      testCarId = response.body.car.car_id;
    });

    it('should not allow non-admin to delete car', async () => {
      const response = await request(app)
        .delete(`/cars/${testCarId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send();

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Access denied');
    });

    it('should delete a car by ID', async () => {
      const response = await request(app)
        .delete(`/cars/${testCarId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Car deleted successfully');
    });

    it('should return 404 for non-existent car ID during deletion', async () => {
      const response = await request(app)
        .delete('/cars/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send();

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Car not found');
    });
  });
});