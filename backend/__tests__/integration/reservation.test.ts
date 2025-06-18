import request from 'supertest';
import app from '../../src/index';
import db from '../../src/drizzle/db';
import { sql } from 'drizzle-orm';
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
    const getValidDates = (() => {
        const dates = {
            reservation_date: '',
            pickup_date: ''
        };

        // Set the dates once to ensure consistency
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        
        dates.reservation_date = tomorrow.toISOString().split('T')[0];
        dates.pickup_date = nextWeek.toISOString().split('T')[0];

        return () => ({ ...dates });
    })();

    beforeAll(async () => {
        // Clean up existing data
        await db.delete(ReservationTable);
        await db.delete(CarTable);
        await db.delete(CustomerTable);
        await db.delete(UserTable);
        await db.delete(LocationTable);

        // Create test location
        const locationResponse = await request(app)
            .post('/locations')
            .send(testLocation);
        const locationId = locationResponse.body.location.location_id;

        // Create and authenticate admin user
        const adminPassword = await bcrypt.hash(testAdmin.password, 10);
        await db.insert(UserTable)
            .values({
                ...testAdmin,
                password: adminPassword,
                is_verified: true
            });

        const adminLoginResponse = await request(app)
            .post('/auth/login')
            .send({
                email: testAdmin.email,
                password: testAdmin.password
            });
        const adminToken = adminLoginResponse.body.token;

        // Create test car
        const carResponse = await request(app)
            .post('/cars')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ ...testCar, location_id: locationId });
        carId = carResponse.body.car.car_id;

        // Create customer user
        const customerPassword = await bcrypt.hash(testUser.password, 10);
        const userResult = await db.insert(UserTable)
            .values({
                ...testUser,
                password: customerPassword,
                is_verified: true
            })
            .returning();

        // Create customer
        const customerResult = await db.insert(CustomerTable)
            .values({
                ...testCustomer,
                user_id: userResult[0].user_id
            })
            .returning();
        customerId = customerResult[0].customer_id;

        // Get customer auth token
        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });
        authToken = loginResponse.body.token;
    });

    afterAll(async () => {
        // Clean up test data
        await db.delete(ReservationTable);
        await db.delete(CarTable);
        await db.delete(CustomerTable);
        await db.delete(UserTable);
        await db.delete(LocationTable);
    });

    describe('Reservation Management', () => {
        // 1. Create reservation
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

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Reservation created successfully');
            expect(response.body.reservation).toBeDefined();
            reservationId = response.body.reservation.reservation_id;
        });

        // 2. Validate required fields
        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/reservations')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ customer_id: customerId });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing required fields: customer_id, car_id, reservation_date, pickup_date');
        });

        // 3. Get all reservations
        it('should get all reservations', async () => {
            const response = await request(app)
                .get('/reservations')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.reservations)).toBe(true);
        });

        // 4. Get specific reservation
        it('should get a specific reservation', async () => {
            const response = await request(app)
                .get(`/reservations/${reservationId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.reservation.reservation_id).toBe(reservationId);
        });

        // 5. Update reservation
        it('should update a reservation', async () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 14);
            const newPickupDate = futureDate.toISOString().split('T')[0];

            const response = await request(app)
                .put(`/reservations/${reservationId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ pickup_date: newPickupDate });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Reservation updated successfully');
        });

        // 6. Complete reservation
        it('should complete a reservation', async () => {
            const returnDate = new Date().toISOString().split('T')[0];
            
            const response = await request(app)
                .post(`/reservations/${reservationId}/complete`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ return_date: returnDate });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Reservation completed successfully');
        });

        // 7. Cancel reservation
        it('should cancel a reservation', async () => {
            const response = await request(app)
                .delete(`/reservations/${reservationId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Reservation cancelled successfully');
        });
    });
});