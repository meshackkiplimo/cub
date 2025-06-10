import request from 'supertest';
import { app } from '../../src/index';
import { testUtils } from './utils';
import { client } from '../../src/drizzle/db';

describe('Car Integration Tests', () => {
 
  let carId: number;

  beforeAll(async () => {
  
    
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
})