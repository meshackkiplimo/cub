import { sql } from 'drizzle-orm';
import db from '../../src/drizzle/db';
import { PaymentTable } from '../../src/drizzle/schema';
import { TIPayment } from '../../src/types';
import {
    createPaymentService,
    getPaymentService,
    getAllPaymentsService,
    updatePaymentService,
    deletePaymentService
} from '../../src/services/paymentService';

// Mock the database
jest.mock('../../src/drizzle/db', () => ({
    query: {
        PaymentTable: {
            findFirst: jest.fn(),
            findMany: jest.fn()
        }
    },
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
}));

describe('Payment Service', () => {
    const mockPayment = {
        payment_id: 1,
        booking_id: 1,
        payment_date: '2025-01-01',
        amount: '1000.00',
        payment_method: 'credit_card'
    };

    const mockPaymentWithDetails = {
        ...mockPayment,
        booking: {
            booking_id: 1,
            rental_start_date: '2025-01-01',
            rental_end_date: '2025-01-07',
            total_amount: '1000.00',
            customer: {
                customer_id: 1,
                phone_number: '1234567890',
                user: {
                    first_name: 'John',
                    last_name: 'Doe',
                    email: 'john@example.com'
                }
            },
            car: {
                make: 'Toyota',
                model: 'Camry',
                year: '2024'
            }
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Create Payment', () => {
        it('should create payment successfully', async () => {
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnThis(),
                returning: jest.fn().mockResolvedValue([mockPayment])
            });

            const newPayment: TIPayment = {
                booking_id: 1,
                payment_date: '2025-01-01',
                amount: '1000.00',
                payment_method: 'credit_card'
            };

            const result = await createPaymentService(newPayment);
            
            expect(db.insert).toHaveBeenCalledWith(PaymentTable);
            expect(result).toEqual(mockPayment);
        });
    });

    describe('Get Payment', () => {
        it('should get payment by ID with booking details', async () => {
            (db.query.PaymentTable.findFirst as jest.Mock)
                .mockResolvedValue(mockPaymentWithDetails);

            const result = await getPaymentService(1);

            expect(result).toEqual(mockPaymentWithDetails);
            expect(db.query.PaymentTable.findFirst).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.any(Object)
                })
            );
        });

        it('should return null for non-existent payment', async () => {
            (db.query.PaymentTable.findFirst as jest.Mock).mockResolvedValue(null);

            const result = await getPaymentService(999);
            expect(result).toBeNull();
        });
    });

    describe('Get All Payments', () => {
        it('should retrieve all payments with booking details', async () => {
            const mockPayments = [mockPaymentWithDetails];
            (db.query.PaymentTable.findMany as jest.Mock)
                .mockResolvedValue(mockPayments);

            const result = await getAllPaymentsService();

            expect(result).toEqual(mockPayments);
            expect(db.query.PaymentTable.findMany).toHaveBeenCalled();
        });

        it('should return empty array when no payments exist', async () => {
            (db.query.PaymentTable.findMany as jest.Mock)
                .mockResolvedValue([]);

            const result = await getAllPaymentsService();
            expect(result).toEqual([]);
        });
    });

    describe('Update Payment', () => {
        it('should update payment successfully', async () => {
            const updateData = {
                payment_method: 'debit_card',
                amount: '1200.00'
            };

            const updatedPayment = { ...mockPayment, ...updateData };

            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                returning: jest.fn().mockResolvedValue([updatedPayment])
            });

            const result = await updatePaymentService(1, updateData);

            expect(db.update).toHaveBeenCalledWith(PaymentTable);
            expect(result).toEqual(updatedPayment);
        });
    });

    describe('Delete Payment', () => {
        it('should delete payment successfully', async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnThis(),
                returning: jest.fn().mockResolvedValue([mockPayment])
            });

            const result = await deletePaymentService(1);

            expect(db.delete).toHaveBeenCalledWith(PaymentTable);
            expect(result[0]).toEqual(mockPayment);
        });

        it('should handle non-existent payment deletion', async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnThis(),
                returning: jest.fn().mockResolvedValue([])
            });

            const result = await deletePaymentService(999);
            expect(result).toEqual([]);
        });
    });
});