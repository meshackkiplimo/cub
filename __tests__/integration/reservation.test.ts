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

    // Set up test data before all tests
    beforeAll(async () => {
        try {
            // Clean up existing data in reverse order of dependencies
            await db.delete(ReservationTable);
            await db.delete(CarTable);
            await db.delete(CustomerTable);
            await db.delete(UserTable);
            await db.delete(LocationTable);

            // Verify clean state
            const existingData = await Promise.all([
                db.select().from(ReservationTable),
                db.select().from(CarTable),
                db.select().from(CustomerTable),
                db.select().from(UserTable),
                db.select().from(LocationTable)
            ]);

            if (existingData.some(data => data.length > 0)) {
                throw new Error('Database cleanup failed');
            }
        } catch (error) {
            console.error('Error during test setup cleanup:', error);
            throw error;
        }

        let locationId: number;
        let adminToken: string;

        // Step 1: Create location
        try {
            const locationResponse = await request(app)
                .post('/locations')
                .send(testLocation);
            
            if (!locationResponse.body.location?.location_id) {
                throw new Error('Failed to create location: ' + JSON.stringify(locationResponse.body));
            }
            locationId = locationResponse.body.location.location_id;
        } catch (error) {
            console.error('Location creation failed:', error);
            throw error;
        }

        // Step 2: Create and authenticate admin user
        try {
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

            if (!adminLoginResponse.body.token) {
                throw new Error('Admin login failed: ' + JSON.stringify(adminLoginResponse.body));
            }
            adminToken = adminLoginResponse.body.token;
        } catch (error) {
            console.error('Admin setup failed:', error);
            throw error;
        }

        // Step 3: Create test car
        try {
            const carResponse = await request(app)
                .post('/cars')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ ...testCar, location_id: locationId });

            if (!carResponse.body.car?.car_id) {
                throw new Error('Failed to create car: ' + JSON.stringify(carResponse.body));
            }
            carId = carResponse.body.car.car_id;
        } catch (error) {
            console.error('Car creation failed:', error);
            throw error;
        }

        // Step 4: Create customer user and get auth token
        try {
            // Create user
            const customerPassword = await bcrypt.hash(testUser.password, 10);
            const userResult = await db.insert(UserTable)
                .values({
                    ...testUser,
                    password: customerPassword,
                    is_verified: true
                })
                .returning();

            if (!userResult?.[0]?.user_id) {
                throw new Error('Failed to create user');
            }

            // Create customer
            const customerResult = await db.insert(CustomerTable)
                .values({
                    ...testCustomer,
                    user_id: userResult[0].user_id
                })
                .returning();

            if (!customerResult?.[0]?.customer_id) {
                throw new Error('Failed to create customer');
            }
            customerId = customerResult[0].customer_id;

            // Get customer auth token
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
        } catch (error) {
            console.error('Customer setup failed:', error);
            throw error;
        }
    });

    // Clean up after all tests
    afterAll(async () => {
        try {
            // Clean up test data in reverse order of dependencies
            await Promise.all([
                db.delete(ReservationTable),
                db.delete(CarTable),
                db.delete(CustomerTable),
                db.delete(UserTable),
                db.delete(LocationTable)
            ]);

            // Verify cleanup
            const remainingData = await Promise.all([
                db.select().from(ReservationTable),
                db.select().from(CarTable),
                db.select().from(CustomerTable),
                db.select().from(UserTable),
                db.select().from(LocationTable)
            ]);

            if (remainingData.some(data => data.length > 0)) {
                throw new Error('Test cleanup failed');
            }
        } catch (error) {
            console.error('Error during test cleanup:', error);
            throw error;
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
            
            const dates = getValidDates();
            expect(response.body.reservation).toMatchObject({
                customer_id: customerId,
                car_id: carId,
                reservation_date: dates.reservation_date,
                pickup_date: dates.pickup_date
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

        it('should return 400 for invalid dates', async () => {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 1);
            
            const reservationData = {
                customer_id: customerId,
                car_id: carId,
                reservation_date: pastDate.toISOString().split('T')[0],
                pickup_date: getValidDates().pickup_date
            };

            const response = await request(app)
                .post('/reservations')
                .set('Authorization', `Bearer ${authToken}`)
                .send(reservationData);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Reservation date cannot be in the past');
        });

        it('should return 400 if pickup date is before reservation date', async () => {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            const reservationData = {
                customer_id: customerId,
                car_id: carId,
                reservation_date: tomorrow.toISOString().split('T')[0],
                pickup_date: today.toISOString().split('T')[0]
            };

            const response = await request(app)
                .post('/reservations')
                .set('Authorization', `Bearer ${authToken}`)
                .send(reservationData);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Pickup date must be after reservation date');
        });

        it('should return 400 if car is not available', async () => {
            // First create a reservation to make car unavailable
            const firstReservation = await request(app)
                .post('/reservations')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    customer_id: customerId,
                    car_id: carId,
                    ...getValidDates()
                });

            expect(firstReservation.status).toBe(201);

            // Try to reserve the same car
            const response = await request(app)
                .post('/reservations')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    customer_id: customerId,
                    car_id: carId,
                    ...getValidDates()
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Car is not available for reservation');
        });

        it('should return 404 when updating non-existent reservation', async () => {
            const response = await request(app)
                .put('/reservations/999999')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ pickup_date: getValidDates().pickup_date });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Reservation not found');
        });

        it('should return 400 when updating with past date', async () => {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 1);

            const response = await request(app)
                .put(`/reservations/${reservationId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ pickup_date: pastDate.toISOString().split('T')[0] });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Pickup date cannot be in the past');
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

        it('should return empty array for customer with no reservations', async () => {
            const response = await request(app)
                .get(`/customers/999999/reservations`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.reservations)).toBe(true);
            expect(response.body.reservations.length).toBe(0);
        });
    });

    describe('PUT /reservations/:id', () => {
        it('should update a reservation', async () => {
            // Get future date for update
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 14); // Two weeks from now
            const newPickupDate = futureDate.toISOString().split('T')[0];

            const response = await request(app)
                .put(`/reservations/${reservationId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ pickup_date: newPickupDate });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Reservation updated successfully');
            expect(response.body.reservation.pickup_date).toBe(newPickupDate);
        });
    });

    describe('POST /reservations/:id/complete', () => {
        it('should return 400 if return date is missing', async () => {
            const response = await request(app)
                .post(`/reservations/${reservationId}/complete`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Return date is required');
        });

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