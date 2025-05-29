import { sql } from "drizzle-orm";
import db from "../drizzle/db";
import { InsuranceTable } from "../drizzle/schema";
import { TIInsurance } from "../types";







export const createInsuranceService = async (insurance:TIInsurance) => {
    const newInsurance = await db.insert(InsuranceTable).values(insurance).returning();
    return newInsurance[0];

    
}

export const getInsuranceService = async (insuranceId: number) => {
    return await db.query.InsuranceTable.findFirst({
        columns: {
            insurance_id: true,
            car_id: true,
            provider: true,
            policy_number: true,
            start_date: true,
            end_date: true
        },
        where: sql`${InsuranceTable.insurance_id}=${insuranceId}`
    });
}


export const getAllInsurancesService = async () => {
    return await db.query.InsuranceTable.findMany({
        columns: {
            insurance_id: true,
            car_id: true,
            provider: true,
            policy_number: true,
            start_date: true,
            end_date: true
        }
    });


}

export const updateInsuranceService = async (insuranceId: number, insurance: Partial<TIInsurance>) => {
    const updatedInsurance = await db.update(InsuranceTable)
        .set(insurance)
        .where(sql`${InsuranceTable.insurance_id}=${insuranceId}`)
        .returning();
    return updatedInsurance[0];
}

export const deleteInsuranceService = async (insuranceId: number) => {
    return await db.delete(InsuranceTable)
        .where(sql`${InsuranceTable.insurance_id}=${insuranceId}`)
        .returning();
}