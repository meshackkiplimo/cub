import { Column, sql } from "drizzle-orm";
import db from "../drizzle/db";
import { CustomerTable, UserTable } from "../drizzle/schema";
import { TIUser, TIUserWithCustomer } from "../types";

export const createAuthService = async (userData: TIUserWithCustomer) => {
    try {
        const { phone_number, address, ...userFields } = userData;

        // Basic field validation
        if (!userFields.first_name || !userFields.last_name || !userFields.email || !userFields.password) {
            throw new Error('Missing required user fields');
        }

        // Password validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(userFields.password)) {
            throw new Error('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character');
        }

        // Validate customer fields if role is customer
        if (userFields.role === 'customer' && (!phone_number || !address)) {
            throw new Error('Missing required customer fields');
        }

        // Create user first
        const newUser = await db.transaction(async (tx) => {
            const [createdUser] = await tx.insert(UserTable).values(userFields).returning();

        // If user role is customer, create customer record
        if (createdUser.role === "customer") {
            await tx.insert(CustomerTable).values({
                user_id: createdUser.user_id,
                phone_number: phone_number || '0000000000', // Provide a default if missing
                address: address || 'No address provided'    // Provide a default if missing
            }).returning();

            return createdUser;
        }

            if (createdUser.role === "customer") {
                await tx.insert(CustomerTable).values({
                    user_id: createdUser.user_id,
                    phone_number: phone_number || '0000000000',
                    address: address || 'No address provided'
                }).returning();
            }

            return createdUser;
        });

        return newUser;
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Missing required user fields' ||
                error.message === 'Missing required customer fields') {
                throw error;
            }
        }
        // Re-throw any other errors
        throw new Error('Database error');
    }
}

export const loginAuthService = async (user: TIUser) => {
    const { email } = user;
    const result = await db.query.UserTable.findFirst({
        columns: {
            user_id: true,
            first_name: true,
            last_name: true,
            email: true,
            password: true,
            role: true,
            is_verified: true
        },
        with: {
            customer: {
                columns: {
                    customer_id: true,
                    phone_number: true,
                    address: true
                }
            }
        },
        where: sql`${UserTable.email}=${email}`
    });

    return result;
}

export const updateVerificationStatus = async (email: string, isVerified: boolean) => {
    const [updatedUser] = await db.update(UserTable)
        .set({ is_verified: isVerified })
        .where(sql`${UserTable.email}=${email}`)
        .returning();
    return updatedUser;
}
