import { sql } from 'drizzle-orm';
import db from '../../src/drizzle/db';
import { UserTable } from '../../src/drizzle/schema';
import { TIUser, TIUserWithCustomer } from '../../src/types';
import { 
    loginAuthService,
    createAuthService,
    updateVerificationStatus
} from '../../src/services/authService';

// Mock the database
jest.mock('../../src/drizzle/db', () => ({
    query: {
        UserTable: {
            findFirst: jest.fn()
        }
    },
    insert: jest.fn(),
    update: jest.fn(),
    transaction: jest.fn()
}));

describe('Authentication Service', () => {
    const mockUser = {
        user_id: 1,
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: 'hashedpassword123',
        role: 'customer' as const,
        is_verified: true
    };

    const mockCustomer = {
        customer_id: 1,
        user_id: 1,
        phone_number: '1234567890',
        address: '123 Test St'
    };

    const mockUserWithCustomer = {
        ...mockUser,
        customer: mockCustomer
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Login', () => {
        it('should find user by email with customer details', async () => {
            (db.query.UserTable.findFirst as jest.Mock).mockResolvedValue(mockUserWithCustomer);

            const result = await loginAuthService({
                email: 'test@example.com',
                password: 'password123',
                first_name: '',
                last_name: '',
                role: 'customer'
            });

            expect(result).toEqual(mockUserWithCustomer);
            expect(db.query.UserTable.findFirst).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.any(Object)
            }));
        });

        it('should return null for non-existent user', async () => {
            (db.query.UserTable.findFirst as jest.Mock).mockResolvedValue(null);

            const result = await loginAuthService({
                email: 'nonexistent@example.com',
                password: 'password123',
                first_name: '',
                last_name: '',
                role: 'customer'
            });

            expect(result).toBeNull();
        });
    });

    describe('Registration', () => {
        const newUserData: TIUserWithCustomer = {
            first_name: 'New',
            last_name: 'User',
            email: 'new@example.com',
            password: 'password123',
            role: 'customer',
            phone_number: '9876543210',
            address: '456 New St'
        };

        it('should create new user with customer details', async () => {
            const mockTransaction = jest.fn().mockImplementation(async (callback) => {
                return callback(db);
            });
            (db.transaction as jest.Mock).mockImplementation(mockTransaction);

            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnThis(),
                returning: jest.fn().mockResolvedValue([mockUser])
            });

            (db.query.UserTable.findFirst as jest.Mock).mockResolvedValue(mockUserWithCustomer);

            const result = await createAuthService(newUserData);

            expect(result).toEqual(mockUserWithCustomer);
            expect(db.transaction).toHaveBeenCalled();
            expect(db.insert).toHaveBeenCalledWith(UserTable);
        });
    });

    describe('Email Verification', () => {
        it('should update user verification status', async () => {
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                returning: jest.fn().mockResolvedValue([{
                    ...mockUser,
                    is_verified: true
                }])
            });

            const result = await updateVerificationStatus('test@example.com', true);

            expect(result.is_verified).toBe(true);
            expect(db.update).toHaveBeenCalledWith(UserTable);
        });
    });
});