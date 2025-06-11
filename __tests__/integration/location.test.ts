import request from 'supertest';
import app from '../../src/index';
import db from '../../src/drizzle/db';
import { LocationTable, CarTable } from '../../src/drizzle/schema';
import { TILocation } from '../../src/types';

describe('Location Integration Tests', () => {
    const testLocation: TILocation = {
        location_name: 'Test Location',
        address: '123 Test Street',
        contact_number: '+254712345678'
    };

    let locationId: number;

    // Clear database and set up test data before each test
    beforeAll(async () => {
        // First delete cars since they reference locations
        await db.delete(CarTable);
        // Then delete locations
        await db.delete(LocationTable);
    });

    afterAll(async () => {
        // Cleanup after all tests
        await db.delete(CarTable);
        await db.delete(LocationTable);
    });

    describe('POST /locations', () => {
        it('should create a new location', async () => {
            const response = await request(app)
                .post('/locations')
                .send(testLocation);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Location created successfully');
            expect(response.body.location).toMatchObject(testLocation);
            expect(response.body.location.location_id).toBeDefined();
            locationId = response.body.location.location_id;
        });

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/locations')
                .send({
                    location_name: 'Test Location'
                    // Missing address and contact_number
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('All fields are required: location_name, address, contact_number');
        });
    });

    describe('GET /locations', () => {
        // Create test data before GET tests
        beforeEach(async () => {
            // Clear previous test data
            await db.delete(CarTable);
            await db.delete(LocationTable);
            
            // Create fresh test location
            const response = await request(app)
                .post('/locations')
                .send(testLocation);
            locationId = response.body.location.location_id;
        });

        it('should get all locations', async () => {
            const response = await request(app)
                .get('/locations');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.locations)).toBe(true);
            expect(response.body.locations.length).toBeGreaterThan(0);
            const location = response.body.locations[0];
            expect(location).toMatchObject(testLocation);
            expect(location).toHaveProperty('cars');
            expect(Array.isArray(location.cars)).toBe(true);
        });

        it('should get a specific location', async () => {
            const response = await request(app)
                .get(`/locations/${locationId}`);

            expect(response.status).toBe(200);
            const location = response.body.location;
            expect(location).toMatchObject({
                location_name: testLocation.location_name,
                address: testLocation.address,
                contact_number: testLocation.contact_number
            });
            expect(location).toHaveProperty('cars');
            expect(Array.isArray(location.cars)).toBe(true);
        });

        it('should return 404 for non-existent location', async () => {
            const response = await request(app)
                .get('/locations/999999');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Location not found');
        });
    });

    describe('GET /locations/:id/available-cars', () => {
        beforeEach(async () => {
            // Clear previous test data
            await db.delete(CarTable);
            await db.delete(LocationTable);
            
            // Create fresh test location
            const response = await request(app)
                .post('/locations')
                .send(testLocation);
            locationId = response.body.location.location_id;
        });

        it('should get available cars for a location', async () => {
            const response = await request(app)
                .get(`/locations/${locationId}/available-cars`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('location_name');
            expect(response.body).toHaveProperty('address');
            expect(response.body).toHaveProperty('available_cars');
            expect(response.body).toHaveProperty('total_available');
            expect(Array.isArray(response.body.available_cars)).toBe(true);
        });
    });

    describe('PUT /locations/:id', () => {
        beforeEach(async () => {
            // Clear previous test data
            await db.delete(CarTable);
            await db.delete(LocationTable);
            
            // Create fresh test location
            const response = await request(app)
                .post('/locations')
                .send(testLocation);
            locationId = response.body.location.location_id;
        });

        it('should update a location', async () => {
            const updatedData = {
                location_name: 'Updated Location',
                address: '456 Updated Street',
                contact_number: '+254787654321'
            };

            const response = await request(app)
                .put(`/locations/${locationId}`)
                .send(updatedData);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Location updated successfully');
            expect(response.body.location).toMatchObject({
                location_name: updatedData.location_name,
                address: updatedData.address,
                contact_number: updatedData.contact_number
            });
        });

        it('should allow partial updates', async () => {
            const partialUpdate = {
                location_name: 'Partially Updated Location'
            };

            const response = await request(app)
                .put(`/locations/${locationId}`)
                .send(partialUpdate);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Location updated successfully');
            const updatedLocation = response.body.location;
            expect(updatedLocation.location_name).toBe(partialUpdate.location_name);
            // Original fields should remain unchanged
            expect(updatedLocation.address).toBe(testLocation.address);
            expect(updatedLocation.contact_number).toBe(testLocation.contact_number);
        });
    });

    describe('DELETE /locations/:id', () => {
        beforeEach(async () => {
            // Clear previous test data
            await db.delete(CarTable);
            await db.delete(LocationTable);
            
            // Create fresh test location
            const response = await request(app)
                .post('/locations')
                .send(testLocation);
            locationId = response.body.location.location_id;
        });

        it('should delete a location without cars', async () => {
            const response = await request(app)
                .delete(`/locations/${locationId}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Location deleted successfully');
        });

        it('should return 404 for non-existent location', async () => {
            const response = await request(app)
                .delete('/locations/999999');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Location not found');
        });
    });
});