import request from 'supertest';
import app from '../../src/index';
import db from '../../src/drizzle/db';
import { sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { PaymentTable, BookingTable, CustomerTable, CarTable, UserTable, LocationTable } from '../../src/drizzle/schema';
import { TIUser, TIBooking, TIPayment, TILocation, TICar, TICustomer } from '../../src/types';

describe('Payment Integration Tests', () => {
    let paymentId: number;
    let bookingId: number;
    let customerId: number;
    let carId: number;
    let authToken: string;

    const testAdmin: TIUser = {
        first_name: "Admin",
        last_name: "User",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
        is_verified: true
    };

    const testLocation: TILocation = {
        location_name: 'Test Location',
        address: '123 Test Street',
        contact_number: '+254712345678'
    };

    const testCar: Omit<TICar, 'location_id'> = {
        make: "Toyota",
        model: "Camry",
        year: "2022",
        color: "Black",
        rental_rate: "100.00",
        availability: true
    };

    const testCustomer: Omit<TICustomer, 'user_id'> = {
        phone_number: "+254712345678",
        address: "123 Test St"
    };

    // Helper function to get valid dates
    const getValidDates = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        
        return {
            start_date: tomorrow.toISOString().split('T')[0],
            end_date: nextWeek.toISOString().split('T')[0]
        };
    };

    // Set up test data before all tests
    beforeAll(async () => {
        // Clean up existing data
        await db.delete(PaymentTable);
        await db.delete(BookingTable);
        await db.delete(CarTable);
        await db.delete(CustomerTable);
        await db.delete(UserTable);
        await db.delete(LocationTable);

        // Create admin user
        const adminPassword = await bcrypt.hash(testAdmin.password, 10);
        const [adminUser] = await db.insert(UserTable)
            .values({
                ...testAdmin,
                password: adminPassword,
            })
            .returning();

        // Get admin token
        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                email: testAdmin.email,
                password: testAdmin.password
            });

        authToken = loginResponse.body.token;

        // Create location
        const locationResponse = await request(app)
            .post('/locations')
            .set('Authorization', `Bearer ${authToken}`)
            .send(testLocation);

        const locationId = locationResponse.body.location.location_id;

        // Create car
        const carResponse = await request(app)
            .post('/cars')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ ...testCar, location_id: locationId });

        carId = carResponse.body.car.car_id;

        // Create customer
        const customerResponse = await request(app)
            .post('/customers')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ ...testCustomer, user_id: adminUser.user_id });

        customerId = customerResponse.body.customer.customer_id;

        // Create booking
        const dates = getValidDates();
        const bookingData: TIBooking = {
            customer_id: customerId,
            car_id: carId,
            rental_start_date: dates.start_date,
            rental_end_date: dates.end_date,
            total_amount: "500.00",
            status: "pending"
        };

        const bookingResponse = await request(app)
            .post('/bookings')
            .set('Authorization', `Bearer ${authToken}`)
            .send(bookingData);

        bookingId = bookingResponse.body.booking.booking_id;
    });

    // Clean up after tests
    afterAll(async () => {
        await db.delete(PaymentTable);
        await db.delete(BookingTable);
        await db.delete(CarTable);
        await db.delete(CustomerTable);
        await db.delete(UserTable);
        await db.delete(LocationTable);
    });

    describe('POST /payments', () => {
        it('should create a new payment', async () => {
            const paymentData: TIPayment = {
                booking_id: bookingId,
                payment_date: new Date().toISOString().split('T')[0],
                amount: "500.00",
                payment_method: "card"
            };

            const response = await request(app)
                .post('/payments')
                .set('Authorization', `Bearer ${authToken}`)
                .send(paymentData);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Payment created successfully');
            expect(response.body.payment).toMatchObject({
                booking_id: bookingId,
                amount: "500.00",
                payment_method: "card"
            });
            paymentId = response.body.payment.payment_id;
        });

        it('should return 400 if any required field is missing', async () => {
            const response = await request(app)
                .post('/payments')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    booking_id: bookingId
                    // Missing other required fields
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Payment creation failed');
            expect(response.body.details).toBe('Required fields: booking_id, payment_date, amount, payment_method');
        });

        it('should return 400 for invalid payment amount format', async () => {
            const invalidPaymentData = {
                booking_id: bookingId,
                payment_date: new Date().toISOString().split('T')[0],
                amount: "invalid-amount",
                payment_method: "card"
            };

            const response = await request(app)
                .post('/payments')
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidPaymentData);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Payment creation failed');
            expect(response.body.details).toContain('Invalid amount format');
        });

        it('should return 400 for invalid payment method', async () => {
            const invalidPaymentData = {
                booking_id: bookingId,
                payment_date: new Date().toISOString().split('T')[0],
                amount: "500.00",
                payment_method: "invalid-method"
            };

            const response = await request(app)
                .post('/payments')
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidPaymentData);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Payment creation failed');
            expect(response.body.details).toContain('Invalid payment method');
        });
    });

    describe('GET /payments', () => {
        it('should get all payments', async () => {
            const response = await request(app)
                .get('/payments')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.payments)).toBe(true);
            expect(response.body.payments.length).toBeGreaterThan(0);
        });

        it('should get a specific payment', async () => {
            const response = await request(app)
                .get(`/payments/${paymentId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.payment.payment_id).toBe(paymentId);
            expect(response.body.payment.booking_id).toBe(bookingId);
            // Verify booking relationship data
            expect(response.body.payment.booking).toBeDefined();
            expect(response.body.payment.booking.booking_id).toBe(bookingId);
            expect(parseFloat(response.body.payment.booking.total_amount)).toBe(500.00);
        });

        it('should return 404 for non-existent payment', async () => {
            const response = await request(app)
                .get('/payments/999999')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Payment not found');
        });
    });

    describe('PUT /payments/:id', () => {
        it('should update a payment', async () => {
            const updateData = {
                payment_method: "cash"
            };

            const response = await request(app)
                .put(`/payments/${paymentId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateData);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Payment updated successfully');
            expect(response.body.payment.payment_method).toBe('cash');
        });

        it('should return 404 for non-existent payment', async () => {
            const response = await request(app)
                .put('/payments/999999')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ payment_method: "cash" });
            
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Payment not found');
        });

        it('should return 400 for invalid update data', async () => {
            const response = await request(app)
                .put(`/payments/${paymentId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ payment_method: "invalid-method" });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid payment data');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Payment not found');
        });
    });

    describe('DELETE /payments/:id', () => {
        it('should delete a payment', async () => {
            const response = await request(app)
                .delete(`/payments/${paymentId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Payment deleted successfully');
        });

        it('should return 404 for non-existent payment', async () => {
            const response = await request(app)
                .delete('/payments/999999')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Payment not found');
        });
    });
});