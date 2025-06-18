import { sql } from "drizzle-orm";
import db from "../drizzle/db";
import { CarTable } from "../drizzle/schema";
import { TICar } from "../types";

export const createCarService = async (car: TICar) => {
    const newCar = await db.insert(CarTable).values(car).returning();
    return newCar[0];
}

export const getCarService = async (carId: number) => {
    return await db.query.CarTable.findFirst({
        columns: {
            car_id: true,
            make: true,
            model: true,
            year: true,
            color: true,
            availability: true,
            rental_rate: true,
            location_id: true
        },
        where: sql`${CarTable.car_id}=${carId}`
    });
}

export const getAllCarsService = async () => {
    return await db.query.CarTable.findMany({
        columns: {
            car_id: true,
            make: true,
            model: true,
            year: true,
            color: true,
            availability: true,
            rental_rate: true,
            location_id: true
        }
    });
}

export const updateCarService = async (carId: number, car: Partial<TICar>) => {
    const updatedCar = await db.update(CarTable)
        .set(car)
        .where(sql`${CarTable.car_id}=${carId}`)
        .returning();
    return updatedCar[0];
}

export const deleteCarService = async (carId: number) => {
    return await db.delete(CarTable)
        .where(sql`${CarTable.car_id}=${carId}`)
        .returning();
}