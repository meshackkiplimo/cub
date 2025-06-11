import { sql } from 'drizzle-orm';
import db from '../../src/drizzle/db';
import { MaintenanceTable } from '../../src/drizzle/schema';
import { TIMaintenance } from '../../src/types';
import {
    createMaintenanceService,
    getMaintenanceService,
    getAllMaintenanceService,
    updateMaintenanceService,
    deleteMaintenanceService,
    getCarMaintenanceHistory
} from '../../src/services/maintenanceService';

// Mock the database
jest.mock('../../src/drizzle/db', () => ({
    query: {
        MaintenanceTable: {
            findFirst: jest.fn(),
            findMany: jest.fn()
        }
    },
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
}));

describe('Maintenance Service', () => {
    const mockMaintenance = {
        maintenance_id: 1,
        car_id: 1,
        maintenance_date: '2025-01-01',
        description: 'Regular service and oil change',
        cost: '150.00'
    };

    const mockMaintenanceWithDetails = {
        ...mockMaintenance,
        car: {
            make: 'Toyota',
            model: 'Camry',
            year: '2024',
            color: 'Blue',
            location: {
                location_name: 'Downtown Branch',
                address: '123 Main St',
                contact_number: '1234567890'
            }
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Create Maintenance', () => {
        it('should create maintenance record successfully', async () => {
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnThis(),
                returning: jest.fn().mockResolvedValue([mockMaintenance])
            });

            const newMaintenance: TIMaintenance = {
                car_id: 1,
                maintenance_date: '2025-01-01',
                description: 'Regular service and oil change',
                cost: '150.00'
            };

            const result = await createMaintenanceService(newMaintenance);
            
            expect(db.insert).toHaveBeenCalledWith(MaintenanceTable);
            expect(result).toEqual(mockMaintenance);
        });
    });

    describe('Get Maintenance', () => {
        it('should get maintenance by ID with car and location details', async () => {
            (db.query.MaintenanceTable.findFirst as jest.Mock)
                .mockResolvedValue(mockMaintenanceWithDetails);

            const result = await getMaintenanceService(1);

            expect(result).toEqual(mockMaintenanceWithDetails);
            expect(db.query.MaintenanceTable.findFirst).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.any(Object)
                })
            );
        });

        it('should return null for non-existent maintenance record', async () => {
            (db.query.MaintenanceTable.findFirst as jest.Mock).mockResolvedValue(null);

            const result = await getMaintenanceService(999);
            expect(result).toBeNull();
        });
    });

    describe('Get All Maintenance', () => {
        it('should retrieve all maintenance records with details', async () => {
            const mockRecords = [mockMaintenanceWithDetails];
            (db.query.MaintenanceTable.findMany as jest.Mock)
                .mockResolvedValue(mockRecords);

            const result = await getAllMaintenanceService();

            expect(result).toEqual(mockRecords);
            expect(db.query.MaintenanceTable.findMany).toHaveBeenCalled();
        });

        it('should return empty array when no records exist', async () => {
            (db.query.MaintenanceTable.findMany as jest.Mock)
                .mockResolvedValue([]);

            const result = await getAllMaintenanceService();
            expect(result).toEqual([]);
        });
    });

    describe('Update Maintenance', () => {
        it('should update maintenance record successfully', async () => {
            const updateData = {
                description: 'Updated service description',
                cost: '200.00'
            };

            const updatedMaintenance = { ...mockMaintenance, ...updateData };

            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                returning: jest.fn().mockResolvedValue([updatedMaintenance])
            });

            const result = await updateMaintenanceService(1, updateData);

            expect(db.update).toHaveBeenCalledWith(MaintenanceTable);
            expect(result).toEqual(updatedMaintenance);
        });
    });

    describe('Delete Maintenance', () => {
        it('should delete maintenance record successfully', async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnThis(),
                returning: jest.fn().mockResolvedValue([mockMaintenance])
            });

            const result = await deleteMaintenanceService(1);

            expect(db.delete).toHaveBeenCalledWith(MaintenanceTable);
            expect(result[0]).toEqual(mockMaintenance);
        });
    });

    describe('Get Car Maintenance History', () => {
        it('should get maintenance history for a specific car', async () => {
            const mockHistory = [
                {
                    ...mockMaintenanceWithDetails,
                    maintenance_date: '2025-01-01'
                },
                {
                    ...mockMaintenanceWithDetails,
                    maintenance_id: 2,
                    maintenance_date: '2024-12-01'
                }
            ];

            (db.query.MaintenanceTable.findMany as jest.Mock)
                .mockResolvedValue(mockHistory);

            const result = await getCarMaintenanceHistory(1);

            expect(result).toEqual(mockHistory);
            expect(db.query.MaintenanceTable.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.any(Object),
                    orderBy: expect.any(Object)
                })
            );
        });

        it('should return empty array for car with no maintenance history', async () => {
            (db.query.MaintenanceTable.findMany as jest.Mock)
                .mockResolvedValue([]);

            const result = await getCarMaintenanceHistory(999);
            expect(result).toEqual([]);
        });
    });
});