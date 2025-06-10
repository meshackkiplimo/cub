import { sql } from "drizzle-orm";
import db from "../drizzle/db";
import { CustomerTable } from "../drizzle/schema";
import { TICustomer } from "../types";

export const createCustomerService = async (customer: TICustomer) => {
    // Check if customer already exists for this user
    const existingCustomer = await db.query.CustomerTable.findFirst({
        where: sql`${CustomerTable.user_id}=${customer.user_id}`
    });

    if (existingCustomer) {
        return null; // Customer profile already exists
    }

    // Create new customer profile
    const newCustomer = await db.insert(CustomerTable).values(customer).returning({
        customer_id: CustomerTable.customer_id,
        user_id: CustomerTable.user_id,
        phone_number: CustomerTable.phone_number,
        address: CustomerTable.address
    });
    return newCustomer[0];
}

export const getCustomerService = async (customerId: number) => {
    return await db.query.CustomerTable.findFirst({
        columns: {
            customer_id: true,
            user_id: true,
            phone_number: true,
            address: true
        },
        with: {
            user: {
                columns: {
                    first_name: true,
                    last_name: true,
                    email: true,
                    role: true
                }
            }
        },
        where: sql`${CustomerTable.customer_id}=${customerId}`
    });
}

export const getAllCustomersService = async () => {
    return await db.query.CustomerTable.findMany({
        columns: {
            customer_id: true,
            user_id: true,
            phone_number: true,
            address: true
        },
        with: {
            user: {
                columns: {
                    first_name: true,
                    last_name: true,
                    email: true,
                    role: true
                }
            }
        }
    });
}

export const updateCustomerService = async (customerId: number, customer: Partial<TICustomer>) => {
    // Check if customer exists
    const existingCustomer = await db.query.CustomerTable.findFirst({
        where: sql`${CustomerTable.customer_id}=${customerId}`
    });

    if (!existingCustomer) {
        return null;
    }

    const updatedCustomer = await db.update(CustomerTable)
        .set(customer)
        .where(sql`${CustomerTable.customer_id}=${customerId}`)
        .returning({
            customer_id: CustomerTable.customer_id,
            user_id: CustomerTable.user_id,
            phone_number: CustomerTable.phone_number,
            address: CustomerTable.address
        });
    return updatedCustomer[0];
}

export const deleteCustomerService = async (customerId: number) => {
    return await db.delete(CustomerTable)
        .where(sql`${CustomerTable.customer_id}=${customerId}`)
        .returning({
            customer_id: CustomerTable.customer_id,
            user_id: CustomerTable.user_id,
            phone_number: CustomerTable.phone_number,
            address: CustomerTable.address
        });
}

// Helper to check if a customer profile exists for a user
export const checkCustomerExists = async (userId: number): Promise<boolean> => {
    const customer = await db.query.CustomerTable.findFirst({
        where: sql`${CustomerTable.user_id}=${userId}`
    });
    return !!customer;
}