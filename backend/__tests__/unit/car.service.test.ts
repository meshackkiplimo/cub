import { sql } from 'drizzle-orm';
import db from '../../src/drizzle/db';
import { CarTable } from '../../src/drizzle/schema';
import {
    createCarService,
    getCarService,
    getAllCarsService,
    updateCarService,
    deleteCarService
} from '../../src/services/carService';

// Mock the database
jest.mock('../../src/drizzle/db', () => ({
    insert: jest.fn(),
    query: {
        CarTable: {
            findFirst: jest.fn(),
            findMany: jest.fn()
        }
    },
    update: jest.fn(),
    delete: jest.fn()
}));

describe('Car Management', () => {
    const mockCar = {
        car_id: 1,
        make: 'Toyota',
        model: 'Camry',
        year: '2024',
        color: 'Blue',
        availability: true,
        rental_rate: '100.00',
        location_id: 1
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Create Car', () => {
        describe('Valid Car', () => {
            it('should create a new car successfully', async () => {
                (db.insert as jest.Mock).mockReturnValue({
                    values: jest.fn().mockReturnThis(),
                    returning: jest.fn().mockResolvedValue([mockCar])
                });

                const result = await createCarService(mockCar);
                expect(db.insert).toHaveBeenCalledWith(CarTable);
                expect(result).toEqual(mockCar);
            });
        });

        describe('Invalid Car', () => {
            it('should handle database errors during creation', async () => {
                (db.insert as jest.Mock).mockReturnValue({
                    values: jest.fn().mockReturnThis(),
                    returning: jest.fn().mockRejectedValue(new Error('Database error'))
                });

                await expect(createCarService(mockCar))
                    .rejects
                    .toThrow('Database error');
            });
        });
    });

    describe('Retrieve Car', () => {
        describe('Single Car', () => {
            it('should get car by ID', async () => {
                (db.query.CarTable.findFirst as jest.Mock)
                    .mockResolvedValue(mockCar);

                const result = await getCarService(1);
                expect(result).toEqual(mockCar);
            });

            it('should return null for non-existent car', async () => {
                (db.query.CarTable.findFirst as jest.Mock)
                    .mockResolvedValue(null);

                const result = await getCarService(999);
                expect(result).toBeNull();
            });
        });

        describe('All Cars', () => {
            it('should retrieve all cars', async () => {
                const mockCars = [mockCar];
                (db.query.CarTable.findMany as jest.Mock)
                    .mockResolvedValue(mockCars);

                const result = await getAllCarsService();
                expect(result).toEqual(mockCars);
            });

            it('should return empty array when no cars exist', async () => {
                (db.query.CarTable.findMany as jest.Mock)
                    .mockResolvedValue([]);

                const result = await getAllCarsService();
                expect(result).toEqual([]);
            });
        });
    });

    describe('Update Car', () => {
        const updateData = {
            color: 'Red',
            rental_rate: '120.00'
        };

        describe('Valid Updates', () => {
            it('should update car successfully', async () => {
                const updatedCar = { ...mockCar, ...updateData };
                (db.update as jest.Mock).mockReturnValue({
                    set: jest.fn().mockReturnThis(),
                    where: jest.fn().mockReturnThis(),
                    returning: jest.fn().mockResolvedValue([updatedCar])
                });

                const result = await updateCarService(1, updateData);
                expect(db.update).toHaveBeenCalledWith(CarTable);
                expect(result).toEqual(updatedCar);
            });
        });

        describe('Invalid Updates', () => {
            it('should handle non-existent car update', async () => {
                (db.update as jest.Mock).mockReturnValue({
                    set: jest.fn().mockReturnThis(),
                    where: jest.fn().mockReturnThis(),
                    returning: jest.fn().mockRejectedValue(new Error('Update failed'))
                });

                await expect(updateCarService(1, updateData))
                    .rejects
                    .toThrow('Update failed');
            });
        });
    });

    describe('Delete Car', () => {
        describe('Valid Deletion', () => {
            it('should delete car successfully', async () => {
                (db.delete as jest.Mock).mockReturnValue({
                    where: jest.fn().mockReturnThis(),
                    returning: jest.fn().mockResolvedValue([mockCar])
                });

                const result = await deleteCarService(1);
                expect(db.delete).toHaveBeenCalledWith(CarTable);
                expect(result[0]).toEqual(mockCar);
            });
        });

        describe('Invalid Deletion', () => {
            it('should handle non-existent car deletion', async () => {
                (db.delete as jest.Mock).mockReturnValue({
                    where: jest.fn().mockReturnThis(),
                    returning: jest.fn().mockRejectedValue(new Error('Delete failed'))
                });

                await expect(deleteCarService(1))
                    .rejects
                    .toThrow('Delete failed');
            });
        });
    });
});