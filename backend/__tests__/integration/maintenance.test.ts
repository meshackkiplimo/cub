import request from 'supertest';
import app from '../../src/index';
import db from '../../src/drizzle/db';
import { sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { MaintenanceTable, CarTable, UserTable, LocationTable } from '../../src/drizzle/schema';
import { TIUser, TIMaintenance, TILocation, TICar } from '../../src/types';

describe('Maintenance Integration Tests', () => {
    let maintenanceId: number;
    let carId: number;
    let authToken: string;
    let locationId: number;

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

    beforeAll(async () => {
        // Clean up existing data
        await db.delete(MaintenanceTable);
        await db.delete(CarTable);
        await db.delete(UserTable);
        await db.delete(LocationTable);

        // Create admin and get token
        const adminPassword = await bcrypt.hash(testAdmin.password, 10);
        await db.insert(UserTable)
            .values({
                ...testAdmin,
                password: adminPassword,
            });

        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                email: testAdmin.email,
                password: testAdmin.password
            });
        authToken = loginResponse.body.token;

        // Create test location
        const locationResponse = await request(app)
            .post('/locations')
            .set('Authorization', `Bearer ${authToken}`)
            .send(testLocation);
        locationId = locationResponse.body.location.location_id;

        // Create test car
        const carResponse = await request(app)
            .post('/cars')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ ...testCar, location_id: locationId });
        carId = carResponse.body.car.car_id;
    });

    afterAll(async () => {
        await db.delete(MaintenanceTable);
        await db.delete(CarTable);
        await db.delete(UserTable);
        await db.delete(LocationTable);
    });

    describe('Maintenance Management', () => {
        // 1. Create maintenance record
        describe('Create Maintenance', () => {
            it('should create a maintenance record', async () => {
                const maintenanceData: TIMaintenance = {
                    car_id: carId,
                    maintenance_date: new Date().toISOString().split('T')[0],
                    description: 'Regular maintenance check',
                    cost: '150.00'
                };

                const response = await request(app)
                    .post('/maintenance')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(maintenanceData);

                expect(response.status).toBe(201);
                expect(response.body.message).toBe('Maintenance record created successfully');
                expect(response.body.maintenance).toBeDefined();
                maintenanceId = response.body.maintenance.maintenance_id;
            });

            it('should validate required fields', async () => {
                const response = await request(app)
                    .post('/maintenance')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        car_id: carId,
                        // Missing other required fields
                    });

                expect(response.status).toBe(400);
                expect(response.body.message).toBe('Maintenance record creation failed');
            });

            it('should validate cost format', async () => {
                const response = await request(app)
                    .post('/maintenance')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        car_id: carId,
                        maintenance_date: new Date().toISOString().split('T')[0],
                        description: 'Test maintenance',
                        cost: 'invalid-cost'
                    });

                expect(response.status).toBe(400);
                expect(response.body.message).toBe('Maintenance record creation failed');
            });
        });

        // 2. Get maintenance records
        describe('Get Maintenance', () => {
            it('should get all maintenance records', async () => {
                const response = await request(app)
                    .get('/maintenance')
                    .set('Authorization', `Bearer ${authToken}`);

                expect(response.status).toBe(200);
                expect(Array.isArray(response.body.maintenance)).toBe(true);
                expect(response.body.maintenance.length).toBeGreaterThan(0);
            });

            it('should get specific maintenance record', async () => {
                const response = await request(app)
                    .get(`/maintenance/${maintenanceId}`)
                    .set('Authorization', `Bearer ${authToken}`);

                expect(response.status).toBe(200);
                expect(response.body.maintenance.maintenance_id).toBe(maintenanceId);
            });

            it('should handle non-existent maintenance record', async () => {
                const response = await request(app)
                    .get('/maintenance/999999')
                    .set('Authorization', `Bearer ${authToken}`);

                expect(response.status).toBe(404);
                expect(response.body.message).toBe('Maintenance record not found');
            });

            it('should get car maintenance history', async () => {
                const response = await request(app)
                    .get(`/maintenance/car/${carId}`)
                    .set('Authorization', `Bearer ${authToken}`);

                expect(response.status).toBe(200);
                expect(Array.isArray(response.body.maintenanceHistory)).toBe(true);
                expect(response.body.maintenanceHistory.length).toBeGreaterThan(0);
            });

            it('should handle empty car maintenance history', async () => {
                const response = await request(app)
                    .get('/maintenance/car/999999')
                    .set('Authorization', `Bearer ${authToken}`);

                expect(response.status).toBe(404);
                expect(response.body.message).toBe('No maintenance records found for this car');
            });
        });

        // 3. Update maintenance record
        describe('Update Maintenance', () => {
            it('should update maintenance record', async () => {
                const updateData = {
                    description: 'Updated maintenance description',
                    cost: '200.00'
                };

                const response = await request(app)
                    .put(`/maintenance/${maintenanceId}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(updateData);

                expect(response.status).toBe(200);
                expect(response.body.message).toBe('Maintenance record updated successfully');
                expect(response.body.maintenance.description).toBe(updateData.description);
                expect(response.body.maintenance.cost).toBe(updateData.cost);
            });

            it('should validate update data', async () => {
                const response = await request(app)
                    .put(`/maintenance/${maintenanceId}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        cost: 'invalid-cost'
                    });

                expect(response.status).toBe(400);
                expect(response.body.message).toBe('Maintenance record update failed');
            });

            it('should handle non-existent record update', async () => {
                const response = await request(app)
                    .put('/maintenance/999999')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        description: 'Test update'
                    });

                expect(response.status).toBe(404);
                expect(response.body.message).toBe('Maintenance record not found');
            });
        });

        // 4. Delete maintenance record
        describe('Delete Maintenance', () => {
            it('should delete maintenance record', async () => {
                const response = await request(app)
                    .delete(`/maintenance/${maintenanceId}`)
                    .set('Authorization', `Bearer ${authToken}`);

                expect(response.status).toBe(200);
                expect(response.body.message).toBe('Maintenance record deleted successfully');
            });

            it('should handle non-existent record deletion', async () => {
                const response = await request(app)
                    .delete('/maintenance/999999')
                    .set('Authorization', `Bearer ${authToken}`);

                expect(response.status).toBe(404);
                expect(response.body.message).toBe('Maintenance record not found');
            });
        });
    });
});