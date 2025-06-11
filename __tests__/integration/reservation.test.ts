import request from 'supertest';
import app from '../../src/index';
import db from '../../src/drizzle/db';
import { sql, eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { ReservationTable, CustomerTable, CarTable, UserTable, LocationTable } from '../../src/drizzle/schema';
import { TILocation, TIUser, TICar, TICustomer, TIReservation } from '../../src/types';

describe('Reservation Integration Tests', () => {
    let customerId: number;
    let carId: number;
    let reservationId: number;
    let authToken: string;

    const testAdmin: TIUser = {
        first_name: "Admin",
        last_name: "User",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
        is_verified: true
    };

    const testUser: TIUser = {
        first_name: "Test",
        last_name: "Customer",
        email: "customer@example.com",
        password: "password123",
        role: "customer",
        is_verified: true
    };

    const testCustomer: Omit<TICustomer, 'user_id'> = {
        phone_number: "+254712345678",
        address: "123 Test St"
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

    // Helper function to get valid dates
    const getValidDates = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        
        return {
            reservation_date: tomorrow.toISOString().split('T')[0],
            pickup_date: nextWeek.toISOString().split('T')[0]
        };
    };

    // Set up test data before all tests
    beforeAll(async () => {
        // Clean up existing data in reverse order of dependencies
        await db.delete(ReservationTable);
        await db.delete(CarTable);
        await db.delete(CustomerTable);
        await db.delete(UserTable);
        await db.delete(LocationTable);

        // Verify clean state
        const reservations = await db.select().from(ReservationTable);
        const cars = await db.select().from(CarTable);
        const customers = await db.select().from(CustomerTable);
        const users = await db.select().from(UserTable);
        const locations = await db.select().from(LocationTable);

        if (reservations.length > 0 || cars.length > 0 || customers.length > 0 ||
            users.length > 0 || locations.length > 0) {
            throw new Error('Database cleanup failed');
        }

        // Create location
        const locationResponse = await request(app)
            .post('/locations')
            .send(testLocation);
        
        if (!locationResponse.body.location || !locationResponse.body.location.location_id) {
            throw new Error('Failed to create location: ' + JSON.stringify(locationResponse.body));
        }
        let locationId = locationResponse.body.location.location_id;

        // Create admin user for test setup
        const adminPassword = await bcrypt.hash(testAdmin.password, 10);
        await db.insert(UserTable)
            .values({
                ...testAdmin,
                password: adminPassword,
                is_verified: true
            });

        // Get admin token
        const adminLoginResponse = await request(app)
            .post('/auth/login')
            .send({
                email: testAdmin.email,
                password: testAdmin.password
            });

        const adminToken = adminLoginResponse.body.token;

        // Create car using admin token
        const carResponse = await request(app)
            .post('/cars')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ ...testCar, location_id: locationId });

        if (!carResponse.body.car || !carResponse.body.car.car_id) {
            throw new Error('Failed to create car: ' + JSON.stringify(carResponse.body));
        }
        carId = carResponse.body.car.car_id;

        // Now create customer user for tests
        const customerPassword = await bcrypt.hash(testUser.password, 10);
        const userResult = await db.insert(UserTable)
            .values({
                ...testUser,
                password: customerPassword,
                is_verified: true
            })
            .returning();

        if (!userResult || userResult.length === 0) {
            throw new Error('Failed to create user');
        }

        const userId = userResult[0].user_id;

        // Then create customer
        const customerResult = await db.insert(CustomerTable)
            .values({
                ...testCustomer,
                user_id: userId
            })
            .returning();

        if (!customerResult || customerResult.length === 0) {
            throw new Error('Failed to create customer');
        }

        customerId = customerResult[0].customer_id;

        // Get auth token
        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        if (!loginResponse.body.token) {
            throw new Error('Login failed: ' + JSON.stringify(loginResponse.body));
        }

        authToken = loginResponse.body.token;

        // No need for authHeader variable since we use authToken directly in tests
    });

    // Clean up after all tests
    afterAll(async () => {
        // Clean up test data in reverse order of dependencies
        await db.delete(ReservationTable);
        await db.delete(CarTable);
        await db.delete(CustomerTable);
        await db.delete(UserTable);
        await db.delete(LocationTable);

        // Verify cleanup
        const reservations = await db.select().from(ReservationTable);
        const cars = await db.select().from(CarTable);
        const customers = await db.select().from(CustomerTable);
        const users = await db.select().from(UserTable);
        const locations = await db.select().from(LocationTable);

        if (reservations.length > 0 || cars.length > 0 || customers.length > 0 ||
            users.length > 0 || locations.length > 0) {
            throw new Error('Test cleanup failed');
        }
    });

    describe('POST /reservations', () => {
        it('should create a new reservation', async () => {
            const reservationData: TIReservation = {
                customer_id: customerId,
                car_id: carId,
                ...getValidDates()
            };

            const response = await request(app)
                .post('/reservations')
                .set('Authorization', `Bearer ${authToken}`)
                .send(reservationData);

            if (!response.body.reservation) {
                throw new Error('Failed to create reservation: ' + JSON.stringify(response.body));
            }

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Reservation created successfully');
            expect(response.body.reservation).toMatchObject({
                customer_id: customerId,
                car_id: carId,
                ...getValidDates()
            });
            reservationId = response.body.reservation.reservation_id;
        });

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/reservations')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    customer_id: customerId
                    // Missing car_id and dates
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing required fields: customer_id, car_id, reservation_date, pickup_date');
        });
    });

    describe('GET /reservations', () => {
        it('should get all reservations', async () => {
            const response = await request(app)
                .get('/reservations')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.reservations)).toBe(true);
            expect(response.body.reservations.length).toBeGreaterThan(0);
        });

        it('should get a specific reservation', async () => {
            const response = await request(app)
                .get(`/reservations/${reservationId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.reservation.reservation_id).toBe(reservationId);
        });

        it('should get customer reservations', async () => {
            const response = await request(app)
                .get(`/customers/${customerId}/reservations`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.reservations)).toBe(true);
            expect(response.body.reservations.length).toBeGreaterThan(0);
        });
    });

    describe('PUT /reservations/:id', () => {
        it('should update a reservation', async () => {
            const dates = getValidDates();
            const updateData = {
                pickup_date: dates.pickup_date
            };

            const response = await request(app)
                .put(`/reservations/${reservationId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateData);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Reservation updated successfully');
            expect(response.body.reservation.pickup_date).toBe(dates.pickup_date);
        });
    });

    describe('POST /reservations/:id/complete', () => {
        it('should complete a reservation', async () => {
            const returnDate = new Date().toISOString().split('T')[0];
            
            const response = await request(app)
                .post(`/reservations/${reservationId}/complete`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ return_date: returnDate });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Reservation completed successfully');
            expect(response.body.reservation.return_date).toBe(returnDate);
        });
    });

    describe('DELETE /reservations/:id', () => {
        it('should cancel a reservation', async () => {
            const response = await request(app)
                .delete(`/reservations/${reservationId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Reservation cancelled successfully');
            expect(response.body.note).toBe('Car has been marked as available');
        });

        it('should return 404 for non-existent reservation', async () => {
            const response = await request(app)
                .delete('/reservations/999999')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Reservation not found');
        });
    });
});