import { sql } from 'drizzle-orm';
import db from '../../src/drizzle/db';
import { LocationTable, CarTable } from '../../src/drizzle/schema';
import { TILocation } from '../../src/types';
import {
    createLocationService,
    getLocationService,
    getAllLocationsService,
    getLocationAvailableCarsService,
    updateLocationService,
    deleteLocationService
} from '../../src/services/locationService';

// Mock the database
jest.mock('../../src/drizzle/db', () => ({
    query: {
        LocationTable: {
            findFirst: jest.fn(),
            findMany: jest.fn()
        }
    },
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
}));

describe('Location Service', () => {
    const mockLocation = {
        location_id: 1,
        location_name: 'Downtown Branch',
        address: '123 Main St',
        contact_number: '1234567890'
    };

    const mockCar = {
        car_id: 1,
        make: 'Toyota',
        model: 'Camry',
        year: '2024',
        color: 'Blue',
        availability: true,
        rental_rate: '100.00'
    };

    const mockLocationWithCars = {
        ...mockLocation,
        cars: [mockCar]
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Create Location', () => {
        it('should create location successfully', async () => {
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnThis(),
                returning: jest.fn().mockResolvedValue([mockLocation])
            });

            const newLocation: TILocation = {
                location_name: 'Downtown Branch',
                address: '123 Main St',
                contact_number: '1234567890'
            };

            const result = await createLocationService(newLocation);
            
            expect(db.insert).toHaveBeenCalledWith(LocationTable);
            expect(result).toEqual(mockLocation);
        });
    });

    describe('Get Location', () => {
        it('should get location by ID with cars', async () => {
            (db.query.LocationTable.findFirst as jest.Mock)
                .mockResolvedValue(mockLocationWithCars);

            const result = await getLocationService(1);

            expect(result).toEqual(mockLocationWithCars);
            expect(db.query.LocationTable.findFirst).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.any(Object)
                })
            );
        });

        it('should return null for non-existent location', async () => {
            (db.query.LocationTable.findFirst as jest.Mock).mockResolvedValue(null);

            const result = await getLocationService(999);
            expect(result).toBeNull();
        });
    });

    describe('Get All Locations', () => {
        it('should retrieve all locations with basic car details', async () => {
            const mockLocations = [mockLocationWithCars];
            (db.query.LocationTable.findMany as jest.Mock)
                .mockResolvedValue(mockLocations);

            const result = await getAllLocationsService();

            expect(result).toEqual(mockLocations);
            expect(db.query.LocationTable.findMany).toHaveBeenCalled();
        });

        it('should return empty array when no locations exist', async () => {
            (db.query.LocationTable.findMany as jest.Mock)
                .mockResolvedValue([]);

            const result = await getAllLocationsService();
            expect(result).toEqual([]);
        });
    });

    describe('Get Location Available Cars', () => {
        it('should get location with only available cars', async () => {
            const locationWithAvailableCars = {
                ...mockLocation,
                cars: [mockCar]  // mockCar has availability: true
            };

            (db.query.LocationTable.findFirst as jest.Mock)
                .mockResolvedValue(locationWithAvailableCars);

            const result = await getLocationAvailableCarsService(1);

            expect(result).toEqual(locationWithAvailableCars);
            expect(db.query.LocationTable.findFirst).toHaveBeenCalledWith(
                expect.objectContaining({
                    with: expect.objectContaining({
                        cars: expect.objectContaining({
                            where: expect.any(Object)
                        })
                    })
                })
            );
        });
    });

    describe('Update Location', () => {
        it('should update location successfully', async () => {
            const updateData = {
                contact_number: '0987654321'
            };

            const updatedLocation = { ...mockLocation, ...updateData };

            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                returning: jest.fn().mockResolvedValue([updatedLocation])
            });

            const result = await updateLocationService(1, updateData);

            expect(db.update).toHaveBeenCalledWith(LocationTable);
            expect(result).toEqual(updatedLocation);
        });
    });

    describe('Delete Location', () => {
        it('should delete location with no cars', async () => {
            const locationWithNoCars = { ...mockLocation, cars: [] };
            
            (db.query.LocationTable.findFirst as jest.Mock)
                .mockResolvedValueOnce(locationWithNoCars);

            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnThis(),
                returning: jest.fn().mockResolvedValue([mockLocation])
            });

            const result = await deleteLocationService(1);

            expect(db.delete).toHaveBeenCalledWith(LocationTable);
            expect(result[0]).toEqual(mockLocation);
        });

        it('should throw error when deleting location with cars', async () => {
            (db.query.LocationTable.findFirst as jest.Mock)
                .mockResolvedValueOnce(mockLocationWithCars);

            await expect(deleteLocationService(1))
                .rejects
                .toThrow('Cannot delete location with assigned cars');
        });
    });
});