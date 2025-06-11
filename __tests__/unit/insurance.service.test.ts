import { sql } from 'drizzle-orm';
import db from '../../src/drizzle/db';
import { InsuranceTable } from '../../src/drizzle/schema';
import { TIInsurance } from '../../src/types';
import {
    createInsuranceService,
    getInsuranceService,
    getAllInsurancesService,
    updateInsuranceService,
    deleteInsuranceService
} from '../../src/services/insuranceService';

// Mock the database
jest.mock('../../src/drizzle/db', () => ({
    query: {
        InsuranceTable: {
            findFirst: jest.fn(),
            findMany: jest.fn()
        }
    },
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
}));

describe('Insurance Service', () => {
    const mockInsurance = {
        insurance_id: 1,
        car_id: 1,
        provider: 'ABC Insurance',
        policy_number: 'POL-123456',
        start_date: '2025-01-01',
        end_date: '2025-12-31'
    };

    const mockInsuranceWithDetails = {
        ...mockInsurance,
        car: {
            make: 'Toyota',
            model: 'Camry',
            year: '2024',
            color: 'Blue',
            rental_rate: '100.00',
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

    describe('Create Insurance', () => {
        it('should create insurance record successfully', async () => {
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnThis(),
                returning: jest.fn().mockResolvedValue([mockInsurance])
            });

            const newInsurance: TIInsurance = {
                car_id: 1,
                provider: 'ABC Insurance',
                policy_number: 'POL-123456',
                start_date: '2025-01-01',
                end_date: '2025-12-31'
            };

            const result = await createInsuranceService(newInsurance);
            
            expect(db.insert).toHaveBeenCalledWith(InsuranceTable);
            expect(result).toEqual(mockInsurance);
        });
    });

    describe('Get Insurance', () => {
        it('should get insurance by ID with car and location details', async () => {
            (db.query.InsuranceTable.findFirst as jest.Mock)
                .mockResolvedValue(mockInsuranceWithDetails);

            const result = await getInsuranceService(1);

            expect(result).toEqual(mockInsuranceWithDetails);
            expect(db.query.InsuranceTable.findFirst).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.any(Object)
                })
            );
        });

        it('should return null for non-existent insurance record', async () => {
            (db.query.InsuranceTable.findFirst as jest.Mock).mockResolvedValue(null);

            const result = await getInsuranceService(999);
            expect(result).toBeNull();
        });
    });

    describe('Get All Insurances', () => {
        it('should retrieve all insurance records with details', async () => {
            const mockRecords = [mockInsuranceWithDetails];
            (db.query.InsuranceTable.findMany as jest.Mock)
                .mockResolvedValue(mockRecords);

            const result = await getAllInsurancesService();

            expect(result).toEqual(mockRecords);
            expect(db.query.InsuranceTable.findMany).toHaveBeenCalled();
        });

        it('should return empty array when no records exist', async () => {
            (db.query.InsuranceTable.findMany as jest.Mock)
                .mockResolvedValue([]);

            const result = await getAllInsurancesService();
            expect(result).toEqual([]);
        });
    });

    describe('Update Insurance', () => {
        it('should update insurance record successfully', async () => {
            const updateData = {
                provider: 'XYZ Insurance',
                policy_number: 'POL-789012'
            };

            const updatedInsurance = { ...mockInsurance, ...updateData };

            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                returning: jest.fn().mockResolvedValue([updatedInsurance])
            });

            const result = await updateInsuranceService(1, updateData);

            expect(db.update).toHaveBeenCalledWith(InsuranceTable);
            expect(result).toEqual(updatedInsurance);
        });
    });

    describe('Delete Insurance', () => {
        it('should delete insurance record successfully', async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnThis(),
                returning: jest.fn().mockResolvedValue([mockInsurance])
            });

            const result = await deleteInsuranceService(1);

            expect(db.delete).toHaveBeenCalledWith(InsuranceTable);
            expect(result[0]).toEqual(mockInsurance);
        });

        it('should return empty array when deleting non-existent record', async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnThis(),
                returning: jest.fn().mockResolvedValue([])
            });

            const result = await deleteInsuranceService(999);
            expect(result).toEqual([]);
        });
    });
});