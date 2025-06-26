import { Column, sql } from "drizzle-orm";
import db from "../drizzle/db";
import {  UserTable } from "../drizzle/schema";
import { TIUser } from "../types";

export const createAuthService = async (userData: TIUser) => {
    try {
        const userFields: TIUser = {
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            password: userData.password,
           
        };

        // Basic field validation
        if (!userFields.first_name || !userFields.last_name || !userFields.email || !userFields.password) {
            throw new Error('Missing required user fields');
        }

        // Password validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(userFields.password)) {
            throw new Error('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character');
        }

      

        // Create user first
        const newUser = await db.transaction(async (tx) => {
            const [createdUser] = await tx.insert(UserTable).values(userFields).returning();

        // If user role is customer, create customer record
        

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

// get all users  from db

export const getAllUsersService = async () => {
    const users = await db.query.UserTable.findMany({
        columns: {
            user_id: true,
            first_name: true,
            last_name: true,
            email: true,
            role: true,
            is_verified: true
        }
       
    });

    

    return users;
    
}

// update role to either admin or user
export const updateUserRoleService = async (userId: number, role: string) =>
{
    const [updatedUser] = await db.update(UserTable)
        .set({ role })
        .where(sql`${UserTable.user_id}=${userId}`)
        .returning();
    return updatedUser;
}
