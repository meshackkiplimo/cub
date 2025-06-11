import { sql } from 'drizzle-orm';
import db from '../../src/drizzle/db';
import { BookingTable } from '../../src/drizzle/schema';
import { 
    createBookingService,
    getBookingService,
    getAllBookingsService,
    updateBookingService,
    deleteBookingService
} from '../../src/services/bookingService';

// Mock the database
jest.mock('../../src/drizzle/db', () => ({
    insert: jest.fn(),
    query: {
        BookingTable: {
            findFirst: jest.fn(),
            findMany: jest.fn()
        }
    },
    update: jest.fn(),
    delete: jest.fn()
}));

describe('Booking Management', () => {
    const mockBooking = {
        booking_id: 1,
        customer_id: 1,
        car_id: 1,
        rental_start_date: '2025-01-01',
        rental_end_date: '2025-01-07',
        total_amount: '700.00'
    };

    const mockBookingWithDetails = {
        ...mockBooking,
        customer: {
            customer_id: 1,
            phone_number: '1234567890',
            address: '123 Test St',
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

    describe('Create Booking', () => {
        describe('Valid Booking', () => {
            it('should create a new booking successfully', async () => {
                (db.insert as jest.Mock).mockReturnValue({
                    values: jest.fn().mockReturnThis(),
                    returning: jest.fn().mockResolvedValue([mockBooking])
                });

                const result = await createBookingService(mockBooking);
                expect(db.insert).toHaveBeenCalledWith(BookingTable);
                expect(result).toEqual(mockBooking);
            });
        });

        describe('Invalid Booking', () => {
            it('should handle database errors during creation', async () => {
                (db.insert as jest.Mock).mockReturnValue({
                    values: jest.fn().mockReturnThis(),
                    returning: jest.fn().mockRejectedValue(new Error('Database error'))
                });

                await expect(createBookingService(mockBooking))
                    .rejects
                    .toThrow('Database error');
            });
        });
    });

    describe('Retrieve Booking', () => {
        describe('Single Booking', () => {
            it('should get booking by ID with full details', async () => {
                (db.query.BookingTable.findFirst as jest.Mock)
                    .mockResolvedValue(mockBookingWithDetails);

                const result = await getBookingService(1);
                expect(result).toEqual(mockBookingWithDetails);
            });

            it('should return null for non-existent booking', async () => {
                (db.query.BookingTable.findFirst as jest.Mock)
                    .mockResolvedValue(null);

                const result = await getBookingService(999);
                expect(result).toBeNull();
            });
        });

        describe('All Bookings', () => {
            it('should retrieve all bookings with details', async () => {
                const mockBookings = [mockBookingWithDetails];
                (db.query.BookingTable.findMany as jest.Mock)
                    .mockResolvedValue(mockBookings);

                const result = await getAllBookingsService();
                expect(result).toEqual(mockBookings);
            });

            it('should return empty array when no bookings exist', async () => {
                (db.query.BookingTable.findMany as jest.Mock)
                    .mockResolvedValue([]);

                const result = await getAllBookingsService();
                expect(result).toEqual([]);
            });
        });
    });

    describe('Update Booking', () => {
        const updateData = {
            rental_end_date: '2025-01-10',
            total_amount: '900.00'
        };

        describe('Valid Updates', () => {
            it('should update booking successfully', async () => {
                const updatedBooking = { ...mockBooking, ...updateData };
                (db.update as jest.Mock).mockReturnValue({
                    set: jest.fn().mockReturnThis(),
                    where: jest.fn().mockReturnThis(),
                    returning: jest.fn().mockResolvedValue([updatedBooking])
                });

                const result = await updateBookingService(1, updateData);
                expect(db.update).toHaveBeenCalledWith(BookingTable);
                expect(result).toEqual(updatedBooking);
            });
        });

        describe('Invalid Updates', () => {
            it('should handle non-existent booking update', async () => {
                (db.update as jest.Mock).mockReturnValue({
                    set: jest.fn().mockReturnThis(),
                    where: jest.fn().mockReturnThis(),
                    returning: jest.fn().mockRejectedValue(new Error('Update failed'))
                });

                await expect(updateBookingService(1, updateData))
                    .rejects
                    .toThrow('Update failed');
            });
        });
    });

    describe('Delete Booking', () => {
        describe('Valid Deletion', () => {
            it('should delete booking successfully', async () => {
                (db.delete as jest.Mock).mockReturnValue({
                    where: jest.fn().mockReturnThis(),
                    returning: jest.fn().mockResolvedValue([mockBooking])
                });

                const result = await deleteBookingService(1);
                expect(db.delete).toHaveBeenCalledWith(BookingTable);
                expect(result).toEqual(mockBooking);
            });
        });

        describe('Invalid Deletion', () => {
            it('should handle non-existent booking deletion', async () => {
                (db.delete as jest.Mock).mockReturnValue({
                    where: jest.fn().mockReturnThis(),
                    returning: jest.fn().mockRejectedValue(new Error('Delete failed'))
                });

                await expect(deleteBookingService(1))
                    .rejects
                    .toThrow('Delete failed');
            });
        });
    });
});