import { sql } from "drizzle-orm";
import db from "../drizzle/db";
import { CustomerTable } from "../drizzle/schema";
import { TICustomer } from "../types";

export const createCustomerService = async (customer: TICustomer) => {
    const newCustomer = await db.insert(CustomerTable).values(customer).returning({
        customer_id: CustomerTable.customer_id,
        first_name: CustomerTable.first_name,
        last_name: CustomerTable.last_name,
        email: CustomerTable.email,
        phone_number: CustomerTable.phone_number,
        address: CustomerTable.address
    });
    return newCustomer[0];
}

export const getCustomerService = async (customerId: number) => {
    return await db.query.CustomerTable.findFirst({
        columns: {
            customer_id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone_number: true,
            address: true
        },
        where: sql`${CustomerTable.customer_id}=${customerId}`
    });
}

export const getAllCustomersService = async () => {
    return await db.query.CustomerTable.findMany({
        columns: {
            customer_id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone_number: true,
            address: true
        }
    });
}

export const updateCustomerService = async (customerId: number, customer: Partial<TICustomer>) => {
    const updatedCustomer = await db.update(CustomerTable)
        .set(customer)
        .where(sql`${CustomerTable.customer_id}=${customerId}`)
        .returning({
            customer_id: CustomerTable.customer_id,
            first_name: CustomerTable.first_name,
            last_name: CustomerTable.last_name,
            email: CustomerTable.email,
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
            first_name: CustomerTable.first_name,
            last_name: CustomerTable.last_name,
            email: CustomerTable.email,
            phone_number: CustomerTable.phone_number,
            address: CustomerTable.address
        });
}