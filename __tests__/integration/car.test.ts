import request from 'supertest';
import { app } from '../../src/index';
import { testUtils } from './utils';
import { client } from '../../src/drizzle/db';

describe('Car Integration Tests', () => {
 
  let carId: number;

  beforeAll(async () => {
    // Ensure the database is clean before tests
    await testUtils.cleanup();
    // Optionally, create an admin user for testing
    // const adminAuth = await testUtils.getAuthToken('admin');
  
    
  });

  afterAll(async () => {
    await testUtils.cleanup();
    await client.end();
  });

  describe('POST /cars', () => {
    it('should create a new car', async () => {
      const carData = {
        make: 'Toyota',
        model: 'Camry',
        year: '2023',
        color: 'Silver',
        rental_rate: 100.00,
        location_id: 1,
        availability: true
      };

      const response = await request(app)
        .post('/cars')
        // .set('Authorization', `Bearer ${adminAuth.token}`)
        .send(carData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Car created successfully');
      expect(response.body).toHaveProperty('car');
      expect(response.body.car.make).toBe(carData.make);
      expect(response.body.car.model).toBe(carData.model);
      carId = response.body.car.car_id;
    });




})
  describe('GET /cars/:id', () => {
    it('should retrieve a car by ID', async () => {
      const response = await request(app)
        .get(`/cars/${carId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('car');
      expect(response.body.car.car_id).toBe(carId);
      expect(response.body.car.make).toBe('Toyota');
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
    });
  });

  describe('PUT /cars/:id', () => {
    it('should update a car by ID', async () => {
      const updatedData = {
        color: 'Blue',
        availability: false
      };

      const response = await request(app)
        .put(`/cars/${carId}`)
        // .set('Authorization', `Bearer ${adminAuth.token}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Car updated successfully');
      expect(response.body.car.color).toBe(updatedData.color);
      expect(response.body.car.availability).toBe(updatedData.availability);
    });

    it('should return 404 for non-existent car ID during update', async () => {
      const response = await request(app)
        .put('/cars/9999')
        // .set('Authorization', `Bearer ${adminAuth.token}`)
        .send({ color: 'Red' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Car not found');
    });
  });

  describe('DELETE /cars/:id', () => {
    it('should delete a car by ID', async () => {
      const response = await request(app)
        .delete(`/cars/${carId}`)
        // .set('Authorization', `Bearer ${adminAuth.token}`)
        .send();
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Car deleted successfully');
    }
    );
    it('should return 404 for non-existent car ID during deletion', async () => {
      const response = await request(app)
        .delete('/cars/9999')
        // .set('Authorization', `Bearer ${adminAuth.token}`)
        .send();

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Car not found');
    });
  }
  );


})