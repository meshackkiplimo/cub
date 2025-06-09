import request from 'supertest';
import { app } from '../../src/index';
import { testUtils } from './utils';
import { client } from '../../src/drizzle/db';

describe('Car Integration Tests', () => {
  let authToken: string;
  let carId: number;

  beforeAll(async () => {
    // Create admin user for testing
    const response = await request(app)
      .post('/api/user/register')
      .send({
        email: `admin${Date.now()}@example.com`,
        password: 'Test123!',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      });

    authToken = response.body.token;
  });

  afterAll(async () => {
    await testUtils.cleanup();
    await client.end();
  });

  describe('POST /api/cars', () => {
    it('should create a new car', async () => {
      const carData = {
        manufacturer: 'Toyota',
        carModel: 'Camry',
        year: '2023',
        color: 'Silver',
        rentalRate: 100.00
      };

      const response = await request(app)
        .post('/api/car')
        .set('Authorization', `Bearer ${authToken}`)
        .send(carData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('car_id');
      expect(response.body.manufacturer).toBe(carData.manufacturer);
      carId = response.body.car_id;
    });

    it('should not create car with invalid data', async () => {
      const invalidData = {
        manufacturer: 'Toyota',
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/car')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/cars', () => {
    it('should get all cars', async () => {
      const response = await request(app)
        .get('/api/car')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should get car by ID', async () => {
      const response = await request(app)
        .get(`/api/car/${carId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.car_id).toBe(carId);
    });

    it('should get available cars', async () => {
      const response = await request(app)
        .get('/api/car/available')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('PUT /api/cars/:id', () => {
    it('should update car details', async () => {
      const updateData = {
        color: 'Black',
        rentalRate: 120.00
      };

      const response = await request(app)
        .put(`/api/car/${carId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.color).toBe(updateData.color);
      expect(response.body.rental_rate).toBe(updateData.rentalRate);
    });
  });

  describe('DELETE /api/cars/:id', () => {
    it('should delete car', async () => {
      const response = await request(app)
        .delete(`/api/car/${carId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);

      // Verify car is deleted
      const getResponse = await request(app)
        .get(`/api/car/${carId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(getResponse.status).toBe(404);
    });
  });
});