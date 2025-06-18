import { sql } from 'drizzle-orm';
import db from '../../src/drizzle/db';
import { CustomerTable } from '../../src/drizzle/schema';
import { 
    createCustomerService, 
    getCustomerService, 
    getAllCustomersService,
    updateCustomerService,
    deleteCustomerService 
} from '../../src/services/customerService';

// Mock the database
jest.mock('../../src/drizzle/db', () => ({
    insert: jest.fn(),
    query: {
        CustomerTable: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
        }
    },
    update: jest.fn(),
    delete: jest.fn()
}));

describe('Customer Management', () => {
    const mockCustomer = {
        customer_id: 1,
        user_id: 1,
        phone_number: '1234567890',
        address: '123 Test St'
    };

    const mockCustomerWithUser = {
        ...mockCustomer,
        user: {
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            role: 'customer'
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Customer Creation', () => {
        describe('Valid Customer Data', () => {
            it('should successfully create a new customer', async () => {
                (db.query.CustomerTable.findFirst as jest.Mock)
                    .mockResolvedValue(null);

                (db.insert as jest.Mock).mockReturnValue({
                    values: jest.fn().mockReturnThis(),
                    returning: jest.fn().mockResolvedValue([mockCustomer])
                });

                const result = await createCustomerService(mockCustomer);
                expect(db.insert).toHaveBeenCalledWith(CustomerTable);
                expect(result).toEqual(mockCustomer);
            });

            it('should return null if customer already exists', async () => {
                (db.query.CustomerTable.findFirst as jest.Mock)
                    .mockResolvedValue(mockCustomer);

                const result = await createCustomerService(mockCustomer);
                expect(result).toBeNull();
            });
        });

        describe('Invalid Customer Data', () => {
            it('should handle database errors during creation', async () => {
                (db.query.CustomerTable.findFirst as jest.Mock)
                    .mockResolvedValue(null);

                (db.insert as jest.Mock).mockReturnValue({
                    values: jest.fn().mockReturnThis(),
                    returning: jest.fn().mockRejectedValue(new Error('Database error'))
                });

                await expect(createCustomerService(mockCustomer))
                    .rejects
                    .toThrow('Database error');
            });
        });
    });

    describe('Customer Retrieval', () => {
        describe('Single Customer', () => {
            it('should retrieve customer with valid ID', async () => {
                (db.query.CustomerTable.findFirst as jest.Mock)
                    .mockResolvedValue(mockCustomerWithUser);

                const result = await getCustomerService(1);
                expect(db.query.CustomerTable.findFirst).toHaveBeenCalled();
                expect(result).toEqual(mockCustomerWithUser);
            });

            it('should return null for non-existent ID', async () => {
                (db.query.CustomerTable.findFirst as jest.Mock)
                    .mockResolvedValue(null);

                const result = await getCustomerService(999);
                expect(result).toBeNull();
            });
        });

        describe('All Customers', () => {
            it('should retrieve list of all customers', async () => {
                const mockCustomers = [mockCustomerWithUser];
                (db.query.CustomerTable.findMany as jest.Mock)
                    .mockResolvedValue(mockCustomers);

                const result = await getAllCustomersService();
                expect(db.query.CustomerTable.findMany).toHaveBeenCalled();
                expect(result).toEqual(mockCustomers);
            });

            it('should return empty list when no customers exist', async () => {
                (db.query.CustomerTable.findMany as jest.Mock)
                    .mockResolvedValue([]);

                const result = await getAllCustomersService();
                expect(result).toEqual([]);
            });
        });
    });

    describe('Customer Updates', () => {
        const updateData = {
            phone_number: '0987654321',
            address: '456 Update St'
        };

        describe('Valid Updates', () => {
            it('should successfully update existing customer', async () => {
                const updatedCustomer = { ...mockCustomer, ...updateData };
                
                // Mock the existence check
                (db.query.CustomerTable.findFirst as jest.Mock)
                    .mockResolvedValue(mockCustomer);

                (db.update as jest.Mock).mockReturnValue({
                    set: jest.fn().mockReturnThis(),
                    where: jest.fn().mockReturnThis(),
                    returning: jest.fn().mockResolvedValue([updatedCustomer])
                });

                const result = await updateCustomerService(1, updateData);
                expect(db.update).toHaveBeenCalledWith(CustomerTable);
                expect(result).toEqual(updatedCustomer);
            });

            it('should return null when updating non-existent customer', async () => {
                // Mock customer not found
                (db.query.CustomerTable.findFirst as jest.Mock)
                    .mockResolvedValue(null);

                const result = await updateCustomerService(1, updateData);
                expect(result).toBeNull();
                // Update should not be called if customer doesn't exist
                expect(db.update).not.toHaveBeenCalled();
            });
        });

        describe('Invalid Updates', () => {
            it('should handle database errors during update', async () => {
                // Mock customer exists
                (db.query.CustomerTable.findFirst as jest.Mock)
                    .mockResolvedValue(mockCustomer);

                (db.update as jest.Mock).mockReturnValue({
                    set: jest.fn().mockReturnThis(),
                    where: jest.fn().mockReturnThis(),
                    returning: jest.fn().mockRejectedValue(new Error('Update failed'))
                });

                await expect(updateCustomerService(1, updateData))
                    .rejects
                    .toThrow('Update failed');
            });
        });
    });

    describe('Customer Deletion', () => {
        describe('Valid Deletion', () => {
            it('should successfully delete existing customer', async () => {
                (db.delete as jest.Mock).mockReturnValue({
                    where: jest.fn().mockReturnThis(),
                    returning: jest.fn().mockResolvedValue([mockCustomer])
                });

                const result = await deleteCustomerService(1);
                expect(db.delete).toHaveBeenCalledWith(CustomerTable);
                expect(result).toEqual([mockCustomer]);
            });
        });

        describe('Invalid Deletion', () => {
            it('should handle database errors during deletion', async () => {
                (db.delete as jest.Mock).mockReturnValue({
                    where: jest.fn().mockReturnThis(),
                    returning: jest.fn().mockRejectedValue(new Error('Delete failed'))
                });

                await expect(deleteCustomerService(1))
                    .rejects
                    .toThrow('Delete failed');
            });
        });
    });
});