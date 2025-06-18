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

    beforeAll(async () => {
        // Clean up existing data
        await db.delete(PaymentTable);
        await db.delete(BookingTable);
        await db.delete(CarTable);
        await db.delete(CustomerTable);
        await db.delete(UserTable);
        await db.delete(LocationTable);

        // Create admin and get token
        const adminPassword = await bcrypt.hash(testAdmin.password, 10);
        const [adminUser] = await db.insert(UserTable)
            .values({
                ...testAdmin,
                password: adminPassword,
            })
            .returning();

        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                email: testAdmin.email,
                password: testAdmin.password
            });
        authToken = loginResponse.body.token;

        // Create test location and car
        const locationResponse = await request(app)
            .post('/locations')
            .set('Authorization', `Bearer ${authToken}`)
            .send(testLocation);
        const locationId = locationResponse.body.location.location_id;

        const carResponse = await request(app)
            .post('/cars')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ ...testCar, location_id: locationId });
        carId = carResponse.body.car.car_id;

        // Create test customer and booking
        const customerResponse = await request(app)
            .post('/customers')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ ...testCustomer, user_id: adminUser.user_id });
        customerId = customerResponse.body.customer.customer_id;

        const bookingData: TIBooking = {
            customer_id: customerId,
            car_id: carId,
            rental_start_date: new Date().toISOString().split('T')[0],
            rental_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            total_amount: "500.00",
            status: "pending"
        };

        const bookingResponse = await request(app)
            .post('/bookings')
            .set('Authorization', `Bearer ${authToken}`)
            .send(bookingData);
        bookingId = bookingResponse.body.booking.booking_id;
    });

    afterAll(async () => {
        await db.delete(PaymentTable);
        await db.delete(BookingTable);
        await db.delete(CarTable);
        await db.delete(CustomerTable);
        await db.delete(UserTable);
        await db.delete(LocationTable);
    });

    describe('Payment Management', () => {
        // 1. Create successful payment
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
            expect(response.body.payment).toBeDefined();
            paymentId = response.body.payment.payment_id;
        });

        // 2. Test missing required fields
        describe('Required Fields Validation', () => {
            it('should validate booking_id', async () => {
                const response = await request(app)
                    .post('/payments')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        payment_date: new Date().toISOString().split('T')[0],
                        amount: "500.00",
                        payment_method: "card"
                    });

                expect(response.status).toBe(400);
                expect(response.body.message).toBe('Payment creation failed');
                expect(response.body.details).toContain('Required fields');
            });

            it('should validate payment_date', async () => {
                const response = await request(app)
                    .post('/payments')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        booking_id: bookingId,
                        amount: "500.00",
                        payment_method: "card"
                    });

                expect(response.status).toBe(400);
                expect(response.body.details).toContain('Required fields');
            });

            it('should validate amount', async () => {
                const response = await request(app)
                    .post('/payments')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        booking_id: bookingId,
                        payment_date: new Date().toISOString().split('T')[0],
                        payment_method: "card"
                    });

                expect(response.status).toBe(400);
                expect(response.body.details).toContain('Required fields');
            });
        });

        // 3. Test invalid data formats
        describe('Data Format Validation', () => {
            it('should validate amount format', async () => {
                const response = await request(app)
                    .post('/payments')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        booking_id: bookingId,
                        payment_date: new Date().toISOString().split('T')[0],
                        amount: "invalid-amount",
                        payment_method: "card"
                    });

                expect(response.status).toBe(400);
                expect(response.body.details).toBe('Invalid amount format');
            });

            it('should validate payment method', async () => {
                const response = await request(app)
                    .post('/payments')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        booking_id: bookingId,
                        payment_date: new Date().toISOString().split('T')[0],
                        amount: "500.00",
                        payment_method: "invalid-method"
                    });

                expect(response.status).toBe(400);
                expect(response.body.details).toContain('Invalid payment method');
            });
        });

        // 4. Test retrieval operations
        describe('Payment Retrieval', () => {
            it('should get all payments', async () => {
                const response = await request(app)
                    .get('/payments')
                    .set('Authorization', `Bearer ${authToken}`);

                expect(response.status).toBe(200);
                expect(Array.isArray(response.body.payments)).toBe(true);
            });

            it('should get specific payment with booking details', async () => {
                const response = await request(app)
                    .get(`/payments/${paymentId}`)
                    .set('Authorization', `Bearer ${authToken}`);

                expect(response.status).toBe(200);
                expect(response.body.payment.payment_id).toBe(paymentId);
                expect(response.body.payment.booking).toBeDefined();
            });

            it('should handle non-existent payment', async () => {
                const response = await request(app)
                    .get('/payments/999999')
                    .set('Authorization', `Bearer ${authToken}`);

                expect(response.status).toBe(404);
                expect(response.body.message).toBe('Payment not found');
            });
        });

        // 5. Test update operations
        describe('Payment Updates', () => {
            it('should update payment method', async () => {
                const response = await request(app)
                    .put(`/payments/${paymentId}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({ payment_method: "cash" });

                expect(response.status).toBe(200);
                expect(response.body.payment.payment_method).toBe('cash');
            });

            it('should validate update data', async () => {
                const response = await request(app)
                    .put(`/payments/${paymentId}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({ amount: "invalid-amount" });

                expect(response.status).toBe(400);
                expect(response.body.message).toBe('Invalid payment data');
            });

            it('should handle non-existent payment update', async () => {
                const response = await request(app)
                    .put('/payments/999999')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({ payment_method: "cash" });

                expect(response.status).toBe(404);
                expect(response.body.message).toBe('Payment not found');
            });
        });

        // 6. Test deletion operations
        describe('Payment Deletion', () => {
            it('should delete payment', async () => {
                const response = await request(app)
                    .delete(`/payments/${paymentId}`)
                    .set('Authorization', `Bearer ${authToken}`);

                expect(response.status).toBe(200);
                expect(response.body.message).toBe('Payment deleted successfully');
            });

            it('should handle non-existent payment deletion', async () => {
                const response = await request(app)
                    .delete('/payments/999999')
                    .set('Authorization', `Bearer ${authToken}`);

                expect(response.status).toBe(404);
                expect(response.body.message).toBe('Payment not found');
            });
        });
    });
});