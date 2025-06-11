import request from 'supertest';
import { app } from '../../src/index';
import { createTestUtils } from './utils';
import db from '@/drizzle/db';
import { CarTable, LocationTable } from '@/drizzle/schema';

describe('Booking Integration Tests', () => {
  let bookingId: number;
  let carId: number;
  let locationId: number;
  let adminToken: string;
  let userToken: string;
  let userId: number;
  let customerId: number;

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
      const regularUser = await userTestUtils.createTestUser({ role: 'customer', isVerified: true });
      userId = regularUser.user_id;

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

      // Create customer profile
      const customerResponse = await request(app)
        .post('/customers')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          user_id: userId,
          phone_number: '1234567890',
          address: '123 Test St'
        });
      customerId = customerResponse.body.customer.customer_id;
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

  describe('POST /bookings', () => {
    it('should create a new booking', async () => {
      const bookingData = {
        customer_id: customerId,
        car_id: carId,
        rental_start_date: '2025-06-15',
        rental_end_date: '2025-06-20',
        total_amount: "500.00",
       
      };

      const response = await request(app)
        .post('/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send(bookingData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Booking created successfully');
      expect(response.body).toHaveProperty('booking');
      expect(response.body.booking.customer_id).toBe(bookingData.customer_id);
      expect(response.body.booking.car_id).toBe(bookingData.car_id);
      bookingId = response.body.booking.booking_id;
    });

    it('should not create booking with invalid data', async () => {
      const invalidData = {
        customer_id: customerId
        // Missing required fields
      };

      const response = await request(app)
        .post('/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid booking data');
    });

    it('should not create booking for unavailable car', async () => {
      // First, update car to unavailable
      await request(app)
        .put(`/cars/${carId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ availability: false });

      const bookingData = {
        customer_id: customerId,
        car_id: carId,
        rental_start_date: '2025-06-15',
        rental_end_date: '2025-06-20',
        total_amount: "500.00"
      };

      const response = await request(app)
        .post('/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send(bookingData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Car is not available for booking');

      // Reset car availability
      await request(app)
        .put(`/cars/${carId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ availability: true });
    });
  });

  describe('GET /bookings/:id', () => {
    it('should retrieve a booking by ID', async () => {
      const response = await request(app)
        .get(`/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('booking');
      expect(response.body.booking.booking_id).toBe(bookingId);
      expect(response.body.booking.customer_id).toBe(customerId);
    });

    it('should return 404 for non-existent booking', async () => {
      const response = await request(app)
        .get('/bookings/9999')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Booking not found');
    });
  });

  describe('GET /bookings', () => {
    it('should allow admin to get all bookings', async () => {
      const response = await request(app)
        .get('/bookings')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.bookings)).toBe(true);
      expect(response.body.bookings.length).toBeGreaterThan(0);
    });

    it('should allow customer to get their own bookings', async () => {
      const response = await request(app)
        .get('/bookings')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.bookings)).toBe(true);
      expect(response.body.bookings.every((booking: { customer_id: number }) => 
        booking.customer_id === customerId
      )).toBe(true);
    });
  });

  describe('PUT /bookings/:id', () => {
    it('should update a booking', async () => {
      const updatedData = {
        rental_end_date: '2025-06-22',
        total_amount: "600.00"
      };

      const response = await request(app)
        .put(`/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Booking updated successfully');
      expect(response.body.booking.rental_end_date).toBe(updatedData.rental_end_date);
      expect(response.body.booking.total_amount).toBe(updatedData.total_amount);
    });

    it('should not allow updating completed bookings', async () => {
      // First mark booking as completed
      await request(app)
        .put(`/bookings/${bookingId}/complete`)
        .set('Authorization', `Bearer ${adminToken}`);

      const response = await request(app)
        .put(`/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ rental_end_date: '2025-06-23' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Cannot modify completed booking');
    });

    it('should not allow updating another customer\'s booking', async () => {
      // Create another user
      const otherUser = createTestUtils({
        first_name: 'Other',
        last_name: 'User',
        email: `other${Date.now()}@test.com`,
        password: 'Other123!',
        role: 'customer'
      });

      const otherUserData = await otherUser.createTestUser({ role: 'customer', isVerified: true });
      const otherToken = await otherUser.getAuthToken(app);

      const response = await request(app)
        .put(`/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ rental_end_date: '2025-06-24' });

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Access denied');

      // Cleanup other user
      await otherUser.cleanup();
    });
  });

  describe('DELETE /bookings/:id', () => {
    it('should not allow customer to delete booking', async () => {
      const response = await request(app)
        .delete(`/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Access denied');
    });

    it('should allow admin to delete booking', async () => {
      const response = await request(app)
        .delete(`/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Booking deleted successfully');
    });
  });
});