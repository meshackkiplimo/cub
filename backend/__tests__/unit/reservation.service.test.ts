import { sql } from 'drizzle-orm';
import db from '../../src/drizzle/db';
import { ReservationTable, CarTable } from '../../src/drizzle/schema';
import {
    createReservationService,
    getReservationService,
    getAllReservationsService,
    getCustomerReservationsService,
    updateReservationService,
    completeReservationService,
    deleteReservationService
} from '../../src/services/reservationService';

// Mock the database
jest.mock('../../src/drizzle/db', () => ({
    query: {
        ReservationTable: {
            findFirst: jest.fn(),
            findMany: jest.fn()
        },
        CarTable: {
            findFirst: jest.fn()
        }
    },
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    transaction: jest.fn()
}));

describe('Reservation Management', () => {
    const mockReservation = {
        reservation_id: 1,
        customer_id: 1,
        car_id: 1,
        reservation_date: '2025-01-01',
        pickup_date: '2025-01-15',
        return_date: '2025-01-22'
    };

    const mockReservationWithDetails = {
        ...mockReservation,
        customer: {
            customer_id: 1,
            user_id: 1,
            phone_number: '1234567890',
            user: {
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com'
            }
        },
        car: {
            manufacturer: 'Toyota',
            car_model: 'Camry',
            year: 2024,
            color: 'Blue',
            rental_rate: '100.00'
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Create Reservation', () => {
        describe('Car Availability Check', () => {
            it('should create reservation when car is available', async () => {
                // Mock car availability check
                (db.query.CarTable.findFirst as jest.Mock)
                    .mockResolvedValue({ availability: true });

                // Mock transaction
                (db.transaction as jest.Mock).mockImplementation(callback =>
                    callback({
                        insert: jest.fn().mockReturnValue({
                            values: jest.fn().mockReturnThis(),
                            returning: jest.fn().mockResolvedValue([mockReservation])
                        }),
                        update: jest.fn().mockReturnValue({
                            set: jest.fn().mockReturnThis(),
                            where: jest.fn().mockReturnThis()
                        })
                    })
                );

                const result = await createReservationService(mockReservation);
                expect(result).toEqual(mockReservation);
            });

            it('should reject when car is not available', async () => {
                (db.query.CarTable.findFirst as jest.Mock)
                    .mockResolvedValue({ availability: false });

                await expect(createReservationService(mockReservation))
                    .rejects
                    .toThrow('Car is not available for reservation');
            });

           
        });
    });

    describe('Retrieve Reservation', () => {
        describe('Single Reservation', () => {
            it('should get reservation by ID with details', async () => {
                (db.query.ReservationTable.findFirst as jest.Mock)
                    .mockResolvedValue(mockReservationWithDetails);

                const result = await getReservationService(1);
                expect(result).toEqual(mockReservationWithDetails);
            });

            it('should return null for non-existent reservation', async () => {
                (db.query.ReservationTable.findFirst as jest.Mock)
                    .mockResolvedValue(null);

                const result = await getReservationService(999);
                expect(result).toBeNull();
            });
        });

        describe('All Reservations', () => {
            it('should retrieve all reservations with details', async () => {
                const mockReservations = [mockReservationWithDetails];
                (db.query.ReservationTable.findMany as jest.Mock)
                    .mockResolvedValue(mockReservations);

                const result = await getAllReservationsService();
                expect(result).toEqual(mockReservations);
            });
        });

        describe('Customer Reservations', () => {
            it('should retrieve customer specific reservations', async () => {
                const mockCustomerReservations = [mockReservationWithDetails];
                (db.query.ReservationTable.findMany as jest.Mock)
                    .mockResolvedValue(mockCustomerReservations);

                const result = await getCustomerReservationsService(1);
                expect(result).toEqual(mockCustomerReservations);
            });
        });
    });

    describe('Update Reservation', () => {
        const updateData = {
            pickup_date: '2025-01-16'
        };

        describe('Valid Updates', () => {
            it('should update reservation successfully', async () => {
                const updatedReservation = { ...mockReservation, ...updateData };
                (db.update as jest.Mock).mockReturnValue({
                    set: jest.fn().mockReturnThis(),
                    where: jest.fn().mockReturnThis(),
                    returning: jest.fn().mockResolvedValue([updatedReservation])
                });

                const result = await updateReservationService(1, updateData);
                expect(result).toEqual(updatedReservation);
            });
        });
    });

    describe('Complete Reservation', () => {
        describe('Valid Completion', () => {
            it('should complete reservation and update car availability', async () => {
                // Mock getting reservation
                (db.query.ReservationTable.findFirst as jest.Mock)
                    .mockResolvedValue(mockReservation);

                // Mock transaction
                (db.transaction as jest.Mock).mockImplementation(callback =>
                    callback({
                        update: jest.fn().mockReturnValue({
                            set: jest.fn().mockReturnThis(),
                            where: jest.fn().mockReturnThis(),
                            returning: jest.fn().mockResolvedValue([{ ...mockReservation, return_date: '2025-01-22' }])
                        })
                    })
                );

                const result = await completeReservationService(1, '2025-01-22');
                expect(result.return_date).toBe('2025-01-22');
            });
        });

        describe('Invalid Completion', () => {
            it('should reject when reservation does not exist', async () => {
                (db.query.ReservationTable.findFirst as jest.Mock)
                    .mockResolvedValue(null);

                await expect(completeReservationService(999, '2025-01-22'))
                    .rejects
                    .toThrow('Reservation not found');
            });
        });
    });

    describe('Delete Reservation', () => {
        describe('Valid Deletion', () => {
            it('should delete reservation and update car availability', async () => {
                // Mock getting reservation
                (db.query.ReservationTable.findFirst as jest.Mock)
                    .mockResolvedValue(mockReservation);

                // Mock transaction
                (db.transaction as jest.Mock).mockImplementation(callback =>
                    callback({
                        delete: jest.fn().mockReturnValue({
                            where: jest.fn().mockReturnThis(),
                            returning: jest.fn().mockResolvedValue([mockReservation])
                        }),
                        update: jest.fn().mockReturnValue({
                            set: jest.fn().mockReturnThis(),
                            where: jest.fn().mockReturnThis()
                        })
                    })
                );

                const result = await deleteReservationService(1);
                expect(result).toEqual(mockReservation);
            });
        });

        describe('Invalid Deletion', () => {
            it('should reject when reservation does not exist', async () => {
                (db.query.ReservationTable.findFirst as jest.Mock)
                    .mockResolvedValue(null);

                await expect(deleteReservationService(999))
                    .rejects
                    .toThrow('Reservation not found');
            });
        });
    });
});