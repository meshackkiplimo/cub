import { Column, sql } from "drizzle-orm";
import db from "../drizzle/db";
import { CustomerTable } from "../drizzle/schema";
import { TIUser } from "../types";





export const createAuthService = async (user:TIUser) =>{
    const newUser = await db.insert(CustomerTable).values(user).returning();
    return newUser[0];

}

export const loginAuthService  = async (user:TIUser) => {
    const {email} = user;
    return await db.query.CustomerTable.findFirst({
        columns:{
            customer_id: true,
            first_name: true,
            last_name: true,
            email: true,
            password: true,
            phone_number: true,
            address: true

        },
        where:sql `${CustomerTable.email}=${email}`
        }

    )
}



    
