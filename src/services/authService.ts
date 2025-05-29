import { Column, sql } from "drizzle-orm";
import db from "../drizzle/db";
import { CustomerTable, UserTable } from "../drizzle/schema";
import { TIUser, TIUserWithCustomer } from "../types";

export const createAuthService = async (userData: TIUserWithCustomer) => {
    // Create user first
    const newUser = await db.transaction(async (tx) => {
       
        const { phone_number, address, ...userFields } = userData;

        
        const [createdUser] = await tx.insert(UserTable).values(userFields).returning();

        // If user role is customer, create customer record
        if (createdUser.role === "customer") {
            await tx.insert(CustomerTable).values({
                user_id: createdUser.user_id,
                phone_number: phone_number || '',
                address: address || ''
            });

            // Get full user data including customer info
            const fullUser = await db.query.UserTable.findFirst({
                columns: {
                    user_id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    password: true,
                    role: true
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
                where: sql`${UserTable.user_id}=${createdUser.user_id}`
            });
            return fullUser;
        }

        return createdUser;
    });

    return newUser;
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
            role: true
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
