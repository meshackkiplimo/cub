import request from 'supertest';
import { app } from '../../src/index';
import { createTestUtils } from './utils';
import db from '@/drizzle/db';
import { CarTable, LocationTable } from '@/drizzle/schema';

describe('Payment Integration Tests', () => {
  let paymentId: number;
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

      // Create test booking through API with correct column names
      const bookingData = {
        customer_id: customerId,
        car_id: carId,
        booking_date: '2025-06-15', // Using booking_date instead of rental_start_date
        end_date: '2025-06-20',     // Using end_date instead of rental_end_date
        total_amount: "500.00"
      };

      const bookingResponse = await request(app)
        .post('/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send(bookingData);

      if (bookingResponse.status !== 201) {
        console.error('Booking creation failed:', bookingResponse.body);
        throw new Error(`Failed to create booking: ${bookingResponse.status}`);
      }

      bookingId = bookingResponse.body.booking.booking_id;
      
      if (!bookingId) {
        throw new Error('Booking ID is undefined after creation');
      }

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

  it('should create a new payment', async () => {
    expect(bookingId).toBeDefined();
    
    const paymentData = {
      booking_id: bookingId,
      payment_date: '2025-06-15',
      amount: "500.00",
      payment_method: 'credit_card'
    };

    const response = await request(app)
      .post('/payments')
      .set('Authorization', `Bearer ${userToken}`)
      .send(paymentData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Payment created successfully');
    expect(response.body).toHaveProperty('payment');
    expect(response.body.payment.booking_id).toBe(bookingId);
    paymentId = response.body.payment.payment_id;
  });

  it('should get all payments', async () => {
    const response = await request(app)
      .get('/payments')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('payments');
    expect(Array.isArray(response.body.payments)).toBe(true);
  });

  it('should get a payment by id', async () => {
    expect(paymentId).toBeDefined();
    
    const response = await request(app)
      .get(`/payments/${paymentId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('payment');
    expect(response.body.payment.payment_id).toBe(paymentId);
  });

  it('should update a payment', async () => {
    expect(paymentId).toBeDefined();
    
    const updateData = {
      payment_method: 'debit_card',
      amount: "550.00"
    };

    const response = await request(app)
      .put(`/payments/${paymentId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Payment updated successfully');
    expect(response.body).toHaveProperty('payment');
    expect(response.body.payment.payment_method).toBe(updateData.payment_method);
  });

  it('should delete a payment', async () => {
    expect(paymentId).toBeDefined();
    
    const response = await request(app)
      .delete(`/payments/${paymentId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Payment deleted successfully');
  });
});